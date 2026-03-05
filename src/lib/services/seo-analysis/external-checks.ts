import type { BrokenLinkAnalysis, BrokenLinkItem } from "@/schemas/seo-checker";
import {
  isBlockedUrl as isBlockedLinkTarget,
  SKIP_PROTOCOLS,
} from "@/lib/security/ssrf";
import type { AnalysisContext } from "./types";
import {
  USER_AGENT,
  LINK_CHECK_TIMEOUT,
  MAX_LINKS_TO_CHECK,
  LINK_CHECK_CONCURRENCY,
} from "./constants";
import {
  getVisibleHtml,
  isSameHost,
  extractAnchorTagMatches,
} from "./html-utils";

async function fetchWithHeadFallback(url: string): Promise<Response> {
  const headResponse = await fetch(url, {
    method: "HEAD",
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(5000),
  });

  if (
    headResponse.ok ||
    (headResponse.status !== 405 &&
      headResponse.status !== 501 &&
      headResponse.status !== 403 &&
      headResponse.status !== 429)
  ) {
    return headResponse;
  }

  return fetch(url, {
    method: "GET",
    headers: { "User-Agent": USER_AGENT, Range: "bytes=0-0" },
    signal: AbortSignal.timeout(5000),
    redirect: "follow",
  });
}

type RobotsGroup = {
  agents: string[];
  allows: string[];
  disallows: string[];
  crawlDelay?: number;
  hasDirectives: boolean;
};

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesRobotsRule(pathWithQuery: string, rule: string): boolean {
  const trimmedRule = rule.trim();
  if (!trimmedRule) return false;

  // Google REP supports "*" wildcard and "$" end-anchor.
  const hasEndAnchor = trimmedRule.endsWith("$");
  const ruleBody = hasEndAnchor ? trimmedRule.slice(0, -1) : trimmedRule;
  const regexPattern = escapeForRegex(ruleBody).replace(/\\\*/g, ".*");
  const regex = new RegExp(`^${regexPattern}${hasEndAnchor ? "$" : ""}`);
  return regex.test(pathWithQuery);
}

function isPathBlockedByRobots(
  pathWithQuery: string,
  groups: RobotsGroup[],
): boolean {
  let bestMatchLength = -1;
  let bestMatchType: "allow" | "disallow" | null = null;

  for (const group of groups) {
    for (const allowRule of group.allows) {
      if (!matchesRobotsRule(pathWithQuery, allowRule)) continue;
      const matchLength = allowRule.length;
      if (
        matchLength > bestMatchLength ||
        (matchLength === bestMatchLength && bestMatchType === "disallow")
      ) {
        bestMatchLength = matchLength;
        bestMatchType = "allow";
      }
    }

    for (const disallowRule of group.disallows) {
      if (!disallowRule.trim()) continue; // "Disallow:" means allow all
      if (!matchesRobotsRule(pathWithQuery, disallowRule)) continue;
      const matchLength = disallowRule.length;
      if (matchLength > bestMatchLength) {
        bestMatchLength = matchLength;
        bestMatchType = "disallow";
      }
    }
  }

  return bestMatchType === "disallow";
}

