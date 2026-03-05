/**
 * SEO Check Repository
 *
 * Persists SEO check results with visitor intelligence.
 * Uses createAdminClient() because SEO checker is anonymous (no session).
 * RLS is enabled but service role bypasses it.
 */

import "server-only";
import { log, logError } from "@/lib/utils/logger";
import type { SeoCheckVisitorInfo, CheckData } from "@/lib/utils/visitor-info";

// Cache tag constants (for future admin dashboard reads)
export const SEO_CHECK_CACHE_TAGS = {
  all: "seo-checks",
  list: "seo-checks-list",
  count: "seo-checks-count",
  single: (id: string) => `seo-check-${id}`,
} as const;

// ============================================================================
// Insert type (matches the seo_checks migration)
// ============================================================================

interface SeoCheckInsert {
  url: string;
  hostname: string;
  overall_score: number;
  grade: string;
  client_hash: string;
  ip_address: string | null;
  user_id?: string | null;
  website_id?: string | null;
  session_type: SeoCheckVisitorInfo["session_type"];
  geo_country: string | null;
  device_type: SeoCheckVisitorInfo["device_type"];
  traffic_source: SeoCheckVisitorInfo["traffic_source"];
  is_bot: boolean;
  visitor_data: Record<string, unknown>;
  geo_data: Record<string, unknown>;
  traffic_data: Record<string, unknown>;
  auth_context: Record<string, unknown>;
  check_data: Record<string, unknown>;
  engagement: Record<string, unknown>;
  result_snapshot: Record<string, unknown> | null;
}

// ============================================================================
// Insert
// ============================================================================

/**
 * Save an SEO check result with visitor intelligence.
 *
 * Fire-and-forget — caller should NOT await this in the hot path.
 * Uses admin client to bypass RLS (anonymous users have no session).
 */
export async function saveSeoCheck(params: {
  url: string;
  hostname: string;
  visitorInfo: SeoCheckVisitorInfo;
  checkData: CheckData;
  resultSnapshot?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const normalizedHostname = params.hostname.toLowerCase();

    // Look up website_id by hostname
    const normalizedHost = normalizedHostname.replace(/^www\./i, "");
    const domainCandidates = Array.from(
      new Set([normalizedHostname, normalizedHost, `www.${normalizedHost}`]),
    );

    const { data: matchingWebsites, error: websiteLookupError } = await supabase
      .from("websites")
      .select("id")
      .in("domain", domainCandidates)
      .limit(1);
    if (websiteLookupError) {
      logError(
        "Failed to resolve website_id for SEO check",
        websiteLookupError,
        {
          action: "saveSeoCheck",
          hostname: params.hostname,
        },
      );
    }

    const websiteId = matchingWebsites?.[0]?.id ?? null;

    const row: SeoCheckInsert = {
      url: params.url,
      hostname: normalizedHostname,
      overall_score: params.checkData.overall_score,
      grade: params.checkData.grade,
      client_hash: params.visitorInfo.client_hash,
      ip_address: params.visitorInfo.ip_address,
      user_id: params.visitorInfo.auth_context.user_id,
      website_id: websiteId,
      session_type: params.visitorInfo.session_type,
      geo_country: params.visitorInfo.geo_country,
      device_type: params.visitorInfo.device_type,
      traffic_source: params.visitorInfo.traffic_source,
      is_bot: params.visitorInfo.is_bot,
      visitor_data: params.visitorInfo.visitor_data as unknown as Record<
        string,
        unknown
      >,
      geo_data: params.visitorInfo.geo_data as unknown as Record<
        string,
        unknown
      >,
      traffic_data: params.visitorInfo.traffic_data as unknown as Record<
        string,
        unknown
      >,
      auth_context: params.visitorInfo.auth_context as unknown as Record<
        string,
        unknown
      >,
      check_data: params.checkData as unknown as Record<string, unknown>,
      engagement: { _v: 1 },
      result_snapshot: params.resultSnapshot ?? null,
    };

    // Use an untyped client surface for tables not yet present in generated DB types.
    const supabaseUntyped = supabase as unknown as {
      from: (table: string) => {
        insert: (payload: unknown) => Promise<{ error: unknown }>;
      };
    };
    const { error } = await supabaseUntyped.from("seo_checks").insert(row);

    if (error) {
      logError("Failed to save SEO check", error, {
        action: "saveSeoCheck",
        hostname: params.hostname,
      });
      return;
    }

    log("info", "SEO check saved", {
      action: "saveSeoCheck",
      hostname: params.hostname,
      score: params.checkData.overall_score,
      grade: params.checkData.grade,
      sessionType: params.visitorInfo.session_type,
      isBot: params.visitorInfo.is_bot,
    });
  } catch (error) {
    // Fire-and-forget: never throw, just log
    logError("saveSeoCheck failed unexpectedly", error, {
      action: "saveSeoCheck",
      hostname: params.hostname,
    });
  }
}
