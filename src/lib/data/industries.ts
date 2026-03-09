export interface IndustryData {
	slug: string;
	name: string;
	metaTitle: string;
	metaDescription: string;
	keywords: string[];
	heroTitle: string;
	heroSubtitle: string;
	whyMatters: string;
	commonIssues: string[];
	tips: Array<{ title: string; description: string }>;
	faqs: Array<{ question: string; answer: string }>;
}

const industries: IndustryData[] = [
	{
		slug: "ecommerce",
		name: "E-commerce",
		metaTitle: "Free E-commerce SEO Checker — Audit Your Online Store",
		metaDescription:
			"Run a free SEO audit on your e-commerce store. Check product page optimization, schema markup, site speed, and 50+ ranking factors. Works with Shopify, WooCommerce, BigCommerce.",
		keywords: [
			"ecommerce seo checker",
			"online store seo audit",
			"shopify seo checker",
			"woocommerce seo audit",
			"product page seo",
			"ecommerce seo tool free",
		],
		heroTitle: "SEO Checker for E-commerce",
		heroSubtitle:
			"Audit your online store's SEO across 50+ ranking factors. Optimize product pages, fix technical issues, and outrank competitors.",
		whyMatters:
			"E-commerce sites face unique SEO challenges: duplicate product descriptions, thin category pages, faceted navigation creating crawl bloat, missing product schema markup, and slow page speeds from heavy images. A single missing meta description on a product page can cost you thousands in lost organic traffic.",
		commonIssues: [
			"Missing or duplicate product meta descriptions across hundreds of pages",
			"No Product schema markup — missing rich snippets in search results",
			"Slow page speed from unoptimized product images (no WebP/AVIF)",
			"Thin content on category and collection pages",
			"Faceted navigation creating duplicate content issues",
			"Missing canonical tags on filtered/sorted product pages",
			"Poor mobile experience on product detail pages",
			"No breadcrumb structured data for product navigation",
		],
		tips: [
			{
				title: "Add Product Schema to Every Product Page",
				description:
					"Product schema (price, availability, reviews) enables rich snippets in Google, increasing click-through rates by up to 30%. Use SerpNap's Schema Generator to create JSON-LD markup.",
			},
			{
				title: "Write Unique Meta Descriptions for Top Products",
				description:
					"Start with your top 20% revenue-generating products. Unique, keyword-rich meta descriptions directly impact click-through rates from search results.",
			},
			{
				title: "Optimize Product Images for Speed",
				description:
					"Convert images to WebP/AVIF, add descriptive alt text with product names, and lazy-load below-the-fold images. Use SerpNap's Page Speed Estimator to measure impact.",
			},
			{
				title: "Fix Canonical Tags on Filtered Pages",
				description:
					"Ensure filtered/sorted product listing pages have canonical tags pointing to the main category page. This prevents duplicate content penalties from faceted navigation.",
			},
		],
		faqs: [
			{
				question: "Does this SEO checker work with Shopify?",
				answer:
					"Yes. SerpNap works with any publicly accessible website including Shopify, WooCommerce, BigCommerce, Magento, and custom-built stores. Just enter your store URL and get a full audit in under 30 seconds.",
			},
			{
				question: "What SEO issues are most common on e-commerce sites?",
				answer:
					"The most common issues are: missing or duplicate meta descriptions on product pages, no Product schema markup (missing rich snippets), unoptimized images causing slow load times, thin content on category pages, and duplicate content from faceted navigation without proper canonicalization.",
			},
			{
				question: "How many products can SerpNap audit?",
				answer:
					"SerpNap audits one page at a time in depth (50+ checks per page). For e-commerce, start by auditing your homepage, top category pages, and best-selling product pages. Each audit is free with no limits on how many you run.",
			},
			{
				question: "Does SerpNap check product schema markup?",
				answer:
					"Yes. The SEO Checker validates structured data including Product schema (price, availability, reviews), BreadcrumbList, and other e-commerce-relevant markup. It also flags missing schema that could earn you rich snippets.",
			},
		],
	},
	{
		slug: "saas",
		name: "SaaS",
		metaTitle: "Free SaaS SEO Checker — Audit Your Software Website",
		metaDescription:
			"Run a free SEO audit on your SaaS website. Check landing pages, feature pages, documentation, and blog for 50+ ranking factors.",
		keywords: [
			"saas seo checker",
			"saas website seo audit",
			"software company seo",
			"saas seo tool free",
			"b2b saas seo",
			"saas landing page seo",
		],
		heroTitle: "SEO Checker for SaaS",
		heroSubtitle:
			"Audit your SaaS website across 50+ ranking factors. Optimize landing pages, feature pages, and documentation for organic growth.",
		whyMatters:
			"For SaaS companies, organic search is the highest-ROI acquisition channel — often 5-10x cheaper than paid ads. But SaaS sites have unique challenges: JavaScript-heavy pages that search engines struggle to render, thin feature pages, poor internal linking between docs and marketing pages, and missing SoftwareApplication schema.",
		commonIssues: [
			"JavaScript rendering issues preventing Google from indexing content",
			"Missing SoftwareApplication schema markup",
			"Thin feature pages with insufficient content for ranking",
			"Poor internal linking between marketing site and documentation",
			"Missing or generic meta descriptions on feature pages",
			"Slow initial load from heavy JavaScript bundles",
			"No FAQ schema on pricing and feature comparison pages",
			"Docs pages not optimized for search (missing meta tags, headings)",
		],
		tips: [
			{
				title: "Add SoftwareApplication Schema",
				description:
					"SoftwareApplication schema enables rich results showing your pricing, ratings, and features directly in Google. Use SerpNap's Schema Generator to create the markup.",
			},
			{
				title: "Create Dedicated Pages for Each Feature",
				description:
					"Each major feature deserves its own page targeting specific keywords (e.g., '/features/team-collaboration'). Include 500+ words, screenshots, and use cases to rank for feature-specific searches.",
			},
			{
				title: "Optimize Documentation for SEO",
				description:
					"Your docs are a traffic goldmine. Add proper meta tags, heading structure, and internal links from docs to product pages. Developers searching for solutions in docs can convert to users.",
			},
			{
				title: "Build Comparison and Alternative Pages",
				description:
					"Create 'Your Product vs Competitor' and 'Best [Competitor] Alternative' pages. These capture high-intent traffic from people actively evaluating solutions.",
			},
		],
		faqs: [
			{
				question: "What SEO issues are most common on SaaS websites?",
				answer:
					"JavaScript rendering problems (Google can't see client-rendered content), missing SoftwareApplication schema, thin feature pages, poor docs SEO, and slow load times from large JS bundles.",
			},
			{
				question: "Does this checker detect JavaScript rendering issues?",
				answer:
					"SerpNap's SEO Checker analyzes the initial HTML response and flags content that may not be visible to search engines without JavaScript execution. The Technical Audit goes deeper into rendering and crawlability.",
			},
			{
				question: "How should SaaS companies approach SEO?",
				answer:
					"Focus on three pillars: (1) product-led content — feature pages, comparison pages, alternative pages targeting buyer keywords, (2) educational content — blog posts and docs targeting informational keywords, (3) technical SEO — ensure fast loading, proper rendering, and schema markup.",
			},
			{
				question: "Is this relevant for B2B SaaS?",
				answer:
					"Absolutely. B2B SaaS relies heavily on organic search for lead generation. SerpNap audits all the same ranking factors that matter for B2B — content quality, technical performance, structured data, and E-E-A-T signals that build trust with business buyers.",
			},
		],
	},
	{
		slug: "wordpress",
		name: "WordPress",
		metaTitle: "Free WordPress SEO Checker — Audit Your WordPress Site",
		metaDescription:
			"Run a free SEO audit on your WordPress website. Check Yoast/RankMath settings, theme performance, plugin conflicts, and 50+ ranking factors.",
		keywords: [
			"wordpress seo checker",
			"wordpress seo audit",
			"wordpress seo tool free",
			"check wordpress seo",
			"wordpress site audit",
			"wordpress seo analysis",
		],
		heroTitle: "SEO Checker for WordPress",
		heroSubtitle:
			"Audit your WordPress site across 50+ ranking factors. Find issues your SEO plugin misses — meta tags, speed, schema, and more.",
		whyMatters:
			"WordPress powers 43% of all websites, but having WordPress doesn't guarantee good SEO. SEO plugins like Yoast and RankMath handle basics, but they can't detect slow hosting, bloated themes, plugin conflicts affecting performance, or missing structured data beyond basic types. A dedicated audit reveals what your plugin dashboard doesn't show.",
		commonIssues: [
			"Slow page speed from bloated themes and too many plugins",
			"Missing or conflicting schema markup from multiple SEO plugins",
			"wp-admin and wp-includes not properly blocked in robots.txt",
			"Large unoptimized images without lazy loading",
			"Duplicate content from tag and author archive pages",
			"Missing XML sitemap or sitemap containing noindexed URLs",
			"Poor Core Web Vitals from render-blocking CSS/JS",
			"Not using HTTPS or mixed content warnings",
		],
		tips: [
			{
				title: "Audit Beyond Your SEO Plugin",
				description:
					"Yoast and RankMath check basic on-page SEO, but SerpNap's 50+ checks cover technical SEO, Core Web Vitals, accessibility, E-E-A-T signals, and advanced structured data that plugins miss.",
			},
			{
				title: "Optimize WordPress Performance",
				description:
					"Reduce plugins to essentials, use a lightweight theme, enable caching, and serve images in WebP format. Check your site with SerpNap's Page Speed Estimator to measure Core Web Vitals.",
			},
			{
				title: "Fix Robots.txt for WordPress",
				description:
					"Block /wp-admin/ (except admin-ajax.php), /wp-includes/, and search result pages. Use SerpNap's Robots.txt Generator with the WordPress preset for best practices.",
			},
			{
				title: "Prevent Duplicate Content",
				description:
					"Set tag archives, author archives, and date archives to noindex. Ensure each page has a canonical tag. Use SerpNap's SEO Checker to find duplicate content issues.",
			},
		],
		faqs: [
			{
				question: "Do I still need SerpNap if I use Yoast or RankMath?",
				answer:
					"Yes. SEO plugins handle basic on-page optimization (title tags, meta descriptions, readability), but they can't audit technical SEO, Core Web Vitals, accessibility, structured data validation, or E-E-A-T signals. SerpNap's 50+ checks catch issues that plugins miss.",
			},
			{
				question: "Does this work with any WordPress theme?",
				answer:
					"Yes. SerpNap audits the live page as Google sees it — regardless of your theme, page builder (Elementor, Divi, Gutenberg), or hosting provider. It works with any WordPress setup.",
			},
			{
				question: "Why is my WordPress site slow?",
				answer:
					"Common causes: too many plugins (especially poorly coded ones), bloated themes with unused features, unoptimized images, no caching, and render-blocking JavaScript. Run SerpNap's Page Speed Estimator to identify specific bottlenecks.",
			},
			{
				question: "How often should I audit my WordPress SEO?",
				answer:
					"After every major change (theme update, plugin changes, content restructuring) and at minimum quarterly. SerpNap is free with no limits, so you can audit as often as needed.",
			},
		],
	},
	{
		slug: "shopify",
		name: "Shopify",
		metaTitle: "Free Shopify SEO Checker — Audit Your Shopify Store",
		metaDescription:
			"Run a free SEO audit on your Shopify store. Check product pages, collection pages, theme speed, and 50+ ranking factors — no app install needed.",
		keywords: [
			"shopify seo checker",
			"shopify seo audit",
			"shopify seo tool free",
			"check shopify seo",
			"shopify store seo",
			"shopify seo analysis free",
		],
		heroTitle: "SEO Checker for Shopify",
		heroSubtitle:
			"Audit your Shopify store across 50+ ranking factors. No app install, no subscription — just paste your URL.",
		whyMatters:
			"Shopify stores compete in one of the most competitive SEO landscapes — e-commerce. While Shopify handles basics (SSL, mobile-responsive themes, sitemap generation), it has known SEO limitations: rigid URL structure, duplicate content from collections, limited meta tag control, and theme performance issues. An external audit reveals exactly what to fix.",
		commonIssues: [
			"Duplicate content from /collections/ and /products/ URL variants",
			"Missing or template-generated meta descriptions on product pages",
			"No Product schema with reviews, price, and availability",
			"Slow theme with unoptimized images and excessive Liquid rendering",
			"Collection pages with thin content (just product grids, no text)",
			"Shopify's rigid URL structure (/pages/, /blogs/, /collections/)",
			"Missing alt text on product images",
			"No FAQ or HowTo schema on product pages",
		],
		tips: [
			{
				title: "Fix Duplicate Collection/Product URLs",
				description:
					"Shopify creates URLs like /collections/all/products/item AND /products/item. Ensure canonical tags point to the primary /products/ URL. SerpNap's SEO Checker detects this issue automatically.",
			},
			{
				title: "Write Unique Product Meta Descriptions",
				description:
					"Shopify auto-generates meta descriptions from product descriptions, which are often too long or not SEO-optimized. Write custom meta descriptions for your top products using SerpNap's Meta Tag Generator.",
			},
			{
				title: "Add Product Schema with Reviews",
				description:
					"Product schema with aggregate ratings enables star ratings in Google search results. Use SerpNap's Schema Generator to create the JSON-LD, then add it to your theme's product template.",
			},
			{
				title: "Optimize Collection Pages with Content",
				description:
					"Add 200-300 words of unique descriptive content to collection pages. Google needs text content to understand what the page is about — a grid of products alone isn't enough.",
			},
		],
		faqs: [
			{
				question: "Does this work without installing a Shopify app?",
				answer:
					"Yes. SerpNap is a web-based tool — just enter your Shopify store URL and get results in under 30 seconds. No app install, no Shopify account connection, no permissions needed.",
			},
			{
				question: "What Shopify SEO issues does this checker find?",
				answer:
					"Duplicate content from collection URLs, missing product schema, unoptimized images, thin collection pages, missing meta descriptions, slow theme performance, accessibility issues, and more — 50+ checks total.",
			},
			{
				question: "Is this better than Shopify SEO apps?",
				answer:
					"SerpNap provides a deeper audit than most Shopify SEO apps, covering technical SEO, Core Web Vitals, E-E-A-T signals, and AI search visibility that apps typically don't check. And it's free with no monthly subscription.",
			},
			{
				question: "Can I audit competitor Shopify stores?",
				answer:
					"Yes. SerpNap works with any publicly accessible URL. Enter a competitor's store URL to see their SEO strengths and weaknesses, then use those insights to improve your own store.",
			},
		],
	},
	{
		slug: "local-business",
		name: "Local Business",
		metaTitle: "Free Local Business SEO Checker — Audit Your Local Website",
		metaDescription:
			"Run a free local SEO audit on your business website. Check Google Business Profile integration, local schema, NAP consistency, and 50+ ranking factors.",
		keywords: [
			"local business seo checker",
			"local seo audit",
			"local seo checker free",
			"small business seo tool",
			"local business website seo",
			"local seo analysis",
		],
		heroTitle: "SEO Checker for Local Businesses",
		heroSubtitle:
			"Audit your local business website for search visibility. Check local schema, NAP consistency, and 50+ on-page ranking factors.",
		whyMatters:
			"46% of all Google searches have local intent. For local businesses — restaurants, dentists, lawyers, plumbers, salons — appearing in the Local Pack and organic results directly drives foot traffic and phone calls. Missing LocalBusiness schema, inconsistent NAP (Name, Address, Phone), and poor mobile experience can keep you invisible to nearby customers searching for your services.",
		commonIssues: [
			"Missing LocalBusiness schema markup (no rich results in search)",
			"Inconsistent NAP (Name, Address, Phone) across pages",
			"No embedded Google Map or directions link",
			"Missing or generic meta descriptions for service pages",
			"Poor mobile experience (most local searches are mobile)",
			"No review schema or testimonial structured data",
			"Missing business hours in structured data",
			"Service area pages with thin or duplicate content",
		],
		tips: [
			{
				title: "Add LocalBusiness Schema",
				description:
					"LocalBusiness schema tells Google your business name, address, phone, hours, and service area. This enables rich results in local search. Use SerpNap's Schema Generator to create the markup.",
			},
			{
				title: "Ensure NAP Consistency",
				description:
					"Your business Name, Address, and Phone number must be identical on every page of your website, your Google Business Profile, and all directory listings. Even small differences (St. vs Street) can hurt rankings.",
			},
			{
				title: "Optimize for Mobile",
				description:
					"76% of local searches happen on mobile. Ensure your site loads fast, phone numbers are tap-to-call, and your address is easy to find. Use SerpNap's Page Speed Estimator to check mobile performance.",
			},
			{
				title: "Create Service Area Pages",
				description:
					"If you serve multiple locations, create unique pages for each city/neighborhood with location-specific content, local testimonials, and embedded maps. Avoid duplicate content across location pages.",
			},
		],
		faqs: [
			{
				question: "How does this help my local business rank?",
				answer:
					"SerpNap checks 50+ on-page factors that affect local rankings: LocalBusiness schema, meta tags, mobile-friendliness, page speed, heading structure, image optimization, and more. It identifies issues and provides AI-powered fixes to implement immediately.",
			},
			{
				question: "Does this check my Google Business Profile?",
				answer:
					"SerpNap audits your website, not your Google Business Profile directly. However, it checks for LocalBusiness schema on your site, which should match your GBP information. For GBP optimization, we recommend our blog guide on local SEO.",
			},
			{
				question: "What is LocalBusiness schema and why does it matter?",
				answer:
					"LocalBusiness schema is structured data (JSON-LD code) you add to your website that tells Google your business details — name, address, phone, hours, reviews. It helps you appear in the Local Pack, Knowledge Panel, and rich results in Google Search.",
			},
			{
				question: "How often should a local business run an SEO audit?",
				answer:
					"At minimum monthly, and after any website changes. Local SEO is competitive — your competitors are constantly optimizing. SerpNap is free with no limits, so run audits regularly to catch new issues early.",
			},
		],
	},
	{
		slug: "agency",
		name: "Agency",
		metaTitle: "Free SEO Checker for Agencies — Audit Client Websites",
		metaDescription:
			"Run free SEO audits for your agency clients. Professional 50+ check analysis with PDF reports — no per-client fees, no limits.",
		keywords: [
			"seo audit tool for agencies",
			"agency seo checker",
			"free seo audit tool agency",
			"client seo audit tool",
			"seo agency tool free",
			"white label seo audit",
		],
		heroTitle: "SEO Checker for Agencies",
		heroSubtitle:
			"Run unlimited professional audits for clients. 50+ checks, AI-powered fixes, PDF reports — completely free, no per-client pricing.",
		whyMatters:
			"Agencies need to audit client websites quickly and deliver professional reports. Paid tools charge per project or per client, eating into margins. SerpNap lets agencies run unlimited audits with exportable PDF reports — perfect for prospecting, onboarding new clients, and ongoing optimization reporting.",
		commonIssues: [
			"Paying $100+/mo per tool for client auditing",
			"Limited audit credits forcing rationing of client analyses",
			"Generic reports that don't show specific fixes",
			"Time wasted manually checking SEO elements",
			"No AI search visibility analysis (GEO) for modern client reporting",
			"Inability to quickly audit prospect websites before sales calls",
		],
		tips: [
			{
				title: "Use SerpNap for Sales Prospecting",
				description:
					"Before a sales call, run the prospect's website through SerpNap's SEO Checker. Walk into the meeting with specific issues and fixes — it immediately demonstrates your expertise.",
			},
			{
				title: "Include Neural Audit in Client Reports",
				description:
					"AI search visibility is a differentiator most agencies aren't offering yet. SerpNap's Neural Audit shows clients how their brand appears in ChatGPT, Gemini, and Perplexity — a compelling upsell opportunity.",
			},
			{
				title: "Run Monthly Audits for Retainer Clients",
				description:
					"SerpNap is free with no limits. Set up monthly audits for all retainer clients to track progress, catch new issues, and demonstrate ongoing value.",
			},
			{
				title: "Export PDF Reports for Clients",
				description:
					"Use SerpNap's PDF export to create professional audit reports. Include the report in your client deliverables alongside your recommendations and implementation plan.",
			},
		],
		faqs: [
			{
				question: "Can I use SerpNap for client work?",
				answer:
					"Yes. SerpNap is free for any use case including agency client audits. Run unlimited audits, export PDF reports, and use the insights in client deliverables. There are no usage limits or per-client fees.",
			},
			{
				question: "Does SerpNap offer white-label reports?",
				answer:
					"White-label branded reports are on our roadmap. Currently, PDF reports include SerpNap branding. For now, you can reference the audit data in your own agency-branded documents.",
			},
			{
				question: "How do agencies typically use SerpNap?",
				answer:
					"Three main use cases: (1) Sales prospecting — audit prospect sites before meetings, (2) Client onboarding — run baseline audits to identify quick wins, (3) Ongoing reporting — monthly audits to track progress and demonstrate ROI.",
			},
			{
				question: "Is there an API for bulk auditing?",
				answer:
					"An API is on our roadmap. Currently, SerpNap is browser-based — you audit one URL at a time. For agencies with many clients, this still works well since each audit takes under 30 seconds.",
			},
		],
	},
];

export function getIndustry(slug: string): IndustryData | undefined {
	return industries.find((i) => i.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
	return industries.map((i) => i.slug);
}

export function getAllIndustries(): IndustryData[] {
	return industries;
}
