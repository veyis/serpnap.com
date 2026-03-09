import type { Metadata } from "next";
import { HeadlineAnalyzer } from "@/components/tools/headline-analyzer";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import {
  getBreadcrumbSchema,
  getSoftwareApplicationSchema,
  getFAQPageSchema,
} from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { ToolsNav } from "@/components/tools/tools-nav";
import { RelatedResources } from "@/components/tools/related-resources";

export const metadata: Metadata = {
  title: "Free Headline Analyzer Tool | Score Your Headlines",
  description:
    "Free headline analyzer with scores for emotional appeal, power words, clarity, and uniqueness. Generate improved variations instantly.",
  keywords: [
    "headline analyzer",
    "headline score",
    "headline generator",
    "blog title analyzer",
    "headline optimizer",
    "seo headline tool",
    "title analyzer free",
    "emotional headline score",
    "power word checker",
    "headline tester",
    "blog headline generator",
    "marketing headline tool",
    "click-worthy headlines",
    "headline writing tool",
  ],
  alternates: {
    canonical: `${config.appUrl}/tools/headline-analyzer`,
  },
  openGraph: {
    title: "Free Headline Analyzer - Score & Improve Your Headlines | SerpNap",
    description:
      "Analyze headlines for emotional appeal, power words, and click-worthiness. Get instant scores and AI-generated improvements.",
    url: `${config.appUrl}/tools/headline-analyzer`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Headline Analyzer Tool | SerpNap",
    description: "Score your headlines and get AI-powered improvements. Boost your click-through rates instantly.",
  },
};

function getHeadlineAnalyzerSchema() {
  return getSoftwareApplicationSchema({
    name: "Free Headline Analyzer",
    description:
      "Free headline analysis tool that scores headlines for emotional appeal, power words, clarity, and uniqueness. Get instant improvements and click-through rate predictions.",
    url: `${config.appUrl}/tools/headline-analyzer`,
    applicationCategory: "WebApplication",
    operatingSystem: "Web Browser",
    offers: {
      price: "0",
      priceCurrency: "USD",
    },
  });
}

function getFAQSchema() {
  return getFAQPageSchema([
    {
      question: "What does the Headline Analyzer measure?",
      answer:
        "Our analyzer scores 5 key factors: Length (optimal 6-12 words), Power Words (emotional triggers that increase clicks), Emotional Appeal (questions, numbers, urgency), Clarity (removing weak filler words), and Uniqueness (standing out from common formats). Each factor is weighted to give you an overall score out of 100.",
    },
    {
      question: "Is this headline analyzer really free?",
      answer:
        "Yes, completely free with no signup required. You get full detailed analysis, suggestions, and AI-generated improved versions instantly. Analyze unlimited headlines without creating an account.",
    },
    {
      question: "What are power words in headlines?",
      answer:
        "Power words are emotionally-charged words that trigger a psychological response and increase click-through rates. Examples include: 'Ultimate', 'Proven', 'Exclusive', 'Secret', 'Guaranteed', 'Essential', 'Instant', and 'Free'. Headlines with 1-3 power words typically see 20-30% higher engagement.",
    },
    {
      question: "How long should my headline be?",
      answer:
        "The ideal headline length is 6-12 words or 50-70 characters. This length is optimal for Google search results (which truncate at ~60 characters), social media sharing, and email subject lines. Shorter headlines tend to perform better on social media, while slightly longer ones work better for SEO.",
    },
    {
      question: "Can I use this for blog titles and email subjects?",
      answer:
        "Absolutely! Our analyzer works for any type of headline: blog post titles, email subject lines, ad copy, social media posts, YouTube video titles, podcast episode names, and landing page headlines. The same principles of emotional appeal and clarity apply across all formats.",
    },
    {
      question: "How accurate is the headline score?",
      answer:
        "Our scoring algorithm is based on research from top marketing studies including Buzzsumo, CoSchedule, and Backlinko. While no tool can guarantee viral success, headlines scoring 70+ typically see higher click-through rates than those below 50. Use the score as a guide to improve your headlines.",
    },
    {
      question: "What makes a headline click-worthy?",
      answer:
        "Click-worthy headlines combine several elements: specific numbers (e.g., '7 Ways'), emotional triggers (power words), curiosity gaps (tease valuable information), clear benefit to the reader, and appropriate length. Questions and how-to formats also perform well. Our analyzer checks for all of these factors.",
    },
    {
      question: "Why should I remove weak words from headlines?",
      answer:
        "Weak words like 'very', 'really', 'just', 'basically', and 'actually' dilute your message and add no value. They make headlines feel vague and unprofessional. Removing them creates punchier, more impactful headlines that command attention and communicate confidence.",
    },
  ]);
}

const FAQ_ITEMS = [
  {
    question: "What does the Headline Analyzer measure?",
    answer:
      "Our analyzer scores 5 key factors: Length (optimal 6-12 words), Power Words (emotional triggers that increase clicks), Emotional Appeal (questions, numbers, urgency), Clarity (removing weak filler words), and Uniqueness (standing out from common formats). Each factor is weighted to give you an overall score out of 100.",
  },
  {
    question: "What are power words in headlines?",
    answer:
      "Power words are emotionally-charged words that trigger a psychological response and increase click-through rates. Examples include: 'Ultimate', 'Proven', 'Exclusive', 'Secret', 'Guaranteed', 'Essential', 'Instant', and 'Free'. Headlines with 1-3 power words typically see 20-30% higher engagement.",
  },
  {
    question: "How long should my headline be?",
    answer:
      "The ideal headline length is 6-12 words or 50-70 characters. This length is optimal for Google search results (which truncate at ~60 characters), social media sharing, and email subject lines.",
  },
  {
    question: "Can I use this for blog titles and email subjects?",
    answer:
      "Absolutely! Our analyzer works for any type of headline: blog post titles, email subject lines, ad copy, social media posts, YouTube video titles, podcast episode names, and landing page headlines.",
  },
  {
    question: "Is this headline analyzer free?",
    answer:
      "Yes, completely free with no signup required. Get full detailed analysis, suggestions, and AI-generated improved versions instantly. Analyze unlimited headlines without creating an account.",
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

export default function HeadlineAnalyzerPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Headline Analyzer", url: "/tools/headline-analyzer" },
  ]);

  return (
    <>
      <MultipleStructuredData
        schemas={[breadcrumbSchema, getHeadlineAnalyzerSchema(), getFAQSchema()]}
      />
      <HeadlineAnalyzer />
      <FAQSection />
      <RelatedResources
        tools={[
          { href: "/tools/meta-tag-generator", label: "Meta Tag Generator", description: "Generate optimized title tags and meta descriptions with SERP preview." },
          { href: "/tools/word-counter", label: "Word Counter", description: "Count words, characters, and check reading time." },
          { href: "/tools/keyword-density-checker", label: "Keyword Density Checker", description: "Analyze keyword frequency and avoid over-optimization." },
        ]}
        articles={[
          { href: "/blog/seo/how-to-write-meta-tags", title: "How to Write Perfect Meta Tags" },
          { href: "/blog/seo/content-quality-seo-strategies-2026", title: "Content Quality & SEO Strategies for 2026" },
        ]}
        glossaryTerms={[
          { href: "/glossary/what-is-title-tag", term: "Title Tag" },
          { href: "/glossary/what-is-meta-description", term: "Meta Description" },
          { href: "/glossary/what-is-search-intent", term: "Search Intent" },
          { href: "/glossary/what-is-featured-snippet", term: "Featured Snippet" },
        ]}
      />
      <ToolsNav />
    </>
  );
}
