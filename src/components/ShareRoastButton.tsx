'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareRoastButtonProps {
    roastId: string;
    score: number;
    headline: string;
}

export default function ShareRoastButton({ roastId, score, headline }: ShareRoastButtonProps) {
    const [isCopied, setIsCopied] = useState(false);
    const roastUrl = `https://resumeroaster.xyz/roast/${roastId}`;

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(roastUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleShareX = () => {
        const text = `My resume got roasted 🔥 I scored ${score}/100 — "${headline}" ${roastUrl} #ResumeRoast`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleShareLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(roastUrl)}`;
        window.open(url, '_blank');
    };

    if (!roastId) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <motion.button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-sm rounded-full font-bold flex items-center gap-2 transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isCopied ? (
                    <>
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        Copy Link
                    </>
                )}
            </motion.button>

            <motion.button
                onClick={handleShareX}
                className="px-6 py-3 bg-black hover:bg-gray-900 border border-white/20 text-white font-mono text-sm rounded-full font-bold flex items-center gap-2 transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share on X
            </motion.button>

            <motion.button
                onClick={handleShareLinkedIn}
                className="px-6 py-3 bg-[#0077b5] hover:bg-[#006396] border border-transparent text-white font-mono text-sm rounded-full font-bold flex items-center gap-2 transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Share on LinkedIn
            </motion.button>
        </div>
    );
}
