import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    // TODO: In production, verify isPro via server session to prevent abuse
    // For now, we accept the client-side flag but could add server-side validation

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `${SYSTEM_PROMPT}\n\nOriginal bullet:\n${bullet}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.status}`);
    }

    const data = await response.json();
    const rewritten = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return NextResponse.json({ rewritten });
  } catch (error) {
    console.error('Rewrite API error:', error);
    return NextResponse.json({ error: 'Failed to rewrite bullet' }, { status: 500 });
  }
}
