import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import Image from "next/image";
import { config } from "@/lib/config";
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
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { BeforeAfterSeo } from "@/components/marketing/before-after-seo";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/blog/faq-section";

export const metadata: Metadata = {
  alternates: {
    canonical: config.appUrl,
  },
};

const TOOLS = [
  {
    name: "SEO Checker",
    description:
      "Comprehensive audit with 50+ checks. Get your score and actionable fixes.",
    href: "/tools/seo-checker",
    icon: Search,
    featured: true,
  },
  {
    name: "Technical Audit",
    description:
      "Deep technical analysis — crawlability, indexing, Core Web Vitals.",
    href: "/tools/technical-audit",
    icon: Shield,
  },
  {
    name: "Neural Audit",
    description:
      "AI-powered analysis that goes beyond traditional checklists.",
    href: "/tools/neural-audit",
    icon: Bot,
  },
  {
    name: "Meta Tag Generator",
    description:
      "Optimized title tags and meta descriptions with live SERP preview.",
    href: "/tools/meta-tag-generator",
    icon: FileText,
  },
  {
    name: "Schema Generator",
    description:
      "JSON-LD structured data for rich snippets in search results.",
    href: "/tools/schema-generator",
    icon: Code,
  },
  {
    name: "Sitemap Validator",
    description:
      "Validate your XML sitemap for errors and best practices.",
    href: "/tools/sitemap-validator",
    icon: Globe,
  },
  {
    name: "Headline Analyzer",
    description:
      "Score headlines for emotional impact and click-through potential.",
    href: "/tools/headline-analyzer",
    icon: Type,
  },
  {
    name: "Keyword Density",
    description:
      "Analyze keyword frequency to optimize content naturally.",
    href: "/tools/keyword-density-checker",
    icon: BarChart3,
  },
  {
    name: "Page Speed",
    description:
      "Estimate load performance and get optimization suggestions.",
    href: "/tools/page-speed-estimator",
    icon: Zap,
  },
  {
    name: "Redirect Checker",
    description:
      "Trace redirect chains, detect loops, verify your setup.",
    href: "/tools/redirect-checker",
    icon: RefreshCw,
  },
  {
    name: "Robots.txt",
    description:
      "Create and validate robots.txt for search engine crawling.",
    href: "/tools/robots-txt-generator",
    icon: FileCode,
  },
] as const;

