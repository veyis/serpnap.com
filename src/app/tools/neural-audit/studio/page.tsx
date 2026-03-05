import { Suspense } from "react";
import { Metadata } from "next";
import { IntelligenceStudioDashboard, PageHero } from "@/components/agency";
import { ShieldCheck } from "lucide-react";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Intelligence Studio | Neural Audit Command Center",
  description: "Secure brand audit workspace. Access proprietary neural weighting logs and defensive GEO strategies for your brand.",
  alternates: {
    canonical: `${config.appUrl}/tools/neural-audit/studio`,
  },
  openGraph: {
    title: "Intelligence Studio | Neural Audit Command Center",
    description: "Secure brand audit workspace. Access proprietary neural weighting logs and defensive GEO strategies for your brand.",
    url: `${config.appUrl}/tools/neural-audit/studio`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intelligence Studio | Neural Audit Command Center",
    description: "Secure brand audit workspace. Access proprietary neural weighting logs and defensive GEO strategies.",
  },
};

interface PageProps {
  searchParams: Promise<{ domain?: string }>;
}

export default async function IntelligenceStudioPage({ searchParams }: PageProps) {
  const { domain = "your-brand.com" } = await searchParams;

  const appSchema = {
    "@type": "SoftwareApplication",
    "name": "SerpNap Neural Intelligence Studio",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "url": `${config.appUrl}/tools/neural-audit/studio`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1280"
    }
  };

  return (
    <Suspense>
    <main className="min-h-screen bg-[#020202]">
      <MultipleStructuredData schemas={[appSchema]} />
      <PageHero
        theme="violet"
        badgeIcon={ShieldCheck}
        badgeText="Secure Intelligence Area"
        headline="Neural Command"
        highlightedText="Studio"
        description="Welcome to your private intelligence workspace. Here, we analyze the semantic deficit and citation gaps preventing your brand from achieving 2026 search dominance. Submit your credentials to unlock the Full Defense Map."
      />

      <section className="container-padding pb-32 -mt-32 relative z-20">
         <IntelligenceStudioDashboard domain={domain} />
      </section>

      <section className="section-padding container-padding">
         <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/3 border border-white/5 space-y-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Full Privacy</h3>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  Your domain data is processed in isolated memory and purged after 24 hours unless a strategy session is initiated.
               </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/5 space-y-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Logic Mapping</h3>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  Every metric is derived from SerpNap's NeuroConnect layer, simulating real-world RAG citation behaviors.
               </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/5 space-y-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Strategic ROI</h3>
               <p className="text-xs text-muted-foreground leading-relaxed">
                  The 'In-Depth' Defense Map identifies citation gaps that represent millions in potential hidden revenue.
               </p>
            </div>
         </div>
      </section>
    </main>
    </Suspense>
  );
}
