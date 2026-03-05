import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Schema Markup Generator | JSON-LD Structured Data",
    description:
        "Generate valid JSON-LD structured data for LocalBusiness and FAQPage schemas. Copy-paste ready code for rich snippet eligibility.",
    alternates: {
        canonical: `${config.appUrl}/tools/schema-generator`,
    },
    openGraph: {
        title: "Free Schema Markup Generator | JSON-LD Structured Data",
        description:
            "Generate valid JSON-LD structured data for LocalBusiness and FAQPage schemas. Copy-paste ready code for rich snippet eligibility.",
        url: `${config.appUrl}/tools/schema-generator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Schema Markup Generator | JSON-LD Structured Data",
        description: "Generate valid JSON-LD structured data for LocalBusiness and FAQPage schemas. Copy-paste ready code for rich snippet eligibility.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Schema Markup Generator", url: `${config.appUrl}/tools/schema-generator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Schema Markup Generator",
        description: "Generate valid JSON-LD structured data for LocalBusiness and FAQPage schemas.",
        url: `${config.appUrl}/tools/schema-generator`,
        applicationCategory: "WebApplication",
        featureList: ["JSON-LD generation", "Schema validation", "Rich snippet eligibility"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
