'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your inbox (and spam folder).',
      });
      setEmail('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send magic link',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF3B30]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF9500]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <a href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#FF3B30] rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-[0_0_30px_rgba(255,59,48,0.4)]">
              R
            </div>
            <h1 className="font-playfair text-3xl font-bold tracking-tight">
              Resumé<span className="text-[#FF3B30] text-glow">Roast</span>
            </h1>
          </a>
          <h2 className="font-playfair text-4xl font-bold mb-3">Welcome back</h2>
          <p className="font-mono text-sm text-white/40">
            Sign in to access your dashboard, saved roasts, and Pro features.
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 border border-white/5"
        >
          <form onSubmit={handleMagicLink} className="space-y-6">
            <div>
              <label className="block font-mono text-white/60 text-xs uppercase tracking-widest mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF3B30] focus:bg-white/[0.08] transition-all"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-[#FF3B30] text-white font-mono text-sm font-bold uppercase tracking-widest rounded-2xl disabled:opacity-50 hover:bg-[#FF3B30]/90 transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </motion.button>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl font-mono text-sm ${
                  message.type === 'success'
                    ? 'bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759]'
                    : 'bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30]'
                }`}
              >
                {message.type === 'success' && (
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-bold">Check your email!</span>
                  </div>
                )}
                {message.text}
              </motion.div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="font-mono text-xs text-white/30">
              No password needed. We'll email you a secure sign-in link.
            </p>
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
