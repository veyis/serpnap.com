import { Metadata } from "next";
import { config } from "@/lib/config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | SerpNap",
  description:
    "Privacy policy for SerpNap&apos;s free SEO tools. Learn how we collect, use, and protect your data.",
  keywords: ["privacy policy", "data protection", "SEO tools privacy"],
  alternates: {
    canonical: `${config.appUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | SerpNap",
    description: "Privacy policy for SerpNap's free SEO tools. Learn how we collect, use, and protect your data.",
    url: `${config.appUrl}/privacy`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | SerpNap",
    description: "Privacy policy for SerpNap's free SEO tools.",
  },
};

export default function PrivacyPage() {
  return (
    <>
    <Header />
    <main id="main" className="min-h-screen pt-14">
    <div className="container-wide container-padding py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Last updated:{" "}
March 5, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              SerpNap is committed to protecting your privacy. When you use our
              free SEO tools, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                URLs you submit for analysis (temporarily processed for SEO
                auditing)
              </li>
              <li>Basic usage analytics to improve our tools</li>
              <li>Technical information about your device and browser</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">
              The information we collect is used solely to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our SEO analysis tools</li>
              <li>Generate SEO reports and recommendations</li>
              <li>Monitor and maintain tool performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Data Sharing and Third Parties
            </h2>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third
              parties. URLs and analysis results are processed server-side and
              are not stored permanently.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us
              at{" "}
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
