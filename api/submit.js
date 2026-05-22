const text = (value) => [{ text: { content: String(value || '') } }];
const select = (value) => value ? { name: String(value) } : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const submittedAt = body.submitted_at || new Date().toISOString();

    const properties = {
      Applicant: {
        title: text(body.project_name || 'New submission')
      },
      'Project Name': {
        rich_text: text(body.project_name)
      },
      'Website or X Link': {
        url: body.website_or_x_link || null
      },
      'Campaign Type': {
        select: select(body.campaign_type)
      },
      'Budget Range': {
        select: select(body.budget_range)
      },
      'Payment Type': {
        select: select(body.payment_type)
      },
      'Primary Goal': {
        select: select(body.primary_goal)
      },
      'Telegram or Email': {
        rich_text: text(body.telegram_or_email)
      },
      'First Name': {
        rich_text: text(body.first_name)
      },
      'Notes': {
        rich_text: text(body.campaign_context)
      },
      'Expected Outcome': {
        rich_text: text(body.expected_outcome)
      },
      'Application ID': {
        rich_text: text(body.id || `coinvo-${Date.now()}`)
      },
      'Submitted At': {
        date: { start: submittedAt }
      },
      'Status': {
        status: { name: 'Not started' }
      },
      'Source': {
        select: select(body.source || 'Coinvo Partnership Intake')
      },
      'Follow Up Needed': {
        checkbox: true
      },
      'Telegram Notified': {
        checkbox: false
      }
    };

    if (body.launch_date) {
      properties['Launch Date'] = { date: { start: body.launch_date } };
    }

    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: {
          database_id: process.env.NOTION_DATA_SOURCE_ID
        },
        properties
      })
    });

    const responseText = await notionResponse.text();

    if (!notionResponse.ok) {
      return res.status(500).json({ error: responseText });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
