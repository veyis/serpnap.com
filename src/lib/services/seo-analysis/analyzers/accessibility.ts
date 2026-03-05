import type { SEOIssue, Accessibility } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";

export function analyzeAccessibility(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
  data: Accessibility;
} {
  const issues: SEOIssue[] = [];
  let score = 100;

  // Match fragment anchors where "main", "content", or "skip" appears anywhere
  // in the fragment identifier (e.g. #start-of-content, #skip-nav, #main-content)
  const skipLinkMatches = [
    ...ctx.html.matchAll(
      /<a\b[^>]*href=["']#[^"']*(?:main|content|skip)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ];
  const hasSkipLink = skipLinkMatches.some((match) => {
    const anchorText = match[1].replace(/<[^>]+>/g, " ").toLowerCase();
    return (
      /skip|main.?content/.test(anchorText) ||
      /aria-label=["'][^"']*(?:skip|main.?content)[^"']*["']/i.test(match[0])
    );
  });
  if (!hasSkipLink) {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: "Missing skip navigation link",
      fix: "Add a 'Skip to main content' link as the first focusable element for keyboard/screen reader users",
      impact: "medium",
    });
    score -= 5;
  } else {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "Skip navigation link present",
    });
  }

  const hasMain =
    /<main[\s>]/i.test(ctx.html) || /role=["']main["']/i.test(ctx.html);
  // Next.js RSC sites deliver nav/header as client components (not in RSC payload)
  // Heuristic: if site uses RSC + has <main> + skip link + many links → nav exists as client component
  const isNextjsRSC = /self\.__next_f\.push/i.test(ctx.html) && hasMain;
  const hasMultipleNavLinks =
    (ctx.html.match(/<a[^>]+href/gi) || []).length > 10;
  const hasNav =
    /<nav[\s>]/i.test(ctx.html) ||
    /role=["']navigation["']/i.test(ctx.html) ||
    (isNextjsRSC && hasSkipLink && hasMultipleNavLinks);
  const hasLandmarks = hasMain && hasNav;
  if (!hasLandmarks) {
    const missing = [];
    if (!hasMain) missing.push("<main>");
    if (!hasNav) missing.push("<nav>");
    issues.push({
      type: "warning",
      category: "accessibility",
      message: `Missing ARIA landmarks: ${missing.join(", ")}`,
      fix: "Use semantic HTML elements (<main>, <nav>) for proper page structure",
      impact: "medium",
    });
    score -= 5;
  } else {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "ARIA landmarks present (<main>, <nav>)",
    });
  }

  const inputs =
    ctx.html.match(
      /<input[^>]*type=["'](?:text|email|password|search|tel|url|number)["'][^>]*>/gi,
    ) || [];
  const selectTags = ctx.html.match(/<select[^>]*>/gi) || [];
  const textareaTags = ctx.html.match(/<textarea[^>]*>/gi) || [];
  const totalFormFields =
    inputs.length + selectTags.length + textareaTags.length;
  const labels = (ctx.html.match(/<label[^>]*>/gi) || []).length;
  // Only count aria-label on form field elements (not nav/button/div aria-labels)
  const ariaOnFormFields =
    inputs.filter((input) => /aria-label(?:ledby)?=/i.test(input)).length +
    selectTags.filter((s) => /aria-label(?:ledby)?=/i.test(s)).length +
    textareaTags.filter((t) => /aria-label(?:ledby)?=/i.test(t)).length;
  const totalLabels = labels + ariaOnFormFields;
  const formsWithoutLabels = Math.max(0, totalFormFields - totalLabels);

  if (totalFormFields > 0 && formsWithoutLabels > 0) {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: `${formsWithoutLabels} form field(s) may lack labels`,
      fix: "Add <label> elements or aria-label attributes to all form inputs",
      impact: "medium",
    });
    score -= Math.min(formsWithoutLabels * 8, 20);
  } else if (totalFormFields > 0) {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "All form fields have labels",
    });
  } else {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "No form fields to check",
    });
  }

  const positiveTabindexMatches =
    ctx.html.match(/tabindex=["']([1-9]\d*)["']/g) || [];
  const hasPositiveTabindex = positiveTabindexMatches.length > 0;
  if (hasPositiveTabindex) {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: `Positive tabindex values found (${positiveTabindexMatches.length})`,
      fix: "Use tabindex='0' or '-1' instead of positive values to maintain natural tab order",
      impact: "low",
    });
    score -= 5;
  } else {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "No positive tabindex abuse",
    });
  }

  // Focus visible styles detection - check <style> tags, style attributes, AND Tailwind utility classes
  const styleContent =
    (ctx.html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join(" ") +
    " " +
    (ctx.html.match(/style=["'][^"']+["']/gi) || []).join(" ");
  const hasTailwindFocus =
    /class=["'][^"']*\bfocus-visible:/i.test(ctx.html) ||
    /class=["'][^"']*\bfocus:/i.test(ctx.html);
  const hasFocusStyles =
    /:focus/i.test(styleContent) ||
    /focus-visible/i.test(styleContent) ||
    /outline\s*:/i.test(styleContent) ||
    hasTailwindFocus;
  if (hasFocusStyles) {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "Focus styles detected for keyboard navigation",
    });
  } else {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: "No explicit focus styles detected in page source",
      fix: "Add :focus-visible CSS styles so keyboard users can see which element is focused. Note: external stylesheets may contain focus styles not detected by this check",
      impact: "medium",
    });
    score -= 5;
  }

  // Button vs link distinction
  const buttonsWithHref = ctx.html.match(/<button[^>]+href/gi) || [];
  const linksWithRole = ctx.html.match(/<a[^>]+role=["']button["']/gi) || [];
  if (buttonsWithHref.length > 0 || linksWithRole.length > 3) {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: "Misused button/link semantics detected",
      fix: "Use <a> for navigation, <button> for actions. Avoid mixing roles",
      impact: "low",
    });
    score -= 3;
  }

  // ARIA live regions for dynamic content
  const hasAriaLive = /aria-live=["'](?:polite|assertive)["']/i.test(ctx.html);
  const hasDynamicContent = /data-(?:loading|status)|aria-busy/i.test(ctx.html);
  if (hasDynamicContent && !hasAriaLive) {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: "Dynamic content detected without aria-live regions",
      fix: "Add aria-live='polite' to containers that update dynamically for screen reader users",
      impact: "low",
    });
    score -= 3;
  } else if (hasAriaLive) {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "ARIA live regions configured for dynamic content",
    });
  }

  // Header/footer landmarks (Next.js RSC delivers header as client component)
  const hasHeader =
    /<header[\s>]/i.test(ctx.html) ||
    /role=["']banner["']/i.test(ctx.html) ||
    (isNextjsRSC && hasSkipLink);
  const hasFooter =
    /<footer[\s>]/i.test(ctx.html) ||
    /role=["']contentinfo["']/i.test(ctx.html);
  if (hasHeader && hasFooter) {
    issues.push({
      type: "success",
      category: "accessibility",
      message: "Header and footer landmarks present",
    });
  } else {
    const missingLandmarks = [];
    if (!hasHeader) missingLandmarks.push("<header>");
    if (!hasFooter) missingLandmarks.push("<footer>");
    if (missingLandmarks.length > 0) {
      issues.push({
        type: "warning",
        category: "accessibility",
        message: `Missing landmarks: ${missingLandmarks.join(", ")}`,
        fix: "Use semantic <header> and <footer> elements for complete page structure",
        impact: "low",
      });
      score -= 3;
    }
  }

  // Images with title but no alt (common mistake)
  const imgTitleNoAlt = (
    ctx.html.match(/<img[^>]+title=["'][^"']+["'][^>]*>/gi) || []
  ).filter((img) => !/\balt(?:\s*=|(?=[\s/>]))/i.test(img)).length;
  if (imgTitleNoAlt > 0) {
    issues.push({
      type: "warning",
      category: "accessibility",
      message: `${imgTitleNoAlt} image(s) have title but missing alt attribute`,
      fix: "The title attribute is not a substitute for alt - add alt text to all images",
      impact: "medium",
    });
    score -= Math.min(imgTitleNoAlt * 3, 10);
  }

  return {
    score: Math.max(0, score),
    issues,
    data: {
      hasSkipLink,
      hasLandmarks,
      formLabelsCount: totalLabels,
      formsWithoutLabels,
      hasPositiveTabindex,
    },
  };
}
