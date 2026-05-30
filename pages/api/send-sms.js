// pages/api/send-sms.js
// Sends outbound RSVP texts to guests via Twilio

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { guests, weddingContext } = req.body;

  if (!guests || !Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({ error: "No guests provided" });
  }

  const accountSid  = process.env.TWILIO_ACCOUNT_SID;
  const authToken   = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber  = process.env.TWILIO_PHONE_NUMBER;
  const webhookBase = process.env.NEXT_PUBLIC_BASE_URL || "https://getfinalcount.com";

  if (!accountSid || !authToken || !fromNumber) {
    return res.status(500).json({ error: "Twilio credentials not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your Vercel environment variables." });
  }

  const coupleNames = [weddingContext?.bride, weddingContext?.groom].filter(Boolean).join(" & ") || "the couple";
  const weddingDate = weddingContext?.date
    ? new Date(weddingContext.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";
  const events = (weddingContext?.events || []).join(", ");
  const tone   = weddingContext?.tone || "warm";

  const toneMap = {
    warm:   "warm and friendly",
    formal: "professional and elegant",
    casual: "relaxed and conversational",
    fun:    "playful and cheerful",
  };
  const toneDesc = toneMap[tone] || "warm and friendly";

  const results = [];

  for (const guest of guests) {
    if (!guest.phone) {
      results.push({ id: guest.id, name: guest.name, success: false, error: "No phone number" });
      continue;
    }

    try {
      // Generate personalized opening message via Claude
      const systemPrompt = `You are FinalCount, a ${toneDesc} AI wedding RSVP assistant texting on behalf of ${coupleNames}${weddingDate ? ` whose wedding is on ${weddingDate}` : ""}${weddingContext?.venue ? ` at ${weddingContext.venue}` : ""}. You are texting their guest: ${guest.name}.
${events ? `\nThe wedding has these events: ${events}.` : ""}
${weddingContext?.customOpening ? `\nUse this opening message verbatim: ${weddingContext.customOpening}` : ""}

Write a single warm, personalized SMS opening message asking if they can attend. Keep it under 160 characters if possible. No JSON needed — just the message text. Address them by first name.`;

      const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 200,
          system: systemPrompt,
          messages: [{ role: "user", content: "Send the opening RSVP message now." }],
        }),
      });

      const aiData = await aiRes.json();
      const messageBody = aiData.content?.[0]?.text?.trim() ||
        `Hi ${guest.name.split(" ")[0]}! ${coupleNames} are finalizing RSVPs${weddingDate ? ` for their wedding on ${weddingDate}` : ""}. Will you be joining us? Reply to let us know!`;

      // Send via Twilio REST API (no SDK needed)
      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: fromNumber,
            To:   guest.phone,
            Body: messageBody,
          }),
        }
      );

      const twilioData = await twilioRes.json();

      if (twilioRes.ok && twilioData.sid) {
        results.push({
          id:      guest.id,
          name:    guest.name,
          success: true,
          sid:     twilioData.sid,
          message: messageBody,
        });
      } else {
        results.push({
          id:      guest.id,
          name:    guest.name,
          success: false,
          error:   twilioData.message || "Twilio error",
        });
      }
    } catch (err) {
      results.push({ id: guest.id, name: guest.name, success: false, error: err.message });
    }

    // Small delay between messages to avoid rate limiting
    await new Promise(r => setTimeout(r, 150));
  }

  const sent   = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return res.status(200).json({ sent, failed, results });
}
