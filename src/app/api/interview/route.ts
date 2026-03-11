import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Use the lite model (higher rate limits on free tier)
const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

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

function stripMarkdown(jsonString: string): string {
  let cleaned = jsonString.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```$/i, '');
  return cleaned;
}

async function callGeminiWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }

        // 429 = rate limited — wait and retry with exponential backoff
        if (response.status === 429) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
          console.warn(`Model ${model} rate limited (attempt ${attempt + 1}), waiting ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        // Other errors — try next model
        console.warn(`Model ${model} returned ${response.status}, trying next model...`);
        break;
      } catch (err) {
        console.error(`Model ${model} attempt ${attempt + 1} failed:`, err);
        if (attempt === maxRetries - 1) break;
      }
    }
  }

  throw new Error('All Gemini models failed. Please try again in a moment.');
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: 'Resume text is required (minimum 50 characters)' },
        { status: 400 }
      );
    }

    const prompt = `${SYSTEM_PROMPT}\n\nResume to analyze:\n${resumeText}`;

    const rawText = await callGeminiWithRetry(prompt);
    const cleaned = stripMarkdown(rawText);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview questions. Please try again.' },
      { status: 500 }
    );
  }
}
