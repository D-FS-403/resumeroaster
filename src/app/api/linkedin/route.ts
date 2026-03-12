import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseJSON } from '@/lib/gemini';

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

export async function POST(request: NextRequest) {
  try {
    const { profileText } = await request.json();

    if (!profileText || profileText.length < 100) {
      return NextResponse.json(
        { error: 'Profile text is required (minimum 100 characters)' },
        { status: 400 }
      );
    }

    const userMessage = `LinkedIn profile to analyze:\n${profileText}`;

    const rawText = await callGemini(SYSTEM_PROMPT, userMessage);
    const parsed = parseJSON(rawText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze LinkedIn profile. Please try again.' },
      { status: 500 }
    );
  }
}
