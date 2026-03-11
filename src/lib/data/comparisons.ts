import { config } from "@/lib/config";

export interface ComparisonFeature {
  feature: string;
  serpnap: string;
  competitor: string;
}

export interface ComparisonData {
  slug: string;
  competitorName: string;
  competitorPrice: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroTitle: string;
  heroSubtitle: string;
  verdict: string;
  features: ComparisonFeature[];
  serpnapStrengths: string[];
  competitorStrengths: string[];
  bestFor: {
    serpnap: string;
    competitor: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export const comparisons: ComparisonData[] = [
  {
    slug: "serpnap-vs-semrush",
    competitorName: "Semrush",
    competitorPrice: "$139.95/mo",
    metaTitle:
      "SerpNap vs Semrush (2026) — Free Alternative Comparison",
    metaDescription:
      "Compare SerpNap's free SEO checker vs Semrush's $139.95/mo Site Audit. See which SEO features you get free and where Semrush justifies the price.",
    keywords: [
      "serpnap vs semrush",
      "semrush alternative free",
      "free semrush alternative",
      "semrush site audit alternative",
      "semrush free alternative 2026",
      "seo checker vs semrush",
    ],
    heroTitle: "SerpNap vs Semrush",
    heroSubtitle:
      "A free SEO checker with 50+ checks vs the industry's $139.95/mo all-in-one platform. Here's an honest comparison.",
    verdict:
      "SerpNap is the best free alternative for on-page SEO audits and quick health checks. Semrush is worth the investment if you need keyword tracking, competitor analysis, and backlink data at scale.",
    features: [
      {
        feature: "On-page SEO audit",
        serpnap: "50+ checks, instant results",
        competitor: "Site Audit with crawl-based analysis",
      },
      {
        feature: "Price",
        serpnap: "Free forever",
        competitor: "$139.95/mo (Pro plan)",
      },
      {
        feature: "Signup required",
        serpnap: "No",
        competitor: "Yes (credit card for trial)",
      },
      {
        feature: "Meta tag analysis",
        serpnap: "Yes, with AI fix suggestions",
        competitor: "Yes, within Site Audit",
      },
      {
        feature: "Schema validation",
        serpnap: "Yes + generator tool",
        competitor: "Yes, within Site Audit",
      },
      {
        feature: "Core Web Vitals",
        serpnap: "Estimated scores",
        competitor: "Real CrUX data integration",
      },
      {
        feature: "Keyword tracking",
        serpnap: "Not available",
        competitor: "500-5,000 keywords",
      },
      {
        feature: "Backlink analysis",
        serpnap: "Not available",
        competitor: "Full backlink database",
      },
      {
        feature: "Competitor analysis",
        serpnap: "Not available",
        competitor: "Comprehensive competitor intel",
      },
      {
        feature: "AI-powered fixes",
        serpnap: "Copy-paste code fixes",
        competitor: "Recommendations only",
      },
      {
        feature: "PDF report export",
        serpnap: "Yes, free",
        competitor: "Yes (paid plans only)",
      },
      {
        feature: "E-E-A-T analysis",
        serpnap: "Yes",
        competitor: "Limited",
      },
    ],
    serpnapStrengths: [
      "Completely free with no signup or credit card required",
      "Instant results — no waiting for crawl completion",
      "AI-powered fix suggestions with ready-to-paste code",
      "11 specialized SEO tools in one platform",
      "Privacy-first — no data harvesting",
    ],
    competitorStrengths: [
      "Comprehensive keyword research and rank tracking",
      "Full backlink database with competitor comparison",
      "Content marketing platform with topic research",
      "PPC and advertising intelligence",
      "Large-scale site crawling for enterprise sites",
    ],
    bestFor: {
      serpnap:
        "Website owners, bloggers, and small businesses who need quick SEO audits, meta tag optimization, and actionable fixes without paying $1,680/year.",
      competitor:
        "SEO agencies, enterprise marketing teams, and professionals who need keyword tracking, backlink analysis, and competitive intelligence at scale.",
    },
    faqs: [
      {
        question: "Is SerpNap really free compared to Semrush?",
        answer:
          "Yes. SerpNap is 100% free with no signup, no trial period, and no feature limits. Semrush starts at $139.95/month ($1,679/year) after a 7-day trial that requires a credit card.",
      },
      {
        question: "Can SerpNap replace Semrush completely?",
        answer:
          "For on-page SEO audits and quick health checks, yes. SerpNap covers 50+ on-page factors, meta tags, structured data, accessibility, and E-E-A-T signals. However, Semrush offers keyword tracking, backlink analysis, and competitor research that SerpNap doesn't provide.",
      },
      {
        question: "Which tool gives better SEO recommendations?",
        answer:
          "SerpNap provides AI-generated, copy-paste code fixes for every issue found. Semrush provides descriptions of issues but doesn't generate ready-to-use code. For actionable fixes, SerpNap is faster to implement.",
      },
      {
        question:
          "Should I use SerpNap alongside Semrush?",
        answer:
          "Many SEO professionals do. SerpNap is excellent for quick on-page audits and generating fixes, while Semrush handles keyword research, rank tracking, and competitive analysis. They complement each other well.",
      },
    ],
  },
  {
    slug: "serpnap-vs-ahrefs",
    competitorName: "Ahrefs",
    competitorPrice: "$129/mo",
    metaTitle:
      "SerpNap vs Ahrefs (2026) — Free SEO Tool Comparison",
    metaDescription:
      "Compare SerpNap's free SEO checker vs Ahrefs' $129/mo Site Audit. Feature-by-feature breakdown of what you get free vs paid.",
    keywords: [
      "serpnap vs ahrefs",
      "ahrefs alternative free",
      "free ahrefs alternative",
      "ahrefs site audit alternative",
      "ahrefs free alternative 2026",
      "seo checker vs ahrefs",
    ],
    heroTitle: "SerpNap vs Ahrefs",
    heroSubtitle:
      "Free instant SEO audits vs the $129/mo backlink powerhouse. An honest feature-by-feature breakdown.",
    verdict:
      "SerpNap is the best free alternative for on-page audits and quick SEO checks. Ahrefs is the go-to for backlink analysis, content research, and competitive keyword intelligence.",
    features: [
      {
        feature: "On-page SEO audit",
        serpnap: "50+ checks, instant results",
        competitor: "Site Audit with crawl scheduling",
      },
      {
        feature: "Price",
        serpnap: "Free forever",
        competitor: "$129/mo (Lite plan)",
      },
      {
        feature: "Signup required",
        serpnap: "No",
        competitor: "Yes (paid subscription)",
      },
      {
        feature: "Meta tag analysis",
        serpnap: "Yes, with AI fix suggestions",
        competitor: "Yes, within Site Audit",
      },
      {
        feature: "Schema validation",
        serpnap: "Yes + generator tool",
        competitor: "Basic structured data checks",
      },
      {
        feature: "Core Web Vitals",
        serpnap: "Estimated scores",
        competitor: "Performance report in Site Audit",
      },
      {
        feature: "Backlink analysis",
        serpnap: "Not available",
        competitor: "Industry-leading backlink index",
      },
      {
        feature: "Content explorer",
        serpnap: "Not available",
        competitor: "Yes, with top-performing content discovery",
      },
      {
        feature: "Keyword research",
        serpnap: "Not available",
        competitor: "Comprehensive keyword explorer",
      },
      {
        feature: "AI-powered fixes",
        serpnap: "Copy-paste code fixes",
        competitor: "Not available",
      },
      {
        feature: "PDF report export",
        serpnap: "Yes, free",
        competitor: "Yes (paid plans only)",
      },
      {
        feature: "Accessibility audit",
        serpnap: "WCAG checks included",
        competitor: "Not included",
      },
    ],
    serpnapStrengths: [
      "Completely free — no subscription needed",
      "Instant results with no crawl waiting time",
      "AI-generated code fixes you can paste directly",
      "WCAG accessibility audit included",
      "E-E-A-T trust signal analysis",
    ],
    competitorStrengths: [
      "Largest backlink index in the industry",
      "Content Explorer for finding top-performing content",
      "Comprehensive keyword research with difficulty scores",
      "SERP history and position tracking",
      "Batch analysis for large-scale audits",
    ],
    bestFor: {
      serpnap:
        "Website owners and developers who need quick, actionable SEO audits with code fixes — without paying $1,548/year.",
      competitor:
        "SEO professionals and content marketers who need deep backlink analysis, keyword research, and content discovery tools.",
    },
    faqs: [
      {
        question: "Is SerpNap a free alternative to Ahrefs?",
        answer:
          "For on-page SEO audits, yes. SerpNap covers meta tags, headings, structured data, accessibility, and E-E-A-T signals for free. Ahrefs' core strength is backlink analysis and keyword research, which SerpNap doesn't offer.",
      },
      {
        question: "Does Ahrefs have a free tier?",
        answer:
          "Ahrefs offers limited free tools (Webmaster Tools for verified sites), but full access starts at $129/month. SerpNap provides all 16 tools completely free with no verification or signup required.",
      },
      {
        question: "Which tool is better for beginners?",
        answer:
          "SerpNap. It requires no signup, provides instant results with AI-generated fixes, and explains issues in plain English. Ahrefs has a steeper learning curve and requires a paid subscription.",
      },
      {
        question: "Can I use both SerpNap and Ahrefs together?",
        answer:
          "Absolutely. Use SerpNap for quick on-page audits and fix generation, and Ahrefs for backlink monitoring and keyword tracking. Many professionals use both in their workflow.",
      },
    ],
  },
  {
    slug: "serpnap-vs-moz",
    competitorName: "Moz Pro",
    competitorPrice: "$99/mo",
    metaTitle: "SerpNap vs Moz Pro (2026) — Free SEO Tool Comparison",
    metaDescription:
      "Compare SerpNap's free SEO tools vs Moz Pro's $99/mo plan. See which on-page SEO features you get free and what Moz adds.",
    keywords: [
      "serpnap vs moz",
      "moz alternative free",
      "free moz alternative",
      "moz pro alternative",
      "moz free alternative 2026",
    ],
    heroTitle: "SerpNap vs Moz Pro",
    heroSubtitle:
      "Free instant SEO audits vs Moz's $99/mo SEO platform. Where the free tools match up — and where they don't.",
    verdict:
      "SerpNap gives you more comprehensive on-page audits for free than Moz's Site Crawl. Moz Pro adds value through Domain Authority metrics, rank tracking, and link research.",
    features: [
      {
        feature: "On-page SEO audit",
        serpnap: "50+ checks, instant",
        competitor: "Site Crawl (scheduled)",
      },
      {
        feature: "Price",
        serpnap: "Free forever",
        competitor: "$99/mo (Standard plan)",
      },
      {
        feature: "Signup required",
        serpnap: "No",
        competitor: "Yes",
      },
      {
        feature: "Meta tag analysis",
        serpnap: "Yes, with AI fixes",
        competitor: "Yes, within Site Crawl",
      },
      {
        feature: "Domain Authority",
        serpnap: "Not available",
        competitor: "Yes (proprietary metric)",
      },
      {
        feature: "Rank tracking",
        serpnap: "Not available",
        competitor: "300-1,500 keywords",
      },
      {
        feature: "Link research",
        serpnap: "Not available",
        competitor: "Link Explorer tool",
      },
      {
        feature: "AI-powered fixes",
        serpnap: "Copy-paste code fixes",
        competitor: "Not available",
      },
      {
        feature: "E-E-A-T analysis",
        serpnap: "Yes",
        competitor: "Not available",
      },
      {
        feature: "Accessibility audit",
        serpnap: "WCAG checks included",
        competitor: "Not included",
      },
    ],
    serpnapStrengths: [
      "Free with no signup — instant access to all tools",
      "More on-page checks (50+) than Moz's crawl",
      "AI-generated code fixes for every issue",
      "E-E-A-T trust signal and accessibility audits",
      "11 specialized tools vs Moz's bundled approach",
    ],
    competitorStrengths: [
      "Domain Authority — industry-standard authority metric",
      "Rank tracking with SERP feature analysis",
      "Link Explorer for backlink research",
      "Keyword Explorer with priority scores",
      "On-page optimization suggestions per keyword",
    ],
    bestFor: {
      serpnap:
        "Anyone who needs quick, free SEO audits with actionable code fixes. Better on-page coverage than Moz for $0.",
      competitor:
        "Teams who value Domain Authority tracking, rank monitoring, and Moz's keyword difficulty scores.",
    },
    faqs: [
      {
        question: "Is SerpNap better than Moz for SEO audits?",
        answer:
          "For on-page audits, SerpNap provides more checks (50+) with AI-powered code fixes for free. Moz's Site Crawl requires a $99/mo subscription and doesn't generate ready-to-use fixes.",
      },
      {
        question: "Does Moz have free tools?",
        answer:
          "Moz offers some free tools (Domain Analysis, Keyword Explorer with limited queries), but their full audit capabilities require Moz Pro at $99/month. SerpNap offers all 16 tools free without limits.",
      },
      {
        question: "What does Moz offer that SerpNap doesn't?",
        answer:
          "Moz offers Domain Authority scores, rank tracking, Link Explorer for backlink analysis, and keyword difficulty metrics. These are valuable for ongoing SEO campaigns but not needed for quick on-page audits.",
      },
    ],
  },
  {
    slug: "serpnap-vs-screaming-frog",
    competitorName: "Screaming Frog",
    competitorPrice: "$259/year",
    metaTitle:
      "SerpNap vs Screaming Frog (2026) — Web vs Desktop SEO Audit",
    metaDescription:
      "Compare SerpNap's free browser-based SEO audit vs Screaming Frog's $259/year desktop crawler. Different tools for different needs.",
    keywords: [
      "serpnap vs screaming frog",
      "screaming frog alternative free",
      "free screaming frog alternative",
      "screaming frog alternative online",
      "web based seo crawler",
    ],
    heroTitle: "SerpNap vs Screaming Frog",
    heroSubtitle:
      "A free browser-based SEO audit vs a $259/year desktop crawler. Two different approaches to finding SEO issues.",
    verdict:
      "SerpNap is best for quick single-page audits with instant AI fixes. Screaming Frog is best for crawling entire sites with thousands of pages to find technical issues at scale.",
    features: [
      {
        feature: "Type",
        serpnap: "Browser-based (instant)",
        competitor: "Desktop application",
      },
      {
        feature: "Price",
        serpnap: "Free forever",
        competitor: "$259/year (free: 500 URL limit)",
      },
      {
        feature: "Setup required",
        serpnap: "None — open and use",
        competitor: "Download and install",
      },
      {
        feature: "Single page audit",
        serpnap: "50+ checks, instant",
        competitor: "Crawls page + linked pages",
      },
      {
        feature: "Full site crawl",
        serpnap: "Single page at a time",
        competitor: "Unlimited pages (paid)",
      },
      {
        feature: "AI-powered fixes",
        serpnap: "Yes, copy-paste code",
        competitor: "Not available",
      },
      {
        feature: "Schema validation",
        serpnap: "Yes + generator",
        competitor: "Yes, with extraction",
      },
      {
        feature: "Redirect analysis",
        serpnap: "Chain tracing tool",
        competitor: "Full redirect mapping",
      },
      {
        feature: "Custom extraction",
        serpnap: "Not available",
        competitor: "XPath/CSS/Regex extraction",
      },
      {
        feature: "JavaScript rendering",
        serpnap: "Server-side analysis",
        competitor: "Full JS rendering (Chrome)",
      },
    ],
    serpnapStrengths: [
      "Zero setup — works in any browser instantly",
      "AI-generated code fixes for every issue found",
      "11 specialized tools beyond just crawling",
      "Mobile-friendly — use on any device",
      "No installation, no Java dependency",
    ],
    competitorStrengths: [
      "Can crawl entire sites with thousands of pages",
      "Custom data extraction with XPath/CSS selectors",
      "Full JavaScript rendering with Chrome integration",
      "Detailed redirect chain mapping for whole sites",
      "API integrations (GA, GSC, PageSpeed, Ahrefs)",
    ],
    bestFor: {
      serpnap:
        "Quick single-page audits, instant AI fix generation, and browser-based convenience. Ideal for small sites and quick checks.",
      competitor:
        "Technical SEO professionals who need to crawl and analyze entire large-scale websites with custom extraction rules.",
    },
    faqs: [
      {
        question:
          "Is SerpNap a replacement for Screaming Frog?",
        answer:
          "They serve different purposes. SerpNap excels at instant single-page audits with AI fixes. Screaming Frog is a site-wide crawler for technical audits at scale. For quick checks, SerpNap is faster. For crawling 10,000+ pages, Screaming Frog is the tool.",
      },
      {
        question: "Does Screaming Frog have a free version?",
        answer:
          "Yes, Screaming Frog's free version crawls up to 500 URLs but lacks features like JavaScript rendering, custom extraction, and Google integrations. SerpNap's full feature set is free with no limits per audit.",
      },
      {
        question: "Which is easier to use?",
        answer:
          "SerpNap. It's browser-based, requires no download, and generates AI-powered code fixes. Screaming Frog is a powerful desktop app but has a steeper learning curve and requires installation.",
      },
    ],
  },
];

export function getComparison(slug: string): ComparisonData | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}
