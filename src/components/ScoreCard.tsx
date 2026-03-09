'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { RoastResult } from '@/lib/pdfExtractor';

interface ScoreCardProps {
  result: RoastResult;
}

const getScoreColor = (score: number): string => {
  if (score <= 40) return '#FF3B30';
  if (score <= 70) return '#FF9500';
  return '#34C759';
};

const getGradeColor = (grade: string): string => {
  const g = grade.toUpperCase();
  if (['A', 'A+', 'A-'].includes(g)) return '#34C759';
  if (['B', 'B+', 'B-'].includes(g)) return '#34C759';
  if (['C', 'C+', 'C-'].includes(g)) return '#FF9500';
  return '#FF3B30';
};

export default function ScoreCard({ result }: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const end = result.overallScore;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedScore(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, result.overallScore]);

  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
        {/* Left Strategy Column: The Verdict & Grade */}
        <div className="lg:w-1/3 flex flex-col gap-10">
          <div className="glass-card rounded-[2.5rem] p-10 bg-black/40 border-white/5 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent opacity-30" />

            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-8">VERDICT GRADE</span>

            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ backgroundColor: getScoreColor(result.overallScore) }}
              />

              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 8" opacity="0.1" />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke={getScoreColor(result.overallScore)}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 120}
                  initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - result.overallScore / 100) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>

              <div className="relative flex flex-col items-center">
                <span className="font-playfair text-8xl font-bold tracking-tighter leading-none" style={{ color: getScoreColor(result.overallScore) }}>
                  {animatedScore}
                </span>
                <span className="font-playfair text-4xl font-bold italic mt-2" style={{ color: getGradeColor(result.grade) }}>
                  {result.grade}
                </span>
              </div>
            </div>

            <motion.div 
              className="flex flex-wrap justify-center gap-2 mt-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.8, 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
              }}
            >
              {result.badges.map((badge, i) => (
                <motion.span 
                  key={i} 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + (i * 0.1), type: "spring", stiffness: 300, damping: 15 }}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-[10px] text-white/40 uppercase tracking-widest font-bold"
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-10 bg-[#FF3B30]/5 border-[#FF3B30]/10">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF3B30] font-bold mb-4 block text-center lg:text-left">THE SUMMARY</span>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold leading-tight text-white mb-6 text-center lg:text-left italic">
              "{result.roastHeadline}"
            </h3>
          </div>
        </div>

        {/* Right Dashboard Column: Metrics Grid */}
        <div className="lg:w-2/3">
          <AnimatePresence>
            {isInView && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {result.categories.map((category, i) => (
                  <motion.div
                    key={category.name}
                    onMouseEnter={() => setHoveredCategory(i)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`
                       p-8 rounded-[2rem] border transition-all duration-500 relative flex flex-col
                       ${hoveredCategory === i
                        ? 'bg-white/[0.08] border-white/20 scale-[1.01]'
                        : 'bg-white/[0.03] border-white/5'}
                     `}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">
                        {category.name}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-bold" style={{ color: getScoreColor(category.score) }}>
                          {category.score}%
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border"
                          style={{
                            color: getGradeColor(category.grade),
                            borderColor: `${getGradeColor(category.grade)}30`,
                            backgroundColor: `${getGradeColor(category.grade)}10`
                          }}
                        >
                          {category.grade}
                        </span>
                      </div>
                    </div>

                    <p className="font-inter text-lg text-white/80 italic leading-relaxed mb-6 flex-1">
                      "{category.roastLine}"
                    </p>

                    <div className="mt-auto">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: getScoreColor(category.score) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${category.score}%` }}
                          transition={{ 
                            duration: 0.8, 
                            delay: i * 0.15,
                            ease: "easeOut"
                          }}
                        />
                      </div>
                    </div>

                    {category.tip && (
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-start gap-3 mt-4">
                        <span className="text-base">🧠</span>
                        <span className="font-mono text-[11px] text-white/50 leading-relaxed italic">
                          {category.tip}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
