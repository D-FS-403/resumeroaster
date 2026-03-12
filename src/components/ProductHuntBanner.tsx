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
                href="https://www.producthunt.com/posts/resume-roast"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#FF6154] rounded-full font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-colors shrink-0"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.604 8.4h-3.405V12h3.405c.98 0 1.8-.82 1.8-1.8 0-.98-.82-1.8-1.8-1.8z"/>
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.8V6h5.804c2.321 0 4.2 1.879 4.2 4.2 0 2.321-1.879 4.2-4.2 4.2z"/>
                </svg>
                Upvote Us
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
