// pages/api/sms-webhook.js
// Receives incoming SMS from guests via Twilio webhook

export default async function handler(req, res) {
  // Always return valid TwiML so Twilio doesn't keep retrying
  function twimlOk() {
    res.setHeader("Content-Type", "text/xml");
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  }

  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  console.log("SMS webhook received. Body:", JSON.stringify(req.body));

  const from    = req.body?.From;
  const msgBody = req.body?.Body;

  if (!from || !msgBody) {
    console.error("Missing From or Body:", JSON.stringify(req.body));
    return twimlOk();
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // ── KV helpers (Upstash Redis REST API) ──────────────────────────────────
  const KV_URL   = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  async function kvGet(key) {
    try {
      if (!KV_URL || !KV_TOKEN) return null;
      const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
      const d = await r.json();
      return d.result ? JSON.parse(d.result) : null;
    } catch(e) { console.error("KV get error:", e.message); return null; }
  }

  async function kvSet(key, value) {
    try {
      if (!KV_URL || !KV_TOKEN) return;
      await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([JSON.stringify(value)]),
      });
    } catch(e) { console.error("KV set error:", e.message); }
  }

  // ── Load conversation history ─────────────────────────────────────────────
  const phoneKey = from.replace(/\D/g, "");
  const stored   = await kvGet(`convo_${phoneKey}`) || {};
  const conversationHistory = stored.history || [];
  const guestName = stored.guestName || from;
  const weddingContext = stored.weddingContext || {};

  // Add guest message to history
  conversationHistory.push({ role: "user", content: msgBody });

  // ── Generate AI response ──────────────────────────────────────────────────
  const firstName   = guestName.split(" ")[0] || "there";
  const coupleNames = [weddingContext?.bride, weddingContext?.groom].filter(Boolean).join(" & ") || "the couple";
  const weddingDate = weddingContext?.date
    ? new Date(weddingContext.date + "T12:00:00").toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" })
    : "";
  const events = (weddingContext?.events || []).join(", ");
  const toneMap = { warm:"warm and friendly", formal:"professional and elegant", casual:"relaxed and conversational", fun:"playful and cheerful" };
  const toneDesc = toneMap[weddingContext?.tone || "warm"] || "warm and friendly";

  const systemPrompt = `You are FinalCount, a ${toneDesc} AI wedding RSVP assistant texting on behalf of ${coupleNames}${weddingDate ? ` whose wedding is on ${weddingDate}` : ""}. You are texting their guest: ${guestName}.
${events ? `\nThe wedding has these events: ${events}.` : ""}

Your job:
- Understand the guest's reply — they may confirm, decline, mention plus-ones, dietary needs, or event-specific attendance
- Reply warmly and concisely — this is SMS, keep it under 160 characters when possible
- After your reply, on the very last line append a JSON status update (no markdown, no backticks):
{"status":"Confirmed","events":"All events","dietary":"None","plusOne":"No"}

Use "Confirmed", "Declined", or "Pending". Use "None" / "No" when not mentioned.
Address the guest by their first name: ${firstName}.`;

  let aiReplyText = `Thanks for getting back to us! We've noted your response.`;
  let parsedStatus = null;

  try {
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemPrompt,
        messages: conversationHistory,
      }),
    });
    const aiData = await aiRes.json();
    const raw    = aiData.content?.[0]?.text?.trim() || "";
    const lines  = raw.split("\n");
    const last   = lines[lines.length - 1].trim();
    try { parsedStatus = JSON.parse(last); } catch {}
    aiReplyText = parsedStatus ? lines.slice(0, -1).join("\n").trim() : raw;
    console.log("AI reply:", aiReplyText, "Parsed:", JSON.stringify(parsedStatus));
  } catch(e) {
    console.error("Claude error:", e.message);
  }

  conversationHistory.push({ role: "assistant", content: aiReplyText });

  // ── Save conversation history ─────────────────────────────────────────────
  await kvSet(`convo_${phoneKey}`, {
    history: conversationHistory,
    guestName,
    weddingContext,
    parsedStatus,
    lastUpdated: new Date().toISOString(),
  });

  // ── Save to inbox for dashboard Live Conversations tab ───────────────────
  const inbox = await kvGet("fc_inbox") || [];
  inbox.unshift({
    from,
    guestName,
    message: msgBody,
    reply: aiReplyText,
    parsedStatus,
    timestamp: new Date().toISOString(),
  });
  await kvSet("fc_inbox", inbox.slice(0, 500));
  console.log("Saved to inbox. Inbox length:", inbox.length + 1);

  // ── Send AI reply back via Twilio ─────────────────────────────────────────
  try {
    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: fromNumber, To: from, Body: aiReplyText }),
      }
    );
    const twilioData = await twilioRes.json();
    if (!twilioRes.ok) {
      console.error("Twilio reply error:", JSON.stringify(twilioData));
    } else {
      console.log("Reply sent via Twilio. SID:", twilioData.sid);
    }
  } catch(e) {
    console.error("Twilio send error:", e.message);
  }

  return twimlOk();
}

export const config = {
  api: { bodyParser: true },
};
