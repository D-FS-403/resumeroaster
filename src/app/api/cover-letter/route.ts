import { NextRequest, NextResponse } from 'next/server';
import { callClaude, parseJSON } from '@/lib/claude';

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

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, companyName } = await request.json();

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const userMessage = `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}${companyName ? `\n\nCompany Name: ${companyName}` : ''}`;

    const rawText = await callClaude(SYSTEM_PROMPT, userMessage);
    const parsed = parseJSON(rawText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Cover letter API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    );
  }
}
