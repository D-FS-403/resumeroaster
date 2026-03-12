import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';

const SYSTEM_PROMPT = `You are a resume bullet point improver. Your job is to take a weak resume bullet point and rewrite it using the XYZ formula:

ACCOMPLISHED [X] as measured by [Y], by doing [Z]

Rules:
1. Keep it to 1-2 sentences maximum
2. Always include specific numbers/metrics where possible (quantify impact)
3. Use strong action verbs (led, built, created, increased, reduced, optimized)
4. Remove buzzwords, jargon, and passive voice
5. Focus on results and measurable impact
6. Return ONLY the rewritten bullet point, no explanation, no markdown`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bullet, isPro } = body;

    if (!bullet || typeof bullet !== 'string') {
      return NextResponse.json({ error: 'Bullet point is required' }, { status: 400 });
    }

    const userMessage = `Original bullet:\n${bullet}`;
    const rewritten = await callClaude(SYSTEM_PROMPT, userMessage);

    return NextResponse.json({ rewritten: rewritten.trim() });
  } catch (error) {
    console.error('Rewrite API error:', error);
    return NextResponse.json({ error: 'Failed to rewrite bullet' }, { status: 500 });
  }
}