export async function checkRobotsTxt(baseUrl: URL): Promise<{
  status: "found" | "not_found" | "blocked" | "error";
  content?: string;
  hasSitemapRef?: boolean;
  crawlDelayValue?: number;
}> {
  try {
    const robotsUrl = `${baseUrl.protocol}//${baseUrl.host}/robots.txt`;
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      // Per RFC 9309: 4xx (except 429) = robots.txt unavailable = allow all crawling.
      // 5xx = server error = temporarily disallow crawling.
      if (response.status === 429 || response.status >= 500) {
        return { status: "error" };
      }
      // All other non-OK responses (401, 403, 404, 410, etc.) mean no robots.txt restrictions
      return { status: "not_found" };
    }
    const content = await response.text();
    const lines = content.split(/\r?\n/);
    const groups: RobotsGroup[] = [];
    let currentGroup: RobotsGroup | null = null;
    let hasSitemapRef = false;
    let wildcardCrawlDelay: number | undefined;
    // Strip inline comments per RFC 9309 (e.g., "Disallow: / # block all" → "Disallow: /")
    const stripComment = (line: string) => line.replace(/#.*$/, "").trim();
    for (const line of lines) {
      const trimmed = stripComment(line);
      if (!trimmed) continue;

      const separatorIndex = trimmed.indexOf(":");
      if (separatorIndex === -1) continue;
      const directive = trimmed.slice(0, separatorIndex).trim().toLowerCase();
      const value = trimmed.slice(separatorIndex + 1).trim();

      if (directive === "user-agent") {
        const ua = value.toLowerCase();
        if (!ua) continue;
        if (!currentGroup || currentGroup.hasDirectives) {
          currentGroup = {
            agents: [ua],
            allows: [],
            disallows: [],
            hasDirectives: false,
          };
          groups.push(currentGroup);
        } else {
          currentGroup.agents.push(ua);
        }
        continue;
      }

      if (directive === "sitemap") {
        hasSitemapRef = true;
        continue;
      }

      if (!currentGroup) continue;
      currentGroup.hasDirectives = true;

      if (directive === "disallow") {
        currentGroup.disallows.push(value);
      } else if (directive === "allow") {
        currentGroup.allows.push(value);
      } else if (directive === "crawl-delay") {
        const val = parseFloat(value);
        if (isNaN(val)) continue;
        currentGroup.crawlDelay = val;
        if (
          wildcardCrawlDelay === undefined &&
          currentGroup.agents.includes("*")
        ) {
          wildcardCrawlDelay = val;
        }
      }
    }

    // Evaluate effective group for Googlebot:
    // - If Googlebot groups exist, they take precedence (not combined with wildcard).
    // - Otherwise fallback to wildcard groups.
    // - Per RFC 9309: multiple groups for the same user-agent MUST be merged.
    const googlebotGroups = groups.filter((g) =>
      g.agents.includes("googlebot"),
    );
    const wildcardGroups = groups.filter((g) => g.agents.includes("*"));
    const selectedGroups =
      googlebotGroups.length > 0 ? googlebotGroups : wildcardGroups;
    // Merge multiple matching groups per RFC 9309
    const effectiveGroups: RobotsGroup[] =
      selectedGroups.length > 1
        ? [
            {
              agents: selectedGroups.flatMap((g) => g.agents),
              allows: selectedGroups.flatMap((g) => g.allows),
              disallows: selectedGroups.flatMap((g) => g.disallows),
              crawlDelay: selectedGroups.find((g) => g.crawlDelay !== undefined)
                ?.crawlDelay,
              hasDirectives: true,
            },
          ]
        : selectedGroups;

    const pathWithQuery = `${baseUrl.pathname || "/"}${baseUrl.search || ""}`;
    const blockedForPath = isPathBlockedByRobots(
      pathWithQuery,
      effectiveGroups,
    );
    const crawlDelayValue =
      effectiveGroups.find((g) => g.crawlDelay !== undefined)?.crawlDelay ??
      wildcardCrawlDelay;

    return {
      status: blockedForPath ? "blocked" : "found",
      content,
      hasSitemapRef,
      crawlDelayValue,
    };
  } catch {
    return { status: "error" };
  }
}

export async function checkSitemap(
  baseUrl: URL,
): Promise<"found" | "not_found" | "error"> {
  try {
    const sitemapUrl = `${baseUrl.protocol}//${baseUrl.host}/sitemap.xml`;
    const response = await fetchWithHeadFallback(sitemapUrl);
    if (response.ok) return "found";
    const sitemapIndexUrl = `${baseUrl.protocol}//${baseUrl.host}/sitemap_index.xml`;
    const indexResponse = await fetchWithHeadFallback(sitemapIndexUrl);
    if (indexResponse.ok) return "found";

    // Treat rate-limiting / server failures as temporary errors, not definitive "not found".
    const statuses = [response.status, indexResponse.status];
    if (statuses.some((status) => status === 429 || status >= 500)) {
      return "error";
    }

    return "not_found";
  } catch {
    return "error";
  }
}

export async function checkFaviconIco(
  baseUrl: URL,
): Promise<string | null> {
  try {
    const faviconUrl = `${baseUrl.protocol}//${baseUrl.host}/favicon.ico`;
    const response = await fetch(faviconUrl, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(4000),
      redirect: "follow",
    });
    if (
      response.ok &&
      response.headers.get("content-type")?.split(";")[0].trim().startsWith("image/")
    ) {
      return faviconUrl;
    }
    // Some servers return 200 with text/html for missing paths
    if (response.ok) {
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > 0) return faviconUrl;
    }
    return null;
  } catch {
    return null;
  }
}

