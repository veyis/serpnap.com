import type { SEOIssue } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";
import { BENCHMARKS } from "../constants";
import {
  extractMetaContentSafe,
  decodeEntities,
  extractLinkHrefByRelSafe,
  extractCanonicalFromLinkHeader,
} from "../html-utils";

function estimateSerpTitlePixelWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    if (char === " ") {
      width += 3;
      continue;
    }
    if (/[.,:;'"!|`ilI1]/.test(char)) {
      width += 4;
      continue;
    }
    if (/[MW@#%&QGO]/.test(char)) {
      width += 10;
      continue;
    }
    if (/[A-Z]/.test(char)) {
      width += 8;
      continue;
    }
    width += 7;
  }
  return width;
}

export function analyzeMeta(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
} {
  const issues: SEOIssue[] = [];
  let score = 100;

  const titleMatch = ctx.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleRaw = titleMatch?.[1]?.trim() || "";
  const title = decodeEntities(titleRaw).replace(/\s+/g, " ").trim();
  const titlePixelWidth = estimateSerpTitlePixelWidth(title);

  if (!title) {
    issues.push({
      type: "error",
      category: "meta",
      message: "Missing title tag",
      fix: "Add a unique, descriptive <title> tag (50-60 characters)",
      impact: "high",
    });
    score -= 25;
  } else if (title.length < 30) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `Title too short (${title.length} characters)`,
      fix: "Expand your title to 50-60 characters for better visibility in search results",
      impact: "medium",
    });
    score -= 12;
  } else if (titlePixelWidth > 580 || title.length > 75) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `Title may be truncated (${title.length} characters, ~${Math.round(titlePixelWidth)}px)`,
      fix: "Keep title under ~580px (typically 50-60 chars) to reduce truncation risk in search results",
      impact: "low",
    });
    score -= 5;
  } else {
    issues.push({
      type: "success",
      category: "meta",
      message: `Good title length (${title.length} characters)`,
    });
  }

  const descriptionRaw = extractMetaContentSafe(ctx.html, "description");
  const description = decodeEntities(descriptionRaw);

  if (!description) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing meta description",
      fix: "Add a compelling meta description (120-160 characters) with your target keywords",
      impact: "medium",
    });
    score -= 8;
  } else if (description.length < BENCHMARKS.minDescLength) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `Meta description too short (${description.length} characters)`,
      fix: `Expand your description to ${BENCHMARKS.minDescLength}-${BENCHMARKS.maxDescLength} characters for optimal display`,
      impact: "medium",
    });
    score -= 8;
  } else if (description.length > BENCHMARKS.maxDescLength) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `Meta description may be truncated (${description.length} characters)`,
      fix: `Shorten to ${BENCHMARKS.minDescLength}-${BENCHMARKS.maxDescLength} characters to avoid truncation`,
      impact: "low",
    });
    score -= 3;
  } else {
    issues.push({
      type: "success",
      category: "meta",
      message: `Optimal meta description length (${description.length} characters)`,
    });
  }

  const canonicalHref =
    extractLinkHrefByRelSafe(ctx.html, "canonical") ||
    extractCanonicalFromLinkHeader(ctx.responseHeaders?.get("link"));
  if (!canonicalHref) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing canonical URL",
      fix: 'Add <link rel="canonical" href="..."> to prevent duplicate content issues',
      impact: "medium",
    });
    score -= 8;
  } else {
    const canonicalUrl = canonicalHref;
    try {
      const parsed = new URL(canonicalUrl, (ctx.baseUrl ?? ctx.url).href);
      const isHttpCanonical =
        parsed.protocol === "http:" || parsed.protocol === "https:";
      const hasAbsoluteProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(canonicalUrl);

      if (!isHttpCanonical) {
        issues.push({
          type: "warning",
          category: "meta",
          message: "Canonical URL uses unsupported protocol",
          fix: "Use an HTTP or HTTPS canonical URL",
          impact: "medium",
        });
        score -= 5;
      } else {
        issues.push({
          type: "success",
          category: "meta",
          message: "Canonical URL defined",
        });
        if (!hasAbsoluteProtocol) {
          issues.push({
            type: "warning",
            category: "meta",
            message: "Canonical URL is not absolute",
            fix: "Use an absolute canonical URL (https://...) for clearer canonicalization signals",
            impact: "low",
          });
        }
      }
    } catch {
      issues.push({
        type: "warning",
        category: "meta",
        message: "Canonical URL format may be invalid",
        fix: "Ensure canonical URL is an absolute URL (https://...)",
        impact: "medium",
      });
      score -= 5;
    }
  }

  const hasOgTitle = /<meta[^>]+property=["']og:title["']/i.test(ctx.html);
  const hasOgDesc = /<meta[^>]+property=["']og:description["']/i.test(ctx.html);
  const hasOgImage = /<meta[^>]+property=["']og:image["']/i.test(ctx.html);
  const hasOgUrl = /<meta[^>]+property=["']og:url["']/i.test(ctx.html);
  const hasOgType = /<meta[^>]+property=["']og:type["']/i.test(ctx.html);

  const missingOg: string[] = [];
  if (!hasOgTitle) missingOg.push("og:title");
  if (!hasOgDesc) missingOg.push("og:description");
  if (!hasOgImage) missingOg.push("og:image");

  const missingOgSecondary: string[] = [];
  if (!hasOgUrl) missingOgSecondary.push("og:url");
  if (!hasOgType) missingOgSecondary.push("og:type");

  if (missingOg.length > 0) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `Missing essential Open Graph tags: ${missingOg.join(", ")}`,
      fix: "Add Open Graph meta tags for better social media sharing and click-through rates",
      impact: "medium",
    });
    score -= missingOg.length * 4;
  } else {
    issues.push({
      type: "success",
      category: "meta",
      message:
        "Essential Open Graph tags complete (og:title, og:description, og:image)",
    });
    if (missingOgSecondary.length > 0) {
      issues.push({
        type: "warning",
        category: "meta",
        message: `Optional Open Graph tags missing: ${missingOgSecondary.join(", ")}`,
        fix: "Consider adding og:url and og:type for complete social sharing support",
        impact: "low",
      });
      score -= missingOgSecondary.length * 1;
    }
  }

  const twitterCardValue = extractMetaContentSafe(ctx.html, "twitter:card");
  const hasTwitterCard = Boolean(twitterCardValue);
  const hasTwitterImage = Boolean(
    extractMetaContentSafe(ctx.html, "twitter:image"),
  );
  if (!hasTwitterCard) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing Twitter Card meta tag",
      fix: 'Add <meta name="twitter:card" content="summary_large_image"> for Twitter sharing',
      impact: "low",
    });
    score -= 4;
  } else {
    const cardType = twitterCardValue.toLowerCase();
    if (cardType === "summary_large_image" && !hasTwitterImage && !hasOgImage) {
      issues.push({
        type: "warning",
        category: "meta",
        message:
          "Twitter Card set to summary_large_image but no image specified",
        fix: "Add twitter:image meta tag or ensure og:image is set",
        impact: "low",
      });
      score -= 2;
    } else {
      issues.push({
        type: "success",
        category: "meta",
        message: "Twitter Card configured",
      });
    }
  }

  if (title) {
    const titleWords = title.toLowerCase().split(/\s+/);
    const wordCounts: Record<string, number> = {};
    for (const w of titleWords) {
      if (w.length > 3) wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
    const stuffedWord = Object.entries(wordCounts).find(
      ([, count]) => count >= 3,
    );
    if (stuffedWord) {
      issues.push({
        type: "warning",
        category: "meta",
        message: `Title keyword stuffing: "${stuffedWord[0]}" appears ${stuffedWord[1]} times`,
        fix: "Avoid repeating the same word more than twice in the title",
        impact: "medium",
      });
      score -= 5;
    }
  }

  const viewportContent = extractMetaContentSafe(ctx.html, "viewport");
  if (viewportContent) {
    const vpContent = viewportContent.toLowerCase();
    // Check user-scalable=no or maximum-scale=1 or 1.0 (but not 1.5, 10, etc.)
    const disablesZoom =
      vpContent.includes("user-scalable=no") ||
      /maximum-scale\s*=\s*1(?:\.0)?(?:[,;\s]|$)/.test(vpContent);
    if (disablesZoom) {
      issues.push({
        type: "warning",
        category: "meta",
        message: "Viewport disables user zoom",
        fix: "Remove user-scalable=no and maximum-scale=1 for better accessibility",
        impact: "medium",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "meta",
        message: "Viewport allows user zoom",
      });
    }
  }

  const hasThemeColor = /<meta[^>]+name=["']theme-color["']/i.test(ctx.html);
  if (hasThemeColor) {
    issues.push({
      type: "success",
      category: "meta",
      message: "Theme color meta tag present",
    });
  } else {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing theme-color meta tag",
      fix: "Add <meta name='theme-color'> for branded mobile browser experience",
      impact: "low",
    });
    score -= 2;
  }

  const htmlLang =
    ctx.html.match(/<html[^>]+lang=["']?([a-zA-Z-]+)["']?/i)?.[1] || "";
  const hasHreflangAlternates =
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["']/i.test(
      ctx.html,
    );

  // og:locale check (optional for single-locale pages)
  const hasOgLocale = /<meta[^>]+property=["']og:locale["']/i.test(ctx.html);
  if (hasOgLocale) {
    issues.push({
      type: "success",
      category: "meta",
      message: "Open Graph locale set",
    });
  } else if (hasOgTitle && (hasHreflangAlternates || /-/.test(htmlLang))) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing og:locale meta tag",
      fix: 'Add <meta property="og:locale" content="en_US"> for accurate locale targeting',
      impact: "low",
    });
    score -= 1;
  } else if (hasOgTitle) {
    issues.push({
      type: "success",
      category: "meta",
      message: "og:locale omitted (acceptable for single-locale pages)",
    });
  }

  // og:image dimensions check
  const hasOgImageWidth = /<meta[^>]+property=["']og:image:width["']/i.test(
    ctx.html,
  );
  const hasOgImageHeight = /<meta[^>]+property=["']og:image:height["']/i.test(
    ctx.html,
  );
  if (hasOgImage && (!hasOgImageWidth || !hasOgImageHeight)) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing og:image dimensions (width/height)",
      fix: "Add og:image:width and og:image:height for faster social card rendering",
      impact: "low",
    });
    score -= 2;
  } else if (hasOgImage && hasOgImageWidth && hasOgImageHeight) {
    issues.push({
      type: "success",
      category: "meta",
      message: "Open Graph image dimensions specified",
    });
  }

  // Duplicate title detection (multiple <title> tags, excluding SVG <title> elements)
  const htmlWithoutSvg = ctx.html.replace(/<svg[\s\S]*?<\/svg>/gi, "");
  const titleMatches = htmlWithoutSvg.match(/<title[^>]*>/gi) || [];
  if (titleMatches.length > 1) {
    issues.push({
      type: "error",
      category: "meta",
      message: `Duplicate title tags found (${titleMatches.length})`,
      fix: "Remove duplicate <title> tags - only one should exist in the document",
      impact: "high",
    });
    score -= 10;
  }

  // Twitter Card type validation
  if (hasTwitterCard) {
    const validTypes = ["summary", "summary_large_image", "app", "player"];
    if (!validTypes.includes(twitterCardValue.toLowerCase())) {
      issues.push({
        type: "warning",
        category: "meta",
        message: `Invalid Twitter Card type: "${twitterCardValue}"`,
        fix: "Use a valid type: summary, summary_large_image, app, or player",
        impact: "low",
      });
      score -= 2;
    }
  }

  // Title and H1 keyword alignment check
  if (title) {
    const h1Match = ctx.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";
    if (h1Text) {
      const titleWords = new Set(
        title
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 3),
      );
      const h1Words = h1Text
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      const overlap = h1Words.filter((w) => titleWords.has(w)).length;
      const overlapRatio = h1Words.length > 0 ? overlap / h1Words.length : 0;
      if (overlapRatio >= 0.3) {
        issues.push({
          type: "success",
          category: "meta",
          message: "Title and H1 have keyword alignment",
        });
      } else if (overlapRatio === 0 && h1Words.length > 0) {
        issues.push({
          type: "warning",
          category: "meta",
          message: "Title and H1 have no keyword overlap",
          fix: "Consider aligning title and H1 around the same topic when this is a core landing page",
          impact: "low",
        });
      }
    }
  }

  // Multiple meta descriptions detection
  const descMatches =
    ctx.html.match(/<meta[^>]+name=["']description["']/gi) || [];
  if (descMatches.length > 1) {
    issues.push({
      type: "error",
      category: "meta",
      message: `Duplicate meta descriptions found (${descMatches.length})`,
      fix: "Remove duplicate meta description tags - only one should exist",
      impact: "high",
    });
    score -= 10;
  }

  // Description CTA language is optional and highly intent-dependent.
  if (description) {
    const ctaPattern =
      /\b(?:learn|discover|get started|get|find out|find|try|start|buy|download|sign up|free|today|now)\b/i;
    const hasCTA = ctaPattern.test(description);
    if (hasCTA) {
      issues.push({
        type: "success",
        category: "meta",
        message: "Meta description contains call-to-action words",
      });
    }
  }

  // og:site_name check (optional — brand attribution may already be in the title)
  const hasOgSiteName = /<meta[^>]+property=["']og:site_name["']/i.test(
    ctx.html,
  );
  if (hasOgSiteName) {
    issues.push({
      type: "success",
      category: "meta",
      message: "Open Graph site name defined",
    });
  } else if (hasOgTitle) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Missing og:site_name meta tag",
      fix: "Add og:site_name for better brand attribution in social shares",
      impact: "low",
    });
    score -= 1;
  }

  // OG article tags — important for news/blog content freshness signals
  const hasArticleType =
    /<meta[^>]+property=["']og:type["'][^>]+content=["']article["']/i.test(
      ctx.html,
    ) ||
    /<meta[^>]+content=["']article["'][^>]+property=["']og:type["']/i.test(
      ctx.html,
    );
  if (hasArticleType) {
    const hasPublishedTime =
      /<meta[^>]+property=["']article:published_time["']/i.test(ctx.html);
    const hasModifiedTime =
      /<meta[^>]+property=["']article:modified_time["']/i.test(ctx.html);
    if (hasPublishedTime && hasModifiedTime) {
      issues.push({
        type: "success",
        category: "meta",
        message:
          "Article OG tags include published and modified timestamps",
      });
    } else if (hasPublishedTime) {
      issues.push({
        type: "warning",
        category: "meta",
        message: "Missing article:modified_time OG tag",
        fix: "Add article:modified_time to signal content freshness to social platforms and aggregators",
        impact: "low",
      });
    } else {
      issues.push({
        type: "warning",
        category: "meta",
        message: "Article page missing article:published_time OG tag",
        fix: "Add article:published_time and article:modified_time meta tags for proper article attribution on social platforms",
        impact: "medium",
      });
      score -= 2;
    }
  }

  // Duplicate title = description check
  if (
    title &&
    description &&
    title.toLowerCase().trim() === description.toLowerCase().trim()
  ) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Title and meta description are identical",
      fix: "Write unique title and description - each serves a different purpose in search results",
      impact: "medium",
    });
    score -= 5;
  }

  return { score: Math.max(0, score), issues };
}
