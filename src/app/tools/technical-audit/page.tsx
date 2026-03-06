import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TechnicalAuditReport } from '@/components/tools/technical-audit-report';
import { CTASection } from '@/components/agency';
import { MultipleStructuredData } from '@/components/seo/structured-data';
import { getBreadcrumbSchema, getSoftwareApplicationSchema, getFAQPageSchema, getHowToSchema } from '@/lib/utils/seo';
import { config } from '@/lib/config';
import { ToolsNav } from '@/components/tools/tools-nav';

export const metadata: Metadata = {
  title: 'Technical Audit Report Generator | Client Diagnostic Tool',
  description:
    'Generate professional technical audit reports for high-ticket clients. Clinical diagnostic PDFs that analyze website performance, lead response times, and competitive positioning.',
  keywords: [
    'technical audit report',
    'client diagnostic',
    'website performance audit',
    'lead response analysis',
    'competitive analysis tool',
    'sales closing tool',
    'dental marketing audit',
    'healthcare marketing audit',
  ],
  alternates: {
    canonical: `${config.appUrl}/tools/technical-audit`,
  },
  openGraph: {
    title: 'Technical Audit Report Generator | SerpNap',
    description:
      'Generate clinical diagnostic reports that close high-ticket clients. Not marketing fluff - technical proof.',
    url: `${config.appUrl}/tools/technical-audit`,
    type: 'website',
  },
  twitter: {
      card: "summary_large_image",
      title: "Technical Audit Report Generator | SerpNap",
      description: "Generate professional technical audit reports for high-ticket clients. Clinical diagnostic PDFs that analyze website performance, lead response times, and competitive positioning.",
  },
  // Indexable: public tool page linked from /tools and included in sitemap.
};

function HeroSection() {
  return (
    <section className="section-padding container-padding pt-32 sm:pt-40">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase mb-6">
          Internal Tool
        </p>

        {/* Title */}
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
          Technical Audit Report Generator
        </h1>

        {/* Description */}
        <p className="text-[17px] sm:text-[19px] text-muted-foreground/80 mt-6 max-w-2xl mx-auto leading-relaxed">
          Generate a clinical diagnostic that looks like an MRI of their business failures.
          Not marketing material - technical proof that closes high-ticket clients.
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
      title: 'Enter Client Data',
      description:
        'Input practice name, location, and the estimated lost revenue figure. This becomes the headline hook.',
    },
    {
      number: '02',
      title: 'Add Performance Metrics',
      description:
        'Enter PageSpeed data, Core Web Vitals, and bounce rates. This creates the "LCP Death Spiral" technical proof.',
    },
    {
      number: '03',
      title: 'Document Lead Response',
      description:
        'Show how leads go cold with the "Ghost Lead Timeline". The 7-minute half-life stat is devastating.',
    },
    {
      number: '04',
      title: 'Compare Competition',
      description:
        'Side-by-side GBP comparison. They\'re not being out-dentisted, they\'re being out-programmed.',
    },
    {
      number: '05',
      title: 'Generate & Send',
      description:
        'Export a 5-page PDF that looks like a technical autopsy, not a sales pitch. Send with confidence.',
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
            From sales call to signed contract
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
          <h3 className="text-[18px] font-semibold mb-4">The Ruthless Reality Check</h3>
          <p className="text-zinc-300 leading-relaxed mb-6">
            Most agencies send a pretty slide deck with pictures of teeth. You are sending a{' '}
            <span className="text-white font-medium">Technical Autopsy</span>.
          </p>
          <p className="text-zinc-400 text-sm italic">
            When you send this, you say: &ldquo;Dr. [Name], here is the diagnostic on your practice.
            I don&apos;t want to discuss &lsquo;marketing&rsquo; on our next call. I want to discuss
            how we&apos;re going to fix these infrastructure failures before the next quarter
            begins.&rdquo;
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
    { name: 'Technical Audit Report', url: '/tools/technical-audit' },
  ]);
  const appSchema = getSoftwareApplicationSchema({
    name: 'Technical Audit Report Generator',
    description: 'Generate professional technical audit reports analyzing website performance, lead response times, and competitive positioning.',
    url: `${config.appUrl}/tools/technical-audit`,
    applicationCategory: 'BusinessApplication',
    featureList: ['Performance analysis', 'Lead response audit', 'Competitive positioning', 'PDF export'],
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
