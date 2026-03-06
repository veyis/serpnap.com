import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Sitemap Validator — XML Sitemap Checker Online",
    description:
        "Validate XML sitemaps against the Sitemap Protocol spec. Check URL counts, namespaces, lastmod dates, priority values, duplicate URLs, and file size limits.",
    keywords: [
        "sitemap validator",
        "xml sitemap checker",
        "sitemap validator online",
        "validate sitemap",
        "sitemap error checker",
        "xml sitemap validator free",
        "check sitemap errors",
        "sitemap index validator",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/sitemap-validator`,
    },
    openGraph: {
        title: "Free Sitemap Validator — XML Sitemap Checker Online",
        description: "Validate XML sitemaps against the Sitemap Protocol spec. Check URLs, namespaces, dates, and detect duplicates.",
        url: `${config.appUrl}/tools/sitemap-validator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Sitemap Validator — XML Sitemap Checker",
        description: "Validate XML sitemaps against the Sitemap Protocol spec. Catch errors before search engines do.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Sitemap Validator", url: `${config.appUrl}/tools/sitemap-validator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Sitemap Validator",
        description: "Validate XML sitemaps against the Sitemap Protocol specification. Check URL counts, namespaces, and detect duplicates.",
        url: `${config.appUrl}/tools/sitemap-validator`,
        applicationCategory: "WebApplication",
        featureList: [
            "Protocol spec validation",
            "URL count analysis",
            "Duplicate URL detection",
            "Namespace verification",
            "Lastmod date validation",
            "File size checking",
            "Sitemap index support",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is a sitemap validator?",
            answer: "A sitemap validator checks your XML sitemap file against the official Sitemap Protocol specification (sitemaps.org). It verifies correct XML structure, namespace declarations, URL format, lastmod dates, changefreq values, and priority settings.",
        },
        {
            question: "Why should I validate my sitemap?",
            answer: "An invalid sitemap can prevent search engines from discovering and indexing your pages. Errors like missing namespaces, invalid dates, or exceeding the 50,000 URL limit can cause Google to ignore your sitemap entirely, wasting crawl budget.",
        },
        {
            question: "What is the maximum sitemap size?",
            answer: "Each XML sitemap can contain a maximum of 50,000 URLs and must not exceed 50MB uncompressed. If your site has more URLs, use a sitemap index file that references multiple sitemap files.",
        },
        {
            question: "What is a sitemap index?",
            answer: "A sitemap index is a file that lists multiple sitemap files. It's used when your site has more than 50,000 URLs or when you want to organize sitemaps by content type (pages, posts, images). The index file uses <sitemapindex> as its root element.",
        },
        {
            question: "Is this sitemap validator free?",
            answer: "Yes, completely free with no signup required. Validate sitemaps by URL or by pasting XML directly. Get a detailed report with scores, issue counts, and URL statistics.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Validate Your XML Sitemap",
        description: "Check your sitemap for errors using the free SerpNap Sitemap Validator.",
        totalTime: "PT1M",
        steps: [
            { name: "Enter your sitemap URL", text: "Paste your sitemap URL (e.g., https://example.com/sitemap.xml) or switch to 'Paste XML' mode to paste raw XML content." },
            { name: "Run validation", text: "Click Validate to check your sitemap against the Sitemap Protocol specification. The tool analyzes structure, URLs, dates, and more." },
            { name: "Review your score and issues", text: "See your validation score (0-100), issue count, and detailed error/warning messages for each problem found." },
            { name: "Fix issues and re-validate", text: "Address the errors and warnings listed, then re-validate to confirm all issues are resolved." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
