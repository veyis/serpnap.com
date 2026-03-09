/**
 * SEO Checkpoint Data — 16 Pillars, 160+ checks
 *
 * Based on the Rank #1 SEO Checkpoint Guide (March 2026).
 * Each item has:
 *   - autoCheck: whether it can be evaluated from SEOCheckResult data
 *   - evaluatorKey: unique key used by the checkpoint evaluator
 */

export type CheckpointPriority = "P0" | "P1" | "P2";
export type CheckpointStatus = "pass" | "fail" | "warning" | "manual" | "na";

export interface CheckpointItem {
  id: string;
  pillar: number;
  priority: CheckpointPriority;
  title: string;
  description?: string;
  autoCheck: boolean;
  evaluatorKey?: string; // maps to evaluator function
}

export interface CheckpointPillar {
  number: number;
  name: string;
  shortName: string;
  description: string;
  items: CheckpointItem[];
}

export interface CheckpointResult {
  status: CheckpointStatus;
  message?: string;
  detail?: string;
}

export interface EvaluatedCheckpoint extends CheckpointItem {
  result: CheckpointResult;
}

export interface PillarScore {
  pillar: CheckpointPillar;
  items: EvaluatedCheckpoint[];
  passCount: number;
  failCount: number;
  warningCount: number;
  manualCount: number;
  score: number; // 0-100
}

export interface CheckpointAuditResult {
  pillars: PillarScore[];
  overallScore: number;
  totalChecks: number;
  autoChecked: number;
  passed: number;
  failed: number;
  warnings: number;
  manual: number;
  p0Failed: number;
  p1Failed: number;
}

// ---------------------------------------------------------------------------
// PILLAR DEFINITIONS
// ---------------------------------------------------------------------------

