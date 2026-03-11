import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are an expert cover letter writer. Given a resume and job description, write a compelling, personalized cover letter. Return ONLY valid JSON — no markdown, no backticks — with exactly this structure:

{
  "coverLetter": "The full cover letter text with proper paragraphs separated by \\n\\n",
  "tone": "professional" | "enthusiastic" | "confident",
  "keyConnections": [
    {
      "resumeSkill": "What from their resume you highlighted",
      "jobRequirement": "What job requirement it matches",
      "howUsed": "How you connected them in the letter"
    }
  ],
  "wordCount": 250,
  "tips": ["Personalization tip 1", "Tip 2 for making it even stronger"]
}

Rules:
- Keep it under 300 words
- Never use "I am writing to apply for..." as the opener
- Start with a compelling hook
- Reference specific achievements from the resume that match job requirements
- End with a confident call to action
- Sound human, not AI-generated
- Use the candidate's actual experience, not generic fluff
Return ONLY the raw JSON.`;

function stripMarkdown(jsonString: string): string {
  let cleaned = jsonString.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```$/i, '');
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, companyName } = await request.json();

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const prompt = `${SYSTEM_PROMPT}\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}${companyName ? `\n\nCompany Name: ${companyName}` : ''}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = stripMarkdown(rawText);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Cover letter API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    );
  }
}
