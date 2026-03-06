import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Schema Markup Generator — JSON-LD for Rich Snippets",
    description:
        "Generate valid JSON-LD structured data for LocalBusiness, FAQPage, and more. Copy-paste ready schema markup for Google rich snippet eligibility.",
    keywords: [
        "schema markup generator",
        "json-ld generator",
        "schema markup generator free",
        "structured data generator",
        "faq schema generator",
        "local business schema generator",
        "rich snippet generator",
        "schema.org generator",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/schema-generator`,
    },
    openGraph: {
        title: "Free Schema Markup Generator — JSON-LD for Rich Snippets",
        description: "Generate valid JSON-LD structured data for LocalBusiness, FAQPage, and more. Copy-paste ready for rich snippets.",
        url: `${config.appUrl}/tools/schema-generator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Schema Markup Generator — JSON-LD for Rich Snippets",
        description: "Generate valid JSON-LD structured data for rich snippets. Copy-paste ready code.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Schema Markup Generator", url: `${config.appUrl}/tools/schema-generator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Schema Markup Generator",
        description: "Generate valid JSON-LD structured data for LocalBusiness, FAQPage, and more schema types.",
        url: `${config.appUrl}/tools/schema-generator`,
        applicationCategory: "WebApplication",
        featureList: [
            "JSON-LD code generation",
            "LocalBusiness schema",
            "FAQPage schema",
            "Schema validation",
            "One-click copy",
            "Rich snippet eligibility",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is schema markup?",
            answer: "Schema markup is structured data you add to your website's HTML that helps search engines understand your content. It uses the schema.org vocabulary in JSON-LD format and can enable rich snippets like star ratings, FAQs, and business info in Google search results.",
        },
        {
            question: "What is JSON-LD?",
            answer: "JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data. It's a script block placed in your page's <head> section that describes your content in a machine-readable way without affecting the visual page.",
        },
        {
            question: "Does schema markup help SEO?",
            answer: "Schema markup doesn't directly improve rankings, but it can significantly increase click-through rates by enabling rich snippets in search results. Pages with rich snippets get up to 30% more clicks than plain results. Google also uses structured data to better understand page content.",
        },
        {
            question: "Where do I put the JSON-LD code?",
            answer: "Paste the generated JSON-LD code inside a <script type='application/ld+json'> tag in your page's <head> section. You can also inject it via Google Tag Manager or your CMS's custom code settings.",
        },
        {
            question: "Is this schema generator free?",
            answer: "Yes, completely free with no signup required. Generate LocalBusiness, FAQPage, and other schema types instantly. Copy the validated JSON-LD code and add it to your site.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Generate Schema Markup",
        description: "Create valid JSON-LD structured data using the free SerpNap Schema Markup Generator.",
        totalTime: "PT3M",
        steps: [
            { name: "Select schema type", text: "Choose the schema type you need — LocalBusiness for physical businesses or FAQPage for FAQ content." },
            { name: "Fill in your details", text: "Enter your business name, URL, address, and other relevant information. For FAQPage, add your questions and answers." },
            { name: "Review the JSON-LD output", text: "Check the generated JSON-LD code in the preview panel. The code updates in real-time as you type." },
            { name: "Copy and add to your site", text: "Click 'Copy Code' and paste the JSON-LD into your page's <head> section inside a script tag." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
