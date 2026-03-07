'use client';

import { motion } from 'framer-motion';

interface RoastHistoryCardProps {
    roast: {
        id: string;
        overall_score: number;
        grade: string;
        roast_headline: string;
        created_at: string;
    };
}

export default function RoastHistoryCard({ roast }: RoastHistoryCardProps) {
    const date = new Date(roast.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const scoreColor = roast.overall_score >= 75 ? '#34C759' : roast.overall_score >= 50 ? '#FF9500' : '#FF3B30';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 border-white/5 hover:border-white/10 transition-colors bg-white/[0.02]"
        >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">{date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-tighter" style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}>
                        Grade {roast.grade}
                    </span>
                </div>
                <h4 className="font-playfair text-xl md:text-2xl font-bold text-white/90 italic leading-snug">
                    "{roast.roast_headline}"
                </h4>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                <div className="text-center md:text-right flex-1 md:flex-none">
                    <span className="block font-playfair text-4xl font-bold" style={{ color: scoreColor }}>
                        {roast.overall_score}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Score</span>
                </div>

                <a
                    href={`/roast/${roast.id}`}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-mono text-xs uppercase font-bold tracking-widest shrink-0"
                >
                    View Report
                </a>
            </div>
        </motion.div>
    );
}
