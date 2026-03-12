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
  description: 'Get a brutally honest AI resume score, personalized interview questions, AI cover letters, and ATS job matching. Free instant results in 30 seconds.',
  keywords: ['resume feedback', 'AI resume review', 'ATS checker', 'resume score', 'resume roast', 'AI interview prep', 'cover letter generator', 'job match analyzer'],
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
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <ProductHuntBanner />
        {children}
      </body>
    </html>
  );
}

