import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ProductHuntBanner from '@/components/ProductHuntBanner';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: 'ResuméRoast — AI Resume Roast, Interview Prep & Cover Letter Generator',
  description: 'Free AI resume checker — get an instant score on ATS compatibility, impact, and clarity. Plus interview prep, AI cover letters, and job match analysis. No signup required.',
  keywords: ['resume feedback', 'AI resume review', 'ATS checker', 'resume score', 'resume roast', 'AI interview prep', 'cover letter generator', 'job match analyzer', 'ATS resume checker', 'resume ATS score', 'AI resume feedback free', 'resume keyword checker'],
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ResuméRoast — Is Your Resume Good Enough?',
    description: 'Get a brutal AI score on your resume. Free, instant, and actually helpful.',
    url: 'https://resumeroaster.xyz',
    siteName: 'ResuméRoast',
    images: [{ url: 'https://resumeroaster.xyz/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuméRoast — Brutally Honest AI Resume Feedback',
    description: 'Upload your resume. Get roasted. Get hired.',
    images: ['https://resumeroaster.xyz/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ResuméRoast",
      "url": "https://resumeroaster.xyz",
      "logo": "https://resumeroaster.xyz/logo.png",
      "sameAs": ["https://twitter.com/resumeroast"],
      "description": "AI-powered resume analysis, interview prep, cover letter generation, and job matching tools."
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ResuméRoast",
      "url": "https://resumeroaster.xyz",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free resume analysis with AI scoring"
      },
      "description": "Get a brutally honest AI resume score, interview prep questions, AI cover letters, and ATS job matching in 30 seconds.",
      "featureList": [
        "AI Resume Scoring",
        "ATS Compatibility Check",
        "Interview Question Generator",
        "Cover Letter Writer",
        "Job Match Analyzer",
        "Bullet Point Rewriter"
      ]
    }
  ];

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductHuntBanner />
        {children}
      </body>
    </html>
  );
}

