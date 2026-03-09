import { Metadata } from "next";
import { config } from "@/lib/config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact Us | SerpNap",
  description:
    "Get in touch with SerpNap. Contact us for questions about our free SEO tools or general inquiries.",
  keywords: ["contact", "support", "help", "SEO tools contact"],
  alternates: {
    canonical: `${config.appUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | SerpNap",
    description: "Get in touch with SerpNap. Contact us for questions about our free SEO tools or general inquiries.",
    url: `${config.appUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | SerpNap",
    description: "Get in touch with SerpNap for questions about our free SEO tools.",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: config.brand.name,
      description: config.brand.description,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: config.business.contact.email,
      },
    },
  };

  return (
    <>
      <Header />
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <main id="main" className="min-h-screen pt-14">
      <div className="container-wide container-padding py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
          <div className="bg-card border rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
                <p className="text-muted-foreground mb-4">
                  Have questions about our SEO tools or need help? We'd love to
                  hear from you.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a
                    href={`mailto:${config.business.contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {config.business.contact.email}
                  </a>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to inquiries within 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-2">Other Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/docs" className="text-primary hover:underline">
                      Documentation
                    </a>{" "}
                    - Learn how to use our tools
                  </li>
                  <li>
                    <a href="/blog" className="text-primary hover:underline">
                      Blog
                    </a>{" "}
                    - SEO tips and guides
                  </li>
                  <li>
                    <a
                      href="/glossary"
                      className="text-primary hover:underline"
                    >
                      SEO Glossary
                    </a>{" "}
                    - Understand SEO terms
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
