export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Only POST allowed' })
    };
  }

  const { type, text, photo } = JSON.parse(event.body);
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Env variables missing' })
    };
  }

  try {
    let url, body;

    if (type === 'text') {
      url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      body = { chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' };
    } else if (type === 'photo') {
      url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
      body = { chat_id: CHAT_ID, photo: photo };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Unknown type' })
      };
    }

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
