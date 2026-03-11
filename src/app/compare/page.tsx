import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "SerpNap vs Paid SEO Tools — Free Alternative Comparison",
  description:
    "See how SerpNap's free SEO tools compare to Semrush, Ahrefs, Moz, and Screaming Frog. Feature-by-feature comparison with honest analysis.",
  keywords: [
    "serpnap vs semrush",
    "serpnap vs ahrefs",
    "free seo tool alternative",
    "semrush alternative free",
    "ahrefs alternative free",
    "moz alternative free",
  ],
  alternates: {
    canonical: `${config.appUrl}/compare`,
  },
  openGraph: {
    title: "SerpNap vs Paid SEO Tools — Free Alternative Comparison",
    description:
      "Feature-by-feature comparison of SerpNap's free tools vs Semrush, Ahrefs, Moz, and Screaming Frog.",
    url: `${config.appUrl}/compare`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SerpNap vs Paid SEO Tools — Free Alternative Comparison",
    description: "Feature-by-feature comparison of SerpNap's free SEO tools vs Semrush, Ahrefs, Moz, and Screaming Frog.",
  },
};

const COMPARISONS = [
  {
    slug: "serpnap-vs-semrush",
    name: "SerpNap vs Semrush",
    description:
      "Compare SerpNap's free SEO checker against Semrush's $139.95/mo Site Audit tool. See which features you actually need.",
  },
  {
    slug: "serpnap-vs-ahrefs",
    name: "SerpNap vs Ahrefs",
    description:
      "Compare SerpNap's free SEO audit against Ahrefs' $129/mo Site Audit. Feature-by-feature breakdown.",
  },
  {
    slug: "serpnap-vs-moz",
    name: "SerpNap vs Moz Pro",
    description:
      "Compare SerpNap's free toolkit against Moz Pro's $99/mo plan. Find out what you get for free vs paid.",
  },
  {
    slug: "serpnap-vs-screaming-frog",
    name: "SerpNap vs Screaming Frog",
    description:
      "Compare SerpNap's browser-based SEO audit against Screaming Frog's desktop crawler. Different tools, different strengths.",
  },
] as const;

export default function ComparePage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "Compare", url: `${config.appUrl}/compare` },
  ]);

  const itemListSchema = getItemListSchema({
    name: "SerpNap SEO Tool Comparisons",
    description:
      "Compare SerpNap's free SEO tools against paid alternatives like Semrush, Ahrefs, Moz, and Screaming Frog.",
    itemListElement: COMPARISONS.map((c) => ({
      name: c.name,
      url: `/compare/${c.slug}`,
      description: c.description,
    })),
  });

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, itemListSchema]} />
      <Header />
      <main id="main" className="min-h-screen pt-14">
        <section className="hero-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                  Compare
                </p>
                <h1 className="text-hero">
                  SerpNap vs Paid SEO Tools
                </h1>
                <p className="text-subheadline mt-5 max-w-lg mx-auto">
                  Honest comparisons. See exactly what you get free with SerpNap
                  versus $100+/mo paid tools.
                </p>
              </div>
            </RevealOnScroll>

            <div className="space-y-4">
              {COMPARISONS.map((comp, i) => (
                <RevealOnScroll key={comp.slug} delay={i * 80}>
                  <Link
                    href={`/compare/${comp.slug}`}
                    className="group flex items-center gap-6 p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/40 transition-all duration-300 hover:border-border/70 hover:bg-card hover:shadow-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[17px] font-semibold tracking-tight group-hover:text-foreground transition-colors mb-1.5">
                        {comp.name}
                      </h2>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                        {comp.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-foreground/60 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
