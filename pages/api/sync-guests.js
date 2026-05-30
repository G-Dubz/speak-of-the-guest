// pages/api/sync-guests.js
// Called whenever the guest list changes — stores a phone→name lookup in KV
// so the SMS webhook can resolve phone numbers to guest names

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { guests, userEmail } = req.body;
  if (!guests || !Array.isArray(guests)) return res.status(400).json({ error: "No guests provided" });

  const KV_URL   = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) return res.status(200).json({ ok: true, skipped: true });

  try {
    // Build a map of normalized phone → guest name
    const phoneBook = {};
    guests.forEach(g => {
      if (g.phone) {
        const normalized = g.phone.replace(/\D/g, "");
        if (normalized) phoneBook[normalized] = g.name;
      }
    });

    await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", `fc_phonebook_${userEmail.replace(/[^a-z0-9]/gi,"_")}`, JSON.stringify(phoneBook)]),
    });

    // Also store a global phonebook (merged) for the webhook
    const globalRes = await fetch(KV_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["GET", "fc_phonebook_global"]),
    });
    const globalData = await globalRes.json();
    const existing = globalData.result ? JSON.parse(globalData.result) : {};
    const merged = { ...existing, ...phoneBook };

    await fetch(KV_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", "fc_phonebook_global", JSON.stringify(merged)]),
    });

    return res.status(200).json({ ok: true, count: Object.keys(phoneBook).length });
  } catch(e) {
    console.error("Sync guests error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
