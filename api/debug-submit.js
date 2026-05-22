export default async function handler(req, res) {
  try {
    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DATA_SOURCE_ID },
        properties: {
          Applicant: {
            title: [{ text: { content: `DEBUG TEST ${Date.now()}` } }]
          }
        }
      })
    });

    const text = await notionResponse.text();
    return res.status(notionResponse.status).json({ ok: notionResponse.ok, status: notionResponse.status, body: text });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
