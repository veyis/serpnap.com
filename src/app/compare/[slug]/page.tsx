import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, X, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import {
  getComparison,
  getAllComparisonSlugs,
} from "@/lib/data/comparisons";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) return {};

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: {
      canonical: `${config.appUrl}/compare/${data.slug}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `${config.appUrl}/compare/${data.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) notFound();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "Compare", url: `${config.appUrl}/compare` },
    {
      name: data.heroTitle,
      url: `${config.appUrl}/compare/${data.slug}`,
    },
  ]);

  const faqSchema = getFAQPageSchema(data.faqs);

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, faqSchema]} />
      <Header />
      <main id="main" className="min-h-screen pt-14">
        {/* Hero */}
        <section className="hero-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Comparisons
              </Link>
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  Comparison
                </p>
                <h1 className="text-hero">{data.heroTitle}</h1>
                <p className="text-subheadline mt-5 max-w-xl mx-auto">
                  {data.heroSubtitle}
                </p>
              </div>
            </RevealOnScroll>

            {/* Price comparison banner */}
            <RevealOnScroll delay={100}>
              <div className="mt-12 grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/[0.03] p-6 text-center">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                    SerpNap
                  </p>
                  <p className="text-[32px] font-bold tracking-tight">$0</p>
                  <p className="text-[13px] text-muted-foreground mt-1">
                    Free forever, no signup
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {data.competitorName}
                  </p>
                  <p className="text-[32px] font-bold tracking-tight">
                    {data.competitorPrice}
                  </p>
                  <p className="text-[13px] text-muted-foreground mt-1">
                    Paid subscription required
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
                Feature-by-Feature Comparison
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={50}>
              <div className="rounded-2xl border border-border/40 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-3 bg-foreground/[0.03] border-b border-border/30">
                  <div className="p-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Feature
                  </div>
                  <div className="p-4 text-[12px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-center">
                    SerpNap
                  </div>
                  <div className="p-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                    {data.competitorName}
                  </div>
                </div>

                {/* Rows */}
                {data.features.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-3 ${
                      i < data.features.length - 1
                        ? "border-b border-border/20"
                        : ""
                    } ${i % 2 === 0 ? "" : "bg-foreground/[0.01]"}`}
                  >
                    <div className="p-4 text-[13.5px] font-medium">
                      {row.feature}
                    </div>
                    <div className="p-4 text-[13px] text-muted-foreground text-center">
                      {row.serpnap === "Not available" ? (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      ) : (
                        <span className="text-foreground">{row.serpnap}</span>
                      )}
                    </div>
                    <div className="p-4 text-[13px] text-muted-foreground text-center">
                      {row.competitor === "Not available" ? (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      ) : (
                        row.competitor
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Strengths */}
        <section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
                Where Each Tool Shines
              </h2>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 gap-6">
              <RevealOnScroll delay={50}>
                <div className="rounded-2xl border border-emerald-500/20 bg-card/60 p-6 h-full">
                  <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                    SerpNap strengths
                  </p>
                  <ul className="space-y-3">
                    {data.serpnapStrengths.map((s) => (
                      <li key={s} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[13.5px] text-muted-foreground leading-relaxed">
                          {s}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <div className="rounded-2xl border border-border/40 bg-card/60 p-6 h-full">
                  <p className="text-[13px] font-semibold text-muted-foreground mb-4">
                    {data.competitorName} strengths
                  </p>
                  <ul className="space-y-3">
                    {data.competitorStrengths.map((s) => (
                      <li key={s} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-foreground/40 shrink-0 mt-0.5" />
                        <span className="text-[13.5px] text-muted-foreground leading-relaxed">
                          {s}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Best For */}
        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <h2 className="text-[22px] font-semibold tracking-tight mb-4 text-center">
                The Verdict
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto mb-10">
                {data.verdict}
              </p>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 gap-6">
              <RevealOnScroll delay={50}>
                <div className="rounded-2xl border border-border/40 bg-card/40 p-6">
                  <p className="text-[14px] font-semibold mb-3">
                    Choose SerpNap if...
                  </p>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                    {data.bestFor.serpnap}
                  </p>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <div className="rounded-2xl border border-border/40 bg-card/40 p-6">
                  <p className="text-[14px] font-semibold mb-3">
                    Choose {data.competitorName} if...
                  </p>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                    {data.bestFor.competitor}
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
                Frequently Asked Questions
              </h2>
            </RevealOnScroll>

            <div className="space-y-6 max-w-2xl mx-auto">
              {data.faqs.map((faq, i) => (
                <RevealOnScroll key={faq.question} delay={i * 60}>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto text-center">
            <RevealOnScroll>
              <h2 className="text-[22px] font-semibold tracking-tight mb-4">
                Try SerpNap free — right now
              </h2>
              <p className="text-[15px] text-muted-foreground mb-8">
                No signup, no credit card, no trial period. Just paste a URL and
                see the results.
              </p>
              <Link
                href="/tools/seo-checker"
                className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-8 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
              >
                Run Free SEO Audit
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
