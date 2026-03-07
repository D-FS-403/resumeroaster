'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiffMatchPatch from 'diff-match-patch';

interface BulletRewriterProps {
  isPro: boolean;
  onUpgradeNeeded: () => void;
}

const dmp = new DiffMatchPatch();
const FREE_REWRITE_LIMIT = 3;
const STORAGE_KEY = 'bulletRewrites';

export default function BulletRewriter({ isPro, onUpgradeNeeded }: BulletRewriterProps) {
  const [inputBullet, setInputBullet] = useState('');
  const [rewrittenBullet, setRewrittenBullet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewriteCount, setRewriteCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRewriteCount(parseInt(stored, 10) || 0);
      }
    }
  }, []);

  const isLimited = !isPro && rewriteCount >= FREE_REWRITE_LIMIT;

  const handleRewrite = async () => {
    if (!inputBullet.trim()) return;
    
    if (isLimited) {
      onUpgradeNeeded();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: inputBullet, isPro }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite bullet');
      }

      const data = await response.json();
      setRewrittenBullet(data.rewritten);
      
      // Increment rewrite count for non-pro users
      if (!isPro) {
        const newCount = rewriteCount + 1;
        setRewriteCount(newCount);
        localStorage.setItem(STORAGE_KEY, newCount.toString());
      }
    } catch (err) {
      setError('Failed to rewrite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!rewrittenBullet) return;
    await navigator.clipboard.writeText(rewrittenBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDiff = () => {
    if (!rewrittenBullet) return [];
    const diffs = dmp.diff_main(inputBullet, rewrittenBullet);
    dmp.diff_cleanupSemantic(diffs);
    return diffs;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRewrite();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <AnimatePresence mode="wait">
        {isLimited ? (
          <motion.div
            key="limited"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF9500]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#FF9500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                  Free Limit Reached
                </h3>
                <p className="text-white/50 font-mono text-sm mb-6">
                  You've used all {FREE_REWRITE_LIMIT} free bullet rewrites. Upgrade to Pro for unlimited rewrites.
                </p>
                <button
                  onClick={onUpgradeNeeded}
                  className="px-6 py-3 bg-[#FF9500] text-black font-mono text-sm font-bold rounded-lg hover:bg-[#FF9500]/90 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
            <textarea
              value={inputBullet}
              onChange={(e) => setInputBullet(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your weak resume bullet here..."
              className="w-full h-32 bg-[#F5F0E8]/5 border border-[#F5F0E8]/10 rounded-xl p-4 font-mono text-sm text-[#F5F0E8] placeholder:text-white/20 resize-none focus:outline-none focus:border-[#34C759]/50"
              disabled={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <textarea
              value={inputBullet}
              onChange={(e) => setInputBullet(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your weak resume bullet here...

Example: Helped with the database"
              className="w-full h-32 bg-[#F5F0E8]/5 border border-[#F5F0E8]/10 rounded-xl p-4 font-mono text-sm text-[#F5F0E8] placeholder:text-white/20 resize-none focus:outline-none focus:border-[#34C759]/50"
              disabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isPro && (
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-xs text-white/30">
            {FREE_REWRITE_LIMIT - rewriteCount} free rewrites remaining
          </p>
          <button
            onClick={handleRewrite}
            disabled={isLoading || !inputBullet.trim() || isLimited}
            className="px-6 py-2 bg-[#34C759] text-[#0D0D0D] font-mono text-sm font-bold rounded-lg hover:bg-[#34C759]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Rewriting...' : 'Fix It'}
          </button>
        </div>
      )}

      {isPro && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleRewrite}
            disabled={isLoading || !inputBullet.trim()}
            className="px-6 py-2 bg-[#34C759] text-[#0D0D0D] font-mono text-sm font-bold rounded-lg hover:bg-[#34C759]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Rewriting...' : 'Fix It'}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 font-mono text-sm text-[#FF3B30]">{error}</p>
      )}

      {rewrittenBullet && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-[#F5F0E8]/10"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-sm text-[#34C759]">Rewritten:</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#007AFF]/20 text-[#007AFF] font-mono text-xs rounded-lg hover:bg-[#007AFF]/30 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Visual Diff */}
          <div className="bg-[#F5F0E8]/5 rounded-xl p-4 font-mono text-sm leading-relaxed">
            {getDiff().map(([type, text], index) => {
              if (type === 0) {
                return <span key={index}>{text}</span>;
              }
              return (
                <span
                  key={index}
                  className={type === 1 ? 'bg-[#34C759]/30 text-[#34C759] px-1 rounded' : 'bg-[#FF3B30]/30 text-[#FF3B30] line-through px-1 rounded'}
                >
                  {text}
                </span>
              );
            })}
          </div>

          {/* Original Bullet */}
          <div className="mt-4 pt-4 border-t border-[#F5F0E8]/5">
            <p className="font-mono text-xs text-white/30 mb-2">Original:</p>
            <p className="font-mono text-sm text-white/50">{inputBullet}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(rewrittenBullet);
                setInputBullet(rewrittenBullet);
                setRewrittenBullet(null);
              }}
              className="px-4 py-2 bg-[#007AFF] text-[#F5F0E8] font-mono text-xs font-bold rounded-lg hover:bg-[#007AFF]/90 transition-colors"
            >
              Use This
            </button>
            <button
              onClick={() => {
                setRewrittenBullet(null);
                setInputBullet('');
              }}
              className="px-4 py-2 bg-[#F5F0E8]/10 text-[#F5F0E8] font-mono text-xs rounded-lg hover:bg-[#F5F0E8]/20 transition-colors"
            >
              Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
