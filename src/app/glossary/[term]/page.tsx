import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { getGlossaryTerm, getAllGlossarySlugs, glossaryTerms } from "@/lib/glossary";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema } from "@/lib/utils/seo";

interface Props {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((term) => ({ term }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};

  return {
    title: `${term.term} — SEO Glossary`,
    description: term.shortDefinition,
    alternates: {
      canonical: `${config.appUrl}/glossary/${term.slug}`,
    },
    openGraph: {
      title: `${term.term} — SEO Glossary`,
      description: term.shortDefinition,
      type: "article",
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "SEO Glossary", url: `${config.appUrl}/glossary` },
    { name: term.term, url: `${config.appUrl}/glossary/${term.slug}` },
  ]);

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.fullDefinition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "SEO Glossary",
      url: `${config.appUrl}/glossary`,
    },
  };

  const relatedTerms = term.relatedTerms
    ?.map((slug) => glossaryTerms.find((t) => t.slug === slug))
    .filter(Boolean) ?? [];

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, definedTermSchema]} />
      <Header />
      <main id="main" className="min-h-screen pt-14">
        <section className="hero-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <Link
                href="/glossary"
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                SEO Glossary
              </Link>

              <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight leading-[1.15] mb-6">
                {term.term}
              </h1>

              <div className="rounded-2xl border border-border/40 bg-card/40 p-6 sm:p-8 mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 mb-3">
                  Definition
                </p>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {term.fullDefinition}
                </p>
              </div>
            </RevealOnScroll>

            {term.relatedTools && term.relatedTools.length > 0 && (
              <RevealOnScroll delay={50}>
                <div className="mb-8">
                  <h2 className="text-[14px] font-semibold tracking-tight mb-4">
                    Related Tools
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-card/50 text-[13px] font-medium hover:border-border hover:bg-card transition-all duration-300"
                      >
                        {tool.label}
                        <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-foreground/60 transition-all duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            )}

            {relatedTerms.length > 0 && (
              <RevealOnScroll delay={100}>
                <div className="mb-8">
                  <h2 className="text-[14px] font-semibold tracking-tight mb-4">
                    Related Terms
                  </h2>
                  <div className="space-y-2">
                    {relatedTerms.map((related) => (
                      <Link
                        key={related!.slug}
                        href={`/glossary/${related!.slug}`}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-card/60 transition-all duration-300"
                      >
                        <span className="text-[14px] font-medium">{related!.term}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            )}

            <RevealOnScroll delay={150}>
              <div className="mt-12 pt-8 border-t border-border/30 text-center">
                <p className="text-[13px] text-muted-foreground mb-4">
                  Run a free SEO audit to see how your site performs.
                </p>
                <Link
                  href="/tools/seo-checker"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-7 py-3.5 text-[14px] font-semibold transition-all duration-300 hover:opacity-90 press-effect"
                >
                  Try the SEO Checker
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
