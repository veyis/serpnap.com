import { Metadata } from "next";
import { PageHero } from "@/components/agency/page-heroes";
import { CTASection } from "@/components/agency/cta-section";
import { NeuralAuditTool } from "@/components/agency/neural-audit-tool";
import { Search } from "lucide-react";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";
import { ToolsNav } from "@/components/tools/tools-nav";

export const metadata: Metadata = {
  title: "Neural Search Audit Tool | Brand Visibility Analysis 2026",
  description: "Diagnose your brand's presence in AI search models like Gemini, ChatGPT, and Claude. Get a real-time 'Share of Model' audit and GEO strategy.",
  keywords: [
    "ai seo audit",
    "neural search audit",
    "ai visibility checker",
    "generative engine optimization",
    "share of model",
    "llm brand visibility",
    "ai search optimization",
    "geo audit tool",
  ],
  alternates: {
    canonical: `${config.appUrl}/tools/neural-audit`,
  },
  openGraph: {
    title: "Neural Search Audit Tool | Brand Visibility Analysis",
    description: "Diagnose your brand's presence in AI search models like Gemini, ChatGPT, and Claude. Get a real-time 'Share of Model' audit and GEO strategy.",
    url: `${config.appUrl}/tools/neural-audit`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Search Audit Tool | Brand Visibility Analysis",
    description: "Diagnose your brand's presence in AI search models like Gemini, ChatGPT, and Claude.",
  },
};

export default function NeuralAuditPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: config.appUrl },
    { name: "Tools", url: `${config.appUrl}/tools` },
    { name: "Neural Search Audit", url: `${config.appUrl}/tools/neural-audit` },
  ]);
  const appSchema = getSoftwareApplicationSchema({
    name: "Neural Search Audit Tool",
    description:
      "Diagnose your brand's presence in AI search models like Gemini, ChatGPT, and Claude. Get a real-time Share of Model audit and GEO strategy.",
    url: `${config.appUrl}/tools/neural-audit`,
    applicationCategory: "BusinessApplication",
    featureList: [
      "AI model visibility analysis",
      "Share of Model scoring",
      "Citation frequency tracking",
      "GEO strategy recommendations",
    ],
  });
  const faqSchema = getFAQPageSchema([
    {
      question: "What is a Neural Search Audit?",
      answer: "A Neural Search Audit analyzes your brand's visibility within AI-powered search engines like ChatGPT, Gemini, Perplexity, and Claude. It measures your 'Share of Model' — how often AI models cite or recommend your brand when users ask relevant questions.",
    },
    {
      question: "What is Generative Engine Optimization (GEO)?",
      answer: "GEO is the practice of optimizing your content to be cited and recommended by AI search engines. Unlike traditional SEO which optimizes for Google's algorithm, GEO focuses on ensuring AI models understand your brand's authority, entity relationships, and topical expertise.",
    },
    {
      question: "Why does AI search visibility matter?",
      answer: "Over 64% of high-intent B2B searches now terminate within AI Overview windows. If your brand isn't cited as a primary source by AI models, you're losing leads to competitors whose content is better represented in neural search results.",
    },
    {
      question: "How is Share of Model calculated?",
      answer: "Share of Model measures how frequently AI models mention, cite, or recommend your brand relative to competitors for specific intents. It considers citation frequency, topic authority index, entity relationship mapping, and information gain scoring.",
    },
    {
      question: "Is this neural audit tool free?",
      answer: "Yes, completely free with no signup. Enter your brand and industry to get an instant AI visibility diagnostic with actionable GEO strategy recommendations.",
    },
  ]);
  const howToSchema = getHowToSchema({
    name: "How to Run a Neural Search Audit",
    description: "Analyze your brand's AI search visibility using the free SerpNap Neural Audit Tool.",
    totalTime: "PT2M",
    steps: [
      { name: "Enter your brand", text: "Input your brand name and industry to begin the AI visibility analysis." },
      { name: "Review Share of Model", text: "See your brand's citation frequency and visibility score across major AI search engines." },
      { name: "Analyze entity relationships", text: "Understand how AI models map your brand to relevant topics, competitors, and intents." },
      { name: "Implement GEO strategy", text: "Follow the actionable recommendations to improve your brand's presence in AI-generated search results." },
    ],
  });

  return (
    <main className="min-h-screen bg-background">
      <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
      <PageHero 
        theme="emerald"
        badgeIcon={Search}
        badgeText="Intelligence Diagnostic"
        headline="Neural Search"
        highlightedText="Coverage Audit"
        description="In 2026, being on page one of Google isn't enough. You must be present in the neural weights of the world's most powerful LLMs. Use this tool to analyze your current AI visibility deficit."
      />

      <section className="section-padding container-padding -mt-32 relative z-20">
         <NeuralAuditTool />
      </section>

      <section className="section-padding container-padding">
         <div className="max-w-4xl mx-auto space-y-24">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
               <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Understanding &apos;Share of Model&apos;</h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                     Traditional SEO measured clicks. <strong className="text-gray-900 dark:text-white font-medium">GEO (Generative Engine Optimization)</strong> measures mentions, citations, and semantic resolution. If Gemini doesn&apos;t know you satisfy a specific intent, you don&apos;t exist in the 2026 search economy.
                  </p>
                  <ul className="space-y-3.5">
                     {[
                       "Citation Frequency within RAG loops",
                       "Topic Authority Index (TAI)",
                       "Entity Relationship Mapping",
                       "Information Gain Scoring"
                     ].map(item => (
                       <li key={item} className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300 tracking-wide">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500/60 shrink-0" /> {item}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="p-8 sm:p-10 rounded-3xl space-y-5
                 bg-white/80 dark:bg-white/[0.03]
                 border border-gray-200/60 dark:border-white/[0.06]
                 shadow-sm dark:shadow-none
                 backdrop-blur-xl">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Why run this audit?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                     &quot;64% of high-intent B2B searches now terminate within the AI Overview window. If your brand isn&apos;t cited as the primary source, you are losing leads to your competitors&apos; neural content.&quot;
                  </p>
                  <div className="pt-5 border-t border-gray-200/50 dark:border-white/[0.06]">
                     <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400/70 dark:text-gray-600 text-center">Data Source: SerpNap 2026 Research Hub</p>
                  </div>
               </div>
            </div>

         </div>
      </section>

      <ToolsNav />
      <CTASection />
    </main>
  );
}
