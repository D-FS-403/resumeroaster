'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF } from '@/lib/pdfExtractor';
import { canRoast, getRemainingRoasts } from '@/lib/rateLimit';

interface JobMatchUploaderProps {
    onAnalyzeReady: (resumeText: string, jobDescription: string) => Promise<void>;
    onUpgradeNeeded: () => void;
    isPro: boolean;
}

export default function JobMatchUploader({ onAnalyzeReady, onUpgradeNeeded, isPro }: JobMatchUploaderProps) {
    const [resumeText, setResumeText] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [jdText, setJdText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const bothFilled = !!resumeText && jdText.length > 50;

    const processFile = async (file: File) => {
        if (!file.type.includes('pdf')) {
            setError('Please upload a PDF file');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const text = await extractTextFromPDF(file);
            if (text.length < 50) {
                setError('Could not extract text. Ensure the PDF contains selectable text.');
                return;
            }
            setResumeText(text);
            setFileName(file.name);
        } catch (err) {
            setError('Failed to read PDF. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleSubmit = async () => {
        if (!bothFilled) return;

        if (!canRoast(isPro)) {
            onUpgradeNeeded();
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await onAnalyzeReady(resumeText, jdText);
        } catch (err: any) {
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 relative">
            <div className="flex flex-col md:flex-row gap-8 relative items-stretch">

                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 pointer-events-none hidden md:block z-0">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#FF3B30] to-[#FF9500]"
                        initial={{ width: "0%" }}
                        animate={{ width: bothFilled ? "100%" : "0%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                {/* Left Col: Resume Upload */}
                <div className="flex-1 z-10">
                    <div className="mb-4">
                        <h3 className="font-playfair text-2xl font-bold text-white">Your Resume</h3>
                        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">PDF Format</p>
                    </div>

                    <motion.div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !resumeText && inputRef.current?.click()}
                        className={`
              h-[300px] rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300
              ${resumeText ? 'bg-[#34C759]/10 border border-[#34C759]/30' : 'bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer'}
              ${isDragging ? 'border-[#FF3B30] bg-[#FF3B30]/5' : ''}
              glass-card
            `}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) processFile(f);
                            }}
                            className="hidden"
                        />

                        {resumeText ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#34C759]/20 flex items-center justify-center text-[#34C759]">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <p className="font-playfair text-xl font-bold text-[#34C759]">Resume Loaded</p>
                                    <p className="font-mono text-xs text-white/60 mt-2 truncate max-w-[200px]">{fileName}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setResumeText(null); setFileName(null); }}
                                    className="mt-4 text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                >
                                    Change File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" /></svg>
                                </div>
                                <div>
                                    <p className="font-playfair text-xl font-bold">Upload PDF</p>
                                    <p className="font-mono text-xs text-white/40 mt-2">Click or drag & drop</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Col: JD Textarea */}
                <div className="flex-1 z-10">
                    <div className="mb-4">
                        <h3 className="font-playfair text-2xl font-bold text-white">Job Description</h3>
                        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">Paste entire text</p>
                    </div>

                    <div className="h-[300px] relative">
                        <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste the job description here — LinkedIn, Indeed, Greenhouse, anywhere."
                            className={`
                w-full h-full rounded-3xl p-6 bg-white/[0.02] border transition-all duration-300 resize-none font-mono text-sm leading-relaxed text-white/80 focus:outline-none placeholder:text-white/20 glass-card
                ${jdText.length > 50 ? 'border-[#FF9500]/30 bg-[#FF9500]/5' : 'border-white/10 focus:border-white/30 focus:bg-white/[0.04]'}
              `}
                        />
                        <div className="absolute bottom-4 right-6 font-mono text-[10px] text-white/30">
                            {jdText.length} chars
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center p-4 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] font-mono text-sm"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center pt-8">
                <motion.button
                    onClick={handleSubmit}
                    disabled={!bothFilled || isLoading}
                    whileHover={bothFilled ? { scale: 1.02 } : {}}
                    whileTap={bothFilled ? { scale: 0.98 } : {}}
                    className={`
            px-12 py-5 rounded-full font-mono font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all duration-300
            ${bothFilled
                            ? 'bg-[#FF3B30] text-white shadow-[0_0_30px_rgba(255,59,48,0.3)] hover:shadow-[0_0_50px_rgba(255,59,48,0.5)] cursor-pointer'
                            : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}
          `}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Match...
                        </>
                    ) : (
                        <>
                            Analyze Match
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
