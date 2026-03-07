import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ScoreCard from '@/components/ScoreCard';
import RoastCard from '@/components/RoastCard';
import ShareRoastButton from '@/components/ShareRoastButton';
import Link from 'next/link';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data: roast } = await supabase
        .from('roasts')
        .select('roast_headline, overall_score')
        .eq('id', params.id)
        .single();

    if (!roast) return { title: 'Roast Not Found' };

    const title = `Scored ${roast.overall_score}/100 — ResuméRoast 🔥`;
    const description = roast.roast_headline;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumeroaster.xyz';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: `${baseUrl}/roast/${params.id}/opengraph-image`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${baseUrl}/roast/${params.id}/opengraph-image`],
        },
    };
}

export default async function RoastPage({ params }: Props) {
    const { data: roast } = await supabase
        .from('roasts')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!roast) {
        notFound();
    }

    // Transform db snake_case back to camelCase expectation for types
    const resultData = {
        id: roast.id,
        overallScore: roast.overall_score,
        grade: roast.grade,
        roastHeadline: roast.roast_headline,
        badges: roast.badges,
        categories: roast.categories,
    };

    return (
        <main className="min-h-screen bg-[#0D0D0D] text-[#F5F0E8] font-inter selection:bg-[#FF3B30] selection:text-white pb-32">
            <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
                <ScoreCard result={resultData} />

                <div className="space-y-8">
                    <RoastCard result={resultData} />
                    <div className="flex justify-center mt-8">
                        <ShareRoastButton roastId={params.id} score={resultData.overallScore} headline={resultData.roastHeadline} />
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
                <div className="max-w-4xl mx-auto bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
                    <p className="font-playfair text-lg sm:text-xl font-bold italic">
                        Think your resume is better?
                    </p>
                    <Link href="/">
                        <button className="px-6 py-2 bg-[#FF3B30] hover:bg-[#ff5247] text-white font-mono font-bold rounded-lg transition-colors whitespace-nowrap">
                            Roast yours free →
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
