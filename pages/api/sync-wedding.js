// pages/api/sync-wedding.js
// Stores wedding context (venue, date, events, tone) in KV
// so the SMS webhook can answer questions like "Where's the wedding?"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { wedding, userEmail } = req.body;
  if (!wedding) return res.status(400).json({ error: "No wedding data provided" });

  const KV_URL   = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) return res.status(200).json({ ok: true, skipped: true });

  try {
    await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", "fc_wedding_context", JSON.stringify(wedding)]),
    });

    return res.status(200).json({ ok: true });
  } catch(e) {
    console.error("Sync wedding error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
