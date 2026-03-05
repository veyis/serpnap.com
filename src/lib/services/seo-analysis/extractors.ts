import type {
  PagePreview,
  ContentMetrics,
  PerformanceHints,
  UrlAnalysis,
  HeadingNode,
  LinkAnalysis,
  ImageAnalysis,
} from "@/schemas/seo-checker";
import type { AnalysisContext } from "./types";
import {
  stripHtmlToText,
  decodeEntities,
  extractMetaContentSafe,
  isSameHost,
  getVisibleHtml,
  extractAnchorTagMatches,
  extractTagAttributeValue,
  extractLinkTagsByRel,
} from "./html-utils";

export function extractPagePreview(ctx: AnalysisContext): PagePreview {
  const titleMatch = ctx.html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch?.[1]?.trim() || ctx.url.hostname;
  const description =
    decodeEntities(extractMetaContentSafe(ctx.html, "description")) ||
    "No description available";

  const faviconPatterns = [
    /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i,
  ];
  let favicon: string | null = null;
  for (const pattern of faviconPatterns) {
    const match = ctx.html.match(pattern);
    if (match?.[1]) {
      favicon = match[1];
      if (favicon.startsWith("/") && !favicon.startsWith("//"))
        favicon = `${ctx.url.protocol}//${ctx.url.host}${favicon}`;
      else if (favicon.startsWith("//"))
        favicon = `${ctx.url.protocol}${favicon}`;
      else if (!favicon.startsWith("http"))
        favicon = `${ctx.url.protocol}//${ctx.url.host}/${favicon}`;
      break;
    }
  }
  // Fallback to /favicon.ico if no link tag found but HEAD check succeeded
  if (!favicon && ctx.faviconIcoUrl) {
    favicon = ctx.faviconIcoUrl;
  }

  return {
    title: title.slice(0, 70),
    description,
    url: ctx.url.href,
    favicon,
  };
}

