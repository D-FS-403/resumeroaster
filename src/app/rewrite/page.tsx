'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BulletRewriter from '@/components/BulletRewriter';
import UpgradeModal from '@/components/UpgradeModal';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabase';

export default function RewritePage() {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from('users')
          .select('is_pro')
          .eq('id', session.user.id)
          .single();
        setIsPro(data?.is_pro || false);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8] selection:bg-[#FF3B30] selection:text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#34C759]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#007AFF]/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,59,48,0.4)]">
                R
              </div>
              <h1 className="font-playfair text-2xl font-bold tracking-tight">
                Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
              </h1>
            </a>
          </motion.div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-mono text-xs text-white/40">
                  {user.email}
                </span>
                {isPro && (
                  <span className="px-2 py-0.5 bg-[#FF9500] text-black text-[10px] font-bold rounded uppercase tracking-tighter">
                    PRO
                  </span>
                )}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="font-mono text-xs text-white/60 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs hover:bg-white/10 transition-all hover:border-white/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#34C759] font-bold italic">
                AI Powered • XYZ Formula
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Fix Your <span className="text-[#34C759]">Resume Bullets</span>
            </h1>
            <p className="font-mono text-white/40 text-sm max-w-xl mx-auto">
              Paste weak resume bullets and get AI-improved versions with visual diffing
            </p>
          </motion.div>

          {/* XYZ Formula Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#34C759] font-bold mb-4">
              The XYZ Formula
            </h3>
            <div className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              Accomplished <span className="text-[#007AFF]">[X]</span> as measured by{' '}
              <span className="text-[#34C759]">[Y]</span>, by doing{' '}
              <span className="text-[#FF9500]">[Z]</span>
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#007AFF]/20 flex items-center justify-center text-[#007AFF] text-xs font-bold shrink-0">X</div>
                <p className="text-white/60 text-sm">What you achieved (the result)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#34C759]/20 flex items-center justify-center text-[#34C759] text-xs font-bold shrink-0">Y</div>
                <p className="text-white/60 text-sm">How you measured it (the metrics)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF9500]/20 flex items-center justify-center text-[#FF9500] text-xs font-bold shrink-0">Z</div>
                <p className="text-white/60 text-sm">How you did it (the action)</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">Example</p>
              <p className="text-[#F5F0E8] font-mono">
                <span className="text-[#FF3B30]">Before:</span> "Helped with the database"
              </p>
              <p className="text-[#34C759] font-mono mt-1">
                <span className="text-[#34C759]">After:</span> "Optimized database queries, reducing API latency by 40% through indexing and caching"
              </p>
            </div>
          </motion.div>

          {/* Bullet Rewriter Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BulletRewriter
              isPro={isPro}
              onUpgradeNeeded={() => setShowUpgradeModal(true)}
            />
          </motion.div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => setShowUpgradeModal(true)}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative glass-card rounded-3xl p-8 max-w-md w-full"
          >
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-playfair text-3xl font-bold text-white mb-2">
              Join the Roast
            </h3>
            <p className="text-white/40 font-mono text-xs mb-8">
              Sign in to save your roasts, access pro features, and see your career history.
            </p>
            <AuthForm
              onAuthSuccess={(user) => {
                setUser(user);
                setShowAuth(false);
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
