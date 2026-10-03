export type Platform = 'all' | 'tiktok' | 'youtube' | 'meta' | 'google' | 'x';

export type Severity = 'critical' | 'high' | 'moderate' | 'low';

export interface FlaggedTerm {
  term: string;
  severity: Severity;
  category: string;
  riskScore: number;
  reason: string;
  consequences?: string[];
  safeAlternatives: string[];
  occurrences: number;
}

export interface MatchHighlight {
  term: string;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  severity: Severity;
  category: string;
  riskScore: number;
  reason: string;
  safeAlternatives: string[];
  platforms: string[];
}

export interface ScanResult {
  wordCount: number;
  charCount: number;
  shadowbanRiskScore: number;
  riskLevel: string;
  flaggedCount: number;
  flaggedTerms: FlaggedTerm[];
  matches: MatchHighlight[];
  severityBreakdown: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
  };
  safeRewrittenText: string;
  platform: Platform;
}

export interface LandingPageAudit {
  check: string;
  passed: boolean;
  importance: string;
  recommendation: string;
}

export interface UrlScanResult {
  url: string;
  title: string;
  metaDescription: string;
  extractedHeadingsCount: number;
  extractedParagraphsCount: number;
  landingPageAudits: LandingPageAudit[];
  scanResult: ScanResult;
  scannedAt: string;
}

export interface RestrictedTermItem {
  _id: string;
  term: string;
  slug: string;
  platforms: string[];
  severity: Severity;
  category: string;
  riskScore: number;
  reason: string;
  consequences: string[];
  safeAlternatives: string[];
  explanation: string;
  searchVolumeIndex: number;
  lastUpdated: string;
}

export interface PlatformPolicyItem {
  _id: string;
  platform: string;
  industry: string;
  slug: string;
  title: string;
  summary: string;
  prohibitedPractices: string[];
  restrictedKeywords: string[];
  requiredDisclaimers: string[];
  algoSafeTips: string[];
  officialPolicyUrl: string;
  lastReviewedYear: number;
}

export interface PseoPageData {
  keyword: string;
  slug: string;
  platform: string;
  targetTerm: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
  verdict: string;
  explanation: string;
  safeAlternatives: string[];
  policyReference: string;
  faqItems: { question: string; answer: string }[];
  searchVolume: number;
}
