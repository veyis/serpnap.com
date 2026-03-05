import {
  Globe,
  Shield,
  FileText,
  Layout,
  Link2,
  Activity,
  Code2,
  Accessibility,
  Zap,
  Sparkles,
} from "lucide-react";

// ============================================================================
// Constants
// ============================================================================

export const STORAGE_KEY = "serpnap_seo_recent_checks";
export const MAX_RECENT_CHECKS = 5;

export interface RecentCheck {
  url: string;
  score: number;
  timestamp: string;
  hostname: string;
}

// ============================================================================
// Analysis Phases
// ============================================================================

export interface AnalysisPhase {
  id: string;
  label: string;
  command: string;
  icon: typeof Globe;
  duration: number;
}

export interface SubCheck {
  label: string;
  duration: number;
}

export interface AnalysisPhaseV2 extends AnalysisPhase {
  description: string;
  color: string;
  subChecks: SubCheck[];
}

export const ANALYSIS_PHASES_V2: AnalysisPhaseV2[] = [
  {
    id: "connect",
    label: "Connecting",
    command: "curl -I",
    icon: Globe,
    duration: 1200,
    description: "Establishing secure connection",
    color: "blue",
    subChecks: [
      { label: "Resolving DNS", duration: 250 },
      { label: "TLS handshake", duration: 250 },
      { label: "Verifying SSL certificate", duration: 200 },
      { label: "Measuring response time", duration: 250 },
      { label: "Following redirects", duration: 250 },
    ],
  },
  {
    id: "technical",
    label: "Technical Audit",
    command: "scan --technical",
    icon: Shield,
    duration: 1800,
    description: "Scanning your site's foundation",
    color: "violet",
    subChecks: [
      { label: "Parsing HTTP headers", duration: 300 },
      { label: "Checking robots.txt", duration: 300 },
      { label: "Analyzing cache-control", duration: 300 },
      { label: "Detecting CDN & security headers", duration: 300 },
      { label: "Validating canonical URL", duration: 300 },
      { label: "Measuring HTML document size", duration: 300 },
    ],
  },
  {
    id: "meta",
    label: "Meta Analysis",
    command: "parse --meta",
    icon: FileText,
    duration: 1500,
    description: "Analyzing search appearance",
    color: "orange",
    subChecks: [
      { label: "Evaluating title tag", duration: 300 },
      { label: "Checking meta description", duration: 250 },
      { label: "Validating Open Graph tags", duration: 250 },
      { label: "Inspecting Twitter Cards", duration: 250 },
      { label: "Verifying viewport & favicon", duration: 250 },
    ],
  },
  {
    id: "content",
    label: "Content Scan",
    command: "analyze --content",
    icon: Layout,
    duration: 1800,
    description: "Evaluating content quality",
    color: "emerald",
    subChecks: [
      { label: "Mapping heading hierarchy", duration: 300 },
      { label: "Calculating readability score", duration: 300 },
      { label: "Measuring content-to-code ratio", duration: 300 },
      { label: "Analyzing keyword consistency", duration: 300 },
      { label: "Auditing image alt text", duration: 300 },
      { label: "Detecting CTAs & FAQ blocks", duration: 300 },
    ],
  },
  {
    id: "links",
    label: "Link Check",
    command: "check --outbound-links",
    icon: Link2,
    duration: 2000,
    description: "Verifying link health",
    color: "sky",
    subChecks: [
      { label: "Crawling outbound links", duration: 500 },
      { label: "Verifying HTTP status codes", duration: 400 },
      { label: "Detecting redirect chains", duration: 400 },
      { label: "Flagging broken links", duration: 400 },
      { label: "Analyzing anchor text quality", duration: 300 },
    ],
  },
  {
    id: "waterfall",
    label: "Resource Waterfall",
    command: "trace --resources",
    icon: Activity,
    duration: 2200,
    description: "Mapping resource loading",
    color: "cyan",
    subChecks: [
      { label: "Extracting resource tags", duration: 400 },
      { label: "Measuring load times", duration: 400 },
      { label: "Detecting render-blocking resources", duration: 350 },
      { label: "Calculating total page weight", duration: 350 },
      { label: "Identifying third-party deps", duration: 350 },
      { label: "Mapping critical render path", duration: 350 },
    ],
  },
  {
    id: "schema",
    label: "Schema Check",
    command: "validate --schema",
    icon: Code2,
    duration: 1200,
    description: "Validating structured data",
    color: "amber",
    subChecks: [
      { label: "Detecting JSON-LD blocks", duration: 300 },
      { label: "Identifying schema types", duration: 300 },
      { label: "Validating required Google fields", duration: 300 },
      { label: "Checking breadcrumb markup", duration: 300 },
    ],
  },
  {
    id: "a11y",
    label: "Accessibility",
    command: "audit --a11y",
    icon: Accessibility,
    duration: 1200,
    description: "Auditing inclusivity standards",
    color: "purple",
    subChecks: [
      { label: "Testing WCAG color contrast", duration: 300 },
      { label: "Checking ARIA landmarks", duration: 250 },
      { label: "Validating form labels", duration: 200 },
      { label: "Verifying focus management", duration: 250 },
      { label: "Checking skip navigation", duration: 200 },
    ],
  },
  {
    id: "perf",
    label: "Performance",
    command: "measure --perf",
    icon: Zap,
    duration: 1200,
    description: "Measuring speed signals",
    color: "rose",
    subChecks: [
      { label: "Estimating Lighthouse scores", duration: 300 },
      { label: "Analyzing loading strategy", duration: 250 },
      { label: "Checking resource hints", duration: 200 },
      { label: "Verifying lazy loading", duration: 250 },
      { label: "Auditing script deferral", duration: 200 },
    ],
  },
  {
    id: "report",
    label: "Generating Report",
    command: "compile --report",
    icon: Sparkles,
    duration: 1500,
    description: "Compiling your results",
    color: "orange",
    subChecks: [
      { label: "Aggregating analysis signals", duration: 350 },
      { label: "Calculating category scores", duration: 300 },
      { label: "Determining letter grade", duration: 250 },
      { label: "Prioritizing recommendations", duration: 300 },
      { label: "Building report", duration: 300 },
    ],
  },
];

