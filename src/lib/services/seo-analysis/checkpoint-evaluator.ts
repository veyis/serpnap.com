/**
 * Checkpoint Evaluator
 *
 * Maps SEOCheckResult data to checkpoint pass/fail/warning status.
 * Each evaluator function returns a CheckpointResult based on analysis data.
 */

import type { SEOCheckResult, SEOIssue } from "@/schemas/seo-checker";
import {
  SEO_CHECKPOINT_PILLARS,
  type CheckpointResult,
  type EvaluatedCheckpoint,
  type PillarScore,
  type CheckpointAuditResult,
} from "@/lib/data/seo-checkpoint-data";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pass(message?: string): CheckpointResult {
  return { status: "pass", message: message ?? "Passed" };
}

function fail(message: string, detail?: string): CheckpointResult {
  return { status: "fail", message, detail };
}

function warn(message: string, detail?: string): CheckpointResult {
  return { status: "warning", message, detail };
}

function manual(message?: string): CheckpointResult {
  return {
    status: "manual",
    message: message ?? "Requires manual verification",
  };
}

/** Check if any issue message matches a pattern */
function hasIssue(
  issues: SEOIssue[],
  type: "error" | "warning" | "success",
  pattern: string | RegExp,
): boolean {
  return issues.some(
    (i) =>
      i.type === type &&
      (typeof pattern === "string"
        ? i.message.includes(pattern)
        : pattern.test(i.message)),
  );
}

/** Get all issues from all categories */
function allIssues(result: SEOCheckResult): SEOIssue[] {
  const issues: SEOIssue[] = [];
  for (const cat of Object.values(result.categories)) {
    if (cat?.issues) issues.push(...cat.issues);
  }
  return issues;
}

// ---------------------------------------------------------------------------
// Evaluator registry — maps evaluatorKey → function
// ---------------------------------------------------------------------------

type Evaluator = (result: SEOCheckResult) => CheckpointResult;

