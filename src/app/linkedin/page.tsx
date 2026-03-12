'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface LinkedInCategory {
  name: string;
  score: number;
  grade: string;
  roastLine: string;
  tip: string;
}

interface LinkedInResult {
  overallScore: number;
  grade: string;
  profileHeadline: string;
  badges: string[];
  categories: LinkedInCategory[];
  quickWins: string[];
  recruitersWillThink: string;
}

function getScoreColor(score: number): string {
  if (score <= 40) return '#FF3B30';
  if (score <= 70) return '#FF9500';
  return '#34C759';
}

export default function LinkedInPage() {
  const [user, setUser] = useState<any>(null);
  const [profileText, setProfileText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LinkedInResult | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    fetchUser();
  }, []);

  const handleAnalyze = async () => {
    if (profileText.length < 100) {
      setError('Please paste at least 100 characters of your LinkedIn profile.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze profile');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0077B5]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-[#AF52DE]/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ResuméRoast" className="w-8 h-8 rounded-lg object-cover" />
            <h1 className="font-playfair text-2xl font-bold tracking-tight">
              Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
            </h1>
          </a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
            <a href="/" className="text-white/60 hover:text-white transition-colors">Roast</a>
            <a href="/match" className="text-white/60 hover:text-white transition-colors">Job Match</a>
            <a href="/interview" className="text-white/60 hover:text-white transition-colors">Interview</a>
            <a href="/cover-letter" className="text-white/60 hover:text-white transition-colors">Cover Letter</a>
            <a href="/rewrite" className="text-white/60 hover:text-white transition-colors">Bullet Fixer</a>
            <a href="/linkedin" className="text-[#0077B5] font-bold">LinkedIn</a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <a href="/dashboard" className="w-8 h-8 bg-[#FF3B30] rounded-full flex items-center justify-center font-bold text-white text-sm">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </a>
            ) : (
              <a href="/login" className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs hover:bg-white/10 transition-all">Sign In</a>
            )}
          </div>
        </div>
      </header>

      <main className="pt-36 pb-32 px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#0077B5]/10 border border-[#0077B5]/20">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0077B5] font-bold">
                  LinkedIn Profile Optimizer
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your LinkedIn is your resume&apos;s
                <br />
                <span className="text-[#0077B5] italic">better-looking cousin.</span>
              </h2>

              <p className="max-w-2xl mx-auto font-mono text-sm text-white/40 mb-12">
                Paste your LinkedIn About section + Experience. Our AI tells you why recruiters skip your profile.
              </p>

              {/* Input area */}
              <div className="max-w-2xl mx-auto">
                {isLoading ? (
                  <div className="glass-card rounded-3xl p-16 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                      <div className="w-20 h-20 border-2 border-white/10 rounded-full" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 w-20 h-20 border-t-2 border-[#0077B5] rounded-full"
                      />
                    </div>
                    <p className="font-playfair text-2xl font-bold mb-2">Analyzing your profile...</p>
                    <p className="font-mono text-sm text-white/40">Running recruiter-eye analysis</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="glass-card rounded-3xl p-6">
                      <textarea
                        value={profileText}
                        onChange={(e) => setProfileText(e.target.value)}
                        placeholder="Paste your LinkedIn profile text here — About section, Experience, Skills, etc. The more you add, the better the analysis."
                        className="w-full min-h-[280px] bg-white/[0.03] border border-white/10 focus:border-[#0077B5]/50 rounded-2xl p-4 font-mono text-sm text-white placeholder:text-white/20 resize-none outline-none transition-colors"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <span className={`font-mono text-xs ${profileText.length < 100 ? 'text-white/30' : 'text-[#0077B5]'}`}>
                          {profileText.length} characters {profileText.length < 100 ? `(need ${100 - profileText.length} more)` : '— ready to analyze'}
                        </span>
                        <button
                          onClick={handleAnalyze}
                          disabled={profileText.length < 100}
                          className="px-6 py-3 rounded-xl font-mono text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#0077B5', color: '#fff' }}
                        >
                          Analyze Profile
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-2xl">
                        <p className="font-mono text-sm text-[#FF3B30]">{error}</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                {[
                  { icon: '📊', title: 'Profile Score', desc: 'Get a real score across 5 critical LinkedIn sections' },
                  { icon: '🧑‍💼', title: "Recruiter's First Impression", desc: "Find out what hiring managers actually think when they land on your profile" },
                  { icon: '⚡', title: 'Quick Win Tips', desc: 'Specific changes you can make today to get more profile views' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="glass-card rounded-2xl p-6 text-left"
                  >
                    <span className="text-2xl mb-3 block">{feature.icon}</span>
                    <h3 className="font-playfair text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="font-mono text-xs text-white/40">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Score + Verdict */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 mb-8"
                  style={{
                    borderColor: getScoreColor(result.overallScore),
                    boxShadow: `0 0 40px ${getScoreColor(result.overallScore)}40`,
                  }}
                >
                  <span className="font-playfair text-5xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                    {result.overallScore}
                  </span>
                  <span className="font-mono text-sm font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                    {result.grade}
                  </span>
                </motion.div>

                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#0077B5]/10 border border-[#0077B5]/20">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0077B5] font-bold">
                    LinkedIn Profile Analysis
                  </span>
                </div>

                <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto">
                  &ldquo;{result.profileHeadline}&rdquo;
                </h2>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {result.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full font-mono text-xs border bg-[#0077B5]/10 border-[#0077B5]/30 text-[#0077B5]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {result.categories.map((cat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-playfair text-lg font-bold">{cat.name}</h3>
                      <span
                        className="font-mono text-sm font-bold px-2 py-0.5 rounded"
                        style={{
                          color: getScoreColor(cat.score),
                          backgroundColor: `${getScoreColor(cat.score)}15`,
                        }}
                      >
                        {cat.grade} · {cat.score}
                      </span>
                    </div>

                    {/* Score bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getScoreColor(cat.score) }}
                      />
                    </div>

                    <p className="font-mono text-sm text-white/60 mb-3 italic">&ldquo;{cat.roastLine}&rdquo;</p>
                    <div className="p-3 rounded-xl bg-[#0077B5]/5 border border-[#0077B5]/15">
                      <p className="font-mono text-xs text-[#0077B5]">
                        <span className="font-bold">Fix: </span>{cat.tip}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recruiters Will Think */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-8 mb-8 border-l-4"
                style={{ borderLeftColor: '#0077B5' }}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#0077B5' }}>
                  Recruiters Will Think
                </h3>
                <p className="font-playfair text-xl text-white/80 leading-relaxed italic">
                  &ldquo;{result.recruitersWillThink}&rdquo;
                </p>
              </motion.div>

              {/* Quick Wins */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-2xl p-8 mb-12"
              >
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#34C759] font-bold mb-6">
                  Quick Wins — Do These Today
                </h3>
                <ol className="space-y-4">
                  {result.quickWins.map((win, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                        style={{ backgroundColor: '#0077B515', color: '#0077B5' }}
                      >
                        {i + 1}
                      </span>
                      <p className="font-mono text-sm text-white/70 pt-1">{win}</p>
                    </li>
                  ))}
                </ol>
              </motion.div>

              {/* Analyze Another */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setProfileText('');
                    setError(null);
                  }}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all"
                >
                  Analyze Another Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
