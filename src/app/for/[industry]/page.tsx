import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getIndustryContent, VALID_INDUSTRIES } from '@/lib/industryContent';
import IndustryLandingClient from './IndustryLandingClient';

interface PageProps {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return VALID_INDUSTRIES.map((slug) => ({ industry: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params;
  const content = getIndustryContent(industry);
  
  if (!content) {
    return {
      title: 'Resume Roaster - Industry Not Found',
    };
  }

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: 'website',
    },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { industry } = await params;
  const content = getIndustryContent(industry);

  if (!content) {
    notFound();
  }

  return <IndustryLandingClient content={content} />;
}
