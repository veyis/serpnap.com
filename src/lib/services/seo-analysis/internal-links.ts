import type { InternalLinkStructure } from "@/schemas/seo-checker";
import type { AnalysisContext } from "./types";
import {
  isSameHost,
  getVisibleHtml,
  extractAnchorTagMatches,
} from "./html-utils";

export const GENERIC_ANCHOR_TEXTS = new Set([
  "click here",
  "read more",
  "learn more",
  "here",
  "this",
  "link",
  "more info",
  "go",
  "visit",
  "see more",
  "more",
  "details",
  "info",
  "continue",
  "continue reading",
  "find out more",
  "check it out",
  "this link",
  "this page",
  "view more",
  "see details",
]);

export function analyzeInternalLinkStructure(
  ctx: AnalysisContext,
): InternalLinkStructure {
  const visibleHtml = getVisibleHtml(ctx.html);

  // Identify non-content chrome ranges in source order.
  // Using string inclusion can misclassify duplicate anchor HTML that appears in both nav and body.
  const chromeRanges: Array<{ start: number; end: number }> = [];
  const chromePattern = /<(nav|header|footer|aside)\b[\s\S]*?<\/\1>/gi;
  for (const match of visibleHtml.matchAll(chromePattern)) {
    const start = match.index ?? -1;
    if (start < 0) continue;
    chromeRanges.push({ start, end: start + match[0].length });
  }
  const isChromeIndex = (index: number): boolean =>
    chromeRanges.some((range) => index >= range.start && index < range.end);

  const anchors = extractAnchorTagMatches(visibleHtml);

  const allLinks: { href: string; anchor: string; isContentBody: boolean }[] =
    [];
  let externalCount = 0;
  let fragmentOnlyLinks = 0;

  for (const anchorMatch of anchors) {
    const rawHref = anchorMatch.href.trim();
    const rawInner = anchorMatch.innerHtml;

    // Skip non-navigational protocols
    const lowerHref = rawHref.toLowerCase();
    if (
      lowerHref.startsWith("mailto:") ||
      lowerHref.startsWith("tel:") ||
      lowerHref.startsWith("javascript:") ||
      lowerHref.startsWith("data:")
    )
      continue;

    // Check if fragment-only
    if (rawHref.startsWith("#")) {
      fragmentOnlyLinks++;
      continue;
    }

    // Protocol-relative URLs (//cdn.example.com) must go through isSameHost, not short-circuit on "/"
    const isInternal =
      rawHref === "" ||
      (rawHref.startsWith("/") && !rawHref.startsWith("//")) ||
      isSameHost(rawHref, ctx.url);

    if (!isInternal) {
      externalCount++;
      continue;
    }

    // Extract visible text from anchor: strip tags, decode common HTML entities
    let anchorText = rawInner
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Check for image-only links with alt text
    if (!anchorText) {
      const altMatch = rawInner.match(/alt\s*=\s*["']([^"']*)["']/i);
      if (altMatch && altMatch[1].trim()) {
        anchorText = altMatch[1].trim();
      }
    }

    // Determine if link is in content body using source position.
    const isContentBody =
      anchorMatch.index >= 0 ? !isChromeIndex(anchorMatch.index) : true;

    allLinks.push({ href: rawHref, anchor: anchorText, isContentBody });
  }

  // Normalize internal URLs to pathname for dedup
  const normalizeHref = (href: string): string => {
    try {
      const resolved = new URL(href, (ctx.baseUrl ?? ctx.url).href);
      return resolved.pathname.replace(/\/$/, "") || "/";
    } catch {
      return href.replace(/\/$/, "") || "/";
    }
  };

  // Build unique destinations
  const destinationSet = new Set<string>();
  for (const link of allLinks) {
    destinationSet.add(normalizeHref(link.href));
  }

  // Content body vs navigation
  const contentBodyLinks = allLinks.filter((l) => l.isContentBody).length;
  const navigationLinks = allLinks.length - contentBodyLinks;

  // Generic anchors
  const genericAnchors: InternalLinkStructure["genericAnchors"] = [];
  for (const link of allLinks) {
    if (link.anchor && GENERIC_ANCHOR_TEXTS.has(link.anchor.toLowerCase())) {
      genericAnchors.push({ anchor: link.anchor, href: link.href });
    }
  }

  // Empty anchors
  const emptyAnchors: InternalLinkStructure["emptyAnchors"] = [];
  for (const link of allLinks) {
    if (!link.anchor) {
      emptyAnchors.push({
        href: link.href,
        context: link.isContentBody ? "content body" : "navigation",
      });
    }
  }

  // Duplicate links: same normalized URL with same anchor text >3 times
  const dupeMap = new Map<string, Map<string, number>>();
  for (const link of allLinks) {
    const norm = normalizeHref(link.href);
    if (!dupeMap.has(norm)) dupeMap.set(norm, new Map());
    const anchorMap = dupeMap.get(norm)!;
    anchorMap.set(link.anchor, (anchorMap.get(link.anchor) || 0) + 1);
  }
  const duplicateLinks: InternalLinkStructure["duplicateLinks"] = [];
  for (const [href, anchorMap] of dupeMap) {
    const totalCount = Array.from(anchorMap.values()).reduce(
      (s, c) => s + c,
      0,
    );
    const hasDupes = Array.from(anchorMap.values()).some((c) => c > 3);
    if (hasDupes) {
      duplicateLinks.push({
        href,
        count: totalCount,
        anchors: Array.from(anchorMap.keys()).filter(Boolean),
      });
    }
  }

  // Depth distribution from unique internal URLs
  const depthDistribution: Record<string, number> = {};
  for (const path of destinationSet) {
    const segments = path.split("/").filter(Boolean);
    const depth = String(segments.length);
    depthDistribution[depth] = (depthDistribution[depth] || 0) + 1;
  }

  // Internal:external ratio
  const internalToExternalRatio =
    externalCount > 0
      ? Math.round((allLinks.length / externalCount) * 10) / 10
      : allLinks.length > 0
        ? allLinks.length
        : 0;

  return {
    totalLinks: allLinks.length,
    uniqueDestinations: destinationSet.size,
    contentBodyLinks,
    navigationLinks,
    genericAnchors,
    emptyAnchors,
    duplicateLinks,
    depthDistribution,
    internalToExternalRatio,
    fragmentOnlyLinks,
  };
}
