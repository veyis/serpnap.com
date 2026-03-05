/**
 * SEO Analysis Service — Orchestrator
 *
 * Cached service for analyzing webpage SEO.
 * Uses Next.js 16 "use cache" directive for cross-request caching.
 *
 * Cache duration: 5 minutes — balances freshness with performance.
 * Cache invalidation: By URL hash for granular control.
 */

import "server-only";
// import { cacheTag, cacheLife } from "next/cache";
import type {
  SEOCheckResult,
  BrokenLinkAnalysis,
  ContrastAnalysis,
  InternalLinkStructure,
  LighthouseEstimation,
  WaterfallAnalysis,
} from "@/schemas/seo-checker";

// Types
import type { AnalysisContext, AnalysisInput } from "./types";
import { SEOAnalysisError } from "./types";
export type { AnalysisInput, AnalysisError } from "./types";
export { SEOAnalysisError } from "./types";

// Constants
import {
  USER_AGENT,
  FETCH_TIMEOUT,
  WEIGHTS,
  SEO_CACHE_TAGS,
} from "./constants";
import { isBlockedHost } from "@/lib/security/ssrf";
export { SEO_CACHE_TAGS } from "./constants";

// Utilities
import {
  hashUrl,
  stripHtmlToText,
  extractMainContentText,
  extractBaseUrl,
} from "./html-utils";
import { extractHTMLFromRSC } from "./rsc-extraction";
import {
  calculateGrade,
  calculateOverallScore,
  generateRecommendations,
  extractReadabilityFromText,
} from "./scoring";

// Extractors
import {
  extractPagePreview,
  extractContentMetrics,
  extractPerformanceHints,
  extractUrlAnalysis,
  extractHeadingHierarchy,
  extractLinkAnalysis,
  extractImageAnalysis,
} from "./extractors";

// External checks
import {
  checkRobotsTxt,
  checkSitemap,
  checkOutboundLinks,
  checkFaviconIco,
} from "./external-checks";

// Analyzers
import { analyzeTechnical } from "./analyzers/technical";
import { analyzeMeta } from "./analyzers/meta";
import { analyzeContent } from "./analyzers/content";
import { analyzeStructured } from "./analyzers/structured";
import { analyzePerformance } from "./analyzers/performance";
import { analyzeAccessibility } from "./analyzers/accessibility";
import { analyzeInternational } from "./analyzers/international";
import { analyzeEEAT } from "./analyzers/eeat";
import { analyzeMobile } from "./analyzers/mobile";

// Feature analyzers
import { analyzeColorContrast } from "./color-contrast";
import { analyzeInternalLinkStructure } from "./internal-links";
import { analyzeResourceWaterfall } from "./resource-waterfall";
import { estimateLighthouseScores } from "./lighthouse";

// Re-export types for convenience
export type { AnalysisContext } from "./types";

