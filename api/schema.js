export default async function handler(req, res) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATA_SOURCE_ID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });
    const data = await response.json();
    const properties = {};
    for (const [name, prop] of Object.entries(data.properties || {})) {
      properties[name] = prop.type;
    }
    return res.status(response.status).json({ ok: response.ok, id: data.id, title: data.title, properties, raw_error: data.message || null });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
