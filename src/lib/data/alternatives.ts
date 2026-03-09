export interface AlternativeData {
	slug: string;
	competitorName: string;
	competitorPrice: string;
	metaTitle: string;
	metaDescription: string;
	keywords: string[];
	heroTitle: string;
	heroSubtitle: string;
	whySwitch: string[];
	whatYouGet: string[];
	whatYouMiss: string[];
	verdict: string;
	faqs: Array<{ question: string; answer: string }>;
}

const alternatives: AlternativeData[] = [
	{
		slug: "semrush",
		competitorName: "Semrush",
		competitorPrice: "$139.95/mo",
		metaTitle:
			"Free Semrush Alternative — SerpNap SEO Tools (No Signup)",
		metaDescription:
			"Looking for a free Semrush alternative? SerpNap offers 13+ professional SEO tools — site audit, meta tag generator, schema builder, and more — completely free.",
		keywords: [
			"free semrush alternative",
			"semrush alternative",
			"semrush alternative free",
			"semrush free alternative 2026",
			"tools like semrush but free",
			"semrush replacement free",
			"cheap semrush alternative",
		],
		heroTitle: "The Free Semrush Alternative",
		heroSubtitle:
			"Get professional-grade SEO audits, meta tag optimization, and structured data generation — without Semrush's $139.95/mo price tag.",
		whySwitch: [
			"Save $1,679/year — SerpNap is 100% free, no credit card needed",
			"No signup or account required — just enter a URL and get results",
			"AI-powered fix suggestions — not just dashboards, actual code fixes",
			"50+ SEO checks per audit covering meta tags, performance, E-E-A-T, and accessibility",
			"Instant results in under 30 seconds — no crawl queue or waiting",
			"Neural Audit for AI/GEO visibility across ChatGPT, Gemini, and Perplexity",
		],
		whatYouGet: [
			"Comprehensive SEO Checker with 50+ ranking factor checks",
			"Technical Audit for crawlability, indexing, and Core Web Vitals",
			"Neural Audit for AI search engine visibility (GEO)",
			"Meta Tag Generator with live SERP preview",
			"Schema Generator for JSON-LD structured data",
			"Headline Analyzer with emotional scoring",
			"Keyword Density Checker with n-gram analysis",
			"Page Speed Estimator with optimization suggestions",
			"Sitemap Validator, Redirect Checker, Robots.txt Generator",
			"Word Counter and Open Graph Checker",
			"PDF report export for sharing with teams or clients",
		],
		whatYouMiss: [
			"Keyword research database (Semrush has 26B+ keywords)",
			"Backlink database and link building tools",
			"Rank tracking and position monitoring",
			"Competitive analysis and domain comparison",
			"PPC and advertising research tools",
			"Content marketing platform and topic research",
		],
		verdict:
			"SerpNap replaces Semrush's Site Audit, On-Page SEO Checker, and SEO Writing Assistant — all for free. If you primarily need site auditing and on-page optimization, SerpNap covers that completely. If you need keyword research, backlink analysis, or rank tracking, you'll still need a paid tool (or combine SerpNap with free tiers of other tools).",
		faqs: [
			{
				question: "Can SerpNap fully replace Semrush?",
				answer:
					"For site auditing, on-page SEO, meta tag optimization, and technical checks — yes. SerpNap's SEO Checker runs 50+ checks that overlap with Semrush's Site Audit. However, Semrush offers keyword research, backlink databases, rank tracking, and competitive analysis that SerpNap does not cover. Many users combine SerpNap (free audits) with free tiers of keyword tools.",
			},
			{
				question: "Is SerpNap really free or is there a catch?",
				answer:
					"SerpNap is genuinely free with no usage limits, no signup, and no credit card required. It's built by PxlPeak, a digital agency — the tools are free to help website owners identify SEO issues, and those who want hands-on implementation can work with the agency team.",
			},
			{
				question:
					"How does SerpNap's audit compare to Semrush's Site Audit?",
				answer:
					"Both check meta tags, headings, images, performance, and crawlability. SerpNap adds AI-powered fix suggestions (actual code you can copy-paste), E-E-A-T signal analysis, accessibility auditing, and Neural Audit for AI search visibility — features Semrush charges extra for or doesn't offer.",
			},
			{
				question:
					"What's the best free stack to replace Semrush entirely?",
				answer:
					"SerpNap (site audits + on-page SEO) + Google Search Console (rank tracking + indexing) + Google Keyword Planner (keyword research) + Ahrefs Webmaster Tools (free backlink data for your own site). This combination covers most of what Semrush offers at $0/month.",
			},
			{
				question:
					"Does SerpNap have an API like Semrush?",
				answer:
					"Not yet, but it's on our roadmap. Currently, SerpNap's tools are browser-based with instant results. You can export PDF reports for sharing with teams and clients.",
			},
		],
	},
	{
		slug: "ahrefs",
		competitorName: "Ahrefs",
		competitorPrice: "$129/mo",
		metaTitle:
			"Free Ahrefs Alternative — SerpNap SEO Audit Tools (No Signup)",
		metaDescription:
			"Looking for a free Ahrefs alternative? SerpNap offers instant SEO audits, technical analysis, and AI-powered fixes — completely free, no account needed.",
		keywords: [
			"free ahrefs alternative",
			"ahrefs alternative",
			"ahrefs alternative free",
			"ahrefs free alternative 2026",
			"tools like ahrefs but free",
			"ahrefs replacement free",
			"cheap ahrefs alternative",
		],
		heroTitle: "The Free Ahrefs Alternative",
		heroSubtitle:
			"Professional SEO auditing without Ahrefs' $129/mo subscription. Instant results, AI-powered fixes, zero signup.",
		whySwitch: [
			"Save $1,548/year — all SerpNap tools are permanently free",
			"No signup, no trial expiration — use instantly, forever",
			"AI-generated code fixes for every issue found — not just raw data",
			"GEO/AEO analysis — check AI search visibility (not available in Ahrefs)",
			"50+ SEO checks including E-E-A-T signals and accessibility",
			"Faster results — full audit in under 30 seconds, no crawl needed",
		],
		whatYouGet: [
			"SEO Checker with 50+ on-page ranking factor checks",
			"Technical Audit covering server headers, crawlability, and Core Web Vitals",
			"Neural Audit for brand visibility in AI search engines",
			"Meta Tag Generator with live Google SERP preview",
			"Schema Generator for rich snippets (JSON-LD)",
			"Headline Analyzer, Keyword Density Checker, Page Speed Estimator",
			"Sitemap Validator, Redirect Checker, Robots.txt Generator",
			"Word Counter and Open Graph Checker",
			"Downloadable PDF audit reports",
		],
		whatYouMiss: [
			"Backlink index (Ahrefs has the largest backlink database)",
			"Keyword Explorer with search volume and difficulty",
			"Rank Tracker for monitoring keyword positions",
			"Content Explorer for finding linkable content",
			"Site Explorer for competitive domain analysis",
			"Batch analysis for multiple URLs at once",
		],
		verdict:
			"SerpNap replaces Ahrefs' Site Audit and Webmaster Tools audit functionality for free. If your primary need is auditing your own website for on-page SEO issues, SerpNap delivers equivalent analysis at zero cost. Ahrefs excels at backlink research and keyword data — if those are critical to your workflow, consider combining SerpNap (free audits) with Ahrefs' free Webmaster Tools (limited backlink data for your own sites).",
		faqs: [
			{
				question: "Can SerpNap replace Ahrefs for SEO audits?",
				answer:
					"Yes. For on-page SEO auditing, SerpNap's 50+ checks cover the same ranking factors as Ahrefs' Site Audit — meta tags, headings, images, Core Web Vitals, structured data, and more. SerpNap adds AI-powered code fixes and GEO analysis that Ahrefs doesn't offer.",
			},
			{
				question: "Does SerpNap have backlink analysis like Ahrefs?",
				answer:
					"Not yet. Ahrefs has the largest backlink database in the industry, and SerpNap focuses on on-page auditing rather than off-page analysis. For backlinks, you can use Ahrefs' free Webmaster Tools (limited to your own sites) alongside SerpNap.",
			},
			{
				question:
					"Is SerpNap's data as reliable as Ahrefs?",
				answer:
					"For on-page analysis, yes — SerpNap fetches and analyzes your live page in real time, same as Ahrefs' Site Audit. The difference is that SerpNap also provides AI-generated fixes and checks your AI search visibility (GEO), which Ahrefs does not.",
			},
			{
				question: "How do I replace Ahrefs for free?",
				answer:
					"Use SerpNap for site audits + Google Search Console for rank tracking + Google Keyword Planner for keyword research + Ahrefs Webmaster Tools for your own site's backlink data. This free stack covers most SEO workflows.",
			},
			{
				question: "Does SerpNap require an account?",
				answer:
					"No. Unlike Ahrefs which requires a paid subscription for most features, SerpNap is instant — just enter a URL and get your full audit. No signup, no credit card, no trial period.",
			},
		],
	},
	{
		slug: "moz",
		competitorName: "Moz Pro",
		competitorPrice: "$99/mo",
		metaTitle:
			"Free Moz Alternative — SerpNap SEO Tools (No Signup)",
		metaDescription:
			"Looking for a free Moz Pro alternative? SerpNap gives you instant SEO audits, AI-powered fixes, and technical analysis — all free, no account required.",
		keywords: [
			"free moz alternative",
			"moz alternative",
			"moz pro alternative free",
			"moz alternative free 2026",
			"tools like moz but free",
			"moz pro replacement",
			"moz free alternative",
		],
		heroTitle: "The Free Moz Pro Alternative",
		heroSubtitle:
			"Everything Moz's Site Crawl does — plus AI-powered fixes and GEO analysis — without the $99/mo subscription.",
		whySwitch: [
			"Save $1,188/year — SerpNap is completely free forever",
			"No 30-day trial that expires — use all tools indefinitely",
			"AI-generated fixes — actual code, not just recommendations",
			"GEO/AEO analysis for AI search visibility (not in Moz)",
			"Instant results — no crawl queue, results in under 30 seconds",
			"13+ specialized tools vs. Moz's bundled dashboard approach",
		],
		whatYouGet: [
			"SEO Checker with 50+ checks (vs. Moz's page optimization score)",
			"Technical Audit with server analysis and Core Web Vitals",
			"Neural Audit for AI/GEO search engine visibility",
			"Meta Tag Generator with character counts and SERP preview",
			"Schema Generator for structured data (JSON-LD)",
			"Headline Analyzer, Keyword Density, Page Speed tools",
			"Sitemap Validator, Redirect Checker, Robots.txt Generator",
			"Word Counter and Open Graph Checker",
			"PDF export for client reporting",
		],
		whatYouMiss: [
			"Domain Authority (DA) and Page Authority (PA) metrics",
			"Keyword Explorer with SERP analysis",
			"Link Explorer for backlink research",
			"Rank tracking and position monitoring",
			"MozBar Chrome extension",
			"Scheduled automated site crawls",
		],
		verdict:
			"SerpNap replaces Moz's Site Crawl and On-Page Grader functionality entirely — for free. If Domain Authority scoring and keyword research are important to your workflow, Moz still holds value. But for teams that primarily need to audit and fix on-page SEO issues, SerpNap delivers better results (AI fixes + GEO analysis) at zero cost.",
		faqs: [
			{
				question: "Can SerpNap replace Moz Pro?",
				answer:
					"For on-page SEO auditing and optimization, yes. SerpNap's 50+ checks cover what Moz's Site Crawl and On-Page Grader offer, plus AI-powered fixes and AI search visibility analysis. For Domain Authority, keyword research, and link analysis, you'd still need Moz or an alternative.",
			},
			{
				question: "Does SerpNap have Domain Authority like Moz?",
				answer:
					"Not yet. Domain Authority is Moz's proprietary metric. SerpNap focuses on on-page auditing with actionable fixes rather than domain-level scoring. For a free DA check, you can use Moz's free MozBar extension alongside SerpNap.",
			},
			{
				question: "Is SerpNap better than Moz for beginners?",
				answer:
					"Yes. SerpNap is designed for non-experts — every issue comes with a plain-language explanation and an AI-generated fix you can copy-paste. Moz requires more SEO knowledge to interpret its dashboards and metrics.",
			},
			{
				question: "Why should I switch from Moz to SerpNap?",
				answer:
					"Three reasons: (1) SerpNap is free vs. Moz's $99/mo, (2) SerpNap provides actual code fixes, not just scores, and (3) SerpNap includes Neural Audit for AI search visibility — a feature Moz doesn't offer at any price.",
			},
			{
				question: "Can I use SerpNap with Moz together?",
				answer:
					"Absolutely. Many users use SerpNap for fast on-page audits and AI-powered fixes, while keeping MozBar for quick DA checks. This combo gives you the best of both tools without needing a Moz Pro subscription.",
			},
		],
	},
	{
		slug: "ubersuggest",
		competitorName: "Ubersuggest",
		competitorPrice: "$49/mo",
		metaTitle:
			"Free Ubersuggest Alternative — SerpNap SEO Tools (No Signup)",
		metaDescription:
			"Looking for a free Ubersuggest alternative? SerpNap offers 13+ SEO tools with AI-powered fixes — completely free, no account needed.",
		keywords: [
			"free ubersuggest alternative",
			"ubersuggest alternative",
			"ubersuggest alternative free",
			"ubersuggest free alternative 2026",
			"tools like ubersuggest but free",
			"ubersuggest replacement",
			"neil patel seo tool alternative",
		],
		heroTitle: "The Free Ubersuggest Alternative",
		heroSubtitle:
			"More SEO tools, deeper audits, and AI-powered fixes — without Ubersuggest's paywall or daily limits.",
		whySwitch: [
			"No daily search limits — Ubersuggest free caps at 3 searches/day",
			"No signup required — Ubersuggest needs a Google account",
			"AI-powered code fixes — not just keyword suggestions",
			"50+ SEO checks per audit vs. Ubersuggest's basic site audit",
			"GEO analysis for AI search visibility — unique to SerpNap",
			"13+ specialized tools vs. Ubersuggest's bundled approach",
		],
		whatYouGet: [
			"Unlimited SEO audits (vs. Ubersuggest's 3/day free limit)",
			"50+ ranking factor checks with AI fix suggestions",
			"Technical Audit for crawlability and Core Web Vitals",
			"Neural Audit for AI search engine visibility",
			"Meta Tag Generator, Schema Generator, Headline Analyzer",
			"Keyword Density Checker, Page Speed Estimator",
			"Sitemap Validator, Redirect Checker, Robots.txt Generator",
			"Word Counter and Open Graph Checker",
			"No account needed, no daily limits",
		],
		whatYouMiss: [
			"Keyword suggestions with search volume data",
			"Content ideas and topic suggestions",
			"Backlink data and link opportunities",
			"Chrome extension for in-SERP analysis",
			"Rank tracking for monitored keywords",
			"Competitor domain analysis",
		],
		verdict:
			"SerpNap is the better free option if you primarily need SEO auditing — no daily limits, no signup, and more comprehensive checks than Ubersuggest's free tier. Ubersuggest is better if you need keyword research ideas, but its free tier is heavily restricted (3 searches/day). For the best free stack, use SerpNap for audits + Google Keyword Planner for keyword data.",
		faqs: [
			{
				question: "Is SerpNap better than Ubersuggest free?",
				answer:
					"For SEO auditing, yes. Ubersuggest's free tier limits you to 3 searches per day and requires a Google account. SerpNap has no limits, no signup, and runs 50+ checks per audit with AI-powered fixes.",
			},
			{
				question: "Does SerpNap have keyword research like Ubersuggest?",
				answer:
					"Not yet. Ubersuggest's strength is keyword suggestions and content ideas. SerpNap focuses on on-page auditing with actionable fixes. For keywords, combine SerpNap with Google Keyword Planner (free).",
			},
			{
				question: "Why is SerpNap free when Ubersuggest charges?",
				answer:
					"SerpNap is built by PxlPeak, a digital agency. The free tools help website owners find SEO issues. Those who need professional implementation can hire the agency. Ubersuggest uses a freemium model with aggressive upselling to paid plans.",
			},
			{
				question: "Can I use both SerpNap and Ubersuggest?",
				answer:
					"Yes, this is actually a great combo. Use SerpNap for thorough site audits (unlimited, with AI fixes), and Ubersuggest for keyword research ideas (within its daily free limit). Together they cover most SEO needs.",
			},
			{
				question: "Does SerpNap have a Chrome extension like Ubersuggest?",
				answer:
					"Not yet — a Chrome extension is on our roadmap. Currently, all SerpNap tools work directly in the browser with no installation needed.",
			},
		],
	},
	{
		slug: "screaming-frog",
		competitorName: "Screaming Frog",
		competitorPrice: "$259/year",
		metaTitle:
			"Free Screaming Frog Alternative — SerpNap Browser-Based SEO Audit",
		metaDescription:
			"Looking for a free Screaming Frog alternative? SerpNap runs SEO audits directly in your browser — no download, no desktop app, no $259/year license.",
		keywords: [
			"free screaming frog alternative",
			"screaming frog alternative",
			"screaming frog alternative free",
			"screaming frog free alternative 2026",
			"online screaming frog alternative",
			"screaming frog replacement",
			"browser seo crawler",
		],
		heroTitle: "The Free Screaming Frog Alternative",
		heroSubtitle:
			"Browser-based SEO auditing — no desktop app to install, no $259/year license, no 500-URL limit on free mode.",
		whySwitch: [
			"100% browser-based — no software download or installation needed",
			"Free with no URL limits — Screaming Frog free caps at 500 URLs",
			"AI-powered fix suggestions — Screaming Frog only reports issues",
			"GEO/AEO analysis — check AI search visibility (not in Screaming Frog)",
			"Works on any device — including tablets and Chromebooks",
			"Instant results in under 30 seconds — no long crawl times",
		],
		whatYouGet: [
			"Single-page deep audit with 50+ checks (vs. Screaming Frog's broad crawl)",
			"Technical Audit covering headers, crawlability, and Core Web Vitals",
			"Neural Audit for AI search visibility analysis",
			"AI-generated code fixes for every issue found",
			"Meta Tag Generator, Schema Generator, and more",
			"Works on any device with a browser — no installation",
			"PDF export for sharing with teams or clients",
		],
		whatYouMiss: [
			"Full-site crawling (Screaming Frog crawls entire sites at once)",
			"Custom extraction and regex-based analysis",
			"XML sitemap generation from crawl data",
			"Integration with Google Analytics and Search Console",
			"JavaScript rendering for SPA sites",
			"Bulk redirect chain analysis",
		],
		verdict:
			"SerpNap and Screaming Frog solve different problems. Screaming Frog excels at crawling entire websites (thousands of pages) for technical issues. SerpNap excels at deep single-page analysis with AI-powered fixes. For small to medium sites, SerpNap's instant audits are faster and more actionable. For enterprise-scale crawling, Screaming Frog remains the industry standard.",
		faqs: [
			{
				question: "Can SerpNap replace Screaming Frog?",
				answer:
					"For single-page SEO audits, yes — SerpNap runs deeper checks (50+ factors) with AI-powered fixes, instantly in the browser. For full-site crawling of thousands of URLs, Screaming Frog is still the better tool.",
			},
			{
				question: "Does SerpNap crawl entire websites like Screaming Frog?",
				answer:
					"SerpNap analyzes one page at a time in depth rather than crawling entire sites broadly. This gives you more detailed, actionable results per page. For site-wide crawling, you can audit your key pages individually or use SerpNap's Technical Audit.",
			},
			{
				question: "Do I need to install SerpNap like Screaming Frog?",
				answer:
					"No. SerpNap is 100% browser-based — just visit the website, enter a URL, and get results instantly. No software download, no Java requirements, no system resources consumed.",
			},
			{
				question: "Is SerpNap faster than Screaming Frog?",
				answer:
					"For individual page analysis, yes — SerpNap returns results in under 30 seconds. Screaming Frog crawls can take minutes to hours depending on site size. Different tools for different use cases.",
			},
			{
				question: "What's the best free alternative to Screaming Frog?",
				answer:
					"For page-level SEO auditing: SerpNap (instant, browser-based, AI fixes). For basic site crawling: Screaming Frog's free tier (limited to 500 URLs). For technical monitoring: Google Search Console (free). Combine all three for comprehensive coverage.",
			},
		],
	},
	{
		slug: "seoptimer",
		competitorName: "SEOptimer",
		competitorPrice: "$19/mo",
		metaTitle:
			"Free SEOptimer Alternative — SerpNap SEO Audit (No Signup)",
		metaDescription:
			"Looking for a free SEOptimer alternative? SerpNap offers deeper audits with AI-powered fixes, 50+ checks, and no limits — completely free.",
		keywords: [
			"free seoptimer alternative",
			"seoptimer alternative",
			"seoptimer alternative free",
			"seoptimer free alternative",
			"tools like seoptimer",
			"seoptimer replacement",
			"better than seoptimer",
		],
		heroTitle: "The Free SEOptimer Alternative",
		heroSubtitle:
			"Deeper audits, more checks, and AI-powered fixes — without SEOptimer's limits or $19/mo paywall.",
		whySwitch: [
			"50+ SEO checks vs. SEOptimer's basic audit report",
			"AI-generated code fixes — not just letter grades",
			"No signup or email required — SEOptimer gates PDF reports behind email capture",
			"GEO/AEO analysis for AI search visibility — unique to SerpNap",
			"13+ specialized tools vs. SEOptimer's single audit page",
			"No usage limits — SEOptimer's free tier limits reports",
		],
		whatYouGet: [
			"Comprehensive 50+ check SEO audit (deeper than SEOptimer)",
			"AI-powered fix suggestions with copy-paste code",
			"Technical Audit, Neural Audit, and specialized tools",
			"Meta Tag Generator with live SERP preview",
			"Schema Generator, Headline Analyzer, Keyword Density",
			"Page Speed Estimator, Redirect Checker, Sitemap Validator",
			"Word Counter, Open Graph Checker, Robots.txt Generator",
			"Free PDF export — no email required",
		],
		whatYouMiss: [
			"White-label branded reports (SEOptimer's premium feature)",
			"Lead generation widget for agency websites",
			"Automated monitoring and scheduled reports",
			"Bulk URL analysis",
			"Custom report branding and client management",
		],
		verdict:
			"SerpNap offers a significantly deeper audit than SEOptimer — more checks, AI-powered fixes, and no email gating. SEOptimer's value is in its white-label reporting for agencies. If you need branded client reports, SEOptimer's paid plan is worth considering. For everything else, SerpNap is the better free option.",
		faqs: [
			{
				question: "Is SerpNap better than SEOptimer?",
				answer:
					"For audit depth, yes. SerpNap runs 50+ checks with AI-powered code fixes, while SEOptimer provides a simpler letter-grade audit. SerpNap also includes Neural Audit for AI search visibility, which SEOptimer doesn't offer.",
			},
			{
				question: "Does SerpNap require email signup like SEOptimer?",
				answer:
					"No. SEOptimer requires email to download PDF reports. SerpNap is completely free — full audit results, PDF export, and all tools — with no signup, no email, and no limits.",
			},
			{
				question: "Does SerpNap have white-label reports?",
				answer:
					"Not yet — this feature is on our roadmap. Currently, SerpNap generates professional PDF reports with SerpNap branding. For agencies needing custom branding, SEOptimer's paid plan offers this.",
			},
			{
				question: "Which has more SEO tools — SerpNap or SEOptimer?",
				answer:
					"SerpNap has 13+ specialized tools (SEO Checker, Technical Audit, Neural Audit, Meta Tag Generator, Schema Generator, and more). SEOptimer focuses on a single audit tool with variations. SerpNap covers more use cases for free.",
			},
			{
				question: "Can I use SerpNap for client SEO reports?",
				answer:
					"Yes. SerpNap generates downloadable PDF reports that you can share with clients. While they carry SerpNap branding (white-label coming soon), the audit content is comprehensive enough for professional client reporting.",
			},
		],
	},
];

export function getAlternative(
	slug: string
): AlternativeData | undefined {
	return alternatives.find((a) => a.slug === slug);
}

export function getAllAlternativeSlugs(): string[] {
	return alternatives.map((a) => a.slug);
}

export function getAllAlternatives(): AlternativeData[] {
	return alternatives;
}