const evaluators: Record<string, Evaluator> = {
  // ========= PILLAR 1 — Crawlability =========

  robotsNoindex(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "robots.txt disallows crawling"))
      return fail("robots.txt blocks this page from crawling");
    if (hasIssue(tech, "error", /noindex/i))
      return fail("Page has noindex — search engines cannot index it");
    if (hasIssue(tech, "error", /noindex/i))
      return fail("X-Robots-Tag or meta robots blocks indexing");
    return pass("Page is indexable — no blocking signals detected");
  },

  sitemapFound(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "XML sitemap found"))
      return pass("XML sitemap found at /sitemap.xml");
    if (hasIssue(tech, "warning", "XML sitemap not found"))
      return warn("No XML sitemap found at /sitemap.xml");
    return warn("Could not verify sitemap status");
  },

  httpsEnabled(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "Site not using HTTPS"))
      return fail("Site is not using HTTPS");
    if (hasIssue(tech, "success", "HTTPS enabled"))
      return pass("HTTPS is enabled");
    return pass("HTTPS connection detected");
  },

  htmlLinks(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "error", "Page has no links at all"))
      return fail("No HTML links found — possible JavaScript-only navigation");
    if (r.contentMetrics && r.contentMetrics.linkCount.internal > 0)
      return pass("HTML <a> links found in page content");
    return warn("Very few HTML links detected");
  },

  orphanPages(r) {
    if (!r.internalLinkStructure) return warn("Could not analyze internal link structure");
    const ils = r.internalLinkStructure;
    if (ils.totalLinks === 0)
      return fail("No internal links — page may be orphaned");
    if (ils.contentBodyLinks < 2)
      return warn(
        `Only ${ils.contentBodyLinks} internal link(s) in content body`,
      );
    return pass(
      `${ils.totalLinks} internal links with ${ils.contentBodyLinks} in content body`,
    );
  },

  robotsSitemapRef(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "Sitemap referenced in robots.txt"))
      return pass("robots.txt references sitemap");
    if (hasIssue(tech, "warning", "Sitemap not referenced in robots.txt"))
      return warn("Sitemap not referenced in robots.txt");
    if (hasIssue(tech, "success", "robots.txt found"))
      return warn("robots.txt found but sitemap reference not confirmed");
    return warn("robots.txt status unknown");
  },

  // ========= PILLAR 2 — Technical =========

  httpsStrict(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "Site not using HTTPS"))
      return fail("Not using HTTPS — critical security and ranking issue");
    return pass("HTTPS enabled sitewide");
  },

  hstsHeader(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "HSTS with preload and includeSubDomains"))
      return pass("HSTS fully configured with preload");
    if (hasIssue(tech, "warning", "HSTS missing preload"))
      return warn("HSTS present but missing preload directive");
    if (hasIssue(tech, "warning", "HSTS has preload but missing includeSubDomains"))
      return warn("HSTS missing includeSubDomains");
    // Check if HSTS is in the security headers list
    if (hasIssue(tech, "error", /strict-transport-security/i))
      return fail("Missing HSTS header");
    return warn("HSTS status could not be determined");
  },

  mixedContent(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "Mixed content"))
      return fail("Mixed content detected — HTTP resources on HTTPS page");
    if (hasIssue(tech, "success", "No mixed content"))
      return pass("No mixed content — all resources loaded over HTTPS");
    return pass("No mixed content issues detected");
  },

  securityHeaders(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "All recommended security headers"))
      return pass("All recommended security headers present");
    if (hasIssue(tech, "warning", /Missing security header/))
      return warn("Some security headers missing");
    if (hasIssue(tech, "error", /Missing.*security header/))
      return fail("Critical security headers missing");
    return warn("Security headers not fully verified");
  },

  canonicalDefined(r) {
    const meta = r.categories.meta?.issues ?? [];
    if (hasIssue(meta, "error", "Missing canonical URL"))
      return fail("No canonical URL defined");
    if (hasIssue(meta, "success", "Canonical URL defined"))
      return pass("Canonical URL properly defined");
    if (hasIssue(meta, "warning", /Canonical/i))
      return warn("Canonical URL has issues");
    return pass("Canonical URL present");
  },

  cleanUrls(r) {
    if (!r.urlAnalysis) return warn("URL analysis not available");
    if (r.urlAnalysis.isClean)
      return pass("Clean, descriptive URL structure");
    if (r.urlAnalysis.hasSpecialChars)
      return warn("URL contains special characters");
    return warn("URL could be more descriptive");
  },

  trailingSlash(r) {
    if (!r.urlAnalysis) return warn("URL analysis not available");
    if (r.urlAnalysis.trailingSlashConsistent)
      return pass("Trailing slash usage is consistent");
    return warn("Inconsistent trailing slash usage");
  },

  noSoft404(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "soft 404"))
      return fail("Soft 404 detected — page serves error content with 200 status");
    return pass("No soft 404 issues detected");
  },

  brokenLinks(r) {
    if (!r.brokenLinkAnalysis) return warn("Broken link analysis not available");
    const broken = r.brokenLinkAnalysis.brokenLinks.filter(
      (l) => l.type === "broken",
    ).length;
    if (broken > 0)
      return fail(`${broken} broken outbound link(s) detected`);
    if (r.brokenLinkAnalysis.allHealthy)
      return pass(
        `All ${r.brokenLinkAnalysis.checkedCount} checked links are healthy`,
      );
    return pass("No broken links found");
  },

  ssrContent(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "warning", "client-rendered snapshot"))
      return warn("Content appears to rely on client-side rendering");
    if (r.contentMetrics && r.contentMetrics.wordCount > 50)
      return pass("Content is present in initial HTML (SSR/SSG)");
    return warn("Very little content in initial HTML — possible CSR issue");
  },

  // ========= PILLAR 3 — Performance =========

  lcpGood(r) {
    if (!r.lighthouseEstimation)
      return warn("Lighthouse estimation not available");
    const perf = r.lighthouseEstimation.performance.score;
    if (perf >= 80)
      return pass(`Performance score ${perf}/100 suggests good LCP`);
    if (perf >= 50)
      return warn(`Performance score ${perf}/100 — LCP may exceed 2.5s`);
    return fail(`Performance score ${perf}/100 — LCP likely exceeds 2.5s`);
  },

  inpGood(r) {
    const tech = r.categories.technical?.issues ?? [];
    // Check for render-blocking and heavy JS as INP proxies
    const blockingScripts = tech.filter(
      (i) =>
        i.type === "warning" &&
        i.message.includes("script") &&
        i.message.includes("block"),
    ).length;
    if (blockingScripts > 2)
      return warn("Multiple blocking scripts may increase INP");
    if (!r.lighthouseEstimation)
      return warn("INP requires real user measurement (CrUX) for accurate data");
    if (r.lighthouseEstimation.performance.score >= 70)
      return pass("Script loading pattern suggests acceptable INP");
    return warn("Heavy scripts may impact INP — verify with CrUX data");
  },

  clsGood(r) {
    if (!r.imageAnalysis) return warn("Image analysis not available");
    const missingDims =
      r.imageAnalysis.withoutDimensions;
    if (missingDims > 3)
      return fail(
        `${missingDims} images without dimensions — high CLS risk`,
      );
    if (missingDims > 0)
      return warn(
        `${missingDims} image(s) without dimensions — potential CLS`,
      );
    return pass("All images have dimensions — low CLS risk");
  },

  ttfbGood(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "Slow server response"))
      return fail("Server response time exceeds 800ms");
    if (hasIssue(tech, "warning", "Server response could be faster"))
      return warn("Server response time could be faster");
    if (hasIssue(tech, "success", "Fast server response"))
      return pass("Fast server response (TTFB)");
    if (r.loadTime && r.loadTime < 800)
      return pass(`Server responded in ${r.loadTime}ms`);
    if (r.loadTime && r.loadTime < 2000)
      return warn(`Server responded in ${r.loadTime}ms — could be faster`);
    return warn("TTFB not measured");
  },

  heroImageOptimized(r) {
    const tech = r.categories.technical?.issues ?? [];
    const content = r.categories.content?.issues ?? [];
    const all = [...tech, ...content];
    let score = 0;
    if (hasIssue(all, "success", /[Mm]odern image format/)) score++;
    if (hasIssue(all, "success", /[Rr]esponsive images/)) score++;
    if (hasIssue(all, "success", /preload/i)) score++;
    if (score >= 2) return pass("Hero image appears well-optimized");
    if (score >= 1) return warn("Hero image partially optimized");
    return warn("Image optimization signals weak — check WebP/AVIF, srcset, priority");
  },

  fontDisplay(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "font-display: swap"))
      return pass("font-display: swap configured");
    if (hasIssue(issues, "warning", "without font-display"))
      return warn("Custom fonts missing font-display — may cause FOUT/FOIT");
    return pass("Font loading appears acceptable");
  },

  noRenderBlocking(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "error", /render-blocking/i))
      return fail("Render-blocking resources detected before LCP");
    if (hasIssue(issues, "warning", /render-blocking/i))
      return warn("Some render-blocking resources detected");
    if (hasIssue(issues, "success", "All scripts use defer/async"))
      return pass("No render-blocking scripts");
    return pass("Render-blocking check passed");
  },

  deferredScripts(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "All scripts use defer/async"))
      return pass("All scripts deferred or async");
    if (hasIssue(issues, "warning", /without defer\/async/))
      return warn("Some scripts without defer/async may block rendering");
    return pass("Script loading appears acceptable");
  },

  imageDimensions(r) {
    if (!r.imageAnalysis) return warn("Image analysis not available");
    if (r.imageAnalysis.withoutDimensions > 0)
      return warn(
        `${r.imageAnalysis.withoutDimensions} image(s) missing width/height`,
      );
    return pass("All images have explicit dimensions");
  },

  // ========= PILLAR 4 — On-Page =========

  titleExists(r) {
    const meta = r.categories.meta?.issues ?? [];
    if (hasIssue(meta, "error", "Missing title tag"))
      return fail("Missing title tag");
    return pass("Title tag present");
  },

  titleLength(r) {
    const meta = r.categories.meta?.issues ?? [];
    if (hasIssue(meta, "error", "Title too short"))
      return fail("Title too short");
    if (hasIssue(meta, "warning", "Title may be truncated"))
      return warn("Title may be truncated in SERPs");
    if (hasIssue(meta, "success", "Good title length"))
      return pass("Title length is optimal (50-60 characters)");
    return pass("Title length acceptable");
  },

  metaDescExists(r) {
    const meta = r.categories.meta?.issues ?? [];
    if (hasIssue(meta, "error", "Missing meta description"))
      return fail("Missing meta description");
    if (hasIssue(meta, "warning", "Meta description too short"))
      return warn("Meta description too short");
    if (hasIssue(meta, "warning", "Meta description may be truncated"))
      return warn("Meta description may be truncated");
    if (hasIssue(meta, "success", "Optimal meta description"))
      return pass("Meta description length is optimal");
    return pass("Meta description present");
  },

  singleH1(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "error", "Missing H1"))
      return fail("Missing H1 heading");
    if (hasIssue(content, "warning", "Multiple H1 tags"))
      return warn("Multiple H1 tags found — should have exactly one");
    if (hasIssue(content, "success", "Single H1 tag"))
      return pass("Single H1 tag present");
    // Check for H1 in heading hierarchy
    if (r.headingHierarchy) {
      const h1Count = r.headingHierarchy.filter((h) => h.level === 1).length;
      if (h1Count === 0) return fail("No H1 heading found");
      if (h1Count === 1) return pass("Single H1 heading present");
      return warn(`${h1Count} H1 headings — use only one`);
    }
    return warn("H1 presence could not be confirmed");
  },

  headingHierarchy(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "error", "skipped levels"))
      return fail("Heading hierarchy has skipped levels");
    if (hasIssue(content, "success", "Proper heading hierarchy"))
      return pass("Logical heading hierarchy maintained");
    if (r.headingHierarchy) {
      const skipped = r.headingHierarchy.some((h) => h.isSkipped);
      if (skipped) return warn("Heading levels are skipped");
      return pass("Heading hierarchy appears correct");
    }
    return warn("Heading hierarchy not verified");
  },

  contentDepth(r) {
    if (!r.contentMetrics) return warn("Content metrics not available");
    const wc = r.contentMetrics.wordCount;
    if (wc < 100) return fail(`Very thin content (${wc} words)`);
    if (wc < 300)
      return warn(`Content could be deeper (${wc} words)`);
    if (wc >= 1500)
      return pass(`Excellent content depth (${wc} words)`);
    return pass(`Good content length (${wc} words)`);
  },

  readabilityGood(r) {
    if (!r.readability) return warn("Readability analysis not available");
    const fs = r.readability.fleschScore;
    if (fs >= 60) return pass(`Good readability (Flesch ${fs} — ${r.readability.fleschGrade})`);
    if (fs >= 40)
      return warn(`Readability could be improved (Flesch ${fs} — ${r.readability.fleschGrade})`);
    return fail(`Difficult readability (Flesch ${fs} — ${r.readability.fleschGrade})`);
  },

  descriptiveAnchors(r) {
    if (!r.internalLinkStructure) return warn("Internal link analysis not available");
    const ils = r.internalLinkStructure;
    if (ils.genericAnchors.length > 3)
      return fail(
        `${ils.genericAnchors.length} links with generic anchor text`,
      );
    if (ils.genericAnchors.length > 0)
      return warn(
        `${ils.genericAnchors.length} link(s) with generic anchor text`,
      );
    if (ils.emptyAnchors.length > 0)
      return warn(`${ils.emptyAnchors.length} link(s) with empty anchor text`);
    return pass("Anchor text is descriptive and varied");
  },

  internalLinkCount(r) {
    if (!r.contentMetrics) return warn("Content metrics not available");
    const ic = r.contentMetrics.linkCount.internal;
    if (ic < 1)
      return fail("No internal links found");
    if (ic < 3)
      return warn(`Only ${ic} internal link(s) — aim for 3-5+`);
    return pass(`${ic} internal links — good contextual linking`);
  },

  // ========= PILLAR 5 — E-E-A-T =========

  authorMarkup(r) {
    if (!r.eeatData) return warn("E-E-A-T data not available");
    if (r.eeatData.hasAuthorMarkup)
      return pass("Author attribution detected");
    return warn("No author markup found — add bylines with credentials");
  },

  trustPages(r) {
    if (!r.eeatData) return warn("E-E-A-T data not available");
    const links = r.eeatData.trustPageLinks;
    const hasAbout = links.some((l) => /about/i.test(l));
    const hasContact = links.some((l) => /contact/i.test(l));
    if (hasAbout && hasContact)
      return pass(`Trust pages linked: ${links.join(", ")}`);
    if (links.length > 0)
      return warn(`Some trust pages found: ${links.join(", ")}`);
    return fail("No trust page links found (about, contact)");
  },

  contactInfo(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "Contact information signals found"))
      return pass("Contact information signals detected");
    if (hasIssue(issues, "warning", "No contact information"))
      return fail("No contact information signals");
    // Check for tel: links as a signal
    const html = "";
    return warn("Contact information presence not confirmed");
  },

  privacyTerms(r) {
    if (!r.eeatData) return warn("E-E-A-T data not available");
    const links = r.eeatData.trustPageLinks;
    const hasPrivacy = r.eeatData.hasPrivacyPolicy || links.some((l) => /privacy/i.test(l));
    const hasTerms = links.some((l) => /terms/i.test(l));
    if (hasPrivacy && hasTerms)
      return pass("Privacy policy and terms of service linked");
    if (hasPrivacy) return warn("Privacy policy found but terms of service missing");
    if (hasTerms) return warn("Terms of service found but privacy policy missing");
    return fail("Missing privacy policy and terms of service");
  },

  trustSignals(r) {
    if (!r.eeatData) return warn("E-E-A-T data not available");
    if (r.eeatData.trustSignalCount >= 3)
      return pass(
        `Strong trust signals detected (${r.eeatData.trustSignalCount} types)`,
      );
    if (r.eeatData.trustSignalCount > 0)
      return warn(
        `Some trust signals (${r.eeatData.trustSignalCount}) — add reviews, certifications`,
      );
    return fail("No trust signals detected");
  },

  socialLinks(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "Social media presence"))
      return pass("Social media profile links found");
    if (hasIssue(issues, "warning", "No social media profile"))
      return warn("No social media links found");
    return warn("Social media presence not detected");
  },

  // ========= PILLAR 6 — Schema =========

  faviconPresent(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "Favicon detected"))
      return pass("Favicon detected");
    if (hasIssue(tech, "error", "Missing favicon"))
      return fail("Missing favicon");
    return warn("Favicon status uncertain");
  },

  jsonLdValid(r) {
    const struct = r.categories.structured?.issues ?? [];
    if (hasIssue(struct, "error", /JSON-LD.*error/i))
      return fail("JSON-LD has syntax errors");
    if (hasIssue(struct, "warning", "No JSON-LD structured data"))
      return warn("No JSON-LD structured data found");
    if (hasIssue(struct, "success", "JSON-LD found"))
      return pass("Valid JSON-LD structured data present");
    if (r.schemaTypes && r.schemaTypes.length > 0)
      return pass(`JSON-LD schema types: ${r.schemaTypes.join(", ")}`);
    return warn("No structured data detected");
  },

  orgSchema(r) {
    if (r.schemaTypes) {
      const hasOrg = r.schemaTypes.some((t) =>
        /organization/i.test(t),
      );
      const hasWebsite = r.schemaTypes.some((t) =>
        /website/i.test(t),
      );
      if (hasOrg || hasWebsite)
        return pass(
          `${hasOrg ? "Organization" : ""}${hasOrg && hasWebsite ? " and " : ""}${hasWebsite ? "WebSite" : ""} schema present`,
        );
    }
    const struct = r.categories.structured?.issues ?? [];
    if (hasIssue(struct, "warning", "Consider adding Organization"))
      return warn("Missing Organization or WebSite schema");
    return warn("Organization/WebSite schema not detected");
  },

  breadcrumbSchema(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "BreadcrumbList schema"))
      return pass("BreadcrumbList schema present");
    if (hasIssue(tech, "warning", "missing BreadcrumbList schema"))
      return warn("Breadcrumb navigation found but missing schema markup");
    const struct = r.categories.structured?.issues ?? [];
    if (hasIssue(struct, "success", "BreadcrumbList"))
      return pass("BreadcrumbList schema detected");
    if (r.schemaTypes?.some((t) => /breadcrumb/i.test(t)))
      return pass("BreadcrumbList schema present");
    return warn("No BreadcrumbList schema detected");
  },

  articleSchema(r) {
    if (!r.schemaTypes) return warn("Schema types not available");
    if (r.schemaTypes.some((t) => /article/i.test(t))) {
      const struct = r.categories.structured?.issues ?? [];
      if (hasIssue(struct, "warning", "Article schema missing datePublished"))
        return warn("Article schema missing datePublished");
      if (hasIssue(struct, "warning", "Article schema missing dateModified"))
        return warn("Article schema missing dateModified");
      return pass("Article schema with dates present");
    }
    // Only flag for blog-like pages
    return { status: "na", message: "Article schema applies to blog/news pages" };
  },

  // ========= PILLAR 7 — Images =========

  altText(r) {
    if (!r.contentMetrics) return warn("Content metrics not available");
    const missing = r.contentMetrics.imageCount.withoutAlt;
    const total = r.contentMetrics.imageCount.total;
    if (total === 0) return { status: "na", message: "No images on page" };
    if (missing > 0) return fail(`${missing} of ${total} images missing alt text`);
    return pass(`All ${total} images have alt text`);
  },

  modernImageFormats(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", /[Mm]odern image format/))
      return pass("Modern image formats (WebP/AVIF) detected");
    if (hasIssue(issues, "success", "Next.js Image optimizer"))
      return pass("Next.js Image optimizer serves WebP/AVIF automatically");
    if (hasIssue(issues, "warning", "No modern image formats"))
      return warn("No WebP/AVIF detected — consider modern formats");
    return warn("Modern image format usage unclear");
  },

  responsiveImages(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "success", /[Rr]esponsive images/))
      return pass("Responsive images with srcset detected");
    if (hasIssue(content, "warning", "No responsive images"))
      return warn("No srcset detected — add responsive images");
    if (r.imageAnalysis && r.imageAnalysis.srcsetCount > 0)
      return pass(`${r.imageAnalysis.srcsetCount} images with srcset`);
    return warn("Responsive image usage not confirmed");
  },

  imageDimensionsAll(r) {
    if (!r.imageAnalysis) return warn("Image analysis not available");
    if (r.imageAnalysis.withoutDimensions === 0)
      return pass(`All ${r.imageAnalysis.withDimensions} images have dimensions`);
    return warn(
      `${r.imageAnalysis.withoutDimensions} image(s) missing width/height`,
    );
  },

  lazyLoading(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "Lazy loading enabled"))
      return pass("Lazy loading enabled for images");
    if (hasIssue(issues, "warning", /without lazy loading/))
      return warn("Some images without lazy loading");
    if (r.performanceHints?.hasLazyImages)
      return pass("Lazy loading detected");
    return warn("Lazy loading not detected");
  },

  // ========= PILLAR 8 — Local SEO =========

  localBusinessSchema(r) {
    if (!r.schemaTypes) return warn("Schema types not available");
    if (r.schemaTypes.some((t) => /localbusiness/i.test(t)))
      return pass("LocalBusiness schema present");
    return { status: "na", message: "LocalBusiness schema applies to local business sites" };
  },

  // ========= PILLAR 9 — Architecture =========

  urlDepth(r) {
    if (!r.urlAnalysis) return warn("URL analysis not available");
    if (r.urlAnalysis.depth <= 3)
      return pass(`URL depth is ${r.urlAnalysis.depth} (within 3-click target)`);
    return warn(
      `URL depth is ${r.urlAnalysis.depth} — may be too deep`,
    );
  },

  noOrphanPages(r) {
    if (!r.internalLinkStructure) return warn("Internal link structure not analyzed");
    if (r.internalLinkStructure.totalLinks >= 2)
      return pass(
        `Page has ${r.internalLinkStructure.totalLinks} internal links`,
      );
    return warn("Page may be poorly connected internally");
  },

  breadcrumbNav(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "success", "Breadcrumb navigation with BreadcrumbList schema"))
      return pass("Breadcrumbs with schema markup present");
    if (hasIssue(tech, "warning", "Breadcrumb navigation found but missing"))
      return warn("Breadcrumbs found but missing schema markup");
    if (hasIssue(tech, "success", "BreadcrumbList schema"))
      return pass("BreadcrumbList schema present");
    return warn("No breadcrumb navigation detected");
  },

  anchorTextQuality(r) {
    if (!r.internalLinkStructure) return warn("Internal link structure not analyzed");
    const ils = r.internalLinkStructure;
    const issues: string[] = [];
    if (ils.genericAnchors.length > 0)
      issues.push(`${ils.genericAnchors.length} generic`);
    if (ils.emptyAnchors.length > 0)
      issues.push(`${ils.emptyAnchors.length} empty`);
    if (issues.length > 0) return warn(`Anchor text issues: ${issues.join(", ")}`);
    return pass("Anchor text quality is good");
  },

  // ========= PILLAR 11 — Accessibility =========

  a11yAltText(r) {
    if (!r.contentMetrics) return warn("Content metrics not available");
    const missing = r.contentMetrics.imageCount.withoutAlt;
    if (missing > 0) return fail(`${missing} image(s) missing alt attribute`);
    return pass("All images have alt attributes");
  },

  colorContrast(r) {
    if (!r.contrastAnalysis) return warn("Color contrast not analyzed");
    if (r.contrastAnalysis.violationCount > 0)
      return fail(
        `${r.contrastAnalysis.violationCount} contrast violation(s) (WCAG AA)`,
      );
    if (r.contrastAnalysis.checkedPairs > 0)
      return pass(
        `All ${r.contrastAnalysis.checkedPairs} color pairs pass WCAG AA`,
      );
    return warn("No color pairs checked");
  },

  keyboardNav(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "Focus styles detected"))
      return pass("Focus styles detected for keyboard navigation");
    if (hasIssue(issues, "warning", "No explicit focus styles"))
      return warn("No explicit focus styles — may impact keyboard navigation");
    return warn("Keyboard navigation not fully verified");
  },

  langAttribute(r) {
    const tech = r.categories.technical?.issues ?? [];
    if (hasIssue(tech, "error", "Missing language attribute"))
      return fail("Missing lang attribute on <html>");
    if (hasIssue(tech, "success", "Language attribute defined"))
      return pass("Language attribute set on <html>");
    return warn("Language attribute not verified");
  },

  formLabels(r) {
    if (!r.accessibility) return warn("Accessibility data not available");
    if (r.accessibility.formsWithoutLabels > 0)
      return warn(
        `${r.accessibility.formsWithoutLabels} form field(s) may lack labels`,
      );
    if (r.accessibility.formLabelsCount > 0)
      return pass("All form fields have labels");
    return { status: "na", message: "No form fields to check" };
  },

  skipLink(r) {
    if (!r.accessibility) return warn("Accessibility data not available");
    if (r.accessibility.hasSkipLink)
      return pass("Skip navigation link present");
    return warn("Missing skip navigation link");
  },

  ariaLandmarks(r) {
    if (!r.accessibility) return warn("Accessibility data not available");
    if (r.accessibility.hasLandmarks)
      return pass("ARIA landmarks present");
    return warn("Missing ARIA landmarks (<main>, <nav>)");
  },

  // ========= PILLAR 12 — UX =========

  mobileFriendly(r) {
    if (!r.mobileData) return warn("Mobile data not available");
    let issues = 0;
    if (!r.mobileData.viewportConfigured) issues++;
    if (r.mobileData.smallFontCount > 0) issues++;
    if (r.mobileData.fixedWidthIssues > 0) issues++;
    if (issues === 0) return pass("Mobile-friendly — viewport, fonts, and widths are good");
    if (issues === 1) return warn("Minor mobile usability issue detected");
    return fail("Multiple mobile usability issues detected");
  },

  ctaPresent(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "success", "Call-to-action elements detected"))
      return pass("Call-to-action elements detected");
    return warn("No clear CTA elements detected");
  },

  telLink(r) {
    const issues = allIssues(r);
    // Contact info signal often includes phone
    if (hasIssue(issues, "success", /phone|tel/i))
      return pass("Phone contact signal detected");
    return warn("No tel: link detected for mobile click-to-call");
  },

  // ========= PILLAR 13 — Freshness =========

  freshnessSignals(r) {
    const content = r.categories.content?.issues ?? [];
    if (hasIssue(content, "success", "Content freshness signals"))
      return pass("Content freshness signals detected");
    if (r.eeatData?.hasPublishedDate)
      return pass("Published date signal found");
    if (hasIssue(content, "warning", "No content freshness signals"))
      return warn("No freshness signals — add publish/update dates");
    return warn("Content freshness signals not detected");
  },

  // ========= PILLAR 14 — Security =========

  httpsEverywhere(r) {
    return evaluators.httpsStrict(r);
  },

  allSecurityHeaders(r) {
    return evaluators.securityHeaders(r);
  },

  privacyPolicy(r) {
    if (!r.eeatData) return warn("E-E-A-T data not available");
    if (r.eeatData.hasPrivacyPolicy)
      return pass("Privacy policy link detected");
    return warn("Privacy policy link not found");
  },

  contactAccessible(r) {
    return evaluators.contactInfo(r);
  },

  termsPage(r) {
    const issues = allIssues(r);
    if (hasIssue(issues, "success", "Terms of Service link"))
      return pass("Terms of service link detected");
    if (r.eeatData?.trustPageLinks.some((l) => /terms/i.test(l)))
      return pass("Terms page linked");
    return warn("Terms of service link not found");
  },

  // ========= PILLAR 15 — AI/GEO =========

  aiExtractable(r) {
    if (!r.contentMetrics || !r.headingHierarchy)
      return warn("Content analysis not available");
    const h2Count = r.contentMetrics.headingCount.h2;
    const wc = r.contentMetrics.wordCount;
    if (h2Count >= 3 && wc >= 500)
      return pass("Content has clear heading structure for AI extraction");
    if (h2Count >= 1 && wc >= 300)
      return warn("Structure adequate but could be more extractable");
    return fail("Content lacks structure needed for AI extraction");
  },

  semanticDepth(r) {
    if (!r.contentMetrics) return warn("Content metrics not available");
    const wc = r.contentMetrics.wordCount;
    const lists = r.contentMetrics.listCount;
    const tables = r.contentMetrics.tableCount;
    const h2 = r.contentMetrics.headingCount.h2;
    const diversity = (lists > 0 ? 1 : 0) + (tables > 0 ? 1 : 0) + (h2 >= 3 ? 1 : 0);
    if (wc >= 1500 && diversity >= 2)
      return pass("Strong semantic depth — comprehensive topic coverage");
    if (wc >= 500 && diversity >= 1)
      return warn("Moderate depth — consider expanding coverage");
    return fail("Thin content with low semantic depth");
  },

  schemaForAI(r) {
    if (!r.schemaTypes || r.schemaTypes.length === 0)
      return fail("No schema markup — 3x less likely to earn AI citations");
    if (r.schemaTypes.length >= 2)
      return pass(
        `${r.schemaTypes.length} schema types enhance AI visibility`,
      );
    return warn("Basic schema present — consider adding more types");
  },

  sameAsPresent(r) {
    const struct = r.categories.structured?.issues ?? [];
    if (hasIssue(struct, "success", "SameAs property"))
      return pass("sameAs links entity to external profiles");
    if (hasIssue(struct, "warning", "missing sameAs"))
      return warn("Organization schema missing sameAs property");
    return warn("sameAs property not detected in schema");
  },

  // ========= PILLAR 16 — Monitoring =========

  analyticsPresent(r) {
    // Check for GA/analytics scripts in the page
    const issues = allIssues(r);
    // Third-party scripts often include analytics
    if (hasIssue(issues, "success", /analytics|GA4/i))
      return pass("Analytics tracking detected");
    // Check waterfall for analytics resources
    if (r.waterfallAnalysis) {
      const hasAnalytics = r.waterfallAnalysis.resources.some(
        (res) =>
          /google-analytics|googletagmanager|gtag|analytics/i.test(res.url),
      );
      if (hasAnalytics) return pass("Analytics scripts detected in page resources");
    }
    return warn("Analytics tracking not detected — verify GA4 or equivalent is installed");
  },
};

