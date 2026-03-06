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
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return glossaryTerms.map((t) => t.slug);
}
