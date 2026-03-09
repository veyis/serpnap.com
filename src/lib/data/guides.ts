export interface GuideData {
	slug: string;
	action: string;
	metaTitle: string;
	metaDescription: string;
	keywords: string[];
	heroTitle: string;
	heroSubtitle: string;
	steps: { title: string; description: string }[];
	toolSlug: string;
	toolName: string;
	whyItMatters: string;
	proTips: string[];
	faqs: { question: string; answer: string }[];
}

const guides: GuideData[] = [
	{
		slug: "check-seo-score",
		action: "Check Your SEO Score",
		metaTitle:
			"How to Check Your SEO Score — Free Step-by-Step Guide | SerpNap",
		metaDescription:
			"Learn how to check your SEO score for free. Step-by-step guide using SerpNap's SEO Checker to audit 50+ ranking factors and get AI-powered fix suggestions.",
		keywords: [
			"how to check seo score",
			"check my seo",
			"seo score checker",
			"check website seo score free",
			"how to check seo of a website",
		],
		heroTitle: "How to Check Your SEO Score",
		heroSubtitle:
			"A step-by-step guide to auditing your website's SEO health across 50+ ranking factors — completely free, no signup required.",
		steps: [
			{
				title: "Open the SEO Checker tool",
				description:
					"Navigate to SerpNap's SEO Checker. No signup, login, or installation is needed — the tool runs directly in your browser.",
			},
			{
				title: "Enter your website URL",
				description:
					"Paste the full URL of the page you want to audit (e.g., https://example.com). You can check any publicly accessible page, including competitor sites.",
			},
			{
				title: "Run the audit",
				description:
					"Click the analyze button and wait approximately 15-30 seconds. SerpNap fetches your live page and runs 50+ checks covering meta tags, headings, images, performance, structured data, and more.",
			},
			{
				title: "Review your overall score",
				description:
					"Your SEO score appears at the top of the report on a 0-100 scale. Scores above 80 are strong, 60-80 need improvement, and below 60 require immediate attention.",
			},
			{
				title: "Examine individual checks",
				description:
					"Scroll through each category — on-page SEO, technical health, content quality, E-E-A-T signals, and accessibility. Each check shows pass, warning, or fail status with an explanation.",
			},
			{
				title: "Apply AI-powered fixes",
				description:
					"For every issue found, SerpNap provides an AI-generated fix with actual code you can copy-paste into your site. No guesswork needed — just implement the suggestions.",
			},
			{
				title: "Re-audit to verify improvements",
				description:
					"After making changes, run the audit again to confirm your score improved. SerpNap is free with no usage limits, so audit as often as you need.",
			},
		],
		toolSlug: "seo-checker",
		toolName: "SEO Checker",
		whyItMatters:
			"Your SEO score is a snapshot of how well your page is optimized for search engines. A low score means search engines struggle to understand, crawl, and rank your content — which directly translates to lost organic traffic and revenue. Regular audits catch issues before they impact rankings, helping you stay ahead of competitors and algorithm updates.",
		proTips: [
			"Audit your homepage and your top 5 traffic-generating pages first — these have the highest impact on overall organic performance.",
			"Check competitor pages to benchmark your score against theirs and identify optimization gaps.",
			"Run audits after every major content update or site change to catch regressions early.",
			"Focus on fixing critical (red) issues first before addressing warnings — they have the biggest impact on rankings.",
			"Export the PDF report to share with your team or developer for implementation.",
		],
		faqs: [
			{
				question: "What is a good SEO score?",
				answer:
					"An SEO score above 80 out of 100 is considered strong. Scores between 60-80 indicate room for improvement, while anything below 60 means there are significant issues that likely hurt your search rankings. However, focus on fixing individual issues rather than chasing a perfect score.",
			},
			{
				question: "How often should I check my SEO score?",
				answer:
					"At minimum monthly, and after any major website change (new content, redesign, plugin updates, hosting migration). SerpNap is free with no limits, so you can check as often as you want.",
			},
			{
				question: "Is SerpNap's SEO score accurate?",
				answer:
					"SerpNap analyzes your live page against 50+ known ranking factors based on Google's documented best practices. It checks the same elements that Google's crawler evaluates — meta tags, headings, images, structured data, performance, and more.",
			},
			{
				question: "Can I check my competitor's SEO score?",
				answer:
					"Yes. Just enter any publicly accessible URL into the SEO Checker. This is a great way to benchmark your optimization against competitors and find areas where you can gain an edge.",
			},
			{
				question: "Do I need to sign up to check my SEO score?",
				answer:
					"No. SerpNap is completely free with no signup, no email capture, and no credit card required. Just enter a URL and get your full audit instantly.",
			},
		],
	},
	{
		slug: "find-broken-links",
		action: "Find Broken Links",
		metaTitle:
			"How to Find Broken Links on Your Website — Free Guide | SerpNap",
		metaDescription:
			"Learn how to find and fix broken links on your website. Step-by-step guide using SerpNap's Broken Link Checker to detect dead links, 404 errors, and redirect chains.",
		keywords: [
			"how to find broken links",
			"find dead links on website",
			"broken link checker",
			"find 404 errors on website",
			"check broken links free",
		],
		heroTitle: "How to Find Broken Links on Your Website",
		heroSubtitle:
			"Detect dead links, 404 errors, and redirect chains that hurt your SEO and user experience — with a free, instant scan.",
		steps: [
			{
				title: "Open the Broken Link Checker",
				description:
					"Go to SerpNap's Broken Link Checker. It works in any browser with no downloads or account creation required.",
			},
			{
				title: "Enter your page URL",
				description:
					"Paste the URL of the page you want to scan. The tool will crawl all outbound and internal links found on that page.",
			},
			{
				title: "Start the scan",
				description:
					"Click scan and wait while the tool checks every link on the page. It tests each URL's HTTP status code to identify broken, redirected, and healthy links.",
			},
			{
				title: "Review broken links (4xx/5xx errors)",
				description:
					"Links returning 404 (Not Found), 410 (Gone), or 500 (Server Error) status codes are flagged. These are your priority fixes — they create dead ends for users and waste crawl budget.",
			},
			{
				title: "Check redirect chains",
				description:
					"Links that redirect (301/302) are highlighted. Single redirects are fine, but chains of 2+ redirects slow page load and dilute link equity.",
			},
			{
				title: "Fix or remove broken links",
				description:
					"Update broken links to point to the correct URL, replace them with relevant alternatives, or remove them entirely. For redirects, update links to point to the final destination URL.",
			},
		],
		toolSlug: "broken-link-checker",
		toolName: "Broken Link Checker",
		whyItMatters:
			"Broken links create a poor user experience and signal neglect to search engines. Google's crawler wastes budget following dead links instead of indexing your valuable content. Studies show that pages with broken outbound links can rank lower than equivalent pages with all-healthy links. Fixing broken links is one of the fastest SEO wins available.",
		proTips: [
			"Check your most important pages first — homepage, top landing pages, and key product/service pages.",
			"Set a quarterly reminder to scan for broken links, as external sites can change or go offline at any time.",
			"For links pointing to removed pages on your own site, set up 301 redirects to the most relevant replacement page.",
			"Use the anchor text of the broken link to find a suitable replacement — search for the topic and link to an updated resource.",
			"Pay special attention to links in your navigation and footer — these appear on every page and multiply the impact of any broken link.",
		],
		faqs: [
			{
				question: "How do broken links affect SEO?",
				answer:
					"Broken links waste crawl budget, create poor user signals (high bounce rate from 404 pages), and can prevent link equity from flowing through your site. Google has confirmed that extensive broken links indicate a poorly maintained site.",
			},
			{
				question: "What is the difference between a 404 and a 410?",
				answer:
					"A 404 means 'Not Found' (the page might return later), while a 410 means 'Gone' (permanently removed). Google processes 410s faster for deindexing. Use 410 when you've intentionally removed a page with no replacement.",
			},
			{
				question: "How often should I check for broken links?",
				answer:
					"At minimum quarterly. External websites change frequently — pages get moved, domains expire, and content gets reorganized. High-traffic sites should check monthly.",
			},
			{
				question: "Can broken links on external sites hurt my SEO?",
				answer:
					"Yes. Linking to broken external pages hurts user experience and can signal poor content quality to search engines. Regularly verify that your outbound links still work.",
			},
		],
	},
	{
		slug: "check-meta-tags",
		action: "Check Meta Tags",
		metaTitle:
			"How to Check Meta Tags on Any Website — Free Guide | SerpNap",
		metaDescription:
			"Learn how to check and optimize meta tags for SEO. Step-by-step guide to auditing title tags, meta descriptions, and Open Graph tags with SerpNap's free tools.",
		keywords: [
			"how to check meta tags",
			"meta tag checker",
			"check meta description",
			"view meta tags of a website",
			"meta tag analyzer free",
		],
		heroTitle: "How to Check Meta Tags on Any Website",
		heroSubtitle:
			"Audit title tags, meta descriptions, Open Graph tags, and more — see exactly how your pages appear in Google and social media.",
		steps: [
			{
				title: "Open the Meta Tag Generator",
				description:
					"Navigate to SerpNap's Meta Tag Generator. This tool both generates and analyzes meta tags for any URL.",
			},
			{
				title: "Enter the page URL to analyze",
				description:
					"Paste the URL of the page whose meta tags you want to inspect. The tool fetches the live page and extracts all meta information.",
			},
			{
				title: "Review the title tag",
				description:
					"Check your title tag length (50-60 characters is optimal), keyword placement (primary keyword near the start), and uniqueness. The tool shows a live Google SERP preview of how it appears in search results.",
			},
			{
				title: "Check the meta description",
				description:
					"Verify your meta description is 150-160 characters, includes target keywords naturally, and contains a compelling call to action. The SERP preview shows if it gets truncated.",
			},
			{
				title: "Inspect Open Graph and Twitter tags",
				description:
					"Review og:title, og:description, og:image, and Twitter card tags. These control how your page appears when shared on social media platforms.",
			},
			{
				title: "Generate optimized tags",
				description:
					"Use the generator to create improved meta tags based on best practices. Copy the generated HTML code and add it to your page's head section.",
			},
		],
		toolSlug: "meta-tag-generator",
		toolName: "Meta Tag Generator",
		whyItMatters:
			"Meta tags are the first thing users see in search results — your title tag and meta description are your ad copy for organic search. Pages with optimized, compelling meta tags see 20-30% higher click-through rates compared to those with missing or auto-generated tags. Since CTR is a ranking signal, better meta tags can directly improve your search positions.",
		proTips: [
			"Front-load your primary keyword in the title tag — Google gives more weight to words appearing earlier.",
			"Write meta descriptions as sales copy, not summaries. Include a benefit and a call to action (e.g., 'Learn how...' or 'Get started free').",
			"Always set a custom og:image (1200x630px) for social sharing — pages with images get 2-3x more engagement on social platforms.",
			"Use unique meta tags for every page. Duplicate titles and descriptions confuse search engines about which page to rank.",
			"Check how your tags render on mobile — Google shows fewer characters on mobile search results.",
		],
		faqs: [
			{
				question: "What are the most important meta tags for SEO?",
				answer:
					"The title tag and meta description are the most impactful for SEO and click-through rates. The canonical tag prevents duplicate content issues. Open Graph tags (og:title, og:description, og:image) control social media appearance. Robots meta tag controls indexing behavior.",
			},
			{
				question: "What is the ideal title tag length?",
				answer:
					"50-60 characters. Google typically displays the first 50-60 characters of a title tag in search results. Longer titles get truncated with an ellipsis, which can cut off important information.",
			},
			{
				question: "Do meta tags directly affect rankings?",
				answer:
					"The title tag is a confirmed ranking factor. The meta description is not a direct ranking factor, but it heavily influences click-through rate, which does affect rankings. Well-optimized meta tags lead to more clicks, better engagement signals, and higher rankings.",
			},
			{
				question: "Can I check meta tags without viewing page source?",
				answer:
					"Yes. SerpNap's Meta Tag Generator extracts and displays all meta tags in a clean interface with validation and optimization suggestions — no need to dig through HTML source code.",
			},
		],
	},
	{
		slug: "test-page-speed",
		action: "Test Page Speed",
		metaTitle:
			"How to Test Page Speed — Free Step-by-Step Guide | SerpNap",
		metaDescription:
			"Learn how to test your website's page speed and Core Web Vitals. Step-by-step guide to measuring load time, LCP, FID, and CLS with SerpNap's free estimator.",
		keywords: [
			"how to test page speed",
			"check website speed",
			"page speed test free",
			"website speed checker",
			"test site load time",
		],
		heroTitle: "How to Test Your Page Speed",
		heroSubtitle:
			"Measure your website's load time and Core Web Vitals, then get actionable optimization suggestions to make your pages faster.",
		steps: [
			{
				title: "Open the Page Speed Estimator",
				description:
					"Navigate to SerpNap's Page Speed Estimator. The tool analyzes page weight, resource counts, and estimated load performance without needing any setup.",
			},
			{
				title: "Enter your page URL",
				description:
					"Paste the URL of the page you want to test. For the most useful results, test your homepage, key landing pages, and your slowest pages.",
			},
			{
				title: "Review the performance overview",
				description:
					"The estimator shows total page weight, number of requests, estimated load time, and key performance indicators. Look for anything that seems unusually heavy.",
			},
			{
				title: "Analyze resource breakdown",
				description:
					"Review the breakdown by resource type — images, JavaScript, CSS, fonts, and third-party resources. Images and JavaScript are typically the largest contributors to slow pages.",
			},
			{
				title: "Check optimization suggestions",
				description:
					"The tool provides specific recommendations: compress images to WebP/AVIF, minify CSS/JS, defer non-critical scripts, enable lazy loading, and reduce server response time.",
			},
			{
				title: "Implement fixes and re-test",
				description:
					"Apply the suggested optimizations one at a time, then re-test to measure improvement. Prioritize changes that reduce the largest resource sizes first.",
			},
		],
		toolSlug: "page-speed-estimator",
		toolName: "Page Speed Estimator",
		whyItMatters:
			"Page speed is a confirmed Google ranking factor for both desktop and mobile. Pages that load in under 2.5 seconds see significantly lower bounce rates and higher conversion rates. Google's Core Web Vitals (LCP, FID, CLS) directly influence rankings — slow pages lose positions to faster competitors, even if the content quality is similar.",
		proTips: [
			"Test on mobile first — Google uses mobile-first indexing, so mobile speed matters more than desktop for rankings.",
			"Images are usually the biggest performance drag. Convert to WebP/AVIF and use responsive srcset attributes to serve appropriately sized images.",
			"Defer JavaScript that is not needed for the initial render. Most analytics, chat widgets, and social embeds can load after the page is visible.",
			"Enable browser caching headers (Cache-Control, ETag) so repeat visitors load pages instantly from cache.",
			"Consider a CDN (Content Delivery Network) if your audience is geographically distributed — it can reduce latency by 50%+.",
		],
		faqs: [
			{
				question: "What is a good page load time?",
				answer:
					"Under 2.5 seconds for Largest Contentful Paint (LCP) is Google's 'good' threshold. Under 1.5 seconds is considered fast. Anything over 4 seconds is poor and will likely hurt both rankings and user experience.",
			},
			{
				question: "What are Core Web Vitals?",
				answer:
					"Core Web Vitals are three metrics Google uses to measure user experience: LCP (Largest Contentful Paint — loading speed), FID/INP (First Input Delay/Interaction to Next Paint — interactivity), and CLS (Cumulative Layout Shift — visual stability). All three affect rankings.",
			},
			{
				question: "Does page speed really affect SEO rankings?",
				answer:
					"Yes. Google confirmed page speed as a ranking factor in 2018 (Speed Update) and strengthened it with the Page Experience Update in 2021. While great content can outweigh speed disadvantages, all else being equal, faster pages rank higher.",
			},
			{
				question: "How can I make my website faster quickly?",
				answer:
					"The three fastest wins: (1) compress and convert images to WebP, (2) remove unused JavaScript and CSS, and (3) enable GZIP/Brotli compression on your server. These three changes alone can cut load time by 40-60%.",
			},
		],
	},
	{
		slug: "validate-schema-markup",
		action: "Validate Schema Markup",
		metaTitle:
			"How to Validate Schema Markup — Free Step-by-Step Guide | SerpNap",
		metaDescription:
			"Learn how to test and validate schema markup (structured data) on your website. Step-by-step guide to checking JSON-LD, rich snippets, and fixing common errors.",
		keywords: [
			"how to test schema markup",
			"validate structured data",
			"schema markup checker",
			"test json-ld",
			"structured data validator free",
		],
		heroTitle: "How to Validate Schema Markup",
		heroSubtitle:
			"Test your structured data, verify JSON-LD syntax, and ensure your pages are eligible for rich snippets in Google Search.",
		steps: [
			{
				title: "Open the Schema Generator",
				description:
					"Navigate to SerpNap's Schema Generator. It supports all major schema types including Article, Product, LocalBusiness, FAQPage, HowTo, and more.",
			},
			{
				title: "Select your schema type",
				description:
					"Choose the schema type that matches your page content. Product pages need Product schema, blog posts need Article schema, FAQ sections need FAQPage schema, and so on.",
			},
			{
				title: "Fill in the required fields",
				description:
					"Enter the required properties for your chosen schema type. The generator highlights which fields are required by Google for rich result eligibility versus optional enhancements.",
			},
			{
				title: "Generate the JSON-LD code",
				description:
					"Click generate to produce valid JSON-LD structured data. The output is a script tag you can paste directly into your page's HTML head or body section.",
			},
			{
				title: "Validate the output",
				description:
					"Copy the generated JSON-LD and test it in Google's Rich Results Test to confirm eligibility for rich snippets. Fix any errors or warnings flagged by the validator.",
			},
			{
				title: "Add the schema to your page",
				description:
					"Paste the JSON-LD script tag into your page's HTML. The recommended placement is in the head section, though Google also processes it in the body. Deploy and re-validate on the live page.",
			},
		],
		toolSlug: "schema-generator",
		toolName: "Schema Generator",
		whyItMatters:
			"Schema markup helps search engines understand your content and can unlock rich results — star ratings, FAQ dropdowns, recipe cards, product prices, and more — directly in Google Search. Pages with rich results see 20-40% higher click-through rates. Without structured data, you are leaving these enhanced listings to your competitors.",
		proTips: [
			"Start with the schema types that offer visible rich results: FAQPage, HowTo, Product (with reviews), and Article. These have the highest CTR impact.",
			"Always include the 'image' property when available — Google strongly prefers schema entries with associated images for rich results.",
			"Use JSON-LD format (not Microdata or RDFa). Google recommends JSON-LD and it is easier to implement and maintain.",
			"Test your schema on the live page, not just the generated code. Sometimes CMS or JavaScript can interfere with how the schema is rendered.",
			"Monitor Google Search Console's Enhancements report to track which rich results Google is showing for your pages.",
		],
		faqs: [
			{
				question: "What is schema markup?",
				answer:
					"Schema markup is structured data code (usually JSON-LD) you add to your web pages to help search engines understand your content. It uses a vocabulary from Schema.org to describe things like products, articles, events, recipes, and businesses in a way search engines can parse.",
			},
			{
				question: "Does schema markup improve rankings?",
				answer:
					"Schema markup is not a direct ranking factor, but it enables rich results (enhanced listings in Google) that significantly increase click-through rates. Higher CTR sends positive user signals to Google, which can indirectly improve rankings.",
			},
			{
				question: "What is JSON-LD?",
				answer:
					"JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data. It is a script tag you add to your HTML that contains your schema data in JSON format. It is easy to add and remove without touching your page's visible content.",
			},
			{
				question: "How do I know if my schema is working?",
				answer:
					"Use Google's Rich Results Test to validate your schema on the live page. Then check Google Search Console's Enhancements section — it shows which schema types Google has detected and any errors preventing rich results.",
			},
		],
	},
	{
		slug: "check-redirects",
		action: "Check Redirects",
		metaTitle:
			"How to Check Redirects — Free Step-by-Step Guide | SerpNap",
		metaDescription:
			"Learn how to check URL redirects and redirect chains. Step-by-step guide to tracing 301/302 redirects, finding chains, and fixing redirect issues with SerpNap's free tool.",
		keywords: [
			"how to check redirects",
			"redirect chain checker",
			"check 301 redirect",
			"trace url redirect",
			"redirect checker free",
		],
		heroTitle: "How to Check Redirects",
		heroSubtitle:
			"Trace redirect paths, detect chains and loops, and verify that your 301/302 redirects are working correctly for SEO.",
		steps: [
			{
				title: "Open the Redirect Checker",
				description:
					"Navigate to SerpNap's Redirect Checker. The tool traces the full redirect path from the initial URL to the final destination.",
			},
			{
				title: "Enter the URL to check",
				description:
					"Paste the URL you want to trace. This can be an old URL you've redirected, a shortened link, or any URL you suspect has redirects in place.",
			},
			{
				title: "Run the redirect trace",
				description:
					"Click check and the tool follows every redirect hop, recording each URL and its HTTP status code (301, 302, 307, etc.) along the way.",
			},
			{
				title: "Review the redirect chain",
				description:
					"The results show each step in the redirect path. A direct redirect (one hop) is ideal. Chains of 2+ hops slow page load and dilute link equity.",
			},
			{
				title: "Identify issues",
				description:
					"Look for: redirect chains (more than one hop), redirect loops (URL redirecting back to itself), 302 temporary redirects that should be 301 permanent, and redirects landing on 404 pages.",
			},
			{
				title: "Fix redirect issues",
				description:
					"Shorten chains by pointing the original URL directly to the final destination. Convert 302s to 301s for permanent moves. Remove loops. Update internal links to point to the final URL, bypassing redirects entirely.",
			},
		],
		toolSlug: "redirect-checker",
		toolName: "Redirect Checker",
		whyItMatters:
			"Redirect chains slow down page loading (each hop adds latency), dilute PageRank (link equity), and waste crawl budget. Google follows up to 10 redirects but recommends keeping chains as short as possible. A single redirect from the old URL to the final URL preserves the most SEO value and provides the fastest user experience.",
		proTips: [
			"After a site migration, check all your old URLs to ensure they redirect to the correct new pages — not to the homepage or a 404.",
			"Use 301 (permanent) redirects for SEO. 302 (temporary) redirects do not pass full link equity to the destination URL.",
			"Update all internal links to point to final URLs, not redirected ones. Even a 301 redirect adds a small amount of latency.",
			"Check your redirects from both HTTP and HTTPS versions of your URLs — misconfigured HTTPS redirects are a common issue.",
			"Monitor redirect chains quarterly, as CMS updates and plugin changes can introduce unexpected redirects.",
		],
		faqs: [
			{
				question: "What is a redirect chain?",
				answer:
					"A redirect chain occurs when a URL redirects to another URL, which then redirects to yet another URL (A -> B -> C). Each hop adds latency and can dilute link equity. Ideally, redirects should go directly from the source to the final destination (A -> C).",
			},
			{
				question: "What is the difference between a 301 and 302 redirect?",
				answer:
					"A 301 is a permanent redirect — it tells search engines the page has moved permanently and to transfer ranking signals to the new URL. A 302 is temporary — search engines keep the original URL indexed. Use 301 for permanent moves and 302 only for genuinely temporary situations.",
			},
			{
				question: "How many redirects is too many?",
				answer:
					"Google follows up to 10 redirect hops, but best practice is one hop or none. Each additional redirect adds latency (typically 50-100ms per hop) and can reduce the link equity passed to the final URL.",
			},
			{
				question: "Do redirects hurt SEO?",
				answer:
					"A single, properly implemented 301 redirect preserves most SEO value. However, redirect chains, loops, and 302s used incorrectly can hurt rankings by diluting link equity, slowing page load, and wasting crawl budget.",
			},
		],
	},
	{
		slug: "analyze-keywords",
		action: "Analyze Keywords",
		metaTitle:
			"How to Check Keyword Density — Free Step-by-Step Guide | SerpNap",
		metaDescription:
			"Learn how to analyze keyword density on any page. Step-by-step guide to checking keyword usage, finding over-optimization, and improving content with SerpNap's free tool.",
		keywords: [
			"how to check keyword density",
			"keyword analysis",
			"keyword density checker",
			"analyze keyword usage",
			"keyword frequency checker free",
		],
		heroTitle: "How to Analyze Keyword Density",
		heroSubtitle:
			"Check keyword usage, spot over-optimization, and improve your content's relevance with n-gram analysis — free and instant.",
		steps: [
			{
				title: "Open the Keyword Density Checker",
				description:
					"Navigate to SerpNap's Keyword Density Checker. The tool analyzes word frequency and n-gram patterns on any page.",
			},
			{
				title: "Enter your page URL or paste content",
				description:
					"You can either enter a live URL for the tool to fetch, or paste your content directly for analysis. Use URL mode for published pages and paste mode for drafts.",
			},
			{
				title: "Review single-word frequency",
				description:
					"The tool shows the most frequently used single words (unigrams), excluding common stop words. Check that your target keyword appears frequently enough but not excessively.",
			},
			{
				title: "Analyze two-word and three-word phrases",
				description:
					"Review bigram (two-word) and trigram (three-word) frequencies. These reveal your content's topical focus and help you identify whether your target key phrases appear naturally throughout the text.",
			},
			{
				title: "Check for over-optimization",
				description:
					"If any keyword appears at a density above 3%, it may trigger keyword stuffing penalties. The tool flags potentially over-optimized terms so you can diversify your language.",
			},
			{
				title: "Optimize and re-check",
				description:
					"Adjust your content: add synonyms and related terms for over-used keywords, increase mentions of under-used target keywords, and ensure natural readability. Re-run the analysis to verify.",
			},
		],
		toolSlug: "keyword-density-checker",
		toolName: "Keyword Density Checker",
		whyItMatters:
			"Keyword density helps search engines understand what your page is about. Too few mentions of your target keyword and Google may not associate your page with that topic. Too many mentions and you risk keyword stuffing penalties. The ideal approach is natural keyword usage supplemented with synonyms, related terms, and semantic variations that signal topical authority.",
		proTips: [
			"Aim for 1-2% keyword density for your primary keyword — enough for relevance without triggering over-optimization filters.",
			"Use LSI (Latent Semantic Indexing) keywords — related terms and synonyms that support your primary keyword's topic.",
			"Check competitor pages for their keyword density to understand what Google already ranks for your target terms.",
			"Pay attention to bigrams and trigrams — these often reveal whether your content naturally covers the topic or just repeats single keywords.",
			"Analyze your content before publishing, not just after. It is easier to optimize during the writing process.",
		],
		faqs: [
			{
				question: "What is keyword density?",
				answer:
					"Keyword density is the percentage of times a keyword or phrase appears on a page relative to the total word count. For example, if a keyword appears 10 times in a 1,000-word article, the keyword density is 1%.",
			},
			{
				question: "What is the ideal keyword density?",
				answer:
					"There is no exact ideal number, but most SEO experts recommend 1-2% for your primary keyword. More important than hitting a specific number is using keywords naturally and including related terms, synonyms, and semantic variations.",
			},
			{
				question: "What is keyword stuffing?",
				answer:
					"Keyword stuffing is the practice of overloading a page with a target keyword to manipulate rankings. Google penalizes this. Signs include keyword density above 3%, unnatural repetition, and keywords forced into content where they do not make sense.",
			},
			{
				question: "Does keyword density still matter for SEO?",
				answer:
					"While Google's algorithms have evolved beyond simple keyword counting, keyword density is still a useful diagnostic tool. It helps ensure your content mentions target terms enough to be relevant, while flagging potential over-optimization before it becomes a problem.",
			},
		],
	},
];

export function getGuide(slug: string): GuideData | undefined {
	return guides.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
	return guides.map((g) => g.slug);
}

export function getAllGuides(): GuideData[] {
	return guides;
}