export async function checkSingleLink(
  url: string,
): Promise<BrokenLinkItem | null> {
  try {
    let response = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(LINK_CHECK_TIMEOUT),
      redirect: "manual",
    });

    // Some servers reject HEAD (405/501), and some bot-firewalls block HEAD (403/429)
    // while allowing GET. Retry with lightweight GET to reduce false positives.
    if (
      response.status === 405 ||
      response.status === 501 ||
      response.status === 403 ||
      response.status === 429
    ) {
      const getResponse = await fetch(url, {
        method: "GET",
        headers: { "User-Agent": USER_AGENT, Range: "bytes=0-0" },
        signal: AbortSignal.timeout(LINK_CHECK_TIMEOUT),
        redirect: "manual",
      });

      // Always use GET fallback for method-not-allowed HEAD.
      if (response.status === 405 || response.status === 501) {
        response = getResponse;
      } else if (
        getResponse.ok ||
        (getResponse.status >= 300 && getResponse.status < 400)
      ) {
        // For 403/429 HEAD blocks, trust GET if it succeeds or redirects.
        response = getResponse;
      }
    }

    const status = response.status;
    const statusText = response.statusText || String(status);

    // 405 Method Not Allowed — server blocks HEAD, treat as healthy
    if (status === 405) return null;
    // 304 Not Modified — caching response, not a redirect
    if (status === 304) return null;
    // 403/429 often indicate bot/firewall throttling, not a definitively broken destination.
    if (status === 403 || status === 429) {
      return {
        url,
        statusCode: status,
        statusText,
        type: "error",
        confidence: "low",
        confidenceReason:
          "Blocked by firewall/rate-limiting; destination may still be reachable",
      };
    }

    // 3xx redirects
    if (status >= 300 && status < 400) {
      return {
        url,
        statusCode: status,
        statusText,
        type: "redirect",
        confidence: "high",
      };
    }

    // 4xx/5xx broken
    if (status >= 400) {
      return {
        url,
        statusCode: status,
        statusText,
        type: "broken",
        confidence: "high",
      };
    }

    // 2xx — healthy
    return null;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        url,
        statusCode: 0,
        statusText: "Timeout",
        type: "timeout",
        confidence: "low",
        confidenceReason: "Timed out before destination could be verified",
      };
    }
    return {
      url,
      statusCode: 0,
      statusText: "Network error",
      type: "error",
      confidence: "low",
      confidenceReason: "Network/DNS/TLS error while verifying destination",
    };
  }
}

export async function checkOutboundLinks(
  ctx: AnalysisContext,
): Promise<BrokenLinkAnalysis> {
  const visibleHtml = getVisibleHtml(ctx.html);
  const linkMatches = extractAnchorTagMatches(visibleHtml);
  const seen = new Set<string>();
  const externalUrls: string[] = [];

  for (const match of linkMatches) {
    const href = match.href.trim();
    if (!href) continue;

    // Skip non-http protocols
    const lowerHref = href.toLowerCase();
    if (SKIP_PROTOCOLS.some((p) => lowerHref.startsWith(p))) continue;
    if (href === "#" || href.startsWith("#")) continue;

    // Resolve relative URLs
    try {
      const resolved = new URL(href, (ctx.baseUrl ?? ctx.url).href);
      // Only check external links
      if (isSameHost(resolved.href, ctx.url)) continue;
      // Strip fragment for dedup
      resolved.hash = "";
      const normalized = resolved.href;
      if (seen.has(normalized)) continue;
      // SSRF protection
      if (isBlockedLinkTarget(normalized)) continue;
      seen.add(normalized);
      externalUrls.push(normalized);
    } catch {
      continue;
    }
  }

  const skippedCount = Math.max(0, externalUrls.length - MAX_LINKS_TO_CHECK);
  const urlsToCheck = externalUrls.slice(0, MAX_LINKS_TO_CHECK);

  if (urlsToCheck.length === 0) {
    return {
      checkedCount: 0,
      brokenLinks: [],
      redirectLinks: [],
      skippedCount: 0,
      allHealthy: true,
    };
  }

  // Worker pool with concurrency limit
  const brokenLinks: BrokenLinkItem[] = [];
  const redirectLinks: BrokenLinkItem[] = [];

  const queue = [...urlsToCheck];
  const workers = Array.from(
    { length: Math.min(LINK_CHECK_CONCURRENCY, queue.length) },
    async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (!url) break;
        const result = await checkSingleLink(url);
        if (result) {
          if (result.type === "redirect") {
            redirectLinks.push(result);
          } else {
            brokenLinks.push(result);
          }
        }
      }
    },
  );

  await Promise.all(workers);

  const hardBrokenCount = brokenLinks.filter((l) => l.type === "broken").length;

  return {
    checkedCount: urlsToCheck.length,
    brokenLinks,
    redirectLinks,
    skippedCount,
    // Redirects and transient link-check failures are tracked separately from hard broken links.
    allHealthy: hardBrokenCount === 0,
  };
}
