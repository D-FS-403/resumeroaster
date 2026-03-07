'use client';

import { motion } from 'framer-motion';
import { JobMatchResult } from '@/types';

interface JobMatchResultsProps {
    result: JobMatchResult;
    isPro: boolean;
    onUpgradeNeeded: () => void;
}

export default function JobMatchResults({ result, isPro, onUpgradeNeeded }: JobMatchResultsProps) {
    const scoreColor = result.matchScore >= 75 ? '#34C759' : result.matchScore >= 50 ? '#FF9500' : '#FF3B30';

    return (
        <div className="relative w-full max-w-6xl mx-auto space-y-12">
            {/* Gating overlay for free users */}
            {!isPro && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-xl bg-black/60 rounded-[3rem] border border-white/10">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-[#FF3B30] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,59,48,0.5)]">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h3 className="font-playfair text-4xl font-bold text-white mb-4">Job Match is a Pro Feature</h3>
                        <p className="font-mono text-sm text-white/60 mb-8 leading-relaxed">
                            Unlock AI-powered ATS scoring, critical skill gap analysis, and tailored bullet point tips designed for the exact role you want.
                        </p>
                        <button
                            onClick={onUpgradeNeeded}
                            className="px-8 py-4 bg-[#FF3B30] text-white rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#ff5247] transition-all shadow-[0_0_20px_rgba(255,59,48,0.4)]"
                        >
                            Go Pro for ₹9/mo
                        </button>
                    </div>
                </div>
            )}

            {/* Actual Results Content (Blurred if not pro) */}
            <div className={`space-y-12 transition-all duration-700 ${!isPro ? 'opacity-30 blur-md pointer-events-none select-none' : ''}`}>

                {/* Top Header: Gauge and Verdict */}
                <div className="flex flex-col lg:flex-row gap-8 items-center glass-card rounded-[3rem] p-10 bg-black/40">
                    <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="110" fill="none" stroke="white" strokeWidth="4" opacity="0.05" />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="110"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 110}
                                initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                                animate={{ strokeDashoffset: isPro ? 2 * Math.PI * 110 * (1 - result.matchScore / 100) : 0 }}
                                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                            />
                        </svg>
                        <div className="text-center">
                            <span className="font-playfair text-7xl font-bold tracking-tighter" style={{ color: scoreColor }}>
                                {result.matchScore}
                            </span>
                            <span className="font-mono text-xs text-white/40 block mt-2 uppercase tracking-widest">Match %</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4 font-bold">ATS Verdict</p>
                        <h3 className="font-playfair text-3xl md:text-5xl font-bold leading-tight italic text-white/90">
                            "{result.verdict}"
                        </h3>
                    </div>
                </div>

                {/* Middle Section: Keywords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Present */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-[#34C759]/10 bg-[#34C759]/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-[#34C759]" />
                            <h4 className="font-mono text-sm uppercase tracking-widest font-bold">Present Keywords</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.presentKeywords.map((kw, i) => (
                                <motion.span
                                    key={kw}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: isPro ? 1 : 0, opacity: isPro ? 1 : 0 }}
                                    transition={{ type: "spring", delay: 1 + (i * 0.05) }}
                                    className="px-4 py-2 bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] rounded-xl font-mono text-xs"
                                >
                                    {kw}
                                </motion.span>
                            ))}
                            {result.presentKeywords.length === 0 && <span className="font-mono text-xs text-white/30 italic">None found matching JD</span>}
                        </div>
                    </div>

                    {/* Missing */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-[#FF3B30]/10 bg-[#FF3B30]/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
                            <h4 className="font-mono text-sm uppercase tracking-widest font-bold">Missing Keywords</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.map((kw, i) => (
                                <motion.span
                                    key={kw}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: isPro ? 1 : 0, opacity: isPro ? 1 : 0 }}
                                    transition={{ type: "spring", delay: 1.5 + (i * 0.05) }}
                                    className="px-4 py-2 bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] rounded-xl font-mono text-xs"
                                >
                                    {kw}
                                </motion.span>
                            ))}
                            {result.missingKeywords.length === 0 && <span className="font-mono text-xs text-white/30 italic">Perfect match! No keywords missing.</span>}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Gaps & Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skill Gaps Table */}
                    <div className="glass-card rounded-[2.5rem] p-8">
                        <h4 className="font-mono text-sm uppercase tracking-widest font-bold text-white/60 mb-8 border-b border-white/5 pb-4">Critical Skill Gaps</h4>
                        <div className="space-y-6">
                            {result.skillGaps.map((gap, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-playfair text-xl font-bold text-white">{gap.skill}</span>
                                        <span className={`
                        px-3 py-1 font-mono text-[10px] uppercase font-bold rounded-md border
                        ${gap.importance === 'critical' ? 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]' : ''}
                        ${gap.importance === 'important' ? 'bg-[#FF9500]/10 border-[#FF9500]/20 text-[#FF9500]' : ''}
                        ${gap.importance === 'nice-to-have' ? 'bg-[#0A84FF]/10 border-[#0A84FF]/20 text-[#0A84FF]' : ''}
                      `}>
                                            {gap.importance}
                                        </span>
                                    </div>
                                    <p className="font-inter text-sm text-white/50 leading-relaxed">{gap.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tailoring Tips */}
                    <div className="glass-card rounded-[2.5rem] p-8 bg-black/60 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
                        <h4 className="font-mono text-sm uppercase tracking-widest font-bold text-white/60 mb-8 border-b border-white/5 pb-4">Actionable Tailoring Tips</h4>
                        <div className="space-y-4">
                            {result.tailoringTips.map((tip, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <span className="font-mono text-[10px] uppercase text-white/40 block mb-1">{tip.section}</span>
                                        <p className="font-inter text-sm text-white/80 leading-relaxed italic">"{tip.tip}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
