import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Page Speed Estimator — Core Web Vitals Calculator",
    description:
        "Estimate your website loading speed based on technology stack, assets, and hosting. Get a performance score with Core Web Vitals estimates and optimization tips.",
    keywords: [
        "page speed test",
        "website speed test free",
        "page speed checker",
        "core web vitals checker",
        "website performance test",
        "page load time checker",
        "mobile page speed test",
        "website speed analyzer",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/page-speed-estimator`,
    },
    openGraph: {
        title: "Free Page Speed Estimator — Core Web Vitals Calculator",
        description: "Estimate website loading speed and Core Web Vitals. Get a performance score with optimization recommendations.",
        url: `${config.appUrl}/tools/page-speed-estimator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Page Speed Estimator — Core Web Vitals",
        description: "Estimate website loading speed and Core Web Vitals. Get optimization recommendations instantly.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Page Speed Estimator", url: `${config.appUrl}/tools/page-speed-estimator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Page Speed Estimator",
        description: "Estimate website loading speed based on technology stack, assets, and hosting configuration.",
        url: `${config.appUrl}/tools/page-speed-estimator`,
        applicationCategory: "WebApplication",
        featureList: [
            "Core Web Vitals estimation",
            "Performance score calculation",
            "Technology stack analysis",
            "Asset optimization tips",
            "Mobile performance check",
            "Optimization recommendations",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is page speed and why does it matter for SEO?",
            answer: "Page speed measures how fast your website loads. Google uses Core Web Vitals (LCP, CLS, INP) as ranking factors. Faster pages rank higher, get more traffic, and convert better. A 1-second delay in load time can reduce conversions by 7%.",
        },
        {
            question: "What are Core Web Vitals?",
            answer: "Core Web Vitals are three metrics Google uses to measure user experience: LCP (Largest Contentful Paint) measures loading speed, CLS (Cumulative Layout Shift) measures visual stability, and INP (Interaction to Next Paint) measures interactivity. Good scores: LCP < 2.5s, CLS < 0.1, INP < 200ms.",
        },
        {
            question: "How accurate is this page speed estimator?",
            answer: "This tool provides an estimate based on HTML analysis, asset counts, and technology detection. For exact Core Web Vitals scores, use Google Lighthouse or PageSpeed Insights, which render the page in a real browser. Our estimates give a quick directional assessment.",
        },
        {
            question: "How do I improve my page speed?",
            answer: "Key optimizations include: compress images (use WebP/AVIF), enable text compression (Gzip/Brotli), minimize CSS/JS, use a CDN, implement lazy loading for below-fold images, preload critical resources, and reduce server response time.",
        },
        {
            question: "Is this page speed tool free?",
            answer: "Yes, completely free with no signup. Enter any URL to get an instant performance estimate with specific optimization recommendations.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Test Your Page Speed",
        description: "Estimate your website performance using the free SerpNap Page Speed Estimator.",
        totalTime: "PT1M",
        steps: [
            { name: "Enter your URL", text: "Paste any webpage URL into the input field. The tool will fetch and analyze the page." },
            { name: "Review your performance score", text: "See your estimated performance score and Core Web Vitals estimates for LCP, CLS, and INP." },
            { name: "Check optimization recommendations", text: "Review specific recommendations for images, CSS, JavaScript, and server configuration." },
            { name: "Implement fixes", text: "Apply the suggested optimizations and re-test to verify improvement." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
