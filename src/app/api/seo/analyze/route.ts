import type { NextRequest } from "next/server";
import { NextResponse, connection } from "next/server";
import { analyzePageSEO, SEOAnalysisError } from "@/lib/services/seo-analysis";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import { isTeamMember } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants/errors";
import { logError } from "@/lib/utils/logger";
import { isBlockedHost } from "@/lib/security/ssrf";

function buildLegacyReport(result: SEOCheckResult): string {
  const lines = [
    `SEO Analysis Report: ${result.url}`,
    `Generated: ${new Date(result.analyzedAt).toLocaleString()}`,
    "",
    `Overall SEO Score: ${result.overallScore}/100`,
    result.grade ? `Grade: ${result.grade}` : "",
    "",
    "Category Scores:",
    `- Technical: ${result.categories.technical.score}/100`,
    `- Meta: ${result.categories.meta.score}/100`,
    `- Content: ${result.categories.content.score}/100`,
    `- Structured Data: ${result.categories.structured.score}/100`,
    "",
    "Top Recommendations:",
    ...result.recommendations.slice(0, 5).map((rec) => `- ${rec}`),
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * POST /api/seo/analyze
 *
 * Analyze a page's SEO metrics
 *
 * Body:
 * - url: URL to analyze
 * - html: Optional HTML content (deprecated, currently ignored)
 */
export async function POST(request: NextRequest) {
  // Signal dynamic behavior before accessing cookies
  await connection();

  try {
    // Authorization check
    const authorized = await isTeamMember();
    if (!authorized) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const { url } = (body ?? {}) as { url?: unknown };

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 },
      );
    }

    const urlInput = url.trim();
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlInput);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 },
      );
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { success: false, error: "Only HTTP and HTTPS URLs are allowed" },
        { status: 400 },
      );
    }

    if (isBlockedHost(parsedUrl.hostname)) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot analyze local or private network addresses",
        },
        { status: 400 },
      );
    }

    // Analyze via the same v2 engine used by the public SEO checker
    let result: SEOCheckResult;
    try {
      result = await analyzePageSEO({ url: parsedUrl.href });
    } catch (error) {
      if (!(error instanceof SEOAnalysisError)) throw error;
      const status =
        error.code === "VALIDATION_ERROR"
          ? 400
          : error.code === "RATE_LIMITED"
            ? 429
            : error.code === "TIMEOUT"
              ? 504
              : error.code === "NOT_FOUND"
                ? 502
                : 500;

      return NextResponse.json(
        { success: false, error: error.message },
        { status },
      );
    }

    const metrics = {
      url: result.url,
      title: result.pagePreview?.title || "",
      wordCount: result.contentMetrics?.wordCount || 0,
      internalLinks: result.contentMetrics?.linkCount.internal || 0,
      externalLinks: result.contentMetrics?.linkCount.external || 0,
      images: result.contentMetrics?.imageCount.total || 0,
      headings: {
        h1: result.contentMetrics?.headingCount.h1 || 0,
        h2: result.contentMetrics?.headingCount.h2 || 0,
        h3: result.contentMetrics?.headingCount.h3 || 0,
      },
      readabilityScore: result.readability?.fleschScore,
      hasStructuredData: (result.schemaTypes?.length || 0) > 0,
      structuredDataTypes: result.schemaTypes || [],
      seoScore: result.overallScore,
      report: buildLegacyReport(result),
      detailedResult: result,
    };

    // Store metrics in database for historical tracking
    try {
      const { storeSEOMetrics } =
        await import("@/lib/db/repositories/seo-analytics");

      // Extract path from URL
      const path = parsedUrl.pathname || "/";

      await storeSEOMetrics({
        url: parsedUrl.href,
        path,
        title: metrics.title,
        wordCount: metrics.wordCount,
        internalLinks: metrics.internalLinks,
        externalLinks: metrics.externalLinks,
        images: metrics.images,
        h1Count: metrics.headings.h1,
        h2Count: metrics.headings.h2,
        h3Count: metrics.headings.h3,
        seoScore: metrics.seoScore,
        readabilityScore: metrics.readabilityScore,
        hasStructuredData: metrics.hasStructuredData,
        structuredDataTypes: metrics.structuredDataTypes,
        analyzedBy: "manual",
      });
    } catch (dbError) {
      // Log but don't fail the request
      logError("Failed to store SEO metrics in database", dbError, {
        action: "store_seo_metrics",
        url: parsedUrl.href,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...metrics,
      },
    });
  } catch (error) {
    logError("Failed to analyze page SEO", error, {
      action: "seo_analyze",
    });

    return NextResponse.json(
      { error: "Failed to analyze page SEO" },
      { status: 500 },
    );
  }
}
