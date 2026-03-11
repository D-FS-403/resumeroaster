'use client';

import { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

function UpgradeSuccessContent() {
  useEffect(() => {
    // Refresh the session so the pro status is picked up across the app
    supabase.auth.refreshSession();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8] flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#34C759]/5 blur-[200px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center px-6 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#34C759]/20 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-12 h-12 text-[#34C759]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>

        <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4">
          You're <span className="text-[#34C759]">Pro</span> now!
        </h1>
        <p className="font-mono text-sm text-white/40 max-w-md mx-auto mb-12">
          Your account has been upgraded. All Pro features are now unlocked — unlimited roasts, interview prep, cover letters, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-8 py-4 bg-[#FF3B30] text-white rounded-2xl font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#FF3B30]/90 transition-all shadow-[0_0_30px_rgba(255,59,48,0.3)]"
          >
            Start Roasting
          </a>
          <a
            href="/dashboard"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono text-sm hover:bg-white/10 transition-all"
          >
            Go to Dashboard
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { icon: '🔥', label: 'Unlimited Roasts' },
            { icon: '🎯', label: 'Interview Prep' },
            { icon: '✉️', label: 'Cover Letters' },
            { icon: '📊', label: 'Job Matching' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 glass-card rounded-xl text-center"
            >
              <span className="text-xl block mb-1">{feature.icon}</span>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{feature.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-[#F5F0E8] flex items-center justify-center">
        <div className="animate-pulse font-mono text-white/40">Loading...</div>
      </div>
    }>
      <UpgradeSuccessContent />
    </Suspense>
  );
}