export function extractContentMetrics(ctx: AnalysisContext): ContentMetrics {
  const cleanText = stripHtmlToText(ctx.html);
  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  // Use visibleHtml for heading counts (consistent with analyzeContent)
  const visibleHtml = getVisibleHtml(ctx.html);
  const h1Count = (visibleHtml.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (visibleHtml.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (visibleHtml.match(/<h3[^>]*>/gi) || []).length;
  const h4Count = (visibleHtml.match(/<h4[^>]*>/gi) || []).length;
  const h5Count = (visibleHtml.match(/<h5[^>]*>/gi) || []).length;
  const h6Count = (visibleHtml.match(/<h6[^>]*>/gi) || []).length;
  const paragraphCount = (visibleHtml.match(/<p[^>]*>/gi) || []).length;

  const linkMatches = extractAnchorTagMatches(visibleHtml);
  let internalLinks = 0;
  let externalLinks = 0;
  let nofollowLinks = 0;
  for (const link of linkMatches) {
    const relValue =
      extractTagAttributeValue(link.fullTag, "rel")?.toLowerCase() || "";
    const isNofollow = relValue.split(/\s+/).includes("nofollow");
    if (isNofollow) nofollowLinks++;
    const href = link.href;
    if (!href) continue;
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:")
    )
      continue;
    if (href.startsWith("//")) {
      if (isSameHost(`${ctx.url.protocol}${href}`, ctx.url)) internalLinks++;
      else externalLinks++;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      if (isSameHost(href, ctx.url)) internalLinks++;
      else externalLinks++;
    } else if (href.startsWith("/") || !href.includes(":")) {
      internalLinks++; // Relative URL without protocol
    }
  }

  const imgMatches = visibleHtml.match(/<img[^>]*>/gi) || [];
  const totalImages = imgMatches.length;
  // Count only descriptive alt (non-empty) — alt="" is decorative, not "with alt text"
  const imagesWithAlt = imgMatches.filter((img) => {
    const alt = extractTagAttributeValue(img, "alt");
    return alt !== null && alt.trim().length > 0;
  }).length;
  // Count only truly missing alt attribute — alt="" is intentional and valid
  const imagesMissingAlt = imgMatches.filter(
    (img) => extractTagAttributeValue(img, "alt") === null,
  ).length;
  const listCount = (visibleHtml.match(/<(?:ul|ol)[^>]*>/gi) || []).length;
  const tableCount = (visibleHtml.match(/<table[^>]*>/gi) || []).length;

  return {
    wordCount,
    headingCount: {
      h1: h1Count,
      h2: h2Count,
      h3: h3Count,
      h4: h4Count,
      h5: h5Count,
      h6: h6Count,
    },
    paragraphCount,
    linkCount: {
      internal: internalLinks,
      external: externalLinks,
      nofollow: nofollowLinks,
    },
    imageCount: {
      total: totalImages,
      withAlt: imagesWithAlt,
      withoutAlt: imagesMissingAlt,
    },
    listCount,
    tableCount,
  };
}

export function extractPerformanceHints(
  ctx: AnalysisContext,
): PerformanceHints {
  const scriptTags = ctx.html.match(/<script\b[^>]*>/gi) || [];
  // Only count executable scripts — skip data containers (type="text/plain",
  // "application/json", etc.) which the browser doesn't fetch or execute.
  const executableTypes = new Set([
    "",
    "text/javascript",
    "application/javascript",
    "module",
    "text/ecmascript",
    "application/ecmascript",
  ]);
  const externalScriptTags = scriptTags.filter((tag) => {
    if (!extractTagAttributeValue(tag, "src")) return false;
    const type = (
      extractTagAttributeValue(tag, "type") || ""
    )
      .toLowerCase()
      .trim();
    return executableTypes.has(type);
  });
  // Strip noscript before counting images — noscript fallback images aren't
  // loaded when JS is enabled and don't affect real-world performance.
  const visibleForPerf = getVisibleHtml(ctx.html);
  const imgTags = visibleForPerf.match(/<img\b[^>]*>/gi) || [];

  return {
    hasPreconnect: extractLinkTagsByRel(ctx.html, "preconnect").length > 0,
    hasPreload: extractLinkTagsByRel(ctx.html, "preload").length > 0,
    hasDeferredScripts: externalScriptTags.some((tag) => {
      const type = extractTagAttributeValue(tag, "type")?.toLowerCase();
      return /\bdefer\b/i.test(tag) || type === "module";
    }),
    hasAsyncScripts: externalScriptTags.some((tag) => /\basync\b/i.test(tag)),
    hasLazyImages: imgTags.some(
      (tag) =>
        (extractTagAttributeValue(tag, "loading") || "").toLowerCase() ===
        "lazy",
    ),
    scriptCount: externalScriptTags.length,
    // Only count stylesheet links with a real href attribute.
    // Tags with data-href (e.g. GitHub theme templates) are not loaded.
    stylesheetCount: extractLinkTagsByRel(ctx.html, "stylesheet").filter(
      (tag) => Boolean(extractTagAttributeValue(tag, "href")),
    ).length,
    totalImageCount: imgTags.length,
  };
}

export function extractUrlAnalysis(inputUrl: string): UrlAnalysis {
  const parsed = new URL(inputUrl);
  const path = parsed.pathname;
  const segments = path.split("/").filter(Boolean);
  const hasSpecialChars = /[^a-zA-Z0-9\-_\/.]/.test(path);
  return {
    length: inputUrl.length,
    hasSpecialChars,
    depth: segments.length,
    isClean: !hasSpecialChars && segments.every((s) => s.length < 50),
    // Note: true consistency can only be determined by checking multiple URLs.
    // This field indicates whether this single URL has a trailing slash.
    trailingSlashConsistent: true, // single URL cannot determine site-wide consistency
  };
}

export function extractHeadingHierarchy(ctx: AnalysisContext): HeadingNode[] {
  const headings: HeadingNode[] = [];
  const visibleHtml = getVisibleHtml(ctx.html);
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  let lastLevel = 0;
  while ((match = headingRegex.exec(visibleHtml)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2]
      .replace(/<[^>]+>/g, "")
      .trim()
      .slice(0, 80);
    const isSkipped = lastLevel > 0 && level > lastLevel + 1;
    headings.push({ level, text, isSkipped });
    lastLevel = level;
  }
  return headings;
}

export function extractLinkAnalysis(ctx: AnalysisContext): LinkAnalysis {
  const visibleHtml = getVisibleHtml(ctx.html);
  const allLinks = extractAnchorTagMatches(visibleHtml);
  let emptyHrefs = 0;
  let nofollowInternalLinks = 0;
  let sponsoredLinks = 0;
  let ugcLinks = 0;

  for (const link of allLinks) {
    const href = link.href;
    if (href === "" || href === "#") emptyHrefs++;
    const rel =
      extractTagAttributeValue(link.fullTag, "rel")?.toLowerCase() || "";
    if (rel.includes("nofollow")) {
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        href.startsWith("data:") ||
        href === "#"
      ) {
        // Not a page link - skip
      } else if (
        !href.startsWith("http://") &&
        !href.startsWith("https://") &&
        !href.startsWith("//")
      ) {
        nofollowInternalLinks++; // Relative URL - internal
      } else if (
        isSameHost(
          href.startsWith("//") ? `${ctx.url.protocol}${href}` : href,
          ctx.url,
        )
      ) {
        nofollowInternalLinks++;
      }
    }
    if (rel.includes("sponsored")) sponsoredLinks++;
    if (rel.includes("ugc")) ugcLinks++;
  }

  return { emptyHrefs, nofollowInternalLinks, sponsoredLinks, ugcLinks };
}

export function extractImageAnalysis(ctx: AnalysisContext): ImageAnalysis {
  // Strip noscript to avoid counting fallback images that aren't rendered
  const visibleHtml = getVisibleHtml(ctx.html);
  const imgMatches = visibleHtml.match(/<img[^>]*>/gi) || [];
  let srcsetCount = 0;
  let withDimensions = 0;
  let withoutDimensions = 0;

  for (const img of imgMatches) {
    if (/srcset/i.test(img)) srcsetCount++;
    if (/\bwidth\s*=/i.test(img) && /\bheight\s*=/i.test(img)) withDimensions++;
    else withoutDimensions++;
  }

  const figcaptionCount = (ctx.html.match(/<figcaption/gi) || []).length;

  return { srcsetCount, figcaptionCount, withDimensions, withoutDimensions };
}
