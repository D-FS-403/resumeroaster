'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF, RoastResult } from '@/lib/pdfExtractor';
import { canRoast, recordRoast, getRemainingRoasts } from '@/lib/rateLimit';
import EmailGate from '@/components/EmailGate';

interface PDFUploaderProps {
  onRoastComplete: (result: RoastResult) => void;
  onUpgradeNeeded: () => void;
  isPro: boolean;
  userId?: string;
}

export default function PDFUploader({ onRoastComplete, onUpgradeNeeded, isPro, userId }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [extractedText, setExtractedText] = useState<string | null>(null);

  // Fix hydration issue by fetching remaining roasts after mount
  useEffect(() => {
    setRemaining(getRemainingRoasts(isPro));
  }, [isPro]);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    if (!canRoast(isPro)) {
      onUpgradeNeeded();
      return;
    }

    setError(null);
    setIsLoading(true);
    setFileName(file.name);

    try {
      const text = await extractTextFromPDF(file);

      if (text.length < 50) {
        setError('Could not extract text from PDF. Please ensure it contains selectable text.');
        setIsLoading(false);
        return;
      }

      setExtractedText(text);
      setIsLoading(false); // Stop loading temporarily to show Email gate
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  }, [isPro, onUpgradeNeeded]);

  const handleEmailSubmit = async (email: string | undefined) => {
    if (!extractedText) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: extractedText, userId, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze resume');
      }

      const result = await response.json();
      recordRoast();
      setRemaining(getRemainingRoasts(isPro));

      // If we collected an email and got a roastId, trigger the email asynchronously
      if (email && result.id) {
        fetch('/api/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, roastId: result.id })
        }).catch(console.error); // Fire and forget
      }

      onRoastComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
      setExtractedText(null); // Reset
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  // If we have extracted text but no roast yet, display the Email Gate
  if (extractedText) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <EmailGate onSubmit={handleEmailSubmit} isLoading={isLoading} />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-6 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-[2rem] glass-card mx-auto max-w-md"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-[#FF3B30] font-mono text-xs uppercase font-bold tracking-tight">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative rounded-[2rem] p-12 md:p-16 text-center cursor-pointer
          transition-all duration-500 ease-out border-2
          ${isDragging
            ? 'border-[#FF3B30] bg-[#FF3B30]/5 scale-[1.01] shadow-[0_0_40px_rgba(255,59,48,0.2)]'
            : 'border-dashed border-[#FF3B30]/40 bg-white/[0.02] hover:border-[#FF3B30] hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(255,59,48,0.15)]'
          }
          ${isLoading ? 'pointer-events-none' : ''}
          glass-card
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-8 py-4"
            >
              <div className="relative">
                <div className="w-20 h-20 border-2 border-white/10 rounded-full" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-20 h-20 border-t-2 border-[#FF3B30] rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[#F5F0E8] font-playfair text-3xl font-bold italic">
                  Heating up the roast...
                </p>
                <p className="text-[#F5F0E8]/40 font-mono text-sm tracking-widest uppercase">
                  {fileName ? `Analyzing ${fileName}` : 'Processing career choices'}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-[#FF3B30]/20 rounded-full blur-[20px] group-hover:blur-[30px] transition-all" />
                <div className="relative w-24 h-24 rounded-full bg-black border border-[#FF3B30]/30 flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-10 h-10 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              <div>
                <p className="text-[#F5F0E8] font-playfair text-3xl font-bold mb-2">
                  Drop your resume PDF here — or click to upload
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full font-mono text-[10px] text-white/30">
                  PDF format only
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full font-mono text-[10px] text-white/30">
                  Max 10MB
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full font-mono text-[10px] text-white/30">
                  Text-layer required (not scanned)
                </span>
              </div>

              <div className="flex items-center justify-center gap-6 font-mono text-xs text-white/40 mt-4">
                <span className="relative group flex items-center gap-2 cursor-default">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Private & Secure
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-black border border-white/10 rounded-xl text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal">
                    <p className="font-mono text-[10px] text-white/60 leading-relaxed">
                      Your resume is processed in-memory. No file is stored on our servers. Text is sent securely via HTTPS and discarded after scoring.
                    </p>
                  </div>
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Results in 30s
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  No Signup Needed
                </span>
              </div>

              {!isPro && remaining !== null && (
                <div className="px-4 py-2 bg-[#FF9500]/10 rounded-full border border-[#FF9500]/20 mt-6">
                  <p className="text-[#FF9500] font-mono text-[10px] uppercase font-bold tracking-tighter">
                    🔥 {remaining} free roast{remaining !== 1 ? 's' : ''} left
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-6 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-[2rem] glass-card"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-[#FF3B30] font-mono text-xs uppercase font-bold tracking-tight">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
