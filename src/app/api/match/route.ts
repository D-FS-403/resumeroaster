import { NextRequest, NextResponse } from 'next/server';
import { JobMatchResult } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are an expert ATS and recruiter simulator. Compare the resume against the job description and return ONLY raw JSON (no markdown, no backticks, no markdown blocks like \`\`\`json) in exactly this structure:

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

function stripMarkdown(jsonString: string): string {
    let cleaned = jsonString.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/i, '');
    cleaned = cleaned.replace(/```$/i, '');
    return cleaned;
}

async function callGemini(prompt: string): Promise<string> {
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Gemini API error response:', errorBody);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

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

        const prompt = `${SYSTEM_PROMPT}\n\n=== RESUME ===\n${resumeText}\n\n=== JOB DESCRIPTION ===\n${jobDescription}`;

        let parsedResult: JobMatchResult;
        try {
            const text = await callGemini(prompt);
            const cleanedText = stripMarkdown(text);
            parsedResult = JSON.parse(cleanedText) as JobMatchResult;
        } catch (parseError) {
            console.error('Failed to parse Gemini output:', parseError);
            return NextResponse.json(
                { error: 'Failed to process the match due to an unexpected AI response.' },
                { status: 500 }
            );
        }

        // Validate the parsed structure loosely
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
