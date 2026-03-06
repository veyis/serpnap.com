import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Keyword Density Checker — Analyze Any Content",
    description:
        "Analyze keyword frequency and density in your content. See 1-word, 2-word, and 3-word phrase density with over-optimization warnings and readability stats.",
    keywords: [
        "keyword density checker",
        "keyword density checker free",
        "keyword density analyzer",
        "keyword frequency counter",
        "keyword stuffing checker",
        "seo keyword density tool",
        "content keyword analysis",
        "keyword density calculator",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/keyword-density-checker`,
    },
    openGraph: {
        title: "Free Keyword Density Checker — Analyze Any Content",
        description: "Analyze keyword frequency with 1-word, 2-word, and 3-word n-grams. Get over-optimization warnings and readability stats.",
        url: `${config.appUrl}/tools/keyword-density-checker`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Keyword Density Checker — Content Analysis Tool",
        description: "Analyze keyword frequency in your content. See n-gram density with over-optimization warnings.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Keyword Density Checker", url: `${config.appUrl}/tools/keyword-density-checker` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Keyword Density Checker",
        description: "Analyze keyword frequency with n-gram analysis and over-optimization detection.",
        url: `${config.appUrl}/tools/keyword-density-checker`,
        applicationCategory: "WebApplication",
        featureList: [
            "1-word, 2-word, 3-word n-gram analysis",
            "Target keyword tracking",
            "Density percentage calculation",
            "Over-optimization warnings",
            "Word count and reading time",
            "Readability statistics",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is keyword density?",
            answer: "Keyword density is the percentage of times a keyword or phrase appears in your content compared to the total word count. For example, if 'SEO tools' appears 5 times in a 500-word article, the keyword density is 1%.",
        },
        {
            question: "What is the ideal keyword density for SEO?",
            answer: "Most SEO professionals recommend a keyword density between 0.5% and 2.5% for primary keywords. Below 0.5% and Google may not associate your page with that keyword. Above 3% risks triggering over-optimization penalties.",
        },
        {
            question: "What are n-grams in keyword analysis?",
            answer: "N-grams are multi-word phrases extracted from your text. 1-grams are single words, 2-grams are two-word phrases (like 'content marketing'), and 3-grams are three-word phrases. Google understands phrases, so n-gram analysis reveals the actual topics your content covers.",
        },
        {
            question: "How do I avoid keyword stuffing?",
            answer: "Use synonyms and related terms (LSI keywords) instead of repeating the same keyword. Write naturally for readers first. If your keyword density exceeds 3%, consider replacing some instances with variations. This tool highlights over-optimized keywords automatically.",
        },
        {
            question: "Is this keyword density checker free?",
            answer: "Yes, completely free with no signup required. Paste any text to get instant analysis of keyword frequency, density percentages, and over-optimization warnings.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Check Keyword Density",
        description: "Analyze keyword frequency in your content using the free SerpNap Keyword Density Checker.",
        totalTime: "PT1M",
        steps: [
            { name: "Paste your content", text: "Copy your article, blog post, or page content and paste it into the text area." },
            { name: "Set a target keyword (optional)", text: "Enter your primary keyword to track its specific density and occurrence count." },
            { name: "Review density analysis", text: "Check the 1-word, 2-word, and 3-word tabs to see which phrases dominate your content and their density percentages." },
            { name: "Optimize your content", text: "Reduce over-optimized keywords (above 3%) by using synonyms. Increase under-represented keywords (below 0.5%) by adding natural mentions." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
