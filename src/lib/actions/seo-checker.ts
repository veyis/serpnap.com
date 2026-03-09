"use server";

import { headers } from "next/headers";
import { ActionResult, ERROR_CODES, type ErrorCode } from "@/lib/utils";
import { logAction, logError, log } from "@/lib/utils/logger";
import {
  checkLeadRateLimit,
  checkSeoCheckerRateLimit,
  getClientIdentifier,
} from "@/lib/rate-limit";
import {
  seoCheckUrlSchema,
  seoReportRequestSchema,
  type SEOCheckResult,
} from "@/schemas/seo-checker";
import { analyzePageSEO, SEOAnalysisError } from "@/lib/services/seo-analysis";
import { isBlockedHost } from "@/lib/security/ssrf";
import { extractVisitorInfo, buildCheckData } from "@/lib/utils/visitor-info";
import { saveSeoCheck } from "@/lib/db/repositories/seo-check";

/**
 * Normalize URL - ensure it has https:// prefix
 */
function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;
  const parsed = new URL(candidate);

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("INVALID_SCHEME");
  }

  parsed.hostname = parsed.hostname.toLowerCase();
  return parsed.href;
}

/** Map SEOAnalysisError codes to ActionResult error codes */
function mapAnalysisErrorCode(code: string): ErrorCode {
  switch (code) {
    case "RATE_LIMITED":
      return ERROR_CODES.RATE_LIMITED;
    case "TIMEOUT":
      return ERROR_CODES.TIMEOUT;
    case "VALIDATION_ERROR":
      return ERROR_CODES.VALIDATION_ERROR;
    case "NOT_FOUND":
      return ERROR_CODES.NOT_FOUND;
    default:
      return ERROR_CODES.UNKNOWN_ERROR;
  }
}

// ============================================================================
// Main Server Actions
// ============================================================================

/**
 * Check SEO for a given URL
 *
 * This server action handles:
 * - Rate limiting (requires headers access)
 * - Input validation
 * - SSRF protection
 *
 * The actual page analysis is delegated to the cached `analyzePageSEO` service
 * which caches results for 5 minutes per URL.
 */
export async function checkSEO(
  input: unknown,
): Promise<ActionResult<SEOCheckResult>> {
  try {
    const checkStartedAt = Date.now();
    // 1. Rate limiting (requires headers - can't be cached)
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimitResult = await checkSeoCheckerRateLimit(clientId);

    if (rateLimitResult.limited) {
      log("warn", "SEO checker rate limited", {
        action: "checkSEO",
        clientId,
        resetIn: rateLimitResult.resetIn,
      });
      return {
        success: false,
        error: "Too many requests. Please wait a moment and try again.",
        code: ERROR_CODES.RATE_LIMITED,
      };
    }

    // 2. Validation
    const validated = seoCheckUrlSchema.safeParse(input);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      const urlErrors = fieldErrors.url;
      const errorMessage = urlErrors?.[0] || "Please enter a valid URL";

      // Log validation failure for debugging
      log("warn", "SEO validation failed", {
        action: "checkSEO",
        inputType: typeof input,
        inputKeys: input && typeof input === "object" ? Object.keys(input) : [],
        urlValue:
          input && typeof input === "object" && "url" in input
            ? String((input as { url: unknown }).url).slice(0, 100)
            : "N/A",
        errors: fieldErrors,
      });

      return {
        success: false,
        error: errorMessage,
        fields: fieldErrors,
        code: ERROR_CODES.VALIDATION_ERROR,
      };
    }

    // 3. Normalize URL
    let urlString: string;
    try {
      urlString = normalizeUrl(validated.data.url);
    } catch (error) {
      const message =
        error instanceof Error && error.message === "INVALID_SCHEME"
          ? "Invalid URL scheme. Please enter a valid HTTP or HTTPS URL."
          : "Invalid URL format. Please check and try again.";

      return {
        success: false,
        error: message,
        code: ERROR_CODES.VALIDATION_ERROR,
      };
    }
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlString);
    } catch {
      return {
        success: false,
        error: "Invalid URL format. Please check and try again.",
        code: ERROR_CODES.VALIDATION_ERROR,
      };
    }

    // 4. SSRF Protection - Block internal/private IPs
    if (isBlockedHost(parsedUrl.hostname)) {
      log("warn", "SSRF attempt blocked", {
        action: "checkSEO",
        hostname: parsedUrl.hostname,
        clientId,
      });
      return {
        success: false,
        error:
          "Cannot analyze local or private network addresses. Please enter a public website URL.",
        code: ERROR_CODES.VALIDATION_ERROR,
      };
    }

    // 5. Call cached analysis service (pass only serializable strings, not URL objects)
    // Errors are thrown (not returned) so they bypass the "use cache" layer
    const result = await analyzePageSEO({
      url: urlString,
    });

    // 6. Log the action
    logAction("checkSEO", {
      url: urlString,
      hostname: parsedUrl.hostname,
      score: result.overallScore,
    });

    // 7. Fire-and-forget: persist check result with visitor intelligence
    // Never blocks the response — errors are logged internally
    void extractVisitorInfo(headersList)
      .then((visitorInfo) => {
        const checkData = buildCheckData(result, Date.now() - checkStartedAt);
        return saveSeoCheck({
          url: urlString,
          hostname: parsedUrl.hostname,
          visitorInfo,
          checkData,
          resultSnapshot: result as unknown as Record<string, unknown>,
        });
      })
      .catch((persistError) => {
        logError("Failed to persist SEO check telemetry", persistError, {
          action: "checkSEO",
          hostname: parsedUrl.hostname,
        });
      });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // SEOAnalysisError = domain errors from the analysis service (not cached)
    if (error instanceof SEOAnalysisError) {
      return {
        success: false,
        error: error.message,
        code: mapAnalysisErrorCode(error.code),
      };
    }
    logError("SEO check failed", error, { action: "checkSEO" });
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
      code: ERROR_CODES.UNKNOWN_ERROR,
    };
  }
}