const STATS = [
  { value: "50+", label: "SEO Checks" },
  { value: "11", label: "Free Tools" },
  { value: "<30s", label: "Full Audit" },
  { value: "$0", label: "Forever" },
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen pt-14">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[1000px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-[0.03] dark:opacity-[0.06]" />
          </div>

          <div className="hero-padding container-padding">
            <div className="container-wide mx-auto">
              <div className="max-w-3xl mx-auto text-center">
                <RevealOnScroll>
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm mb-10">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[12px] font-medium text-muted-foreground">
                      Free forever — no signup required
                    </span>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={50}>
                  <h1 className="text-hero">
                    Free SEO Tools
                    <br />
                    <span className="text-muted-foreground/50">That Actually Work.</span>
                  </h1>
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                  <p className="text-subheadline mt-7 max-w-xl mx-auto">
                    Professional-grade SEO tools that audit, analyze, and
                    optimize your site. Instant results, zero friction.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll delay={150}>
                  <div className="mt-12 max-w-xl mx-auto">
                    <form 
                      action="/tools/seo-checker" 
                      className="group relative flex items-center w-full rounded-full border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 overflow-hidden p-[6px]"
                    >
                      <div className="pl-5 pr-3 text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
                        <Globe className="h-[22px] w-[22px]" />
                      </div>
                      <input
                        type="url"
                        name="url"
                        placeholder="Enter your Shopify domain (e.g., mystore.com)"
                        required
                        className="w-full bg-transparent text-[16px] font-medium outline-none placeholder:text-muted-foreground/60 placeholder:font-normal h-12"
                      />
                      <button
                        type="submit"
                        className="shrink-0 flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full text-[15px] font-semibold tracking-tight transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                      >
                        Analyze Store
                        <ArrowRight className="h-[18px] w-[18px]" />
                      </button>
                    </form>
                    <div className="flex items-center justify-center gap-2 text-[12.5px] font-medium text-muted-foreground mt-5">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span>Scans 50+ SEO ranking factors instantly. No credit card required.</span>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Stats strip */}
                <RevealOnScroll delay={200}>
                  <div className="mt-16 flex items-center justify-center">
                    <div className="inline-flex items-center divide-x divide-border/50 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm px-2 py-3">
                      {STATS.map((stat) => (
                        <div
                          key={stat.label}
                          className="px-5 sm:px-8 text-center"
                        >
                          <p className="text-lg sm:text-xl font-semibold tracking-tight">
                            {stat.value}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tools Grid ── */}
        <section className="section-padding container-padding">
          <div className="container-wide mx-auto">
            <RevealOnScroll>
              <div className="max-w-lg mx-auto text-center mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  Toolkit
                </p>
                <h2 className="text-section">Every tool you need.</h2>
                <p className="text-subheadline mt-4">
                  11 specialized tools — all free, all instant, all built for
                  real results.
                </p>
              </div>
            </RevealOnScroll>

            {/* Featured tool */}
            <RevealOnScroll delay={50}>
              <Link
                href="/tools/seo-checker"
                className="group relative flex flex-col sm:flex-row items-start gap-6 rounded-3xl border border-border/40 bg-card/60 p-8 sm:p-10 mb-4 transition-all duration-500 hover:border-border/70 hover:shadow-xl hover:bg-card"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground/[0.05] transition-colors duration-300 group-hover:bg-foreground/[0.08]">
                  <Search className="h-6 w-6 text-foreground/70" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold tracking-tight">
                      SEO Checker
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground bg-foreground/[0.04] px-2.5 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
                    The most comprehensive free SEO audit online. 50+ checks
                    across meta tags, headings, images, performance,
                    accessibility, structured data, and E-E-A-T signals — with
                    AI-powered fixes.
                  </p>
                </div>
                <div className="hidden sm:flex items-center self-center text-muted-foreground/40 group-hover:text-foreground/60 transition-colors duration-300">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </RevealOnScroll>

            {/* Tool grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {TOOLS.slice(1).map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <RevealOnScroll
                    key={tool.href}
                    delay={Math.min(i * 40, 250)}
                  >
                    <Link
                      href={tool.href}
                      className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/40 p-5 h-full transition-all duration-400 hover:border-border/70 hover:shadow-lg hover:bg-card hover:-translate-y-0.5"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.04] mb-4 transition-colors duration-300 group-hover:bg-foreground/[0.07]">
                        <Icon className="h-4 w-4 text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300" />
                      </div>
                      <h3 className="text-[14px] font-semibold mb-1.5 tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-[12.5px] text-muted-foreground leading-relaxed flex-1">
                        {tool.description}
                      </p>
                      <div className="mt-4 pt-3 border-t border-border/30 flex items-center text-[11.5px] font-medium text-muted-foreground/50 group-hover:text-foreground/60 transition-colors duration-300">
                        <span>Open tool</span>
                        <ArrowRight className="h-3 w-3 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="section-padding container-padding">
          <div className="container-wide mx-auto">
            <RevealOnScroll>
              <div className="max-w-lg mx-auto text-center mb-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  How It Works
                </p>
                <h2 className="text-section">Three steps. Zero friction.</h2>
                <p className="text-subheadline mt-4">
                  URL to actionable insights in under 30 seconds.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid gap-4 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Enter your URL",
                  description:
                    "Paste any webpage URL into the tool. No account, no signup, no friction.",
                },
                {
                  step: "02",
                  title: "Get your score",
                  description:
                    "50+ checks run instantly across 9 categories — meta, headings, performance, and more.",
                },
                {
                  step: "03",
                  title: "Fix & improve",
                  description:
                    "Follow prioritized, actionable recommendations with ready-to-use code fixes.",
                },
              ].map((item, i) => (
                <RevealOnScroll key={item.step} delay={i * 100}>
                  <div className="relative rounded-2xl border border-border/40 bg-card/40 p-8 h-full transition-all duration-300 hover:border-border/60 hover:bg-card/80">
                    <span className="text-[52px] font-bold tracking-tighter text-foreground/[0.03] leading-none absolute top-5 right-6 select-none">
                      {item.step}
                    </span>
                    <div className="relative">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-foreground/[0.05] text-[13px] font-semibold text-muted-foreground mb-5">
                        {item.step}
                      </div>
                      <h3 className="text-[16px] font-semibold tracking-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── Visual Story ── */}
        <section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
          <div className="container-wide mx-auto">
            <RevealOnScroll>
              <div className="max-w-lg mx-auto text-center mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  Built for You
                </p>
                <h2 className="text-section">
                  Built for Shopify owners who value time.
                </h2>
                <p className="text-subheadline mt-4">
                  Stop guessing what&apos;s wrong with your SEO. SerpNap handles
                  the hard work so you can focus on running your business.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  src: "/images/business_woman_macbook_1772745760011.png",
                  alt: "E-commerce store owner working",
                  title: "Complete Store Audits",
                  description:
                    "Automatically scan your entire product catalog for missing tags, thin content, and broken images in minutes.",
                },
                {
                  src: "/images/entrepreneur_ipad_analytics_1772745781022.png",
                  alt: "Checking SEO analytics on iPad",
                  title: "One-Click AI Fixes",
                  description:
                    "Generate revenue-driving meta descriptions and title tags optimized simply by tapping a button.",
                },
                {
                  src: "/images/creative_ecommerce_owner_1772745803754.png",
                  alt: "Creative e-commerce owner",
                  title: "Set It & Forget It",
                  description:
                    "Weekly automated re-scans detect new issues immediately, ensuring your SEO is always sharp while you sleep.",
                },
              ].map((card, i) => (
                <RevealOnScroll key={card.title} delay={i * 100}>
                  <div className="group rounded-2xl overflow-hidden border border-border/40 bg-card/60 h-full flex flex-col transition-all duration-500 hover:border-border/60 hover:shadow-lg">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <Image
                        src={card.src}
                        alt={card.alt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-[15px] font-semibold tracking-tight mb-1.5">
                        {card.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── Before & After SEO ── */}
        <BeforeAfterSeo />
        
        {/* ── ROI Calculator ── */}
        <RoiCalculator />

        {/* ── Pricing ── */}
        <Pricing />

        {/* ── FAQ ── */}
        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-section text-[32px] sm:text-[40px] tracking-tight mb-4">
                  Frequently asked questions
                </h2>
                <p className="text-[15px] text-muted-foreground">
                  Everything you need to know about the product and billing.
                </p>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={100}>
              <FAQ
                includeSchema
                items={[
                  {
                    question: "How does SerpNap differ from other SEO apps?",
                    answer: "Unlike other SEO apps that just give you complex dashboards or scores, SerpNap uses context-aware AI to write the actual fixes for your products. You don't have to be an expert to use it—you just click 'Apply Fix' and SerpNap instantly pushes the optimized code to your store."
                  },
                  {
                    question: "Will this slow down my Shopify theme?",
                    answer: "Not at all. SerpNap interacts directly with Shopify's Admin API to update your metadata and alt text natively. We don't inject unoptimized JavaScript into your theme code, so you keep your blazing-fast loading speeds."
                  },
                  {
                    question: "I have 5,000+ products. Will it work for me?",
                    answer: "Yes. Our bulk-update engine is specifically engineered for high-volume catalogs. With our Growth or Pro plans, you can instantly select an entire collection of thousands of products and have authentic, relevant meta tags generated and applied to all of them automatically."
                  },
                  {
                    question: "Do I need any SEO experience to see results?",
                    answer: "None. We built SerpNap for store owners to use. The platform identifies critical issues (like empty meta descriptions or poor title tags), explains why it hurts your sales in plain English, and provides the best-practice fix right below it."
                  },
                  {
                    question: "What happens when my 7-day free trial ends?",
                    answer: "You can try full access completely free for 7 days. If you don't cancel before the trial is over, your chosen billing plan will start seamlessly. If you decide the tool isn't for you, you can cancel instantly with two clicks directly from your Shopify admin dashboard."
                  }
                ]}
              />
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Why SerpNap ── */}
        <section className="section-padding container-padding">
          <div className="container-wide mx-auto">
            <RevealOnScroll>
              <div className="max-w-lg mx-auto text-center mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  Why SerpNap
                </p>
                <h2 className="text-section">Built different.</h2>
                <p className="text-subheadline mt-4">
                  What sets us apart from every other SEO tool.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-border/40 overflow-hidden bg-border/30">
              {[
                {
                  icon: Sparkles,
                  title: "50+ Checks",
                  description:
                    "Meta tags to E-E-A-T signals — every ranking factor, analyzed.",
                },
                {
                  icon: Zap,
                  title: "Instant Results",
                  description:
                    "No signup, no waiting. URL in, full audit out.",
                },
                {
                  icon: Bot,
                  title: "AI-Powered Fixes",
                  description:
                    "Copy-paste code fixes generated for every issue found.",
                },
                {
                  icon: Shield,
                  title: "Always Free",
                  description:
                    "Professional-grade tools. No hidden costs. No limits.",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <RevealOnScroll key={feature.title} delay={i * 60}>
                    <div className="bg-background p-7 sm:p-8 h-full">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.04] mb-4">
                        <Icon className="h-4 w-4 text-foreground/50" />
                      </div>
                      <h3 className="text-[14px] font-semibold tracking-tight mb-1.5">
                        {feature.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll variant="scale">
              <div className="relative rounded-[28px] bg-foreground px-8 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
                {/* Subtle shine */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/35 mb-7">
                    Need expert help?
                  </p>
                  <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight leading-[1.1] text-background">
                    Tools found issues?
                    <br />
                    <span className="text-background/40">
                      Let us fix them.
                    </span>
                  </h2>
                  <p className="text-[15px] text-background/45 mt-6 max-w-md mx-auto leading-relaxed">
                    Professional SEO implementation by our agency team. From
                    technical fixes to full content strategy.
                  </p>
                  <div className="mt-9">
                    <a
                      href="https://www.pxlpeak.com/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-background text-foreground px-7 py-3.5 text-[14px] font-semibold transition-all duration-300 hover:opacity-90 press-effect"
                    >
                      Get a Free Assessment
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
