import type { SEOIssue, International } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";
import {
  extractLinkTagsByRel,
  extractTagAttributeValue,
  extractLinkHrefByRelSafe,
} from "../html-utils";

function isValidHreflang(value: string): boolean {
  if (value === "x-default") return true;
  // Pragmatic BCP47 subset commonly used for hreflang: en, en-US, zh-Hant, sr-Latn-RS, etc.
  return /^[a-z]{2,3}(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?(?:-[a-z0-9]{5,8})*$/i.test(
    value,
  );
}

export function analyzeInternational(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
  data: International;
} {
  const issues: SEOIssue[] = [];
  let score = 100;

  const normalizeUrl = (input: string): string => {
    const parsed = new URL(input);
    parsed.hostname = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    const normalizedPath = parsed.pathname.replace(/\/+$/, "") || "/";
    return `${parsed.protocol}//${parsed.hostname}${normalizedPath}${parsed.search}`;
  };

  const alternateLinks = extractLinkTagsByRel(ctx.html, "alternate");
  const hreflangTags: Array<{ lang: string; href: string }> = [];
  for (const tag of alternateLinks) {
    const lang = extractTagAttributeValue(tag, "hreflang")
      ?.trim()
      .toLowerCase();
    const href = extractTagAttributeValue(tag, "href")?.trim();
    if (!lang || !href) continue;
    if (!hreflangTags.find((t) => t.lang === lang && t.href === href)) {
      hreflangTags.push({ lang, href });
    }
  }

  const hasXDefault = hreflangTags.some((t) => t.lang === "x-default");
  const currentUrl = ctx.finalUrl || ctx.url.href;
  let normalizedCurrent: string | null = null;
  try {
    normalizedCurrent = normalizeUrl(currentUrl);
  } catch {
    normalizedCurrent = null;
  }
  const hasSelfReference = hreflangTags.some((t) => {
    try {
      if (!normalizedCurrent) return false;
      return (
        normalizeUrl(new URL(t.href, (ctx.baseUrl ?? ctx.url).href).href) === normalizedCurrent
      );
    } catch {
      return false;
    }
  });

  if (hreflangTags.length > 0) {
    const uniqueLangCount = new Set(hreflangTags.map((t) => t.lang)).size;
    issues.push({
      type: "success",
      category: "international",
      message: `Hreflang tags found (${uniqueLangCount} language${uniqueLangCount === 1 ? "" : "s"})`,
    });
    const invalidTags = hreflangTags.filter((t) => !isValidHreflang(t.lang));
    if (invalidTags.length > 0) {
      const invalidValues = Array.from(
        new Set(invalidTags.map((t) => t.lang)),
      ).slice(0, 3);
      issues.push({
        type: "warning",
        category: "international",
        message: `Invalid hreflang value${invalidValues.length > 1 ? "s" : ""}: ${invalidValues.join(", ")}`,
        fix: "Use valid BCP47 language/region tags (e.g., en, en-US, fr-CA) or x-default",
        impact: "medium",
      });
      score -= 5;
    }
    const langCounts = new Map<string, number>();
    for (const tag of hreflangTags) {
      langCounts.set(tag.lang, (langCounts.get(tag.lang) || 0) + 1);
    }
    const duplicatedLangs = Array.from(langCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([lang]) => lang);
    if (duplicatedLangs.length > 0) {
      issues.push({
        type: "warning",
        category: "international",
        message: `Duplicate hreflang language entries: ${duplicatedLangs.slice(0, 3).join(", ")}`,
        fix: "Keep one canonical alternate URL per hreflang language/region code",
        impact: "low",
      });
      score -= 2;
    }
    if (!hasXDefault) {
      issues.push({
        type: "warning",
        category: "international",
        message: "Missing hreflang x-default tag",
        fix: "Add x-default only when you have a true language/region fallback page",
        impact: "low",
      });
    } else {
      issues.push({
        type: "success",
        category: "international",
        message: "Hreflang x-default tag present",
      });
    }
    if (!hasSelfReference) {
      issues.push({
        type: "warning",
        category: "international",
        message: "Missing hreflang self-reference",
        fix: "Google recommends including the current page URL in hreflang annotations for consistency",
        impact: "low",
      });
      score -= 1;
    } else {
      issues.push({
        type: "success",
        category: "international",
        message: "Hreflang self-reference present",
      });
    }
    // Check that all hreflang href values are absolute URLs (Google requirement)
    const relativeHrefs = hreflangTags.filter(
      (t) => !t.href.startsWith("http://") && !t.href.startsWith("https://"),
    );
    if (relativeHrefs.length > 0) {
      issues.push({
        type: "error",
        category: "international",
        message: `${relativeHrefs.length} hreflang tag(s) use relative URLs`,
        fix: "Google requires hreflang href values to be fully-qualified absolute URLs (https://...)",
        impact: "high",
      });
      score -= 5;
    }
    // Check hreflang self-reference matches canonical URL
    const canonicalHref = extractLinkHrefByRelSafe(ctx.html, "canonical");
    if (canonicalHref && hasSelfReference) {
      try {
        const normalizedCanonical = normalizeUrl(
          new URL(canonicalHref, (ctx.baseUrl ?? ctx.url).href).href,
        );
        const selfTag = hreflangTags.find((t) => {
          try {
            return (
              normalizedCurrent !== null &&
              normalizeUrl(new URL(t.href, (ctx.baseUrl ?? ctx.url).href).href) ===
                normalizedCurrent
            );
          } catch {
            return false;
          }
        });
        if (selfTag) {
          const normalizedSelf = normalizeUrl(
            new URL(selfTag.href, (ctx.baseUrl ?? ctx.url).href).href,
          );
          if (normalizedSelf !== normalizedCanonical) {
            issues.push({
              type: "warning",
              category: "international",
              message:
                "Hreflang self-reference URL doesn't match canonical URL",
              fix: "Ensure the hreflang annotation for this page points to the same URL as the canonical tag to avoid conflicting signals",
              impact: "medium",
            });
            score -= 3;
          }
        }
      } catch {
        // skip if URL parsing fails
      }
    }
  } else {
    const hasLang = /<html[^>]+lang=["']/i.test(ctx.html);
    if (hasLang) {
      issues.push({
        type: "success",
        category: "international",
        message: "HTML lang attribute set (single-language site)",
      });
    } else {
      issues.push({
        type: "warning",
        category: "international",
        message: "No language declaration found",
        fix: "Add lang attribute to <html> for accessibility and clearer language metadata",
        impact: "low",
      });
    }
  }

  return {
    score: Math.max(0, score),
    issues,
    data: { hreflangTags, hasXDefault, hasSelfReference },
  };
}
