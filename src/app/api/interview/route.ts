import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert interviewer and career coach. Based on the resume provided, generate interview questions that the candidate is MOST LIKELY to be asked. Return ONLY valid JSON — no markdown, no backticks — with exactly this structure:

{
  "summary": "A 1-2 sentence overview of the candidate's profile",
  "questions": [
    {
      "question": "The interview question",
      "category": "behavioral" | "technical" | "situational" | "culture-fit",
      "difficulty": "easy" | "medium" | "hard",
      "why": "Why an interviewer would ask this based on the resume",
      "sampleAnswer": "A strong sample answer the candidate could give based on their experience",
      "tips": ["Tip 1 for answering well", "Tip 2"]
    }
  ],
  "weakSpots": ["Areas the candidate should prepare extra for"],
  "strengths": ["Areas where the candidate will naturally shine"]
}

Generate exactly 10 questions: 3 behavioral, 3 technical, 2 situational, 2 culture-fit. Make them SPECIFIC to this person's resume, not generic. The sample answers should reference actual experience from their resume. Return ONLY the raw JSON.`;

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: 'Resume text is required (minimum 50 characters)' },
        { status: 400 }
      );
    }

    const userMessage = `Resume to analyze:\n${resumeText}`;

    const rawText = await callGemini(SYSTEM_PROMPT, userMessage);
    const parsed = parseJSON(rawText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview questions. Please try again.' },
      { status: 500 }
    );
  }
}
