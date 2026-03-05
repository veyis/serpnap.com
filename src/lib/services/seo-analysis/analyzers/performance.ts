import type { SEOIssue, PerformanceHints } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";
import { extractLinkTagsByRel, extractTagAttributeValue, getVisibleHtml } from "../html-utils";

export function analyzePerformance(
  ctx: AnalysisContext,
  hints: PerformanceHints,
): { score: number; issues: SEOIssue[] } {
  const issues: SEOIssue[] = [];
  let score = 100;
  const hasRSCFlightPayload = /self\.__next_f\.push\(/.test(ctx.html);

  const externalResourceHosts = new Set<string>();
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
      const resourceHost = new URL(candidate).hostname
        .replace(/^www\./i, "")
        .toLowerCase();
      const pageHost = ctx.url.hostname.replace(/^www\./i, "").toLowerCase();
      if (resourceHost !== pageHost) externalResourceHosts.add(resourceHost);
    } catch {
      // ignore invalid absolute URLs
    }
  }

  if (hints.hasPreconnect) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Preconnect hints found (faster resource loading)",
    });
  } else if (externalResourceHosts.size > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: "No preconnect hints for external resources",
      fix: 'Add <link rel="preconnect"> for critical third-party domains',
      impact: "low",
    });
    score -= 3;
  }
  if (hints.hasPreload) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Preload hints found (critical resource prioritization)",
    });
  }

  // Count scripts individually: those with src but without defer/async/module/nomodule are render-blocking
  // noModule scripts are legacy fallbacks skipped by modern browsers, so they're non-blocking
  const allExternalScripts = ctx.html.match(/<script[^>]+src=[^>]*>/gi) || [];
  const deferredOrAsyncCount = allExternalScripts.filter((tag) => {
    const scriptType = extractTagAttributeValue(tag, "type")?.toLowerCase();
    return /\b(?:defer|async|nomodule)\b/i.test(tag) || scriptType === "module";
  }).length;
  const renderBlockingCount = allExternalScripts.length - deferredOrAsyncCount;
  if (renderBlockingCount > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `${renderBlockingCount} of ${allExternalScripts.length} script(s) without defer/async may block rendering`,
      fix: "Add 'defer' or 'async' to script tags to prevent render blocking",
      impact: "medium",
    });
    score -= Math.min(renderBlockingCount * 5, 15);
  } else if (allExternalScripts.length > 0) {
    issues.push({
      type: "success",
      category: "technical",
      message: "All scripts use defer/async for non-blocking loading",
    });
  }

  if (hints.totalImageCount > 3) {
    if (hints.hasLazyImages) {
      issues.push({
        type: "success",
        category: "technical",
        message: "Lazy loading enabled for images",
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: `${hints.totalImageCount} images without lazy loading`,
        fix: 'Add loading="lazy" to below-the-fold images for faster initial load',
        impact: "medium",
      });
      score -= 10;
    }
  }

  if (hints.stylesheetCount > 5) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `Multiple stylesheets (${hints.stylesheetCount}) increase render-blocking`,
      fix: "Consider combining CSS files or using critical CSS inlining",
      impact: "low",
    });
    score -= 5;
  }

  const hasInlineStyles = /<style[^>]*>[\s\S]*?<\/style>/i.test(ctx.html);
  if (hasInlineStyles && hints.stylesheetCount > 0) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Critical CSS may be inlined (good for FCP)",
    });
  }

  // Strip noscript — fallback images aren't loaded when JS is enabled
  const visibleHtml = getVisibleHtml(ctx.html);
  const allImages = visibleHtml.match(/<img[^>]*>/gi) || [];
  // Next.js Image components using fill prop don't emit width/height (CSS handles sizing).
  // Detect via data-nimg attribute or srcset (Next.js image optimization markers).
  const imgsMissingDimensions = allImages.filter(
    (img) =>
      !(/\bwidth\s*=/i.test(img) && /\bheight\s*=/i.test(img)) &&
      !/\bdata-nimg\b/i.test(img) &&
      !/\bsrcset\s*=/i.test(img),
  ).length;
  if (imgsMissingDimensions > 0 && allImages.length > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `${imgsMissingDimensions} image(s) missing width/height (CLS risk)`,
      fix: "Add explicit width and height attributes to prevent layout shifts",
      impact: "medium",
    });
    score -= Math.min(imgsMissingDimensions * 5, 15);
  } else if (allImages.length > 0) {
    issues.push({
      type: "success",
      category: "technical",
      message: "All images have width/height attributes",
    });
  }

  const domElements = (ctx.html.match(/<[a-zA-Z][^>]*>/g) || []).length;
  if (domElements > 1400) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `Large DOM size (${domElements} elements)`,
      fix: "Reduce DOM complexity to improve rendering performance. Lighthouse flags pages with over 1,500 DOM nodes",
      impact: "medium",
    });
    score -= 8;
  } else if (domElements > 800) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `DOM size could be smaller (${domElements} elements)`,
      fix: "Consider reducing DOM complexity. Lighthouse recommends under 800 elements for optimal performance",
      impact: "low",
    });
    score -= 3;
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: `DOM size acceptable (${domElements} elements)`,
    });
  }

  // Check for modern image formats:
  // - explicit .webp/.avif sources
  // - picture/source type="image/webp|image/avif"
  // - auto-format CDN params (auto=format, fm=webp/avif, format=webp/avif)
  // - Next.js image optimizer (/_next/image)
  // Skip warning for vector-only pages (SVG logos/icons), where WebP/AVIF is not applicable.
  const imageUrlCandidates = [
    ...((ctx.html.match(
      /<(?:img|source)[^>]+(?:src|srcset)=["']([^"']+)["']/gi,
    ) || []) as string[]),
  ].map((tag) => {
    const src =
      extractTagAttributeValue(tag, "srcset") ??
      extractTagAttributeValue(tag, "src");
    return (src || "").toLowerCase();
  });
  const hasNextImageOptimizer = imageUrlCandidates.some((value) =>
    value.includes("/_next/image"),
  );
  const hasModernImageByExtension = imageUrlCandidates.some((value) =>
    /\.(?:webp|avif)(?:$|[?#, ])/i.test(value),
  );
  const hasModernImageByQuery = imageUrlCandidates.some((value) =>
    /(?:[?&](?:fm|format)=)(?:webp|avif)\b|[?&]auto=format\b/i.test(value),
  );
  const hasModernImageSourceType =
    /<source[^>]+type=["']image\/(?:webp|avif)["']/i.test(ctx.html);
  const hasModernImages =
    hasModernImageByExtension ||
    hasModernImageByQuery ||
    hasModernImageSourceType;

  const rasterImageCandidates = imageUrlCandidates.filter((value) => {
    if (!value) return false;
    if (value.startsWith("data:image/svg")) return false;
    if (/\.svg(?:$|[?#, ])/i.test(value)) return false;
    if (hasNextImageOptimizer && value.includes("/_next/image")) return true;
    return /\.(?:png|jpe?g|gif|bmp|tiff?|webp|avif)(?:$|[?#, ])/i.test(value);
  });

  if (allImages.length > 0) {
    if (hasModernImages || hasNextImageOptimizer) {
      issues.push({
        type: "success",
        category: "technical",
        message: hasNextImageOptimizer
          ? "Next.js Image optimizer detected (serves WebP/AVIF automatically)"
          : "Modern image formats detected (WebP/AVIF)",
      });
    } else if (hasRSCFlightPayload) {
      issues.push({
        type: "success",
        category: "technical",
        message:
          "Modern image format check inconclusive for streamed HTML snapshot",
      });
    } else if (rasterImageCandidates.length > 0) {
      issues.push({
        type: "warning",
        category: "technical",
        message: "No modern image formats (WebP/AVIF) detected",
        fix: "Use WebP or AVIF formats for smaller file sizes and faster loading",
        impact: "low",
      });
      score -= 2;
    } else {
      issues.push({
        type: "success",
        category: "technical",
        message:
          "No raster images detected (WebP/AVIF check not applicable for vector-only assets)",
      });
    }
  }

  // Font display detection - also check for Next.js font optimization (next/font)
  // which automatically applies font-display: swap via __next_font CSS classes
  const hasFontDisplaySwap = /font-display\s*:\s*swap/i.test(ctx.html);
  const hasNextFont =
    /__(?:className|variable)(?:_[a-f0-9]+)?/i.test(ctx.html) ||
    /next\/font/i.test(ctx.html);
  const hasGoogleFonts = /fonts\.googleapis\.com/i.test(ctx.html);
  if (hasGoogleFonts || /@font-face/i.test(ctx.html)) {
    if (
      hasFontDisplaySwap ||
      hasNextFont ||
      (hasGoogleFonts && /display=swap/i.test(ctx.html))
    ) {
      issues.push({
        type: "success",
        category: "technical",
        message: "font-display: swap configured",
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: "Custom fonts without font-display: swap",
        fix: "Add font-display: swap to prevent invisible text during font loading",
        impact: "low",
      });
      score -= 2;
    }
  }

  // Hero image preload detection
  const hasHeroPreload = extractLinkTagsByRel(ctx.html, "preload").some(
    (tag) =>
      (extractTagAttributeValue(tag, "as") || "").toLowerCase() === "image",
  );
  if (hasHeroPreload) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Hero/LCP image preloaded",
    });
  }

  // Third-party script count
  const thirdPartyScripts = allExternalScripts.filter((scriptTag) => {
    const src = extractTagAttributeValue(scriptTag, "src");
    if (!src || !/^https?:\/\//i.test(src)) return false;
    try {
      const scriptHost = new URL(src).hostname
        .replace(/^www\./i, "")
        .toLowerCase();
      const pageHost = ctx.url.hostname.replace(/^www\./i, "").toLowerCase();
      return scriptHost !== pageHost;
    } catch {
      return false;
    }
  }).length;
  if (thirdPartyScripts > 5) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `High third-party script count (${thirdPartyScripts})`,
      fix: "Reduce third-party scripts or load them asynchronously to improve page speed",
      impact: "medium",
    });
    score -= Math.min(thirdPartyScripts - 5, 10);
  } else if (thirdPartyScripts > 0) {
    issues.push({
      type: "success",
      category: "technical",
      message: `Manageable third-party script count (${thirdPartyScripts})`,
    });
  }

  const isFrameworkChunkedScriptProfile =
    hasRSCFlightPayload && renderBlockingCount === 0 && thirdPartyScripts <= 5;

  if (hints.scriptCount > 20) {
    if (isFrameworkChunkedScriptProfile && hints.scriptCount <= 45) {
      issues.push({
        type: "success",
        category: "technical",
        message: `Framework chunked scripts detected (${hints.scriptCount}) with low blocking risk`,
      });
    } else {
      issues.push({
        type: "warning",
        category: "technical",
        message: `High number of scripts (${hints.scriptCount}) may slow page load`,
        fix: "Consider bundling scripts or loading non-critical scripts on demand",
        impact: "low",
      });
      score -= 5;
    }
  }

  // PWA/Web App Manifest detection
  const hasManifest = extractLinkTagsByRel(ctx.html, "manifest").length > 0;
  if (hasManifest) {
    issues.push({
      type: "success",
      category: "technical",
      message: "Web App Manifest detected (PWA-ready)",
    });
  } else {
    issues.push({
      type: "warning",
      category: "technical",
      message: "No Web App Manifest found",
      fix: 'Add <link rel="manifest" href="/manifest.json"> for PWA support',
      impact: "low",
    });
  }

  // Excessive inline JavaScript detection (exclude framework/analytics scripts)
  const inlineScripts =
    ctx.html.match(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/gi) || [];
  const knownInlinePatterns =
    /self\.__next|__NEXT_DATA__|googletagmanager\.com|gtag|google-analytics\.com|GoogleAnalyticsObject|localStorage\.getItem.*theme|dataLayer\.push/i;
  const largeInlineScripts = inlineScripts.filter(
    (s) => s.length > 5000 && !knownInlinePatterns.test(s),
  ).length;
  if (largeInlineScripts > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `${largeInlineScripts} large inline script(s) detected (>5KB)`,
      fix: "Move large inline scripts to external files for better caching and maintainability",
      impact: "low",
    });
    score -= Math.min(largeInlineScripts * 2, 6);
  }

  // Resource hints completeness (prefetch + preconnect + preload)
  const hasPrefetch =
    extractLinkTagsByRel(ctx.html, "prefetch").length > 0 ||
    extractLinkTagsByRel(ctx.html, "dns-prefetch").length > 0;
  const resourceHintCount = [
    hints.hasPreconnect,
    hints.hasPreload,
    hasPrefetch,
  ].filter(Boolean).length;
  if (resourceHintCount >= 2) {
    issues.push({
      type: "success",
      category: "technical",
      message: `Good resource hints coverage (${resourceHintCount}/3 types configured)`,
    });
  }

  // INP optimization hints - Long task indicators
  const heavyEventHandlers =
    ctx.html.match(
      /on(?:click|scroll|resize|mousemove|touchmove)=["'][^"']{100,1000}["']/gi,
    ) || [];
  if (heavyEventHandlers.length > 0) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `${heavyEventHandlers.length} inline event handler(s) with complex logic detected`,
      fix: "Move complex event handlers to external JS files and use requestAnimationFrame for scroll/resize handlers (INP optimization)",
      impact: "medium",
    });
    score -= Math.min(heavyEventHandlers.length * 3, 9);
  }

  // Total estimated page weight (HTML + linked resources count)
  const totalExternalResources =
    hints.scriptCount + hints.stylesheetCount + hints.totalImageCount;
  if (isFrameworkChunkedScriptProfile && totalExternalResources <= 45) {
    issues.push({
      type: "success",
      category: "technical",
      message: `Resource count reflects framework chunking (${totalExternalResources} external resources)`,
    });
  } else if (totalExternalResources > 50) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `High resource count (${totalExternalResources} external resources)`,
      fix: "Reduce total HTTP requests by combining files, using sprites, or lazy loading",
      impact: "medium",
    });
    score -= 5;
  } else if (totalExternalResources > 30) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `Moderate resource count (${totalExternalResources} external resources)`,
      fix: "Consider reducing HTTP requests for faster page loads",
      impact: "low",
    });
  } else {
    issues.push({
      type: "success",
      category: "technical",
      message: `Efficient resource count (${totalExternalResources} external resources)`,
    });
  }

  // Inline CSS size check — large <style> blocks hurt FCP
  const styleBlocks = ctx.html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  let totalInlineCssSize = 0;
  for (const block of styleBlocks) {
    totalInlineCssSize += block.length;
  }
  if (totalInlineCssSize > 100_000) {
    const sizeKB = Math.round(totalInlineCssSize / 1024);
    issues.push({
      type: "warning",
      category: "technical",
      message: `Large inline CSS (${sizeKB}KB in ${styleBlocks.length} <style> block${styleBlocks.length > 1 ? "s" : ""})`,
      fix: "Extract large inline CSS into external stylesheets that can be cached and loaded asynchronously",
      impact: "medium",
    });
    score -= 5;
  } else if (totalInlineCssSize > 50_000) {
    const sizeKB = Math.round(totalInlineCssSize / 1024);
    issues.push({
      type: "warning",
      category: "technical",
      message: `Moderate inline CSS (${sizeKB}KB in ${styleBlocks.length} <style> block${styleBlocks.length > 1 ? "s" : ""})`,
      fix: "Consider moving non-critical CSS to external stylesheets for better caching",
      impact: "low",
    });
  }

  // URL length check
  const pageUrl = ctx.finalUrl || ctx.url.href;
  if (pageUrl.length > 200) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `Very long URL (${pageUrl.length} characters)`,
      fix: "Keep URLs under 75 characters when possible. Long URLs are truncated in SERPs and harder to share",
      impact: "medium",
    });
    score -= 3;
  } else if (pageUrl.length > 75) {
    issues.push({
      type: "warning",
      category: "technical",
      message: `Long URL (${pageUrl.length} characters)`,
      fix: "Shorter URLs tend to perform better in search — aim for under 75 characters",
      impact: "low",
    });
  }

  // Dynamic tracking parameters in URL
  try {
    const urlParams = new URL(pageUrl).searchParams;
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "gad_source",
      "msclkid",
      "mc_cid",
      "mc_eid",
    ];
    const foundTracking = trackingParams.filter((p) => urlParams.has(p));
    if (foundTracking.length > 0) {
      issues.push({
        type: "warning",
        category: "technical",
        message: `URL contains tracking parameters (${foundTracking.join(", ")})`,
        fix: "Ensure canonical URL excludes tracking parameters to prevent duplicate content issues",
        impact: "medium",
      });
      score -= 3;
    }
  } catch {
    // skip if URL parsing fails
  }

  return { score: Math.max(0, score), issues };
}
