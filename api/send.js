export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { type, text, photo } = req.body;

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Env variables missing' });
  }

  try {
    if (type === 'text') {
      const r = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
          })
        }
      );
      const data = await r.json();
      return res.json(data);
    }

    if (type === 'photo') {
      const r = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            photo: photo
          })
        }
      );
      const data = await r.json();
      return res.json(data);
    }

    return res.status(400).json({ error: 'Unknown type' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
