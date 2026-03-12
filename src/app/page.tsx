'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PDFUploader from '@/components/PDFUploader';
import ScoreCard from '@/components/ScoreCard';
import RoastCard from '@/components/RoastCard';
import UpgradeModal from '@/components/UpgradeModal';
import AuthForm from '@/components/AuthForm';
import ShareRoastButton from '@/components/ShareRoastButton';
import ReferralBanner from '@/components/ReferralBanner';
import { RoastResult } from '@/lib/pdfExtractor';
import { supabase } from '@/lib/supabase';

const DEMO_RESULT: RoastResult = {
  overallScore: 34,
  grade: 'D',
  roastHeadline: 'This Resume Is So Vague It Could Be About Anyone',
  badges: ['📊 Data Allergic', '🤖 ATS Nightmare', '💤 Sleep Inducing'],
  categories: [
    { name: 'Impact', score: 22, grade: 'F', roastLine: 'Responsibilities listed, achievements buried in the void' },
    { name: 'Clarity', score: 41, grade: 'D', roastLine: 'Passive voice everywhere. Did you do things or did things happen to you?' },
    { name: 'ATS Readiness', score: 30, grade: 'F', roastLine: 'A bot would reject this before a human ever sees it' },
    { name: 'Relevance', score: 38, grade: 'D', roastLine: 'Skills section reads like a 2019 bootcamp syllabus' },
    { name: 'Originality', score: 29, grade: 'F', roastLine: "'Results-driven professional' — congratulations, so is everyone else" },
  ],
};

