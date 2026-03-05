/**
 * Visitor Information Extraction
 *
 * Extracts comprehensive visitor data from request headers for SEO check analytics.
 * Uses Vercel's geo headers, standard HTTP headers, and client hints.
 *
 * All data is shaped into JSONB-ready buckets with _v versioning for schema evolution.
 */

import "server-only";
import type { SEOCheckResult } from "@/schemas/seo-checker";

// ============================================================================
// Types — JSONB bucket shapes
// ============================================================================

export interface VisitorData {
  _v: 1;
  user_agent: string | null;
  browser: string | null;
  os: string | null;
  language: string | null;
  languages: string[];
  screen_width: number | null;
  is_mobile: boolean;
}

export interface GeoData {
  _v: 1;
  country: string | null;
  country_region: string | null;
  city: string | null;
  timezone: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface TrafficData {
  _v: 1;
  referrer: string | null;
  referrer_hostname: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  source_category:
    | "direct"
    | "search"
    | "social"
    | "referral"
    | "paid"
    | "email"
    | "unknown";
}

export interface AuthContext {
  _v: 1;
  type: "anonymous" | "authenticated";
  user_id: string | null;
}

export interface CheckData {
  _v: 1;
  overall_score: number;
  grade: string;
  category_scores: Record<string, number>;
  issue_counts: { errors: number; warnings: number; successes: number };
  lighthouse: Record<string, number> | null;
  schema_types: string[];
  check_duration_ms: number | null;
}

export interface SeoCheckVisitorInfo {
  // Indexed columns
  ip_address: string | null;
  client_hash: string;
  session_type: "anonymous" | "authenticated";
  geo_country: string | null;
  device_type: "mobile" | "tablet" | "desktop" | null;
  traffic_source: string | null;
  is_bot: boolean;

  // JSONB buckets
  visitor_data: VisitorData;
  geo_data: GeoData;
  traffic_data: TrafficData;
  auth_context: AuthContext;
}

// ============================================================================
// IP extraction (same priority as rate-limit/index.ts)
// ============================================================================

function extractIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;
  const real = headers.get("x-real-ip");
  if (real) return real;
  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const first = vercel.split(",")[0].trim();
    if (first) return first;
  }
  return null;
}

// ============================================================================
// Client hash — SHA-256(ip + ua + daily seed) for anonymous grouping
// ============================================================================

