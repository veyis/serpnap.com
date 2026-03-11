import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TechnicalAuditReport } from '@/components/tools/technical-audit-report';
import { CTASection } from '@/components/agency';
import { MultipleStructuredData } from '@/components/seo/structured-data';
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from '@/lib/utils/seo';
import { config } from '@/lib/config';
import { ToolsNav } from '@/components/tools/tools-nav';

export const metadata: Metadata = {
  title: 'Free Technical SEO Audit — Website Performance & Crawlability Analysis',
  description:
    'Run a free technical SEO audit on any website. Analyze Core Web Vitals, page speed, crawlability, server response, mobile optimization, and security headers. Export PDF reports.',
  keywords: [
    'technical seo audit',
    'free technical seo audit',
    'website performance audit',
    'core web vitals checker',
    'crawlability analysis',
    'technical seo checker',
    'website audit tool free',
    'page speed audit',
  ],
  alternates: {
    canonical: `${config.appUrl}/tools/technical-audit`,
  },
  openGraph: {
    title: 'Free Technical SEO Audit — Performance & Crawlability Analysis',
    description:
      'Analyze Core Web Vitals, page speed, crawlability, and security headers. Free technical SEO audit with PDF export.',
    url: `${config.appUrl}/tools/technical-audit`,
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Technical SEO Audit | SerpNap",
    description: "Run a free technical SEO audit. Analyze Core Web Vitals, page speed, crawlability, and security headers.",
  },
};

function HeroSection() {
  return (
    <section className="section-padding container-padding pt-32 sm:pt-40">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase mb-6">
          Free Tool
        </p>

        {/* Title */}
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
          Technical SEO Audit
        </h1>

        {/* Description */}
        <p className="text-[17px] sm:text-[19px] text-muted-foreground/80 mt-6 max-w-2xl mx-auto leading-relaxed">
          Deep technical analysis of any website — Core Web Vitals, page speed, crawlability,
          server response, and competitive positioning. Export professional PDF reports.
        </p>
      </div>
    </section>
  );
}

function ToolSection() {
  return (
    <section className="section-padding container-padding">
      <div className="max-w-4xl mx-auto">
        <Suspense>
          <TechnicalAuditReport />
        </Suspense>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Enter Your URL',
      description:
        'Paste any website URL to begin the technical SEO audit. The tool fetches and analyzes the page automatically.',
    },
    {
      number: '02',
      title: 'Review Performance Scores',
      description:
        'See your Core Web Vitals estimates (LCP, CLS, INP), page speed score, and server response analysis.',
    },
    {
      number: '03',
      title: 'Check Crawlability Issues',
      description:
        'Identify crawl blockers, missing meta tags, broken canonical tags, and indexing problems that hurt rankings.',
    },
    {
      number: '04',
      title: 'Analyze Security & Mobile',
      description:
        'Review HTTPS configuration, security headers, mobile responsiveness, and viewport optimization.',
    },
    {
      number: '05',
      title: 'Export Your Report',
      description:
        'Download a professional PDF report with all findings and actionable recommendations to share with your team.',
    },
  ];

  return (
    <section className="section-padding container-padding bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em] text-foreground">
            Five steps to a complete technical audit
          </h2>
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-6 p-6 rounded-xl bg-background border border-border/50"
            >
              <div className="shrink-0">
                <span className="text-[13px] font-bold text-muted-foreground/40 tabular-nums">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-[14px] text-muted-foreground/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TipsSection() {
  return (
    <section className="section-padding container-padding">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 rounded-2xl bg-zinc-900 text-white">
          <h3 className="text-[18px] font-semibold mb-4">Pro Tip: Fix the Foundation First</h3>
          <p className="text-zinc-300 leading-relaxed mb-6">
            Most SEO efforts fail because they skip the{' '}
            <span className="text-white font-medium">technical foundation</span>.
            No amount of content or backlinks will help if your site is slow, broken, or unindexable.
          </p>
          <p className="text-zinc-400 text-sm italic">
            Run this audit before investing in content strategy. Fix Core Web Vitals, crawl errors,
            and security issues first — then watch your rankings climb as Google can finally
            see and trust your site.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function TechnicalAuditPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Technical SEO Audit', url: '/tools/technical-audit' },
  ]);
  const appSchema = getSoftwareApplicationSchema({
    name: 'Free Technical SEO Audit',
    description: 'Run a comprehensive technical SEO audit analyzing Core Web Vitals, page speed, crawlability, server response, and security headers.',
    url: `${config.appUrl}/tools/technical-audit`,
    applicationCategory: 'WebApplication',
    featureList: ['Core Web Vitals analysis', 'Page speed audit', 'Crawlability check', 'Server response analysis', 'Security header inspection', 'Mobile optimization review', 'PDF report export'],
  });
  const faqSchema = getFAQPageSchema([
    {
      question: 'What is a technical SEO audit?',
      answer: 'A technical SEO audit is a comprehensive analysis of your website\'s infrastructure, performance, and crawlability. It identifies issues like slow page speed, broken links, missing meta tags, and poor mobile optimization that prevent search engines from properly indexing your content.',
    },
    {
      question: 'How often should I run a technical audit?',
      answer: 'Run a full technical audit quarterly, or after major website changes like redesigns, CMS migrations, or large content updates. Monthly spot-checks on Core Web Vitals and crawl errors help catch issues early.',
    },
    {
      question: 'What does this audit report include?',
      answer: 'The report covers website performance metrics, Core Web Vitals analysis, lead response time evaluation, competitive positioning, and actionable recommendations. It generates a professional PDF you can share with clients or stakeholders.',
    },
    {
      question: 'Is this technical audit tool free?',
      answer: 'Yes, completely free with no signup required. Generate professional diagnostic reports instantly and download them as PDF.',
    },
  ]);
  const howToSchema = getHowToSchema({
    name: 'How to Generate a Technical Audit Report',
    description: 'Create a professional technical audit report using the free SerpNap Technical Audit Generator.',
    totalTime: 'PT5M',
    steps: [
      { name: 'Enter client data', text: 'Input the practice or business name, location, and key performance metrics.' },
      { name: 'Add performance metrics', text: 'Enter PageSpeed data, Core Web Vitals scores, and bounce rates for technical analysis.' },
      { name: 'Review the diagnostic', text: 'Examine the generated report covering performance, lead response, and competitive positioning.' },
      { name: 'Export and share', text: 'Download the professional PDF report to share with clients or your team.' },
    ],
  });

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]} />

      <HeroSection />
      <ToolSection />
      <HowItWorksSection />
      <TipsSection />
      <ToolsNav />
      <CTASection
        description="Found issues? Our AI-powered SEO service fixes technical problems and builds a strategy to grow your organic traffic."
        buttonText="Explore SEO Services"
        buttonHref="/services/ai-seo"
      />
    </>
  );
}
