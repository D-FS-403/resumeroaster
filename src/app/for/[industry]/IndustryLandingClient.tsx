'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { IndustryContent } from '@/lib/industryContent';
import PDFUploader from '@/components/PDFUploader';
import ScoreCard from '@/components/ScoreCard';
import UpgradeModal from '@/components/UpgradeModal';
import AuthForm from '@/components/AuthForm';
import { RoastResult } from '@/lib/pdfExtractor';
import { supabase } from '@/lib/supabase';

interface IndustryLandingClientProps {
  content: IndustryContent;
}

export default function IndustryLandingClient({ content }: IndustryLandingClientProps) {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);

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

  const handleRoastComplete = (result: RoastResult) => {
    setRoastResult(result);
  };

  const exampleResult: RoastResult = {
    overallScore: content.exampleRoastScore,
    grade: content.exampleRoastScore >= 90 ? 'A' : content.exampleRoastScore >= 80 ? 'B' : content.exampleRoastScore >= 70 ? 'C' : content.exampleRoastScore >= 60 ? 'D' : 'F',
    roastHeadline: content.exampleRoastHeadline,
    badges: [],
    categories: content.exampleCategories,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8] selection:bg-[#FF3B30] selection:text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF3B30]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#FF9500]/5 rounded-full blur-[100px]" />
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

          <div className="hidden md:flex items-center gap-4">
            <a href="/" className="font-mono text-sm text-white/60 hover:text-white transition-colors">
              Home
            </a>
            <a href="/#pricing" className="font-mono text-sm text-white/60 hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
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

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF3B30] font-bold italic">
                For {content.title.toLowerCase().replace(' resume roaster', '')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-[0.95]"
            >
              {content.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-lg text-white/50 mb-12 max-w-2xl mx-auto"
            >
              {content.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {!roastResult ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B30] to-[#FF9500] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative glass-card rounded-2xl p-2 bg-black/40">
                    <PDFUploader
                      onRoastComplete={handleRoastComplete}
                      onUpgradeNeeded={() => setShowUpgradeModal(true)}
                      isPro={isPro}
                      userId={user?.id}
                    />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <ScoreCard result={roastResult} />
                  <button
                    onClick={() => setRoastResult(null)}
                    className="mt-6 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-mono text-sm hover:bg-white/10 transition-all"
                  >
                    Roast Another
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                We Know Your <span className="text-[#FF3B30]">Pain</span>
              </h2>
              <p className="font-mono text-white/50">
                These resume mistakes are killing your chances
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.painPoints.map((pain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6 border-l-2 border-[#FF3B30]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30] text-xs font-bold shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-white/70 font-inter text-sm leading-relaxed">
                      {pain}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Demo Scorecard */}
        <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                See What We <span className="text-[#FF3B30]">Catch</span>
              </h2>
              <p className="font-mono text-white/50">
                Example analysis for {content.title.toLowerCase()}
              </p>
            </motion.div>

            <DemoScoreCard result={exampleResult} />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                Frequently <span className="text-[#FF3B30]">Asked</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {content.faqItems.map((faq, index) => (
                <FAQItem key={index} question={faq.q} answer={faq.a} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF3B30]/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get <span className="text-[#FF3B30]">Roasted</span>?
                </h2>
                <p className="font-mono text-white/50 mb-8">
                  Upload your resume and get a savage, AI-powered critique in 30 seconds
                </p>
                <a
                  href="#roast"
                  className="inline-block px-8 py-4 bg-[#FF3B30] text-white font-mono text-sm font-bold rounded-full hover:bg-[#FF3B30]/90 transition-all accent-glow"
                >
                  Roast My Resume
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-16 pb-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono text-white/30 text-xs">
            © {new Date().getFullYear()} ResuméRoast. All rights reserved.
          </p>
        </div>
      </footer>

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
              Sign in to save your roasts and access pro features.
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

function DemoScoreCard({ result }: { result: RoastResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-3xl p-8"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#FF3B30]/10 border-2 border-[#FF3B30] mb-4">
          <span className="font-playfair text-4xl font-bold text-[#FF3B30]">
            {result.overallScore}
          </span>
        </div>
        <p className="font-playfair text-2xl font-bold text-[#FF3B30]">
          {result.roastHeadline}
        </p>
      </div>

      <div className="space-y-4">
        {result.categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-24 font-mono text-xs text-white/60 shrink-0">
              {category.name}
            </div>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${category.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full rounded-full ${
                  category.score >= 70
                    ? 'bg-[#34C759]'
                    : category.score >= 50
                    ? 'bg-[#FF9500]'
                    : 'bg-[#FF3B30]'
                }`}
              />
            </div>
            <div className="w-12 font-mono text-xs text-white/40 text-right">
              {category.score}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-mono text-sm text-[#F5F0E8] pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5">
              <p className="font-inter text-sm text-white/50 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
