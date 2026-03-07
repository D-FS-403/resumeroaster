'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import JobMatchUploader from '@/components/JobMatchUploader';
import JobMatchResults from '@/components/JobMatchResults';
import UpgradeModal from '@/components/UpgradeModal';
import AuthForm from '@/components/AuthForm';
import { JobMatchResult } from '@/types';

export default function MatchPage() {
    const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
    const [isPro, setIsPro] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data } = await supabase
                    .from('users')
                    .select('is_pro')
                    .eq('id', session.user.id)
                    .single();
                setIsPro(data?.is_pro || false);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAnalyzeReady = async (resumeText: string, jobDescription: string) => {
        const response = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText, jobDescription }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Match analysis failed');
        }

        const result = await response.json();
        setMatchResult(result);
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5F0E8] font-inter selection:bg-[#FF3B30] selection:text-white pb-32">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <motion.a
                        href="/"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,59,48,0.4)]">
                            R
                        </div>
                        <h1 className="font-playfair text-2xl font-bold tracking-tight">
                            Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
                        </h1>
                    </motion.a>

                    <div className="hidden md:flex items-center gap-8 font-mono text-sm text-white/60">
                        <a href="/#how-it-works" className="hover:text-white transition-colors">How it works</a>
                        <a href="/match" className="hover:text-white transition-colors text-[#34C759] font-bold">Job Match</a>
                        <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="/" className="hover:text-white transition-colors text-[#FF3B30] font-bold">Roast Me</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="hidden sm:inline font-mono text-xs text-white/40">
                                    {user.email}
                                </span>
                                {isPro && (
                                    <span className="px-2 py-0.5 bg-[#FF9500] text-black text-[10px] font-bold rounded uppercase tracking-tighter">
                                        PRO
                                    </span>
                                )}
                                <button
                                    onClick={() => supabase.auth.signOut()}
                                    className="font-mono text-xs text-white/60 hover:text-white"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs hover:bg-white/10 transition-all hover:border-white/20"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-40 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#34C759]/10 border border-[#34C759]/20 backdrop-blur-sm"
                    >
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#34C759] font-bold italic">
                            Beat the ATS
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        Does your resume <span className="text-[#34C759] italic text-glow">actually fit</span> the job?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-2xl mx-auto font-mono text-sm md:text-base text-white/40 leading-relaxed"
                    >
                        Paste the job description and let AI highlight exactly what keywords you're missing, which skills to emphasize, and how to beat the automated filters.
                    </motion.p>
                </div>

                {!matchResult ? (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <JobMatchUploader
                            onAnalyzeReady={handleAnalyzeReady}
                            onUpgradeNeeded={() => setShowUpgradeModal(true)}
                            isPro={isPro}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <JobMatchResults
                            result={matchResult}
                            isPro={isPro}
                            onUpgradeNeeded={() => setShowUpgradeModal(true)}
                        />

                        <div className="flex justify-center mt-16">
                            <button
                                onClick={() => {
                                    setMatchResult(null);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all"
                            >
                                <span>Analyze Another Job</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>

            <AnimatePresence>
                {showUpgradeModal && (
                    <UpgradeModal
                        isOpen={showUpgradeModal}
                        onClose={() => setShowUpgradeModal(false)}
                        onUpgrade={() => setShowUpgradeModal(true)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAuth && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative glass-card rounded-3xl p-8 max-w-md w-full"
                        >
                            <button
                                onClick={() => setShowAuth(false)}
                                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h3 className="font-playfair text-3xl font-bold text-white mb-2">
                                Join the Roast
                            </h3>
                            <p className="text-white/40 font-mono text-xs mb-8">
                                Sign in to save your roasts, access pro features, and see your career history.
                            </p>
                            <AuthForm
                                onAuthSuccess={(user) => {
                                    setUser(user);
                                    setShowAuth(false);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
