const richText = (value) => [{ text: { content: String(value || '') } }];
const selectValue = (value) => value ? { name: String(value).replace(' · Most picked', '').replace(' · Best for launches', '').trim() } : null;
const dateValue = (value) => value ? { start: String(value) } : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const submittedAt = body.submitted_at || new Date().toISOString();
    const applicationId = body.id || `coinvo-${Date.now()}`;

    const properties = {
      Applicant: {
        title: richText(body.project_name || 'New submission')
      },
      'Project Name': {
        rich_text: richText(body.project_name)
      },
      'Website or X Link': {
        url: body.website_or_x_link || null
      },
      'Campaign Type': {
        select: selectValue(body.campaign_type)
      },
      'Budget Range': {
        select: selectValue(body.budget_range)
      },
      'Payment Type': {
        select: selectValue(body.payment_type)
      },
      'Primary Goal': {
        select: selectValue(body.primary_goal)
      },
      'Campaign Context': {
        rich_text: richText(body.campaign_context)
      },
      'Expected Outcome': {
        rich_text: richText(body.expected_outcome)
      },
      'Telegram or Email': {
        rich_text: richText(body.telegram_or_email)
      },
      'First Name': {
        rich_text: richText(body.first_name)
      },
      'Application ID': {
        rich_text: richText(applicationId)
      },
      'Submitted At': {
        date: dateValue(submittedAt)
      },
      'Status': {
        status: { name: 'Not started' }
      },
      'Source': {
        rich_text: richText(body.source || 'Coinvo Partnership Intake')
      },
      'Follow Up Needed': {
        checkbox: true
      },
      'Telegram Notified': {
        checkbox: false
      }
    };

    if (body.launch_date) {
      properties['Launch Date'] = { date: dateValue(body.launch_date) };
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
