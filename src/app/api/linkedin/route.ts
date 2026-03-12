import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const SYSTEM_PROMPT = `You are a LinkedIn profile expert and recruiter. Analyze the LinkedIn profile text provided and return ONLY valid JSON — no markdown, no backticks — with exactly this structure:

{
  "overallScore": 72,
  "grade": "C+",
  "profileHeadline": "One sharp one-liner verdict about this LinkedIn profile",
  "badges": ["🔍 Invisible to Recruiters", "📝 Boring Headline"],
  "categories": [
    {
      "name": "Headline",
      "score": 45,
      "grade": "D",
      "roastLine": "Witty critique of this section",
      "tip": "One specific actionable improvement"
    }
  ],
  "quickWins": ["3-5 specific changes to make TODAY that will boost profile views"],
  "recruitersWillThink": "A candid 2-sentence assessment of first impressions a recruiter would have"
}

Score these 5 categories:
1. Headline (does it hook recruiters? specific role + value prop vs generic "Looking for opportunities")
2. About/Summary (storytelling, keywords, call to action vs empty or robotic)
3. Experience (quantified achievements vs vague job duties, strong action verbs)
4. Skills & Keywords (relevant to current market, ATS-friendly keyword density)
5. Profile Completeness (photo mentioned? recommendations? featured section? engagement signals?)

Be specific, funny, and genuinely helpful. Return ONLY raw JSON.`;

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
    const { profileText } = await request.json();

    if (!profileText || profileText.length < 100) {
      return NextResponse.json(
        { error: 'Profile text is required (minimum 100 characters)' },
        { status: 400 }
      );
    }

    const prompt = `${SYSTEM_PROMPT}\n\nLinkedIn profile to analyze:\n${profileText}`;

    const rawText = await callGeminiWithRetry(prompt);
    const cleaned = stripMarkdown(rawText);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze LinkedIn profile. Please try again.' },
      { status: 500 }
    );
  }
}
