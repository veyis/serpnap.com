import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from "@/lib/utils/seo";

export const metadata: Metadata = {
    title: "Free Redirect Checker | Trace Redirect Chains",
    description:
        "Trace redirect chains, detect 301/302 issues, and verify your URLs resolve correctly. Identify link equity leaks from unnecessary hops.",
    alternates: {
        canonical: `${config.appUrl}/tools/redirect-checker`,
    },
    openGraph: {
        title: "Free Redirect Checker | Trace Redirect Chains",
        description:
            "Trace redirect chains, detect 301/302 issues, and verify your URLs resolve correctly. Identify link equity leaks from unnecessary hops.",
        url: `${config.appUrl}/tools/redirect-checker`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Redirect Checker | Trace Redirect Chains",
        description: "Trace redirect chains, detect 301/302 issues, and verify your URLs resolve correctly. Identify link equity leaks from unnecessary hops.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Tools", url: `${config.appUrl}/tools` },
        { name: "Redirect Checker", url: `${config.appUrl}/tools/redirect-checker` },
    ]);
    const appSchema = getSoftwareApplicationSchema({
        name: "Redirect Checker",
        description: "Trace redirect chains, detect 301/302 issues, and verify URL resolution.",
        url: `${config.appUrl}/tools/redirect-checker`,
        applicationCategory: "WebApplication",
        featureList: ["Redirect chain tracing", "Status code detection", "Link equity analysis"],
    });

    return (
        <>
            <MultipleStructuredData schemas={[breadcrumbSchema, appSchema]} />
            {children}
        </>
    );
}
