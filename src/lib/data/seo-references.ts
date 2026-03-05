/**
 * Official source references for each SEO checker category.
 * Shown via info icons in the SEO checker UI so users can verify our checks.
 */
export const SEO_CATEGORY_REFERENCES = {
  technical: [
    {
      title: "Google Search Essentials",
      url: "https://developers.google.com/search/docs/essentials",
    },
    {
      title: "Mobile-First Indexing",
      url: "https://developers.google.com/search/docs/crawling-indexing/mobile-sites-mobile-first-indexing",
    },
    {
      title: "HTTPS as Ranking Signal",
      url: "https://developers.google.com/search/blog/2014/08/https-as-ranking-signal",
    },
    {
      title: "Robots.txt (RFC 9309)",
      url: "https://www.rfc-editor.org/rfc/rfc9309",
    },
    {
      title: "Preconnect & DNS-Prefetch",
      url: "https://web.dev/articles/preconnect-and-dns-prefetch",
    },
    {
      title: "Lighthouse: Total Network Payload",
      url: "https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight",
    },
  ],
  meta: [
    {
      title: "Title Link Best Practices",
      url: "https://developers.google.com/search/docs/appearance/title-link",
    },
    {
      title: "Meta Description Snippets",
      url: "https://developers.google.com/search/docs/appearance/snippet",
    },
    {
      title: "Canonical URLs",
      url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "Open Graph Protocol",
      url: "https://ogp.me/",
    },
  ],
  content: [
    {
      title: "Creating Helpful Content",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "SEO Starter Guide: Headings",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide#use-headings",
    },
    {
      title: "Crawlable Links",
      url: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
    },
  ],
  structured: [
    {
      title: "Structured Data Overview",
      url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    },
    {
      title: "Rich Results Gallery",
      url: "https://developers.google.com/search/docs/appearance/structured-data/search-gallery",
    },
    {
      title: "Structured Data Policies",
      url: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
    },
  ],
  accessibility: [
    {
      title: "WCAG 2.2 Guidelines",
      url: "https://www.w3.org/TR/WCAG22/",
    },
    {
      title: "Lighthouse Accessibility Audits",
      url: "https://developer.chrome.com/docs/lighthouse/accessibility",
    },
    {
      title: "Lighthouse Scoring (Weights)",
      url: "https://developer.chrome.com/docs/lighthouse/accessibility/scoring",
    },
  ],
  international: [
    {
      title: "Hreflang Specification",
      url: "https://developers.google.com/search/docs/specialty/international/localized-versions",
    },
    {
      title: "Managing Multi-Regional Sites",
      url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
    },
  ],
  eeat: [
    {
      title: "Creating Helpful Content (E-E-A-T)",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Quality Rater Guidelines (PDF)",
      url: "https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf",
    },
  ],
  mobile: [
    {
      title: "Mobile-First Indexing",
      url: "https://developers.google.com/search/docs/crawling-indexing/mobile-sites-mobile-first-indexing",
    },
    {
      title: "Core Web Vitals",
      url: "https://web.dev/articles/vitals",
    },
    {
      title: "INP Optimization",
      url: "https://web.dev/articles/inp",
    },
  ],
} as const satisfies Record<
  string,
  ReadonlyArray<{ title: string; url: string }>
>;

type SEOCategoryReferenceKey = keyof typeof SEO_CATEGORY_REFERENCES;

/** Map IssuesAccordion category labels to reference keys */
export const CATEGORY_LABEL_TO_KEY: Partial<
  Record<string, SEOCategoryReferenceKey>
> = {
  Technical: "technical",
  "Meta Tags": "meta",
  Content: "content",
  Schema: "structured",
  Accessibility: "accessibility",
  International: "international",
  "E-E-A-T": "eeat",
  Mobile: "mobile",
};
