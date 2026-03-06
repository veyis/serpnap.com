import Link from "next/link";
import Image from "next/image";
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
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { BeforeAfterSeo } from "@/components/marketing/before-after-seo";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/blog/faq-section";

const TOOLS = [
  {
    name: "SEO Checker",
    description: "Comprehensive audit with 50+ checks. Get your score and actionable fixes.",
    href: "/tools/seo-checker",
    icon: Search,
    featured: true,
  },
  {
    name: "Technical Audit",
    description: "Deep technical analysis — crawlability, indexing, Core Web Vitals.",
    href: "/tools/technical-audit",
    icon: Shield,
  },
  {
    name: "Neural Audit",
    description: "AI-powered analysis that goes beyond traditional checklists.",
    href: "/tools/neural-audit",
    icon: Bot,
  },
  {
    name: "Meta Tag Generator",
    description: "Optimized title tags and meta descriptions with live SERP preview.",
    href: "/tools/meta-tag-generator",
    icon: FileText,
  },
  {
    name: "Schema Generator",
    description: "JSON-LD structured data for rich snippets in search results.",
    href: "/tools/schema-generator",
    icon: Code,
  },
  {
    name: "Sitemap Validator",
    description: "Validate your XML sitemap for errors and best practices.",
    href: "/tools/sitemap-validator",
    icon: Globe,
  },
  {
    name: "Headline Analyzer",
    description: "Score headlines for emotional impact and click-through potential.",
    href: "/tools/headline-analyzer",
    icon: Type,
  },
  {
    name: "Keyword Density",
    description: "Analyze keyword frequency to optimize content naturally.",
    href: "/tools/keyword-density-checker",
    icon: BarChart3,
  },
  {
    name: "Page Speed",
    description: "Estimate load performance and get optimization suggestions.",
    href: "/tools/page-speed-estimator",
    icon: Zap,
  },
  {
    name: "Redirect Checker",
    description: "Trace redirect chains, detect loops, verify your setup.",
    href: "/tools/redirect-checker",
    icon: RefreshCw,
  },
  {
    name: "Robots.txt",
    description: "Create and validate robots.txt for search engine crawling.",
    href: "/tools/robots-txt-generator",
    icon: FileCode,
  },
] as const;

