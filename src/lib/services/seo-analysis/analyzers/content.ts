import type { SEOIssue } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";
import { BENCHMARKS } from "../constants";
import {
  stripHtmlToText,
  isSameHost,
  getVisibleHtml,
  extractAnchorTagMatches,
  extractTagAttributeValue,
} from "../html-utils";

export function analyzeContent(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
  wordCount: number;
} {
  const issues: SEOIssue[] = [];
  let score = 100;

  // Use visible HTML for content analysis (exclude noscript, template, comments)
  const visibleHtml = getVisibleHtml(ctx.html);

  const cleanText = stripHtmlToText(ctx.html);
  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const h2Matches = visibleHtml.match(/<h2[^>]*>/gi) || [];
  const h2Count = h2Matches.length;

  const h1Matches = visibleHtml.match(/<h1[^>]*>/gi) || [];
  const h1Count = h1Matches.length;
  const hasRSCFlightPayload = /self\.__next_f\.push\(/.test(ctx.html);
  const hasClientRenderingBailout = /BAILOUT_TO_CLIENT_SIDE_RENDERING/i.test(
    ctx.html,
  );
  const hasStrongStructuredSignals =
    h2Count >= 1 || wordCount >= BENCHMARKS.minWordCount;
  if (h1Count === 0) {
    if (hasRSCFlightPayload && hasClientRenderingBailout) {
      issues.push({
        type: "success",
        category: "content",
        message:
          "H1 not verifiable in client-rendered snapshot (HTML shell only)",
      });
    } else if (hasRSCFlightPayload && hasStrongStructuredSignals) {
      issues.push({
        type: "success",
        category: "content",
        message:
          "H1 not directly verifiable in streamed snapshot (structure looks healthy)",
      });
    } else if (hasRSCFlightPayload) {
      issues.push({
        type: "warning",
        category: "content",
        message: "No H1 found in static HTML snapshot",
        fix: "Ensure one descriptive H1 is rendered server-side (not only after client hydration)",
        impact: "medium",
      });
      score -= 8;
    } else {
      issues.push({
        type: "error",
        category: "content",
        message: "Missing H1 heading",
        fix: "Add exactly one H1 tag containing your primary keyword",
        impact: "high",
      });
      score -= 20;
    }
  } else if (h1Count > 1) {
    issues.push({
      type: "warning",
      category: "content",
      message: `Multiple H1 tags found (${h1Count})`,
      fix: "Google handles multiple H1s fine, but using one H1 per page is a best practice for clear document structure",
      impact: "low",
    });
  } else {
    issues.push({
      type: "success",
      category: "content",
      message: "Single H1 tag present",
    });
  }

  const minH2ForPage =
    wordCount < BENCHMARKS.shortPageWordCount ? 1 : wordCount < 1000 ? 2 : 3;
  if (h2Count < minH2ForPage) {
    if (h2Count === 0 && hasRSCFlightPayload && hasClientRenderingBailout) {
      issues.push({
        type: "success",
        category: "content",
        message:
          "H2 structure not verifiable in client-rendered snapshot (HTML shell only)",
      });
    } else if (h2Count === 0) {
      issues.push({
        type: "warning",
        category: "content",
        message: "No H2 subheadings found",
        fix: "Add H2 subheadings to break up content and improve readability",
        impact: "medium",
      });
      score -= 10;
    } else if (wordCount >= 1000) {
      issues.push({
        type: "warning",
        category: "content",
        message: `Low H2 count (${h2Count}) for content length`,
        fix: `Add more H2 subheadings to structure your ${wordCount}+ word content`,
        impact: "low",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "content",
        message: `Heading structure acceptable (${h2Count} H2 tag${h2Count !== 1 ? "s" : ""})`,
      });
    }
  } else {
    issues.push({
      type: "success",
      category: "content",
      message: `Good heading structure (${h2Count} H2 tags)`,
    });
  }

  const imgMatches = visibleHtml.match(/<img[^>]*>/gi) || [];
  const totalImages = imgMatches.length;
  const imagesWithAlt = imgMatches.filter(
    (img) => /\balt\s*=\s*["']/i.test(img) || /\balt(?=[\s/>])/i.test(img),
  ).length;
  const imagesWithMeaningfulAlt = imgMatches.filter((img) =>
    /\balt\s*=\s*["'][^"']{2,}["']/i.test(img),
  ).length;
  const imagesMissingAlt = totalImages - imagesWithAlt;
  const decorativeImages = imagesWithAlt - imagesWithMeaningfulAlt;

  if (totalImages > 0) {
    if (imagesMissingAlt > 0) {
      issues.push({
        type: "warning",
        category: "content",
        message: `${imagesMissingAlt} of ${totalImages} images missing alt attribute`,
        fix: 'Add alt text to images (use alt="" for decorative images)',
        impact: "medium",
      });
      score -= Math.min(imagesMissingAlt * 4, 16);
    } else if (decorativeImages > 0 && imagesWithMeaningfulAlt > 0) {
      issues.push({
        type: "success",
        category: "content",
        message: `All images have alt attributes (${imagesWithMeaningfulAlt} descriptive, ${decorativeImages} decorative)`,
      });
    } else if (decorativeImages === totalImages) {
      issues.push({
        type: "warning",
        category: "content",
        message: `All ${totalImages} images have empty alt (decorative)`,
        fix: "Consider adding descriptive alt text to relevant images for SEO",
        impact: "low",
      });
      score -= 3;
    } else {
      issues.push({
        type: "success",
        category: "content",
        message: `All ${totalImages} images have descriptive alt text`,
      });
    }
  }

  const anchorMatches = extractAnchorTagMatches(visibleHtml);
  let internalLinks = 0;
  let externalLinks = 0;
  for (const anchor of anchorMatches) {
    const href = anchor.href;
    if (!href) continue;
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:")
    ) {
      continue;
    }
    if (href.startsWith("//")) {
      // Protocol-relative URL - resolve against page URL to determine host
      if (isSameHost(`${ctx.url.protocol}${href}`, ctx.url)) internalLinks++;
      else externalLinks++;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      if (isSameHost(href, ctx.url)) internalLinks++;
      else externalLinks++;
    } else if (href.startsWith("/") || !href.includes(":")) {
      internalLinks++;
    }
  }
  if (internalLinks < 3 && anchorMatches.length > 0) {
    issues.push({
      type: "warning",
      category: "content",
      message: `Low internal link count (${internalLinks})`,
      fix: "Add more internal links to help users and search engines discover related content",
      impact: "medium",
    });
    score -= 8;
  } else if (internalLinks >= 3) {
    issues.push({
      type: "success",
      category: "content",
      message: `Good internal linking (${internalLinks} links)`,
    });
  }
  if (externalLinks > 0) {
    issues.push({
      type: "success",
      category: "content",
      message: `${externalLinks} external link${externalLinks !== 1 ? "s" : ""} found (helps establish authority)`,
    });
  }

  // Structured landing pages (many headings + internal links) have content spread across
  // sections rather than in long-form paragraphs — 200+ words is acceptable for these
  const h3Count = (visibleHtml.match(/<h3[^>]*>/gi) || []).length;
  const isStructuredPage = h2Count + h3Count >= 5 && internalLinks >= 10;
  const effectiveMinWordCount = isStructuredPage
    ? 200
    : BENCHMARKS.minWordCount;
  if (wordCount < 150) {
    if (hasRSCFlightPayload && hasClientRenderingBailout) {
      issues.push({
        type: "success",
        category: "content",
        message:
          "Content depth not verifiable in client-rendered snapshot (HTML shell only)",
      });
    } else {
      issues.push({
        type: "warning",
        category: "content",
        message: `Very thin content (${wordCount} words)`,
        fix: `Aim for at least ${BENCHMARKS.minWordCount} words for better search rankings`,
        impact: "high",
      });
      score -= 15;
    }
  } else if (wordCount < effectiveMinWordCount) {
    issues.push({
      type: "warning",
      category: "content",
      message: `Content could be deeper (${wordCount} words)`,
      fix: `Consider expanding to ${BENCHMARKS.minWordCount}+ words for better rankings`,
      impact: "low",
    });
    score -= 5;
  } else if (wordCount >= BENCHMARKS.idealWordCount) {
    issues.push({
      type: "success",
      category: "content",
      message: `Excellent content depth (${wordCount} words)`,
    });
  } else {
    issues.push({
      type: "success",
      category: "content",
      message: `Good content length (${wordCount} words)`,
    });
  }

  const headingRegex = /<h([1-6])[^>]*>/gi;
  let hMatch;
  const headingSequence: number[] = [];
  while ((hMatch = headingRegex.exec(visibleHtml)) !== null) {
    headingSequence.push(parseInt(hMatch[1]));
  }
  let hasSkippedLevel = false;
  let previousLevel = 0;
  for (const level of headingSequence) {
    if (previousLevel > 0 && level > previousLevel + 1) {
      hasSkippedLevel = true;
      break;
    }
    previousLevel = level;
  }
  if (hasSkippedLevel) {
    issues.push({
      type: "warning",
      category: "content",
      message: "Heading hierarchy has skipped levels (e.g., H1 \u2192 H3)",
      fix: "Sequential heading levels improve accessibility and readability, though Google can handle skipped levels",
      impact: "low",
    });
    score -= 3;
  } else if (h1Count > 0) {
    issues.push({
      type: "success",
      category: "content",
      message: "Proper heading hierarchy (no skipped levels)",
    });
  }

  // Strip scripts/styles/noscript AND tag attributes (e.g. Tailwind classes) for a fair ratio.
  // Modern frameworks produce verbose HTML attributes that aren't "code" in the SEO sense.
  const markupOnly = ctx.html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<([a-zA-Z][a-zA-Z0-9]*)\s[^>]*>/g, "<$1>"); // strip attributes
  const codeRatio =
    markupOnly.length > 0 ? (cleanText.length / markupOnly.length) * 100 : 0;
  // Content-to-code ratio is informational only — Google's John Mueller has stated
  // this metric "makes absolutely no sense" as a ranking signal. No score penalty.
  if (codeRatio < 10) {
    issues.push({
      type: "warning",
      category: "content",
      message: `Low content-to-code ratio (${codeRatio.toFixed(0)}%)`,
      fix: "This is informational — Google does not use content-to-code ratio for ranking. However, very low ratios may indicate thin content",
      impact: "low",
    });
  } else if (codeRatio >= 25) {
    issues.push({
      type: "success",
      category: "content",
      message: `Good content-to-code ratio (${codeRatio.toFixed(0)}%)`,
    });
  }

  // Only count <time> with datetime attribute as a meaningful freshness signal
  // Scope datePublished/dateModified to JSON-LD blocks to avoid matching JS variable names
  const jsonLdForFreshness = (
    ctx.html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ) || []
  ).join(" ");
  const hasFreshnessSignal =
    /<time[^>]+datetime/i.test(ctx.html) ||
    /datePublished/i.test(jsonLdForFreshness) ||
    /dateModified/i.test(jsonLdForFreshness) ||
    /<meta[^>]+(?:name|property)=["'](?:date|article:published_time|article:modified_time)["']/i.test(
      ctx.html,
    );
  if (hasFreshnessSignal) {
    issues.push({
      type: "success",
      category: "content",
      message: "Content freshness signals detected",
    });
  } else {
    const path = ctx.url.pathname.toLowerCase();
    const looksEditorial =
      path.includes("/blog/") ||
      path.includes("/guide/") ||
      path.includes("/news/") ||
      /<article[\s>]/i.test(ctx.html) ||
      /"@type"\s*:\s*"(?:Article|BlogPosting|NewsArticle)"/i.test(ctx.html);
    if (looksEditorial) {
      issues.push({
        type: "warning",
        category: "content",
        message: "No content freshness signals found",
        fix: "Add <time> elements or datePublished schema for content freshness",
        impact: "low",
      });
    } else {
      issues.push({
        type: "success",
        category: "content",
        message: "Freshness signals optional for evergreen pages",
      });
    }
  }

  // Semantic HTML elements check
  const hasArticle = /<article[\s>]/i.test(ctx.html);
  const hasSection = /<section[\s>]/i.test(ctx.html);
  const hasAside = /<aside[\s>]/i.test(ctx.html);
  const hasFigure = /<figure[\s>]/i.test(ctx.html);
  const semanticCount = [hasArticle, hasSection, hasAside, hasFigure].filter(
    Boolean,
  ).length;
  if (semanticCount >= 2) {
    issues.push({
      type: "success",
      category: "content",
      message: `Good semantic HTML usage (${semanticCount} types: ${[hasArticle && "article", hasSection && "section", hasAside && "aside", hasFigure && "figure"].filter(Boolean).join(", ")})`,
    });
  } else if (semanticCount === 0 && wordCount > BENCHMARKS.minWordCount) {
    issues.push({
      type: "warning",
      category: "content",
      message: "No semantic HTML elements found",
      fix: "Semantic elements (<article>, <section>) improve accessibility and help machines understand content structure",
      impact: "low",
    });
    score -= 2;
  }

  // Empty href detection
  const emptyHrefCount = anchorMatches.filter((anchor) => {
    const normalizedHref = anchor.href.trim();
    return normalizedHref === "" || normalizedHref === "#";
  }).length;
  if (emptyHrefCount > 2) {
    issues.push({
      type: "warning",
      category: "content",
      message: `${emptyHrefCount} links with empty or "#" href`,
      fix: "Replace empty hrefs with meaningful URLs or use buttons for non-navigation actions",
      impact: "medium",
    });
    score -= Math.min(emptyHrefCount * 2, 8);
  } else if (emptyHrefCount === 0) {
    issues.push({
      type: "success",
      category: "content",
      message: "No empty href links detected",
    });
  }

  // Nofollow on internal links (bad practice check)
  let nofollowInternalCount = 0;
  for (const link of anchorMatches) {
    const href = link.href.trim();
    const relValue =
      extractTagAttributeValue(link.fullTag, "rel")?.toLowerCase() || "";
    if (!/\bnofollow\b/.test(relValue)) continue;
    // Skip non-navigational protocols (not links to pages)
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:") ||
      href === "#"
    )
      continue;
    if (
      !href.startsWith("http://") &&
      !href.startsWith("https://") &&
      !href.startsWith("//")
    ) {
      nofollowInternalCount++; // Relative URL - internal
    } else if (
      isSameHost(
        href.startsWith("//") ? `${ctx.url.protocol}${href}` : href,
        ctx.url,
      )
    ) {
      nofollowInternalCount++;
    }
  }
  if (nofollowInternalCount > 0) {
    issues.push({
      type: "warning",
      category: "content",
      message: `${nofollowInternalCount} internal link(s) with rel="nofollow"`,
      fix: "Remove nofollow from internal links to allow proper link equity flow",
      impact: "medium",
    });
    score -= Math.min(nofollowInternalCount * 3, 10);
  }

  // Responsive images (srcset) detection
  const srcsetImages = (ctx.html.match(/<img[^>]+srcset/gi) || []).length;
  const pictureElements = (ctx.html.match(/<picture[\s>]/gi) || []).length;
  if ((srcsetImages > 0 || pictureElements > 0) && totalImages > 0) {
    issues.push({
      type: "success",
      category: "content",
      message: `Responsive images detected (${srcsetImages} srcset, ${pictureElements} picture elements)`,
    });
  } else if (totalImages > 3) {
    issues.push({
      type: "warning",
      category: "content",
      message: "No responsive images (srcset) detected",
      fix: "Use srcset and sizes attributes for responsive image loading across devices",
      impact: "low",
    });
    score -= 3;
  }

  // Figure/figcaption usage
  const figcaptionCount = (ctx.html.match(/<figcaption/gi) || []).length;
  if (figcaptionCount > 0) {
    issues.push({
      type: "success",
      category: "content",
      message: `${figcaptionCount} figure caption(s) for contextual image descriptions`,
    });
  }

  // Paragraph wall-of-text detection (>300 words per paragraph)
  const paragraphs = ctx.html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  const longParagraphs = paragraphs.filter((p) => {
    const text = p.replace(/<[^>]+>/g, " ").trim();
    return text.split(/\s+/).length > 300;
  }).length;
  if (longParagraphs > 0) {
    issues.push({
      type: "warning",
      category: "content",
      message: `${longParagraphs} paragraph(s) with 300+ words (wall of text)`,
      fix: "Break long paragraphs into shorter ones (2-3 sentences) for better readability",
      impact: "medium",
    });
    score -= Math.min(longParagraphs * 3, 15);
  }

  // Alt text quality check (generic/placeholder alt text)
  // Match alt text that IS exactly a generic placeholder word (not just starts with one)
  const genericAltPatterns =
    /alt=["'](?:image|photo|picture|img|screenshot|banner|untitled|no alt|alt text|placeholder|\d+)["']/gi;
  const genericAltMatches = visibleHtml.match(genericAltPatterns) || [];
  if (genericAltMatches.length > 0) {
    issues.push({
      type: "warning",
      category: "content",
      message: `${genericAltMatches.length} image(s) with generic/placeholder alt text`,
      fix: "Replace generic alt text (e.g., 'image', 'photo') with descriptive text that explains the image content",
      impact: "medium",
    });
    score -= Math.min(genericAltMatches.length * 2, 8);
  }

  // Video/media enrichment detection
  const hasVideo =
    /<video[\s>]/i.test(ctx.html) ||
    /youtube\.com\/embed|vimeo\.com|wistia\.com/i.test(ctx.html);
  const hasAudio = /<audio[\s>]/i.test(ctx.html);
  const hasIframeVideo =
    /<iframe[^>]+src=["'][^"']*(?:youtube|vimeo|wistia|dailymotion)/i.test(
      ctx.html,
    );
  if (hasVideo || hasIframeVideo) {
    issues.push({
      type: "success",
      category: "content",
      message: "Video content detected (boosts engagement and dwell time)",
    });
  } else if (wordCount > 1000) {
    issues.push({
      type: "success",
      category: "content",
      message:
        "No video/rich media detected (optional enhancement for engagement)",
    });
  }
  if (hasAudio) {
    issues.push({
      type: "success",
      category: "content",
      message: "Audio content detected",
    });
  }

  // Table of contents detection
  // Use word boundaries for "toc" to avoid matching "protocol", "stock", etc.
  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hashAnchorTargets = Array.from(
    ctx.html.matchAll(/<a[^>]+href\s*=\s*["']#([^"']+)["'][^>]*>/gi),
  )
    .map((match) => match[1].trim())
    .filter((value) => value.length > 1 && value.toLowerCase() !== "top");
  const uniqueHashTargets = Array.from(new Set(hashAnchorTargets));
  const inPageSectionAnchors = uniqueHashTargets.filter((target) =>
    new RegExp(`\\bid\\s*=\\s*["']${escapeRegExp(target)}["']`, "i").test(
      ctx.html,
    ),
  );
  const hasInPageJumpMenu = inPageSectionAnchors.length >= 3;
  const hasTOC =
    /table[- ]of[- ]contents|\btoc\b|jump[- ]to|in[- ]this[- ]article|on[- ]this[- ]page/i.test(
      ctx.html,
    ) ||
    /<nav[^>]*aria-label=["'](?:table of contents|toc|page contents)["']/i.test(
      ctx.html,
    ) ||
    hasInPageJumpMenu;
  if (hasTOC) {
    issues.push({
      type: "success",
      category: "content",
      message:
        "Table of contents detected (improves UX and may trigger sitelinks)",
    });
  } else if (wordCount > 2500 && h2Count >= 6) {
    issues.push({
      type: "warning",
      category: "content",
      message: "Long content without table of contents",
      fix: "Add a table of contents for long content (1500+ words) to improve UX and potentially trigger jump-to sitelinks",
      impact: "low",
    });
  }

  // CTA detection
  const ctaPatterns =
    /(?:sign\s*up|get\s*started|learn\s*more|contact\s*us|request\s*(?:a\s*)?(?:demo|quote)|free\s*trial|subscribe|book\s*(?:a\s*)?(?:call|meeting|demo)|download|buy\s*now|add\s*to\s*cart|start\s*free)/i;
  const hasCTA = ctaPatterns.test(ctx.html);
  if (hasCTA) {
    issues.push({
      type: "success",
      category: "content",
      message: "Call-to-action elements detected",
    });
  }

  // Orphan page signals (very few internal links)
  if (
    internalLinks === 0 &&
    externalLinks === 0 &&
    anchorMatches.length === 0
  ) {
    issues.push({
      type: "warning",
      category: "content",
      message: "Page has no links at all (potential orphan page)",
      fix: "Add internal links to help search engines understand site structure and pass link equity",
      impact: "high",
    });
    score -= 10;
  } else if (internalLinks === 1) {
    issues.push({
      type: "warning",
      category: "content",
      message: "Very few internal links (1) - page may be poorly connected",
      fix: "Add more internal links (aim for 3-10) to establish topical relevance and help crawlers",
      impact: "medium",
    });
    score -= 5;
  }

  // FAQ content pattern detection
  const hasFAQPattern =
    /(?:frequently\s*asked|faq|common\s*questions|q\s*&\s*a)/i.test(ctx.html);
  const hasFAQSchema = /FAQPage/i.test(ctx.html);
  if (hasFAQPattern && hasFAQSchema) {
    issues.push({
      type: "success",
      category: "content",
      message: "FAQ content with FAQPage schema markup",
    });
  } else if (hasFAQPattern) {
    issues.push({
      type: "success",
      category: "content",
      message: "FAQ content detected (FAQPage schema optional by site type)",
    });
  }

  // Content diversity score (lists + tables + images + headings = diverse content)
  const diversitySignals = [
    (ctx.html.match(/<(?:ul|ol)[^>]*>/gi) || []).length > 0,
    (ctx.html.match(/<table[^>]*>/gi) || []).length > 0,
    totalImages > 0,
    h2Count >= 2,
    (ctx.html.match(/<blockquote/gi) || []).length > 0,
    (ctx.html.match(/<code/gi) || []).length > 0 ||
      (ctx.html.match(/<pre/gi) || []).length > 0,
    hasVideo || hasIframeVideo,
  ].filter(Boolean).length;
  if (wordCount > 500) {
    if (diversitySignals >= 4) {
      issues.push({
        type: "success",
        category: "content",
        message: `Rich content diversity (${diversitySignals}/7 content types: headings, lists, tables, images, etc.)`,
      });
    } else if (diversitySignals <= 1) {
      issues.push({
        type: "warning",
        category: "content",
        message: "Low content diversity - mostly plain text",
        fix: "Enrich content with lists, tables, images, videos, and code blocks for better engagement",
        impact: "medium",
      });
      score -= 5;
    }
  }

  return { score: Math.max(0, score), issues, wordCount };
}
