import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Page Speed Estimator | Core Web Vitals Calculator",
    description:
        "Estimate your website loading speed based on technology stack, assets, and hosting. Get a performance score with optimization recommendations.",
    alternates: {
        canonical: `${config.appUrl}/tools/page-speed-estimator`,
    },
    openGraph: {
        title: "Free Page Speed Estimator | Core Web Vitals Calculator",
        description:
            "Estimate your website loading speed based on technology stack, assets, and hosting. Get a performance score with optimization recommendations.",
        url: `${config.appUrl}/tools/page-speed-estimator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Page Speed Estimator | Core Web Vitals Calculator",
        description: "Estimate your website loading speed based on technology stack, assets, and hosting. Get a performance score with optimization recommendations.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Page Speed Estimator", url: `${config.appUrl}/tools/page-speed-estimator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Page Speed Estimator",
        description: "Estimate website loading speed based on technology stack, assets, and hosting.",
        url: `${config.appUrl}/tools/page-speed-estimator`,
        applicationCategory: "WebApplication",
        featureList: ["Core Web Vitals estimation", "Performance scoring", "Optimization tips"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
