import type { Metadata } from "next";
import { config } from "@/lib/config";

import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Robots.txt Generator | WordPress, Next.js Presets",
    description:
        "Generate valid robots.txt files with presets for WordPress, Next.js, e-commerce, and AI bot blocking. Download or copy instantly.",
    alternates: {
        canonical: `${config.appUrl}/tools/robots-txt-generator`,
    },
    openGraph: {
        title: "Free Robots.txt Generator | WordPress, Next.js Presets",
        description:
            "Generate valid robots.txt files with presets for WordPress, Next.js, e-commerce, and AI bot blocking. Download or copy instantly.",
        url: `${config.appUrl}/tools/robots-txt-generator`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Robots.txt Generator | WordPress, Next.js Presets",
        description: "Generate valid robots.txt files with presets for WordPress, Next.js, e-commerce, and AI bot blocking. Download or copy instantly.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Robots.txt Generator", url: `${config.appUrl}/tools/robots-txt-generator` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Robots.txt Generator",
        description: "Generate valid robots.txt files with presets for popular frameworks and AI bot blocking.",
        url: `${config.appUrl}/tools/robots-txt-generator`,
        applicationCategory: "WebApplication",
        featureList: ["Framework presets", "AI bot rules", "Instant download"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