const FEATURES = [
  {
    title: "50+ SEO Checks",
    description: "From meta tags to E-E-A-T signals, every ranking factor analyzed in seconds.",
  },
  {
    title: "Instant Results",
    description: "No signup, no waiting. Enter a URL and get a comprehensive audit immediately.",
  },
  {
    title: "AI-Powered Fixes",
    description: "Get specific, actionable recommendations with code you can copy and paste.",
  },
  {
    title: "Always Free",
    description: "Professional-grade SEO tools with no hidden costs or usage limits.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-padding container-padding relative overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.03] dark:opacity-[0.04] bg-[radial-gradient(ellipse_at_center,var(--color-foreground)_0%,transparent_70%)]" />

        <div className="container-wide mx-auto text-center relative">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/50 backdrop-blur-sm mb-8">
              <Sparkles className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
                Free SEO Tools
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={50}>
            <h1 className="text-hero max-w-4xl mx-auto">
              Free SEO Tools
              <br />
              <span className="text-muted-foreground">That Actually Work.</span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <p className="text-subheadline mt-6 max-w-xl mx-auto">
              Audit, analyze, and optimize your website with professional-grade
              tools. No signup required.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/tools/seo-checker"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium transition-all hover:opacity-90 press-effect shadow-lg"
              >
                Check Your SEO Score
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 backdrop-blur-sm px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
              >
                Browse All Tools
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Features Strip */}
      <section className="container-padding pb-8">
        <div className="container-wide mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-border/40 overflow-hidden bg-border/40">
            {FEATURES.map((feature, i) => (
              <RevealOnScroll key={feature.title} delay={i * 50}>
                <div className="bg-background p-6 sm:p-8 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-padding container-padding">
        <div className="container-wide mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-section">Every tool you need.</h2>
              <p className="text-subheadline mt-4 max-w-lg mx-auto">
                11 specialized SEO tools, all free, all built for results.
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
                        <span className="absolute top-4 right-4 text-[10px] font-medium tracking-wider text-foreground/50 bg-foreground/4 px-2.5 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/4 mb-4 transition-colors group-hover:bg-foreground/[0.07]">
                      <Icon className="h-[18px] w-[18px] text-foreground/70" />
                    </div>
                    <h3 className="text-[15px] font-semibold mb-1.5">
                      {tool.name}
                    </h3>
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

      {/* How It Works */}
      <section className="section-padding container-padding">
        <div className="container-narrow mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-section">Three steps. Zero friction.</h2>
              <p className="text-subheadline mt-4">
                Get from URL to actionable insights in under 30 seconds.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Enter your URL",
                description: "Paste any webpage URL into the checker. No account needed.",
              },
              {
                step: "02",
                title: "Get your score",
                description: "50+ checks run in seconds across 9 SEO categories.",
              },
              {
                step: "03",
                title: "Fix & improve",
                description: "Follow prioritized recommendations with copy-paste fixes.",
              },
            ].map((item, i) => (
              <RevealOnScroll key={item.step} delay={i * 80}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-border/60 text-[13px] font-semibold text-muted-foreground mb-5">
                    {item.step}
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Vision Section with Images */}
      <section className="section-padding container-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-section">Built for Shopify owners who value time.</h2>
              <p className="text-subheadline mt-4 max-w-lg mx-auto">
                Stop guessing what&apos;s wrong with your SEO. SerpNap handles the hard work so you can focus on running your business.
              </p>
            </div>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-3 gap-6">
            <RevealOnScroll delay={100}>
              <div className="rounded-2xl overflow-hidden border border-border/40 bg-background/50 group h-full flex flex-col">
                <div className="relative overflow-hidden h-[300px]">
                  <Image 
                    src="/images/business_woman_macbook_1772745760011.png" 
                    alt="E-commerce store owner working" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold mb-2">Complete Store Audits</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">Automatically scan your entire product catalog for missing tags, thin content, and broken images in minutes.</p>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="rounded-2xl overflow-hidden border border-border/40 bg-background/50 group h-full flex flex-col">
                <div className="relative overflow-hidden h-[300px]">
                  <Image 
                    src="/images/entrepreneur_ipad_analytics_1772745781022.png" 
                    alt="Checking SEO analytics on iPad" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold mb-2">One-Click AI Fixes</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">Generate revenue-driving meta descriptions and title tags optimized simply by tapping a button.</p>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <div className="rounded-2xl overflow-hidden border border-border/40 bg-background/50 group h-full flex flex-col">
                <div className="relative overflow-hidden h-[300px]">
                  <Image 
                    src="/images/creative_ecommerce_owner_1772745803754.png" 
                    alt="Creative e-commerce owner" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold mb-2">Set It & Forget It</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">Weekly automated re-scans detect new issues immediately, ensuring your SEO is always sharp while you sleep.</p>
                </div>
              </div>
            </RevealOnScroll>
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

      {/* CTA */}
      <section className="section-padding container-padding">
        <div className="container-narrow mx-auto">
          <RevealOnScroll variant="scale">
            <div className="relative rounded-3xl bg-foreground px-8 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
              {/* Subtle glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_60%)]" />

              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-background/40 mb-6 relative">
                Need expert help?
              </p>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight leading-tight text-background relative">
                Tools found issues?
                <br />
                <span className="text-background/50">Let us fix them.</span>
              </h2>
              <p className="text-[15px] text-background/50 mt-5 max-w-md mx-auto leading-relaxed relative">
                Professional SEO implementation by our agency.
                From technical fixes to content strategy.
              </p>
              <div className="mt-8 relative">
                <a
                  href="https://www.pxlpeak.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium transition-all hover:opacity-90 press-effect"
                >
                  Get a Free Assessment
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