/**
 * Submit email to receive PDF report (creates lead)
 */
export async function submitSEOReportRequest(
  input: unknown,
): Promise<ActionResult<void>> {
  try {
    // 1. Rate limiting
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimitResult = await checkLeadRateLimit(clientId);

    if (rateLimitResult.limited) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
        code: ERROR_CODES.RATE_LIMITED,
      };
    }

    // 2. Validation
    const validated = seoReportRequestSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: "Please enter a valid email address",
        fields: validated.error.flatten().fieldErrors,
        code: ERROR_CODES.VALIDATION_ERROR,
      };
    }

    const { email, url, score } = validated.data;
    const hostname = new URL(url).hostname;

    // 3. Create lead in database (admin client bypasses RLS for anonymous users)
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    const normalizedHost = hostname.replace(/^www\./i, "").toLowerCase();
    const domainCandidates = Array.from(
      new Set([
        hostname.toLowerCase(),
        normalizedHost,
        `www.${normalizedHost}`,
      ]),
    );
    const { data: matchingWebsites, error: websiteLookupError } = await supabase
      .from("websites")
      .select("id, domain")
      .in("domain", domainCandidates)
      .limit(1);

    if (websiteLookupError) {
      logError(
        "Failed to resolve website for SEO checker lead",
        websiteLookupError,
        {
          action: "submitSEOReportRequest",
          hostname,
        },
      );
    } else if (matchingWebsites && matchingWebsites.length > 0) {
      const websiteId = matchingWebsites[0].id;
      const { error: insertError } = await supabase.from("leads").insert({
        website_id: websiteId,
        name: hostname,
        email,
        source: "seo_checker",
        message: `SEO Check - Score: ${score}/100 - ${url}`,
        status: "new",
        priority: score < 60 ? "high" : "normal",
      });

      if (insertError) {
        logError("Failed to create lead from SEO checker", insertError, {
          action: "submitSEOReportRequest",
          email,
          url,
          websiteId,
        });
        // Don't fail - we still want to send the email
      }
    } else {
      log(
        "info",
        "Skipping SEO checker lead creation: no matching website domain",
        {
          action: "submitSEOReportRequest",
          hostname,
        },
      );
    }

    // 4. Send PDF report email (using existing email template system)
    // Note: For MVP, we'll send a simple email. PDF generation can be added later.
    const { sendSEOReportEmail } = await import("@/lib/email/templates");

    const emailResult = await sendSEOReportEmail({
      to: email,
      url,
      score,
    });

    if (!emailResult.success) {
      logError(
        "Failed to send SEO report email",
        new Error(emailResult.error),
        {
          action: "submitSEOReportRequest",
          email,
        },
      );
      return {
        success: false,
        error: "Failed to send report. Please try again.",
        code: ERROR_CODES.UNKNOWN_ERROR,
      };
    }

    // 5. Log the action
    logAction("submitSEOReportRequest", {
      email,
      url,
      score,
      hostname,
    });

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    logError("SEO report request failed", error, {
      action: "submitSEOReportRequest",
    });
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
      code: ERROR_CODES.UNKNOWN_ERROR,
    };
  }
}
