import { z } from "zod";
import { isBlockedUrl } from "@/lib/security/ssrf";

// URL validation schema with security checks
export const seoCheckUrlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .max(2048, "URL is too long")
    .refine(
      (val) => {
        try {
          // Allow URLs without protocol, we'll add https:// later
          const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(val.trim());
          const urlToTest = hasScheme ? val.trim() : `https://${val.trim()}`;
          const parsed = new URL(urlToTest);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL" },
    )
    .refine((val) => !isBlockedUrl(val), {
      message: "Cannot analyze local or private network addresses",
    })
    .refine(
      (val) => {
        // Block data: and javascript: URLs
        const lower = val.toLowerCase().trim();
        return (
          !lower.startsWith("data:") &&
          !lower.startsWith("javascript:") &&
          !lower.startsWith("file:")
        );
      },
      { message: "Invalid URL scheme. Please enter a valid HTTP or HTTPS URL" },
    ),
});

// PDF report request schema
export const seoReportRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(320),
  url: z
    .string()
    .url("Invalid URL")
    .max(2048)
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "URL must use http or https protocol" },
    ),
  score: z.number().int().min(0).max(100),
});

// Issue type enum
export const seoIssueTypeSchema = z.enum(["error", "warning", "success"]);

// Category enum
export const seoCategorySchema = z.enum([
  "technical",
  "meta",
  "content",
  "structured",
  "accessibility",
  "international",
  "eeat",
  "mobile",
]);

// SEO Grade
export const seoGradeSchema = z.enum([
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D",
  "F",
]);

// Readability analysis
export const readabilitySchema = z.object({
  fleschScore: z.number(),
  fleschGrade: z.string(),
  avgSentenceLength: z.number(),
  avgSyllablesPerWord: z.number(),
  estimatedReadingTime: z.number(), // minutes
});

// URL analysis
export const urlAnalysisSchema = z.object({
  length: z.number(),
  hasSpecialChars: z.boolean(),
  depth: z.number(),
  isClean: z.boolean(),
  trailingSlashConsistent: z.boolean(),
});

// Heading hierarchy node
export const headingNodeSchema = z.object({
  level: z.number().min(1).max(6),
  text: z.string(),
  isSkipped: z.boolean(),
});

// Accessibility snapshot
export const accessibilitySchema = z.object({
  hasSkipLink: z.boolean(),
  hasLandmarks: z.boolean(),
  formLabelsCount: z.number(),
  formsWithoutLabels: z.number(),
  hasPositiveTabindex: z.boolean(),
});

// International SEO
export const internationalSchema = z.object({
  hreflangTags: z.array(
    z.object({
      lang: z.string(),
      href: z.string(),
    }),
  ),
  hasXDefault: z.boolean(),
  hasSelfReference: z.boolean(),
});

// E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals
export const eeatDataSchema = z.object({
  hasAuthorMarkup: z.boolean(),
  trustPageLinks: z.array(z.string()), // /about, /contact, /privacy, /terms
  hasPrivacyPolicy: z.boolean(),
  trustSignalCount: z.number(), // testimonials, reviews, certifications
  hasPublishedDate: z.boolean(),
});

// Mobile optimization data
export const mobileDataSchema = z.object({
  smallFontCount: z.number(), // elements with font-size < 12px
  fixedWidthIssues: z.number(), // elements wider than viewport
  viewportConfigured: z.boolean(),
});

// Link analysis
export const linkAnalysisSchema = z.object({
  emptyHrefs: z.number(),
  nofollowInternalLinks: z.number(),
  sponsoredLinks: z.number(),
  ugcLinks: z.number(),
});

// Image analysis
export const imageAnalysisSchema = z.object({
  srcsetCount: z.number(),
  figcaptionCount: z.number(),
  withDimensions: z.number(),
  withoutDimensions: z.number(),
});

// Broken link analysis
export const brokenLinkItemSchema = z.object({
  url: z.string(),
  statusCode: z.number(),
  statusText: z.string(),
  type: z.enum(["broken", "redirect", "timeout", "error"]),
  confidence: z.enum(["high", "low"]).default("high"),
  confidenceReason: z.string().optional(),
});

export const brokenLinkAnalysisSchema = z.object({
  checkedCount: z.number(),
  brokenLinks: z.array(brokenLinkItemSchema),
  redirectLinks: z.array(brokenLinkItemSchema),
  skippedCount: z.number(),
  allHealthy: z.boolean(),
});

