import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ScoreHistoryGraph from '@/components/ScoreHistoryGraph';
import RoastHistoryCard from '@/components/RoastHistoryCard';

export const revalidate = 0; // Dynamic page

export default async function DashboardPage() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        redirect('/');
        return null;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', session.user.id)
        .single();

    const { data: roasts, error } = await supabase
        .from('roasts')
        .select('id, overall_score, grade, roast_headline, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true }); // chronological

    if (error) {
        console.error('Error fetching history:', error);
    }

    const finalRoasts = roasts || [];

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5F0E8] font-inter selection:bg-[#FF3B30] selection:text-white pb-32">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="ResuméRoast" className="w-8 h-8 rounded-lg object-cover" />
                        <h1 className="font-playfair text-2xl font-bold tracking-tight">
                            Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
                        </h1>
                    </a>

                    <div className="hidden md:flex items-center gap-8 font-mono text-sm text-white/60">
                        <a href="/dashboard" className="hover:text-white transition-colors text-white font-bold">Dashboard</a>
                        <a href="/match" className="hover:text-white transition-colors">Job Match</a>
                        <a href="/" className="hover:text-white transition-colors text-[#FF3B30]">New Roast</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline font-mono text-xs text-white/40">
                            {session.user.email}
                        </span>
                        {profile?.is_pro && (
                            <span className="px-2 py-0.5 bg-[#FF9500] text-black text-[10px] font-bold rounded uppercase tracking-tighter">
                                PRO
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-40 px-6 max-w-5xl mx-auto space-y-16">

                {/* Header Section */}
                <div>
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-4">Your Career Trajectory</h2>
                    <p className="font-mono text-sm text-white/40 max-w-xl leading-relaxed uppercase tracking-widest">
                        {finalRoasts.length} Roast{finalRoasts.length !== 1 ? 's' : ''} Analyzed
                    </p>
                </div>

                {/* Interactive Graph Section */}
                {finalRoasts.length > 0 && (
                    <div className="glass-card rounded-[3rem] p-6 lg:p-10 bg-black/40 border-white/5">
                        <h3 className="font-mono border-b border-white/5 pb-4 text-xs font-bold uppercase tracking-widest text-white/50 mb-8">Score History</h3>
                        <ScoreHistoryGraph data={finalRoasts} />
                    </div>
                )}

                {/* History List */}
                <div>
                    <h3 className="font-mono border-b border-white/5 pb-4 text-xs font-bold uppercase tracking-widest text-white/50 mb-8">Timeline</h3>

                    {finalRoasts.length === 0 ? (
                        <div className="text-center py-20 px-4 glass-card rounded-[2rem] border border-white/5">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">📄</span>
                            </div>
                            <h4 className="font-playfair text-2xl font-bold text-white mb-2">No roasts yet</h4>
                            <p className="font-mono text-sm text-white/40 mb-8">Upload your first resume to start tracking your progress.</p>
                            <a
                                href="/"
                                className="px-8 py-3 rounded-xl bg-[#FF3B30] text-white font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#ff5247] transition-all"
                            >
                                Start Roasting
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Reverse the array to show newest first in the list, while graph is chronological */}
                            {[...finalRoasts].reverse().map(roast => (
                                <RoastHistoryCard key={roast.id} roast={roast} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
