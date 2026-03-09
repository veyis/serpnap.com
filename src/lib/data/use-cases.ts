export interface UseCaseData {
	slug: string;
	audience: string;
	metaTitle: string;
	metaDescription: string;
	keywords: string[];
	heroTitle: string;
	heroSubtitle: string;
	painPoints: string[];
	recommendedTools: { slug: string; name: string; reason: string }[];
	benefits: string[];
	faqs: { question: string; answer: string }[];
}

const useCases: UseCaseData[] = [
	{
		slug: "freelancers",
		audience: "Freelancers",
		metaTitle:
			"Free SEO Tools for Freelancers — Professional Toolkit at Zero Cost",
		metaDescription:
			"Free SEO tools built for freelance SEO consultants. Run unlimited audits, generate reports, and deliver results to clients without paying for expensive subscriptions.",
		keywords: [
			"free seo tools for freelancers",
			"freelance seo tools",
			"seo tools no subscription",
			"freelancer seo audit tool",
			"free seo checker freelancers",
			"seo consultant tools free",
		],
		heroTitle: "Free SEO Tools for Freelancers",
		heroSubtitle:
			"Stop paying $100+/mo for SEO subscriptions that eat into your margins. Run professional audits, generate schemas, and optimize client sites — completely free.",
		painPoints: [
			"Expensive tool subscriptions that eat into freelance income before you even land a client",
			"Limited audit credits on paid tools that force you to ration analyses across projects",
			"Switching between multiple free trials with different interfaces and expiration dates",
			"No professional reporting capabilities without paying for enterprise-tier plans",
			"Difficulty justifying tool costs when starting out or between client engagements",
		],
		recommendedTools: [
			{
				slug: "seo-checker",
				name: "SEO Checker",
				reason:
					"Run unlimited full-site audits for every client — 50+ checks with actionable fixes, no per-audit fees.",
			},
			{
				slug: "technical-audit",
				name: "Technical Audit",
				reason:
					"Deep-dive technical analysis to uncover crawlability, indexing, and performance issues that win client trust.",
			},
			{
				slug: "meta-tag-generator",
				name: "Meta Tag Generator",
				reason:
					"Quickly generate optimized title tags and meta descriptions for client pages — perfect for deliverables.",
			},
			{
				slug: "schema-generator",
				name: "Schema Generator",
				reason:
					"Create JSON-LD structured data for clients without writing code — supports all major schema types.",
			},
			{
				slug: "keyword-density-checker",
				name: "Keyword Density Checker",
				reason:
					"Analyze client content for keyword optimization and provide data-backed content recommendations.",
			},
			{
				slug: "page-speed-estimator",
				name: "Page Speed Estimator",
				reason:
					"Show clients exactly how their Core Web Vitals stack up and what to fix for faster load times.",
			},
		],
		benefits: [
			"Zero overhead — keep 100% of your freelance income instead of losing it to tool subscriptions",
			"Professional-grade audits that rival $100+/mo paid tools, building credibility with clients",
			"Unlimited usage with no audit caps, so you can prospect and deliver without worrying about limits",
			"Faster client onboarding — run a quick audit before the first call to demonstrate expertise",
			"All tools in one place — no juggling multiple platforms, logins, or free trial timers",
		],
		faqs: [
			{
				question:
					"Can I use SerpNap for client work as a freelancer?",
				answer:
					"Yes. SerpNap is completely free for any use case, including freelance client work. Run unlimited audits, use the generated schemas, meta tags, and audit data in your client deliverables without any restrictions.",
			},
			{
				question:
					"How does SerpNap compare to paid tools like Semrush or Ahrefs for freelancers?",
				answer:
					"SerpNap covers on-page SEO auditing, technical analysis, schema generation, and content optimization — the core tasks freelancers perform daily. It does not include backlink databases or rank tracking. For most freelance SEO work, SerpNap eliminates the need for a paid subscription.",
			},
			{
				question:
					"Is there a limit to how many client sites I can audit?",
				answer:
					"No. SerpNap has no usage limits, no audit credits, and no per-site fees. Audit as many client websites as you need, as often as you need. Each audit runs in under 30 seconds.",
			},
			{
				question: "Can I export audit results for clients?",
				answer:
					"Yes. The SEO Checker generates PDF reports you can share with clients. You can also reference the detailed audit data in your own proposals, presentations, and client reports.",
			},
			{
				question:
					"Do I need to create an account to use SerpNap?",
				answer:
					"No. SerpNap requires no signup, no account creation, and no credit card. Just open the tool, paste a URL, and get results instantly. This makes it perfect for quick prospect audits before sales calls.",
			},
		],
	},
	{
		slug: "agencies",
		audience: "Agencies",
		metaTitle:
			"Free SEO Tools for Agencies — Unlimited Client Audits at Zero Cost",
		metaDescription:
			"Free SEO tools designed for marketing and SEO agencies. Run unlimited client audits, generate professional reports, and scale your services without per-seat pricing.",
		keywords: [
			"free seo tools for agencies",
			"agency seo tools",
			"seo audit tool for agencies",
			"free client seo audit",
			"marketing agency seo tools",
			"seo agency toolkit free",
		],
		heroTitle: "Free SEO Tools for Agencies",
		heroSubtitle:
			"Scale your agency without scaling your tool budget. Run unlimited client audits, generate reports, and deliver professional SEO services — all free.",
		painPoints: [
			"Per-seat and per-project pricing that multiplies costs as your team and client base grow",
			"Tool subscriptions consuming 10-20% of retainer revenue before any work gets done",
			"Onboarding new team members requires additional licenses at $50-150/seat/month",
			"Client-facing reports locked behind premium tiers, forcing upgrades just for PDF exports",
			"Managing multiple tool subscriptions with different billing cycles, logins, and interfaces",
		],
		recommendedTools: [
			{
				slug: "seo-checker",
				name: "SEO Checker",
				reason:
					"Run unlimited audits across your entire client portfolio — 50+ checks per page with PDF export for client reporting.",
			},
			{
				slug: "technical-audit",
				name: "Technical Audit",
				reason:
					"Comprehensive technical SEO analysis to include in client deliverables and monthly retainer reports.",
			},
			{
				slug: "neural-audit",
				name: "Neural Audit",
				reason:
					"Differentiate your agency by offering AI search visibility analysis — show clients how they appear in ChatGPT, Gemini, and Perplexity.",
			},
			{
				slug: "broken-link-checker",
				name: "Broken Link Checker",
				reason:
					"Quickly identify broken links on client sites — a common quick-win deliverable for retainer clients.",
			},
			{
				slug: "schema-generator",
				name: "Schema Generator",
				reason:
					"Generate structured data for clients across all schema types — LocalBusiness, Product, FAQ, and more.",
			},
			{
				slug: "robots-txt-generator",
				name: "Robots.txt Generator",
				reason:
					"Create optimized robots.txt files for client sites with platform-specific presets for WordPress, Shopify, and more.",
			},
		],
		benefits: [
			"Zero per-client costs — your margins stay healthy whether you manage 5 clients or 50",
			"No seat limits — every team member can access every tool without additional licenses",
			"Professional PDF reports included free, eliminating the need for premium-tier upgrades",
			"AI search visibility analysis (Neural Audit) as an agency differentiator most competitors lack",
			"Faster prospect-to-client conversion — audit a prospect's site in 30 seconds before the sales call",
		],
		faqs: [
			{
				question:
					"Can my entire agency team use SerpNap without paying per seat?",
				answer:
					"Yes. SerpNap requires no accounts, no logins, and no per-seat fees. Every team member can access all tools instantly. There are no usage limits regardless of team size.",
			},
			{
				question:
					"How do agencies typically use SerpNap?",
				answer:
					"Three main workflows: (1) Sales prospecting — audit prospect sites before meetings to demonstrate value, (2) Client onboarding — run baseline audits to identify quick wins, (3) Ongoing reporting — monthly audits for retainer clients to track progress and justify continued investment.",
			},
			{
				question:
					"Does SerpNap offer white-label reports for agencies?",
				answer:
					"White-label branded reports are on our roadmap. Currently, PDF reports include SerpNap branding. You can reference the audit data and findings in your own agency-branded documents and presentations.",
			},
			{
				question:
					"Is SerpNap suitable for enterprise-level client sites?",
				answer:
					"SerpNap audits individual pages in depth with 50+ checks. It works with any publicly accessible URL regardless of site size. For enterprise clients, audit key pages (homepage, top landing pages, product pages) to identify systematic issues across the site.",
			},
		],
	},
	{
		slug: "bloggers",
		audience: "Bloggers",
		metaTitle:
			"Free SEO Tools for Bloggers — Optimize Your Content for Search",
		metaDescription:
			"Free SEO tools for bloggers and content creators. Optimize blog posts for search, check keyword density, generate meta tags, and improve your organic traffic.",
		keywords: [
			"free seo tools for bloggers",
			"blog seo tools",
			"content creator seo tools",
			"blog post seo checker",
			"free blogging seo tools",
			"seo tools for content writers",
		],
		heroTitle: "Free SEO Tools for Bloggers",
		heroSubtitle:
			"Write content that ranks. Check your posts for SEO issues, optimize headlines, analyze keyword density, and generate perfect meta tags — all free.",
		painPoints: [
			"Writing great content that nobody finds because on-page SEO basics are missed",
			"Paying for SEO tools when blog revenue is still growing and every dollar counts",
			"Not knowing if meta descriptions, headings, and image alt text are properly optimized",
			"Struggling to write click-worthy headlines that also include target keywords",
			"Missing structured data that could earn rich snippets and increase click-through rates",
		],
		recommendedTools: [
			{
				slug: "seo-checker",
				name: "SEO Checker",
				reason:
					"Audit any blog post for 50+ SEO factors — catch missing meta tags, heading issues, image problems, and more before publishing.",
			},
			{
				slug: "headline-analyzer",
				name: "Headline Analyzer",
				reason:
					"Score your blog post titles for emotional impact, word balance, and SEO effectiveness to maximize click-through rates.",
			},
			{
				slug: "keyword-density-checker",
				name: "Keyword Density Checker",
				reason:
					"Ensure your target keywords appear naturally throughout your content without over-optimization or keyword stuffing.",
			},
			{
				slug: "meta-tag-generator",
				name: "Meta Tag Generator",
				reason:
					"Create perfectly formatted title tags and meta descriptions for every blog post — character counts included.",
			},
			{
				slug: "open-graph-checker",
				name: "Open Graph Checker",
				reason:
					"Preview exactly how your blog posts look when shared on social media and fix Open Graph tags for better social sharing.",
			},
			{
				slug: "word-counter",
				name: "Word Counter",
				reason:
					"Check word count, reading time, and content length to ensure your posts meet competitive content standards.",
			},
		],
		benefits: [
			"Catch SEO issues before publishing — fix problems while the content is still fresh in your mind",
			"Write headlines that rank and get clicks with data-driven headline scoring",
			"Generate perfect meta tags in seconds instead of guessing at character limits and formatting",
			"Improve organic traffic without an SEO background — clear, actionable recommendations",
			"More time writing, less time worrying about technical SEO — tools handle the optimization checks",
		],
		faqs: [
			{
				question:
					"Which SEO tool should bloggers use first?",
				answer:
					"Start with the SEO Checker — paste your published blog post URL and get a full audit in under 30 seconds. It identifies missing meta descriptions, heading structure issues, image optimization problems, and 50+ other factors. Then use the Headline Analyzer to optimize your titles for clicks.",
			},
			{
				question:
					"How do I optimize my blog posts for SEO without being an expert?",
				answer:
					"Focus on four essentials: (1) Write a compelling title with your target keyword using the Headline Analyzer, (2) Create a unique meta description using the Meta Tag Generator, (3) Structure content with proper H2/H3 headings, (4) Run the SEO Checker after publishing to catch anything you missed.",
			},
			{
				question:
					"Does this work with WordPress, Ghost, Substack, or Medium?",
				answer:
					"Yes. SerpNap works with any publicly accessible blog post regardless of platform. Enter your published URL and get results. It works with WordPress, Ghost, Substack, Webflow, Squarespace, custom builds, and any other blogging platform.",
			},
			{
				question:
					"How often should I audit my blog posts for SEO?",
				answer:
					"Audit every new post before or immediately after publishing. For existing content, re-audit your top-performing posts quarterly to ensure they maintain their SEO health as search engine requirements evolve. SerpNap is free with no limits.",
			},
			{
				question:
					"What is keyword density and why does it matter for bloggers?",
				answer:
					"Keyword density is how often your target keyword appears relative to total word count. Too low and search engines may not understand your topic; too high and it looks like spam. The Keyword Density Checker helps you find the sweet spot — typically 1-3% for primary keywords.",
			},
		],
	},
	{
		slug: "small-business",
		audience: "Small Business",
		metaTitle:
			"Free SEO Tools for Small Business — Grow Your Online Visibility",
		metaDescription:
			"Free SEO tools for small business owners. Audit your website, fix SEO issues, generate local schema, and compete with bigger brands — no SEO expertise required.",
		keywords: [
			"free seo tools for small business",
			"small business seo tools",
			"seo tools for smb",
			"free website seo checker small business",
			"small business seo audit",
			"local seo tools free",
		],
		heroTitle: "Free SEO Tools for Small Business",
		heroSubtitle:
			"You built your business. Now make sure customers can find it. Audit your website, fix SEO issues, and grow your organic traffic — no budget required.",
		painPoints: [
			"Paying an SEO agency $1,000+/mo or buying tools at $100+/mo is not realistic on a small business budget",
			"Not knowing what is wrong with your website or why competitors rank higher in Google",
			"Missing local search opportunities because LocalBusiness schema and local SEO basics are not set up",
			"Website was built by a developer who did not consider SEO, and now it is invisible to search engines",
			"No time to learn complex SEO platforms when you are already running every part of the business",
		],
		recommendedTools: [
			{
				slug: "seo-checker",
				name: "SEO Checker",
				reason:
					"Get a clear picture of your website's SEO health in under 30 seconds — plain-English recommendations, no jargon.",
			},
			{
				slug: "schema-generator",
				name: "Schema Generator",
				reason:
					"Generate LocalBusiness schema to help Google show your business name, address, hours, and reviews in search results.",
			},
			{
				slug: "meta-tag-generator",
				name: "Meta Tag Generator",
				reason:
					"Create optimized title tags and meta descriptions that tell Google and customers exactly what your business offers.",
			},
			{
				slug: "page-speed-estimator",
				name: "Page Speed Estimator",
				reason:
					"Check if your website loads fast enough — slow sites lose customers and rank lower in Google.",
			},
			{
				slug: "open-graph-checker",
				name: "Open Graph Checker",
				reason:
					"Make sure your website looks professional when shared on Facebook, LinkedIn, and other social platforms.",
			},
			{
				slug: "robots-txt-generator",
				name: "Robots.txt Generator",
				reason:
					"Ensure search engines can find and index your important pages with a properly configured robots.txt file.",
			},
		],
		benefits: [
			"Understand your website's SEO problems in plain English — no technical background needed",
			"Compete with larger businesses in local search results by setting up proper local schema markup",
			"Save thousands per year by doing basic SEO yourself instead of hiring an agency for simple fixes",
			"Make informed decisions about your website with data, not guesses, when talking to developers or agencies",
			"Improve your Google visibility incrementally — fix the most impactful issues first with prioritized recommendations",
		],
		faqs: [
			{
				question:
					"Do I need SEO experience to use these tools?",
				answer:
					"No. SerpNap is designed for non-technical users. The SEO Checker provides recommendations in plain English with clear explanations of what each issue means and how to fix it. You do not need any SEO background to get value from these tools.",
			},
			{
				question:
					"How can free SEO tools help my small business compete with bigger companies?",
				answer:
					"SEO is one of the few marketing channels where small businesses can compete with large ones. By fixing technical issues, adding proper schema markup, and optimizing your content, you can rank alongside bigger brands for local and niche searches. SerpNap helps you identify and fix these issues for free.",
			},
			{
				question:
					"What is the most important SEO fix for a small business website?",
				answer:
					"For most small businesses, the biggest quick wins are: (1) Adding LocalBusiness schema so Google shows your business info in search results, (2) Writing unique meta descriptions for your key pages, (3) Ensuring your site loads fast on mobile. The SEO Checker identifies which fixes will have the biggest impact for your specific site.",
			},
			{
				question:
					"Should I hire an SEO agency or do it myself?",
				answer:
					"Start by running a free audit with SerpNap to understand your current issues. Many fixes — meta tags, schema markup, image optimization — are straightforward enough to handle yourself. If the audit reveals complex technical problems or you need ongoing content strategy, that is when an agency adds the most value.",
			},
		],
	},
	{
		slug: "developers",
		audience: "Developers",
		metaTitle:
			"Free SEO Tools for Developers — Technical SEO Without the Fluff",
		metaDescription:
			"Free SEO tools built for web developers. Validate structured data, check technical SEO, test robots.txt, audit sitemaps, and ensure your builds are search-engine ready.",
		keywords: [
			"free seo tools for developers",
			"developer seo tools",
			"technical seo tools free",
			"web developer seo checker",
			"structured data validator",
			"seo tools for web development",
		],
		heroTitle: "Free SEO Tools for Developers",
		heroSubtitle:
			"Ship search-engine-ready code. Validate structured data, audit technical SEO, test sitemaps, and catch crawlability issues — built for developers, not marketers.",
		painPoints: [
			"Building websites that look great but are invisible to search engines due to technical SEO gaps",
			"Clients or PMs asking about SEO issues you do not have the right tools to diagnose",
			"Manually checking meta tags, Open Graph data, and structured data across every page during QA",
			"Not knowing if your JavaScript framework renders properly for search engine crawlers",
			"Robots.txt and sitemap misconfigurations that silently block pages from being indexed",
		],
		recommendedTools: [
			{
				slug: "technical-audit",
				name: "Technical Audit",
				reason:
					"Deep technical analysis covering crawlability, indexing, rendering, and Core Web Vitals — the metrics developers care about.",
			},
			{
				slug: "schema-generator",
				name: "Schema Generator",
				reason:
					"Generate valid JSON-LD structured data for any schema type — copy-paste directly into your codebase.",
			},
			{
				slug: "robots-txt-generator",
				name: "Robots.txt Generator",
				reason:
					"Build correct robots.txt files with platform presets — avoid accidentally blocking important pages from crawlers.",
			},
			{
				slug: "sitemap-validator",
				name: "Sitemap Validator",
				reason:
					"Validate your XML sitemap for errors, broken URLs, and formatting issues before deploying to production.",
			},
			{
				slug: "redirect-checker",
				name: "Redirect Checker",
				reason:
					"Trace redirect chains, identify loops, and verify that your 301/302 redirects resolve correctly.",
			},
			{
				slug: "open-graph-checker",
				name: "Open Graph Checker",
				reason:
					"Validate Open Graph and Twitter Card meta tags to ensure proper social media previews — catch issues during development.",
			},
		],
		benefits: [
			"Catch technical SEO issues during development, not after the site launches and pages fail to index",
			"Generate valid JSON-LD structured data without memorizing schema.org specifications",
			"Validate robots.txt and sitemaps with dedicated tools instead of manual inspection",
			"Add SEO auditing to your development workflow — run checks as part of QA before every deployment",
			"Communicate SEO requirements clearly with marketing teams using data from professional audit reports",
		],
		faqs: [
			{
				question:
					"How does SerpNap help developers specifically?",
				answer:
					"SerpNap focuses on the technical side of SEO that developers handle: structured data validation, robots.txt configuration, sitemap verification, redirect chain analysis, Core Web Vitals, and crawlability. These are code-level concerns that complement what marketing teams do with content.",
			},
			{
				question:
					"Can I use these tools to QA websites before launch?",
				answer:
					"Yes, as long as the staging or preview URL is publicly accessible. Run the SEO Checker and Technical Audit on your staging environment to catch meta tag issues, missing structured data, broken redirects, and performance problems before they reach production.",
			},
			{
				question:
					"Does the Technical Audit check JavaScript-rendered content?",
				answer:
					"The SEO Checker and Technical Audit analyze the initial HTML response, which reflects what search engines see without JavaScript execution. This is actually the most important check for JavaScript frameworks — if critical content is missing from the initial HTML, it may not be indexed.",
			},
			{
				question:
					"What structured data types does the Schema Generator support?",
				answer:
					"The Schema Generator supports all major schema types including Organization, LocalBusiness, Product, Article, FAQ, HowTo, BreadcrumbList, SoftwareApplication, and more. It generates valid JSON-LD that you can copy directly into your HTML or Next.js/React components.",
			},
			{
				question:
					"Is there an API I can integrate into my CI/CD pipeline?",
				answer:
					"An API is on our roadmap. Currently, SerpNap is browser-based. For CI/CD integration, you can use Lighthouse CI for automated performance checks and supplement with SerpNap's more comprehensive manual audits during QA sprints.",
			},
		],
	},
	{
		slug: "startups",
		audience: "Startups",
		metaTitle:
			"Free SEO Tools for Startups — Build Organic Growth from Day One",
		metaDescription:
			"Free SEO tools for startup founders. Build organic search visibility from launch, audit your website, and grow without spending on expensive SEO subscriptions.",
		keywords: [
			"free seo tools for startups",
			"startup seo tools",
			"seo tools for early stage startups",
			"free seo audit startups",
			"startup website seo",
			"bootstrap seo tools",
		],
		heroTitle: "Free SEO Tools for Startups",
		heroSubtitle:
			"Every dollar matters when you are building. Set up your SEO foundation from day one, drive organic traffic, and grow without burning budget on tool subscriptions.",
		painPoints: [
			"Burning runway on $100-300/mo SEO tool subscriptions before achieving product-market fit",
			"Launching a website with zero organic visibility and relying entirely on paid acquisition",
			"No dedicated SEO hire and no budget to bring one on — founders wear every hat",
			"Competitors with bigger budgets dominating search results for your target keywords",
			"Not knowing if your website's technical foundation supports long-term organic growth",
		],
		recommendedTools: [
			{
				slug: "seo-checker",
				name: "SEO Checker",
				reason:
					"Get a full SEO health check on your startup website — identify the highest-impact fixes to prioritize with limited resources.",
			},
			{
				slug: "neural-audit",
				name: "Neural Audit",
				reason:
					"See how your startup appears in AI search engines like ChatGPT and Perplexity — the next frontier of discoverability.",
			},
			{
				slug: "meta-tag-generator",
				name: "Meta Tag Generator",
				reason:
					"Create optimized meta tags for your landing pages, pricing page, and feature pages — first impressions in search results matter.",
			},
			{
				slug: "schema-generator",
				name: "Schema Generator",
				reason:
					"Add SoftwareApplication schema to your site for rich results showing pricing, ratings, and features in Google.",
			},
			{
				slug: "page-speed-estimator",
				name: "Page Speed Estimator",
				reason:
					"Ensure your site loads fast — slow pages kill conversion rates and search rankings, both critical for early growth.",
			},
			{
				slug: "headline-analyzer",
				name: "Headline Analyzer",
				reason:
					"Optimize your landing page headlines and blog post titles for maximum click-through from search results.",
			},
		],
		benefits: [
			"Build your SEO foundation from day one — organic traffic compounds over time, so starting early gives you a massive advantage",
			"Save $1,200-3,600/year on tool subscriptions and redirect that budget to product development or marketing",
			"Get AI search visibility insights early — startups that optimize for ChatGPT and Perplexity now will dominate later",
			"Make data-driven SEO decisions without an in-house SEO hire — clear recommendations anyone on the team can implement",
			"Reduce dependency on paid acquisition by building a sustainable organic traffic channel from launch",
		],
		faqs: [
			{
				question:
					"When should startups start thinking about SEO?",
				answer:
					"From day one. SEO is a compounding channel — pages you optimize today will drive traffic months from now. Setting up the technical foundation (meta tags, schema, site structure) at launch is far easier than retrofitting later. Use the SEO Checker to establish a baseline and the Meta Tag Generator to optimize key pages immediately.",
			},
			{
				question:
					"What are the most important SEO tasks for an early-stage startup?",
				answer:
					"Focus on four high-impact areas: (1) Technical foundation — proper meta tags, schema markup, fast load times, (2) Landing page optimization — your homepage and key feature pages must be search-optimized, (3) Content strategy — start a blog targeting long-tail keywords in your niche, (4) AI search visibility — ensure your brand is discoverable in ChatGPT and Perplexity.",
			},
			{
				question:
					"Can SerpNap replace a paid SEO tool for our startup?",
				answer:
					"For most early-stage startups, yes. SerpNap covers on-page auditing, technical SEO analysis, schema generation, content optimization, and AI search visibility. It does not include backlink databases or rank tracking — but those features matter less pre-product-market-fit. Start with SerpNap and add specialized tools only when you need them.",
			},
			{
				question:
					"How does the Neural Audit help startups?",
				answer:
					"The Neural Audit analyzes how your startup appears in AI search engines like ChatGPT, Gemini, and Perplexity. As more users search through AI assistants, being visible in these responses becomes critical for brand discovery. Startups that optimize for AI search now will have a significant first-mover advantage.",
			},
		],
	},
];

export function getUseCase(slug: string): UseCaseData | undefined {
	return useCases.find((uc) => uc.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
	return useCases.map((uc) => uc.slug);
}

export function getAllUseCases(): UseCaseData[] {
	return useCases;
}
