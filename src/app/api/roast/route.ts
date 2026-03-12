import { NextRequest, NextResponse } from 'next/server';
import { RoastResult } from '@/lib/pdfExtractor';
import { callClaude, parseJSON } from '@/lib/claude';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const SYSTEM_PROMPT = `You are a brutally honest but entertaining resume critic. Analyze the resume text and return ONLY a valid JSON object — no markdown, no backticks, no explanation, just raw JSON — with exactly this structure:

{
  "overallScore": 42,
  "grade": "D",
  "roastHeadline": "One savage but constructive headline about this resume",
  "badges": ["📊 Data Allergic", "🤖 ATS Nightmare"],
  "categories": [
    {
      "name": "Impact",
      "score": 30,
      "grade": "F",
      "roastLine": "Funny but true one-liner about this category",
      "tip": "One specific actionable fix"
    }
  ]
}

Score these 5 categories: Impact (quantified achievements vs vague duties), Clarity (no jargon or passive voice), ATS Readiness (keyword density and formatting), Relevance (current market fit, outdated skills), Originality (avoid clichés like 'results-driven'). Be funny but genuinely helpful. Return ONLY the raw JSON.`;

async function parseWithRetry(userMessage: string, retries = 3): Promise<RoastResult> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const text = await callClaude(SYSTEM_PROMPT, userMessage);
      const parsed = parseJSON<RoastResult>(text);

      if (parsed.overallScore && parsed.grade && parsed.roastHeadline && parsed.categories) {
        return parsed;
      }

      throw new Error('Invalid JSON structure');
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === retries - 1) throw error;
    }
  }

  throw new Error('Failed to parse after retries');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, userId, email } = body;

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    if (resumeText.length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please upload a complete resume.' },
        { status: 400 }
      );
    }

    // Extract client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const rawIp = forwarded
      ? forwarded.split(',')[0].trim()
      : (request.headers.get('x-real-ip') ?? '127.0.0.1');
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');

    // IP-based rate limiting for anonymous (non-pro) users only
    if (!userId) {
      try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: recentCount } = await supabase
          .from('roasts')
          .select('*', { count: 'exact', head: true })
          .eq('ip_hash', ipHash)
          .gte('created_at', sevenDaysAgo);

        if ((recentCount ?? 0) >= 3) {
          return NextResponse.json(
            { error: 'Free limit reached. Upgrade to Pro for unlimited roasts.' },
            { status: 429 }
          );
        }
      } catch (err) {
        console.warn('IP rate limit check failed (column may not exist):', err);
      }
    }

    const userMessage = `Resume text to analyze:\n${resumeText}`;
    const parsedResult = await parseWithRetry(userMessage);

    // Save to Supabase
    const { data: roastData, error: dbError } = await supabase
      .from('roasts')
      .insert([
        {
          user_id: userId || null,
          overall_score: parsedResult.overallScore,
          grade: parsedResult.grade,
          roast_headline: parsedResult.roastHeadline,
          badges: parsedResult.badges,
          categories: parsedResult.categories,
          is_anonymous: !userId,
          ip_hash: ipHash,
        }
      ])
      .select('id')
      .single();

    if (dbError) {
      console.error('Failed to save to Supabase:', dbError);
      return NextResponse.json(parsedResult);
    }

    // Save to leads if email is provided
    if (email) {
      await supabase.from('leads').insert([
        {
          email: email.trim(),
          roast_id: roastData.id
        }
      ]);
    }

    const resultWithId = { ...parsedResult, id: roastData.id };
    return NextResponse.json(resultWithId);
  } catch (error) {
    console.error('Roast API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}
