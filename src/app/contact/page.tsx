'use client';

import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F0E8] selection:bg-[#FF3B30] selection:text-white pb-32">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF3B30]/10 rounded-full blur-[120px]" />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="ResuméRoast" className="w-8 h-8 rounded-lg object-cover" />
                        <h1 className="font-playfair text-2xl font-bold tracking-tight">
                            Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
                        </h1>
                    </a>
                </div>
            </header>

            <main className="pt-40 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6">Get in Touch</h2>
                        <p className="font-inter text-xl text-white/50">
                            Have a question about your roast? Need support? Reach out to the creator directly.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-[2.5rem] p-12 relative overflow-hidden text-center"
                    >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF3B30]/10 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#FF3B30] to-[#FF9500] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(255,59,48,0.3)]">
                                <span className="text-4xl font-bold text-white uppercase italic">AK</span>
                            </div>

                            <h3 className="font-playfair text-3xl font-bold mb-2">Akhil Kumar D</h3>
                            <p className="font-mono text-[#FF3B30] text-sm uppercase tracking-widest mb-8 font-bold">Creator of ResuméRoast</p>

                            <div className="space-y-6">
                                <a
                                    href="tel:9513000000"
                                    className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xl font-mono"
                                >
                                    <svg className="w-6 h-6 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    9513******
                                </a>
                            </div>

                            <p className="mt-12 font-inter text-sm text-white/30 italic">
                                Typical response time: Within 24 hours of being roasted.
                            </p>
                        </div>
                    </motion.div>

                    <div className="mt-12 text-center">
                        <a href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors underline decoration-[#FF3B30] underline-offset-4">
                            Back to Safety
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
