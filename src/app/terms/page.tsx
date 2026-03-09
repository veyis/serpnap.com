import { Metadata } from "next";
import { config } from "@/lib/config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms of Service | SerpNap",
  description:
    "Terms of service for SerpNap&apos;s free SEO tools. Understand the rules and guidelines for using our platform.",
  keywords: ["terms of service", "terms and conditions", "SEO tools terms"],
  alternates: {
    canonical: `${config.appUrl}/terms`,
  },
  openGraph: {
    title: "Terms of Service | SerpNap",
    description: "Terms of service for SerpNap's free SEO tools. Understand the rules and guidelines for using our platform.",
    url: `${config.appUrl}/terms`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | SerpNap",
    description: "Terms of service for SerpNap's free SEO tools.",
  },
};

export default function TermsPage() {
  return (
    <>
    <Header />
    <main id="main" className="min-h-screen pt-14">
    <div className="container-wide container-padding py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Last updated:{" "}
March 5, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using SerpNap's free SEO tools, you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use SerpNap's SEO tools for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Modify or copy the tools</li>
              <li>Use the tools for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="mb-4">
              The SEO analysis results provided by SerpNap are for informational
              purposes only. While we strive for accuracy, we cannot guarantee
              the completeness or reliability of the analysis. Users should not
              rely solely on our tools for critical business decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p className="mb-4">
              In no event shall SerpNap or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use SerpNap's tools.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href={`mailto:${config.business.contact.email}`}
                className="text-primary hover:underline"
              >
                {config.business.contact.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}
