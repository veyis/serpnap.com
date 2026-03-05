import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Sitemap Validator | XML Sitemap Checker",
    description:
        "Validate XML sitemaps against the Sitemap Protocol spec. Check URL counts, namespaces, lastmod dates, priority values, and detect duplicates.",
    alternates: {
        canonical: `${config.appUrl}/tools/sitemap-validator`,
    },
    openGraph: {
        title: "Free Sitemap Validator | XML Sitemap Checker",
        description:
            "Validate XML sitemaps against the Sitemap Protocol spec. Check URL counts, namespaces, lastmod dates, priority values, and detect duplicates.",
        url: `${config.appUrl}/tools/sitemap-validator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Sitemap Validator | XML Sitemap Checker",
        description: "Validate XML sitemaps against the Sitemap Protocol spec. Check URL counts, namespaces, lastmod dates, priority values, and detect duplicates.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Sitemap Validator", url: `${config.appUrl}/tools/sitemap-validator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Sitemap Validator",
        description: "Validate XML sitemaps against the Sitemap Protocol specification.",
        url: `${config.appUrl}/tools/sitemap-validator`,
        applicationCategory: "WebApplication",
        featureList: ["Protocol spec validation", "URL count analysis", "Duplicate detection"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
