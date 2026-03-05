import type { SEOIssue } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";
import { SECURITY_HEADERS } from "../constants";
import {
  extractLinkHrefByRelSafe,
  extractLinkTagsByRel,
  extractTagAttributeValue,
  extractCanonicalFromLinkHeader,
  extractMetaContentSafe,
  stripHtmlToText,
} from "../html-utils";

export function analyzeTechnical(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
} {
  const issues: SEOIssue[] = [];
  let score = 100;
  let xRobotsTagContent = "";

  if (ctx.url.protocol !== "https:") {
    issues.push({
      type: "error",
      category: "technical",
      message: "Site not using HTTPS",
      fix: "Install an SSL certificate and redirect HTTP to HTTPS",
      impact: "high",
    });
    score -= 25;
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "HTTPS enabled",
    });
  }

  const viewportContent = extractMetaContentSafe(ctx.html, "viewport");
  if (!viewportContent) {
    issues.push({
      type: "error",
      category: "technical",
      message: "Missing viewport meta tag",
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      impact: "high",
    });
    score -= 20;
  } else {
    const normalizedViewport = viewportContent.toLowerCase();
    if (!normalizedViewport.includes("width=device-width")) {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Viewport missing width=device-width",
        fix: "Update viewport to include width=device-width for responsive design",
        impact: "medium",
      });
      score -= 10;
    } else {
      issues.push({
        type: "success",
        category: "technical",
        message: "Mobile viewport configured correctly",
      });
    }
  }

  const hasDoctype = /<!DOCTYPE\s+html>/i.test(ctx.html);
  if (!hasDoctype) {
    issues.push({
      type: "warning",
      category: "technical",
      message: "Missing DOCTYPE declaration",
      fix: "Add <!DOCTYPE html> at the beginning of your HTML for standards mode",
      impact: "low",
    });
    score -= 2;
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "DOCTYPE declaration present",
    });
  }

  const htmlTag = ctx.html.match(/<html\b[^>]*>/i)?.[0] || "";
  const langAttr = extractTagAttributeValue(htmlTag, "lang");
  if (!langAttr) {
    issues.push({
      type: "warning",
      category: "technical",
      message: "Missing language attribute on <html>",
      fix: 'Add lang="en" (or appropriate language code) to improve language metadata and accessibility',
      impact: "low",
    });
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: `Language attribute defined: ${langAttr}`,
    });
  }

  const hasCharsetMeta = /<meta[^>]+charset\s*=\s*["']?utf-?8["']?/i.test(
    ctx.html,
  );
  const hasCharsetHttpEquiv =
    /<meta[^>]*(?:http-equiv=["']Content-Type["'][^>]+content=["'][^"']*charset\s*=\s*utf-?8|content=["'][^"']*charset\s*=\s*utf-?8[^"']*["'][^>]+http-equiv=["']Content-Type["'])/i.test(
      ctx.html,
    );
  if (!(hasCharsetMeta || hasCharsetHttpEquiv)) {
    issues.push({
      type: "warning",
      category: "technical",
      message: "Missing or non-UTF-8 charset declaration",
      fix: 'Add <meta charset="UTF-8"> as the first element in <head>',
      impact: "low",
    });
    score -= 5;
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "UTF-8 charset declared",
    });
  }

  if (ctx.robotsTxtStatus === "found") {
    issues.push({
      type: "success",
      category: "technical",
      message: "robots.txt found and accessible",
    });
  } else if (ctx.robotsTxtStatus === "not_found") {
    issues.push({
      type: "warning",
      category: "technical",
      message: "robots.txt not found (optional for many sites)",
      fix: "Consider adding robots.txt if you need crawl controls (disallow rules, sitemap hint)",
      impact: "low",
    });
  } else if (ctx.robotsTxtStatus === "blocked") {
    issues.push({
      type: "error",
      category: "technical",
      message: "robots.txt disallows crawling for this URL",
      fix: "Review robots.txt rules for this path and allow crawling if the page should be indexed",
      impact: "high",
    });
    score -= 15;
  } else if (ctx.robotsTxtStatus === "error") {
    issues.push({
      type: "warning",
      category: "technical",
      message: "robots.txt could not be fetched (blocked/server error)",
      fix: "Verify robots.txt is publicly reachable and not blocked by firewall/rate-limiting rules",
      impact: "low",
    });
  }

  if (ctx.sitemapStatus === "found") {
    issues.push({
      type: "success",
      category: "technical",
      message: "XML sitemap found",
    });
  } else if (ctx.sitemapStatus === "not_found") {
    issues.push({
      type: "warning",
      category: "technical",
      message: "XML sitemap not found at /sitemap.xml (optional)",
      fix: "Consider adding a sitemap, especially for large/new sites or pages not well-linked internally",
      impact: "low",
    });
  }

  if (ctx.responseHeaders) {
    // Server response time (Lighthouse fails at 600ms, TTFB threshold 800ms)
    if (ctx.responseTime) {
      if (ctx.responseTime > 3000) {
        issues.push({
          type: "warning",
          category: "technical",
          message: `Slow server response (${(ctx.responseTime / 1000).toFixed(1)}s)`,
          fix: "Optimize server processing, enable caching, or upgrade hosting",
          impact: "high",
        });
        score -= 10;
      } else if (ctx.responseTime > 1000) {
        issues.push({
          type: "warning",
          category: "technical",
          message: `Server response could be faster (${(ctx.responseTime / 1000).toFixed(1)}s)`,
          fix: "Consider server-side caching or CDN. Lighthouse flags responses over 600ms",
          impact: "medium",
        });
        score -= 5;
      } else if (ctx.responseTime > 600) {
        issues.push({
          type: "warning",
          category: "technical",
          message: `Server response exceeds Lighthouse threshold (${(ctx.responseTime / 1000).toFixed(1)}s > 0.6s)`,
          fix: "Lighthouse flags server response times over 600ms. Consider optimizing TTFB",
          impact: "low",
        });
        score -= 2;
      } else {
        issues.push({
          type: "success",
          category: "technical",
          message: `Fast server response (${(ctx.responseTime / 1000).toFixed(1)}s)`,
        });
      }
    }

    const xRobotsTag = ctx.responseHeaders.get("x-robots-tag");
    if (xRobotsTag) {
      const lowerTag = xRobotsTag.toLowerCase();
      xRobotsTagContent = lowerTag;
      if (lowerTag.includes("noindex")) {
        issues.push({
          type: "error",
          category: "technical",
          message: "X-Robots-Tag header contains 'noindex'",
          fix: "Remove noindex from X-Robots-Tag header to allow search engine indexing",
          impact: "high",
        });
        score -= 20;
      } else if (lowerTag.includes("nofollow")) {
        issues.push({
          type: "warning",
          category: "technical",
          message: "X-Robots-Tag header contains 'nofollow'",
          fix: "Consider removing nofollow to allow link equity to pass",
          impact: "medium",
        });
        score -= 5;
      } else {
        issues.push({
          type: "success",
          category: "technical",
          message: "X-Robots-Tag allows indexing",
        });
      }
    } else {
      issues.push({
        type: "success",
        category: "technical",
        message: "No restrictive X-Robots-Tag header",
      });
    }

    const missingSecurityHeaders: string[] = [];
    for (const header of SECURITY_HEADERS) {
      if (!ctx.responseHeaders.get(header)) missingSecurityHeaders.push(header);
    }
    if (missingSecurityHeaders.length === 0) {
      issues.push({
        type: "success",
        category: "technical",
        message: "All recommended security headers present",
      });
    } else if (missingSecurityHeaders.length <= 2) {
      issues.push({
        type: "warning",
        category: "technical",
        message: `Missing security headers: ${missingSecurityHeaders.slice(0, 2).join(", ")}`,
        fix: "Add security headers to protect against common vulnerabilities",
        impact: "low",
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: `Missing ${missingSecurityHeaders.length} security headers`,
        fix: "Add security headers (X-Content-Type-Options, X-Frame-Options, etc.)",
        impact: "low",
      });
    }

    const contentEncoding = ctx.responseHeaders.get("content-encoding");
    if (
      contentEncoding &&
      (contentEncoding.includes("gzip") || contentEncoding.includes("br"))
    ) {
      issues.push({
        type: "success",
        category: "technical",
        message: `Compression enabled: ${contentEncoding}`,
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "No compression detected (gzip/brotli)",
        fix: "Enable gzip or Brotli compression to reduce page size",
        impact: "medium",
      });
      score -= 5;
    }
  }

  const robotsMetaContent = extractMetaContentSafe(ctx.html, "robots");
  if (robotsMetaContent) {
    const robotsContent = robotsMetaContent.toLowerCase();
    if (robotsContent.includes("noindex")) {
      issues.push({
        type: "error",
        category: "technical",
        message: "Meta robots tag contains 'noindex'",
        fix: "Remove noindex from meta robots tag to allow indexing",
        impact: "high",
      });
      score -= 20;
    } else {
      issues.push({
        type: "success",
        category: "technical",
        message: "Meta robots allows indexing",
      });
    }
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "No restrictive meta robots tag",
    });
  }

  // Google-specific meta robots (name="googlebot") — takes precedence over generic robots for Googlebot
  const googlebotMetaContent = extractMetaContentSafe(ctx.html, "googlebot");
  if (googlebotMetaContent) {
    const gbContent = googlebotMetaContent.toLowerCase();
    if (gbContent.includes("noindex")) {
      issues.push({
        type: "error",
        category: "technical",
        message: "Googlebot-specific meta tag contains 'noindex'",
        fix: 'Remove noindex from <meta name="googlebot"> to allow Google indexing',
        impact: "high",
      });
      score -= 20;
    } else if (gbContent.includes("nofollow")) {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Googlebot-specific meta tag contains 'nofollow'",
        fix: 'Consider removing nofollow from <meta name="googlebot"> to allow link following',
        impact: "medium",
      });
      score -= 5;
    }
  }

  const hasLinkFavicon =
    extractLinkTagsByRel(ctx.html, "icon").length > 0 ||
    extractLinkTagsByRel(ctx.html, "apple-touch-icon").length > 0;
  const hasFaviconIco = Boolean(ctx.faviconIcoUrl);
  if (!hasLinkFavicon && !hasFaviconIco) {
    issues.push({
      type: "warning",
      category: "technical",
      message: "Missing favicon",
      fix: "Add a favicon for brand recognition in browser tabs",
      impact: "low",
    });
    score -= 5;
  } else if (!hasLinkFavicon && hasFaviconIco) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Favicon detected via /favicon.ico",
    });
    issues.push({
      type: "warning",
      category: "technical",
      message:
        'No explicit <link rel="icon"> tag (relying on /favicon.ico convention)',
      fix: 'Add <link rel="icon"> for faster discovery and multiple size support',
      impact: "low",
    });
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "Favicon detected",
    });
  }

  const deprecatedTags = ["<font", "<center", "<marquee", "<blink"];
  const foundDeprecated = deprecatedTags.filter((tag) =>
    ctx.html.toLowerCase().includes(tag),
  );
  if (foundDeprecated.length > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `Deprecated HTML tags: ${foundDeprecated.map((t) => t.replace("<", "")).join(", ")}`,
      fix: "Replace deprecated tags with modern CSS equivalents",
      impact: "low",
    });
    score -= foundDeprecated.length * 3;
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "No deprecated HTML tags",
    });
  }

  const hasHead = /<head[\s>]/i.test(ctx.html);
  const hasBody = /<body[\s>]/i.test(ctx.html);
  if (!hasHead || !hasBody) {
    issues.push({
      type: "error",
      category: "technical",
      message: "Missing essential HTML elements",
      fix: "Ensure HTML has proper <head> and <body> structure",
      impact: "high",
    });
    score -= 15;
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: "Valid HTML structure",
    });
  }

  if (ctx.finalUrl && ctx.inputUrl) {
    try {
      const inputHost = new URL(ctx.inputUrl).hostname.replace(/^www\./, "");
      const finalHost = new URL(ctx.finalUrl).hostname.replace(/^www\./, "");
      if (inputHost !== finalHost) {
        issues.push({
          type: "warning",
          category: "technical",
          message: "Cross-domain redirect detected",
          fix: "Minimize redirects and update links to final URL",
          impact: "low",
        });
        score -= 3;
      } else {
        issues.push({
          type: "success",
          category: "technical",
          message: "No cross-domain redirects",
        });
      }
    } catch {
      /* skip on parse error */
    }
  }

  // Mixed content detection (HTTP subresources on HTTPS page)
  // Per W3C spec, only subresources (src, action) are mixed content.
  // Navigation links (<a href="http://...">) are NOT mixed content.
  if (ctx.url.protocol === "https:") {
    const httpSubresources =
      ctx.html.match(
        /(?:src|action)\s*=\s*(?:"http:\/\/[^"]*"|'http:\/\/[^']*'|http:\/\/[^\s>]+)/gi,
      ) || [];
    // Only treat resource-like <link rel=...> as mixed content, excluding canonical/alternate.
    const resourceRels = [
      "stylesheet",
      "preload",
      "modulepreload",
      "icon",
      "apple-touch-icon",
      "mask-icon",
      "manifest",
    ];
    const httpLinkSubresources = resourceRels.flatMap((rel) =>
      extractLinkTagsByRel(ctx.html, rel).filter((tag) => {
        const href = extractTagAttributeValue(tag, "href");
        return Boolean(href && href.startsWith("http://"));
      }),
    );
    const allMixed = [...httpSubresources, ...httpLinkSubresources];
    const mixedContentCount = allMixed.filter(
      (r) => !r.includes("http://schema.org"),
    ).length;
    if (mixedContentCount > 0) {
      issues.push({
        type: "error",
        category: "technical",
        message: `Mixed content: ${mixedContentCount} HTTP subresource(s) on HTTPS page`,
        fix: "Update all resource URLs to use HTTPS to avoid browser security warnings",
        impact: "high",
      });
      score -= Math.min(mixedContentCount * 5, 15);
    } else {
      issues.push({
        type: "success",
        category: "technical",
        message: "No mixed content detected",
      });
    }
  }

  // Permissions-Policy header check
  if (ctx.responseHeaders) {
    const permissionsPolicy =
      ctx.responseHeaders.get("permissions-policy") ||
      ctx.responseHeaders.get("feature-policy");
    if (permissionsPolicy) {
      issues.push({
        type: "success",
        category: "technical",
        message: "Permissions-Policy header configured",
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Missing Permissions-Policy header",
        fix: "Add Permissions-Policy header to control browser feature access",
        impact: "low",
      });
    }

    // HTTP/2 detection via alt-svc header
    const altSvc = ctx.responseHeaders.get("alt-svc");
    if (altSvc && (altSvc.includes("h2") || altSvc.includes("h3"))) {
      issues.push({
        type: "success",
        category: "technical",
        message: "HTTP/2+ support detected via alt-svc",
      });
    }
  }

  // dns-prefetch detection for external resources
  const hasDnsPrefetch =
    extractLinkTagsByRel(ctx.html, "dns-prefetch").length > 0;
  if (hasDnsPrefetch) {
    issues.push({
      type: "success",
      category: "technical",
      message: "DNS prefetch hints configured",
    });
  } else {
    const pageHost = ctx.url.hostname.replace(/^www\./i, "").toLowerCase();
    const externalHosts = new Set<string>();
    const resourceTagRegex =
      /<(?:script|img|iframe|source|video|audio|track|embed|object|link)\b[^>]*>/gi;
    let resourceTagMatch;
    while ((resourceTagMatch = resourceTagRegex.exec(ctx.html)) !== null) {
      const tag = resourceTagMatch[0];
      const candidate =
        extractTagAttributeValue(tag, "src") ??
        extractTagAttributeValue(tag, "href");
      if (!candidate || !/^https?:\/\//i.test(candidate)) continue;
      try {
        const host = new URL(candidate).hostname
          .replace(/^www\./i, "")
          .toLowerCase();
        if (host !== pageHost && host !== "schema.org") {
          externalHosts.add(host);
        }
      } catch {
        // ignore invalid absolute URLs
      }
    }

    if (externalHosts.size > 3) {
      issues.push({
        type: "warning",
        category: "technical",
        message: "No dns-prefetch for external domains",
        fix: 'Add <link rel="dns-prefetch" href="//example.com"> for frequently used external domains',
        impact: "low",
      });
    }
  }

  // Canonical self-reference check - compare against final URL (after redirects)
  // Using input URL would false-flag canonicals after HTTP→HTTPS or non-www→www redirects
  const canonicalHref =
    extractLinkHrefByRelSafe(ctx.html, "canonical") ||
    extractCanonicalFromLinkHeader(ctx.responseHeaders?.get("link"));
  if (canonicalHref) {
    try {
      const canonicalUrl = new URL(canonicalHref, (ctx.baseUrl ?? ctx.url).href);
      const currentUrl = new URL(ctx.finalUrl || ctx.url.href);
      const normalizeUrl = (u: URL) => {
        const hostname = u.hostname.replace(/^www\./i, "").toLowerCase();
        const pathname = u.pathname.replace(/\/+$/, "") || "/";
        return `${u.protocol}//${hostname}${pathname}`;
      };
      if (normalizeUrl(canonicalUrl) === normalizeUrl(currentUrl)) {
        issues.push({
          type: "success",
          category: "technical",
          message: "Canonical URL is self-referencing (correct)",
        });
      } else {
        issues.push({
          type: "warning",
          category: "technical",
          message: "Canonical URL points to a different page",
          fix: "Ensure canonical URL points to the current page unless this is intentional (consolidating duplicates)",
          impact: "medium",
        });
        score -= 5;
      }
    } catch {
      /* skip on parse error */
    }
  }

  // Multiple canonical tags detection
  const allCanonicals = extractLinkTagsByRel(ctx.html, "canonical");
  if (allCanonicals.length > 1) {
    issues.push({
      type: "error",
      category: "technical",
      message: `Multiple canonical tags found (${allCanonicals.length})`,
      fix: "Remove duplicate canonical tags - only one should exist per page",
      impact: "high",
    });
    score -= 15;
  }

  // Soft-404 detection:
  // Many sites return HTTP 200 with a "not found" template + noindex.
  // This should be treated as a critical indexability problem.
  const titleMatch = ctx.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1Match = ctx.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleText = stripHtmlToText(titleMatch?.[1] || "").toLowerCase();
  const h1Text = stripHtmlToText(h1Match?.[1] || "").toLowerCase();
  const pageText = stripHtmlToText(ctx.html).toLowerCase();

  const notFoundPattern =
    /\b(?:404|not found|page not found|guide not found|could(?: not|'t) find|does(?: not|n't) exist)\b/i;
  const hasNotFoundTitle =
    titleText.length > 0 && notFoundPattern.test(titleText);
  const hasNotFoundH1 = h1Text.length > 0 && notFoundPattern.test(h1Text);
  const hasNotFoundBody =
    /(page you'?re looking for|return to (?:home|guides)|back to (?:home|guides)|sorry[, ]+the page)/i.test(
      pageText,
    );

  let hasNotFoundCanonical = false;
  if (canonicalHref) {
    try {
      const resolvedCanonical = new URL(
        canonicalHref,
        ctx.finalUrl || ctx.url.href,
      );
      hasNotFoundCanonical =
        /(?:^|\/)(?:404|not-found|notfound|error)(?:\/|$)/i.test(
          resolvedCanonical.pathname,
        );
    } catch {
      hasNotFoundCanonical =
        /(?:^|\/)(?:404|not-found|notfound|error)(?:\/|$)/i.test(canonicalHref);
    }
  }

  const hasNoindexDirective =
    robotsMetaContent.toLowerCase().includes("noindex") ||
    googlebotMetaContent.toLowerCase().includes("noindex") ||
    xRobotsTagContent.includes("noindex");
  const notFoundSignalCount = [
    hasNotFoundTitle,
    hasNotFoundH1,
    hasNotFoundBody,
    hasNotFoundCanonical,
  ].filter(Boolean).length;
  const isSoft404 =
    (hasNoindexDirective && notFoundSignalCount >= 1) ||
    notFoundSignalCount >= 3 ||
    (hasNotFoundTitle && hasNotFoundCanonical);

  if (isSoft404) {
    issues.push({
      type: "error",
      category: "technical",
      message:
        "Possible soft 404 detected (page serves a not-found template with 200 status)",
      fix: "Return HTTP 404/410 for missing pages, remove indexable links to dead URLs, and avoid serving not-found templates as 200 pages",
      impact: "high",
    });
    score -= 25;
  }

  // robots.txt sitemap reference
  if (ctx.robotsTxtStatus === "found") {
    if (ctx.robotsTxtHasSitemapRef) {
      issues.push({
        type: "success",
        category: "technical",
        message: "Sitemap referenced in robots.txt",
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Sitemap not referenced in robots.txt",
        fix: "Add 'Sitemap: https://yourdomain.com/sitemap.xml' to robots.txt for better discovery",
        impact: "low",
      });
    }
  }

  // Crawl-delay in robots.txt
  if (ctx.robotsTxtCrawlDelay && ctx.robotsTxtCrawlDelay > 5) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `robots.txt includes crawl-delay (${ctx.robotsTxtCrawlDelay}s)`,
      fix: "Google ignores crawl-delay. Use Search Console crawl settings or server controls if crawl rate needs tuning",
      impact: "low",
    });
  }

  // Cache-Control header check
  if (ctx.responseHeaders) {
    const cacheControl = ctx.responseHeaders.get("cache-control");
    if (cacheControl) {
      if (cacheControl.includes("no-store")) {
        issues.push({
          type: "warning",
          category: "technical",
          message: "Cache-Control: no-store prevents all caching",
          fix: "Consider using no-cache (allows caching with revalidation) or max-age for better performance",
          impact: "low",
        });
      } else if (
        cacheControl.includes("no-cache") &&
        !cacheControl.includes("max-age")
      ) {
        issues.push({
          type: "success",
          category: "technical",
          message: "Cache-Control: no-cache (caches with revalidation)",
        });
      } else {
        issues.push({
          type: "success",
          category: "technical",
          message: "Cache-Control headers configured",
        });
      }
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Missing Cache-Control header",
        fix: "Add Cache-Control headers to improve repeat visit performance",
        impact: "low",
      });
    }

    // Referrer-Policy header
    const referrerPolicy = ctx.responseHeaders.get("referrer-policy");
    if (referrerPolicy) {
      issues.push({
        type: "success",
        category: "technical",
        message: "Referrer-Policy header configured",
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Missing Referrer-Policy header",
        fix: "Add Referrer-Policy header (recommended: strict-origin-when-cross-origin)",
        impact: "low",
      });
    }

    // X-Powered-By header leak (security)
    const poweredBy = ctx.responseHeaders.get("x-powered-by");
    if (poweredBy) {
      issues.push({
        type: "warning",
        category: "technical",
        message: `X-Powered-By header exposes server info: "${poweredBy}"`,
        fix: "Remove X-Powered-By header to prevent exposing server technology details",
        impact: "low",
      });
    }

    // HSTS preload check
    const hsts = ctx.responseHeaders.get("strict-transport-security");
    if (hsts) {
      const hasPreload = hsts.includes("preload");
      const hasIncludeSub = hsts.includes("includeSubDomains");
      if (hasPreload && hasIncludeSub) {
        issues.push({
          type: "success",
          category: "technical",
          message: "HSTS with preload and includeSubDomains configured",
        });
      } else if (hasPreload && !hasIncludeSub) {
        issues.push({
          type: "warning",
          category: "technical",
          message: "HSTS has preload but missing includeSubDomains",
          fix: "Add 'includeSubDomains' to Strict-Transport-Security — required for HSTS preload list eligibility",
          impact: "low",
        });
        score -= 2;
      } else if (!hasPreload) {
        issues.push({
          type: "warning",
          category: "technical",
          message: "HSTS missing preload directive",
          fix: "Add 'preload' to Strict-Transport-Security for HSTS preload list eligibility",
          impact: "low",
        });
      }
    }

    // CDN detection via common headers
    const server = ctx.responseHeaders.get("server")?.toLowerCase() || "";
    const via = ctx.responseHeaders.get("via")?.toLowerCase() || "";
    const cfRay = ctx.responseHeaders.get("cf-ray");
    const xCache = ctx.responseHeaders.get("x-cache");
    const cdnIndicators = [
      cfRay && "Cloudflare",
      server.includes("cloudfront") && "CloudFront",
      server.includes("nginx") && via.includes("varnish") && "Varnish CDN",
      xCache && "CDN cache",
      server.includes("vercel") && "Vercel Edge",
      server.includes("netlify") && "Netlify CDN",
      via.includes("akamai") && "Akamai",
    ].filter(Boolean);
    if (cdnIndicators.length > 0) {
      issues.push({
        type: "success",
        category: "technical",
        message: `CDN detected: ${cdnIndicators[0]}`,
      });
    }
  }

  // HTML page size check
  if (ctx.htmlSize) {
    const sizeKB = Math.round(ctx.htmlSize / 1024);
    if (sizeKB > 200) {
      issues.push({
        type: "warning",
        category: "technical",
        message: `Large HTML document (${sizeKB}KB)`,
        fix: "Reduce HTML size below 200KB. Remove inline styles/scripts, minimize whitespace",
        impact: "medium",
      });
      score -= 5;
    } else if (sizeKB > 125) {
      issues.push({
        type: "warning",
        category: "technical",
        message: `HTML document size could be smaller (${sizeKB}KB)`,
        fix: "Consider reducing HTML size for faster parsing. Aim for under 125KB",
        impact: "low",
      });
    } else {
      issues.push({
        type: "success",
        category: "technical",
        message: `Good HTML document size (${sizeKB}KB)`,
      });
    }
  }

  // Meta robots noarchive/nosnippet/unavailable_after
  if (robotsMetaContent) {
    const rc = robotsMetaContent.toLowerCase();
    if (rc.includes("noarchive")) {
      issues.push({
        type: "warning",
        category: "technical",
        message:
          "Meta robots contains 'noarchive' — note that Google removed its cache feature in early 2024",
        fix: "noarchive is now largely moot since Google no longer shows cached pages. Consider removing it to simplify your robots directives",
        impact: "low",
      });
    }
    if (rc.includes("nosnippet")) {
      issues.push({
        type: "warning",
        category: "technical",
        message:
          "Meta robots contains 'nosnippet' - no text snippet in search results",
        fix: "Remove nosnippet to allow Google to display text snippets for better CTR",
        impact: "medium",
      });
      score -= 8;
    }
    if (rc.includes("max-snippet")) {
      issues.push({
        type: "success",
        category: "technical",
        message: "Max-snippet directive configured for snippet control",
      });
    }
    if (rc.includes("max-image-preview")) {
      issues.push({
        type: "success",
        category: "technical",
        message: "Max-image-preview directive configured",
      });
    }
  }

  // iFrame detection - exclude known-good embeds (YouTube, Vimeo, Google Maps, etc.)
  const iframes = ctx.html.match(/<iframe[^>]*>/gi) || [];
  const knownEmbedPatterns =
    /youtube\.com|vimeo\.com|google\.com\/maps|maps\.google|calendly\.com|wistia\.com|dailymotion\.com|spotify\.com|googletagmanager\.com|google-analytics\.com|gtag|hubspot\.com|typeform\.com|intercom\.io/i;
  const unknownIframes = iframes.filter(
    (iframe) => !knownEmbedPatterns.test(iframe),
  );
  if (unknownIframes.length > 3) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `${unknownIframes.length} non-media iframes detected - content inside iframes may not be reliably indexed`,
      fix: "Minimize iframe usage. Content within iframes may not be reliably indexed by search engines",
      impact: "medium",
    });
    score -= 5;
  } else if (unknownIframes.length > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `${unknownIframes.length} iframe(s) detected - content within iframes may not be reliably indexed by search engines`,
      fix: "Ensure important content is not placed inside iframes",
      impact: "low",
    });
  }
  if (iframes.length > 0 && unknownIframes.length < iframes.length) {
    issues.push({
      type: "success",
      category: "technical",
      message: `${iframes.length - unknownIframes.length} media embed(s) detected (YouTube, Maps, etc.)`,
    });
  }

  // Breadcrumb navigation detection - check structural patterns only (class/id/aria/nav)
  // to avoid false positives from text content discussing breadcrumbs
  const hasBreadcrumbNav =
    /(?:class|id)=["'][^"']*breadcrumb/i.test(ctx.html) ||
    /aria-label=["'][^"']*breadcrumb/i.test(ctx.html) ||
    /<nav[^>]*breadcrumb/i.test(ctx.html);
  const hasBreadcrumbSchema = /BreadcrumbList/i.test(ctx.html);
  if (hasBreadcrumbNav && hasBreadcrumbSchema) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Breadcrumb navigation with BreadcrumbList schema detected",
    });
  } else if (hasBreadcrumbNav) {
    issues.push({
      type: "warning",
      category: "technical",
      message: "Breadcrumb navigation found but missing BreadcrumbList schema",
      fix: "Add BreadcrumbList JSON-LD schema to enable breadcrumb rich results in Google",
      impact: "medium",
    });
    score -= 3;
  } else if (hasBreadcrumbSchema) {
    issues.push({
      type: "success",
      category: "technical",
      message: "BreadcrumbList schema markup present",
    });
  }

  // Meta http-equiv="refresh" detection (client-side redirect — bad for SEO)
  const metaRefreshMatch = ctx.html.match(
    /<meta[^>]+http-equiv\s*=\s*["']refresh["'][^>]*>/i,
  );
  if (metaRefreshMatch) {
    const refreshContent =
      extractTagAttributeValue(metaRefreshMatch[0], "content") || "";
    const hasUrlRedirect = /url\s*=/i.test(refreshContent);
    if (hasUrlRedirect) {
      issues.push({
        type: "error",
        category: "technical",
        message: "Client-side redirect via meta http-equiv=\"refresh\" detected",
        fix: "Replace meta refresh redirects with server-side 301 redirects for better SEO and user experience",
        impact: "high",
      });
      score -= 10;
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Meta http-equiv=\"refresh\" auto-reload detected",
        fix: "Auto-refreshing pages can confuse search engines and degrade user experience",
        impact: "medium",
      });
      score -= 3;
    }
  }

  // Last-Modified / ETag freshness headers
  if (ctx.responseHeaders) {
    const hasLastModified = Boolean(ctx.responseHeaders.get("last-modified"));
    const hasETag = Boolean(ctx.responseHeaders.get("etag"));
    if (hasLastModified || hasETag) {
      issues.push({
        type: "success",
        category: "technical",
        message: `Freshness headers present (${[hasLastModified && "Last-Modified", hasETag && "ETag"].filter(Boolean).join(", ")})`,
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Missing Last-Modified and ETag headers",
        fix: "Add Last-Modified or ETag headers to enable conditional requests and improve crawl efficiency",
        impact: "low",
      });
    }
  }

  return { score: Math.max(0, score), issues };
}
