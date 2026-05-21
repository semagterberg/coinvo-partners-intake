export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: {
          type: 'data_source_id',
          data_source_id: process.env.NOTION_DATA_SOURCE_ID
        },
        properties: {
          Applicant: {
            title: [{
              text: {
                content: body.project_name || 'New submission'
              }
            }]
          },
          'Project Name': {
            rich_text: [{
              text: {
                content: body.project_name || ''
              }
            }]
          },
          'Website or X Link': {
            url: body.website_or_x_link || null
          },
          'Campaign Type': {
            rich_text: [{
              text: {
                content: body.campaign_type || ''
              }
            }]
          },
          'Budget Range': {
            rich_text: [{
              text: {
                content: body.budget_range || ''
              }
            }]
          },
          'Payment Type': {
            rich_text: [{
              text: {
                content: body.payment_type || ''
              }
            }]
          },
          'Primary Goal': {
            rich_text: [{
              text: {
                content: body.primary_goal || ''
              }
            }]
          },
          'Telegram or Email': {
            rich_text: [{
              text: {
                content: body.telegram_or_email || ''
              }
            }]
          }
        }
      })
    });

    if (!notionResponse.ok) {
      const error = await notionResponse.text();
      return res.status(500).json({ error });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