async function generateClientHash(
  ip: string | null,
  ua: string | null,
): Promise<string> {
  const daySeed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const raw = `${ip ?? "unknown"}|${ua ?? "unknown"}|${daySeed}`;
  const encoded = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ============================================================================
// UA parsing (lightweight, no npm deps)
// ============================================================================

const BOT_PATTERNS =
  /bot|crawler|spider|slurp|facebookexternalhit|mediapartners|google-inspectiontool|lighthouse|headlesschrome|puppeteer|playwright|wget|curl|python-requests|java\/|apache-httpclient|go-http-client|node-fetch|undici/i;

function parseUserAgent(ua: string | null): {
  browser: string | null;
  os: string | null;
  is_mobile: boolean;
  is_bot: boolean;
  device_type: "mobile" | "tablet" | "desktop" | null;
} {
  if (!ua)
    return {
      browser: null,
      os: null,
      is_mobile: false,
      is_bot: false,
      device_type: null,
    };

  const is_bot = BOT_PATTERNS.test(ua);

  // Browser detection
  let browser: string | null = null;
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/chrome\/|crios\//i.test(ua)) browser = "Chrome";
  else if (/firefox\/|fxios\//i.test(ua)) browser = "Firefox";
  else if (/safari\//i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

  // OS detection
  let os: string | null = null;
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua) && !/android/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

  // Device type
  const is_mobile =
    /mobile|android|iphone|ipod/i.test(ua) && !/ipad|tablet/i.test(ua);
  const is_tablet =
    /ipad|tablet|kindle|playbook/i.test(ua) ||
    (/android/i.test(ua) && !/mobile/i.test(ua));
  const device_type = is_bot
    ? null
    : is_mobile
      ? "mobile"
      : is_tablet
        ? "tablet"
        : "desktop";

  return { browser, os, is_mobile, is_bot, device_type };
}

// ============================================================================
// Traffic source classification
// ============================================================================

const SEARCH_ENGINES =
  /google\.|bing\.|yahoo\.|duckduckgo\.|baidu\.|yandex\.|ecosia\.|startpage\./i;
const SOCIAL_NETWORKS =
  /facebook\.|twitter\.|x\.com|linkedin\.|instagram\.|youtube\.|reddit\.|pinterest\.|tiktok\./i;
const EMAIL_PROVIDERS =
  /mail\.|outlook\.|gmail\.|mailchimp\.|sendgrid\.|campaign-archive/i;

function classifyTrafficSource(
  referrer: string | null,
  utmSource: string | null,
  utmMedium: string | null,
): TrafficData["source_category"] {
  // UTM signals take priority
  if (utmMedium) {
    const medium = utmMedium.toLowerCase();
    if (
      medium === "cpc" ||
      medium === "ppc" ||
      medium === "paid" ||
      medium === "paidsocial"
    )
      return "paid";
    if (medium === "email" || medium === "newsletter") return "email";
    if (medium === "social" || medium === "social-media") return "social";
    if (medium === "organic") return "search";
    if (medium === "referral") return "referral";
  }
  if (utmSource) {
    const source = utmSource.toLowerCase();
    if (
      source === "google" ||
      source === "bing" ||
      source === "yahoo" ||
      source === "duckduckgo"
    )
      return "search";
    if (
      SOCIAL_NETWORKS.test(source) ||
      [
        "facebook",
        "instagram",
        "linkedin",
        "twitter",
        "x",
        "reddit",
        "tiktok",
        "youtube",
      ].includes(source)
    )
      return "social";
  }

  if (!referrer) return "direct";

  try {
    const hostname = new URL(referrer).hostname;
    if (SEARCH_ENGINES.test(hostname)) return "search";
    if (SOCIAL_NETWORKS.test(hostname)) return "social";
    if (EMAIL_PROVIDERS.test(hostname)) return "email";
    return "referral";
  } catch {
    return "unknown";
  }
}

// ============================================================================
// Main extraction
// ============================================================================

export async function extractVisitorInfo(
  headers: Headers,
  userId?: string | null,
): Promise<SeoCheckVisitorInfo> {
  const ua = headers.get("user-agent");
  const ip = extractIp(headers);
  const clientHash = await generateClientHash(ip, ua);
  const { browser, os, is_mobile, is_bot, device_type } = parseUserAgent(ua);

  // Geo from Vercel headers
  const geoCountry = headers.get("x-vercel-ip-country");
  const geoRegion = headers.get("x-vercel-ip-country-region");
  const geoCity = headers.get("x-vercel-ip-city");
  const geoTimezone = headers.get("x-vercel-ip-timezone");
  const geoLat = headers.get("x-vercel-ip-latitude");
  const geoLng = headers.get("x-vercel-ip-longitude");

  // Traffic
  const referrer = headers.get("referer");
  const referrerHostname = referrer ? safeHostname(referrer) : null;

  // UTM from referer query params (if any) or custom headers
  // Note: UTMs typically come in the page URL, not headers.
  // We'll rely on the check_data or frontend to pass these.
  // For headers, we check x-utm-* (custom) as a convenience.
  const utmSource = headers.get("x-utm-source");
  const utmMedium = headers.get("x-utm-medium");
  const utmCampaign = headers.get("x-utm-campaign");
  const utmTerm = headers.get("x-utm-term");
  const utmContent = headers.get("x-utm-content");

  const sourceCategory = classifyTrafficSource(referrer, utmSource, utmMedium);

  // Language
  const acceptLang = headers.get("accept-language");
  const languages = acceptLang
    ? acceptLang
        .split(",")
        .map((l) => l.split(";")[0].trim())
        .filter(Boolean)
    : [];

  const sessionType = userId ? "authenticated" : "anonymous";

  return {
    ip_address: ip,
    client_hash: clientHash,
    session_type: sessionType,
    geo_country: geoCountry,
    device_type: device_type,
    traffic_source: sourceCategory === "direct" ? null : sourceCategory,
    is_bot,

    visitor_data: {
      _v: 1,
      user_agent: ua,
      browser,
      os,
      language: languages[0] ?? null,
      languages,
      screen_width: null, // Only available client-side
      is_mobile,
    },

    geo_data: {
      _v: 1,
      country: geoCountry,
      country_region: geoRegion,
      city: safeDecodeHeaderValue(geoCity),
      timezone: geoTimezone,
      latitude: geoLat,
      longitude: geoLng,
    },

    traffic_data: {
      _v: 1,
      referrer,
      referrer_hostname: referrerHostname,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
      source_category: sourceCategory,
    },

    auth_context: {
      _v: 1,
      type: sessionType,
      user_id: userId ?? null,
    },
  };
}

// ============================================================================
// Build check_data bucket from SEOCheckResult
// ============================================================================

export function buildCheckData(
  result: Pick<
    SEOCheckResult,
    | "overallScore"
    | "grade"
    | "categories"
    | "lighthouseEstimation"
    | "schemaTypes"
  >,
  durationMs?: number | null,
): CheckData {
  const categoryScores: Record<string, number> = {};
  let errors = 0;
  let warnings = 0;
  let successes = 0;

  for (const [key, cat] of Object.entries(result.categories)) {
    if (!cat) continue;
    categoryScores[key] = cat.score;
    for (const issue of cat.issues) {
      if (issue.type === "error") errors++;
      else if (issue.type === "warning") warnings++;
      else if (issue.type === "success") successes++;
    }
  }

  const lighthouse = result.lighthouseEstimation
    ? {
        performance: result.lighthouseEstimation.performance.score,
        accessibility: result.lighthouseEstimation.accessibility.score,
        bestPractices: result.lighthouseEstimation.bestPractices.score,
        seo: result.lighthouseEstimation.seo.score,
      }
    : null;

  return {
    _v: 1,
    overall_score: result.overallScore,
    grade: result.grade ?? "N/A",
    category_scores: categoryScores,
    issue_counts: { errors, warnings, successes },
    lighthouse,
    schema_types: result.schemaTypes ?? [],
    check_duration_ms: durationMs ?? null,
  };
}

// ============================================================================
// Helpers
// ============================================================================

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function safeDecodeHeaderValue(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
