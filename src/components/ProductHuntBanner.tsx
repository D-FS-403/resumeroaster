'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductHuntBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('ph_banner_dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('ph_banner_dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[60] bg-gradient-to-r from-[#FF6154]/90 to-[#FF3B30]/90 backdrop-blur-sm border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 justify-center">
              {/* ProductHunt cat icon */}
              <span className="text-xl">🐱</span>
              <p className="font-mono text-xs text-white font-bold uppercase tracking-wide">
                We&apos;re live on ProductHunt!{' '}
                <span className="hidden sm:inline"> Support us &amp; get 20% off Pro with code </span>
                <span className="sm:hidden"> Code </span>
                <span className="bg-white/20 px-2 py-0.5 rounded font-bold ml-1">PHLAUNCH</span>
              </p>
              <a
                href="https://www.producthunt.com/posts/resumeroast-2?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-resumeroast-2"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex shrink-0"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1096162&theme=dark&t=1773298706813"
                  alt="ResuméRoast - Brutal AI feedback. Better resumes. More interviews. | Product Hunt"
                  width="180"
                  height="40"
                  className="h-[34px] w-auto"
                />
              </a>
            </div>
            <button onClick={dismiss} className="text-white/60 hover:text-white transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
