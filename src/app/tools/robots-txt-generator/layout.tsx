import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Robots.txt Generator — WordPress, Next.js & More",
    description:
        "Generate valid robots.txt files with presets for WordPress, Next.js, e-commerce, and AI bot blocking. Download or copy your robots.txt instantly.",
    keywords: [
        "robots.txt generator",
        "robots.txt generator free",
        "robots.txt file creator",
        "robots.txt generator wordpress",
        "custom robots.txt generator",
        "robots.txt tester",
        "robots.txt maker",
        "create robots.txt file",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/robots-txt-generator`,
    },
    openGraph: {
        title: "Free Robots.txt Generator — WordPress, Next.js & More",
        description: "Generate valid robots.txt files with framework presets and AI bot rules. Download or copy instantly.",
        url: `${config.appUrl}/tools/robots-txt-generator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Robots.txt Generator — Framework Presets",
        description: "Generate robots.txt files with presets for WordPress, Next.js, e-commerce, and AI bot blocking.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Robots.txt Generator", url: `${config.appUrl}/tools/robots-txt-generator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Robots.txt Generator",
        description: "Generate valid robots.txt files with presets for popular frameworks and AI bot blocking rules.",
        url: `${config.appUrl}/tools/robots-txt-generator`,
        applicationCategory: "WebApplication",
        featureList: [
            "WordPress preset",
            "Next.js preset",
            "E-commerce preset",
            "AI bot blocking rules",
            "Custom rule builder",
            "Instant download",
            "Sitemap directive",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is a robots.txt file?",
            answer: "A robots.txt file tells search engine crawlers which pages they can and cannot access on your website. It's placed in your site's root directory (e.g., example.com/robots.txt) and uses directives like Allow, Disallow, and Sitemap to control crawl behavior.",
        },
        {
            question: "Does robots.txt affect SEO?",
            answer: "Yes. Robots.txt controls what search engines can crawl, which directly affects indexing. Blocking important pages prevents them from ranking. Blocking unimportant pages (admin, staging, duplicate content) saves crawl budget for your valuable pages.",
        },
        {
            question: "Should I block AI bots in robots.txt?",
            answer: "It depends on your goals. Blocking AI bots (GPTBot, CCBot, etc.) prevents your content from being used to train AI models. However, allowing bots like GPTBot and PerplexityBot can increase your visibility in AI-powered search results. Consider your content licensing and visibility strategy.",
        },
        {
            question: "What's the difference between robots.txt and meta robots?",
            answer: "Robots.txt blocks crawling — the bot never fetches the page. Meta robots (noindex, nofollow) allows crawling but controls indexing. Use robots.txt for directories you want completely hidden from crawlers. Use meta robots for pages you want crawled but not indexed.",
        },
        {
            question: "Is this robots.txt generator free?",
            answer: "Yes, completely free with no signup. Choose a preset for your framework, customize the rules, and download your robots.txt file instantly.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Generate a Robots.txt File",
        description: "Create a valid robots.txt file using the free SerpNap Robots.txt Generator.",
        totalTime: "PT2M",
        steps: [
            { name: "Choose a preset", text: "Select a preset matching your platform — WordPress, Next.js, e-commerce, or start from scratch." },
            { name: "Customize rules", text: "Add or remove Allow/Disallow directives for specific paths. Configure AI bot rules as needed." },
            { name: "Add your sitemap URL", text: "Enter your sitemap URL to include a Sitemap directive, helping search engines discover your XML sitemap." },
            { name: "Download or copy", text: "Click download to save the file, or copy the content. Upload it to your website's root directory." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