export default function Home() {
  const pathname = usePathname();
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [roastCount, setRoastCount] = useState(0);
  const [roastedLastHour, setRoastedLastHour] = useState(47);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const demoRef = useRef(null);
  const isDemoInView = useInView(demoRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setRoastCount(data.totalRoasts);
        if (data.roastedLastHour) setRoastedLastHour(data.roastedLastHour);
      } catch {
        setRoastCount(10483);
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
          .from('profiles')
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
            <img src="/logo.png" alt="ResuméRoast" className="w-8 h-8 rounded-lg object-cover" />
            <h1 className="font-playfair text-2xl font-bold tracking-tight">
              Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
            </h1>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
            {user && (
              <a href="/dashboard" className={`hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-[#FF3B30] underline underline-offset-4' : 'text-white/60'}`}>Dashboard</a>
            )}
            <a href="#how-it-works" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-white/60' : 'text-white/60'}`}>How it works</a>
            <div className="w-px h-4 bg-white/10" />
            <a href="/match" className="hover:text-white transition-colors text-[#34C759] font-bold">Job Match</a>
            <a href="/interview" className="hover:text-white transition-colors text-[#007AFF] font-bold">Interview Prep</a>
            <a href="/cover-letter" className="hover:text-white transition-colors text-[#AF52DE] font-bold">Cover Letter</a>
            <a href="/rewrite" className="hover:text-white transition-colors text-white/60">Bullet Fixer</a>
            <a href="/linkedin" className="hover:text-white transition-colors text-[#0077B5] font-bold">LinkedIn</a>
            <a href="/compare" className="hover:text-white transition-colors text-[#34C759] font-bold">Compare</a>
            <div className="w-px h-4 bg-white/10" />
            <a href="#pricing" className="hover:text-white transition-colors text-white/60">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 bg-[#FF3B30] rounded-full flex items-center justify-center font-bold text-white text-sm"
                >
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-xl p-2 shadow-xl"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-2">
                        <p className="font-mono text-xs text-white/60 truncate">{user.email}</p>
                        {isPro && <span className="text-[10px] text-[#FF9500] font-bold">PRO</span>}
                      </div>
                      <a href="/dashboard" className="block px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg">Dashboard</a>
                      <button
                        onClick={() => supabase.auth.signOut()}
                        className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative group">
                <a
                  href="/login"
                  className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs hover:bg-white/10 transition-all hover:border-white/20"
                >
                  Sign In
                </a>
                <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-black border border-white/10 rounded-xl text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="font-mono text-[10px] text-white/50 leading-relaxed">
                    Save roast history, track improvement over time. Free account, no credit card.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            >
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-6 font-mono text-sm">
                {user && (
                  <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/60 hover:text-[#FF3B30]">Dashboard</a>
                )}
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/60 hover:text-[#FF3B30]">How it works</a>
                <a href="/match" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#34C759] font-bold">
                  Job Match
                  <span className="block font-mono text-[10px] font-normal text-white/30 mt-0.5">Match your resume to any job description</span>
                </a>
                <a href="/interview" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#007AFF] font-bold">
                  Interview Prep
                  <span className="block font-mono text-[10px] font-normal text-white/30 mt-0.5">AI questions from your actual resume</span>
                </a>
                <a href="/cover-letter" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#AF52DE] font-bold">
                  Cover Letter
                  <span className="block font-mono text-[10px] font-normal text-white/30 mt-0.5">One-click tailored cover letters</span>
                </a>
                <a href="/rewrite" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/60 hover:text-[#FF3B30]">
                  Bullet Fixer
                  <span className="block font-mono text-[10px] font-normal text-white/30 mt-0.5">Rewrite weak bullets into achievements</span>
                </a>
                <a href="/linkedin" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#0077B5] font-bold">
                  LinkedIn
                  <span className="block font-mono text-[10px] font-normal text-white/30 mt-0.5">Optimize your LinkedIn profile</span>
                </a>
                <a href="/compare" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#34C759] font-bold">
                  Compare
                  <span className="block font-mono text-[10px] font-normal text-white/30 mt-0.5">Compare two resume versions side-by-side</span>
                </a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/60 hover:text-[#FF3B30]">Pricing</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="max-w-2xl mx-auto font-mono text-sm md:text-base text-white/40 mb-8 leading-relaxed"
            >
              Upload your resume. Get a brutally honest score in 30 seconds. Free, no signup required.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="font-mono text-sm text-[#FF3B30] mb-12"
            >
              🔥 {roastedLastHour} resumes roasted in the last hour
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {[
                { icon: '📊', text: 'AI score on 5 dimensions' },
                { icon: '🤖', text: 'ATS compatibility check' },
                { icon: '🎯', text: 'Actionable fixes per category' },
                { icon: '⚡', text: 'Results in 30 seconds' },
                { icon: '🔒', text: 'No signup required' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full">
                  <span className="text-sm">{icon}</span>
                  <span className="font-mono text-[11px] text-white/50">{text}</span>
                </div>
              ))}
            </motion.div>

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
                    <ScoreCard result={roastResult as RoastResult} isPro={isPro} onUpgrade={() => setShowUpgradeModal(true)} />
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

                  <ReferralBanner
                    roastScore={roastResult.overallScore}
                    roastHeadline={roastResult.roastHeadline}
                  />

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
                <p className="font-mono text-sm text-white/30 mt-4">
                  Each category scores 0–100. Grades follow standard A–F scale. Badges are personality diagnoses your resume earned on its own.
                </p>
              </div>
              <div className="font-mono text-sm text-[#FF3B30] font-bold flex items-center gap-2 mb-2">
                <div className="w-12 h-[1px] bg-[#FF3B30]" />
                DEMO RESULTS
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isDemoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Badges explained:</span>
              <span className="px-3 py-1 glass-card rounded-lg font-mono text-[10px] text-white/50 border-white/10">
                📊 Data Allergic — No quantified achievements
              </span>
              <span className="px-3 py-1 glass-card rounded-lg font-mono text-[10px] text-white/50 border-white/10">
                🤖 ATS Nightmare — Fails keyword parsing
              </span>
              <span className="px-3 py-1 glass-card rounded-lg font-mono text-[10px] text-white/50 border-white/10">
                💤 Sleep Inducing — Generic language throughout
              </span>
            </motion.div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden" ref={demoRef}>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF3B30]/5 to-transparent pointer-events-none" />
              <ScoreCard result={DEMO_RESULT} />
            </div>
          </div>
        </section>

        {/* Tools/Features Section */}
        <section id="tools" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">6 Tools</span>
              </div>
              <h3 className="font-playfair text-4xl md:text-6xl font-bold mb-6">Everything You Need to Get Hired</h3>
              <p className="max-w-2xl mx-auto font-inter text-white/40 text-lg">
                From roasting your resume to landing the interview, we've got your job search covered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🔥',
                  title: 'Resume Roast',
                  desc: 'Brutally honest AI feedback on your resume. Scores, red flags, and actionable fixes — in 30 seconds.',
                  color: '#FF3B30',
                  href: '/',
                },
                {
                  icon: '🎯',
                  title: 'Job Match',
                  desc: 'Paste a job description and see exactly how well your resume aligns. ATS score, missing keywords, and what to fix.',
                  color: '#FF9500',
                  href: '/match',
                },
                {
                  icon: '🎤',
                  title: 'Interview Prep',
                  desc: 'AI generates the exact questions interviewers will ask based on YOUR resume — with expert sample answers.',
                  color: '#007AFF',
                  href: '/interview',
                },
                {
                  icon: '✉️',
                  title: 'Cover Letter',
                  desc: 'One-click AI cover letters tailored to the job. Professional, personalized, and ready to send.',
                  color: '#AF52DE',
                  href: '/cover-letter',
                },
                {
                  icon: '⚡',
                  title: 'Bullet Fixer',
                  desc: 'Rewrite weak resume bullets into powerful, metrics-driven achievements that get noticed.',
                  color: '#34C759',
                  href: '/rewrite',
                },
                {
                  icon: '📊',
                  title: 'Score History',
                  desc: 'Track your resume improvements over time. See exactly how each tweak moved the needle.',
                  color: '#FF6154',
                  href: '/dashboard',
                },
              ].map((feature, i) => (
                <motion.a
                  key={feature.title}
                  href={feature.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group glass-card rounded-2xl p-8 border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.08]"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${feature.color}20`, borderColor: `${feature.color}40` }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="font-playfair text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="font-inter text-sm text-white/50 mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-mono text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">
                    Try it <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="text-center md:border-r border-white/10 md:pr-8"
              >
                <p className="font-playfair text-5xl md:text-6xl font-bold text-[#FF3B30] text-glow">
                  {isLoadingCount ? '---' : roastCount.toLocaleString()}
                </p>
                <p className="font-mono text-white/40 mt-2 text-sm">CAREERS ROASTED</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-center md:border-r border-white/10 md:px-8 py-8 md:py-0"
              >
                <p className="font-playfair text-5xl md:text-6xl font-bold text-[#FF3B30]">84%</p>
                <p className="font-mono text-white/40 mt-2 text-sm">Improved callback rate</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center md:pl-8 pt-8 md:pt-0"
              >
                <p className="font-playfair text-5xl md:text-6xl font-bold text-[#FF3B30]">30s</p>
                <p className="font-mono text-white/40 mt-2 text-sm">Average time to roast</p>
              </motion.div>
            </motion.div>
            <p className="text-center font-mono text-[10px] text-white/20 mt-8 max-w-2xl mx-auto">
              * "Improved callback rate" reflects self-reported outcomes from users who completed our post-roast survey (n=847) and made at least one recommended fix before reapplying. Individual results vary.
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">What People Are Saying</span>
              </div>
              <h3 className="font-playfair text-4xl md:text-6xl font-bold">Real Results, Savage Feedback</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Priya S.',
                  role: 'Software Engineer — landed offer at Stripe',
                  avatar: 'P',
                  color: '#007AFF',
                  quote: "I'd been applying for 3 months with zero callbacks. ResuméRoast showed me my resume was getting filtered by ATS before a human ever saw it. Fixed the keywords, got 4 interviews in the next 2 weeks.",
                },
                {
                  name: 'Marcus T.',
                  role: 'Product Manager — transitioned from consulting',
                  avatar: 'M',
                  color: '#34C759',
                  quote: "The interview prep feature is insane. It predicted 6 out of 8 questions I was actually asked in my Google loop. The sample answers gave me a framework I could make my own.",
                },
                {
                  name: 'Leila K.',
                  role: 'UX Designer — recent grad',
                  avatar: 'L',
                  color: '#AF52DE',
                  quote: "As a new grad I had no idea what was wrong with my resume. The roast was blunt but fair — it told me my bullet points were just job duties, not achievements. Total game changer.",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative glass-card rounded-3xl p-8"
                >
                  <div className="absolute top-6 left-6 font-playfair text-6xl text-white/10 opacity-50">"</div>
                  <p className="font-inter text-lg italic text-white/70 mb-8 relative z-10">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: testimonial.color }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-playfair font-bold">{testimonial.name}</p>
                      <p className="font-mono text-xs text-white/40">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Questions?</span>
              </div>
              <h3 className="font-playfair text-4xl md:text-6xl font-bold">Frequently Asked</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Is ResuméRoast actually free to use?',
                  a: "Yes. The core resume roast — full AI scoring across 5 categories, letter grade, and roast headline — is free with no account required. You get 3 roasts per week on the free tier. Pro unlocks unlimited roasts plus all other tools like Interview Prep, Cover Letter, and Job Match.",
                },
                {
                  q: 'What does the AI actually look at when it scores my resume?',
                  a: "We extract the raw text from your PDF and run it through five scoring dimensions: Impact (are you citing measurable achievements?), Clarity (active voice, concise language), ATS Readiness (keyword density, formatting that parsers can read), Relevance (are your skills current for your target role?), and Originality (avoiding buzzword-stuffed clichés that every recruiter ignores). Each dimension scores 0–100 and an overall grade is computed.",
                },
                {
                  q: 'Is my resume data stored anywhere?',
                  a: "No. Your resume text is extracted in-browser and sent directly to our AI for analysis. We do not permanently store the content of your resume on our servers. If you're signed in and your roast is saved to your dashboard, only the scores and feedback text are stored — not the original resume file or its full text.",
                },
                {
                  q: 'My resume is image-based (scanned). Will it work?',
                  a: "Only PDFs with selectable text will work. If your resume is a scanned image or was exported from Canva / design tools as a flat image, the text extractor won't be able to read it. You'll need to export a text-layer PDF from your editor. We'll tell you immediately if no text could be extracted.",
                },
                {
                  q: 'What\'s the difference between the Resume Roast and the Job Match tool?',
                  a: "The Resume Roast analyses your resume in isolation — it tells you what's wrong with it in general. The Job Match tool takes a specific job description and scores how well your resume aligns to that particular role. It surfaces missing keywords, ATS gaps, and what to add. Think of Roast as your resume's annual physical; Job Match is the pre-game warm-up for a specific application.",
                },
                {
                  q: 'Why is the price in Indian Rupees?',
                  a: "ResuméRoast is built and priced primarily for the Indian job market, where ₹299/month (~$3.50 USD) is accessible to students and early-career professionals. If you're outside India, your card will auto-convert at your bank's exchange rate. The USD equivalent is shown in the pricing card for reference.",
                },
                {
                  q: 'Can I use this for internships and fresher roles, or is it only for experienced professionals?',
                  a: "Both. The AI adjusts its expectations based on the content it sees. If your resume has limited work experience, the feedback focuses on how well you've showcased projects, coursework, and skills rather than penalising you for not having five years of tenure. Many of our users are students and new grads.",
                },
                {
                  q: 'How is this different from Grammarly or LinkedIn\'s resume tips?',
                  a: "Grammarly checks spelling and grammar. LinkedIn gives generic tips. We run a structured rubric scoring five specific hiring dimensions and generate targeted, resume-specific feedback about YOUR content — not templates. The roast badge system flags specific archetypes your resume exhibits (e.g., 'ATS Nightmare', 'Data Allergic') so you know exactly what category of problem to solve.",
                },
              ].map((item, i) => (
                <FAQItem key={i} question={item.q} answer={item.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF9500] font-bold">Simple Pricing</span>
              </div>
              <h3 className="font-playfair text-4xl md:text-6xl font-bold text-glow">Choose Your Pain</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {/* Free */}
              <motion.div
                whileHover={{ y: -8 }}
                className="p-8 glass-card rounded-3xl border-white/5 flex flex-col"
              >
                <h4 className="font-playfair text-2xl font-bold mb-1">Free</h4>
                <p className="font-mono text-xs text-white/40 mb-6 italic">For the curious</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-white/40 font-mono text-xs">/forever</span>
                </div>
                <ul className="space-y-4 font-inter text-sm text-white/50 mb-8 flex-1">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full shrink-0" />
                    3 resume roasts per week
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full shrink-0" />
                    3 bullet rewrites per week
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full shrink-0" />
                    Standard AI feedback
                  </li>
                  <li className="flex items-center gap-3 opacity-30">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                    Interview Prep
                  </li>
                  <li className="flex items-center gap-3 opacity-30">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                    Cover Letter Generator
                  </li>
                </ul>
                <a href="#roast" className="w-full py-4 rounded-xl border border-white/10 font-mono text-xs uppercase font-bold tracking-widest hover:bg-white/5 transition-colors text-center block">Start Free</a>
              </motion.div>

              {/* Pro Monthly */}
              <motion.div
                whileHover={{ y: -8 }}
                className="p-8 glass-card rounded-3xl border-[#FF3B30]/30 relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 px-4 py-1 bg-[#FF3B30] text-white font-mono text-[10px] font-bold uppercase tracking-widest">Popular</div>
                <h4 className="font-playfair text-2xl font-bold mb-1">Pro</h4>
                <p className="font-mono text-xs text-[#FF3B30]/60 mb-6 italic">For the ambitious</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">₹299</span>
                  <span className="text-white/40 font-mono text-xs">/month</span>
                </div>
                <p className="font-mono text-xs text-white/30 mb-8">≈ $3.50 USD / month</p>
                <ul className="space-y-4 font-inter text-sm text-white/80 mb-8 flex-1">
                  {[
                    'Unlimited savage roasts',
                    'AI Interview Prep',
                    'AI Cover Letter Generator',
                    'Unlimited Bullet Rewriter',
                    'Job Match ATS Analyzer',
                    'HD PNG & PDF Exports',
                    'Priority AI processing',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30] shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-4 rounded-xl bg-[#FF3B30] text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#FF3B30]/90 transition-all accent-glow"
                >
                  Go Pro Now
                </button>
              </motion.div>

              {/* Pro Yearly */}
              <motion.div
                whileHover={{ y: -8 }}
                className="p-8 glass-card rounded-3xl border-[#34C759]/20 relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 px-4 py-1 bg-[#34C759] text-black font-mono text-[10px] font-bold uppercase tracking-widest">Save 44%</div>
                <h4 className="font-playfair text-2xl font-bold mb-1">Pro Yearly</h4>
                <p className="font-mono text-xs text-[#34C759]/60 mb-6 italic">Best value</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">₹1,999</span>
                  <span className="text-white/40 font-mono text-xs">/year</span>
                </div>
                <p className="font-mono text-xs text-white/30 mb-8">≈ $24 USD · Just ₹167/month</p>
                <ul className="space-y-4 font-inter text-sm text-white/80 mb-8 flex-1">
                  {[
                    'Everything in Pro Monthly',
                    'Save ₹1,589/year',
                    'Early access to new features',
                    'Priority support',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#34C759]/20 flex items-center justify-center text-[#34C759] shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-4 rounded-xl bg-[#34C759] text-black font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#34C759]/90 transition-all"
                >
                  Go Pro Yearly
                </button>
              </motion.div>
            </div>
            <p className="text-center font-mono text-[11px] text-white/20 mt-8">
              Prices are in Indian Rupees (INR). Outside India? Your card auto-converts — USD equivalent is shown for reference. Secured by Razorpay.
            </p>
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
              <h6 className="font-mono text-xs uppercase tracking-[0.2em] font-bold mb-8">Tools</h6>
              <ul className="space-y-4 font-mono text-sm text-white/40">
                <li><a href="/match" className="hover:text-[#FF3B30] transition-colors">Job Match</a></li>
                <li><a href="/interview" className="hover:text-[#FF3B30] transition-colors">Interview Prep</a></li>
                <li><a href="/cover-letter" className="hover:text-[#FF3B30] transition-colors">Cover Letter</a></li>
                <li><a href="/rewrite" className="hover:text-[#FF3B30] transition-colors">Bullet Fixer</a></li>
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
            <p>© {new Date().getFullYear()} RESUMEROASTER. ALL RIGHTS RESERVED.</p>
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
            userId={user?.id}
            email={user?.email}
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

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl border-white/5 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/[0.05] transition-colors text-left"
      >
        <h4 className="font-playfair text-lg font-bold">{question}</h4>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-[#FF3B30] shrink-0 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-8 py-6 border-t border-white/5 bg-white/[0.02]"
          >
            <p className="font-inter text-white/60 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
