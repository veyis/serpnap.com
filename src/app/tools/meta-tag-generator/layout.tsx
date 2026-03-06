import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Meta Tag Generator — Title & Description with SERP Preview",
    description:
        "Generate optimized title tags and meta descriptions with a live Google SERP preview. See character counts, preview desktop vs mobile, and copy HTML instantly.",
    keywords: [
        "meta tag generator",
        "meta tag generator free",
        "seo meta title generator",
        "meta description generator",
        "serp preview tool",
        "title tag generator",
        "html meta tag generator",
        "seo title and description generator",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/meta-tag-generator`,
    },
    openGraph: {
        title: "Free Meta Tag Generator — Title & Description with SERP Preview",
        description:
            "Generate optimized title tags and meta descriptions with a live Google SERP preview. See character counts, preview desktop vs mobile, and copy HTML instantly.",
        url: `${config.appUrl}/tools/meta-tag-generator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Meta Tag Generator — Title & Description SERP Preview",
        description: "Generate optimized title tags and meta descriptions with live Google SERP preview. Copy HTML instantly.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Meta Tag Generator", url: `${config.appUrl}/tools/meta-tag-generator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Meta Tag Generator",
        description: "Generate optimized title tags and meta descriptions with live SERP preview. See character counts and copy HTML instantly.",
        url: `${config.appUrl}/tools/meta-tag-generator`,
        applicationCategory: "WebApplication",
        featureList: [
            "Live Google SERP preview",
            "Desktop and mobile preview modes",
            "Character count optimization",
            "Title tag generation",
            "Meta description generation",
            "One-click HTML copy",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is a meta tag generator?",
            answer: "A meta tag generator helps you create optimized HTML title tags and meta descriptions for your web pages. These tags control how your page appears in Google search results and directly impact click-through rates.",
        },
        {
            question: "What is the ideal title tag length?",
            answer: "Google typically displays the first 50-60 characters of a title tag. Aim for 30-60 characters to ensure your full title shows in search results without being truncated.",
        },
        {
            question: "What is the ideal meta description length?",
            answer: "Google displays up to 155-160 characters for desktop and around 120 characters on mobile. Write descriptions between 120-160 characters for best results across devices.",
        },
        {
            question: "Do meta tags affect SEO rankings?",
            answer: "Title tags are a confirmed Google ranking factor. Meta descriptions don't directly affect rankings but significantly impact click-through rate (CTR), which can indirectly influence rankings. Well-written meta tags can increase CTR by 20% or more.",
        },
        {
            question: "Is this meta tag generator free?",
            answer: "Yes, this tool is completely free with no signup required. Generate unlimited meta tags, preview them in a live SERP simulator, and copy the HTML code instantly.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Generate Meta Tags",
        description: "Create optimized title tags and meta descriptions using the free SerpNap Meta Tag Generator.",
        totalTime: "PT2M",
        steps: [
            { name: "Enter your page title", text: "Type your page title in the title field. Aim for 30-60 characters and include your primary keyword near the beginning." },
            { name: "Write your meta description", text: "Write a compelling description in 120-160 characters. Include your target keyword and a clear call-to-action." },
            { name: "Preview in SERP simulator", text: "Switch between desktop and mobile views to see exactly how your page will appear in Google search results." },
            { name: "Copy the HTML code", text: "Click 'Copy Meta Tags' to get the ready-to-use HTML code. Paste it into your page's <head> section." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
