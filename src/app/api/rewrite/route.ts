import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a resume bullet point improver. Your job is to take a weak resume bullet point and rewrite it to be more impactful, quantified, and action-oriented.

Rules:
1. Keep it to 1-2 sentences maximum
2. Add specific numbers/metrics where possible
3. Use strong action verbs
4. Remove buzzwords and jargon
5. Focus on results and impact
6. Return ONLY the rewritten bullet point, no explanation, no markdown`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bullet } = body;

    if (!bullet || typeof bullet !== 'string') {
      return NextResponse.json({ error: 'Bullet point is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `${SYSTEM_PROMPT}\n\nOriginal bullet:\n${bullet}`;
    
    const result = await model.generateContent(prompt);
    const rewritten = result.response.text().trim();

    return NextResponse.json({ rewritten });
  } catch (error) {
    console.error('Rewrite API error:', error);
    return NextResponse.json({ error: 'Failed to rewrite bullet' }, { status: 500 });
  }
}
