'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DiffMatchPatch from 'diff-match-patch';

interface BulletRewriterProps {
  originalBullet: string;
  onRewrite: (newBullet: string) => void;
}

const dmp = new DiffMatchPatch();

export default function BulletRewriter({ originalBullet, onRewrite }: BulletRewriterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenBullet, setRewrittenBullet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: originalBullet }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite bullet');
      }

      const data = await response.json();
      setRewrittenBullet(data.rewritten);
    } catch (err) {
      setError('Failed to rewrite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDiff = () => {
    if (!rewrittenBullet) return [];
    const diffs = dmp.diff_main(originalBullet, rewrittenBullet);
    dmp.diff_cleanupSemantic(diffs);
    return diffs;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-[#F5F0E8]/5 rounded-lg border border-[#F5F0E8]/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-mono text-sm text-[#F5F0E8]/60 mb-2">Original:</p>
          <p className="font-mono text-[#F5F0E8]">{originalBullet}</p>
        </div>

        <button
          onClick={handleRewrite}
          disabled={isLoading}
          className="px-4 py-2 bg-[#34C759] text-[#0D0D0D] font-mono text-sm font-bold rounded hover:bg-[#34C759]/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isLoading ? 'Fixing...' : 'Fix It'}
        </button>
      </div>

      {error && (
        <p className="mt-3 font-mono text-sm text-[#FF3B30]">{error}</p>
      )}

      {rewrittenBullet && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-[#F5F0E8]/10"
        >
          <p className="font-mono text-sm text-[#34C759] mb-2">Rewritten:</p>
          
          <div className="font-mono text-[#F5F0E8] leading-relaxed">
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

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onRewrite(rewrittenBullet)}
              className="px-3 py-1 bg-[#007AFF] text-[#F5F0E8] font-mono text-xs font-bold rounded hover:bg-[#007AFF]/90 transition-colors"
            >
              Use This
            </button>
            <button
              onClick={() => setRewrittenBullet(null)}
              className="px-3 py-1 bg-[#F5F0E8]/10 text-[#F5F0E8] font-mono text-xs rounded hover:bg-[#F5F0E8]/20 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

