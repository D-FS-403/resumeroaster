import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const score = parseInt(request.nextUrl.searchParams.get('score') || '0');

  try {
    // Count roasts with lower score
    const { count: lowerCount } = await supabase
      .from('roasts')
      .select('*', { count: 'exact', head: true })
      .lt('overall_score', score);

    // Count total roasts
    const { count: totalCount } = await supabase
      .from('roasts')
      .select('*', { count: 'exact', head: true });

    const total = (totalCount ?? 0) + 10483;
    const lower = (lowerCount ?? 0) + Math.floor(10483 * (score / 100));
    const percentile = total > 0 ? Math.round((lower / total) * 100) : 50;

    return NextResponse.json(
      { percentile: Math.min(99, Math.max(1, percentile)) },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate' } }
    );
  } catch {
    // Fallback: estimate percentile based on score distribution
    const percentile = Math.round(score * 0.85);
    return NextResponse.json({ percentile: Math.min(99, Math.max(1, percentile)) });
  }
}
