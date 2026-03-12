'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF } from '@/lib/pdfExtractor';

type RoastSummary = {
  score: number;
  grade: string;
  headline: string;
  categories: { name: string; score: number; grade: string }[];
};

const getScoreColor = (score: number) =>
  score <= 40 ? '#FF3B30' : score <= 70 ? '#FF9500' : '#34C759';

const CATEGORY_NAMES = ['Impact', 'Clarity', 'ATS Readiness', 'Relevance', 'Originality'];

export default function ComparePage() {
  const [resumeA, setResumeA] = useState<{ name: string; text: string } | null>(null);
  const [resumeB, setResumeB] = useState<{ name: string; text: string } | null>(null);
  const [resultA, setResultA] = useState<RoastSummary | null>(null);
  const [resultB, setResultB] = useState<RoastSummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefA = useRef<HTMLInputElement>(null);
  const inputRefB = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    file: File,
    setter: (val: { name: string; text: string } | null) => void
  ) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setError(null);
    try {
      const text = await extractTextFromPDF(file);
      if (text.length < 50) {
        setError('Could not extract enough text from that PDF.');
        return;
      }
      setter({ name: file.name, text });
    } catch {
      setError('Failed to read PDF. Please try another file.');
    }
  };

  const analyzeResumes = async () => {
    if (!resumeA || !resumeB) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: resumeA.text }),
        }),
        fetch('/api/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: resumeB.text }),
        }),
      ]);

      if (!resA.ok || !resB.ok) {
        const errData = !resA.ok ? await resA.json() : await resB.json();
        throw new Error(errData.error || 'Analysis failed. Please try again.');
      }

      const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);

      const toSummary = (d: any): RoastSummary => ({
        score: d.overallScore,
        grade: d.grade,
        headline: d.roastHeadline,
        categories: (d.categories || []).map((c: any) => ({
          name: c.name,
          score: c.score,
          grade: c.grade,
        })),
      });

      setResultA(toSummary(dataA));
      setResultB(toSummary(dataB));
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResumeA(null);
    setResumeB(null);
    setResultA(null);
    setResultB(null);
    setError(null);
  };

  const hasResults = resultA && resultB;

  // Determine winner
  const winnerIsB = hasResults && resultB!.score >= resultA!.score;
  const scoreDelta = hasResults ? Math.abs(resultB!.score - resultA!.score) : 0;

  // Category breakdown helpers
  const getCategoryScore = (result: RoastSummary, name: string) => {
    const cat = result.categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return cat ? cat.score : null;
  };

  const biggestImprovement = hasResults
    ? (() => {
        let best: { name: string; delta: number } | null = null;
        for (const name of CATEGORY_NAMES) {
          const a = getCategoryScore(resultA!, name) ?? 0;
          const b = getCategoryScore(resultB!, name) ?? 0;
          const delta = b - a;
          if (!best || delta > best.delta) best = { name, delta };
        }
        return best;
      })()
    : null;

  const bStrongerCount = hasResults
    ? CATEGORY_NAMES.filter((name) => {
        const a = getCategoryScore(resultA!, name) ?? 0;
        const b = getCategoryScore(resultB!, name) ?? 0;
        return b > a;
      }).length
    : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#34C759]/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#FF3B30]/5 rounded-full blur-[120px]" />
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
            <a href="/compare" className="text-[#34C759] font-bold">Compare</a>
          </nav>
          <a
            href="/login"
            className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs hover:bg-white/10 transition-all"
          >
            Sign In
          </a>
        </div>
      </header>

      <main className="pt-36 pb-32 px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!hasResults ? (
            /* Upload / Hero State */
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#34C759]/10 border border-[#34C759]/20">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#34C759] font-bold">
                  Resume Comparison
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Which version of you
                <br />
                <span className="text-[#34C759] italic">gets hired?</span>
              </h2>

              <p className="max-w-2xl mx-auto font-mono text-sm text-white/40 mb-12">
                Upload two versions of your resume. We&apos;ll score both and show you exactly which one wins.
              </p>

              {/* Upload Zones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
                {/* Zone A */}
                <div>
                  <input
                    ref={inputRefA}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, setResumeA);
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => inputRefA.current?.click()}
                    className="glass-card rounded-3xl p-10 border-2 border-dashed cursor-pointer transition-all group"
                    style={{ borderColor: resumeA ? '#FF3B30' : 'rgba(255,59,48,0.3)' }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: 'rgba(255,59,48,0.1)' }}
                    >
                      {resumeA ? (
                        <svg className="w-7 h-7" style={{ color: '#FF3B30' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7" style={{ color: '#FF3B30' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      )}
                    </div>
                    <p className="font-mono text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#FF3B30' }}>
                      Version A — Before
                    </p>
                    {resumeA ? (
                      <p className="font-inter text-sm text-white/80 truncate">{resumeA.name}</p>
                    ) : (
                      <p className="font-inter text-sm text-white/40">Drop PDF here or click to upload</p>
                    )}
                  </motion.div>
                </div>

                {/* Zone B */}
                <div>
                  <input
                    ref={inputRefB}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, setResumeB);
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => inputRefB.current?.click()}
                    className="glass-card rounded-3xl p-10 border-2 border-dashed cursor-pointer transition-all group"
                    style={{ borderColor: resumeB ? '#34C759' : 'rgba(52,199,89,0.3)' }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: 'rgba(52,199,89,0.1)' }}
                    >
                      {resumeB ? (
                        <svg className="w-7 h-7" style={{ color: '#34C759' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7" style={{ color: '#34C759' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      )}
                    </div>
                    <p className="font-mono text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#34C759' }}>
                      Version B — After
                    </p>
                    {resumeB ? (
                      <p className="font-inter text-sm text-white/80 truncate">{resumeB.name}</p>
                    ) : (
                      <p className="font-inter text-sm text-white/40">Drop PDF here or click to upload</p>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="max-w-3xl mx-auto mb-6 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-2xl"
                  >
                    <p className="font-mono text-sm text-[#FF3B30]">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze Button / Loading */}
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-card max-w-sm mx-auto rounded-3xl p-10 text-center"
                  >
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {/* Dual spinner */}
                      <div className="relative w-10 h-10">
                        <div className="w-10 h-10 border-2 border-white/10 rounded-full" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 border-t-2 rounded-full"
                          style={{ borderColor: '#FF3B30' }}
                        />
                      </div>
                      <div className="relative w-10 h-10">
                        <div className="w-10 h-10 border-2 border-white/10 rounded-full" />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 border-t-2 rounded-full"
                          style={{ borderColor: '#34C759' }}
                        />
                      </div>
                    </div>
                    <p className="font-playfair text-xl font-bold mb-1">Roasting both resumes...</p>
                    <p className="font-mono text-xs text-white/40">This may take a few seconds</p>
                  </motion.div>
                ) : resumeA && resumeB ? (
                  <motion.div
                    key="analyze-btn"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={analyzeResumes}
                      className="px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest text-black transition-all shadow-[0_0_30px_rgba(52,199,89,0.4)]"
                      style={{ backgroundColor: '#34C759' }}
                    >
                      Analyze Both →
                    </motion.button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Results State */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Winner Banner */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-block px-6 py-3 mb-4 rounded-full font-playfair text-2xl md:text-3xl font-bold"
                  style={{
                    backgroundColor: winnerIsB ? 'rgba(52,199,89,0.12)' : 'rgba(255,59,48,0.12)',
                    border: `2px solid ${winnerIsB ? '#34C759' : '#FF3B30'}`,
                    color: winnerIsB ? '#34C759' : '#FF3B30',
                  }}
                >
                  Version {winnerIsB ? 'B' : 'A'} Wins 🏆
                </motion.div>
                {scoreDelta > 0 && (
                  <p className="font-mono text-sm text-white/40">
                    by{' '}
                    <span className="font-bold" style={{ color: winnerIsB ? '#34C759' : '#FF3B30' }}>
                      +{scoreDelta} points
                    </span>
                  </p>
                )}
              </div>

              {/* Side-by-side Score Display */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center mb-12">
                {/* Version A */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-3xl p-6 md:p-8 text-center"
                  style={{
                    border: !winnerIsB
                      ? `2px solid ${getScoreColor(resultA!.score)}`
                      : '2px solid rgba(255,255,255,0.06)',
                    boxShadow: !winnerIsB
                      ? `0 0 40px rgba(52,199,89,0.15)`
                      : 'none',
                    opacity: !winnerIsB ? 1 : 0.65,
                  }}
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Version A</p>
                  <p
                    className="font-playfair text-6xl md:text-7xl font-bold mb-2 leading-none"
                    style={{ color: getScoreColor(resultA!.score) }}
                  >
                    {resultA!.score}
                  </p>
                  <p
                    className="font-mono text-2xl font-bold mb-4"
                    style={{ color: getScoreColor(resultA!.score) }}
                  >
                    {resultA!.grade}
                  </p>
                  <p className="font-inter text-xs text-white/50 italic leading-snug">
                    &ldquo;{resultA!.headline}&rdquo;
                  </p>
                </motion.div>

                {/* VS Divider */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                  <span className="font-playfair text-xl md:text-2xl font-bold text-white/20">VS</span>
                  <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                </div>

                {/* Version B */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-3xl p-6 md:p-8 text-center"
                  style={{
                    border: winnerIsB
                      ? `2px solid ${getScoreColor(resultB!.score)}`
                      : '2px solid rgba(255,255,255,0.06)',
                    boxShadow: winnerIsB
                      ? `0 0 40px rgba(52,199,89,0.15)`
                      : 'none',
                    opacity: winnerIsB ? 1 : 0.65,
                  }}
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">Version B</p>
                  <p
                    className="font-playfair text-6xl md:text-7xl font-bold mb-2 leading-none"
                    style={{ color: getScoreColor(resultB!.score) }}
                  >
                    {resultB!.score}
                  </p>
                  <p
                    className="font-mono text-2xl font-bold mb-4"
                    style={{ color: getScoreColor(resultB!.score) }}
                  >
                    {resultB!.grade}
                  </p>
                  <p className="font-inter text-xs text-white/50 italic leading-snug">
                    &ldquo;{resultB!.headline}&rdquo;
                  </p>
                </motion.div>
              </div>

              {/* Category Breakdown Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-3xl p-6 md:p-8 mb-8"
              >
                <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-white/40 mb-6">
                  Category Breakdown
                </h3>
                <div className="space-y-3">
                  {CATEGORY_NAMES.map((name, i) => {
                    const a = getCategoryScore(resultA!, name);
                    const b = getCategoryScore(resultB!, name);
                    const scoreA = a ?? 0;
                    const scoreB = b ?? 0;
                    const delta = scoreB - scoreA;
                    return (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.06 }}
                        className="grid grid-cols-[1fr_80px_40px_80px] md:grid-cols-[1fr_100px_60px_100px] items-center gap-2 py-3 border-b border-white/5 last:border-0"
                      >
                        <span className="font-mono text-sm text-white/70">{name}</span>
                        <span
                          className="font-playfair text-2xl font-bold text-right"
                          style={{ color: getScoreColor(scoreA) }}
                        >
                          {a !== null ? scoreA : '—'}
                        </span>
                        <div className="flex items-center justify-center">
                          {delta > 0 ? (
                            <span className="font-mono text-sm font-bold" style={{ color: '#34C759' }}>
                              ▲ +{delta}
                            </span>
                          ) : delta < 0 ? (
                            <span className="font-mono text-sm font-bold" style={{ color: '#FF3B30' }}>
                              ▼ {delta}
                            </span>
                          ) : (
                            <span className="font-mono text-sm text-white/30">—</span>
                          )}
                        </div>
                        <span
                          className="font-playfair text-2xl font-bold"
                          style={{ color: getScoreColor(scoreB) }}
                        >
                          {b !== null ? scoreB : '—'}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                {/* Column labels */}
                <div className="grid grid-cols-[1fr_80px_40px_80px] md:grid-cols-[1fr_100px_60px_100px] gap-2 mt-4 pt-4 border-t border-white/5">
                  <span />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 text-right">Version A</span>
                  <span />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Version B</span>
                </div>
              </motion.div>

              {/* Verdict */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-card rounded-3xl p-6 md:p-8 mb-10"
                style={{ borderLeft: `4px solid ${winnerIsB ? '#34C759' : '#FF3B30'}` }}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-3" style={{ color: winnerIsB ? '#34C759' : '#FF3B30' }}>
                  Verdict
                </h3>
                <p className="font-inter text-sm md:text-base text-white/70 leading-relaxed">
                  Version {winnerIsB ? 'B' : 'A'} is stronger in{' '}
                  <span className="font-bold text-white">
                    {winnerIsB ? bStrongerCount : CATEGORY_NAMES.length - bStrongerCount}/{CATEGORY_NAMES.length} categories
                  </span>.
                  {biggestImprovement && biggestImprovement.delta !== 0 && (
                    <>
                      {' '}The biggest{' '}
                      {biggestImprovement.delta > 0 ? 'improvement' : 'regression'} is in{' '}
                      <span className="font-bold text-white">{biggestImprovement.name}</span>
                      {' '}({biggestImprovement.delta > 0 ? '+' : ''}{biggestImprovement.delta} points).
                    </>
                  )}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a
                  href="/"
                  className="px-8 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest text-black text-center transition-all shadow-[0_0_24px_rgba(52,199,89,0.3)]"
                  style={{ backgroundColor: '#34C759' }}
                >
                  Roast Version B in Detail →
                </a>
                <button
                  onClick={reset}
                  className="px-8 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest text-white/70 border border-white/10 hover:bg-white/5 transition-all"
                >
                  Compare Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
