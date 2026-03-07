import { CategoryScore } from '@/types';

export interface IndustryContent {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  painPoints: string[];
  exampleRoastScore: number;
  exampleRoastHeadline: string;
  exampleCategories: CategoryScore[];
  faqItems: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
}

const createCategories = (
  impact: number,
  clarity: number,
  ats: number,
  relevance: number,
  originality: number
): CategoryScore[] => [
  { name: 'Impact', score: impact, grade: getGrade(impact), roastLine: getRoastLine('Impact', impact), tip: getTip('Impact') },
  { name: 'Clarity', score: clarity, grade: getGrade(clarity), roastLine: getRoastLine('Clarity', clarity), tip: getTip('Clarity') },
  { name: 'ATS Ready', score: ats, grade: getGrade(ats), roastLine: getRoastLine('ATS Ready', ats), tip: getTip('ATS Ready') },
  { name: 'Relevance', score: relevance, grade: getGrade(relevance), roastLine: getRoastLine('Relevance', relevance), tip: getTip('Relevance') },
  { name: 'Originality', score: originality, grade: getGrade(originality), roastLine: getRoastLine('Originality', originality), tip: getTip('Originality') },
];

const getGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const getRoastLine = (category: string, score: number): string => {
  const lines: Record<string, string[]> = {
    'Impact': [
      'Your achievements are ghosts — vague and unseen',
      'Add numbers: "Led team" → "Led 5-person team, increasing revenue 40%"',
      'Quantify or it didn\'t happen',
      'Zero impact, maximum confusion',
    ],
    'Clarity': [
      'Passive voice detector: 100% hit rate',
      'Use active verbs: "Was responsible for" → "Managed"',
      'Your sentences are hiding something',
      'Clear writing is not your forte',
    ],
    'ATS Ready': [
      'ATS looked at this and took a nap',
      'Add keywords from job descriptions naturally',
      'Your resume is an ATS nightmare',
      'Missing keywords like a broken keyboard',
    ],
    'Relevance': [
      'Skills from 2015 called — they want their XML back',
      'Remove outdated tech, add AI/ML skills',
      'Your tech stack is a museum exhibit',
      'Update or become irrelevant',
    ],
    'Originality': [
      'Cliché generator: results-driven, hard-working, team-player',
      'Replace buzzwords with specific accomplishments',
      'Your resume sounds like everyone else\'s',
      'Be unique or be forgotten',
    ],
  };
  return lines[category]?.[Math.floor(score / 25)] || 'Room for improvement';
};

