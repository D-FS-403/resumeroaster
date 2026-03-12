'use client';

import { motion } from 'framer-motion';


const features = [
  {
    icon: '🔥',
    title: 'Resume Roast',
    desc: 'Brutally honest AI feedback on your resume. Scores, red flags, and actionable fixes — in 30 seconds.',
    color: '#FF3B30',
    href: '/',
  },
  {
    icon: '🎯',
    title: 'Job Match',
    desc: 'Paste a job description and see exactly how well your resume aligns. ATS score, missing keywords, and what to fix.',
    color: '#FF9500',
    href: '/match',
  },
  {
    icon: '🎤',
    title: 'Interview Prep',
    desc: 'AI generates the exact questions interviewers will ask based on YOUR resume — with expert sample answers.',
    color: '#007AFF',
    href: '/interview',
  },
  {
    icon: '✉️',
    title: 'Cover Letter',
    desc: 'One-click AI cover letters tailored to the job. Professional, personalized, and ready to send.',
    color: '#AF52DE',
    href: '/cover-letter',
  },
  {
    icon: '⚡',
    title: 'Bullet Fixer',
    desc: 'Rewrite weak resume bullets into powerful, metrics-driven achievements that get noticed.',
    color: '#34C759',
    href: '/rewrite',
  },
  {
    icon: '📊',
    title: 'Score History',
    desc: 'Track your resume improvements over time. See exactly how each tweak moved the needle.',
    color: '#FF6154',
    href: '/dashboard',
  },
];

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Software Engineer — landed offer at Stripe',
    avatar: 'P',
    color: '#007AFF',
    quote:
      'I\'d been applying for 3 months with zero callbacks. ResuméRoast showed me my resume was getting filtered by ATS before a human ever saw it. Fixed the keywords, got 4 interviews in the next 2 weeks.',
  },
  {
    name: 'Marcus T.',
    role: 'Product Manager — transitioned from consulting',
    avatar: 'M',
    color: '#34C759',
    quote:
      'The interview prep feature is insane. It predicted 6 out of 8 questions I was actually asked in my Google loop. The sample answers gave me a framework I could make my own.',
  },
  {
    name: 'Leila K.',
    role: 'UX Designer — recent grad',
    avatar: 'L',
    color: '#AF52DE',
    quote:
      'As a new grad I had no idea what was wrong with my resume. The roast was blunt but fair — it told me my bullet points were just job duties, not achievements. Total game changer.',
  },
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F0E8]">
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF6154]/6 rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[40%] h-[40%] bg-[#FF3B30]/5 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-[#FF9500]/4 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ResuméRoast" className="w-8 h-8 rounded-lg object-cover" />
            <h1 className="font-playfair text-2xl font-bold tracking-tight">
              Resumé<span className="text-[#FF3B30]" style={{ textShadow: '0 0 20px rgba(255,59,48,0.5)' }}>Roast</span>
            </h1>
          </a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
            <a href="/" className="text-white/60 hover:text-white transition-colors">Roast</a>
            <a href="/match" className="text-white/60 hover:text-white transition-colors">Job Match</a>
            <a href="/interview" className="text-white/60 hover:text-white transition-colors">Interview Prep</a>
            <a href="/cover-letter" className="text-white/60 hover:text-white transition-colors">Cover Letter</a>
            <a href="/rewrite" className="text-white/60 hover:text-white transition-colors">Bullet Fixer</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://www.producthunt.com/posts/resumeroast-2?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-resumeroast-2"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1096162&theme=dark&t=1773298706813"
                alt="ResuméRoast on Product Hunt"
                width="200"
                height="43"
                className="h-[36px] w-auto"
              />
            </a>
            <a href="/login" className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs hover:bg-white/10 transition-all">
              Sign In
            </a>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-[#FF6154]/10 border border-[#FF6154]/25">
              <span className="text-sm">🐱</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF6154] font-bold">
                Live on ProductHunt Today
              </span>
            </div>

            <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
              We&apos;re Live on
              <br />
              <span style={{ color: '#FF6154' }} className="italic">ProductHunt</span>
              <span className="ml-3">🐱</span>
            </h2>

            <p className="max-w-2xl mx-auto font-mono text-sm text-white/50 mb-10 leading-relaxed">
              ResuméRoast gives job seekers brutally honest AI feedback on their resumes —
              plus interview prep, cover letter generation, ATS job matching, and more.
              All in one place. Free to start.
            </p>

            {/* Launch offer pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-12 px-6 py-4 rounded-2xl border border-[#FF6154]/30 bg-[#FF6154]/8"
            >
              <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-1">Launch Offer</p>
              <p className="font-playfair text-xl font-bold text-[#F5F0E8]">
                First 100 hunters get <span style={{ color: '#FF6154' }}>20% off Pro</span>
              </p>
              <p className="font-mono text-xs text-white/50 mt-1">
                Use code{' '}
                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">PHLAUNCH</span>
                {' '}at checkout
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF3B30] text-white rounded-full font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#FF3B30]/85 transition-colors shadow-[0_0_30px_rgba(255,59,48,0.3)]"
              >
                Get Roasted Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.producthunt.com/posts/resumeroast-2"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6154]/15 text-[#FF6154] border border-[#FF6154]/30 rounded-full font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#FF6154]/25 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.604 8.4h-3.405V12h3.405c.98 0 1.8-.82 1.8-1.8 0-.98-.82-1.8-1.8-1.8z"/>
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.8V6h5.804c2.321 0 4.2 1.879 4.2 4.2 0 2.321-1.879 4.2-4.2 4.2z"/>
                </svg>
                Upvote on ProductHunt
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Feature showcase */}
        <section className="max-w-6xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                Everything You Need to Get Hired
              </span>
            </div>
            <h3 className="font-playfair text-4xl md:text-5xl font-bold">
              Six tools. One mission.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.a
                key={feature.title}
                href={feature.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 group cursor-pointer block"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  {feature.icon}
                </div>
                <h4
                  className="font-playfair text-xl font-bold mb-2"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h4>
                <p className="font-mono text-xs text-white/45 leading-relaxed">
                  {feature.desc}
                </p>
                <div
                  className="mt-4 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: feature.color }}
                >
                  Try it free
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[#34C759]/10 border border-[#34C759]/20">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#34C759] font-bold">
                Real Results from Real Job Seekers
              </span>
            </div>
            <h3 className="font-playfair text-4xl md:text-5xl font-bold">
              It actually works.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-[#FF9500]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="font-mono text-xs text-white/60 leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-white">{t.name}</p>
                    <p className="font-mono text-[10px] text-white/35">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats bar */}
        <section className="max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '10,000+', label: 'Resumes Roasted' },
              { value: '94%', label: 'User Satisfaction' },
              { value: '30s', label: 'Average Analysis Time' },
              { value: 'Free', label: 'To Get Started' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-playfair text-3xl font-bold text-[#FF6154] mb-1">{stat.value}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <h3 className="font-playfair text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stop guessing.
              <br />
              <span className="text-[#FF3B30] italic">Start getting hired.</span>
            </h3>
            <p className="font-mono text-sm text-white/40 mb-10 max-w-xl mx-auto">
              Your resume is the first impression. Make it impossible to ignore.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.a
                href="/"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FF3B30] text-white rounded-full font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#FF3B30]/85 transition-colors shadow-[0_0_40px_rgba(255,59,48,0.35)]"
              >
                Get Roasted Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.producthunt.com/posts/resumeroast-2"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FF6154]/15 text-[#FF6154] border border-[#FF6154]/30 rounded-full font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#FF6154]/25 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.604 8.4h-3.405V12h3.405c.98 0 1.8-.82 1.8-1.8 0-.98-.82-1.8-1.8-1.8z"/>
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.8V6h5.804c2.321 0 4.2 1.879 4.2 4.2 0 2.321-1.879 4.2-4.2 4.2z"/>
                </svg>
                Upvote on ProductHunt
              </motion.a>
            </div>

            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
              No credit card required &middot; Free tier always available &middot; Pro from $9/mo
            </p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF3B30] rounded-md flex items-center justify-center font-bold text-white text-xs">
              R
            </div>
            <span className="font-mono text-xs text-white/30">
              &copy; {new Date().getFullYear()} ResuméRoast. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] text-white/25 uppercase tracking-widest">
            <a href="/" className="hover:text-white/50 transition-colors">Home</a>
            <a href="/dashboard" className="hover:text-white/50 transition-colors">Dashboard</a>
            <a
              href="https://www.producthunt.com/posts/resumeroast-2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6154] transition-colors"
            >
              ProductHunt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
