'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
    const sections = [
        {
            title: "Data Collection",
            content: "We don't collect your personal data beyond what's necessary to roast you. Your resume content is processed by AI and then promptly forgotten (unlike your embarrassing gap year)."
        },
        {
            title: "File Security",
            content: "Resumes are transmitted securely and never stored on our servers permanently. We value your privacy as much as you value a good font choice."
        },
        {
            title: "AI Processing",
            content: "We use third-party AI models to generate feedback. They see your resume, they judge it, they move on. No data is used for training without your explicit consent."
        },
        {
            title: "Contact Info",
            content: "If you sign up, we store your email to manage your roasts. We won't sell it to recruiters (they're already judging you for free)."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F0E8] selection:bg-[#FF3B30] selection:text-white pb-32">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,59,48,0.4)]">
                            R
                        </div>
                        <h1 className="font-playfair text-2xl font-bold tracking-tight">
                            Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
                        </h1>
                    </a>
                </div>
            </header>

            <main className="pt-40 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-8 italic">Privacy Policy</h2>
                        <p className="font-inter text-xl text-white/50 leading-relaxed">
                            Last updated: March 2024. Your secrets are safe with us, though your career choice might not be.
                        </p>
                    </motion.div>

                    <div className="grid gap-12">
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-3xl p-8 md:p-12"
                            >
                                <h3 className="font-playfair text-2xl font-bold mb-4 text-[#FF3B30]">{section.title}</h3>
                                <p className="font-inter text-lg text-white/60 leading-relaxed">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <a href="/" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all">
                            Accept & Go Back
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