// Color contrast analysis
export const contrastViolationSchema = z.object({
  foreground: z.string(),
  background: z.string(),
  ratio: z.number(),
  requiredRatio: z.number(),
  context: z.string(),
  isLargeText: z.boolean(),
});

export const contrastAnalysisSchema = z.object({
  violationCount: z.number(),
  violations: z.array(contrastViolationSchema),
  passCount: z.number(),
  checkedPairs: z.number(),
});

// Internal link structure analysis
export const internalLinkStructureSchema = z.object({
  totalLinks: z.number(),
  uniqueDestinations: z.number(),
  contentBodyLinks: z.number(),
  navigationLinks: z.number(),
  genericAnchors: z.array(z.object({ anchor: z.string(), href: z.string() })),
  emptyAnchors: z.array(z.object({ href: z.string(), context: z.string() })),
  duplicateLinks: z.array(
    z.object({
      href: z.string(),
      count: z.number(),
      anchors: z.array(z.string()),
    }),
  ),
  depthDistribution: z.record(z.string(), z.number()),
  internalToExternalRatio: z.number(),
  fragmentOnlyLinks: z.number(),
});

// Lighthouse score estimation
export const lighthouseAuditSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(1),
  weight: z.number(),
});

export const lighthouseCategorySchema = z.object({
  score: z.number().min(0).max(100),
  audits: z.array(lighthouseAuditSchema),
  confidence: z.enum(["low", "medium", "high"]),
});

export const lighthouseEstimationSchema = z.object({
  performance: lighthouseCategorySchema,
  accessibility: lighthouseCategorySchema,
  bestPractices: lighthouseCategorySchema,
  seo: lighthouseCategorySchema,
});

// Resource waterfall analysis
export const resourceTypeSchema = z.enum([
  "document",
  "script",
  "stylesheet",
  "image",
  "font",
  "iframe",
  "preload",
  "other",
]);

export const loadingStrategySchema = z.enum([
  "sync",
  "async",
  "defer",
  "module",
  "lazy",
  "preload",
  "preconnect",
  "media",
  "n/a",
]);

export const waterfallResourceSchema = z.object({
  url: z.string(),
  shortName: z.string(),
  resourceType: resourceTypeSchema,
  loadingStrategy: loadingStrategySchema,
  isRenderBlocking: z.boolean(),
  sizeBytes: z.number().nullable(),
  responseTimeMs: z.number().nullable(),
  statusCode: z.number().nullable(),
  contentType: z.string().nullable(),
  startOffset: z.number(),
  isCriticalPath: z.boolean(),
  isThirdParty: z.boolean(),
});

export const waterfallAnalysisSchema = z.object({
  resources: z.array(waterfallResourceSchema),
  summary: z.object({
    totalResources: z.number(),
    totalSizeBytes: z.number(),
    unknownSizeCount: z.number(),
    renderBlockingCount: z.number(),
    criticalPathCount: z.number(),
    thirdPartyCount: z.number(),
    byType: z.record(z.string(), z.number()),
    documentResponseTimeMs: z.number(),
    estimatedFullLoadMs: z.number(),
  }),
  skippedCount: z.number(),
  checkedCount: z.number(),
});

// Single issue schema
export const seoIssueSchema = z.object({
  type: seoIssueTypeSchema,
  category: seoCategorySchema,
  message: z.string(),
  fix: z.string().optional(),
  impact: z.enum(["high", "medium", "low"]).optional(),
});

// Category result schema
export const seoCategoryResultSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(seoIssueSchema),
});

// Page preview data for SERP display
export const pagePreviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  favicon: z.string().nullable(),
});

// Performance hints extracted from HTML
export const performanceHintsSchema = z.object({
  hasPreconnect: z.boolean(),
  hasPreload: z.boolean(),
  hasDeferredScripts: z.boolean(),
  hasAsyncScripts: z.boolean(),
  hasLazyImages: z.boolean(),
  scriptCount: z.number(),
  stylesheetCount: z.number(),
  totalImageCount: z.number(),
});

// Content metrics
export const contentMetricsSchema = z.object({
  wordCount: z.number(),
  headingCount: z.object({
    h1: z.number(),
    h2: z.number(),
    h3: z.number(),
    h4: z.number(),
    h5: z.number(),
    h6: z.number(),
  }),
  paragraphCount: z.number(),
  linkCount: z.object({
    internal: z.number(),
    external: z.number(),
    nofollow: z.number(),
  }),
  imageCount: z.object({
    total: z.number(),
    withAlt: z.number(),
    withoutAlt: z.number(),
  }),
  listCount: z.number(),
  tableCount: z.number(),
});