const getTip = (category: string): string => {
  const tips: Record<string, string> = {
    'Impact': 'Add numbers: "Led team" → "Led 5-person team, increasing revenue 40%"',
    'Clarity': 'Use active verbs: "Was responsible for" → "Managed"',
    'ATS Ready': 'Add keywords from job descriptions naturally',
    'Relevance': 'Remove outdated tech, add AI/ML skills',
    'Originality': 'Replace buzzwords with specific accomplishments',
  };
  return tips[category] || '';
};

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  'software-engineers': {
    slug: 'software-engineers',
    title: 'Software Engineer Resume Roaster',
    headline: 'Your Resume Sucks. Let\'s Fix It.',
    subheadline: 'AI-powered resume analysis built specifically for software engineers. We catch the bugs in your resume before recruiters do.',
    painPoints: [
      'Generic "proficient in JavaScript" instead of specific project impact',
      'No mention of scale — how many users? What was the latency?',
      'Missing tech stack keywords that ATS systems actually search for',
      'Listing every programming language instead of relevant ones',
      'No metrics: "improved performance" — by how much? 1%? 100%?',
      'Copy-pasted job descriptions that scream "I have no achievements"',
    ],
    exampleRoastScore: 47,
    exampleRoastHeadline: 'This Resume Is So Generic It Could Be a Template',
    exampleCategories: createCategories(35, 42, 55, 58, 45),
    faqItems: [
      { q: 'Does this work for all programming languages?', a: 'Yes! We analyze resumes for any tech stack including Python, Java, JavaScript, Go, Rust, and emerging technologies.' },
      { q: 'Will this help with FAANG applications?', a: 'Absolutely. Our analysis specifically targets what big tech recruiters look for: measurable impact, scale, and technical depth.' },
      { q: 'How do you analyze technical skills?', a: 'We look for specific technologies, frameworks, and methodologies. We flag generic terms and suggest precise alternatives.' },
      { q: 'Can you help with system design experience?', a: 'Yes. We analyze how you describe complex projects and suggest ways to demonstrate architectural decisions and tradeoffs.' },
    ],
    metaTitle: 'Software Engineer Resume Roaster | Get Hired by FAANG',
    metaDescription: 'AI-powered resume analysis for software engineers. Identify gaps, quantify impact, and get hired by top tech companies. Free analysis in 30 seconds.',
  },
  'product-managers': {
    slug: 'product-managers',
    title: 'Product Manager Resume Roaster',
    headline: 'Your PM Resume Is a Product Failure.',
    subheadline: 'Specialized resume analysis for product managers. We\'ll roast your resume until it launches.',
    painPoints: [
      'Vague product wins without metrics or user impact',
      'No mention of product metrics: DAU, MAU, retention, conversion',
      'Confusing technical skills with product skills',
      'Missing stakeholder management evidence',
      'No clear product vision statements',
      'Listing features instead of outcomes',
    ],
    exampleRoastScore: 52,
    exampleRoastHeadline: 'Your Product Sense Is Missing from This Resume',
    exampleCategories: createCategories(40, 55, 50, 60, 48),
    faqItems: [
      { q: 'How do you analyze PM-specific achievements?', a: 'We look for metrics like user growth, revenue impact, retention improvements, and successful launches.' },
      { q: 'Do you help with technical PM resumes?', a: 'Yes. We analyze how you communicate technical concepts to non-technical stakeholders.' },
      { q: 'What about TPM (Technical Product Manager) roles?', a: 'We differentiate between TPM and standard PM skills, analyzing both technical depth and product strategy.' },
    ],
    metaTitle: 'Product Manager Resume Roaster | Launch Your Career',
    metaDescription: 'AI resume analysis for product managers. Quantify your product wins and get hired by top tech companies. Free analysis in 30 seconds.',
  },
  'fresh-graduates': {
    slug: 'fresh-graduates',
    title: 'Fresh Graduate Resume Roaster',
    headline: 'Your Resume Has No Experience. Make It Up With Impact.',
    subheadline: 'Resume analysis for new grads and entry-level candidates. Turn your degree into a career.',
    painPoints: [
      'Listing coursework instead of projects',
      'No internships or real-world experience',
      'Generic objective statements that say nothing',
      'Missing extracurricular leadership roles',
      'No mention of certifications or online presence',
      'Underestimating the value of personal projects',
    ],
    exampleRoastScore: 38,
    exampleRoastHeadline: 'This Resume Is as Empty as Your Work Experience',
    exampleCategories: createCategories(25, 45, 50, 55, 35),
    faqItems: [
      { q: 'How can I improve with no work experience?', a: 'Focus on projects, coursework achievements, leadership in clubs, certifications, and personal projects that demonstrate initiative.' },
      { q: 'Should I include my GPA?', a: 'Only if it\'s above 3.5. Otherwise, focus on projects and skills that demonstrate practical ability.' },
      { q: 'How important are certifications?', a: 'Very! AWS, Google Cloud, and industry certifications show initiative beyond coursework.' },
      { q: 'What about coding projects?', a: 'GitHub projects with README files, live demos, and measurable impact (e.g., "500 users") make huge differences.' },
    ],
    metaTitle: 'Fresh Graduate Resume Roaster | Land Your First Tech Job',
    metaDescription: 'Resume analysis for fresh graduates and entry-level candidates. Turn your education into experience. Free analysis in 30 seconds.',
  },
  'data-scientists': {
    slug: 'data-scientists',
    title: 'Data Scientist Resume Roaster',
    headline: 'Your Data Says This Resume Is a Mess.',
    subheadline: 'AI-powered resume analysis for data scientists and ML engineers. Clean up your data before recruiters do.',
    painPoints: [
      'Listing Python libraries instead of business impact',
      'No mention of model accuracy or improvement metrics',
      'Missing the "so what?" factor for each project',
      'Confusing tools with skills: knowing pandas vs. knowing data analysis',
      'No mention of data pipeline or ETL experience',
      'Vague "machine learning" without specifying algorithms',
    ],
    exampleRoastScore: 44,
    exampleRoastHeadline: 'Your ML Models Need Training. So Does This Resume.',
    exampleCategories: createCategories(38, 48, 52, 50, 42),
    faqItems: [
      { q: 'How do you analyze ML projects?', a: 'We look for model performance metrics (accuracy, precision, recall), business impact, and the scale of data processed.' },
      { q: 'Should I list every Python library?', a: 'No. Focus on libraries relevant to your target roles and highlight projects where you used them effectively.' },
      { q: 'How important is deployment experience?', a: 'Very! Mentioning MLOps, model deployment, and production systems shows you can ship, not just experiment.' },
    ],
    metaTitle: 'Data Scientist Resume Roaster | Get Hired in AI/ML',
    metaDescription: 'AI resume analysis for data scientists. Quantify your ML impact and get hired by top tech companies. Free analysis in 30 seconds.',
  },
  'designers': {
    slug: 'designers',
    title: 'UX/UI Designer Resume Roaster',
    headline: 'Your Design Resume Has No UX.',
    subheadline: 'Specialized resume analysis for designers. Make your portfolio match your skills.',
    painPoints: [
      'No link to portfolio or case studies',
      'Vague design process descriptions',
      'Missing user research and methodology',
      'No metrics: "improved user experience" — how much?',
      'Listing tools instead of design thinking',
      'No mention of cross-functional collaboration',
    ],
    exampleRoastScore: 50,
    exampleRoastHeadline: 'This Resume Needs a Redesign',
    exampleCategories: createCategories(45, 55, 48, 52, 58),
    faqItems: [
      { q: 'Should I include my Dribbble or Behance link?', a: 'Yes! Include your portfolio link prominently. Make sure your case studies follow the STAR method.' },
      { q: 'How do I quantify design impact?', a: 'Include metrics like conversion improvements, user satisfaction scores, or reduction in support tickets.' },
      { q: 'What tools should I list?', a: 'Focus on industry-standard tools (Figma, Sketch, Adobe CC) and any prototyping or handoff tools your team uses.' },
    ],
    metaTitle: 'UX/UI Designer Resume Roaster | Land Your Dream Design Job',
    metaDescription: 'AI resume analysis for designers. Showcase your design process and quantify your impact. Free analysis in 30 seconds.',
  },
  'marketing-managers': {
    slug: 'marketing-managers',
    title: 'Marketing Manager Resume Roaster',
    headline: 'Your Marketing Resume Has Zero Conversion.',
    subheadline: 'AI-powered resume analysis for marketers. Optimize your career like you optimize your campaigns.',
    painPoints: [
      'No campaign ROI numbers',
      'Vague "increased engagement" without percentages',
      'Missing digital marketing channels expertise',
      'No mention of budget management',
      'Listing tools instead of results',
      'No brand building or content strategy wins',
    ],
    exampleRoastScore: 46,
    exampleRoastHeadline: 'Your Resume Has Negative ROI',
    exampleCategories: createCategories(42, 50, 55, 48, 44),
    faqItems: [
      { q: 'How do I quantify marketing impact?', a: 'Include specific metrics: conversion rates, ROI, revenue attribution, lead generation numbers, and campaign performance.' },
      { q: 'Should I list every marketing tool?', a: 'No. Highlight tools relevant to your target roles and demonstrate proficiency through campaign examples.' },
      { q: 'How important is digital experience?', a: 'Extremely. Highlight SEO, SEM, social media, email marketing, and analytics experience with specific numbers.' },
    ],
    metaTitle: 'Marketing Manager Resume Roaster | Get Hired in Digital Marketing',
    metaDescription: 'AI resume analysis for marketing professionals. Quantify your campaign wins and get hired. Free analysis in 30 seconds.',
  },
  'sales-professionals': {
    slug: 'sales-professionals',
    title: 'Sales Professional Resume Roaster',
    headline: 'Your Sales Numbers Are Missing. So Will Deals.',
    subheadline: 'Resume analysis for sales professionals. Close more interviews with a stronger resume.',
    painPoints: [
      'No quota attainment percentages',
      'Missing revenue numbers or deal sizes',
      'Vague "exceeded targets" without specifics',
      'No mention of pipeline value or deal flow',
      'Listing products instead of customer wins',
      'No new business vs. account management distinction',
    ],
    exampleRoastScore: 48,
    exampleRoastHeadline: 'Your Resume Missed the Close',
    exampleCategories: createCategories(50, 45, 52, 55, 42),
    faqItems: [
      { q: 'How do I quantify sales achievements?', a: 'Always include percentages: quota attainment, revenue growth, deal size increases, and customer acquisition numbers.' },
      { q: 'Should I list my territory or book of business?', a: 'Yes! Include territory size, annual revenue, and number of accounts managed.' },
      { q: 'What about CRM tools?', a: 'List Salesforce, HubSpot, or other CRM experience. Demonstrate data-driven selling with specific examples.' },
    ],
    metaTitle: 'Sales Professional Resume Roaster | Close Your Next Deal',
    metaDescription: 'AI resume analysis for sales professionals. Quantify your sales numbers and get hired. Free analysis in 30 seconds.',
  },
};

export const VALID_INDUSTRIES = Object.keys(INDUSTRY_CONTENT);

export function getIndustryContent(slug: string): IndustryContent | null {
  return INDUSTRY_CONTENT[slug] || null;
}
