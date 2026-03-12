'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralBannerProps {
  roastScore: number;
  roastHeadline: string;
}

export default function ReferralBanner({ roastScore, roastHeadline }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const shareText = `My resume just got roasted 🔥 I scored ${roastScore}/100 — "${roastHeadline}" Get yours roasted free at resumeroaster.xyz`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://resumeroaster.xyz')}&summary=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText('https://resumeroaster.xyz');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative glass-card rounded-3xl p-8 border border-[#FF9500]/20 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF9500] to-transparent opacity-40" />
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-playfair text-2xl font-bold text-white mb-1">
              Share your roast. Help a friend.
            </h3>
            <p className="font-mono text-xs text-white/40 leading-relaxed">
              Know someone whose resume needs saving? Share ResuméRoast — it's free.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end shrink-0">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-black border border-white/10 hover:border-white/20 text-white font-mono text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#0077B5]/20 border border-[#0077B5]/30 hover:border-[#0077B5]/60 text-[#0077B5] font-mono text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white/60 font-mono text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
