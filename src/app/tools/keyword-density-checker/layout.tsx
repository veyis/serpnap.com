import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Keyword Density Checker | Content Analysis Tool",
    description:
        "Analyze keyword frequency in your content. See 1-word, 2-word, and 3-word phrase density with over-optimization warnings.",
    alternates: {
        canonical: `${config.appUrl}/tools/keyword-density-checker`,
    },
    openGraph: {
        title: "Free Keyword Density Checker | Content Analysis Tool",
        description:
            "Analyze keyword frequency in your content. See 1-word, 2-word, and 3-word phrase density with over-optimization warnings.",
        url: `${config.appUrl}/tools/keyword-density-checker`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Keyword Density Checker | Content Analysis Tool",
        description: "Analyze keyword frequency in your content. See 1-word, 2-word, and 3-word phrase density with over-optimization warnings.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Keyword Density Checker", url: `${config.appUrl}/tools/keyword-density-checker` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Keyword Density Checker",
        description: "Analyze keyword frequency in your content with over-optimization warnings.",
        url: `${config.appUrl}/tools/keyword-density-checker`,
        applicationCategory: "WebApplication",
        featureList: ["N-gram analysis", "Density calculation", "Over-optimization detection"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
