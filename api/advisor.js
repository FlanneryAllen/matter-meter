// Vercel serverless function. Keeps your Anthropic API key off the browser.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

const clip = (value, max = 600) => String(value ?? '').slice(0, max);

const prompts = {
  strategist: (c) => `You are a strategic communications advisor. A creative professional needs context on this project decision's broader implications.

CONTEXT:
- Project: "${c.project}"
- Their priority: ${c.priority}
- Matter Meter recommendation: ${c.recommendation}
- Who wants this to succeed: ${c.politicalBacking}
- Who will see it: ${c.executiveVisibility}
- Connection to company strategy: ${c.strategicAlignment}

Provide strategic context in 2-3 concise paragraphs covering:
1. What this decision means: broader organizational and career implications beyond the immediate project
2. What they might not be seeing: hidden dynamics, longer-term consequences
3. Positioning: how this fits their professional development and organizational relationships

Write in Seth Godin's style: direct, insightful, actionable. Plain paragraphs, no headers, no bullet lists.`,

  riskAnalyst: (c) => `You are a risk assessment specialist. Focus on potential downsides and mitigation for this project.

PROJECT: "${c.project}"
- Who wants this to succeed: ${c.politicalBacking}
- What happens if they don't do it: ${c.consequences}
- Timeline driver: ${c.timeline}
- Effort: ${c.effort}
- Current bandwidth: ${c.bandwidth}

Provide a frank risk assessment in 2-3 concise paragraphs:
1. Primary risks: what could go wrong, specifically
2. Mitigation: how to minimize the biggest risks
3. Warning signs: what to watch for

Be direct and analytical, realistic but not alarmist. Plain paragraphs, no headers, no bullet lists.`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
  }

  const { agent, context } = req.body || {};
  const build = prompts[agent];
  if (!build || !context || typeof context !== 'object') {
    return res.status(400).json({ error: 'Bad request' });
  }

  const safe = Object.fromEntries(
    Object.entries(context).map(([k, v]) => [k, clip(v, k === 'project' ? 1000 : 200)])
  );

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        messages: [{ role: 'user', content: build(safe) }],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({ error: data?.error?.message || 'Upstream error' });
    }

    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: 'Request failed' });
  }
}
