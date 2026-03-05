/**
 * SSRF (Server-Side Request Forgery) Protection
 *
 * Single source of truth for blocking internal/private network addresses.
 * Used by: SEO checker schema validation, server action, and link checking.
 */

/** Protocols to skip entirely (not HTTP-fetchable) */
export const SKIP_PROTOCOLS = [
  "mailto:",
  "tel:",
  "javascript:",
  "data:",
  "ftp:",
  "blob:",
  "ws:",
  "wss:",
  "file:",
  "sms:",
  "geo:",
] as const;

/** Direct blocked hostnames including alternate representations */
const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "0177.0.0.1", // octal
  "0x7f.0.0.1", // hex
  "2130706433", // decimal 127.0.0.1
]);

/** Private/reserved IP range patterns */
const PRIVATE_IP_PATTERNS = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
  /^192\.168\.\d{1,3}\.\d{1,3}$/, // 192.168.0.0/16
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // Link-local
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Full 127.x.x.x range
  /^fc[0-9a-f]{2}:/i, // IPv6 ULA
  /^fe80:/i, // IPv6 link-local
];

/** Internal hostname suffixes */
const INTERNAL_SUFFIXES = [".local", ".internal", ".localhost"];

/**
 * Check if a hostname is blocked (internal/private network).
 */
export function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (BLOCKED_HOSTS.has(lower)) return true;

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(lower)) return true;
  }

  if (INTERNAL_SUFFIXES.some((s) => lower.endsWith(s))) return true;
  if (lower === "metadata.google.internal" || lower.includes("169.254.169.254"))
    return true;

  return false;
}

/**
 * Check if a URL string targets a blocked host.
 * Returns true (blocked) on parse errors — safest approach.
 */
export function isBlockedUrl(urlString: string): boolean {
  try {
    const trimmed = urlString.trim();
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
    const url = new URL(hasScheme ? trimmed : `https://${trimmed}`);
    return isBlockedHost(url.hostname);
  } catch {
    return true; // Block on parse error (safest)
  }
}
