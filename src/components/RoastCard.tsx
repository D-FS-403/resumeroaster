'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { RoastResult } from '@/lib/pdfExtractor';

interface RoastCardProps {
  result: RoastResult;
}

const getScoreColor = (score: number): string => {
  if (score <= 40) return '#FF3B30';
  if (score <= 70) return '#FF9500';
  return '#34C759';
};

// Helper for html2canvas compatibility - convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function RoastCard({ result }: RoastCardProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleExport = async () => {
    if (!exportRef.current || isExporting) return;

    setIsExporting(true);
    try {
      // Use html2canvas to capture the hidden high-res container
      const canvas = await html2canvas(exportRef.current, {
        width: 1200,
        height: 630,
        scale: 2,
        backgroundColor: '#050505',
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: 1200,
        windowHeight: 630,
        // Remove filters that html2canvas cannot parse (like oklab)
        onclone: (clonedDoc) => {
          const exportElement = clonedDoc.querySelector('[data-export-container]');
          if (exportElement) {
            // Force standard colors on the clone if needed
            (exportElement as HTMLElement).style.color = '#F5F0E8';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `resumeroast-${result.overallScore}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const text = `My resume got roasted 🔥 I scored ${result.overallScore}/100 — "${result.roastHeadline}" resumeroaster.xyz #ResumeRoast`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText('https://resumeroaster.xyz');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scoreColor = getScoreColor(result.overallScore);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Display Card (Responsive) */}
      <div className="relative group perspective-1000">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B30] to-[#FF9500] rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative glass-card rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/60 shadow-2xl flex flex-col md:flex-row min-h-[450px]">
          {/* Left Panel: The Headline */}
          <div className="flex-[7] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden bg-black/40">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[120%] blur-[120px] opacity-20 bg-[#FF3B30] rotate-[-12deg]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <span className="font-mono text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none italic">OFFICIAL VERDICT</span>
                </div>
              </div>
              <h2 className="text-white font-playfair text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
                {result.roastHeadline}
              </h2>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2 pt-8 border-t border-white/5 mt-auto">
              {result.badges.map((badge) => (
                <span key={badge} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right Panel: The Score / Metrics */}
          <div
            className="flex-[4] p-8 md:p-12 flex flex-col justify-between items-center text-center relative border-t md:border-t-0 md:border-l border-white/5"
            style={{ backgroundColor: hexToRgba(scoreColor, 0.05) }}
          >
            <div className="relative z-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-4 block">TOTAL SCORE</span>
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 blur-3xl opacity-40 rounded-full" style={{ backgroundColor: scoreColor }} />
                <span
                  className="relative font-playfair text-9xl md:text-[12rem] font-bold leading-none tracking-tighter"
                  style={{ color: scoreColor }}
                >
                  {result.overallScore}
                </span>
              </div>
              <div
                className="font-inter text-3xl md:text-5xl font-black italic tracking-tighter uppercase"
                style={{ color: scoreColor }}
              >
                GRADE {result.grade}
              </div>
            </div>

            <div className="w-full space-y-4 mt-12 relative z-10">
              {result.categories.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex flex-col gap-2 text-left">
                  <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <span>{cat.name}</span>
                    <span style={{ color: getScoreColor(cat.score) }}>{cat.score}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.score}%`, backgroundColor: getScoreColor(cat.score) }} />
                  </div>
                </div>
              ))}

              <div className="pt-8 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#FF3B30] rounded flex items-center justify-center font-bold text-white text-[10px]">R</div>
                  <p className="font-playfair text-lg text-white font-bold tracking-tight opacity-60">ResuméRoast</p>
                </div>
                <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em] font-bold">www.resumeroaster.xyz</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Export Container (Optimized for html2canvas compatibility) */}
      <div className="fixed top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
        <div
          ref={exportRef}
          data-export-container="true"
          className="w-[1200px] h-[630px] flex relative overflow-hidden p-20"
          style={{ backgroundColor: '#050505', color: '#F5F0E8', fontFamily: 'Inter, sans-serif' }}
        >
          {/* Export Background: Using Radial Gradient instead of Filter:Blur for html2canvas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-[-20%] right-[-10%] w-[80%] h-[140%] rotate-12"
              style={{
                background: `radial-gradient(circle, ${hexToRgba(scoreColor, 0.2)} 0%, transparent 70%)`
              }}
            />
          </div>

          <div className="flex-[7] flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="px-4 py-1 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="font-mono text-sm font-bold uppercase tracking-widest leading-none italic" style={{ color: 'rgba(255,255,255,0.4)' }}>OFFICIAL ROAST CARD</span>
                </div>
              </div>
              <h1 className="font-playfair text-8xl font-bold leading-[1.05] tracking-tight" style={{ color: '#FFFFFF' }}>
                {result.roastHeadline}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 mt-12">
              {result.badges.map((badge) => (
                <span key={badge} className="px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-widest font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-[4] flex flex-col justify-between items-center text-center relative z-10 pl-16" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex flex-col items-center">
              <span className="font-mono text-xs uppercase tracking-[0.4em] mb-12 block font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>TOTAL SCORE</span>
              <div
                className="font-playfair font-bold tracking-tighter"
                style={{ color: scoreColor, fontSize: '180px', lineHeight: '1', marginBottom: '20px' }}
              >
                {result.overallScore}
              </div>
              <div
                className="font-inter font-black italic tracking-tighter uppercase"
                style={{ color: scoreColor, fontSize: '48px', marginTop: '40px' }}
              >
                GRADE {result.grade}
              </div>
            </div>

            <div className="w-full text-right mt-12">
              <div className="flex items-center justify-end gap-3 mb-2">
                <div className="w-10 h-10 bg-[#FF3B30] rounded-lg flex items-center justify-center font-bold text-white text-base">R</div>
                <p className="font-playfair text-3xl text-white font-bold tracking-tight">ResuméRoast</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>www.resumeroaster.xyz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          onClick={handleExport}
          disabled={isExporting}
          className="group relative px-8 py-4 bg-white text-black font-mono rounded-full font-bold flex items-center gap-2 overflow-hidden shadow-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-[#FF3B30] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
            {isExporting ? "Exporting..." : "Download HD Card"}
          </span>
        </motion.button>

        <motion.button
          onClick={handleShare}
          className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono rounded-full font-bold flex items-center gap-2 transition-all shadow-xl"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          X Share
        </motion.button>

        <motion.button
          onClick={handleCopyLink}
          className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono rounded-full font-bold flex items-center gap-2 transition-all shadow-xl"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCopied ? "Copied!" : "Copy Link"}
        </motion.button>
      </div>
    </div>
  );
}