// Full SEO check result schema
export const seoCheckResultSchema = z.object({
  url: z.string(),
  overallScore: z.number().min(0).max(100),
  categories: z.object({
    technical: seoCategoryResultSchema,
    meta: seoCategoryResultSchema,
    content: seoCategoryResultSchema,
    structured: seoCategoryResultSchema,
    accessibility: seoCategoryResultSchema.optional(),
    international: seoCategoryResultSchema.optional(),
    eeat: seoCategoryResultSchema.optional(),
    mobile: seoCategoryResultSchema.optional(),
  }),
  recommendations: z.array(z.string()),
  analyzedAt: z.string(),
  // Enhanced data
  pagePreview: pagePreviewSchema.optional(),
  contentMetrics: contentMetricsSchema.optional(),
  performanceHints: performanceHintsSchema.optional(),
  schemaTypes: z.array(z.string()).optional(),
  loadTime: z.number().optional(),
  // New v2 fields
  grade: seoGradeSchema.optional(),
  readability: readabilitySchema.optional(),
  urlAnalysis: urlAnalysisSchema.optional(),
  headingHierarchy: z.array(headingNodeSchema).optional(),
  accessibility: accessibilitySchema.optional(),
  international: internationalSchema.optional(),
  contentToCodeRatio: z.number().optional(),
  domElementCount: z.number().optional(),
  totalChecksRun: z.number().optional(),
  // V3 fields
  eeatData: eeatDataSchema.optional(),
  mobileData: mobileDataSchema.optional(),
  linkAnalysis: linkAnalysisSchema.optional(),
  imageAnalysis: imageAnalysisSchema.optional(),
  brokenLinkAnalysis: brokenLinkAnalysisSchema.optional(),
  contrastAnalysis: contrastAnalysisSchema.optional(),
  internalLinkStructure: internalLinkStructureSchema.optional(),
  lighthouseEstimation: lighthouseEstimationSchema.optional(),
  waterfallAnalysis: waterfallAnalysisSchema.optional(),
});

// TypeScript types from schemas
export type SEOIssueType = z.infer<typeof seoIssueTypeSchema>;
export type SEOCategory = z.infer<typeof seoCategorySchema>;
export type SEOIssue = z.infer<typeof seoIssueSchema>;
export type SEOCategoryResult = z.infer<typeof seoCategoryResultSchema>;
export type SEOCheckResult = z.infer<typeof seoCheckResultSchema>;
export type PagePreview = z.infer<typeof pagePreviewSchema>;
export type ContentMetrics = z.infer<typeof contentMetricsSchema>;
export type PerformanceHints = z.infer<typeof performanceHintsSchema>;
export type SEOGrade = z.infer<typeof seoGradeSchema>;
export type Readability = z.infer<typeof readabilitySchema>;
export type UrlAnalysis = z.infer<typeof urlAnalysisSchema>;
export type HeadingNode = z.infer<typeof headingNodeSchema>;
export type Accessibility = z.infer<typeof accessibilitySchema>;
export type International = z.infer<typeof internationalSchema>;
export type EEATData = z.infer<typeof eeatDataSchema>;
export type MobileData = z.infer<typeof mobileDataSchema>;
export type LinkAnalysis = z.infer<typeof linkAnalysisSchema>;
export type ImageAnalysis = z.infer<typeof imageAnalysisSchema>;
export type BrokenLinkItem = z.infer<typeof brokenLinkItemSchema>;
export type BrokenLinkAnalysis = z.infer<typeof brokenLinkAnalysisSchema>;
export type ContrastViolation = z.infer<typeof contrastViolationSchema>;
export type ContrastAnalysis = z.infer<typeof contrastAnalysisSchema>;
export type LighthouseAudit = z.infer<typeof lighthouseAuditSchema>;
export type LighthouseCategory = z.infer<typeof lighthouseCategorySchema>;
export type InternalLinkStructure = z.infer<typeof internalLinkStructureSchema>;
export type LighthouseEstimation = z.infer<typeof lighthouseEstimationSchema>;
export type WaterfallResource = z.infer<typeof waterfallResourceSchema>;
export type WaterfallAnalysis = z.infer<typeof waterfallAnalysisSchema>;