// Backward-compatible alias (used by PDF generator and phase progression)
export const ANALYSIS_PHASES: AnalysisPhase[] = ANALYSIS_PHASES_V2;

// ============================================================================
// Keyword Analysis Constants
// ============================================================================

export const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "was",
  "are",
  "were",
  "been",
  "be",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "we",
  "they",
  "what",
  "which",
  "who",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "every",
  "both",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "also",
  "now",
  "here",
  "there",
  "then",
  "once",
  "if",
  "into",
  "your",
  "our",
  "their",
  "my",
  "his",
  "her",
]);

export interface KeywordData {
  keyword: string;
  count: number;
  inTitle: boolean;
  inDescription: boolean;
  density: number;
}

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00A0",
  copy: "\u00A9",
  reg: "\u00AE",
  trade: "\u2122",
  mdash: "\u2014",
  ndash: "\u2013",
  laquo: "\u00AB",
  raquo: "\u00BB",
  hellip: "\u2026",
};

export function decodeHTMLEntities(text: string): string {
  return text.replace(
    /&(?:#x([0-9a-f]{1,6})|#(\d{1,7})|([a-z][a-z0-9]{1,31}));/gi,
    (_, hex, dec, named) => {
      if (hex) {
        const cp = parseInt(hex, 16);
        return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
      }
      if (dec) {
        const cp = parseInt(dec, 10);
        return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
      }
      return HTML_ENTITIES[named.toLowerCase()] ?? `&${named};`;
    },
  );
}

export function extractKeywords(text: string): string[] {
  return decodeHTMLEntities(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

// ============================================================================
// Storage Helpers
// ============================================================================

function isRecentCheck(value: unknown): value is RecentCheck {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.url === "string" &&
    typeof record.hostname === "string" &&
    typeof record.score === "number" &&
    Number.isFinite(record.score) &&
    typeof record.timestamp === "string"
  );
}

function parseRecentChecks(stored: string): RecentCheck[] | null {
  const normalized = stored.trim();
  if (!normalized || normalized === "[object Object]") return null;

  const startsLikeJson =
    normalized.startsWith("{") || normalized.startsWith("[");
  if (!startsLikeJson) return null;

  const parsed: unknown = JSON.parse(normalized);
  if (!Array.isArray(parsed)) return null;
  return parsed.filter(isRecentCheck).slice(0, MAX_RECENT_CHECKS);
}

export function getRecentChecks(): RecentCheck[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = parseRecentChecks(stored);
    if (!parsed) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveRecentCheck(check: RecentCheck): void {
  if (typeof window === "undefined") return;
  try {
    const checks = getRecentChecks().filter((c) => c.url !== check.url);
    checks.unshift(check);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(checks.slice(0, MAX_RECENT_CHECKS)),
    );
  } catch {
    // Ignore
  }
}
