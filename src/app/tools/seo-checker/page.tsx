import type { Metadata } from "next";
import { SEOCheckerTerminal } from "@/components/tools/seo-checker";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import {
  getBreadcrumbSchema,
  getSoftwareApplicationSchema,
  getFAQPageSchema,
  getHowToSchema,
} from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { ToolsNav } from "@/components/tools/tools-nav";

export const metadata: Metadata = {
  title: "Free SEO Checker — Comprehensive Audit in Seconds",
  description:
    "Run a comprehensive SEO audit across 8 categories with Lighthouse score estimation. Get letter grades, readability scores, and actionable fixes.",
  keywords: [
    "free seo checker",
    "seo analysis tool",
    "website seo analyzer",
    "seo audit tool",
    "check seo score",
    "website accessibility checker",
    "seo grade checker",
  ],
  alternates: {
    canonical: `${config.appUrl}/tools/seo-checker`,
  },
  openGraph: {
    title: "Free SEO Checker — Comprehensive Audit in Seconds | SerpNap",
    description:
      "Run a comprehensive SEO audit across 8 categories. Get a letter grade and actionable fixes. Free, instant results.",
    url: `${config.appUrl}/tools/seo-checker`,
    type: "website",
  },
  twitter: {
      card: "summary_large_image",
      title: "Free SEO Checker — Comprehensive Audit in Seconds | SerpNap",
      description: "Run a comprehensive SEO audit across 8 categories with Lighthouse score estimation. Get letter grades, readability scores, and actionable fixes.",
  },
};

function getSEOCheckerSchema() {
  return getSoftwareApplicationSchema({
    name: "SEO Checker",
    description:
      "Free SEO analysis tool with comprehensive checks, letter grades, and actionable recommendations.",
    url: `${config.appUrl}/tools/seo-checker`,
    applicationCategory: "WebApplication",
    operatingSystem: "Web Browser",
    offers: { price: "0", priceCurrency: "USD" },
  });
}

function getFAQSchema() {
  return getFAQPageSchema([
    {
      question: "What does the SEO Checker analyze?",
      answer:
        "It runs a comprehensive audit across 8 categories: technical SEO & performance, meta tags, content quality, structured data, accessibility, E-E-A-T trust signals, mobile optimization, and international SEO. You get a letter grade (A+ to F) with actionable fixes for every issue.",
    },
    {
      question: "Is this SEO checker free?",
      answer:
        "Yes, completely free with no signup required. Get instant results with a detailed PDF report.",
    },
    {
      question: "What is the SEO grade based on?",
      answer:
        "Your grade is calculated from a weighted score across all 8 categories. Scores 95+ earn an A+, while scores below 45 receive an F. Most websites score between 50-75 (C to B range).",
    },
    {
      question: "Does this tool estimate Lighthouse scores?",
      answer:
        "Yes, we estimate Performance, Accessibility, Best Practices, and SEO scores using heuristic analysis of your HTML. Each category includes a confidence level (low/medium/high) since some metrics like Core Web Vitals require browser rendering. For exact scores, run Google Lighthouse directly.",
    },
  ]);
}

function getHowToUseSchema() {
  return getHowToSchema({
    name: "How to Run a Free SEO Audit with SerpNap SEO Checker",
    description:
      "Use the SerpNap SEO Checker to run a comprehensive website audit in seconds. Get a letter grade, Lighthouse estimates, and actionable fixes — no signup required.",
    totalTime: "PT2M",
    steps: [
      {
        name: "Enter your website URL",
        text: "Type or paste your website URL into the SEO Checker input field. The tool accepts any valid URL.",
      },
      {
        name: "Run the analysis",
        text: "Click the 'Analyze' button to start the audit. The checker runs 130+ checks across 8 categories including technical SEO, meta tags, content quality, and accessibility.",
      },
      {
        name: "Review your SEO grade",
        text: "View your overall letter grade (A+ to F) and category-level scores. Each category shows a detailed breakdown of passed and failed checks.",
      },
      {
        name: "Fix issues and export report",
        text: "Follow the actionable recommendations to fix issues. Download a detailed PDF report to share with your team or track progress over time.",
      },
    ],
  });
}

const FAQ_ITEMS = [
  {
    question: "What does the SEO Checker analyze?",
    answer:
      "It runs a comprehensive audit across 8 categories: technical SEO & performance, meta tags, content quality, structured data, accessibility, E-E-A-T trust signals, mobile optimization, and international SEO. You get a letter grade (A+ to F) with actionable fixes for every issue.",
  },
  {
    question: "Is this SEO checker free?",
    answer:
      "Yes, completely free with no signup required. Get instant results with a detailed PDF report.",
  },
  {
    question: "What is the SEO grade based on?",
    answer:
      "Your grade is calculated from a weighted score across all 8 categories. Scores 95+ earn an A+, while scores below 45 receive an F. Most websites score between 50-75 (C to B range).",
  },
  {
    question: "Does this tool estimate Lighthouse scores?",
    answer:
      "Yes, we estimate Performance, Accessibility, Best Practices, and SEO scores using heuristic analysis of your HTML. Each category includes a confidence level (low/medium/high) since some metrics like Core Web Vitals require browser rendering. For exact scores, run Google Lighthouse directly.",
  },
];

function FAQSection() {
  return (
    <section className="section-padding container-padding">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <h3 className="text-[15px] font-semibold tracking-tight mb-2">
                {item.question}
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SEOCheckerPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "SEO Checker", url: "/tools/seo-checker" },
  ]);

  return (
    <>
      <MultipleStructuredData
        schemas={[breadcrumbSchema, getSEOCheckerSchema(), getFAQSchema(), getHowToUseSchema()]}
      />
      <SEOCheckerTerminal />
      <FAQSection />
      <ToolsNav />
    </>
  );
}
