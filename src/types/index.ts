export interface RoastResult {
    id?: string;
    overallScore: number;
    grade: string;
    roastHeadline: string;
    badges: string[];
    categories: CategoryScore[];
}

export interface CategoryScore {
    name: string;
    score: number;
    grade: string;
    roastLine: string;
    tip?: string;
}

export interface JobMatchResult {
    matchScore: number;
    verdict: string;
    presentKeywords: string[];
    missingKeywords: string[];
    skillGaps: {
        skill: string;
        importance: 'critical' | 'important' | 'nice-to-have';
        suggestion: string;
    }[];
    tailoringTips: {
        section: string;
        tip: string;
    }[];
}

export interface RoastHistoryItem {
    id: string;
    roastDate: string;
    overallScore: number;
    grade: string;
    roastHeadline: string;
    scoreDelta?: number;
}

export interface IndustryContent {
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

export interface ReferralStats {
    referralCode: string;
    bonusRoasts: number;
    friendsReferred: number;
}
