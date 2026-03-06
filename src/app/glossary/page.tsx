import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { glossaryTerms } from "@/lib/glossary";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
  title: "SEO Glossary — Every SEO Term Explained Simply",
  description:
    "Learn SEO terminology: Core Web Vitals, E-E-A-T, schema markup, crawlability, meta tags, and more. Plain-English definitions with actionable context.",
  keywords: [
    "seo glossary",
    "seo terms",
    "seo definitions",
    "what is seo",
    "seo terminology",
    "search engine optimization glossary",
    "seo vocabulary",
  ],
  alternates: {
    canonical: `${config.appUrl}/glossary`,
  },
  openGraph: {
    title: "SEO Glossary — Every SEO Term Explained",
    description: "Plain-English definitions for every SEO term you need to know. From Core Web Vitals to E-E-A-T.",
    type: "website",
  },
};

export default function GlossaryPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "SEO Glossary", url: `${config.appUrl}/glossary` },
  ]);

  // Group terms alphabetically by first letter of the term
  const grouped = glossaryTerms.reduce<Record<string, typeof glossaryTerms>>((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  const sortedLetters = Object.keys(grouped).sort();

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema]} />
      <Header />
      <main id="main" className="min-h-screen pt-14">
        <section className="hero-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  Reference
                </p>
                <h1 className="text-hero">SEO Glossary</h1>
                <p className="text-subheadline mt-5 max-w-lg mx-auto">
                  {glossaryTerms.length} essential SEO terms explained in plain English.
                </p>
              </div>
            </RevealOnScroll>

            {sortedLetters.map((letter) => (
              <div key={letter} className="mb-10">
                <h2 className="text-[14px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-4 border-b border-border/30 pb-2">
                  {letter}
                </h2>
                <div className="space-y-3">
                  {grouped[letter].map((term) => (
                    <Link
                      key={term.slug}
                      href={`/glossary/${term.slug}`}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-card/60 transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold tracking-tight group-hover:text-foreground transition-colors">
                          {term.term}
                        </h3>
                        <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
                          {term.shortDefinition}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground/50 shrink-0 mt-1 transition-all duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