export async function analyzePageSEO(
  input: AnalysisInput,
): Promise<SEOCheckResult> {
  const urlString = input.url;

  try {
    const url = new URL(urlString);
    const fetchStartTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const [
      pageResponse,
      initialRobotsTxtResult,
      initialSitemapStatus,
      initialFaviconIcoUrl,
    ] = await (async () => {
      try {
        return await Promise.all([
          fetch(urlString, {
            headers: {
              "User-Agent": USER_AGENT,
              Accept: "text/html,application/xhtml+xml",
              "Accept-Language": "en-US,en;q=0.9",
            },
            signal: controller.signal,
            redirect: "follow",
          }).catch((error) => {
            if (error instanceof Error && error.name === "AbortError")
              throw new Error("TIMEOUT");
            throw error;
          }),
          checkRobotsTxt(url),
          checkSitemap(url),
          checkFaviconIco(url),
        ]);
      } finally {
        clearTimeout(timeoutId);
      }
    })();

    if (!pageResponse || !(pageResponse instanceof Response)) {
      throw new SEOAnalysisError(
        "Could not connect to the website. Please check the URL and try again.",
        "NOT_FOUND",
      );
    }

    const response = pageResponse;
    const effectiveUrl =
      response.url && response.url.length > 0 ? new URL(response.url) : url;

    if (isBlockedHost(effectiveUrl.hostname)) {
      throw new SEOAnalysisError(
        "The URL redirected to a blocked private or local network address.",
        "VALIDATION_ERROR",
      );
    }

    if (!response.ok) {
      let errorMessage: string;
      let errorCode = "NOT_FOUND";
      switch (response.status) {
        case 429:
          errorMessage =
            "This website is temporarily blocking requests. Please wait a minute and try again.";
          errorCode = "RATE_LIMITED";
          break;
        case 403:
          errorMessage =
            "This website is blocking our analysis tool. Try a different URL or check if the site allows web crawlers.";
          break;
        case 404:
          errorMessage =
            "Page not found. Please check the URL and make sure it exists.";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage =
            "The website is experiencing server issues. Please try again later.";
          break;
        default:
          errorMessage = `Website returned error: ${response.status} ${response.statusText}`;
      }
      throw new SEOAnalysisError(errorMessage, errorCode);
    }

    let robotsTxtResult = initialRobotsTxtResult;
    let sitemapStatus = initialSitemapStatus;
    let faviconIcoUrl = initialFaviconIcoUrl;
    const inputPathKey = `${url.origin}${url.pathname}${url.search}`;
    const effectivePathKey = `${effectiveUrl.origin}${effectiveUrl.pathname}${effectiveUrl.search}`;
    const needsRobotsRefresh = inputPathKey !== effectivePathKey;
    const needsSitemapRefresh = effectiveUrl.origin !== url.origin;
    const needsFaviconRefresh = effectiveUrl.origin !== url.origin;

    if (needsRobotsRefresh || needsSitemapRefresh || needsFaviconRefresh) {
      const [refreshedRobots, refreshedSitemap, refreshedFavicon] =
        await Promise.all([
          needsRobotsRefresh
            ? checkRobotsTxt(effectiveUrl)
            : Promise.resolve(robotsTxtResult),
          needsSitemapRefresh
            ? checkSitemap(effectiveUrl)
            : Promise.resolve(sitemapStatus),
          needsFaviconRefresh
            ? checkFaviconIco(effectiveUrl)
            : Promise.resolve(faviconIcoUrl),
        ]);
      robotsTxtResult = refreshedRobots;
      sitemapStatus = refreshedSitemap;
      faviconIcoUrl = refreshedFavicon;
    }
    const robotsTxtStatus = robotsTxtResult.status;

    const rawHtml = await response.text();
    if (!rawHtml || rawHtml.length < 100) {
      throw new SEOAnalysisError(
        "The page appears to be empty or invalid.",
        "VALIDATION_ERROR",
      );
    }

    // Detect WAF/bot challenge pages that return 200-299 but contain no real content.
    // Common patterns: AWS WAF (202 challenge), Cloudflare (managed challenge),
    // Akamai Bot Manager, PerimeterX, DataDome.
    const wafChallengeDetected = (() => {
      // Known WAF response headers
      if (response.headers.get("x-amzn-waf-action")) return "AWS WAF";
      if (response.headers.get("cf-mitigated") === "challenge")
        return "Cloudflare";
      // Known challenge page patterns in HTML (only check small pages to avoid false positives)
      if (rawHtml.length < 15_000) {
        if (/AwsWafIntegration|aws-waf-token/i.test(rawHtml)) return "AWS WAF";
        if (/cdn-cgi\/challenge-platform|cf-challenge/i.test(rawHtml))
          return "Cloudflare";
        if (/akam\/\d+\/pixel_|_abck/i.test(rawHtml)) return "Akamai";
        if (/perimeterx|_pxhd/i.test(rawHtml)) return "PerimeterX";
        if (
          /datadome/i.test(rawHtml) &&
          /<title[^>]*>Just a moment/i.test(rawHtml)
        )
          return "DataDome";
        // Generic: tiny page with "enable JavaScript" / challenge messaging
        if (
          rawHtml.length < 5_000 &&
          /enable\s+javascript|javascript\s+is\s+(?:disabled|required)|browser\s+verification/i.test(
            rawHtml,
          ) &&
          !/<h[1-6][^>]*>/i.test(rawHtml)
        ) {
          return "bot protection";
        }
      }
      return null;
    })();
    if (wafChallengeDetected) {
      throw new SEOAnalysisError(
        `This website's ${wafChallengeDetected} is blocking automated analysis. The page returned a challenge instead of real content. Try again or use a different URL.`,
        "WAF_BLOCKED",
      );
    }

    // Enrich thin HTML with RSC-extracted content (Next.js 16 Cache Components)
    // When a page uses RSC flight payloads, the actual content is inside
    // self.__next_f.push() calls rather than visible HTML tags.
    let html = rawHtml;
    const quickText = rawHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ");
    const quickWordCount = quickText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 1).length;
    const rscContent = extractHTMLFromRSC(rawHtml);
    if (rscContent.length > 200) {
      const rawH1Count = (rawHtml.match(/<h1[^>]*>/gi) || []).length;
      const rawH2Count = (rawHtml.match(/<h2[^>]*>/gi) || []).length;
      const rscH1Count = (rscContent.match(/<h1[^>]*>/gi) || []).length;
      const rscH2Count = (rscContent.match(/<h2[^>]*>/gi) || []).length;
      const rscWordCount = stripHtmlToText(rscContent)
        .split(/\s+/)
        .filter((w) => w.length > 1).length;

      const shouldEnrichWithRSC =
        quickWordCount < 150 ||
        (rawH1Count === 0 && rscH1Count > 0) ||
        (rawH2Count === 0 && rscH2Count > 0) ||
        rscWordCount > quickWordCount * 1.5;

      if (shouldEnrichWithRSC) {
        html = rawHtml + "\n<!-- RSC Extracted Content -->\n" + rscContent;
      }
    }

    const responseTime = Date.now() - fetchStartTime;

    const baseUrl = extractBaseUrl(html, effectiveUrl);

    const ctx: AnalysisContext = {
      html,
      url: effectiveUrl,
      baseUrl,
      responseHeaders: response.headers,
      responseTime,
      robotsTxtStatus,
      robotsTxtHasSitemapRef: robotsTxtResult.hasSitemapRef,
      robotsTxtCrawlDelay: robotsTxtResult.crawlDelayValue,
      sitemapStatus,
      faviconIcoUrl,
      finalUrl: effectiveUrl.href,
      inputUrl: urlString,
      htmlSize: rawHtml.length,
    };

    // Kick off async checks early (run in parallel with sync analysis)
    const brokenLinkPromise = checkOutboundLinks(ctx);
    const waterfallPromise = analyzeResourceWaterfall(ctx);

    const technical = analyzeTechnical(ctx);
    const meta = analyzeMeta(ctx);
    const content = analyzeContent(ctx);
    const structured = analyzeStructured(ctx);
    const pagePreview = extractPagePreview(ctx);
    const contentMetrics = extractContentMetrics(ctx);
    const performanceHints = extractPerformanceHints(ctx);
    const performance = analyzePerformance(ctx, performanceHints);
    const a11y = analyzeAccessibility(ctx);
    const intl = analyzeInternational(ctx);
    const eeat = analyzeEEAT(ctx);
    const mobile = analyzeMobile(ctx);
    const linkAnalysis = extractLinkAnalysis(ctx);
    const imageAnalysis = extractImageAnalysis(ctx);
    let internalLinkStructure: InternalLinkStructure | undefined;
    try {
      internalLinkStructure = analyzeInternalLinkStructure(ctx);
    } catch {
      internalLinkStructure = undefined;
    }
    let contrastAnalysis: ContrastAnalysis;
    try {
      contrastAnalysis = analyzeColorContrast(ctx);
    } catch {
      contrastAnalysis = {
        violationCount: 0,
        violations: [],
        passCount: 0,
        checkedPairs: 0,
      };
    }

    // Await async analysis results
    let brokenLinkAnalysis: BrokenLinkAnalysis;
    try {
      brokenLinkAnalysis = await brokenLinkPromise;
    } catch {
      brokenLinkAnalysis = {
        checkedCount: 0,
        brokenLinks: [],
        redirectLinks: [],
        skippedCount: 0,
        allHealthy: true,
      };
    }

    let waterfallAnalysis: WaterfallAnalysis | undefined;
    try {
      waterfallAnalysis = await waterfallPromise;
    } catch {
      // Graceful fallback — don't block the report
    }

    const cleanText = stripHtmlToText(html);
    // Use main content text for readability (excludes nav/footer/sidebar chrome)
    const mainContentText = extractMainContentText(html);
    const readability = extractReadabilityFromText(
      mainContentText || cleanText,
    );
    // Integrate readability into content scoring
    if (readability.fleschScore < 30 && content.wordCount > 200) {
      content.issues.push({
        type: "warning",
        category: "content",
        message: `Very difficult readability (Flesch score: ${readability.fleschScore})`,
        fix: "Simplify language with shorter sentences and common words to improve readability for a wider audience",
        impact: "medium",
      });
      content.score = Math.max(0, content.score - 5);
    } else if (readability.fleschScore >= 60 && content.wordCount > 200) {
      content.issues.push({
        type: "success",
        category: "content",
        message: `Good readability (Flesch score: ${readability.fleschScore} — ${readability.fleschGrade})`,
      });
    }
    if (readability.avgSentenceLength > 25 && content.wordCount > 200) {
      content.issues.push({
        type: "warning",
        category: "content",
        message: `Long average sentence length (${readability.avgSentenceLength} words)`,
        fix: "Aim for 15-20 words per sentence for optimal web readability",
        impact: "low",
      });
    }

    const urlAnalysis = extractUrlAnalysis(effectiveUrl.href);
    const headingHierarchy = extractHeadingHierarchy(ctx);
    const domElementCount = (html.match(/<[a-zA-Z][^>]*>/g) || []).length;
    const markupForRatio = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
      .replace(/<([a-zA-Z][a-zA-Z0-9]*)\s[^>]*>/g, "<$1>");
    const contentToCodeRatio =
      markupForRatio.length > 0
        ? Math.round((cleanText.length / markupForRatio.length) * 100)
        : 0;

    // Integrate broken link issues into content scoring
    const hardBrokenCount = brokenLinkAnalysis.brokenLinks.filter(
      (l) => l.type === "broken",
    ).length;
    const unresolvedCount = brokenLinkAnalysis.brokenLinks.filter(
      (l) => l.type === "timeout" || l.type === "error",
    ).length;
    if (hardBrokenCount > 0) {
      content.issues.push({
        type: "error",
        category: "content",
        message: `${hardBrokenCount} broken outbound link${hardBrokenCount > 1 ? "s" : ""} detected`,
        fix: "Fix or remove broken external links — they hurt user experience and SEO",
        impact: "high",
      });
      content.score = Math.max(
        0,
        content.score - Math.min(hardBrokenCount * 4, 16),
      );
    }
    if (unresolvedCount > 0) {
      content.issues.push({
        type: "warning",
        category: "content",
        message: `${unresolvedCount} outbound link${unresolvedCount > 1 ? "s" : ""} could not be verified (timeout/network)`,
        fix: "Recheck these links manually — transient network blocks can cause uncertain results",
        impact: "low",
      });
    }
    if (brokenLinkAnalysis.redirectLinks.length > 0) {
      const redirCount = brokenLinkAnalysis.redirectLinks.length;
      content.issues.push({
        type: "warning",
        category: "content",
        message: `${redirCount} outbound link${redirCount > 1 ? "s" : ""} redirect`,
        fix: "Consider updating links to final destinations where practical to reduce redirect hops",
        impact: "low",
      });
    }
    if (hardBrokenCount === 0 && brokenLinkAnalysis.checkedCount > 0) {
      content.issues.push({
        type: "success",
        category: "content",
        message: `No broken outbound links found across ${brokenLinkAnalysis.checkedCount} checked links`,
      });
    }

    // Integrate internal link structure issues into content scoring
    if (internalLinkStructure) {
      const ils = internalLinkStructure;
      if (ils.emptyAnchors.length > 0) {
        content.issues.push({
          type: "error",
          category: "content",
          message: `${ils.emptyAnchors.length} internal link${ils.emptyAnchors.length > 1 ? "s" : ""} with empty anchor text`,
          fix: "Add descriptive anchor text to all internal links for better SEO and accessibility",
          impact: "medium",
        });
        content.score = Math.max(
          0,
          content.score - Math.min(ils.emptyAnchors.length * 3, 9),
        );
      }
      if (ils.genericAnchors.length > 0) {
        content.issues.push({
          type: "warning",
          category: "content",
          message: `${ils.genericAnchors.length} internal link${ils.genericAnchors.length > 1 ? "s" : ""} with generic anchor text (e.g. "click here", "read more")`,
          fix: "Use descriptive anchor text that tells users and search engines what the linked page is about",
          impact: "medium",
        });
        content.score = Math.max(
          0,
          content.score - Math.min(ils.genericAnchors.length * 2, 8),
        );
      }
      if (ils.totalLinks > 0 && ils.contentBodyLinks === 0) {
        content.issues.push({
          type: "warning",
          category: "content",
          message:
            "No internal links found in the content body — all links are in navigation/header/footer",
          fix: "Add contextual internal links within your main content to improve crawlability and user engagement",
          impact: "high",
        });
        content.score = Math.max(0, content.score - 5);
      } else if (ils.totalLinks > 0 && ils.contentBodyLinks <= 2) {
        content.issues.push({
          type: "warning",
          category: "content",
          message: `Only ${ils.contentBodyLinks} internal link${ils.contentBodyLinks > 1 ? "s" : ""} in the content body`,
          fix: "Add more contextual internal links within your main content to distribute link equity and aid navigation",
          impact: "medium",
        });
        content.score = Math.max(0, content.score - 3);
      }
      if (ils.duplicateLinks.length > 0) {
        content.issues.push({
          type: "warning",
          category: "content",
          message: `${ils.duplicateLinks.length} internal URL${ils.duplicateLinks.length > 1 ? "s" : ""} linked excessively with identical anchor text`,
          fix: "Vary anchor text when linking to the same page multiple times",
          impact: "low",
        });
        content.score = Math.max(
          0,
          content.score - Math.min(ils.duplicateLinks.length * 2, 6),
        );
      }
      if (ils.internalToExternalRatio < 1 && ils.totalLinks > 0) {
        content.issues.push({
          type: "warning",
          category: "content",
          message: `Internal-to-external link ratio is ${ils.internalToExternalRatio}:1 — more external links than internal`,
          fix: "Increase internal linking to retain link equity and guide users through your site",
          impact: "medium",
        });
        content.score = Math.max(0, content.score - 3);
      }
      if (
        ils.emptyAnchors.length === 0 &&
        ils.genericAnchors.length === 0 &&
        ils.contentBodyLinks > 2 &&
        ils.totalLinks > 0
      ) {
        content.issues.push({
          type: "success",
          category: "content",
          message: `Internal link structure looks healthy — ${ils.totalLinks} links, ${ils.contentBodyLinks} in content body`,
        });
      }
    }

    // Integrate waterfall-derived issues into performance scoring
    if (waterfallAnalysis) {
      const { summary } = waterfallAnalysis;
      if (summary.totalSizeBytes > 5 * 1024 * 1024) {
        performance.issues.push({
          type: "error",
          category: "technical",
          message: `Total page weight is ${(summary.totalSizeBytes / (1024 * 1024)).toFixed(1)} MB — exceeds 5 MB`,
          fix: "Compress images, minify scripts/CSS, and remove unused resources to reduce total page weight",
          impact: "high",
        });
        performance.score = Math.max(0, performance.score - 10);
      } else if (summary.totalSizeBytes > 3 * 1024 * 1024) {
        performance.issues.push({
          type: "warning",
          category: "technical",
          message: `Total page weight is ${(summary.totalSizeBytes / (1024 * 1024)).toFixed(1)} MB — exceeds 3 MB`,
          fix: "Optimize images and reduce resource sizes to improve load times",
          impact: "medium",
        });
        performance.score = Math.max(0, performance.score - 5);
      }
      // Note: render-blocking scripts are already penalized in analyzePerformance (-5 each, cap -15).
      // The waterfall catches render-blocking CSS/fonts that the script-only check misses.
      // Only penalize here for non-script render-blocking resources (CSS, fonts) to avoid double-counting.
      const nonScriptBlockingCount = waterfallAnalysis.resources.filter(
        (r) => r.isRenderBlocking && r.resourceType !== "script",
      ).length;
      if (nonScriptBlockingCount > 3) {
        const penalty = Math.min((nonScriptBlockingCount - 3) * 3, 12);
        performance.issues.push({
          type: "warning",
          category: "technical",
          message: `${summary.renderBlockingCount} render-blocking resources detected (${nonScriptBlockingCount} non-script)`,
          fix: "Use media queries for non-critical CSS and preload key fonts to reduce render-blocking",
          impact: "high",
        });
        performance.score = Math.max(0, performance.score - penalty);
      }
      if (summary.thirdPartyCount > 10) {
        performance.issues.push({
          type: "warning",
          category: "technical",
          message: `${summary.thirdPartyCount} third-party resources loaded`,
          fix: "Audit third-party scripts — each adds DNS lookups and potential latency",
          impact: "medium",
        });
        performance.score = Math.max(0, performance.score - 5);
      }
    }

    // Integrate contrast violations into accessibility scoring
    if (contrastAnalysis.violationCount > 0) {
      const firstPenalty = 8;
      const additionalPenalty = Math.min(
        (contrastAnalysis.violationCount - 1) * 3,
        12,
      );
      a11y.issues.push({
        type: "error",
        category: "accessibility",
        message: `${contrastAnalysis.violationCount} color contrast violation${contrastAnalysis.violationCount > 1 ? "s" : ""} (WCAG AA)`,
        fix: "Ensure text has at least 4.5:1 contrast ratio (3:1 for large text) against its background",
        impact: "high",
      });
      a11y.score = Math.max(0, a11y.score - firstPenalty - additionalPenalty);
    } else if (contrastAnalysis.checkedPairs > 0) {
      a11y.issues.push({
        type: "success",
        category: "accessibility",
        message: `All ${contrastAnalysis.checkedPairs} color pairs pass WCAG AA contrast requirements`,
      });
    }

    const overallScore = calculateOverallScore(
      {
        technical: technical.score,
        meta: meta.score,
        content: content.score,
        structured: structured.score,
        performance: performance.score,
        accessibility: a11y.score,
        international: intl.score,
        eeat: eeat.score,
        mobile: mobile.score,
      },
      technical.issues,
    );

    const grade = calculateGrade(overallScore);
    const totalChecksRun =
      technical.issues.length +
      meta.issues.length +
      content.issues.length +
      structured.issues.length +
      performance.issues.length +
      a11y.issues.length +
      intl.issues.length +
      eeat.issues.length +
      mobile.issues.length;

    // Blend technical + performance into one displayed category
    // Weights: technical 0.15, performance 0.13 → normalized ratio
    const blendedTechnicalScore = Math.round(
      (technical.score * WEIGHTS.technical +
        performance.score * WEIGHTS.performance) /
        (WEIGHTS.technical + WEIGHTS.performance),
    );
    const categories: SEOCheckResult["categories"] = {
      technical: {
        score: blendedTechnicalScore,
        issues: [...technical.issues, ...performance.issues],
      },
      meta: { score: meta.score, issues: meta.issues },
      content: { score: content.score, issues: content.issues },
      structured: { score: structured.score, issues: structured.issues },
      accessibility: { score: a11y.score, issues: a11y.issues },
      international: { score: intl.score, issues: intl.issues },
      eeat: { score: eeat.score, issues: eeat.issues },
      mobile: { score: mobile.score, issues: mobile.issues },
    };
    const recommendations = generateRecommendations(
      overallScore,
      categories,
      contentMetrics,
    );
    const loadTime = Date.now() - fetchStartTime;

    // Lighthouse score estimation (heuristic-based)
    let lighthouseEstimation: LighthouseEstimation | undefined;
    try {
      lighthouseEstimation = estimateLighthouseScores({
        ctx,
        performanceHints,
        contentMetrics,
        imageAnalysis,
        a11yData: a11y.data,
        contrastAnalysis,
        categories,
        domElementCount,
        contentToCodeRatio,
      });
    } catch {
      // Graceful fallback — don't block the report
    }

    return {
      url: urlString,
      overallScore: Math.max(0, Math.min(100, overallScore)),
      categories,
      recommendations,
      analyzedAt: new Date().toISOString(),
      pagePreview,
      contentMetrics,
      performanceHints,
      schemaTypes: structured.schemaTypes,
      loadTime,
      grade,
      readability,
      urlAnalysis,
      headingHierarchy,
      accessibility: a11y.data,
      international: intl.data,
      contentToCodeRatio,
      domElementCount,
      totalChecksRun,
      eeatData: eeat.data,
      mobileData: mobile.data,
      linkAnalysis,
      imageAnalysis,
      brokenLinkAnalysis,
      contrastAnalysis,
      internalLinkStructure,
      lighthouseEstimation,
      waterfallAnalysis,
    };
  } catch (error) {
    if (error instanceof SEOAnalysisError) throw error;
    if (error instanceof Error && error.message === "TIMEOUT") {
      throw new SEOAnalysisError(
        "The website took too long to respond. Please try again.",
        "TIMEOUT",
      );
    }
    throw new SEOAnalysisError(
      "An unexpected error occurred while analyzing the page.",
      "UNKNOWN_ERROR",
    );
  }
}
