import { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailGateProps {
    onSubmit: (email: string | undefined) => void;
    isLoading: boolean;
}

export default function EmailGate({ onSubmit, isLoading }: EmailGateProps) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            onSubmit(email);
        } else {
            // If invalid but submitted, we could just proceed without email or show error.
            // Easiest is to just require valid if they type, but let them skip.
            if (!email) {
                onSubmit(undefined);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 text-center relative overflow-hidden bg-black/60 border-white/10 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent opacity-30" />

                <div className="w-16 h-16 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔥</span>
                </div>

                <h3 className="font-playfair text-3xl font-bold text-white mb-3 leading-tight">
                    Where should we send your roast report?
                </h3>

                <p className="font-mono text-xs text-white/40 mb-8 leading-relaxed px-4">
                    Get a beautiful HTML copy of your results straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        disabled={isLoading}
                        className="w-full px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#FF3B30]/50 focus:bg-white/[0.05] transition-all font-mono text-sm text-white placeholder:text-white/20 outline-none text-center"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-[#FF3B30] text-white font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#ff5247] transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,59,48,0.3)]"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            "Roast My Resume →"
                        )}
                    </button>
                </form>

                <button
                    onClick={() => onSubmit(undefined)}
                    disabled={isLoading}
                    className="mt-6 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                >
                    Skip, I just want to see it here
                </button>

                <p className="mt-8 font-mono text-[9px] text-white/20 uppercase tracking-widest">
                    No spam, just your results.
                </p>
            </div>
        </motion.div>
    );
}
