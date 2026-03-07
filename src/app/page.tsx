'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import PDFUploader from '@/components/PDFUploader';
import ScoreCard from '@/components/ScoreCard';
import RoastCard from '@/components/RoastCard';
import UpgradeModal from '@/components/UpgradeModal';
import AuthForm from '@/components/AuthForm';
import ShareRoastButton from '@/components/ShareRoastButton';
import { RoastResult } from '@/lib/pdfExtractor';
import { supabase } from '@/lib/supabase';

const DEMO_RESULT: RoastResult = {
  overallScore: 47,
  grade: 'D',
  roastHeadline: 'This Resume Is So Vague It Could Be About Anyone',
  badges: ['📊 Data Allergic', '🤖 ATS Nightmare', '💤 Sleep Inducing'],
  categories: [
    { name: 'Impact', score: 35, grade: 'F', roastLine: 'Your achievements are ghosts — vague and unseen', tip: 'Add numbers: "Led team" → "Led 5-person team, increasing revenue 40%"' },
    { name: 'Clarity', score: 42, grade: 'F', roastLine: 'Passive voice detector: 100% hit rate', tip: 'Use active verbs: "Was responsible for" → "Managed"' },
    { name: 'ATS Ready', score: 55, grade: 'F', roastLine: 'ATS looked at this and took a nap', tip: 'Add keywords from job descriptions naturally throughout' },
    { name: 'Relevance', score: 58, grade: 'F', roastLine: 'Skills from 2015 called — they want their XML back', tip: 'Remove outdated tech, add AI/ML skills' },
    { name: 'Originality', score: 45, grade: 'F', roastLine: 'Cliché generator: results-driven, hard-working, team-player', tip: 'Replace buzzwords with specific accomplishments' },
  ],
};