export const SEO_CHECKPOINT_PILLARS: CheckpointPillar[] = [
  // =========================================================================
  // PILLAR 1 — Search Eligibility & Crawlability
  // =========================================================================
  {
    number: 1,
    name: "Search Eligibility & Crawlability",
    shortName: "Crawlability",
    description:
      "If Google can't crawl and index you, nothing else matters.",
    items: [
      {
        id: "1.1.1",
        pillar: 1,
        priority: "P0",
        title: "No critical pages blocked by robots.txt or noindex",
        description:
          "CSS/JS not blocked — Google must be able to render the page.",
        autoCheck: true,
        evaluatorKey: "robotsNoindex",
      },
      {
        id: "1.1.2",
        pillar: 1,
        priority: "P1",
        title: "XML sitemap submitted and valid",
        description:
          "<50 MB, <50,000 URLs per file; only indexable URLs; accurate lastmod.",
        autoCheck: true,
        evaluatorKey: "sitemapFound",
      },
      {
        id: "1.1.3",
        pillar: 1,
        priority: "P1",
        title: "Single canonical domain version with redirects",
        description:
          "One host (www vs non-www); 301 from non-preferred. No http:// accessible.",
        autoCheck: true,
        evaluatorKey: "httpsEnabled",
      },
      {
        id: "1.2.1",
        pillar: 1,
        priority: "P0",
        title: "Important links in HTML <a href> tags",
        description:
          "No JavaScript-only navigation for key content.",
        autoCheck: true,
        evaluatorKey: "htmlLinks",
      },
      {
        id: "1.2.2",
        pillar: 1,
        priority: "P1",
        title: "Zero orphan pages — every page has 2+ internal links",
        description:
          "From related hub pages.",
        autoCheck: true,
        evaluatorKey: "orphanPages",
      },
      {
        id: "1.2.3",
        pillar: 1,
        priority: "P1",
        title: "robots.txt points to sitemap and allows key crawlers",
        description:
          "Allows Googlebot, Bingbot, and AI bots.",
        autoCheck: true,
        evaluatorKey: "robotsSitemapRef",
      },
      {
        id: "1.3.1",
        pillar: 1,
        priority: "P2",
        title: "Admin, staging, and low-value URLs blocked",
        description: "Via noindex or robots.txt.",
        autoCheck: false,
      },
    ],
  },

  // =========================================================================
  // PILLAR 2 — Technical SEO & URL Health
  // =========================================================================
  {
    number: 2,
    name: "Technical SEO & URL Health",
    shortName: "Technical",
    description:
      "HTTPS, canonicalization, status codes, and rendering.",
    items: [
      {
        id: "2.1.1",
        pillar: 2,
        priority: "P0",
        title: "HTTPS sitewide with valid SSL",
        description: "HTTP 301-redirects to HTTPS.",
        autoCheck: true,
        evaluatorKey: "httpsStrict",
      },
      {
        id: "2.1.2",
        pillar: 2,
        priority: "P1",
        title: "HSTS header configured",
        description:
          "Strict-Transport-Security with max-age, includeSubDomains, preload.",
        autoCheck: true,
        evaluatorKey: "hstsHeader",
      },
      {
        id: "2.1.3",
        pillar: 2,
        priority: "P1",
        title: "No mixed content",
        description: "Zero HTTP resources loaded on HTTPS pages.",
        autoCheck: true,
        evaluatorKey: "mixedContent",
      },
      {
        id: "2.1.4",
        pillar: 2,
        priority: "P1",
        title: "Security headers present",
        description:
          "X-Content-Type-Options: nosniff, X-Frame-Options, Referrer-Policy.",
        autoCheck: true,
        evaluatorKey: "securityHeaders",
      },
      {
        id: "2.2.1",
        pillar: 2,
        priority: "P0",
        title: "One canonical URL per piece of content",
        description: "No duplicate content without canonical or redirect.",
        autoCheck: true,
        evaluatorKey: "canonicalDefined",
      },
      {
        id: "2.2.2",
        pillar: 2,
        priority: "P1",
        title: "Descriptive, clean URLs",
        description:
          "Words in URL path (e.g. /services/deck-building not /p/123).",
        autoCheck: true,
        evaluatorKey: "cleanUrls",
      },
      {
        id: "2.2.3",
        pillar: 2,
        priority: "P1",
        title: "Trailing slash consistency",
        description: "Pick one, redirect the other.",
        autoCheck: true,
        evaluatorKey: "trailingSlash",
      },
      {
        id: "2.3.1",
        pillar: 2,
        priority: "P1",
        title: "No soft 404 pages",
        description:
          "Missing pages return HTTP 404 (not 200 with error content).",
        autoCheck: true,
        evaluatorKey: "noSoft404",
      },
      {
        id: "2.3.2",
        pillar: 2,
        priority: "P1",
        title: "Zero broken internal links",
        description: "Crawl site monthly; fix or remove.",
        autoCheck: true,
        evaluatorKey: "brokenLinks",
      },
      {
        id: "2.4.1",
        pillar: 2,
        priority: "P1",
        title: "Server-side rendered or statically generated",
        description:
          "Critical content in initial HTML, not client-only JS.",
        autoCheck: true,
        evaluatorKey: "ssrContent",
      },
    ],
  },

  // =========================================================================
  // PILLAR 3 — Core Web Vitals & Page Experience
  // =========================================================================
  {
    number: 3,
    name: "Core Web Vitals & Page Experience",
    shortName: "Performance",
    description:
      "Failing CWV correlates with ~24% lower organic CTR.",
    items: [
      {
        id: "3.1.1",
        pillar: 3,
        priority: "P0",
        title: "LCP <= 2.5s on mobile",
        description: "Largest Contentful Paint for key landing pages.",
        autoCheck: true,
        evaluatorKey: "lcpGood",
      },
      {
        id: "3.1.2",
        pillar: 3,
        priority: "P0",
        title: "INP <= 200ms — no long main-thread blocking tasks",
        description: "Interaction to Next Paint responsiveness.",
        autoCheck: true,
        evaluatorKey: "inpGood",
      },
      {
        id: "3.1.3",
        pillar: 3,
        priority: "P0",
        title: "CLS < 0.1 — no unexpected layout shifts",
        description: "Cumulative Layout Shift visual stability.",
        autoCheck: true,
        evaluatorKey: "clsGood",
      },
      {
        id: "3.2.1",
        pillar: 3,
        priority: "P1",
        title: "TTFB < 800ms — fast server response",
        description: "Time to First Byte from server/CDN.",
        autoCheck: true,
        evaluatorKey: "ttfbGood",
      },
      {
        id: "3.2.2",
        pillar: 3,
        priority: "P1",
        title: "Hero image optimized (WebP/AVIF, responsive, priority)",
        description:
          "Modern format, srcset/sizes, fetchpriority=\"high\".",
        autoCheck: true,
        evaluatorKey: "heroImageOptimized",
      },
      {
        id: "3.2.3",
        pillar: 3,
        priority: "P1",
        title: "Fonts optimized with font-display",
        description:
          "font-display: optional or swap; minimal font count.",
        autoCheck: true,
        evaluatorKey: "fontDisplay",
      },
      {
        id: "3.2.4",
        pillar: 3,
        priority: "P1",
        title: "No render-blocking third-party scripts before LCP",
        autoCheck: true,
        evaluatorKey: "noRenderBlocking",
      },
      {
        id: "3.3.1",
        pillar: 3,
        priority: "P1",
        title: "Defer non-critical third-party scripts",
        description:
          "Analytics, ads, chat loaded after page interactive.",
        autoCheck: true,
        evaluatorKey: "deferredScripts",
      },
      {
        id: "3.4.1",
        pillar: 3,
        priority: "P1",
        title: "Explicit width/height on all images",
        description: "Prevents CLS from image loading.",
        autoCheck: true,
        evaluatorKey: "imageDimensions",
      },
    ],
  },

  // =========================================================================
  // PILLAR 4 — On-Page SEO & Content Quality
  // =========================================================================
  {
    number: 4,
    name: "On-Page SEO & Content Quality",
    shortName: "On-Page",
    description:
      "Title tags, meta descriptions, headings, and content quality.",
    items: [
      {
        id: "4.1.1",
        pillar: 4,
        priority: "P0",
        title: "Unique <title> tag — accurate, descriptive",
        autoCheck: true,
        evaluatorKey: "titleExists",
      },
      {
        id: "4.1.2",
        pillar: 4,
        priority: "P1",
        title: "Title length 50-60 characters",
        description: "Avoids SERP truncation.",
        autoCheck: true,
        evaluatorKey: "titleLength",
      },
      {
        id: "4.2.1",
        pillar: 4,
        priority: "P1",
        title: "Unique meta description 150-160 characters",
        description: "Contains primary keyword + CTA.",
        autoCheck: true,
        evaluatorKey: "metaDescExists",
      },
      {
        id: "4.3.1",
        pillar: 4,
        priority: "P1",
        title: "One H1 per page with primary keyword",
        autoCheck: true,
        evaluatorKey: "singleH1",
      },
      {
        id: "4.3.2",
        pillar: 4,
        priority: "P1",
        title: "Logical heading hierarchy (H1 > H2 > H3)",
        description: "No skipping levels.",
        autoCheck: true,
        evaluatorKey: "headingHierarchy",
      },
      {
        id: "4.4.1",
        pillar: 4,
        priority: "P0",
        title: "Original, substantial content matching search intent",
        description: "Not copied or thin auto-generated fluff.",
        autoCheck: true,
        evaluatorKey: "contentDepth",
      },
      {
        id: "4.4.2",
        pillar: 4,
        priority: "P1",
        title: "Readable — short paragraphs, scannable",
        description: "No grammar/spelling errors.",
        autoCheck: true,
        evaluatorKey: "readabilityGood",
      },
      {
        id: "4.6.1",
        pillar: 4,
        priority: "P1",
        title: "Descriptive anchor text on internal links",
        description:
          "Not generic 'click here'. Keyword-rich but varied.",
        autoCheck: true,
        evaluatorKey: "descriptiveAnchors",
      },
      {
        id: "4.6.2",
        pillar: 4,
        priority: "P1",
        title: "3-5+ contextual internal links per page",
        autoCheck: true,
        evaluatorKey: "internalLinkCount",
      },
    ],
  },

  // =========================================================================
  // PILLAR 5 — E-E-A-T
  // =========================================================================
  {
    number: 5,
    name: "E-E-A-T (Experience, Expertise, Authority, Trust)",
    shortName: "E-E-A-T",
    description:
      "Trust is the center — without trust, other signals carry less weight.",
    items: [
      {
        id: "5.1.1",
        pillar: 5,
        priority: "P1",
        title: "Content demonstrates first-hand experience",
        description:
          "Real project photos, case studies, process descriptions.",
        autoCheck: false,
      },
      {
        id: "5.2.1",
        pillar: 5,
        priority: "P1",
        title: "Author pages with credentials and background",
        autoCheck: true,
        evaluatorKey: "authorMarkup",
      },
      {
        id: "5.3.1",
        pillar: 5,
        priority: "P1",
        title: "Clear About Us page with company history and team",
        autoCheck: true,
        evaluatorKey: "trustPages",
      },
      {
        id: "5.4.1",
        pillar: 5,
        priority: "P0",
        title: "HTTPS, contact info, real business address verifiable",
        autoCheck: true,
        evaluatorKey: "contactInfo",
      },
      {
        id: "5.4.2",
        pillar: 5,
        priority: "P1",
        title: "Privacy policy and terms of service accessible",
        autoCheck: true,
        evaluatorKey: "privacyTerms",
      },
      {
        id: "5.4.3",
        pillar: 5,
        priority: "P1",
        title: "Trust signals — testimonials, reviews, certifications",
        autoCheck: true,
        evaluatorKey: "trustSignals",
      },
      {
        id: "5.4.4",
        pillar: 5,
        priority: "P1",
        title: "Social media presence linked",
        autoCheck: true,
        evaluatorKey: "socialLinks",
      },
    ],
  },

  // =========================================================================
  // PILLAR 6 — Search Appearance & Structured Data
  // =========================================================================
  {
    number: 6,
    name: "Search Appearance & Structured Data",
    shortName: "Schema",
    description:
      "Schema markup makes pages 3x more likely to earn AI citations.",
    items: [
      {
        id: "6.1.1",
        pillar: 6,
        priority: "P1",
        title: "Correct favicon eligible for Search display",
        autoCheck: true,
        evaluatorKey: "faviconPresent",
      },
      {
        id: "6.2.1",
        pillar: 6,
        priority: "P0",
        title: "Valid JSON-LD on every page — no errors",
        autoCheck: true,
        evaluatorKey: "jsonLdValid",
      },
      {
        id: "6.2.2",
        pillar: 6,
        priority: "P1",
        title: "Organization or WebSite schema present",
        autoCheck: true,
        evaluatorKey: "orgSchema",
      },
      {
        id: "6.2.3",
        pillar: 6,
        priority: "P1",
        title: "BreadcrumbList schema on all pages",
        description: "Matching visible breadcrumbs.",
        autoCheck: true,
        evaluatorKey: "breadcrumbSchema",
      },
      {
        id: "6.2.4",
        pillar: 6,
        priority: "P1",
        title: "Article schema on blog posts with author and dates",
        autoCheck: true,
        evaluatorKey: "articleSchema",
      },
      {
        id: "6.2.5",
        pillar: 6,
        priority: "P2",
        title: "SpeakableSpecification for voice search eligibility",
        autoCheck: false,
      },
    ],
  },

  // =========================================================================
  // PILLAR 7 — Images & Media
  // =========================================================================
  {
    number: 7,
    name: "Images & Media",
    shortName: "Images",
    description: "Optimized images with proper alt text and modern formats.",
    items: [
      {
        id: "7.1",
        pillar: 7,
        priority: "P1",
        title: "Every meaningful image has descriptive alt text",
        autoCheck: true,
        evaluatorKey: "altText",
      },
      {
        id: "7.2",
        pillar: 7,
        priority: "P1",
        title: "Modern formats: WebP/AVIF",
        description: "Never unoptimized PNG/JPG for content images.",
        autoCheck: true,
        evaluatorKey: "modernImageFormats",
      },
      {
        id: "7.3",
        pillar: 7,
        priority: "P1",
        title: "Responsive images with srcset + sizes",
        autoCheck: true,
        evaluatorKey: "responsiveImages",
      },
      {
        id: "7.4",
        pillar: 7,
        priority: "P1",
        title: "Explicit width/height on all images",
        description: "Prevents CLS.",
        autoCheck: true,
        evaluatorKey: "imageDimensionsAll",
      },
      {
        id: "7.5",
        pillar: 7,
        priority: "P1",
        title: "Lazy load below-fold, priority on above-fold hero",
        autoCheck: true,
        evaluatorKey: "lazyLoading",
      },
    ],
  },

  // =========================================================================
  // PILLAR 8 — Local SEO
  // =========================================================================
  {
    number: 8,
    name: "Local SEO",
    shortName: "Local",
    description:
      "GBP + website + citations must tell one consistent story.",
    items: [
      {
        id: "8.1.1",
        pillar: 8,
        priority: "P0",
        title: "Google Business Profile claimed and verified",
        autoCheck: false,
      },
      {
        id: "8.1.2",
        pillar: 8,
        priority: "P0",
        title: "NAP identical on GBP, website, and all citations",
        autoCheck: false,
      },
      {
        id: "8.2.1",
        pillar: 8,
        priority: "P0",
        title: "Active review generation strategy",
        autoCheck: false,
      },
      {
        id: "8.4.1",
        pillar: 8,
        priority: "P1",
        title: "LocalBusiness schema on location/contact pages",
        description: "Correct NAP, hours, areaServed, geo.",
        autoCheck: true,
        evaluatorKey: "localBusinessSchema",
      },
      {
        id: "8.4.2",
        pillar: 8,
        priority: "P1",
        title: "NAP visible in footer on every page",
        autoCheck: false,
      },
      {
        id: "8.4.3",
        pillar: 8,
        priority: "P1",
        title: "Embedded Google Map on contact/location pages",
        autoCheck: false,
      },
    ],
  },

  // =========================================================================
  // PILLAR 9 — Site Architecture & Internal Linking
  // =========================================================================
  {
    number: 9,
    name: "Site Architecture & Internal Linking",
    shortName: "Architecture",
    description:
      "Proper topic clusters, breadcrumbs, and link equity flow.",
    items: [
      {
        id: "9.1",
        pillar: 9,
        priority: "P0",
        title: "Key pages reachable within 3 clicks from homepage",
        autoCheck: true,
        evaluatorKey: "urlDepth",
      },
      {
        id: "9.2",
        pillar: 9,
        priority: "P1",
        title: "Zero orphan pages — every page has 2+ internal links",
        autoCheck: true,
        evaluatorKey: "noOrphanPages",
      },
      {
        id: "9.3",
        pillar: 9,
        priority: "P1",
        title: "Breadcrumbs on every page with BreadcrumbList schema",
        autoCheck: true,
        evaluatorKey: "breadcrumbNav",
      },
      {
        id: "9.4",
        pillar: 9,
        priority: "P1",
        title: "Descriptive, keyword-rich anchor text — varied",
        autoCheck: true,
        evaluatorKey: "anchorTextQuality",
      },
      {
        id: "9.5",
        pillar: 9,
        priority: "P2",
        title: "Related content links at bottom of pages",
        autoCheck: false,
      },
    ],
  },

  // =========================================================================
  // PILLAR 10 — Link Building & Off-Page Authority
  // =========================================================================
  {
    number: 10,
    name: "Link Building & Off-Page Authority",
    shortName: "Backlinks",
    description:
      "Quality over quantity — editorial links from relevant sites.",
    items: [
      {
        id: "10.1",
        pillar: 10,
        priority: "P1",
        title: "Links from sites with real organic traffic",
        autoCheck: false,
      },
      {
        id: "10.2",
        pillar: 10,
        priority: "P1",
        title: "Diverse referring domains with topical relevance",
        autoCheck: false,
      },
      {
        id: "10.3.1",
        pillar: 10,
        priority: "P0",
        title: "No paid links passing PageRank",
        description: "Use rel=\"sponsored\" if paid.",
        autoCheck: false,
      },
      {
        id: "10.3.2",
        pillar: 10,
        priority: "P0",
        title: "No link schemes, PBNs, or reciprocal exchanges",
        autoCheck: false,
      },
    ],
  },

  // =========================================================================
  // PILLAR 11 — Accessibility (WCAG 2.2)
  // =========================================================================
  {
    number: 11,
    name: "Accessibility (WCAG 2.2)",
    shortName: "A11y",
    description:
      "Overlaps heavily with SEO — headings, alt text, semantic HTML.",
    items: [
      {
        id: "11.1.1",
        pillar: 11,
        priority: "P1",
        title: "All meaningful images have descriptive alt text",
        autoCheck: true,
        evaluatorKey: "a11yAltText",
      },
      {
        id: "11.1.2",
        pillar: 11,
        priority: "P1",
        title: "Color contrast >= 4.5:1 (WCAG AA)",
        autoCheck: true,
        evaluatorKey: "colorContrast",
      },
      {
        id: "11.2.1",
        pillar: 11,
        priority: "P1",
        title: "All functionality accessible via keyboard",
        description: "Visible focus indicators; no keyboard traps.",
        autoCheck: true,
        evaluatorKey: "keyboardNav",
      },
      {
        id: "11.3.1",
        pillar: 11,
        priority: "P1",
        title: "lang attribute on <html> element",
        autoCheck: true,
        evaluatorKey: "langAttribute",
      },
      {
        id: "11.3.2",
        pillar: 11,
        priority: "P1",
        title: "Form labels associated with inputs",
        autoCheck: true,
        evaluatorKey: "formLabels",
      },
      {
        id: "11.2.2",
        pillar: 11,
        priority: "P1",
        title: "Skip to main content link",
        autoCheck: true,
        evaluatorKey: "skipLink",
      },
      {
        id: "11.3.3",
        pillar: 11,
        priority: "P2",
        title: "ARIA landmarks present and correct",
        autoCheck: true,
        evaluatorKey: "ariaLandmarks",
      },
    ],
  },

  // =========================================================================
  // PILLAR 12 — UX & Conversion Signals
  // =========================================================================
  {
    number: 12,
    name: "UX & Conversion Signals",
    shortName: "UX",
    description:
      "Pogo-sticking (returning to search) indicates poor result quality.",
    items: [
      {
        id: "12.1",
        pillar: 12,
        priority: "P0",
        title: "Mobile-friendly — readable font >= 16px, no horizontal scroll",
        autoCheck: true,
        evaluatorKey: "mobileFriendly",
      },
      {
        id: "12.2",
        pillar: 12,
        priority: "P1",
        title: "Clear primary CTA on every landing page",
        autoCheck: true,
        evaluatorKey: "ctaPresent",
      },
      {
        id: "12.3",
        pillar: 12,
        priority: "P1",
        title: "Above-the-fold value — user sees what they need",
        autoCheck: false,
      },
      {
        id: "12.4",
        pillar: 12,
        priority: "P2",
        title: "Phone number clickable (tel: link) on mobile",
        autoCheck: true,
        evaluatorKey: "telLink",
      },
    ],
  },

  // =========================================================================
  // PILLAR 13 — Content Freshness & Publishing Cadence
  // =========================================================================
  {
    number: 13,
    name: "Content Freshness & Publishing Cadence",
    shortName: "Freshness",
    description:
      "Freshness is ~6% of Google's algorithm. +4.6 positions when updated.",
    items: [
      {
        id: "13.1",
        pillar: 13,
        priority: "P1",
        title: "Content freshness signals present",
        description:
          "Publish date and 'last updated' date visible on content pages.",
        autoCheck: true,
        evaluatorKey: "freshnessSignals",
      },
      {
        id: "13.2",
        pillar: 13,
        priority: "P1",
        title: "Blog publishing cadence: minimum 2-4 posts/month",
        autoCheck: false,
      },
      {
        id: "13.3",
        pillar: 13,
        priority: "P1",
        title: "Top landing pages reviewed and updated annually",
        autoCheck: false,
      },
      {
        id: "13.4",
        pillar: 13,
        priority: "P2",
        title: "Content audit performed quarterly",
        description:
          "Consolidate thin pages, update or remove outdated posts.",
        autoCheck: false,
      },
    ],
  },

  // =========================================================================
  // PILLAR 14 — Security & Trust Infrastructure
  // =========================================================================
  {
    number: 14,
    name: "Security & Trust Infrastructure",
    shortName: "Security",
    description: "HTTPS, security headers, and trust signals.",
    items: [
      {
        id: "14.1",
        pillar: 14,
        priority: "P0",
        title: "HTTPS everywhere",
        autoCheck: true,
        evaluatorKey: "httpsEverywhere",
      },
      {
        id: "14.2",
        pillar: 14,
        priority: "P1",
        title: "Security headers: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy",
        autoCheck: true,
        evaluatorKey: "allSecurityHeaders",
      },
      {
        id: "14.3",
        pillar: 14,
        priority: "P1",
        title: "Privacy policy accessible and linked from footer",
        autoCheck: true,
        evaluatorKey: "privacyPolicy",
      },
      {
        id: "14.4",
        pillar: 14,
        priority: "P1",
        title: "Contact information accessible from every page",
        description: "Real address, phone, email.",
        autoCheck: true,
        evaluatorKey: "contactAccessible",
      },
      {
        id: "14.5",
        pillar: 14,
        priority: "P1",
        title: "Terms of service page",
        autoCheck: true,
        evaluatorKey: "termsPage",
      },
    ],
  },

  // =========================================================================
  // PILLAR 15 — AI Search Optimization (GEO)
  // =========================================================================
  {
    number: 15,
    name: "AI Search Optimization (GEO)",
    shortName: "AI/GEO",
    description:
      "47% of AI Overview citations come from pages below position #5.",
    items: [
      {
        id: "15.1.1",
        pillar: 15,
        priority: "P1",
        title: "Clear structure with extractable answers",
        description:
          "Direct answers under headings — AI pulls heading + paragraph.",
        autoCheck: true,
        evaluatorKey: "aiExtractable",
      },
      {
        id: "15.1.2",
        pillar: 15,
        priority: "P1",
        title: "Semantic completeness — full topic coverage",
        description:
          "Content scoring 8.5/10+ is 4.2x more likely to be cited.",
        autoCheck: true,
        evaluatorKey: "semanticDepth",
      },
      {
        id: "15.2.1",
        pillar: 15,
        priority: "P1",
        title: "Comprehensive JSON-LD schema for AI visibility",
        description:
          "Pages with schema are 3x more likely to earn AI citations.",
        autoCheck: true,
        evaluatorKey: "schemaForAI",
      },
      {
        id: "15.3.1",
        pillar: 15,
        priority: "P1",
        title: "robots.txt allows AI crawlers",
        description:
          "GPTBot, ChatGPT-User, Google-Extended, ClaudeBot, PerplexityBot.",
        autoCheck: false,
      },
      {
        id: "15.3.2",
        pillar: 15,
        priority: "P1",
        title: "llms.txt file at site root",
        description: "Structured summary for AI models.",
        autoCheck: false,
      },
      {
        id: "15.4.1",
        pillar: 15,
        priority: "P1",
        title: "sameAs in Organization schema lists verified profiles",
        autoCheck: true,
        evaluatorKey: "sameAsPresent",
      },
    ],
  },

  // =========================================================================
  // PILLAR 16 — Monitoring & Maintenance
  // =========================================================================
  {
    number: 16,
    name: "Monitoring & Maintenance",
    shortName: "Monitoring",
    description:
      "Sites without monitoring see ~12% quarterly traffic decline.",
    items: [
      {
        id: "16.1.1",
        pillar: 16,
        priority: "P0",
        title: "Google Search Console verified and monitored weekly",
        autoCheck: false,
      },
      {
        id: "16.1.2",
        pillar: 16,
        priority: "P1",
        title: "Analytics (GA4 or equivalent) with conversions tracked",
        autoCheck: true,
        evaluatorKey: "analyticsPresent",
      },
      {
        id: "16.1.3",
        pillar: 16,
        priority: "P1",
        title: "Rank tracking for top 20 target keywords",
        autoCheck: false,
      },
      {
        id: "16.2.1",
        pillar: 16,
        priority: "P1",
        title: "Full audit run quarterly using this checklist",
        autoCheck: false,
      },
    ],
  },
];

// Quick lookup helpers
export function getTotalCheckpoints(): number {
  return SEO_CHECKPOINT_PILLARS.reduce(
    (sum, p) => sum + p.items.length,
    0,
  );
}

export function getAutoCheckableCount(): number {
  return SEO_CHECKPOINT_PILLARS.reduce(
    (sum, p) => sum + p.items.filter((i) => i.autoCheck).length,
    0,
  );
}
