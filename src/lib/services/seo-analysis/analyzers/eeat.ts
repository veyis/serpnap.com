import type { SEOIssue, EEATData } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";

// Trust page patterns pre-compiled at module scope to avoid re-creating on every call
const TRUST_PAGES = ["/about", "/contact", "/privacy", "/terms"] as const;
const TRUST_PAGE_PATTERNS = TRUST_PAGES.map(
  (page) =>
    new RegExp(
      `href=["'][^"']*${page.replace(/\//g, "\\/")}[^"']*["']`,
      "i",
    ),
);

export function analyzeEEAT(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
  data: EEATData;
} {
  const issues: SEOIssue[] = [];
  let score = 100;

  // Author markup detection
  const hasMetaAuthor = /<meta[^>]+name=["']author["']/i.test(ctx.html);
  const hasRelAuthor =
    /<link[^>]+rel=["']author["']/i.test(ctx.html) ||
    /<a[^>]+rel=["']author["']/i.test(ctx.html);
  const jsonLdForAuthor = (
    ctx.html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ) || []
  ).join(" ");
  const hasSchemaAuthor = /["']author["']\s*:/i.test(jsonLdForAuthor);
  const articleLike =
    /<article[\s>]/i.test(ctx.html) ||
    /"@type"\s*:\s*"(?:Article|BlogPosting|NewsArticle)"/i.test(
      jsonLdForAuthor,
    ) ||
    /\/(?:blog|news|article)(?:\/|$)/i.test(ctx.url.pathname);
  const commercialLike =
    /\/(?:pricing|product|products|service|services|shop|store|checkout|plans?)(?:\/|$)/i.test(
      ctx.url.pathname,
    ) ||
    /"@type"\s*:\s*"(?:LocalBusiness|Organization|Product|Service)"/i.test(
      jsonLdForAuthor,
    ) ||
    /(?:request\s*(?:a\s*)?(?:demo|quote)|book\s*(?:a\s*)?(?:call|demo)|buy\s*now|add\s*to\s*cart|get\s*started)/i.test(
      ctx.html,
    );
  const hasAuthorMarkup = hasMetaAuthor || hasRelAuthor || hasSchemaAuthor;
  if (hasAuthorMarkup) {
    issues.push({
      type: "success",
      category: "eeat",
      message: "Author attribution detected",
    });
  } else {
    issues.push({
      type: "warning",
      category: "eeat",
      message: articleLike
        ? "No author markup found"
        : "No explicit author markup found",
      fix: articleLike
        ? "Add author byline and Person/author schema on editorial content"
        : "Author signals are optional for non-editorial pages",
      impact: articleLike ? "medium" : "low",
    });
    if (articleLike) score -= 8;
  }

  // Trust page links detection
  const foundTrustPages: string[] = [];
  for (let i = 0; i < TRUST_PAGES.length; i++) {
    if (TRUST_PAGE_PATTERNS[i].test(ctx.html)) {
      foundTrustPages.push(TRUST_PAGES[i]);
    }
  }
  if (foundTrustPages.length >= 3) {
    issues.push({
      type: "success",
      category: "eeat",
      message: `Trust page links found: ${foundTrustPages.join(", ")}`,
    });
  } else if (foundTrustPages.length > 0) {
    const missing = TRUST_PAGES.filter((p) => !foundTrustPages.includes(p));
    issues.push({
      type: "warning",
      category: "eeat",
      message: `Missing trust pages: ${missing.join(", ")}`,
      fix: "Add links to key trust pages where relevant (About, Contact, Privacy, Terms)",
      impact: "low",
    });
  } else {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No trust page links found (about, contact, privacy, terms)",
      fix: "Create and link to core trust pages where business/regulatory context requires them",
      impact: "low",
    });
  }

  // Privacy policy link
  const hasPrivacyPolicy = /href=["'][^"']*privac/i.test(ctx.html);
  if (hasPrivacyPolicy) {
    issues.push({
      type: "success",
      category: "eeat",
      message: "Privacy policy link detected",
    });
  } else {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No privacy policy link found",
      fix: "Add a visible link to your privacy policy for trust and legal compliance",
      impact: "medium",
    });
  }

  // Trust signals - use structural patterns to reduce false positives from body text.
  // Check for testimonial/review sections (class/id based), schema types, and rating widgets.
  const trustIndicators = [
    /class=["'][^"']*testimonial/i, // testimonial section
    /class=["'][^"']*review/i, // review section
    /AggregateRating/i, // schema rating
    /"@type"\s*:\s*"Review"/i, // schema review
    /class=["'][^"']*(?:certified|accredited|badge)/i, // certification badges
    /trustpilot|yelp\.com|g2\.com|bbb\.org/i, // third-party review platforms
    /class=["'][^"']*(?:rating|stars)/i, // rating widget
    /class=["'][^"']*(?:verified|guarantee)/i, // verified/guarantee badges
  ];
  let trustSignalCount = 0;
  for (const pattern of trustIndicators) {
    if (pattern.test(ctx.html)) trustSignalCount++;
  }
  if (trustSignalCount >= 3) {
    issues.push({
      type: "success",
      category: "eeat",
      message: `Strong trust signals detected (${trustSignalCount} types)`,
    });
  } else if (trustSignalCount > 0) {
    issues.push({
      type: "success",
      category: "eeat",
      message: `Some trust signals found (${trustSignalCount} types)`,
    });
  } else {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No trust signals detected",
      fix: "Add testimonials, reviews, or certification badges to build credibility",
      impact: commercialLike ? "medium" : "low",
    });
    if (commercialLike) score -= 6;
  }

  // Published/modified date signals
  // Scope datePublished to JSON-LD blocks to avoid matching JS variable names
  const jsonLdForDate = (
    ctx.html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ) || []
  ).join(" ");
  const hasPublishedDate =
    /<time[^>]*datetime/i.test(ctx.html) ||
    /datePublished/i.test(jsonLdForDate) ||
    /article:published_time/i.test(ctx.html);
  if (hasPublishedDate) {
    issues.push({
      type: "success",
      category: "eeat",
      message: "Content publication date signals found",
    });
  } else {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No published date signals",
      fix: articleLike
        ? "Add publication and modification dates on editorial content"
        : "Date signals are most important for editorial content",
      impact: "low",
    });
    if (articleLike) score -= 3;
  }

  // Contact information signals (phone, email, address)
  // Detect phone numbers via tel: links, actual phone number patterns, or "call us" CTAs.
  // Avoid matching the word "phone" alone (matches "smartphone", "headphones", etc.)
  const hasPhone =
    /(?:href=["']tel:|(?:\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|call\s*us)/i.test(
      ctx.html,
    );
  const hasEmailContact = /(?:mailto:|[\w.+-]+@[\w-]+\.[\w.-]+)/i.test(
    ctx.html,
  );
  // Detect physical address: either <address> tag, or common address patterns in content
  // (street number + street name, or ZIP/postal code patterns)
  const hasAddressTag = /<address[\s>]/i.test(ctx.html);
  // Detect physical address: street address patterns. Avoid standalone 5-digit numbers
  // as ZIP codes (too many false positives like "10000 users"). Require ZIP+4 format
  // or street address pattern for accuracy.
  const hasAddressPattern =
    /\d{1,5}\s+(?:\w+\s+){1,3}(?:street|st|avenue|ave|boulevard|blvd|road|rd|drive|dr|lane|ln|way|court|ct|place|pl|suite|ste)\b/i.test(
      ctx.html,
    ) || /\b\d{5}-\d{4}\b/.test(ctx.html);
  const hasAddress = hasAddressTag || hasAddressPattern;
  const contactSignals = [hasPhone, hasEmailContact, hasAddress].filter(
    Boolean,
  ).length;
  if (contactSignals >= 2) {
    issues.push({
      type: "success",
      category: "eeat",
      message: `Contact information signals found (${contactSignals}/3: ${[hasPhone && "phone", hasEmailContact && "email", hasAddress && "address"].filter(Boolean).join(", ")})`,
    });
  } else if (contactSignals === 0) {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No contact information signals detected",
      fix: "Add visible contact info (phone, email, address) to establish trust and credibility",
      impact: commercialLike ? "medium" : "low",
    });
    if (commercialLike) score -= 6;
  }

  // Social media profile links
  const socialPlatforms = [
    { name: "LinkedIn", pattern: /linkedin\.com/i },
    { name: "Twitter/X", pattern: /(?:twitter\.com|\/\/x\.com)/i },
    { name: "Facebook", pattern: /facebook\.com/i },
    { name: "Instagram", pattern: /instagram\.com/i },
    { name: "YouTube", pattern: /youtube\.com/i },
    { name: "GitHub", pattern: /github\.com/i },
  ];
  const foundSocials = socialPlatforms
    .filter((p) => p.pattern.test(ctx.html))
    .map((p) => p.name);
  if (foundSocials.length >= 2) {
    issues.push({
      type: "success",
      category: "eeat",
      message: `Social media presence: ${foundSocials.slice(0, 4).join(", ")}${foundSocials.length > 4 ? ` (+${foundSocials.length - 4})` : ""}`,
    });
  } else if (foundSocials.length === 0) {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No social media profile links found",
      fix: "Add links to your social media profiles (LinkedIn, Twitter, etc.) for E-E-A-T signals",
      impact: "low",
    });
    if (commercialLike) score -= 2;
  }

  // Citations/reference links to authoritative sources
  const authorityDomains =
    /(?:wikipedia\.org|\.gov(?:\/|["'\s>])|\.edu(?:\/|["'\s>])|reuters\.com|bbc\.com|nytimes\.com|scholar\.google|pubmed|doi\.org|arxiv\.org|nature\.com|sciencedirect)/i;
  const hasAuthorityCitations = authorityDomains.test(ctx.html);
  if (hasAuthorityCitations) {
    issues.push({
      type: "success",
      category: "eeat",
      message:
        "References to authoritative sources detected (supports expertise)",
    });
  }

  // Copyright notice detection
  const hasCopyright = /(?:copyright|©|\(c\)|&copy;)\s*\d{4}/i.test(ctx.html);
  if (hasCopyright) {
    issues.push({
      type: "success",
      category: "eeat",
      message: "Copyright notice with year detected",
    });
  } else {
    issues.push({
      type: "warning",
      category: "eeat",
      message: "No copyright notice found",
      fix: "Add a copyright notice (e.g., '© 2026 Company Name') for legitimacy",
      impact: "low",
    });
  }

  // Terms of service detection
  const hasTermsOfService =
    /href=["'][^"']*(?:terms|tos|terms-of-service|terms-and-conditions)/i.test(
      ctx.html,
    );
  if (hasTermsOfService) {
    issues.push({
      type: "success",
      category: "eeat",
      message: "Terms of Service link detected",
    });
  }

  return {
    score: Math.max(0, score),
    issues,
    data: {
      hasAuthorMarkup,
      trustPageLinks: foundTrustPages,
      hasPrivacyPolicy,
      trustSignalCount,
      hasPublishedDate,
    },
  };
}
