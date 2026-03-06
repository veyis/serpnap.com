import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Redirect Checker — Trace Redirect Chains & Loops",
    description:
        "Trace redirect chains, detect 301/302 issues, identify loops, and verify URLs resolve correctly. Find link equity leaks from unnecessary redirect hops.",
    keywords: [
        "redirect checker",
        "301 redirect checker",
        "redirect chain checker",
        "redirect checker free",
        "http redirect tester",
        "url redirect checker",
        "redirect loop detector",
        "redirect path checker",
    ],
    alternates: {
        canonical: `${config.appUrl}/tools/redirect-checker`,
    },
    openGraph: {
        title: "Free Redirect Checker — Trace Redirect Chains & Loops",
        description: "Trace redirect chains, detect 301/302 issues, and identify redirect loops. Find link equity leaks instantly.",
        url: `${config.appUrl}/tools/redirect-checker`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Redirect Checker — Trace Chains & Loops",
        description: "Trace redirect chains, detect 301/302 issues, and verify URL resolution. Free, instant results.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: config.appUrl },
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Redirect Checker", url: `${config.appUrl}/tools/redirect-checker` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Free Redirect Checker",
        description: "Trace redirect chains, detect 301/302 status codes, and identify redirect loops.",
        url: `${config.appUrl}/tools/redirect-checker`,
        applicationCategory: "WebApplication",
        featureList: [
            "Redirect chain tracing",
            "301/302 status code detection",
            "Redirect loop detection",
            "Link equity analysis",
            "Response header inspection",
            "Final destination verification",
        ],
    });
    const faqSchema = getFAQPageSchema([
        {
            question: "What is a redirect chain?",
            answer: "A redirect chain occurs when a URL redirects to another URL, which then redirects to yet another URL. For example: page-a → page-b → page-c. Each hop loses a small amount of link equity (ranking power) and adds latency. Ideally, redirects should go directly from source to final destination.",
        },
        {
            question: "What's the difference between 301 and 302 redirects?",
            answer: "A 301 redirect is permanent — it tells search engines the page has moved permanently and to transfer all ranking signals to the new URL. A 302 redirect is temporary — search engines keep the original URL indexed. Using 302 when you mean 301 can prevent link equity from passing.",
        },
        {
            question: "How do redirect chains affect SEO?",
            answer: "Redirect chains hurt SEO in three ways: they dilute link equity (each hop loses some ranking power), they slow page load times (each redirect adds 100-500ms), and they confuse search engines about which URL to index. Google will follow up to 10 redirects but recommends keeping chains short.",
        },
        {
            question: "What is a redirect loop?",
            answer: "A redirect loop occurs when URL A redirects to URL B, and URL B redirects back to URL A, creating an infinite cycle. This makes the page completely inaccessible to both users and search engines. Loops usually result from misconfigured server rules or CMS settings.",
        },
        {
            question: "Is this redirect checker free?",
            answer: "Yes, completely free with no signup. Enter any URL to trace its full redirect chain, see each hop's status code, and identify loops or unnecessary redirects.",
        },
    ]);
    const howToSchema = getHowToSchema({
        name: "How to Check Redirects",
        description: "Trace redirect chains and detect issues using the free SerpNap Redirect Checker.",
        totalTime: "PT1M",
        steps: [
            { name: "Enter a URL", text: "Paste the URL you want to check into the input field. The tool will follow all redirects automatically." },
            { name: "Review the redirect chain", text: "See each hop in the chain with its HTTP status code (301, 302, etc.), response time, and destination URL." },
            { name: "Identify issues", text: "Look for unnecessary hops, 302s that should be 301s, and redirect loops. Each issue is flagged with an explanation." },
            { name: "Fix redirect issues", text: "Update your server configuration to point directly to the final destination URL, eliminating intermediate hops." },
        ],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />
            {children}
        </>
    );
}
