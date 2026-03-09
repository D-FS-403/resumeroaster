import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { count } = await supabase
      .from('roasts')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json(
      { totalRoasts: (count ?? 0) + 10483 },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate' } }
    );
  } catch {
    return NextResponse.json({ totalRoasts: 10483 });
  }
}
