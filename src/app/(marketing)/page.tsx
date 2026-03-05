import Link from "next/link";
import {
  Search,
  FileText,
  Code,
  Globe,
  Zap,
  ArrowRight,
  Shield,
  BarChart3,
  RefreshCw,
  Bot,
  Type,
  FileCode,
} from "lucide-react";

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
    description: "Deep technical SEO analysis — crawlability, indexing, Core Web Vitals, and more.",
    href: "/tools/technical-audit",
    icon: Shield,
  },
  {
    name: "Neural Audit",
    description: "AI-powered SEO analysis that goes beyond traditional checklist audits.",
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
    description: "Create JSON-LD structured data for rich snippets in Google search results.",
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
    description: "Score your headlines for emotional impact, power words, and click-through potential.",
    href: "/tools/headline-analyzer",
    icon: Type,
  },
  {
    name: "Keyword Density Checker",
    description: "Analyze keyword frequency and density to optimize your content naturally.",
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
    description: "Trace redirect chains, detect loops, and verify your redirect setup.",
    href: "/tools/redirect-checker",
    icon: RefreshCw,
  },
  {
    name: "Robots.txt Generator",
    description: "Create and validate your robots.txt file to control search engine crawling.",
    href: "/tools/robots-txt-generator",
    icon: FileCode,
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-padding container-padding">
        <div className="container-wide mx-auto text-center">
          <p className="text-eyebrow text-muted-foreground mb-4">
            Free SEO Tools
          </p>
          <h1 className="text-hero max-w-3xl mx-auto">
            Snap Your SEO{" "}
            <span className="text-muted-foreground">Into Shape</span>
          </h1>
          <p className="text-subheadline text-muted-foreground mt-6 max-w-2xl mx-auto">
            Free, powerful SEO tools to audit, analyze, and optimize your website.
            Check your SEO score, generate meta tags, validate sitemaps, and more.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/seo-checker"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity press-effect"
            >
              Check Your SEO Score
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-padding container-padding">
        <div className="container-wide mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-section">All SEO Tools</h2>
            <p className="text-subheadline text-muted-foreground mt-3">
              Everything you need to optimize your website for search engines.
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
                  <h3 className="text-base font-semibold mb-2 group-hover:text-foreground">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding container-padding">
        <div className="container-narrow mx-auto text-center">
          <div className="rounded-2xl border border-border/60 p-8 sm:p-12">
            <h2 className="text-section">Need Expert Help?</h2>
            <p className="text-subheadline text-muted-foreground mt-3 max-w-lg mx-auto">
              Our tools found issues? Let our AI agency fix them for you.
              Professional SEO implementation by{" "}
              <a
                href="https://www.pxlpeak.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                PxlPeak
              </a>
              .
            </p>
            <a
              href="https://www.pxlpeak.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 rounded-lg bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity press-effect"
            >
              Get a Free Assessment
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
