import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { config } from "@/lib/config";
import "./globals.css";

const satoshi = localFont({
  src: "../../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  display: "optional",
  preload: true,
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.appUrl),
  title: {
    default: `${config.brand.name} | ${config.brand.tagline}`,
    template: `%s | ${config.brand.name}`,
  },
  description: config.brand.description,
  keywords: [
    "free SEO tools",
    "SEO checker",
    "SEO audit",
    "meta tag generator",
    "keyword density checker",
    "sitemap validator",
    "schema generator",
    "robots.txt generator",
    "technical SEO audit",
    "page speed checker",
    "redirect checker",
    "headline analyzer",
  ],
  authors: [{ name: config.brand.name, url: config.appUrl }],
  creator: config.brand.name,
  publisher: config.brand.name,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: `${config.brand.name} | ${config.brand.tagline}`,
    description: config.brand.description,
    type: "website",
    siteName: config.brand.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.brand.name} | ${config.brand.tagline}`,
    description: config.brand.description,
  },
  robots: {
    index: config.isProd,
    follow: config.isProd,
    googleBot: {
      index: config.isProd,
      follow: config.isProd,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('serpnap-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var shouldBeDark = stored === 'dark' || (stored !== 'light' && systemDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (_error) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="og:site_name" content={config.brand.name} />
        <meta property="og:locale" content="en_US" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${config.appUrl}/#organization`,
                  name: config.brand.name,
                  url: config.appUrl,
                  description: config.brand.description,
                  foundingDate: config.business.foundingDate,
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    email: config.business.contact.email,
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${config.appUrl}/#website`,
                  url: config.appUrl,
                  name: config.brand.name,
                  description: config.brand.description,
                  publisher: { "@id": `${config.appUrl}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${config.appUrl}/tools/seo-checker?url={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "SerpNap SEO Checker",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  description:
                    "Free comprehensive SEO audit tool with 50+ checks. Analyzes meta tags, headings, images, links, performance, accessibility, structured data, and more.",
                  url: `${config.appUrl}/tools/seo-checker`,
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  featureList: [
                    "50+ SEO checks covering meta tags, headings, images, and links",
                    "Technical SEO audit with Core Web Vitals analysis",
                    "AI-powered SEO fix suggestions",
                    "Schema markup validation and generation",
                    "Keyword density analysis",
                    "Page speed performance estimation",
                    "Accessibility audit with WCAG checks",
                    "SERP preview",
                    "PDF report export",
                    "E-E-A-T signals analysis",
                  ],
                },
                {
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "What is SerpNap?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "SerpNap is a suite of free SEO tools that helps you audit, analyze, and optimize your website for search engines. It includes an SEO checker with 50+ audit checks, a meta tag generator, schema markup generator, sitemap validator, keyword density checker, headline analyzer, and more.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Is SerpNap really free?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, all SEO tools on SerpNap are completely free to use with no signup required. You can run unlimited SEO audits, generate meta tags, create schema markup, and use all tools at no cost.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "How does the SEO Checker work?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "The SerpNap SEO Checker performs 50+ comprehensive checks on any URL. It analyzes meta tags, heading structure, image optimization, internal and external links, page speed, mobile-friendliness, structured data, accessibility, and E-E-A-T signals. You get an overall SEO score with prioritized, actionable recommendations.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What SEO tools does SerpNap offer?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "SerpNap offers 11 free SEO tools: SEO Checker (50+ audit checks), Technical Audit, Neural Audit (AI-powered), Meta Tag Generator, Schema Generator, Sitemap Validator, Headline Analyzer, Keyword Density Checker, Page Speed Estimator, Redirect Checker, and Robots.txt Generator.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${satoshi.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