export default function Home() {
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [roastCount, setRoastCount] = useState(12847);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const demoRef = useRef(null);
  const isDemoInView = useInView(demoRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('stats')
          .select('roast_count')
          .eq('id', '1')
          .single();

        if (data) setRoastCount(data.roast_count);
      } catch {
        // Use fallback
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchStats();
  }, []);

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

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handleRoastComplete = (result: RoastResult) => {
    setRoastResult(result);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8] selection:bg-[#FF3B30] selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF3B30]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#FF9500]/5 rounded-full blur-[100px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
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
          </motion.div>

          <div className="hidden md:flex items-center gap-8 font-mono text-sm text-white/60">
            {user && (
              <a href="/dashboard" className="hover:text-white transition-colors text-white font-bold">Dashboard</a>
            )}
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="/match" className="hover:text-white transition-colors text-[#34C759] font-bold">Job Match</a>
            <a href="/rewrite" className="hover:text-white transition-colors text-[#34C759] font-bold">Bullet Fixer</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#roast" className="hover:text-white transition-colors text-[#FF3B30] font-bold">Roast Me</a>
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

      <main>
        {/* Hero Section */}
        <section id="roast" className="relative pt-40 pb-32 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF3B30] font-bold italic">
                Brutally Honest • Fun • AI Powered
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="font-playfair text-6xl md:text-8xl font-bold mb-8 leading-[0.95]"
            >
              Your resume isn't bad.
              <br />
              <span className="text-[#FF3B30] italic">It's just not roasted yet.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl mx-auto font-mono text-sm md:text-base text-white/40 mb-16 leading-relaxed"
            >
              Stop sending boring resumes to the void. Get a savage, AI-driven critique and convert your career path into a shareable roast card.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {!roastResult ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B30] to-[#FF9500] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative glass-card rounded-2xl p-2 bg-black/40">
                    <PDFUploader
                      onRoastComplete={handleRoastComplete}
                      onUpgradeNeeded={() => setShowUpgradeModal(true)}
                      isPro={isPro}
                      userId={user?.id}
                    />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                >
                  <div className="glass-card rounded-3xl p-8 md:p-12">
                    <ScoreCard result={roastResult as RoastResult} />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-[#FF3B30]/20 blur-[100px] pointer-events-none" />
                    <RoastCard result={roastResult as RoastResult} />
                  </div>

                  {roastResult.id && (
                    <div className="flex justify-center">
                      <ShareRoastButton
                        roastId={roastResult.id}
                        score={roastResult.overallScore}
                        headline={roastResult.roastHeadline}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setRoastResult(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all"
                  >
                    <span>Roast Another One</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Action Showcase */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div className="max-w-2xl">
                <h3 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
                  See the Carnage
                </h3>
                <p className="font-inter text-xl text-white/50">
                  We don't just judge your font choice. We analyze your impact, clarity, and market relevance with the soul of a stand-up comedian.
                </p>
              </div>
              <div className="font-mono text-sm text-[#FF3B30] font-bold flex items-center gap-2 mb-2">
                <div className="w-12 h-[1px] bg-[#FF3B30]" />
                DEMO RESULTS
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF3B30]/5 to-transparent pointer-events-none" />
              <ScoreCard result={DEMO_RESULT} />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-mono text-white/30 text-xs uppercase tracking-[0.3em] mb-8">
                Global Impact Report
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="text-center md:text-right">
                  <p className="font-playfair text-7xl md:text-9xl font-bold text-[#FF3B30] text-glow">
                    {isLoadingCount ? '---' : Math.floor(roastCount / 1000) + 'k'}
                  </p>
                  <p className="font-mono text-white/40 mt-2">CAREERS ROASTED</p>
                </div>
                <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-16">
                  <p className="font-playfair text-5xl font-bold mb-4">"It actually helped."</p>
                  <p className="font-mono text-white/50 text-sm">
                    Despite the insults, 84% of users improved their call-back rate after implementing our AI tips.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-playfair text-4xl md:text-6xl font-bold text-center mb-20 text-glow">Choose Your Pain</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                whileHover={{ y: -10 }}
                className="p-10 glass-card rounded-3xl border-white/5"
              >
                <h4 className="font-playfair text-3xl font-bold mb-2">The Freebie</h4>
                <p className="font-mono text-sm text-white/40 mb-8 italic">For the curious</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-white/40 font-mono text-xs">/FOREVER</span>
                </div>
                <ul className="space-y-5 font-inter text-sm text-white/60 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full" />
                    3 resume roasts per week
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full" />
                    Standard AI feedback
                  </li>
                  <li className="flex items-center gap-3 opacity-30">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    HD Shareable roast card
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border border-white/10 font-mono text-xs uppercase font-bold tracking-widest hover:bg-white/5 transition-colors">Start Free</button>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="p-10 glass-card rounded-3xl border-[#FF3B30]/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-4 py-1 bg-[#FF3B30] text-white font-mono text-[10px] font-bold uppercase tracking-widest -rotate-0">Popular</div>
                <h4 className="font-playfair text-3xl font-bold mb-2">The Roast Professional</h4>
                <p className="font-mono text-sm text-[#FF3B30]/60 mb-8 italic">For the ambitious</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">₹9</span>
                  <span className="text-white/40 font-mono text-xs uppercase">/Month</span>
                </div>
                <ul className="space-y-5 font-inter text-sm text-white/80 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30]">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    Unlimited savage roasts
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30]">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    "Fix It" AI Bullet Rewriter
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30]">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    HD PNG & PDF Exports
                  </li>
                </ul>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-4 rounded-xl bg-[#FF3B30] text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#FF3B30]/90 transition-all accent-glow"
                >
                  Go Pro Now
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-32 pb-16 px-6 border-t border-white/5 relative overflow-hidden bg-black/40">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#FF3B30] rounded flex items-center justify-center font-bold text-white text-xs">R</div>
                <h5 className="font-playfair text-xl font-bold">ResuméRoast</h5>
              </div>
              <p className="font-inter text-white/40 max-w-sm leading-relaxed mb-8">
                Turning mediocre resumes into career-defining roasts since 2024. Your future self will thank you for the insults.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-white/40 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-white/40 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <h6 className="font-mono text-xs uppercase tracking-[0.2em] font-bold mb-8">Navigation</h6>
              <ul className="space-y-4 font-mono text-sm text-white/40">
                <li><a href="#how-it-works" className="hover:text-[#FF3B30] transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-[#FF3B30] transition-colors">Pricing</a></li>
                <li><a href="/contact" className="hover:text-[#FF3B30] transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-mono text-xs uppercase tracking-[0.2em] font-bold mb-8">Legal</h6>
              <ul className="space-y-4 font-mono text-sm text-white/40">
                <li><a href="/privacy" className="hover:text-[#FF3B30] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[#FF3B30] transition-colors">Terms of Service</a></li>
                <li className="pt-4 text-[10px] text-white/20 italic">Created by Akhil Kumar D</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-16 border-t border-white/5 font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
            <p>© 2024 RESUMEROASTER. ALL RIGHTS RESERVED.</p>
            <p>Made with 🔥 for the job hunt.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showUpgradeModal && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            onUpgrade={handleUpgrade}
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
