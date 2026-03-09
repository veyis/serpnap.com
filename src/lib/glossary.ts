/**
 * SEO Glossary Data
 *
 * Each term generates its own page at /glossary/[slug].
 * Terms link to relevant tools for internal linking equity.
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  relatedTools?: { href: string; label: string }[];
  relatedTerms?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "what-is-seo",
    term: "SEO (Search Engine Optimization)",
    shortDefinition: "The practice of optimizing websites to rank higher in search engine results and drive organic traffic.",
    fullDefinition: "Search Engine Optimization (SEO) is the process of improving your website's visibility in organic (non-paid) search engine results. It involves optimizing technical infrastructure, content quality, and off-site signals to help search engines understand and rank your pages. Modern SEO encompasses technical SEO, on-page optimization, content strategy, link building, and increasingly, Generative Engine Optimization (GEO) for AI-powered search engines.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "Free SEO Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-technical-seo", "what-is-on-page-seo", "what-is-eeat"],
  },
  {
    slug: "what-is-technical-seo",
    term: "Technical SEO",
    shortDefinition: "The practice of optimizing a website's infrastructure so search engines can crawl, index, and render it effectively.",
    fullDefinition: "Technical SEO focuses on the backend structure of your website — how search engine bots interact with your pages. It includes crawlability (can Google find your pages?), indexability (can Google add them to its index?), renderability (can Google see your content?), and performance (how fast do pages load?). Key areas include robots.txt configuration, XML sitemaps, canonical tags, site speed, Core Web Vitals, mobile-friendliness, structured data, and HTTPS security. Technical SEO is the foundation that all other SEO efforts build upon — without it, even great content won't rank.",
    relatedTools: [
      { href: "/tools/technical-audit", label: "Technical Audit" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
      { href: "/tools/robots-txt-generator", label: "Robots.txt Generator" },
    ],
    relatedTerms: ["what-is-crawlability", "what-is-core-web-vitals", "what-is-robots-txt"],
  },
  {
    slug: "what-is-on-page-seo",
    term: "On-Page SEO",
    shortDefinition: "Optimizing individual web pages — content, HTML tags, headings, and internal links — to rank higher in search results.",
    fullDefinition: "On-page SEO refers to optimizations you make directly on your web pages to improve their search engine rankings. This includes title tags, meta descriptions, heading structure (H1-H6), keyword usage, content quality, image alt text, internal linking, URL structure, and user experience signals. Unlike technical SEO (which focuses on site infrastructure) or off-page SEO (which focuses on external signals like backlinks), on-page SEO is about making each individual page as relevant and valuable as possible for its target keywords.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
      { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
    ],
    relatedTerms: ["what-is-meta-description", "what-is-title-tag", "what-is-keyword-density"],
  },
  {
    slug: "what-is-core-web-vitals",
    term: "Core Web Vitals",
    shortDefinition: "Three Google metrics — LCP, CLS, and INP — that measure loading speed, visual stability, and interactivity.",
    fullDefinition: "Core Web Vitals are a set of three specific metrics that Google uses to evaluate user experience on web pages. LCP (Largest Contentful Paint) measures loading performance — the time it takes for the largest content element to become visible. Target: under 2.5 seconds. CLS (Cumulative Layout Shift) measures visual stability — how much page content shifts unexpectedly during loading. Target: under 0.1. INP (Interaction to Next Paint) measures responsiveness — the delay between user interaction and the browser's visual response. Target: under 200ms. Since 2021, Core Web Vitals are a confirmed Google ranking factor.",
    relatedTools: [
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-lcp", "what-is-cls", "what-is-inp"],
  },
  {
    slug: "what-is-lcp",
    term: "LCP (Largest Contentful Paint)",
    shortDefinition: "A Core Web Vital that measures how long it takes for the largest visible content element to render. Good: under 2.5s.",
    fullDefinition: "Largest Contentful Paint (LCP) measures perceived loading speed by marking the point in the page load timeline when the main content has likely loaded. Specifically, it records the render time of the largest image, video, or text block visible within the viewport. A good LCP score is 2.5 seconds or less. Common causes of poor LCP include slow server response times, render-blocking JavaScript and CSS, slow resource load times, and client-side rendering. Optimizations include using a CDN, preloading critical resources, optimizing images (WebP/AVIF), and implementing efficient CSS delivery.",
    relatedTools: [
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
    ],
    relatedTerms: ["what-is-core-web-vitals", "what-is-cls", "what-is-inp"],
  },
  {
    slug: "what-is-cls",
    term: "CLS (Cumulative Layout Shift)",
    shortDefinition: "A Core Web Vital measuring visual stability — how much page content shifts unexpectedly during loading. Good: under 0.1.",
    fullDefinition: "Cumulative Layout Shift (CLS) measures the total of all unexpected layout shifts that occur during the entire lifespan of a page. A layout shift happens when a visible element changes its position from one rendered frame to the next without user interaction — for example, when an ad loads and pushes content down. A good CLS score is 0.1 or less. Common causes include images without dimensions, dynamically injected content, web fonts causing FOIT/FOUT, and ads or embeds without reserved space. Fix CLS by always setting width/height attributes on images and videos, reserving space for dynamic content, and preloading fonts.",
    relatedTools: [
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
    ],
    relatedTerms: ["what-is-core-web-vitals", "what-is-lcp", "what-is-inp"],
  },
  {
    slug: "what-is-inp",
    term: "INP (Interaction to Next Paint)",
    shortDefinition: "A Core Web Vital measuring responsiveness — the delay between user interaction and visual response. Good: under 200ms.",
    fullDefinition: "Interaction to Next Paint (INP) replaced First Input Delay (FID) as a Core Web Vital in March 2024. While FID only measured the delay of the first interaction, INP measures the latency of all interactions throughout the page's lifecycle and reports the worst one (with outliers excluded). A good INP score is 200 milliseconds or less. Poor INP is usually caused by heavy JavaScript execution, long tasks blocking the main thread, or excessive DOM size. Optimize INP by breaking up long tasks, using web workers for heavy computation, reducing DOM size, and deferring non-critical JavaScript.",
    relatedTools: [
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
    ],
    relatedTerms: ["what-is-core-web-vitals", "what-is-lcp", "what-is-cls"],
  },
  {
    slug: "what-is-meta-description",
    term: "Meta Description",
    shortDefinition: "An HTML tag that provides a brief summary of a page's content, displayed in search engine results below the title.",
    fullDefinition: "A meta description is an HTML attribute that provides a concise summary of a web page's content. It appears in search engine results pages (SERPs) below the title tag and URL. While meta descriptions don't directly impact rankings, they significantly influence click-through rates (CTR). A well-written meta description can increase CTR by 20-30%. Best practices: keep it between 120-160 characters, include your target keyword naturally, write a compelling value proposition, and include a call-to-action when appropriate. Google may override your meta description with content it considers more relevant to the search query.",
    relatedTools: [
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-title-tag", "what-is-on-page-seo"],
  },
  {
    slug: "what-is-title-tag",
    term: "Title Tag",
    shortDefinition: "An HTML element that specifies the title of a web page, shown as the clickable headline in search results.",
    fullDefinition: "The title tag is an HTML element (<title>) that defines the title of a web page. It appears as the clickable headline in search engine results and in the browser tab. Title tags are one of the most important on-page SEO elements — they directly influence both rankings and click-through rates. Best practices: keep titles between 30-60 characters, place your primary keyword near the beginning, include your brand name at the end (separated by | or —), make each page's title unique, and write for humans first (be compelling, not just keyword-stuffed). Google may rewrite your title tag if it determines a better match for the search query.",
    relatedTools: [
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
      { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
    ],
    relatedTerms: ["what-is-meta-description", "what-is-on-page-seo"],
  },
  {
    slug: "what-is-schema-markup",
    term: "Schema Markup (Structured Data)",
    shortDefinition: "Code added to your HTML that helps search engines understand your content and display rich results.",
    fullDefinition: "Schema markup is structured data vocabulary (from Schema.org) that you add to your web pages to help search engines understand the meaning of your content. When implemented in JSON-LD format (Google's recommended approach), it enables rich results in search — star ratings, FAQs, how-to steps, business hours, product prices, and more. Pages with rich results see 20-30% higher click-through rates on average. Common schema types include LocalBusiness, FAQPage, HowTo, Product, Article, Organization, and BreadcrumbList. Use Google's Rich Results Test to validate your markup after implementation.",
    relatedTools: [
      { href: "/tools/schema-generator", label: "Schema Generator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-json-ld", "what-is-rich-snippets"],
  },
  {
    slug: "what-is-json-ld",
    term: "JSON-LD",
    shortDefinition: "Google's recommended format for implementing structured data using JavaScript Object Notation for Linked Data.",
    fullDefinition: "JSON-LD (JavaScript Object Notation for Linked Data) is a method of encoding structured data using JSON syntax. Google recommends JSON-LD over other structured data formats (Microdata, RDFa) because it can be added to a page's <head> section without modifying the HTML content. This makes it easier to implement and maintain. JSON-LD uses @context and @type properties to define the vocabulary and entity type, then lists properties relevant to that type. For example, a LocalBusiness schema includes name, address, phone, and opening hours. Multiple schemas can be combined using @graph to describe multiple entities on a single page.",
    relatedTools: [
      { href: "/tools/schema-generator", label: "Schema Generator" },
    ],
    relatedTerms: ["what-is-schema-markup", "what-is-rich-snippets"],
  },
  {
    slug: "what-is-rich-snippets",
    term: "Rich Snippets (Rich Results)",
    shortDefinition: "Enhanced search results that display additional information like ratings, images, prices, or FAQs beyond the standard title and description.",
    fullDefinition: "Rich snippets (now called rich results by Google) are enhanced search result listings that display additional visual information beyond the standard title, URL, and description. They are generated from structured data (schema markup) on your pages. Examples include star ratings for reviews, recipe cards with cooking time and calories, FAQ dropdowns, how-to steps, product prices and availability, and event dates. Rich results can increase your click-through rate by 35% on average. Not all structured data qualifies for rich results — Google has specific guidelines for each type. Use the Rich Results Test to check eligibility.",
    relatedTools: [
      { href: "/tools/schema-generator", label: "Schema Generator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-schema-markup", "what-is-json-ld"],
  },
  {
    slug: "what-is-robots-txt",
    term: "Robots.txt",
    shortDefinition: "A text file at your site's root that tells search engine crawlers which pages they can and cannot access.",
    fullDefinition: "Robots.txt is a plain text file placed in your website's root directory (e.g., example.com/robots.txt) that provides instructions to web crawlers about which parts of your site they should or shouldn't access. It uses directives like User-agent (which crawler), Allow (permitted paths), Disallow (blocked paths), and Sitemap (location of your XML sitemap). Important: robots.txt blocks crawling, not indexing. A page blocked by robots.txt can still appear in search results if other pages link to it. For pages you want excluded from search results entirely, use the noindex meta tag instead. Common uses include blocking admin areas, staging environments, duplicate content, and specific AI bots.",
    relatedTools: [
      { href: "/tools/robots-txt-generator", label: "Robots.txt Generator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-crawlability", "what-is-xml-sitemap"],
  },
  {
    slug: "what-is-xml-sitemap",
    term: "XML Sitemap",
    shortDefinition: "A file that lists all important URLs on your website, helping search engines discover and crawl your pages efficiently.",
    fullDefinition: "An XML sitemap is a file (usually at /sitemap.xml) that lists the URLs on your website that you want search engines to crawl and index. It includes metadata about each URL — when it was last modified, how frequently it changes, and its relative priority. While not required for ranking, sitemaps help search engines discover pages faster, especially on large sites, new sites, or sites with complex navigation. Best practices: include only canonical, indexable URLs; exclude noindex pages, redirects, and duplicates; keep under 50,000 URLs per sitemap (use a sitemap index for larger sites); submit to Google Search Console; and update automatically when content changes.",
    relatedTools: [
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
    ],
    relatedTerms: ["what-is-robots-txt", "what-is-crawlability"],
  },
  {
    slug: "what-is-crawlability",
    term: "Crawlability",
    shortDefinition: "A measure of how easily search engine bots can access and navigate your website's pages.",
    fullDefinition: "Crawlability refers to a search engine's ability to access and navigate through the pages on your website. If a page isn't crawlable, Google can't read its content and it won't appear in search results. Crawlability depends on several factors: your robots.txt configuration, server availability, URL structure, internal linking, redirect chains, and crawl budget. Common crawlability issues include pages blocked by robots.txt, broken internal links (404 errors), redirect loops, server errors (500), extremely slow page responses, and orphan pages (not linked from anywhere). Tools like Google Search Console's Coverage report help identify crawlability problems.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/redirect-checker", label: "Redirect Checker" },
      { href: "/tools/robots-txt-generator", label: "Robots.txt Generator" },
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
    ],
    relatedTerms: ["what-is-technical-seo", "what-is-robots-txt", "what-is-xml-sitemap"],
  },
  {
    slug: "what-is-keyword-density",
    term: "Keyword Density",
    shortDefinition: "The percentage of times a keyword appears in content relative to the total word count.",
    fullDefinition: "Keyword density is the percentage of times a target keyword or phrase appears on a web page compared to the total number of words. For example, if a 1,000-word article uses a keyword 15 times, the keyword density is 1.5%. While there's no officially confirmed 'ideal' density, SEO best practices suggest keeping primary keyword density between 1-3%. Going above 3-4% risks triggering Google's over-optimization (keyword stuffing) filters, which can result in lower rankings or penalties. Modern SEO focuses less on exact keyword density and more on natural language, semantic relevance, and topical coverage. Use related terms and synonyms rather than repeating the exact same phrase.",
    relatedTools: [
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
    ],
    relatedTerms: ["what-is-on-page-seo", "what-is-keyword-stuffing"],
  },
  {
    slug: "what-is-keyword-stuffing",
    term: "Keyword Stuffing",
    shortDefinition: "The practice of overloading a page with keywords in an attempt to manipulate rankings — a violation of Google's spam policies.",
    fullDefinition: "Keyword stuffing is the practice of loading a webpage with excessive keywords or numbers in an attempt to manipulate a site's ranking in search results. Google explicitly identifies keyword stuffing as a spam policy violation that can result in ranking penalties or complete removal from search results. Examples include: unnaturally repeating words or phrases, adding keywords that are out of context, inserting blocks of keywords as hidden text, and using irrelevant keywords to attract traffic. Modern search algorithms use natural language processing (NLP) to understand content, making keyword stuffing both ineffective and risky. Focus on writing naturally for your audience instead.",
    relatedTools: [
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-keyword-density", "what-is-on-page-seo"],
  },
  {
    slug: "what-is-eeat",
    term: "E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)",
    shortDefinition: "Google's quality criteria for evaluating content creators and websites — especially important for YMYL topics.",
    fullDefinition: "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It's a framework from Google's Search Quality Rater Guidelines that human quality raters use to evaluate content quality. While not a direct ranking algorithm, E-E-A-T signals strongly correlate with rankings, especially for YMYL (Your Money or Your Life) topics like health, finance, and legal content. Experience means demonstrating first-hand experience with the topic. Expertise means having deep knowledge. Authoritativeness means being recognized as a go-to source. Trustworthiness means being accurate, honest, and safe. Build E-E-A-T by showcasing author credentials, citing authoritative sources, maintaining accuracy, and earning quality backlinks.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/neural-audit", label: "Neural Audit" },
    ],
    relatedTerms: ["what-is-seo", "what-is-geo"],
  },
  {
    slug: "what-is-geo",
    term: "GEO (Generative Engine Optimization)",
    shortDefinition: "The practice of optimizing content to be cited and recommended by AI-powered search engines like ChatGPT, Gemini, and Perplexity.",
    fullDefinition: "Generative Engine Optimization (GEO) is an emerging discipline focused on optimizing your content to be discovered, cited, and recommended by AI-powered search engines and large language models (LLMs). Unlike traditional SEO which optimizes for Google's algorithm, GEO focuses on ensuring AI models understand your brand's authority, entity relationships, and topical expertise. Key GEO tactics include: high-density structured data (JSON-LD), building entity authority across the web, creating original research and data that AI models cite, optimizing for conversational queries, and ensuring your content appears in AI Overviews. As AI search adoption grows, GEO is becoming as important as traditional SEO.",
    relatedTools: [
      { href: "/tools/neural-audit", label: "Neural Audit" },
      { href: "/tools/schema-generator", label: "Schema Generator" },
    ],
    relatedTerms: ["what-is-eeat", "what-is-seo", "what-is-schema-markup"],
  },
  {
    slug: "what-is-redirect-chain",
    term: "Redirect Chain",
    shortDefinition: "A series of multiple redirects between an initial URL and the final destination, causing SEO and performance issues.",
    fullDefinition: "A redirect chain occurs when a URL redirects to another URL, which then redirects to yet another URL before reaching the final destination. For example: page-a → page-b → page-c → page-d. Each hop in the chain loses some link equity (ranking power) and adds latency (100-500ms per redirect). Google will follow up to 10 redirect hops but recommends keeping chains to a single hop. Redirect chains commonly arise from site migrations, URL structure changes, or accumulated redirects over time. To fix them, update all redirects to point directly to the final destination URL. This preserves maximum link equity and improves page load speed.",
    relatedTools: [
      { href: "/tools/redirect-checker", label: "Redirect Checker" },
    ],
    relatedTerms: ["what-is-301-redirect", "what-is-crawlability"],
  },
  {
    slug: "what-is-301-redirect",
    term: "301 Redirect",
    shortDefinition: "A permanent redirect that tells search engines a page has moved to a new URL and to transfer all ranking signals to the new location.",
    fullDefinition: "A 301 redirect is an HTTP status code that indicates a page has permanently moved to a new URL. When properly implemented, it tells search engines to transfer all link equity (ranking power), indexing signals, and canonical status from the old URL to the new one. This is the recommended redirect type for permanent URL changes, site migrations, and domain changes. Compare with 302 redirect (temporary): a 302 tells search engines the move is temporary and to keep the original URL indexed. Using 302 when you mean 301 can prevent link equity from passing. Best practice: use 301 for all permanent moves, and always redirect to the final destination directly (avoid chains).",
    relatedTools: [
      { href: "/tools/redirect-checker", label: "Redirect Checker" },
    ],
    relatedTerms: ["what-is-redirect-chain", "what-is-crawlability"],
  },
  {
    slug: "what-is-canonical-url",
    term: "Canonical URL",
    shortDefinition: "An HTML element that tells search engines which version of a page is the 'master' copy when duplicate or similar content exists.",
    fullDefinition: "A canonical URL (specified via the rel='canonical' link element) tells search engines which version of a page should be treated as the authoritative source when multiple URLs contain identical or very similar content. This consolidates link equity and prevents duplicate content issues. For example, if the same product page is accessible at /products/shoes, /products/shoes?color=blue, and /category/shoes, you'd set the canonical to /products/shoes. Search engines will then consolidate ranking signals to that URL. Self-referencing canonicals (a page pointing to itself) are considered best practice. Canonical tags are suggestions, not directives — Google may ignore them if they seem incorrect.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-on-page-seo", "what-is-technical-seo"],
  },
  {
    slug: "what-is-backlink",
    term: "Backlink",
    shortDefinition: "A link from another website pointing to your site — one of the strongest ranking signals in Google's algorithm.",
    fullDefinition: "A backlink (also called an inbound link or incoming link) is a hyperlink from one website to another. Google treats backlinks as votes of confidence — when a reputable site links to your page, it signals that your content is valuable and trustworthy. Not all backlinks are equal: links from high-authority, topically relevant sites carry far more weight than links from low-quality or unrelated sites. Key backlink metrics include Domain Authority/Rating, relevance, anchor text, and follow vs. nofollow status. Building quality backlinks through original research, data, and valuable content remains one of the most effective SEO strategies.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-seo", "what-is-domain-authority"],
  },
  {
    slug: "what-is-domain-authority",
    term: "Domain Authority (DA/DR)",
    shortDefinition: "A third-party metric (by Moz/Ahrefs) predicting how likely a domain is to rank in search results, scored 1-100.",
    fullDefinition: "Domain Authority (DA) by Moz and Domain Rating (DR) by Ahrefs are third-party metrics that predict a website's ability to rank in search engine results. Scored on a scale of 1-100, higher scores indicate greater ranking potential. These metrics are based primarily on the quantity and quality of backlinks pointing to a domain. Important: DA/DR are NOT Google metrics — Google does not use them in its ranking algorithm. They are useful as relative comparison tools when evaluating link building opportunities or competitor strength, but should not be treated as absolute measures of SEO success. Focus on earning quality, relevant backlinks rather than chasing DA/DR numbers.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-backlink", "what-is-seo"],
  },
  {
    slug: "what-is-serp",
    term: "SERP (Search Engine Results Page)",
    shortDefinition: "The page displayed by a search engine in response to a query, containing organic results, ads, featured snippets, and more.",
    fullDefinition: "A SERP (Search Engine Results Page) is the page Google or other search engines display after a user enters a search query. Modern SERPs include far more than the traditional 10 blue links. Common SERP features include: organic results (standard listings), paid ads (Google Ads), featured snippets (position zero), Knowledge Panels, People Also Ask boxes, local pack (map results), image/video carousels, AI Overviews, shopping results, and sitelinks. Understanding SERP features for your target keywords is essential for SEO strategy — the presence of certain features may change what type of content you need to create to capture visibility.",
    relatedTools: [
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
      { href: "/tools/schema-generator", label: "Schema Generator" },
    ],
    relatedTerms: ["what-is-rich-snippets", "what-is-seo"],
  },
  {
    slug: "what-is-alt-text",
    term: "Alt Text (Alternative Text)",
    shortDefinition: "A text description added to images in HTML that helps search engines understand image content and improves accessibility.",
    fullDefinition: "Alt text (alternative text) is an HTML attribute added to image tags that describes the image content. It serves two critical purposes: accessibility (screen readers read alt text aloud for visually impaired users) and SEO (search engines use alt text to understand what an image depicts). Good alt text is concise, descriptive, and naturally includes relevant keywords when appropriate. Best practices: describe the image content accurately, keep it under 125 characters, avoid starting with 'image of' or 'picture of', include target keywords naturally (not forced), and leave decorative images with empty alt attributes (alt=\"\"). Alt text is also displayed when images fail to load.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-on-page-seo", "what-is-seo"],
  },
  {
    slug: "what-is-internal-linking",
    term: "Internal Linking",
    shortDefinition: "Links between pages on the same website that distribute ranking power and help users and search engines navigate your content.",
    fullDefinition: "Internal linking is the practice of linking from one page on your website to another page on the same website. Internal links serve three key functions: they help search engines discover and crawl your pages, they distribute PageRank (link equity) throughout your site, and they help users navigate to related content. Strategic internal linking creates topical clusters — groups of related pages connected through contextual links that signal topical authority to Google. Best practices include using descriptive anchor text (not 'click here'), linking from high-authority pages to important content, creating hub-and-spoke content architectures, and ensuring every page is reachable within 3 clicks from the homepage.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-on-page-seo", "what-is-crawlability"],
  },
  {
    slug: "what-is-crawl-budget",
    term: "Crawl Budget",
    shortDefinition: "The number of pages a search engine will crawl on your site within a given timeframe, determined by crawl capacity and demand.",
    fullDefinition: "Crawl budget is the number of URLs Googlebot will crawl on your site within a given time period. It's determined by two factors: crawl rate limit (how fast Google can crawl without overloading your server) and crawl demand (how much Google wants to crawl based on your site's popularity and freshness). For most small-to-medium sites (under 10,000 pages), crawl budget isn't a concern — Google will crawl all your pages regularly. It becomes important for large sites with millions of pages, sites with significant duplicate content, or sites with many low-quality pages. Optimize crawl budget by eliminating duplicate content, fixing broken pages, using robots.txt to block unimportant pages, and maintaining a clean XML sitemap.",
    relatedTools: [
      { href: "/tools/robots-txt-generator", label: "Robots.txt Generator" },
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
    ],
    relatedTerms: ["what-is-crawlability", "what-is-technical-seo"],
  },
  {
    slug: "what-is-noindex",
    term: "Noindex",
    shortDefinition: "A meta robots directive that tells search engines not to include a page in their index, preventing it from appearing in search results.",
    fullDefinition: "Noindex is a directive you add to a page's HTML (via meta robots tag or X-Robots-Tag HTTP header) that tells search engines not to include the page in their search index. Unlike robots.txt (which blocks crawling), noindex allows crawling but prevents the page from appearing in search results. Common uses include: thank-you pages, internal search results pages, staging/development pages, admin pages, paginated archive pages, and thin content pages that add no search value. Implementation: add <meta name=\"robots\" content=\"noindex\"> to the page's <head>, or set the X-Robots-Tag: noindex HTTP header. Important: if a page is blocked by robots.txt AND has noindex, the noindex may never be seen by Google since it can't crawl the page.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/robots-txt-generator", label: "Robots.txt Generator" },
    ],
    relatedTerms: ["what-is-robots-txt", "what-is-crawlability"],
  },
  {
    slug: "what-is-anchor-text",
    term: "Anchor Text",
    shortDefinition: "The visible, clickable text of a hyperlink that tells search engines and users what the linked page is about.",
    fullDefinition: "Anchor text is the visible, clickable text in a hyperlink. It appears as highlighted (usually blue and underlined) text that users click to navigate to another page. Search engines use anchor text as a signal to understand what the linked page is about. Types of anchor text: exact-match (uses the target keyword), partial-match (includes the keyword with other words), branded (uses the brand name), generic ('click here', 'learn more'), naked URL (the raw URL), and image anchor (alt text of a linked image). Best practices for internal linking: use descriptive, keyword-relevant anchor text; vary your anchor text naturally; avoid over-optimization with the same exact-match anchor repeatedly; and never use generic phrases like 'click here' when a descriptive alternative exists.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-internal-linking", "what-is-backlink"],
  },
  {
    slug: "what-is-search-intent",
    term: "Search Intent (User Intent)",
    shortDefinition: "The underlying purpose behind a search query — whether the user wants to learn, find a specific site, compare options, or buy something.",
    fullDefinition: "Search intent (also called user intent or query intent) is the primary goal a user has when typing a query into a search engine. Google classifies search intent into four main categories: Informational (wanting to learn something — 'how to do SEO audit'), Navigational (looking for a specific website — 'Google Search Console login'), Commercial (comparing options before buying — 'best SEO tools 2026'), and Transactional (ready to take action — 'buy Ahrefs subscription'). Matching your content to search intent is one of the most critical ranking factors. If your page provides a product comparison but the query has informational intent, you won't rank well regardless of your domain authority or backlink profile. Always analyze the current SERP for your target keyword to understand what intent Google has determined.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
    ],
    relatedTerms: ["what-is-seo", "what-is-on-page-seo"],
  },
  {
    slug: "what-is-featured-snippet",
    term: "Featured Snippet",
    shortDefinition: "A highlighted search result at the top of Google (position zero) that directly answers a user's query with extracted content.",
    fullDefinition: "A featured snippet is a special search result that appears at the top of Google's organic results (often called 'position zero'). It displays a direct answer to the user's query, extracted from a web page, along with the page's title and URL. Featured snippet types include: paragraph (a text block answering a question), list (numbered or bulleted steps), table (data in rows and columns), and video (YouTube clips). Winning a featured snippet can dramatically increase visibility and traffic — some studies show 35%+ CTR for featured snippets. To optimize for featured snippets: directly answer common questions in your content, use clear heading structures, format answers in the snippet-preferred format (paragraph, list, or table), and keep answers concise (40-60 words for paragraph snippets).",
    relatedTools: [
      { href: "/tools/schema-generator", label: "Schema Generator" },
      { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
    ],
    relatedTerms: ["what-is-serp", "what-is-rich-snippets"],
  },
  {
    slug: "what-is-bounce-rate",
    term: "Bounce Rate",
    shortDefinition: "The percentage of visitors who leave your site after viewing only one page without taking any further action.",
    fullDefinition: "Bounce rate is the percentage of visitors who land on a page and leave without interacting further — no clicks, no scrolls (in GA4's engaged sessions model), no form submissions. In Google Analytics 4, bounce rate is the inverse of engagement rate: a session is 'engaged' if it lasts more than 10 seconds, has 2+ page views, or triggers a conversion event. Average bounce rates vary by industry and page type: blog posts (65-80%), landing pages (60-90%), service pages (10-30%), and e-commerce product pages (20-45%). High bounce rate isn't always bad — if a user finds their answer immediately (like a contact page with your phone number), a bounce is expected. Focus on reducing bounce rate on pages where you want users to take further action.",
    relatedTools: [
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-core-web-vitals", "what-is-search-intent"],
  },
  {
    slug: "what-is-https",
    term: "HTTPS (SSL/TLS)",
    shortDefinition: "A secure protocol that encrypts data between a user's browser and your website — a confirmed Google ranking signal since 2014.",
    fullDefinition: "HTTPS (HyperText Transfer Protocol Secure) is the encrypted version of HTTP, using SSL/TLS certificates to secure the connection between a user's browser and your web server. Google confirmed HTTPS as a ranking signal in 2014, and modern browsers display 'Not Secure' warnings for HTTP pages. Beyond SEO, HTTPS is essential for user trust, especially on pages that handle passwords, payment information, or personal data. Implementation: obtain an SSL certificate (free via Let's Encrypt or through your hosting provider), install it on your server, redirect all HTTP URLs to HTTPS via 301 redirects, update internal links to HTTPS, and update your sitemap and canonical tags. Most modern hosting platforms include HTTPS by default.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/redirect-checker", label: "Redirect Checker" },
    ],
    relatedTerms: ["what-is-technical-seo", "what-is-crawlability"],
  },
  {
    slug: "what-is-mobile-first-indexing",
    term: "Mobile-First Indexing",
    shortDefinition: "Google's practice of using the mobile version of your website's content for indexing and ranking, not the desktop version.",
    fullDefinition: "Mobile-first indexing means Google predominantly uses the mobile version of a page's content for indexing and ranking. Since July 2019, all new websites are indexed mobile-first by default, and since March 2021, Google has completed the switch for all sites. This means if your mobile site has less content, fewer links, or different structured data than your desktop version, Google only sees the mobile version. Key requirements: ensure content parity between mobile and desktop, use responsive design (recommended by Google), make all structured data present on mobile pages, ensure images have proper alt text on mobile, and verify your site works well on mobile devices. Test with Google's Mobile-Friendly Test tool.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
    ],
    relatedTerms: ["what-is-technical-seo", "what-is-core-web-vitals"],
  },
  {
    slug: "what-is-structured-data",
    term: "Structured Data",
    shortDefinition: "Standardized code formats (like JSON-LD) that help search engines understand page content and generate rich results.",
    fullDefinition: "Structured data is a standardized format for providing information about a page and classifying the page content. It uses vocabularies from Schema.org to describe entities (people, places, products, events) in a way that search engines can programmatically understand. Structured data can be implemented in three formats: JSON-LD (recommended by Google), Microdata, and RDFa. When properly implemented, structured data enables rich results in Google Search — star ratings, FAQ dropdowns, recipe cards, event details, and more. These enhanced listings can increase click-through rates by 20-35%. Common types include Organization, LocalBusiness, Product, Article, FAQPage, HowTo, and BreadcrumbList.",
    relatedTools: [
      { href: "/tools/schema-generator", label: "Schema Generator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-schema-markup", "what-is-json-ld", "what-is-rich-snippets"],
  },
  {
    slug: "what-is-page-speed",
    term: "Page Speed",
    shortDefinition: "How fast a web page loads and becomes interactive — a confirmed Google ranking factor that directly impacts user experience.",
    fullDefinition: "Page speed refers to how quickly a web page loads its content and becomes interactive for users. It is a confirmed Google ranking factor for both desktop (since 2010) and mobile (since 2018) searches. Page speed is measured through metrics like Largest Contentful Paint (LCP), First Contentful Paint (FCP), Time to Interactive (TTI), and Total Blocking Time (TBT). Slow pages lead to higher bounce rates — research shows 53% of mobile users abandon sites that take longer than 3 seconds to load. Common speed killers include unoptimized images, render-blocking JavaScript and CSS, lack of caching, excessive third-party scripts, and slow server response times. Use tools like SerpNap's Page Speed Estimator or Google's PageSpeed Insights to diagnose and fix speed issues.",
    relatedTools: [
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-core-web-vitals", "what-is-lcp", "what-is-bounce-rate"],
  },
  {
    slug: "what-is-indexing",
    term: "Indexing",
    shortDefinition: "The process by which search engines store and organize web pages in their database so they can be retrieved for search queries.",
    fullDefinition: "Indexing is the process by which search engines like Google add web pages to their database (index) after crawling them. Once a page is indexed, it becomes eligible to appear in search results. The process involves: crawling (discovering the page via links or sitemaps), rendering (processing HTML, CSS, and JavaScript to understand the content), and indexing (storing the processed content in Google's index). Not all crawled pages get indexed — Google may skip pages with thin content, duplicate content, noindex directives, or low quality. You can check your indexing status in Google Search Console's Coverage report. To encourage indexing: submit your XML sitemap, ensure good internal linking, create quality content, and avoid noindex tags on important pages.",
    relatedTools: [
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/robots-txt-generator", label: "Robots.txt Generator" },
    ],
    relatedTerms: ["what-is-crawlability", "what-is-noindex", "what-is-xml-sitemap"],
  },
  {
    slug: "what-is-topical-authority",
    term: "Topical Authority",
    shortDefinition: "A website's perceived expertise on a specific subject, built through comprehensive, interlinked content covering all aspects of a topic.",
    fullDefinition: "Topical authority is the concept that search engines reward websites that demonstrate comprehensive expertise on a specific subject. Rather than publishing scattered content on many topics, sites that deeply cover a single topic cluster tend to rank higher for related keywords. Building topical authority involves: creating pillar content (comprehensive guides on main topics), supporting articles (detailed content on subtopics), strong internal linking between related pieces, covering questions your audience asks (People Also Ask), and maintaining content freshness through regular updates. Google's Helpful Content system specifically evaluates whether a site has a demonstrated depth of knowledge on its subject matter. Topical authority takes time to build but creates a compounding SEO advantage.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
    ],
    relatedTerms: ["what-is-eeat", "what-is-internal-linking", "what-is-on-page-seo"],
  },
  {
    slug: "what-is-open-graph",
    term: "Open Graph (OG Tags)",
    shortDefinition: "HTML meta tags that control how your pages appear when shared on social media platforms like Facebook, LinkedIn, and Slack.",
    fullDefinition: "Open Graph (OG) is a protocol originally created by Facebook that allows web pages to control how they appear when shared on social media platforms. OG tags are HTML meta tags placed in the <head> section of your page. The essential OG tags are: og:title (the title shown in social shares), og:description (the description text), og:image (the preview image — recommended 1200x630px), og:url (the canonical URL), and og:type (content type, usually 'website' or 'article'). Additional tags include og:site_name, og:locale, and og:video. While OG tags don't directly affect SEO rankings, they significantly impact social sharing click-through rates, which can indirectly drive traffic and backlinks. Twitter uses its own twitter:card tags but falls back to OG tags if they're not set.",
    relatedTools: [
      { href: "/tools/open-graph-checker", label: "Open Graph Checker" },
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
    ],
    relatedTerms: ["what-is-meta-description", "what-is-title-tag"],
  },
  {
    slug: "what-is-aeo",
    term: "AEO (Answer Engine Optimization)",
    shortDefinition: "Optimizing content to be directly cited as answers by AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews.",
    fullDefinition: "Answer Engine Optimization (AEO) is the practice of optimizing your content to be selected and cited as a direct answer by AI-powered search engines and answer engines. Unlike traditional SEO which focuses on ranking in a list of results, AEO focuses on being the source that AI models quote when answering user questions. Key AEO strategies include: structuring content with clear, direct answers to specific questions, using FAQ schema and HowTo schema, creating concise 40-60 word answer paragraphs, building entity authority through consistent structured data, and providing unique data or research that AI models can cite. As Google AI Overviews, ChatGPT search, and Perplexity grow in usage, AEO is becoming as important as traditional SEO for maintaining organic visibility.",
    relatedTools: [
      { href: "/tools/neural-audit", label: "Neural Audit" },
      { href: "/tools/schema-generator", label: "Schema Generator" },
    ],
    relatedTerms: ["what-is-geo", "what-is-featured-snippet", "what-is-eeat"],
  },
  {
    slug: "what-is-sitemap-index",
    term: "Sitemap Index",
    shortDefinition: "A master sitemap file that references multiple individual sitemaps, used by large websites with more than 50,000 URLs.",
    fullDefinition: "A sitemap index is an XML file that lists multiple individual sitemaps for a website. It's used when a site has more than 50,000 URLs or when individual sitemap files exceed 50MB — the limits imposed by the Sitemaps protocol. The sitemap index file follows a specific XML structure with <sitemapindex> as the root element, containing <sitemap> entries that point to individual sitemap files. Each entry includes a <loc> (URL of the sitemap) and optional <lastmod> (last modification date). Best practice is to organize sitemaps by content type: one for pages, one for blog posts, one for products, etc. This makes it easier to monitor indexing status per content type in Google Search Console. Submit the sitemap index URL (not individual sitemaps) to Search Console.",
    relatedTools: [
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
    ],
    relatedTerms: ["what-is-xml-sitemap", "what-is-crawlability", "what-is-indexing"],
  },
  {
    slug: "what-is-hreflang",
    term: "Hreflang",
    shortDefinition: "An HTML attribute that tells search engines which language and regional version of a page to show to users in different locations.",
    fullDefinition: "Hreflang is an HTML attribute (rel='alternate' hreflang='x') that tells search engines which language and geographic version of a page should be served to users in different locations. It prevents duplicate content issues between regional variants (e.g., English for US vs. English for UK) and ensures users see the most relevant version. Hreflang tags can be implemented in three ways: in the <head> of each page, in HTTP headers, or in the XML sitemap. Each page must reference all its language variants, including itself (self-referencing). Common mistakes include: asymmetric tags (page A references B but B doesn't reference A), incorrect language/country codes, and missing x-default for fallback. Hreflang only affects organic search — it does not redirect users.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-canonical-url", "what-is-technical-seo", "what-is-indexing"],
  },
  {
    slug: "what-is-link-equity",
    term: "Link Equity (Link Juice)",
    shortDefinition: "The ranking value that flows from one page to another through hyperlinks, distributing authority across your site.",
    fullDefinition: "Link equity (informally called 'link juice') is the concept that hyperlinks pass ranking value from one page to another. When a high-authority page links to another page, it shares some of its authority, helping the linked page rank better. Link equity flows through both internal links (within your site) and external links (from other sites). Several factors affect how much equity passes: the authority of the linking page, the number of outgoing links on the page (equity is divided among all links), the relevance of the linking page to the target, and whether the link is dofollow or nofollow. Nofollow links (rel='nofollow') signal to Google not to pass equity, though Google treats nofollow as a 'hint' rather than a directive. Redirect chains (301 → 301 → 301) can lose equity at each hop.",
    relatedTools: [
      { href: "/tools/redirect-checker", label: "Redirect Checker" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-backlink", "what-is-301-redirect", "what-is-internal-linking"],
  },
  {
    slug: "what-is-google-algorithm",
    term: "Google Algorithm",
    shortDefinition: "The complex ranking system Google uses to evaluate and rank web pages in search results based on hundreds of signals.",
    fullDefinition: "Google's search algorithm is a complex system of ranking signals and machine learning models that evaluates web pages to determine their relevance and quality for any given search query. The algorithm considers hundreds of factors including: content relevance and quality, backlink profile, page experience (Core Web Vitals), mobile-friendliness, HTTPS, E-E-A-T signals, structured data, search intent match, content freshness, and user engagement metrics. Google makes thousands of algorithm changes per year, including major 'core updates' (broad changes affecting many sites) and specific updates targeting spam, helpful content, reviews, and link quality. Monitoring your rankings after core updates and following Google's Search Central blog helps you stay ahead of algorithmic changes.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/neural-audit", label: "Neural Audit" },
    ],
    relatedTerms: ["what-is-seo", "what-is-eeat", "what-is-core-web-vitals"],
  },
  {
    slug: "what-is-keyword-research",
    term: "Keyword Research",
    shortDefinition: "The process of finding and analyzing search terms people enter into search engines to use for SEO and content strategy.",
    fullDefinition: "Keyword research is the foundation of any SEO strategy — it's the process of discovering what your target audience is searching for, how often they search for it, and how competitive those terms are. The process involves: identifying seed keywords relevant to your business, expanding them using tools and autocomplete suggestions, analyzing search volume and keyword difficulty, understanding search intent (informational, navigational, commercial, transactional), and grouping keywords into topic clusters. Good keyword research reveals content opportunities — topics where you can realistically rank and drive qualified traffic. Key metrics to evaluate include: monthly search volume, keyword difficulty (competition), cost-per-click (indicates commercial value), and SERP features (featured snippets, PAA boxes). Long-tail keywords (3+ words) typically have lower volume but higher conversion rates and less competition.",
    relatedTools: [
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
    ],
    relatedTerms: ["what-is-search-intent", "what-is-keyword-density", "what-is-serp"],
  },
  {
    slug: "what-is-long-tail-keywords",
    term: "Long-Tail Keywords",
    shortDefinition: "Specific, multi-word search phrases with lower volume but higher conversion rates and less competition.",
    fullDefinition: "Long-tail keywords are search phrases containing three or more words that are highly specific to what a user is looking for. While they individually have lower search volume than head terms, they collectively account for approximately 70% of all searches. For example, 'SEO' is a head term, while 'free SEO audit tool for small business' is a long-tail keyword. Long-tail keywords are valuable because: they face less competition (easier to rank for), they attract more qualified traffic (higher conversion rates), they better match specific user intent, and they help build topical authority when you cover many related long-tails. A strong SEO strategy targets a mix of head terms and long-tail keywords, using long-tails to build authority that eventually helps you rank for broader terms.",
    relatedTools: [
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
      { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
    ],
    relatedTerms: ["what-is-keyword-research", "what-is-search-intent", "what-is-topical-authority"],
  },
  {
    slug: "what-is-off-page-seo",
    term: "Off-Page SEO",
    shortDefinition: "SEO activities performed outside your website — primarily link building and brand mentions — to improve search rankings.",
    fullDefinition: "Off-page SEO refers to all optimization activities that happen outside of your own website to improve its search engine rankings. The most important off-page factor is backlinks — links from other websites pointing to yours, which act as votes of confidence. Other off-page signals include: brand mentions (even without links), social media engagement, guest posting, digital PR, local citations (for local SEO), and reviews on third-party platforms. Quality matters far more than quantity — one link from an authoritative, relevant site is worth more than hundreds from low-quality directories. Off-page SEO builds your site's authority and trustworthiness in Google's eyes, complementing your on-page and technical SEO efforts.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/broken-link-checker", label: "Broken Link Checker" },
    ],
    relatedTerms: ["what-is-backlink", "what-is-domain-authority", "what-is-link-equity"],
  },
  {
    slug: "what-is-organic-traffic",
    term: "Organic Traffic",
    shortDefinition: "Website visitors who arrive through unpaid search engine results, as opposed to paid ads or direct visits.",
    fullDefinition: "Organic traffic refers to visitors who find your website through unpaid (natural) search engine results. When someone searches a query on Google, Bing, or another search engine and clicks on a non-ad result to reach your site, that counts as organic traffic. Organic traffic is considered the most valuable traffic source because: it's free (no per-click cost), it's sustainable (unlike paid ads, it doesn't stop when you stop paying), it indicates relevance (Google sent users to you because your content matched their intent), and it compounds over time as your rankings improve. You can track organic traffic in Google Analytics and Google Search Console. Key metrics include: organic sessions, organic keywords driving traffic, click-through rates from SERPs, and landing page performance.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-seo", "what-is-serp", "what-is-bounce-rate"],
  },
  {
    slug: "what-is-keyword-cannibalization",
    term: "Keyword Cannibalization",
    shortDefinition: "When multiple pages on your site compete for the same keyword, diluting ranking potential and confusing search engines.",
    fullDefinition: "Keyword cannibalization occurs when two or more pages on your website target the same or very similar keywords, causing them to compete against each other in search results. Instead of having one strong page ranking well, you end up with multiple weaker pages splitting authority, backlinks, and click-through rates. Signs of cannibalization include: fluctuating rankings for a keyword, different pages appearing for the same query over time, and lower-than-expected traffic for competitive terms. To fix cannibalization: identify competing pages through Search Console or site:yourdomain.com searches, choose the strongest page as your canonical, consolidate content from weaker pages into the primary page, set up 301 redirects from removed pages, and use internal linking to signal which page should rank. Prevention is easier than cure — maintain a keyword map that assigns each target keyword to a single page.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
    ],
    relatedTerms: ["what-is-canonical-url", "what-is-301-redirect", "what-is-keyword-research"],
  },
  {
    slug: "what-is-site-architecture",
    term: "Site Architecture",
    shortDefinition: "The hierarchical structure and organization of pages on a website, affecting both user navigation and search engine crawling.",
    fullDefinition: "Site architecture (also called site structure or information architecture) is how your website's pages are organized, linked together, and presented to both users and search engines. A well-planned architecture ensures: every important page is reachable within 3 clicks from the homepage, topically related content is grouped together (topic clusters), internal linking distributes authority effectively, and crawlers can discover all pages efficiently. Common architecture models include: flat (all pages close to root — good for small sites), silo (content organized by topic/category), and hub-and-spoke (pillar pages linking to supporting content). Best practices include: using descriptive URLs that reflect hierarchy, implementing breadcrumb navigation, creating HTML sitemaps for users, maintaining XML sitemaps for crawlers, and using consistent internal linking patterns. Poor architecture — orphan pages, deep nesting, or confusing navigation — directly hurts both rankings and user experience.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-internal-linking", "what-is-crawlability", "what-is-crawl-budget"],
  },
  {
    slug: "what-is-content-gap-analysis",
    term: "Content Gap Analysis",
    shortDefinition: "Identifying topics and keywords your competitors rank for that your website doesn't cover yet.",
    fullDefinition: "Content gap analysis is the process of comparing your website's content against competitors to find topics, keywords, and questions you're missing. The goal is to discover untapped opportunities where you can create new content or improve existing pages to capture traffic your competitors are getting but you aren't. The process involves: identifying your top 3-5 organic competitors (sites ranking for your target keywords), analyzing which keywords they rank for that you don't, categorizing gaps by topic and search intent, prioritizing by search volume and business relevance, and creating a content plan to fill the most valuable gaps. Tools can help automate this, but manual analysis is also effective — search your target keywords and study what competitors cover that you don't. Content gaps often reveal entire topic clusters you should build out.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/keyword-density-checker", label: "Keyword Density Checker" },
    ],
    relatedTerms: ["what-is-keyword-research", "what-is-topical-authority", "what-is-search-intent"],
  },
  {
    slug: "what-is-google-search-console",
    term: "Google Search Console",
    shortDefinition: "A free Google tool that helps website owners monitor, maintain, and troubleshoot their site's presence in Google Search results.",
    fullDefinition: "Google Search Console (GSC) is a free service from Google that helps you monitor and optimize your website's performance in Google Search. Key features include: Performance reports (impressions, clicks, CTR, average position for every query and page), Index Coverage (which pages Google has indexed, crawl errors, and reasons pages are excluded), URL Inspection (test how Google sees a specific page), Sitemaps (submit and monitor XML sitemaps), Core Web Vitals (field data on LCP, CLS, INP), Mobile Usability (mobile-friendliness issues), Links (internal and external links to your site), and Manual Actions (penalties from Google's webspam team). Every website owner should set up GSC — it's the most reliable source of data about how Google interacts with your site. Verify ownership via DNS, HTML tag, HTML file, or Google Analytics/Tag Manager.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/sitemap-validator", label: "Sitemap Validator" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-indexing", "what-is-crawlability", "what-is-core-web-vitals"],
  },
  {
    slug: "what-is-google-analytics",
    term: "Google Analytics",
    shortDefinition: "A free web analytics platform that tracks website traffic, user behavior, conversions, and marketing performance.",
    fullDefinition: "Google Analytics (GA4) is a free analytics platform that provides detailed insights into your website traffic and user behavior. It tracks: where your visitors come from (organic, paid, social, direct, referral), what pages they visit, how long they stay, what actions they take (conversions/events), and demographic and device information. GA4 (the current version) uses an event-based data model, replacing the session-based model of Universal Analytics. For SEO, GA4 helps you: measure organic traffic growth over time, identify your highest-performing landing pages, track conversion rates from organic search, monitor bounce rates and engagement metrics, and set up custom events for tool usage, downloads, or form submissions. Pair GA4 with Google Search Console for a complete picture — GSC shows how users find you in search, while GA4 shows what they do after arriving.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-organic-traffic", "what-is-bounce-rate", "what-is-google-search-console"],
  },
  {
    slug: "what-is-ssl-certificate",
    term: "SSL Certificate",
    shortDefinition: "A digital certificate that encrypts data between a browser and web server, enabling HTTPS and showing a padlock icon.",
    fullDefinition: "An SSL (Secure Sockets Layer) certificate — technically now TLS (Transport Layer Security) — is a digital certificate that authenticates a website's identity and encrypts data sent between the browser and server. When installed, it enables HTTPS (the padlock icon in the browser address bar). SSL certificates are critical for SEO because: Google confirmed HTTPS as a ranking signal in 2014, browsers mark HTTP sites as 'Not Secure' (hurting trust and conversions), SSL enables HTTP/2 (faster page loads), and it protects user data in transit. Types of SSL certificates include: Domain Validation (DV) — basic verification, Organization Validation (OV) — company verified, and Extended Validation (EV) — highest trust level. Free SSL certificates are available through Let's Encrypt, Cloudflare, and most hosting providers. Check your SSL configuration with an SSL checker to ensure proper setup, valid expiry dates, and complete certificate chains.",
    relatedTools: [
      { href: "/tools/ssl-checker", label: "SSL Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-https", "what-is-technical-seo", "what-is-page-speed"],
  },
  {
    slug: "what-is-http-status-codes",
    term: "HTTP Status Codes",
    shortDefinition: "Three-digit response codes from web servers indicating whether a request succeeded, was redirected, or failed.",
    fullDefinition: "HTTP status codes are standardized three-digit responses sent by web servers to indicate the result of a browser's request. They're grouped into five categories: 1xx (Informational) — request received, processing; 2xx (Success) — 200 OK is the most common, meaning the page loaded successfully; 3xx (Redirection) — 301 (permanent redirect) and 302 (temporary redirect) tell browsers to go to a different URL; 4xx (Client Errors) — 404 (Not Found) means the page doesn't exist, 403 (Forbidden) means access denied, 410 (Gone) means permanently removed; 5xx (Server Errors) — 500 (Internal Server Error) and 503 (Service Unavailable) indicate server problems. For SEO, the most important status codes are: 200 (healthy pages), 301 (permanent redirects that pass link equity), 404 (broken links that waste crawl budget), and 503 (tell Google to retry later during maintenance).",
    relatedTools: [
      { href: "/tools/redirect-checker", label: "Redirect Checker" },
      { href: "/tools/broken-link-checker", label: "Broken Link Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-301-redirect", "what-is-redirect-chain", "what-is-crawlability"],
  },
  {
    slug: "what-is-duplicate-content",
    term: "Duplicate Content",
    shortDefinition: "Substantially similar content appearing at multiple URLs, which can confuse search engines and dilute ranking signals.",
    fullDefinition: "Duplicate content occurs when identical or substantially similar content exists at multiple URLs — either within the same website (internal duplication) or across different websites (external duplication). It's one of the most common SEO issues. Internal causes include: www vs. non-www versions, HTTP vs. HTTPS, trailing slash variations, URL parameters (filtering, sorting, session IDs), print-friendly pages, and paginated content. External causes include: content syndication, scraped content, and boilerplate legal pages. While Google doesn't penalize duplicate content with a formal penalty, it does: choose only one version to index (potentially the wrong one), split ranking signals between duplicates, and waste crawl budget on redundant pages. Fixes include: canonical tags (rel='canonical') to specify the preferred version, 301 redirects for retired URLs, robots.txt or noindex for non-canonical versions, and using hreflang for international content variants.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/technical-audit", label: "Technical Audit" },
    ],
    relatedTerms: ["what-is-canonical-url", "what-is-noindex", "what-is-keyword-cannibalization"],
  },
  {
    slug: "what-is-dwell-time",
    term: "Dwell Time",
    shortDefinition: "The amount of time a user spends on a page after clicking a search result before returning to the SERP.",
    fullDefinition: "Dwell time is the duration between when a user clicks a search result and when they return to the search results page. It differs from bounce rate (which measures single-page sessions regardless of time) and time on page (which measures all visits, not just from search). While Google has never confirmed dwell time as a direct ranking factor, there's strong evidence that user engagement signals influence rankings. A long dwell time suggests the content satisfied the user's query, while a short dwell time ('pogo-sticking' back to results) suggests it didn't. To improve dwell time: match content to search intent, provide comprehensive answers, use engaging formatting (headings, lists, images, videos), ensure fast page load speed, write compelling introductions that hook readers, and use interactive elements like calculators, tools, or quizzes. Content depth and quality are the strongest predictors of good dwell time.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/page-speed-estimator", label: "Page Speed Estimator" },
    ],
    relatedTerms: ["what-is-bounce-rate", "what-is-search-intent", "what-is-core-web-vitals"],
  },
  {
    slug: "what-is-ctr",
    term: "CTR (Click-Through Rate)",
    shortDefinition: "The percentage of people who click on your search result after seeing it, calculated as clicks divided by impressions.",
    fullDefinition: "Click-Through Rate (CTR) in SEO is the percentage of users who click on your search listing after seeing it in the search results. It's calculated as: (Clicks / Impressions) x 100. Average organic CTR varies significantly by position: position 1 gets approximately 27-31% CTR, position 2 gets 15-17%, position 3 gets 10-11%, and positions 6-10 get 2-5%. CTR is widely believed to be a ranking signal — Google uses it as a quality indicator. To improve CTR: write compelling title tags with power words and numbers, craft meta descriptions that include a call-to-action, use structured data to earn rich snippets (stars, FAQs, prices), match search intent in your titles, include the current year for freshness, and use emotional triggers. You can track CTR in Google Search Console's Performance report, which shows CTR for every query and page. Pages with below-average CTR for their position are prime optimization candidates.",
    relatedTools: [
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
      { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
      { href: "/tools/seo-checker", label: "SEO Checker" },
    ],
    relatedTerms: ["what-is-serp", "what-is-meta-description", "what-is-title-tag"],
  },
  {
    slug: "what-is-local-seo",
    term: "Local SEO",
    shortDefinition: "Optimizing your online presence to attract more customers from relevant local searches on Google and maps.",
    fullDefinition: "Local SEO is the practice of optimizing your business's online presence to attract customers from geographically relevant searches. When someone searches 'plumber near me' or 'best coffee shop in [city]', Google shows local results — including the Map Pack (the top 3 local listings with a map). Local SEO focuses on: Google Business Profile (GBP) optimization — complete your profile, choose correct categories, add photos, respond to reviews, and post updates; NAP consistency — ensure your Name, Address, and Phone number are identical across all directories and citations; local citations — listings on Yelp, Yellow Pages, industry directories, and local business associations; review management — encourage positive reviews and respond professionally to all reviews; local content — create location-specific pages and blog posts; and local link building — get links from local organizations, newspapers, and community sites. Local SEO is critical for brick-and-mortar businesses, service-area businesses, and any company that serves specific geographic regions.",
    relatedTools: [
      { href: "/tools/seo-checker", label: "SEO Checker" },
      { href: "/tools/schema-generator", label: "Schema Generator" },
      { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
    ],
    relatedTerms: ["what-is-seo", "what-is-schema-markup", "what-is-eeat"],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return glossaryTerms.map((t) => t.slug);
}
