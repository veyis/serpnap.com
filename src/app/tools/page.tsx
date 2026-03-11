import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  FileText,
  Code,
  Globe,
  Zap,
  Shield,
  BarChart3,
  RefreshCw,
  Bot,
  Type,
  FileCode,
  ArrowRight,
  LetterText,
  Share2,
  Unlink,
  Lock,
  Server,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema, getFAQPageSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
  title: "Free SEO Tools — Audit, Analyze & Optimize Your Website",
  description:
    "16 free SEO tools: SEO checker, meta tag generator, schema generator, sitemap validator, broken link checker, SSL checker, and more. No signup required.",
  keywords: [
    "free seo tools",
    "seo tools online free",
    "free seo audit tools",
    "website seo tools",
    "seo checker free",
    "free meta tag generator",
    "free schema generator",
    "free sitemap validator",
  ],
  alternates: {
    canonical: `${config.appUrl}/tools`,
  },
  openGraph: {
    title: "Free SEO Tools — Audit, Analyze & Optimize",
    description:
      "Professional-grade SEO tools — all free, no signup. SEO checker, meta tag generator, schema generator, and more.",
    url: `${config.appUrl}/tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SEO Tools — Audit, Analyze & Optimize",
    description: "Professional-grade SEO tools — all free, no signup required.",
  },
};

const TOOLS = [
  {
    name: "SEO Checker",
    description: "Comprehensive SEO audit with 50+ checks. Get your score and actionable recommendations.",
    href: "/tools/seo-checker",
    icon: Search,
    featured: true,
  },
  {
    name: "Technical Audit",
    description: "Deep technical SEO analysis — crawlability, indexing, Core Web Vitals.",
    href: "/tools/technical-audit",
    icon: Shield,
  },
  {
    name: "Neural Audit",
    description: "AI-powered SEO analysis beyond traditional checklist audits.",
    href: "/tools/neural-audit",
    icon: Bot,
  },
  {
    name: "Meta Tag Generator",
    description: "Generate optimized title tags and meta descriptions with live SERP preview.",
    href: "/tools/meta-tag-generator",
    icon: FileText,
  },
  {
    name: "Schema Generator",
    description: "Create JSON-LD structured data for rich snippets in search results.",
    href: "/tools/schema-generator",
    icon: Code,
  },
  {
    name: "Sitemap Validator",
    description: "Validate your XML sitemap for errors, warnings, and best practices.",
    href: "/tools/sitemap-validator",
    icon: Globe,
  },
  {
    name: "Headline Analyzer",
    description: "Score headlines for emotional impact, power words, and click-through potential.",
    href: "/tools/headline-analyzer",
    icon: Type,
  },
  {
    name: "Keyword Density Checker",
    description: "Analyze keyword frequency and density to optimize content naturally.",
    href: "/tools/keyword-density-checker",
    icon: BarChart3,
  },
  {
    name: "Page Speed Estimator",
    description: "Estimate page load performance and get optimization suggestions.",
    href: "/tools/page-speed-estimator",
    icon: Zap,
  },
  {
    name: "Redirect Checker",
    description: "Trace redirect chains, detect loops, and verify redirect setup.",
    href: "/tools/redirect-checker",
    icon: RefreshCw,
  },
  {
    name: "Robots.txt Generator",
    description: "Create and validate robots.txt to control search engine crawling.",
    href: "/tools/robots-txt-generator",
    icon: FileCode,
  },
  {
    name: "Word Counter",
    description: "Count words, characters, sentences with reading time and top keyword extraction.",
    href: "/tools/word-counter",
    icon: LetterText,
  },
  {
    name: "Open Graph Checker",
    description: "Preview how pages look when shared on social media. Check OG and Twitter Card tags.",
    href: "/tools/open-graph-checker",
    icon: Share2,
  },
  {
    name: "Broken Link Checker",
    description: "Scan any page for dead links, 404 errors, and redirect issues with full status reports.",
    href: "/tools/broken-link-checker",
    icon: Unlink,
  },
  {
    name: "SSL Checker",
    description: "Verify SSL certificate validity, HTTPS configuration, and security headers.",
    href: "/tools/ssl-checker",
    icon: Lock,
  },
  {
    name: "HTTP Header Checker",
    description: "Inspect server response headers and security header configuration.",
    href: "/tools/http-header-checker",
    icon: Server,
  },
] as const;

export default function ToolsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "Free SEO Tools", url: `${config.appUrl}/tools` },
  ]);

  const itemListSchema = getItemListSchema({
    name: "Free SEO Tools by SerpNap",
    description: "16 professional-grade SEO tools — all free, no signup required.",
    itemListElement: TOOLS.map((tool) => ({
      name: tool.name,
      url: tool.href,
      description: tool.description,
    })),
  });

  const faqSchema = getFAQPageSchema([
    {
      question: "What are the best free SEO tools in 2026?",
      answer:
        "SerpNap offers 16 free SEO tools that cover the most common SEO tasks: SEO Checker (50+ audit checks), Technical Audit, Neural Audit (AI-powered), Meta Tag Generator, Schema Generator, Sitemap Validator, Headline Analyzer, Keyword Density Checker, Page Speed Estimator, Redirect Checker, Robots.txt Generator, Word Counter, Open Graph Checker, Broken Link Checker, SSL Checker, and HTTP Header Checker. All tools are free with no signup required.",
    },
    {
      question: "How can I check my website SEO for free?",
      answer:
        "Enter your website URL into SerpNap's free SEO Checker at serpnap.com/tools/seo-checker. It runs 50+ checks across 8 categories — meta tags, headings, images, performance, accessibility, structured data, mobile optimization, and E-E-A-T signals — and gives you a letter grade (A+ to F) with actionable fixes in under 30 seconds.",
    },
    {
      question: "Are free SEO tools accurate enough for professional use?",
      answer:
        "Yes. SerpNap's free SEO tools check the same ranking factors that paid tools like Semrush ($129/month) and Ahrefs ($99/month) analyze — meta tags, heading structure, Core Web Vitals, structured data, and more. The difference is that SerpNap focuses on on-page and technical SEO auditing rather than backlink databases or rank tracking.",
    },
    {
      question: "Do I need to create an account to use these SEO tools?",
      answer:
        "No. All 16 SerpNap tools work instantly with no signup, no email, and no credit card. Enter a URL, get results in seconds. You can also export detailed PDF reports without an account.",
    },
  ]);

  return (
    <>
    <MultipleStructuredData schemas={[breadcrumbSchema, itemListSchema, faqSchema]} />
    <section className="hero-padding container-padding">
      <div className="container-wide mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
              Free SEO Tools
            </p>
            <h1 className="text-hero">
              Free SEO Tools
            </h1>
            <p className="text-subheadline mt-5 max-w-lg mx-auto">
              16 professional-grade tools to audit, analyze, and optimize your website. No signup required.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <RevealOnScroll key={tool.href} delay={Math.min(i * 30, 200)}>
                <Link
                  href={tool.href}
                  className="group relative flex flex-col rounded-2xl border border-border/40 p-6 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:-translate-y-0.5 bg-background"
                >
                  {"featured" in tool && tool.featured && (
                    <span className="absolute top-4 right-4 text-[10px] font-medium tracking-wider text-foreground/50 bg-foreground/[0.04] px-2.5 py-1 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04] mb-4 transition-colors group-hover:bg-foreground/[0.07]">
                    <Icon className="h-[18px] w-[18px] text-foreground/70" />
                  </div>
                  <h2 className="text-[15px] font-semibold mb-1.5">
                    {tool.name}
                  </h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-center text-[12px] font-medium text-muted-foreground/60 group-hover:text-foreground/60 transition-colors">
                    <span>Try it free</span>
                    <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>

    {/* FAQ Section */}
    <section className="section-padding container-padding border-t border-border/20">
      <div className="max-w-3xl mx-auto">
        <RevealOnScroll>
          <h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
            Frequently Asked Questions
          </h2>
        </RevealOnScroll>
        <div className="space-y-6">
          {[
            {
              q: "What are the best free SEO tools in 2026?",
              a: "SerpNap offers 16 free SEO tools that cover the most common SEO tasks: SEO Checker (50+ audit checks), Technical Audit, Neural Audit (AI-powered), Meta Tag Generator, Schema Generator, Sitemap Validator, Headline Analyzer, Keyword Density Checker, Page Speed Estimator, Redirect Checker, Robots.txt Generator, Word Counter, Open Graph Checker, Broken Link Checker, SSL Checker, and HTTP Header Checker. All tools are free with no signup required.",
            },
            {
              q: "How can I check my website SEO for free?",
              a: "Enter your website URL into SerpNap's free SEO Checker at serpnap.com/tools/seo-checker. It runs 50+ checks across 8 categories — meta tags, headings, images, performance, accessibility, structured data, mobile optimization, and E-E-A-T signals — and gives you a letter grade (A+ to F) with actionable fixes in under 30 seconds.",
            },
            {
              q: "Are free SEO tools accurate enough for professional use?",
              a: "Yes. SerpNap's free SEO tools check the same ranking factors that paid tools like Semrush ($129/month) and Ahrefs ($99/month) analyze — meta tags, heading structure, Core Web Vitals, structured data, and more. The difference is that SerpNap focuses on on-page and technical SEO auditing rather than backlink databases or rank tracking.",
            },
            {
              q: "Do I need to create an account to use these SEO tools?",
              a: "No. All 16 SerpNap tools work instantly with no signup, no email, and no credit card. Enter a URL, get results in seconds. You can also export detailed PDF reports without an account.",
            },
          ].map((item) => (
            <RevealOnScroll key={item.q}>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight mb-2">
                  {item.q}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
