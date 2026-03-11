'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF } from '@/lib/pdfExtractor';
import { supabase } from '@/lib/supabase';

interface InterviewQuestion {
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'culture-fit';
  difficulty: 'easy' | 'medium' | 'hard';
  why: string;
  sampleAnswer: string;
  tips: string[];
}

interface InterviewResult {
  summary: string;
  questions: InterviewQuestion[];
  weakSpots: string[];
  strengths: string[];
}

const categoryColors: Record<string, string> = {
  behavioral: '#007AFF',
  technical: '#FF9500',
  situational: '#34C759',
  'culture-fit': '#AF52DE',
};

const categoryLabels: Record<string, string> = {
  behavioral: 'Behavioral',
  technical: 'Technical',
  situational: 'Situational',
  'culture-fit': 'Culture Fit',
};

const difficultyColors: Record<string, string> = {
  easy: '#34C759',
  medium: '#FF9500',
  hard: '#FF3B30',
};

export default function InterviewPage() {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      if (text.length < 50) {
        setError('Could not extract text from PDF.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = result?.questions.filter(
    (q) => filter === 'all' || q.category === filter
  ) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#007AFF]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-[#AF52DE]/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,59,48,0.4)]">R</div>
            <h1 className="font-playfair text-2xl font-bold tracking-tight">
              Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
            </h1>
          </a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
            <a href="/" className="text-white/60 hover:text-white transition-colors">Roast</a>
            <a href="/match" className="text-white/60 hover:text-white transition-colors">Job Match</a>
            <a href="/interview" className="text-[#007AFF] font-bold">Interview Prep</a>
            <a href="/cover-letter" className="text-white/60 hover:text-white transition-colors">Cover Letter</a>
            <a href="/rewrite" className="text-white/60 hover:text-white transition-colors">Bullet Fixer</a>
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
        {!result ? (
          /* Upload State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/20">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#007AFF] font-bold">
                AI Interview Coach
              </span>
            </div>

            <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Know what they'll ask
              <br />
              <span className="text-[#007AFF] italic">before you walk in.</span>
            </h2>

            <p className="max-w-2xl mx-auto font-mono text-sm text-white/40 mb-12">
              Upload your resume. Our AI analyzes your experience and generates the exact interview questions you're most likely to face — with expert sample answers.
            </p>

            <div className="max-w-2xl mx-auto">
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />

              {isLoading ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="w-20 h-20 border-2 border-white/10 rounded-full" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 w-20 h-20 border-t-2 border-[#007AFF] rounded-full"
                    />
                  </div>
                  <p className="font-playfair text-2xl font-bold mb-2">Analyzing your resume...</p>
                  <p className="font-mono text-sm text-white/40">Generating personalized interview questions</p>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => inputRef.current?.click()}
                  className="glass-card rounded-3xl p-16 border-2 border-dashed border-[#007AFF]/30 hover:border-[#007AFF] cursor-pointer transition-all group"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#007AFF]/10 flex items-center justify-center group-hover:bg-[#007AFF]/20 transition-colors">
                    <svg className="w-8 h-8 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </div>
                  <p className="font-playfair text-2xl font-bold mb-2">Upload Your Resume</p>
                  <p className="font-mono text-sm text-white/40">PDF format - we'll generate your interview prep</p>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-2xl">
                  <p className="font-mono text-sm text-[#FF3B30]">{error}</p>
                </motion.div>
              )}
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
              {[
                { icon: '🎯', title: 'Personalized Questions', desc: 'Based on YOUR specific resume, not generic lists' },
                { icon: '💡', title: 'Expert Sample Answers', desc: 'Ready-to-use answers referencing your real experience' },
                { icon: '⚡', title: 'Weak Spot Analysis', desc: 'Know exactly where interviewers will probe deeper' },
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
          /* Results State */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="mb-12">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#34C759]/10 border border-[#34C759]/20">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#34C759] font-bold">
                  {result.questions.length} Questions Generated
                </span>
              </div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Your Interview Prep</h2>
              <p className="font-mono text-sm text-white/50 max-w-2xl">{result.summary}</p>
            </div>

            {/* Strengths & Weak Spots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#34C759] font-bold mb-4">Your Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 font-mono text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#34C759] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#FF9500] font-bold mb-4">Prepare Extra For</h3>
                <ul className="space-y-2">
                  {result.weakSpots.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 font-mono text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#FF9500] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['all', 'behavioral', 'technical', 'situational', 'culture-fit'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                    filter === cat
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/40 border border-white/5 hover:border-white/15'
                  }`}
                >
                  {cat === 'all' ? `All (${result.questions.length})` : `${categoryLabels[cat]} (${result.questions.filter(q => q.category === cat).length})`}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {filteredQuestions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                    className="w-full p-6 text-left flex items-start gap-4"
                  >
                    <span className="font-playfair text-2xl font-bold text-white/20 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                          style={{
                            backgroundColor: `${categoryColors[q.category]}20`,
                            color: categoryColors[q.category],
                          }}
                        >
                          {categoryLabels[q.category]}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                          style={{
                            backgroundColor: `${difficultyColors[q.difficulty]}15`,
                            color: difficultyColors[q.difficulty],
                          }}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="font-inter text-lg text-white font-medium">{q.question}</p>
                      <p className="font-mono text-xs text-white/30 mt-2">{q.why}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-white/30 transition-transform ${expandedQuestion === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {expandedQuestion === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 ml-12">
                          <div className="p-5 bg-[#007AFF]/5 border border-[#007AFF]/10 rounded-xl mb-4">
                            <h4 className="font-mono text-xs uppercase tracking-widest text-[#007AFF] font-bold mb-3">Sample Answer</h4>
                            <p className="font-inter text-sm text-white/70 leading-relaxed">{q.sampleAnswer}</p>
                          </div>
                          <div>
                            <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Pro Tips</h4>
                            <ul className="space-y-1">
                              {q.tips.map((tip, j) => (
                                <li key={j} className="font-mono text-xs text-white/50 flex items-start gap-2">
                                  <span className="text-[#34C759]">-</span> {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Try Again */}
            <div className="text-center mt-12">
              <button
                onClick={() => { setResult(null); setFilter('all'); setExpandedQuestion(null); }}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all"
              >
                Upload Another Resume
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