// ---------------------------------------------------------------------------
// Main evaluation function
// ---------------------------------------------------------------------------

export function evaluateCheckpoints(
  result: SEOCheckResult,
): CheckpointAuditResult {
  const pillarScores: PillarScore[] = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let totalManual = 0;
  let totalAutoChecked = 0;
  let p0Failed = 0;
  let p1Failed = 0;

  for (const pillar of SEO_CHECKPOINT_PILLARS) {
    const evaluatedItems: EvaluatedCheckpoint[] = [];
    let pillarPass = 0;
    let pillarFail = 0;
    let pillarWarn = 0;
    let pillarManual = 0;

    for (const item of pillar.items) {
      let checkResult: CheckpointResult;

      if (item.autoCheck && item.evaluatorKey && evaluators[item.evaluatorKey]) {
        checkResult = evaluators[item.evaluatorKey](result);
        totalAutoChecked++;
      } else {
        checkResult = manual();
      }

      evaluatedItems.push({ ...item, result: checkResult });

      switch (checkResult.status) {
        case "pass":
          pillarPass++;
          totalPassed++;
          break;
        case "fail":
          pillarFail++;
          totalFailed++;
          if (item.priority === "P0") p0Failed++;
          if (item.priority === "P1") p1Failed++;
          break;
        case "warning":
          pillarWarn++;
          totalWarnings++;
          break;
        case "manual":
        case "na":
          pillarManual++;
          totalManual++;
          break;
      }
    }

    // Score: only auto-checked items count (pass=100, warn=50, fail=0)
    const scoreable = evaluatedItems.filter(
      (i) => i.result.status !== "manual" && i.result.status !== "na",
    );
    const pillarScore =
      scoreable.length > 0
        ? Math.round(
            (scoreable.reduce((sum, i) => {
              if (i.result.status === "pass") return sum + 100;
              if (i.result.status === "warning") return sum + 50;
              return sum;
            }, 0) /
              scoreable.length),
          )
        : -1; // -1 means no auto-checks available

    pillarScores.push({
      pillar,
      items: evaluatedItems,
      passCount: pillarPass,
      failCount: pillarFail,
      warningCount: pillarWarn,
      manualCount: pillarManual,
      score: pillarScore,
    });
  }

  // Overall score from all auto-checked items
  const allScoreable = pillarScores
    .flatMap((p) => p.items)
    .filter(
      (i) => i.result.status !== "manual" && i.result.status !== "na",
    );
  const overallScore =
    allScoreable.length > 0
      ? Math.round(
          allScoreable.reduce((sum, i) => {
            if (i.result.status === "pass") return sum + 100;
            if (i.result.status === "warning") return sum + 50;
            return sum;
          }, 0) / allScoreable.length,
        )
      : 0;

  const totalChecks = SEO_CHECKPOINT_PILLARS.reduce(
    (sum, p) => sum + p.items.length,
    0,
  );

  return {
    pillars: pillarScores,
    overallScore,
    totalChecks,
    autoChecked: totalAutoChecked,
    passed: totalPassed,
    failed: totalFailed,
    warnings: totalWarnings,
    manual: totalManual,
    p0Failed,
    p1Failed,
  };
}
