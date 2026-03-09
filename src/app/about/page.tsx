import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight, Search, Shield, Bot, Zap } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "About SerpNap — Free SEO Tools for Everyone",
  description:
    "SerpNap provides 11 free, professional-grade SEO tools to audit, analyze, and optimize your website. No signup, no costs, no limits. Built by PxlPeak.",
  keywords: [
    "about serpnap",
    "free seo tools",
    "serpnap seo",
    "seo audit tool",
    "website seo checker",
  ],
  alternates: {
    canonical: `${config.appUrl}/about`,
  },
  openGraph: {
    title: "About SerpNap — Free SEO Tools for Everyone",
    description:
      "SerpNap provides 11 free, professional-grade SEO tools. No signup, no costs, no limits.",
    url: `${config.appUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SerpNap — Free SEO Tools for Everyone",
    description: "SerpNap provides free, professional-grade SEO tools. No signup, no costs, no limits.",
  },
};

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "About", url: `${config.appUrl}/about` },
  ]);

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema]} />
      <Header />
      <main id="main" className="min-h-screen pt-14">
        {/* Hero */}
        <section className="hero-padding container-padding">
          <div className="container-narrow mx-auto text-center">
            <RevealOnScroll>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                About
              </p>
              <h1 className="text-hero">
                SEO tools that respect
                <br />
                <span className="text-muted-foreground/50">
                  your time and budget.
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <p className="text-subheadline mt-7 max-w-xl mx-auto">
                We believe every website owner deserves access to
                professional-grade SEO analysis — without paywalls, signups, or
                usage caps.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              <RevealOnScroll>
                <div>
                  <h2 className="text-[22px] font-semibold tracking-tight mb-4">
                    Why we built SerpNap
                  </h2>
                  <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
                    <p>
                      Most SEO tools charge $100+/month for basic audits. Small
                      business owners and independent creators can&apos;t justify
                      that cost — so they fly blind, missing critical issues that
                      tank their rankings.
                    </p>
                    <p>
                      SerpNap changes that. We built 11 professional-grade tools
                      that run 50+ checks, generate AI-powered fixes, and deliver
                      instant results — completely free, forever.
                    </p>
                    <p>
                      No freemium walls. No &quot;upgrade to see results.&quot; No
                      data harvesting. Just tools that work.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <div>
                  <h2 className="text-[22px] font-semibold tracking-tight mb-4">
                    What makes us different
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Zap,
                        title: "Instant results",
                        text: "No signup, no email, no waiting. Enter a URL and get a full audit in under 30 seconds.",
                      },
                      {
                        icon: Bot,
                        title: "AI-powered fixes",
                        text: "Don't just find problems — get copy-paste code fixes generated for every issue.",
                      },
                      {
                        icon: Shield,
                        title: "Privacy-first",
                        text: "We don't track you, sell your data, or require an account. Your URLs stay your business.",
                      },
                      {
                        icon: Search,
                        title: "Comprehensive depth",
                        text: "50+ checks across meta tags, headings, images, performance, accessibility, structured data, and E-E-A-T.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.04]">
                            <Icon className="h-4 w-4 text-foreground/50" />
                          </div>
                          <div>
                            <h3 className="text-[14px] font-semibold tracking-tight">
                              {item.title}
                            </h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Built by */}
        <section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
          <div className="container-narrow mx-auto text-center">
            <RevealOnScroll>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                Built by
              </p>
              <h2 className="text-section mb-4">PxlPeak</h2>
              <p className="text-subheadline max-w-lg mx-auto">
                SerpNap is built and maintained by{" "}
                <a
                  href="https://pxlpeak.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  PxlPeak
                </a>
                , a digital agency specializing in SEO, web development, and
                AI-powered marketing solutions.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/tools/seo-checker"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-7 py-3.5 text-[14px] font-semibold transition-all duration-300 hover:opacity-90 press-effect"
                >
                  Try the SEO Checker
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`mailto:${config.business.contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-7 py-3.5 text-[14px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all duration-300"
                >
                  Contact Us
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
