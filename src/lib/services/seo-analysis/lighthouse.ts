import type {
  SEOCheckResult,
  SEOIssue,
  PerformanceHints,
  ContentMetrics,
  ImageAnalysis,
  Accessibility,
  ContrastAnalysis,
  LighthouseEstimation,
  LighthouseAudit,
  LighthouseCategory,
} from "@/schemas/seo-checker";
import type { AnalysisContext } from "./types";

export interface LighthouseEstimationInput {
  ctx: AnalysisContext;
  performanceHints: PerformanceHints;
  contentMetrics: ContentMetrics;
  imageAnalysis: ImageAnalysis;
  a11yData: Accessibility;
  contrastAnalysis: ContrastAnalysis;
  categories: SEOCheckResult["categories"];
  domElementCount: number;
  contentToCodeRatio: number;
}

export function estimateLighthouseScores(
  input: LighthouseEstimationInput,
): LighthouseEstimation {
  const {
    ctx,
    performanceHints,
    contentMetrics,
    imageAnalysis,
    a11yData,
    contrastAnalysis,
    categories,
    domElementCount,
    contentToCodeRatio,
  } = input;

  // --- Performance Estimation (confidence: low) ---
  const perfAudits: LighthouseAudit[] = [];
  let perfScore = 65;

  const responseTime = ctx.responseTime ?? 1500;
  // Lighthouse TTFB: binary pass/fail at 600ms (web.dev/articles/ttfb)
  if (responseTime <= 600) {
    perfScore += 8;
    perfAudits.push({ name: "server-response-time", score: 1, weight: 8 });
  } else {
    const penalty = responseTime > 2000 ? 20 : responseTime > 1200 ? 10 : 5;
    perfScore -= penalty;
    perfAudits.push({ name: "server-response-time", score: 0, weight: penalty });
  }

  // Script analysis — use same regex as analyzePerformance for consistency
  const html = ctx.html;
  const externalScripts = html.match(/<script[^>]+src=[^>]*>/gi) || [];
  const deferredOrAsync = externalScripts.filter(
    (s) =>
      /\b(?:defer|async|nomodule)\b/i.test(s) || /type=["']module["']/i.test(s),
  );
  const renderBlockingCount = externalScripts.length - deferredOrAsync.length;
  if (renderBlockingCount === 0 && externalScripts.length > 0) {
    perfScore += 6;
    perfAudits.push({ name: "render-blocking-resources", score: 1, weight: 6 });
  } else if (renderBlockingCount > 0) {
    const penalty = Math.min(renderBlockingCount * 4, 12);
    perfScore -= penalty;
    perfAudits.push({
      name: "render-blocking-resources",
      score: 0,
      weight: penalty,
    });
  }

  // Resource hints
  if (performanceHints.hasPreconnect) {
    perfScore += 3;
    perfAudits.push({ name: "uses-rel-preconnect", score: 1, weight: 3 });
  }
  // uses-rel-preload was deprecated in Lighthouse 10.4+ (no longer a scored audit)

  // Hero image preload
  const hasHeroPreload =
    /<link[^>]+rel=["']preload["'][^>]+as=["']image["']/i.test(html);
  if (hasHeroPreload) {
    perfScore += 4;
    perfAudits.push({ name: "preload-lcp-image", score: 1, weight: 4 });
  }

  // Lazy loading
  if (performanceHints.hasLazyImages) {
    perfScore += 3;
    perfAudits.push({ name: "offscreen-images", score: 1, weight: 3 });
  } else if (performanceHints.totalImageCount > 3) {
    perfScore -= 5;
    perfAudits.push({ name: "offscreen-images", score: 0, weight: 5 });
  }

  // Image dimensions (CLS) — match analyzePerformance logic: data-nimg/srcset count as sized
  const allImgs = html.match(/<img[^>]*>/gi) || [];
  const unsizedImgs = allImgs.filter(
    (img) =>
      !(/\bwidth\s*=/i.test(img) && /\bheight\s*=/i.test(img)) &&
      !/\bdata-nimg\b/i.test(img) &&
      !/\bsrcset\s*=/i.test(img),
  ).length;
  if (unsizedImgs === 0 && allImgs.length > 0) {
    perfScore += 4;
    perfAudits.push({ name: "unsized-images", score: 1, weight: 4 });
  } else if (unsizedImgs > 0) {
    const penalty = Math.min(unsizedImgs * 3, 9);
    perfScore -= penalty;
    perfAudits.push({ name: "unsized-images", score: 0, weight: penalty });
  }

  // DOM size (Lighthouse v13+: warns at ~800, errors at ~1400)
  if (domElementCount < 800) {
    perfScore += 3;
    perfAudits.push({ name: "dom-size", score: 1, weight: 3 });
  } else if (domElementCount > 1400) {
    perfScore -= 10;
    perfAudits.push({ name: "dom-size", score: 0, weight: 10 });
  } else if (domElementCount > 800) {
    perfScore -= 4;
    perfAudits.push({ name: "dom-size", score: 0, weight: 4 });
  }

  // Modern image formats
  const hasModernFormats =
    /<(?:img|source)[^>]+(?:\.webp|\.avif|type=["']image\/(?:webp|avif)["'])/i.test(
      html,
    );
  if (hasModernFormats) {
    perfScore += 3;
    perfAudits.push({ name: "modern-image-formats", score: 1, weight: 3 });
  }

  // Font display swap
  const hasFontDisplaySwap = /font-display\s*:\s*swap/i.test(html);
  if (hasFontDisplaySwap) {
    perfScore += 2;
    perfAudits.push({ name: "font-display", score: 1, weight: 2 });
  }

  // Critical CSS inlined
  const hasInlinedCSS = /<style[^>]*>[\s\S]{50,}<\/style>/i.test(html);
  if (hasInlinedCSS) {
    perfScore += 2;
    perfAudits.push({ name: "critical-request-chains", score: 1, weight: 2 });
  }

  // Compression
  const encoding =
    ctx.responseHeaders?.get("content-encoding")?.toLowerCase() ?? "";
  if (
    encoding.includes("br") ||
    encoding.includes("gzip") ||
    encoding.includes("deflate")
  ) {
    perfScore += 3;
    perfAudits.push({ name: "uses-text-compression", score: 1, weight: 3 });
  } else {
    perfScore -= 5;
    perfAudits.push({ name: "uses-text-compression", score: 0, weight: 5 });
  }

  // Excessive resources
  if (performanceHints.scriptCount > 20) {
    perfScore -= 3;
    perfAudits.push({ name: "script-count", score: 0, weight: 3 });
  }
  if (performanceHints.stylesheetCount > 5) {
    perfScore -= 3;
    perfAudits.push({ name: "stylesheet-count", score: 0, weight: 3 });
  }

  // Third-party scripts
  const thirdPartyScripts = (
    html.match(
      /<script[^>]+src=["']https?:\/\/(?!(?:[^"']*\.)?(?:googleapis\.com|gstatic\.com|google\.com))[^"']+["']/gi,
    ) || []
  ).length;
  if (thirdPartyScripts > 5) {
    perfScore -= 3;
    perfAudits.push({ name: "third-party-summary", score: 0, weight: 3 });
  }

  // HTML size
  const htmlSize = ctx.htmlSize ?? html.length;
  if (htmlSize > 500000) {
    perfScore -= 6;
    perfAudits.push({ name: "total-byte-weight", score: 0, weight: 6 });
  } else if (htmlSize > 200000) {
    perfScore -= 3;
    perfAudits.push({ name: "total-byte-weight", score: 0, weight: 3 });
  }

  // Content-to-code ratio
  if (contentToCodeRatio < 10) {
    perfScore -= 3;
    perfAudits.push({ name: "content-ratio", score: 0, weight: 3 });
  }

  perfScore = Math.max(15, Math.min(98, perfScore));
  const performanceCategory: LighthouseCategory = {
    score: Math.round(perfScore),
    audits: perfAudits,
    confidence: "low",
  };

  // --- Accessibility Estimation (confidence: medium) ---
  const a11yAuditDefs: {
    name: string;
    weight: number;
    pass: () => boolean;
    applicable: () => boolean;
  }[] = [
    {
      name: "image-alt",
      weight: 10,
      pass: () => contentMetrics.imageCount.withoutAlt === 0,
      applicable: () => contentMetrics.imageCount.total > 0,
    },
    {
      name: "label",
      weight: 10,
      pass: () => a11yData.formsWithoutLabels === 0,
      applicable: () =>
        a11yData.formLabelsCount > 0 || a11yData.formsWithoutLabels > 0,
    },
    {
      name: "meta-viewport",
      weight: 10,
      pass: () => !hasIssueMatch(categories.technical, "viewport", "error"),
      applicable: () => true,
    },
    {
      name: "button-name",
      weight: 10,
      pass: () => !hasIssueMatch(categories.accessibility, "button", "error"),
      applicable: () => true,
    },
    {
      name: "link-name",
      weight: 7,
      pass: () => !hasIssueMatch(categories.content, "empty href", "error"),
      applicable: () => true,
    },
    {
      name: "color-contrast",
      weight: 7,
      pass: () => contrastAnalysis.violationCount === 0,
      applicable: () => contrastAnalysis.checkedPairs > 0,
    },
    {
      name: "html-has-lang",
      weight: 7,
      pass: () =>
        !hasIssueMatch(categories.technical, "language attribute", "warning") &&
        !hasIssueMatch(categories.technical, "language attribute", "error"),
      applicable: () => true,
    },
    {
      name: "heading-order",
      weight: 3,
      pass: () =>
        !hasIssueMatch(categories.content, "heading hierarchy", "warning") &&
        !hasIssueMatch(categories.content, "heading hierarchy", "error"),
      applicable: () => true,
    },
    {
      name: "bypass",
      weight: 3,
      pass: () => a11yData.hasSkipLink,
      applicable: () => true,
    },
    {
      name: "landmark-one-main",
      weight: 3,
      pass: () => a11yData.hasLandmarks,
      applicable: () => true,
    },
    {
      name: "tabindex",
      weight: 7,
      pass: () => !a11yData.hasPositiveTabindex,
      applicable: () => true,
    },
    {
      name: "aria-roles",
      weight: 10,
      pass: () =>
        !hasIssueMatch(categories.accessibility, "ARIA", "error") &&
        !hasIssueMatch(categories.accessibility, "aria", "error"),
      applicable: () => true,
    },
    {
      name: "document-title",
      weight: 7,
      pass: () => !hasIssueMatch(categories.meta, "title", "error"),
      applicable: () => true,
    },
    {
      name: "focus-visible",
      weight: 3,
      pass: () =>
        !hasIssueMatch(categories.accessibility, "focus", "error") &&
        !hasIssueMatch(categories.accessibility, "focus", "warning"),
      applicable: () => true,
    },
  ];

  const a11yResult = computeWeightedScore(a11yAuditDefs);
  const accessibilityCategory: LighthouseCategory = {
    score: a11yResult.score,
    audits: a11yResult.audits,
    confidence: "medium",
  };

  // --- Best Practices Estimation (confidence: medium) ---
  const bpAuditDefs: {
    name: string;
    weight: number;
    pass: () => boolean;
    applicable: () => boolean;
  }[] = [
    {
      name: "is-on-https",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.technical, "HTTPS", "error") &&
        !hasIssueMatch(categories.technical, "https", "error"),
      applicable: () => true,
    },
    {
      name: "no-vulnerable-libraries",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "csp-xss",
      weight: 1,
      pass: () =>
        !hasIssueMatch(
          categories.technical,
          "Content-Security-Policy",
          "warning",
        ) &&
        !hasIssueMatch(
          categories.technical,
          "content-security-policy",
          "warning",
        ),
      applicable: () => true,
    },
    {
      name: "image-aspect-ratio",
      weight: 1,
      pass: () =>
        imageAnalysis.withDimensions >= contentMetrics.imageCount.total ||
        contentMetrics.imageCount.total === 0,
      applicable: () => true,
    },
    {
      name: "deprecations",
      weight: 1,
      pass: () => !hasIssueMatch(categories.technical, "deprecated", "warning"),
      applicable: () => true,
    },
    {
      name: "errors-in-console",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "valid-source-maps",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "no-unload-listeners",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "doctype",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.technical, "DOCTYPE", "warning") &&
        !hasIssueMatch(categories.technical, "doctype", "warning"),
      applicable: () => true,
    },
    {
      name: "charset",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.technical, "charset", "warning") &&
        !hasIssueMatch(categories.technical, "charset", "error"),
      applicable: () => true,
    },
    {
      name: "inspector-issues",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "paste-preventing-inputs",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "geolocation-on-start",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "notification-on-start",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
  ];

  const bpResult = computeWeightedScore(bpAuditDefs);
  const bestPracticesCategory: LighthouseCategory = {
    score: bpResult.score,
    audits: bpResult.audits,
    confidence: "medium",
  };

  // --- SEO Estimation (confidence: high) ---
  const seoAuditDefs: {
    name: string;
    weight: number;
    pass: () => boolean;
    applicable: () => boolean;
  }[] = [
    {
      name: "document-title",
      weight: 1,
      pass: () => !hasIssueMatch(categories.meta, "title", "error"),
      applicable: () => true,
    },
    {
      name: "meta-description",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.meta, "description", "error") &&
        !hasIssueMatch(categories.meta, "Missing meta description", "warning"),
      applicable: () => true,
    },
    {
      name: "http-status-code",
      weight: 1,
      pass: () => true,
      applicable: () => true,
    },
    {
      name: "link-text",
      weight: 1,
      pass: () => !hasIssueMatch(categories.content, "empty href", "error"),
      applicable: () => true,
    },
    {
      name: "crawlable-anchors",
      weight: 1,
      pass: () => !hasIssueMatch(categories.content, "empty href", "error"),
      applicable: () => true,
    },
    {
      name: "is-crawlable",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.technical, "noindex", "error") &&
        !hasIssueMatch(
          categories.technical,
          "disallows crawling for this url",
          "error",
        ),
      applicable: () => true,
    },
    {
      name: "robots-txt",
      weight: 1,
      pass: () =>
        ctx.robotsTxtStatus === "found" ||
        ctx.robotsTxtStatus === "not_found" ||
        ctx.robotsTxtStatus === undefined,
      applicable: () => true,
    },
    {
      name: "hreflang",
      weight: 1,
      pass: () => !hasIssueMatch(categories.international, "hreflang", "error"),
      applicable: () => (categories.international?.issues.length ?? 0) > 0,
    },
    {
      name: "canonical",
      weight: 1,
      pass: () => !hasIssueMatch(categories.meta, "canonical", "error"),
      applicable: () => true,
    },
    {
      name: "viewport",
      weight: 1,
      pass: () => !hasIssueMatch(categories.technical, "viewport", "error"),
      applicable: () => true,
    },
    {
      name: "image-alt",
      weight: 1,
      pass: () => contentMetrics.imageCount.withoutAlt === 0,
      applicable: () => contentMetrics.imageCount.total > 0,
    },
    {
      name: "font-size",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.mobile, "font", "warning") &&
        !hasIssueMatch(categories.mobile, "font", "error"),
      applicable: () => true,
    },
    {
      name: "tap-targets",
      weight: 1,
      pass: () =>
        !hasIssueMatch(categories.mobile, "touch target", "warning") &&
        !hasIssueMatch(categories.mobile, "tap target", "warning"),
      applicable: () => true,
    },
  ];

  const seoResult = computeWeightedScore(seoAuditDefs);
  const seoCategory: LighthouseCategory = {
    score: seoResult.score,
    audits: seoResult.audits,
    confidence: "high",
  };

  return {
    performance: performanceCategory,
    accessibility: accessibilityCategory,
    bestPractices: bestPracticesCategory,
    seo: seoCategory,
  };
}

export function hasIssueMatch(
  category: { score: number; issues: SEOIssue[] } | undefined,
  keyword: string,
  type: "error" | "warning",
): boolean {
  if (!category) return false;
  const lowerKeyword = keyword.toLowerCase();
  return category.issues.some(
    (i) => i.type === type && i.message.toLowerCase().includes(lowerKeyword),
  );
}

export function computeWeightedScore(
  audits: {
    name: string;
    weight: number;
    pass: () => boolean;
    applicable: () => boolean;
  }[],
): { score: number; audits: LighthouseAudit[] } {
  let totalWeight = 0;
  let passedWeight = 0;
  const resultAudits: LighthouseAudit[] = [];

  for (const audit of audits) {
    if (!audit.applicable()) continue;
    totalWeight += audit.weight;
    const passed = audit.pass();
    if (passed) passedWeight += audit.weight;
    resultAudits.push({
      name: audit.name,
      score: passed ? 1 : 0,
      weight: audit.weight,
    });
  }

  const score =
    totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 0;
  return { score, audits: resultAudits };
}
