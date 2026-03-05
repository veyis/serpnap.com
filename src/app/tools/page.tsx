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
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free SEO Tools",
  description:
    "Free, powerful SEO tools to audit, analyze, and optimize your website. SEO checker, meta tag generator, schema generator, sitemap validator, and more.",
  alternates: {
    canonical: "/tools",
  },
};

const TOOLS = [
  {
    name: "SEO Checker",
    description: "Comprehensive SEO audit with 50+ checks. Get your score and actionable recommendations.",
    href: "/tools/seo-checker",
    icon: Search,
    badge: "Most Popular",
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
] as const;

export default function ToolsPage() {
  return (
    <section className="hero-padding container-padding">
      <div className="container-wide mx-auto">
        <div className="text-center mb-12">
          <p className="text-eyebrow text-muted-foreground mb-4">
            Free SEO Tools
          </p>
          <h1 className="text-hero">All SEO Tools</h1>
          <p className="text-subheadline text-muted-foreground mt-4 max-w-2xl mx-auto">
            Free, powerful tools to audit, analyze, and optimize your website for
            search engines. No sign-up required.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative rounded-xl border border-border/60 p-6 transition-all hover:border-border hover:shadow-md hover:-translate-y-0.5"
              >
                {"badge" in tool && tool.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent mb-4">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h2 className="text-base font-semibold mb-2 group-hover:text-foreground">
                  {tool.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
