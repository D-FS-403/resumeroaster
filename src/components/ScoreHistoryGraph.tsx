'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoastDataPoint {
    id: string;
    overall_score: number;
    grade: string;
    roast_headline: string;
    created_at: string;
}

interface ScoreHistoryGraphProps {
    data: RoastDataPoint[];
}

export default function ScoreHistoryGraph({ data }: ScoreHistoryGraphProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    if (!data || data.length < 2) {
        return (
            <div className="w-full h-[300px] rounded-[3rem] glass-card flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                </div>
                <h4 className="font-playfair text-2xl font-bold text-white mb-2">Not enough data</h4>
                <p className="font-mono text-sm text-white/40 max-w-sm">Roast at least one more resume version to see your improvement trajectory.</p>
            </div>
        );
    }

    // Determine chart dimensions
    const CHR_WIDTH = 800;
    const CHR_HEIGHT = 300;
    const PADDING_TOP = 40;
    const PADDING_BOTTOM = 40;
    const PADDING_LEFT = 20;
    const PADDING_RIGHT = 20;

    const X_RANGE = CHR_WIDTH - PADDING_LEFT - PADDING_RIGHT;
    const Y_RANGE = CHR_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    // X points based on chronological index
    const getX = (index: number) => {
        if (data.length === 1) return PADDING_LEFT + X_RANGE / 2;
        return PADDING_LEFT + (index / (data.length - 1)) * X_RANGE;
    };

    // Y points scaled 0-100 to fit Y_RANGE
    const getY = (score: number) => {
        // Top is 100, Bottom is 0. So y = 0 means 100.
        const normalizedScore = Math.max(0, Math.min(100, score));
        return PADDING_TOP + Y_RANGE - (normalizedScore / 100) * Y_RANGE;
    };

    // Generate SVG Path
    const pts = data.map((d, i) => `${getX(i)},${getY(d.overall_score)}`);

    // Create a smooth curve
    let dPath = `M ${pts[0]}`;
    for (let i = 1; i < pts.length; i++) {
        // For simplicity, straight lines, or bezier if preferred. Using straight for reliable rendering.
        dPath += ` L ${pts[i]}`;
    }

    // Create area fill path
    const dFill = `${dPath} L ${getX(data.length - 1)},${CHR_HEIGHT} L ${getX(0)},${CHR_HEIGHT} Z`;

    return (
        <div className="relative w-full overflow-x-auto overflow-y-hidden pb-8 scrollbar-hide">
            <div className="min-w-[600px] h-[340px] relative">
                <svg viewBox={`0 0 ${CHR_WIDTH} ${CHR_HEIGHT}`} className="w-full h-full drop-shadow-2xl">
                    <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF9500" />
                            <stop offset="100%" stopColor="#34C759" />
                        </linearGradient>
                        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34C759" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#34C759" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(score => (
                        <g key={score}>
                            <line
                                x1={PADDING_LEFT}
                                y1={getY(score)}
                                x2={CHR_WIDTH - PADDING_RIGHT}
                                y2={getY(score)}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={0}
                                y={getY(score) + 4}
                                fill="rgba(255,255,255,0.2)"
                                fontSize="10"
                                fontFamily="monospace"
                            >
                                {score}
                            </text>
                        </g>
                    ))}

                    {/* Fill Area */}
                    <motion.path
                        d={dFill}
                        fill="url(#fillGrad)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />

                    {/* Main Line */}
                    <motion.path
                        d={dPath}
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Interactive Points */}
                    {data.map((d, i) => {
                        const cx = getX(i);
                        const cy = getY(d.overall_score);
                        const isHovered = hoveredIdx === i;

                        return (
                            <g key={d.id}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                className="cursor-crosshair"
                            >
                                {/* Invisible larger hit area */}
                                <circle cx={cx} cy={cy} r="20" fill="transparent" />

                                {/* Visual point */}
                                <motion.circle
                                    cx={cx} cy={cy} r={isHovered ? 6 : 4}
                                    fill="#0D0D0D"
                                    stroke={d.overall_score >= 75 ? '#34C759' : d.overall_score >= 50 ? '#FF9500' : '#FF3B30'}
                                    strokeWidth={isHovered ? 4 : 2}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + i * 0.1, type: "spring" }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Floating Tooltip */}
                <AnimatePresence>
                    {hoveredIdx !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute pointer-events-none z-10 glass-card bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-64 transform -translate-x-1/2 -translate-y-[120%]"
                            style={{
                                left: `${(getX(hoveredIdx) / CHR_WIDTH) * 100}%`,
                                top: `${(getY(data[hoveredIdx].overall_score) / CHR_HEIGHT) * 100}%`
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-[10px] uppercase text-white/40 tracking-widest">
                                    {new Date(data[hoveredIdx].created_at).toLocaleDateString()}
                                </span>
                                <span className="font-playfair text-xl font-bold text-[#34C759] leading-none">
                                    {data[hoveredIdx].overall_score}
                                </span>
                            </div>
                            <p className="font-inter text-sm text-white/90 italic leading-snug">
                                "{data[hoveredIdx].roast_headline}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
