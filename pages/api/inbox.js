// pages/api/inbox.js
// Dashboard polls this every 5 seconds for new messages

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const KV_URL   = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ messages: [], configured: false });
  }

  try {
    // Use LRANGE to get the last 50 messages from the Redis list
    const r = await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["LRANGE", "fc_inbox_list", "0", "49"]),
    });

    const d = await r.json();
    console.log("Inbox LRANGE result count:", Array.isArray(d.result) ? d.result.length : 0);

    const rawList = Array.isArray(d.result) ? d.result : [];
    const messages = rawList.map(item => {
      try { return JSON.parse(item); } catch { return null; }
    }).filter(Boolean);

    const since = req.query.since;
    const filtered = since
      ? messages.filter(m => new Date(m.timestamp) > new Date(since))
      : messages;

    return res.status(200).json({ messages: filtered, configured: true });
  } catch(err) {
    console.error("Inbox error:", err.message);
    return res.status(500).json({ error: err.message, messages: [], configured: true });
  }
}
