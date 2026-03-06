export const USER_AGENT = "Mozilla/5.0 (compatible; SerpNapBot/1.0; +https://serpnap.com/tools/seo-checker)";
export const FETCH_TIMEOUT = 15000; // 15 seconds

// Score weights - 8 displayed categories (performance is blended into technical)
export const WEIGHTS = {
  technical: 0.15,
  meta: 0.20,
  content: 0.22,
  structured: 0.08,
  performance: 0.13,
  accessibility: 0.05,
  international: 0.02,
  eeat: 0.08,
  mobile: 0.07,
} as const;

// Industry benchmarks for comparison
export const BENCHMARKS = {
  avgScore: 62,
  topPercentile: 85,
  minWordCount: 300,
  idealWordCount: 1500,
  maxTitleLength: 60,
  minDescLength: 120,
  maxDescLength: 160,
  shortPageWordCount: 500,
} as const;

// Security headers to check
// x-xss-protection removed: deprecated in all browsers since Chrome 78 (2019).
// MDN: "Non-standard, should not be used." Can introduce XSS vulnerabilities.
export const SECURITY_HEADERS = [
  "x-content-type-options",
  "x-frame-options",
  "strict-transport-security",
  "content-security-policy",
];

// Broken link checking constants
export const LINK_CHECK_TIMEOUT = 4000; // 4 seconds per link
export const MAX_LINKS_TO_CHECK = 25;
export const LINK_CHECK_CONCURRENCY = 5;

// Resource waterfall constants
export const RESOURCE_CHECK_TIMEOUT = 4000;
export const MAX_RESOURCES_TO_CHECK = 30;
export const RESOURCE_CHECK_CONCURRENCY = 5;

// Cache tag for SEO analysis results
export const SEO_CACHE_TAGS = {
  analysis: (urlHash: string) => `seo-analysis-${urlHash}`,
} as const;
