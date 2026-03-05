import type { SEOIssue, MobileData } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";
import { extractMetaContentSafe } from "../html-utils";

export function analyzeMobile(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
  data: MobileData;
} {
  const issues: SEOIssue[] = [];
  let score = 100;

  // Check viewport configuration
  // Note: Missing viewport is already penalized in the technical analyzer (-20).
  // Here we only flag it for the mobile category without a heavy duplicate penalty.
  const viewportContent = extractMetaContentSafe(ctx.html, "viewport");
  const viewportConfigured = !!viewportContent;
  if (!viewportConfigured) {
    issues.push({
      type: "error",
      category: "mobile",
      message: "No viewport meta tag for mobile",
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      impact: "high",
    });
    score -= 10;
  } else {
    issues.push({
      type: "success",
      category: "mobile",
      message: "Viewport meta tag configured",
    });
  }

  // Small font-size patterns (<12px) in inline styles
  // Strip <script>/<style> blocks first to avoid matching CSS rules (e.g. media query breakpoints)
  const htmlForFontCheck = ctx.html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  const smallFontMatches =
    htmlForFontCheck.match(/font-size\s*:\s*(\d+)px/gi) || [];
  let smallFontCount = 0;
  for (const match of smallFontMatches) {
    const sizeMatch = match.match(/(\d+)/);
    if (sizeMatch && parseInt(sizeMatch[1]) < 12) smallFontCount++;
  }
  if (smallFontCount > 3) {
    issues.push({
      type: "warning",
      category: "mobile",
      message: `${smallFontCount} instance(s) of font-size below 12px`,
      fix: "Use minimum 12px font size for mobile readability (16px recommended for body text)",
      impact: "medium",
    });
    score -= Math.min(smallFontCount * 3, 15);
  } else {
    issues.push({
      type: "success",
      category: "mobile",
      message: "No problematic small font sizes detected",
    });
  }

  // Fixed-width overflow patterns
  // Detect fixed widths >= 500px in inline styles only (style="...").
  // Exclude <script> AND <style> blocks: <style> contains CSS media queries
  // like @media (min-width: 768px) which are responsive breakpoints, not fixed-width elements.
  // Also strip sizes/imageSizes attributes: these contain responsive image media queries
  // like (max-width: 640px) 160px which are NOT fixed-width elements.
  const visibleForMobile = ctx.html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/(?:sizes|imageSizes|media)="[^"]*"/gi, "");
  // Use negative lookbehind (?<!max-) to prevent matching max-width: (responsive) as width:
  const fixedWidthMatches =
    visibleForMobile.match(
      /(?:(?<!max-)width\s*:\s*(\d+)px|min-width\s*:\s*(\d+)px)/gi,
    ) || [];
  const fixedWidthPatterns = fixedWidthMatches.filter((m) => {
    const val = parseInt(m.match(/(\d+)px/)?.[1] || "0");
    return val >= 500;
  });
  const fixedWidthIssues = fixedWidthPatterns.length;
  if (fixedWidthIssues > 0) {
    issues.push({
      type: "warning",
      category: "mobile",
      message: `${fixedWidthIssues} fixed-width element(s) may cause horizontal scroll`,
      fix: "Use relative units (%, vw, rem) instead of fixed pixel widths for mobile compatibility",
      impact: "medium",
    });
    score -= Math.min(fixedWidthIssues * 5, 20);
  } else {
    issues.push({
      type: "success",
      category: "mobile",
      message: "No fixed-width overflow issues detected",
    });
  }

  // Touch target size hints - only check explicit height on interactive elements
  // Google recommends 48x48px; WCAG 2.5.8 requires 24x24px minimum.
  // Only flag inline height on <a> and <button> elements for accuracy.
  const interactiveElements =
    ctx.html.match(
      /<(?:a|button)[^>]+style=["'][^"']*height\s*:\s*(\d+)px/gi,
    ) || [];
  const tinyClickTargets = interactiveElements.filter((m) => {
    const sizeMatch = m.match(/height\s*:\s*(\d+)px/i);
    const size = sizeMatch ? parseInt(sizeMatch[1]) : 48;
    return size > 0 && size < 48;
  }).length;
  if (tinyClickTargets > 3) {
    issues.push({
      type: "warning",
      category: "mobile",
      message: `${tinyClickTargets} interactive element(s) with inline height < 48px`,
      fix: "Ensure touch targets are at least 48x48px for mobile usability (Google Lighthouse recommendation)",
      impact: "medium",
    });
    score -= Math.min(tinyClickTargets * 2, 8);
  }

  // Responsive design signals (media queries for screen, not print)
  const styleBlocks = (
    ctx.html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []
  ).join(" ");
  const hasMediaQueries =
    /@media\s*[^{]*(?:max-width|min-width|screen)/i.test(styleBlocks) ||
    /@media\s*[^{]*(?:max-width|min-width|screen)/i.test(ctx.html);
  // Only check class attributes for responsive framework patterns to avoid false positives from body text
  const classAttrs = (ctx.html.match(/class=["'][^"']*["']/gi) || []).join(" ");
  const hasResponsiveClasses = /(?:col-(?:sm|md|lg|xl)|sm:|md:|lg:|xl:)/i.test(
    classAttrs,
  );
  if (hasMediaQueries || hasResponsiveClasses) {
    issues.push({
      type: "success",
      category: "mobile",
      message:
        "Responsive design patterns detected (media queries or responsive framework)",
    });
  } else if (viewportConfigured) {
    issues.push({
      type: "warning",
      category: "mobile",
      message: "No inline responsive design signals detected",
      fix: "If responsive styles are in external CSS files, this check may be a false positive. Ensure mobile breakpoints exist in your stylesheet.",
      impact: "low",
    });
  }

  // Horizontal scroll risk - tables without responsive wrapper
  const tablesWithoutWrapper =
    ctx.html.match(
      /<table[^>]*(?:width=["']\d{3,}|style=["'][^"']*width\s*:\s*\d{3,})/gi,
    ) || [];
  if (tablesWithoutWrapper.length > 0) {
    issues.push({
      type: "warning",
      category: "mobile",
      message: `${tablesWithoutWrapper.length} table(s) with fixed width may cause horizontal scrolling on mobile`,
      fix: "Wrap tables in a responsive container with overflow-x: auto for mobile compatibility",
      impact: "medium",
    });
    score -= Math.min(tablesWithoutWrapper.length * 3, 10);
  }

  // Mobile-friendly tap spacing (links too close together)
  // Detect adjacent links: direct (</a><a>) or with minimal separators (</a></li><li><a>)
  const adjacentDirect = ctx.html.match(/<\/a>\s*<a/gi) || [];
  const adjacentInList =
    ctx.html.match(/<\/a>\s*<\/li>\s*<li[^>]*>\s*<a/gi) || [];
  const adjacentLinks = adjacentDirect.length + adjacentInList.length;
  if (adjacentLinks > 20) {
    issues.push({
      type: "warning",
      category: "mobile",
      message: `Many adjacent links (${adjacentLinks}) - may be hard to tap on mobile`,
      fix: "Add spacing between adjacent links for better mobile tap accuracy",
      impact: "low",
    });
    score -= 3;
  }

  return {
    score: Math.max(0, score),
    issues,
    data: { smallFontCount, fixedWidthIssues, viewportConfigured },
  };
}
