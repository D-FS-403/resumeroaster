'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface AuthFormProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Check your email for the magic link!',
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleMagicLink} className="space-y-4">
        <div>
          <label className="block font-mono text-[#F5F0E8]/60 text-sm mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-[#F5F0E8]/10 border border-[#F5F0E8]/30 rounded-lg font-mono text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:outline-none focus:border-[#FF3B30] transition-colors"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#FF3B30] text-[#F5F0E8] font-mono font-bold rounded-lg disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 rounded-lg font-mono text-sm ${
              message.type === 'success'
                ? 'bg-[#34C759]/20 text-[#34C759]'
                : 'bg-[#FF3B30]/20 text-[#FF3B30]'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <p className="text-center font-mono text-[#F5F0E8]/40 text-sm">
          No password required. We'll send you a magic link to sign in.
        </p>
      </form>
    </motion.div>
  );
}

