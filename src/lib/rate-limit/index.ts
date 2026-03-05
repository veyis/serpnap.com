/**
 * Centralized Rate Limiting
 *
 * Single source of truth for all rate limiting logic.
 * Uses in-memory rate limiting which:
 * - Works perfectly for single-instance deployments
 * - Provides basic protection even in multi-instance (each instance rate limits independently)
 * - Is fast (no DB calls)
 *
 * For distributed rate limiting across multiple instances:
 * 1. Run migration: supabase/migrations/20250108000001_rate_limits_table.sql
 * 2. Regenerate types: npx supabase gen types typescript --local > types/supabase.ts
 * 3. Set ENABLE_DISTRIBUTED_RATE_LIMIT=true in .env
 * 4. Uncomment the Supabase code in checkSupabaseRateLimit()
 */

import "server-only";

// ============================================================================
// Types
// ============================================================================

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether the request is rate limited */
  limited: boolean;
  /** Number of requests remaining in the window */
  remaining: number;
  /** Milliseconds until the rate limit resets */
  resetIn: number;
  /** The limit that was applied */
  limit: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// ============================================================================
// In-Memory Store
// ============================================================================

const memoryStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanupMemoryStore(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.resetTime < now) {
      memoryStore.delete(key);
    }
  }
}

// ============================================================================
// Main Rate Limit Function
// ============================================================================

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param type - Rate limit type for namespacing (e.g., 'lead', 'api')
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 *
 * @example
 * ```ts
 * const result = await checkRateLimit(clientIP, 'lead', {
 *   maxRequests: 5,
 *   windowMs: 60_000,
 * });
 *
 * if (result.limited) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 */
export async function checkRateLimit(
  identifier: string,
  type: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const key = `${type}:${identifier}`;
  const now = Date.now();

  // Cleanup old entries periodically
  cleanupMemoryStore();

  // Check/update memory store
  const entry = memoryStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry
    const resetTime = now + config.windowMs;
    memoryStore.set(key, { count: 1, resetTime });
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }

  // Increment existing entry
  entry.count++;

  const limited = entry.count > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetTime - now);

  return { limited, remaining, resetIn, limit: config.maxRequests };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract client identifier from request headers
 * Handles various proxy headers in priority order
 */
export function getClientIdentifier(headers: Headers): string {
  // Prioritize trusted platform headers over spoofable x-forwarded-for
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;

  const vercelForwardedFor = headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    const firstIp = vercelForwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  return "unknown";
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetIn / 1000)),
  };
}

// ============================================================================
// Pre-configured Rate Limiters
// ============================================================================

/** Rate limit for lead form submissions */
export async function checkLeadRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit(identifier, "lead", {
    maxRequests: 5,
    windowMs: 60_000, // 1 minute
  });
}

/** Rate limit for API requests */
export async function checkApiRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit(identifier, "api", {
    maxRequests: 100,
    windowMs: 60_000, // 1 minute
  });
}

/** Rate limit for SEO checker requests (separate from lead forms) */
export async function checkSeoCheckerRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit(identifier, "seo-checker", {
    maxRequests: 10,
    windowMs: 60_000, // 1 minute
  });
}

/** Rate limit for general requests */
export async function checkGeneralRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit(identifier, "general", {
    maxRequests: 200,
    windowMs: 60_000, // 1 minute
  });
}
