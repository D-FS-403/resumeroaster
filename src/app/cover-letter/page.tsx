'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF } from '@/lib/pdfExtractor';
import { supabase } from '@/lib/supabase';

interface CoverLetterResult {
  coverLetter: string;
  tone: string;
  keyConnections: Array<{
    resumeSkill: string;
    jobRequirement: string;
    howUsed: string;
  }>;
  wordCount: number;
  tips: string[];
}

export default function CoverLetterPage() {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('is_pro').eq('id', session.user.id).single();
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
    try {
      const text = await extractTextFromPDF(file);
      if (text.length < 50) {
        setError('Could not extract text from PDF.');
        return;
      }
      setResumeText(text);
      setFileName(file.name);
      setError(null);
    } catch {
      setError('Failed to read PDF.');
    }
  };

  const handleGenerate = async () => {
    if (!resumeText || jobDescription.length < 50) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription, companyName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#AF52DE]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#FF9500]/5 rounded-full blur-[120px]" />
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
            <a href="/interview" className="text-white/60 hover:text-white transition-colors">Interview Prep</a>
            <a href="/cover-letter" className="text-[#AF52DE] font-bold">Cover Letter</a>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Hero */}
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#AF52DE]/10 border border-[#AF52DE]/20">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#AF52DE] font-bold">
                  AI Cover Letter Writer
                </span>
              </div>
              <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Stop writing generic
                <br />
                <span className="text-[#AF52DE] italic">cover letters.</span>
              </h2>
              <p className="max-w-2xl mx-auto font-mono text-sm text-white/40">
                Upload your resume + paste a job description. Our AI creates a tailored cover letter that connects your experience to what they're looking for.
              </p>
            </div>

            {/* Two Column Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Resume Upload */}
              <div>
                <h3 className="font-playfair text-xl font-bold mb-3">Your Resume</h3>
                <input ref={inputRef} type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} className="hidden" />

                <div
                  onClick={() => !resumeText && inputRef.current?.click()}
                  className={`h-[200px] rounded-2xl flex flex-col items-center justify-center transition-all glass-card ${
                    resumeText
                      ? 'border border-[#34C759]/30 bg-[#34C759]/5'
                      : 'border-2 border-dashed border-white/10 hover:border-[#AF52DE] cursor-pointer'
                  }`}
                >
                  {resumeText ? (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-[#34C759] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="font-mono text-sm text-[#34C759] font-bold">{fileName}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setResumeText(null); setFileName(null); }}
                        className="mt-3 font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-white/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                      <p className="font-mono text-sm text-white/40">Upload PDF</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="font-playfair text-xl font-bold mb-3">Job Description</h3>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full h-[200px] rounded-2xl p-5 bg-white/[0.02] border border-white/10 resize-none font-mono text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#AF52DE] transition-all glass-card"
                />
              </div>
            </div>

            {/* Company Name (optional) */}
            <div className="max-w-md mx-auto mb-8">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name (optional)"
                className="w-full px-5 py-3 bg-white/[0.02] border border-white/10 rounded-xl font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#AF52DE] transition-all text-center"
              />
            </div>

            {error && (
              <div className="max-w-md mx-auto mb-6 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl text-center">
                <p className="font-mono text-sm text-[#FF3B30]">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <div className="text-center">
              <motion.button
                onClick={handleGenerate}
                disabled={!resumeText || jobDescription.length < 50 || isLoading}
                whileHover={resumeText && jobDescription.length >= 50 ? { scale: 1.02 } : {}}
                whileTap={resumeText && jobDescription.length >= 50 ? { scale: 0.98 } : {}}
                className={`px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest transition-all ${
                  resumeText && jobDescription.length >= 50
                    ? 'bg-[#AF52DE] text-white shadow-[0_0_30px_rgba(175,82,222,0.3)] hover:shadow-[0_0_50px_rgba(175,82,222,0.5)]'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Crafting your letter...
                  </span>
                ) : (
                  'Generate Cover Letter'
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Results */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-[#34C759]/10 border border-[#34C759]/20">
                  <span className="font-mono text-[10px] text-[#34C759] uppercase tracking-widest font-bold">
                    {result.wordCount} words - {result.tone} tone
                  </span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold">Your Cover Letter</h2>
              </div>
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#AF52DE] text-white rounded-xl font-mono text-xs font-bold uppercase tracking-widest"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </motion.button>
            </div>

            {/* Cover Letter Content */}
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
              <div className="prose prose-invert max-w-none">
                {result.coverLetter.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="font-inter text-base text-white/80 leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Key Connections */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#AF52DE] font-bold mb-4">
                How We Connected Your Experience
              </h3>
              <div className="space-y-4">
                {result.keyConnections.map((conn, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#AF52DE]/10 flex items-center justify-center shrink-0">
                      <span className="font-mono text-xs text-[#AF52DE] font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-[#007AFF]/10 text-[#007AFF] font-mono text-[10px] rounded uppercase">{conn.resumeSkill}</span>
                        <span className="text-white/20">→</span>
                        <span className="px-2 py-0.5 bg-[#FF9500]/10 text-[#FF9500] font-mono text-[10px] rounded uppercase">{conn.jobRequirement}</span>
                      </div>
                      <p className="font-mono text-xs text-white/50">{conn.howUsed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#FF9500] font-bold mb-4">
                Make It Even Better
              </h3>
              <ul className="space-y-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-sm text-white/60">
                    <span className="text-[#FF9500]">-</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Start Over */}
            <div className="text-center">
              <button
                onClick={() => { setResult(null); setResumeText(null); setFileName(null); setJobDescription(''); setCompanyName(''); }}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all"
              >
                Generate Another
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
