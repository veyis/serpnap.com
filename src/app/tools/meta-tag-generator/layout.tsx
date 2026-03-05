import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Meta Tag Generator | SERP Preview Tool",
    description:
        "Generate perfect title tags and meta descriptions with live Google SERP preview. Optimize character counts for maximum click-through rate.",
    alternates: {
        canonical: `${config.appUrl}/tools/meta-tag-generator`,
    },
    openGraph: {
        title: "Free Meta Tag Generator | SERP Preview Tool",
        description:
            "Generate perfect title tags and meta descriptions with live Google SERP preview. Optimize character counts for maximum click-through rate.",
        url: `${config.appUrl}/tools/meta-tag-generator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Meta Tag Generator | SERP Preview Tool",
        description: "Generate perfect title tags and meta descriptions with live Google SERP preview. Optimize character counts for maximum click-through rate.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Meta Tag Generator", url: `${config.appUrl}/tools/meta-tag-generator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Meta Tag Generator",
        description: "Generate optimized title tags and meta descriptions with live SERP preview.",
        url: `${config.appUrl}/tools/meta-tag-generator`,
        applicationCategory: "WebApplication",
        featureList: ["SERP preview", "Character count optimization", "Title tag generation"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
