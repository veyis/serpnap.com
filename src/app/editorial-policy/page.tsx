import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Editorial Policy — How We Create & Review Content",
  description:
    "SerpNap's editorial policy outlines how we research, write, fact-check, and maintain the accuracy of our SEO tools, guides, and educational content.",
  alternates: {
    canonical: `${config.appUrl}/editorial-policy`,
  },
  openGraph: {
    title: "Editorial Policy — How We Create & Review Content",
    description:
      "SerpNap's editorial policy outlines how we research, write, fact-check, and maintain content accuracy.",
    url: `${config.appUrl}/editorial-policy`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Editorial Policy | SerpNap",
    description: "How SerpNap researches, writes, fact-checks, and maintains the accuracy of our SEO content.",
  },
};

export default function EditorialPolicyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "Editorial Policy", url: `${config.appUrl}/editorial-policy` },
  ]);

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema]} />
      <Header />
      <main id="main" className="min-h-screen pt-14">
        <section className="hero-padding container-padding">
          <div className="container-narrow mx-auto">
            <RevealOnScroll>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
                Editorial Policy
              </p>
              <h1 className="text-hero text-[32px] sm:text-[40px]">
                How we create and review content
              </h1>
              <p className="text-subheadline mt-5 max-w-xl">
                Accuracy, transparency, and helpfulness guide everything we
                publish at SerpNap.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        <section className="section-padding container-padding">
          <div className="container-narrow mx-auto">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    Our commitment to accuracy
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    SerpNap provides SEO tools and educational content used by
                    thousands of website owners, developers, and SEO
                    professionals. We take this responsibility seriously. Every
                    tool output, guide, and glossary definition is reviewed for
                    technical accuracy against current search engine
                    documentation and industry standards.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    Content creation process
                  </h2>
                  <ul className="space-y-3 text-[15px] text-muted-foreground leading-relaxed">
                    <li>
                      <strong className="text-foreground">Research:</strong>{" "}
                      Content is based on official documentation from Google
                      Search Central, W3C standards, schema.org specifications,
                      and peer-reviewed SEO research.
                    </li>
                    <li>
                      <strong className="text-foreground">Writing:</strong>{" "}
                      Articles are written by SEO practitioners with hands-on
                      experience implementing the techniques they describe.
                    </li>
                    <li>
                      <strong className="text-foreground">Review:</strong> All
                      content undergoes technical review before publication to
                      verify claims, check code examples, and validate
                      recommendations.
                    </li>
                    <li>
                      <strong className="text-foreground">Publication:</strong>{" "}
                      Every article includes a publication date and is updated
                      when search engine guidelines or best practices change.
                    </li>
                  </ul>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    Source citation standards
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    When we reference statistics, research findings, or
                    third-party data, we cite the original source with the
                    author or organization name, publication year, and a link
                    when available. We prioritize primary sources over secondary
                    reporting.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    Updates and corrections
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    SEO best practices evolve as search engines update their
                    algorithms and guidelines. We regularly review and update
                    existing content to reflect current recommendations. When we
                    make substantive corrections, we update the
                    &quot;dateModified&quot; timestamp and note the change where
                    appropriate. If you spot an error, please contact us at{" "}
                    <a
                      href={`mailto:${config.business.contact.email}`}
                      className="text-foreground underline hover:no-underline"
                    >
                      {config.business.contact.email}
                    </a>
                    .
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    AI disclosure
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    Some content on SerpNap is created with the assistance of AI
                    tools. When AI is used, the output is always reviewed,
                    fact-checked, and edited by a human with SEO expertise before
                    publication. Our SEO audit tools may use AI to generate fix
                    suggestions — these are clearly labeled as AI-generated
                    recommendations.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    Independence and advertising
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    SerpNap is built by{" "}
                    <a
                      href="https://pxlpeak.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline hover:no-underline"
                    >
                      PxlPeak
                    </a>
                    , a digital agency. Our tools are free and our editorial
                    content is independent. Tool comparisons and alternative
                    pages present factual feature comparisons. We do not accept
                    payment for editorial coverage or reviews.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight mb-3">
                    Author expertise requirements
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    Content authors must have demonstrable experience in the
                    topics they cover — whether through professional practice,
                    published work, or recognized industry credentials. Author
                    bylines link to profile pages that detail their background
                    and qualifications.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
