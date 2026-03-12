import { NextRequest, NextResponse } from 'next/server';
import { JobMatchResult } from '@/types';
import { callClaude, parseJSON } from '@/lib/claude';

const SYSTEM_PROMPT = `You are an expert ATS and recruiter simulator. Compare the resume against the job description and return ONLY raw JSON (no markdown, no backticks) in exactly this structure:

{
  "matchScore": 75,
  "verdict": "Solid foundation, but missing critical cloud architecture keywords.",
  "presentKeywords": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["AWS", "Docker", "Kubernetes"],
  "skillGaps": [
    {
      "skill": "AWS",
      "importance": "critical",
      "suggestion": "Highlight any AWS experience, even if it's just conceptual or side projects."
    }
  ],
  "tailoringTips": [
    {
      "section": "Experience",
      "tip": "Rewrite bullet 3 to emphasize microservices instead of monorepos."
    }
  ]
}

Rules:
1. matchScore must be an integer between 0 and 100.
2. verdict must be one punchy sentence about fit.
3. presentKeywords maximum 10 items.
4. missingKeywords maximum 10 items.
5. skillGaps importance MUST BE one of exactly: "critical", "important", "nice-to-have".
6. tailoringTips maximum 5 tips.
7. Return ONLY the raw JSON string. Do not wrap in markdown or backticks.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resume text and job description are required' },
        { status: 400 }
      );
    }

    if (resumeText.length < 50 || jobDescription.length < 50) {
      return NextResponse.json(
        { error: 'Inputs are too short. Please provide meaningful content.' },
        { status: 400 }
      );
    }

    const userMessage = `=== RESUME ===\n${resumeText}\n\n=== JOB DESCRIPTION ===\n${jobDescription}`;

    let parsedResult: JobMatchResult;
    try {
      const text = await callClaude(SYSTEM_PROMPT, userMessage);
      parsedResult = parseJSON<JobMatchResult>(text);
    } catch (parseError) {
      console.error('Failed to parse Claude output:', parseError);
      return NextResponse.json(
        { error: 'Failed to process the match due to an unexpected AI response.' },
        { status: 500 }
      );
    }

    if (typeof parsedResult.matchScore !== 'number') {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Match API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job match. Please try again.' },
      { status: 500 }
    );
  }
}
