/**
 * Blog Post: How to Do an SEO Audit (Step-by-Step Guide)
 * Category: seo
 * Targets "how to do an seo audit" — high-volume how-to keyword
 */
import type { BlogPostMetadata, BlogContentProps } from "@/lib/blog/types";
import {
  H2,
  H3,
  P,
  UL,
  LI,
  Strong,
  Link,
  CalloutBox,
  ProTip,
  TopicLinks,
} from "@/lib/blog/components/prose-components";

// ============================================================================
// METADATA
// ============================================================================
export const metadata: BlogPostMetadata = {
  slug: "how-to-do-seo-audit",
  title: "How to Do an SEO Audit in 2026 (Free Step-by-Step Guide)",
  excerpt: "Learn how to audit your website for SEO issues in under 30 minutes. This step-by-step guide covers technical SEO, on-page optimization, content quality, and structured data — using free tools.",
  category: "seo",
  tags: [
    "seo audit",
    "how to do seo audit",
    "seo audit checklist",
    "free seo audit",
    "website audit",
    "technical seo audit",
    "seo audit guide",
    "site audit",
  ],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2026-03-05",
  readingTimeMinutes: 15,
  featured: true,
  relatedSlugs: [
    "seo-checklist-2026",
    "technical-seo-audit",
    "best-free-seo-tools-2026",
  ],
};

// ============================================================================
// CONTENT
// ============================================================================
export function Content({ className }: BlogContentProps) {
  return (
    <article className={className}>
      <P>An SEO audit reveals what's holding your site back from ranking higher. Most businesses skip audits because tools like Ahrefs and Semrush charge $99-$449/month just to crawl your pages. But you don't need expensive software to run a thorough audit — you need a systematic approach and the right free tools.</P>
      <P>This guide walks you through a complete SEO audit in 8 steps, using free tools that give you actionable results. By the end, you'll know exactly what to fix and in what order.</P>

      <H2 id="what-seo-audit-checks">What an SEO Audit Actually Checks</H2>
      <P>A proper SEO audit evaluates your site across these dimensions:</P>
      <UL>
        <LI><Strong>Technical SEO</Strong> — Can search engines crawl and index your pages?</LI>
        <LI><Strong>On-page SEO</Strong> — Are your title tags, meta descriptions, and headings optimized?</LI>
        <LI><Strong>Content quality</Strong> — Does your content satisfy search intent and demonstrate E-E-A-T?</LI>
        <LI><Strong>Structured data</Strong> — Are you giving search engines explicit signals about your content type?</LI>
        <LI><Strong>Page speed</Strong> — Do your pages load fast enough to pass Core Web Vitals?</LI>
        <LI><Strong>Mobile optimization</Strong> — Is your site fully functional on mobile devices?</LI>
        <LI><Strong>Internal linking</Strong> — Are your pages connected in a logical structure?</LI>
        <LI><Strong>AI search readiness</Strong> — Is your content structured for AI-powered search engines?</LI>
      </UL>

      <H2 id="step-1-run-automated-audit">Step 1: Run an Automated SEO Audit</H2>
      <P>Start with the <Link href="/tools/seo-checker">{"SerpNap SEO Checker"}</Link>. Paste your URL and get a comprehensive audit across 50+ checks in 8 categories. You'll receive a letter grade, specific issues found, and AI-powered fix suggestions with copy-paste code.</P>
      <P>This gives you a baseline score and a prioritized list of issues. Focus on anything marked as "critical" or "warning" first.</P>

      <ProTip>
        Audit your homepage first, then your top 5 traffic pages. These pages have the highest impact on your overall SEO performance.
      </ProTip>

      <H2 id="step-2-check-technical-foundations">Step 2: Check Your Technical Foundations</H2>
      <P>Technical SEO ensures search engines can actually find and understand your content. Run through these checks:</P>

      <H3 id="robots-txt">Robots.txt</H3>
      <P>Your robots.txt file tells search engines which pages to crawl. Use the <Link href="/tools/robots-txt-generator">{"Robots.txt Generator"}</Link> to create a valid file or check your existing one. Common mistakes include accidentally blocking important pages or CSS/JS files.</P>

      <H3 id="xml-sitemap">XML Sitemap</H3>
      <P>Your sitemap helps search engines discover all your pages. The <Link href="/tools/sitemap-validator">{"Sitemap Validator"}</Link> checks your sitemap for errors, broken URLs, and format issues before you submit it to Google Search Console.</P>

      <H3 id="redirect-chains">Redirect Chains</H3>
      <P>Redirect chains waste crawl budget and slow down page loads. Use the <Link href="/tools/redirect-checker">{"Redirect Checker"}</Link> to trace redirect paths and identify chains that need to be cleaned up. Aim for single-hop 301 redirects.</P>

      <H2 id="step-3-optimize-meta-tags">Step 3: Optimize Your Meta Tags</H2>
      <P>Title tags and meta descriptions are your first impression in search results. Poor meta tags = low click-through rates, even if you rank well.</P>
      <P>Use the <Link href="/tools/meta-tag-generator">{"Meta Tag Generator"}</Link> to create optimized title tags and meta descriptions. The tool shows you a live SERP preview (desktop and mobile) with character counters so you can see exactly how your listing will appear on Google.</P>
      <UL>
        <LI><Strong>Title tags</Strong> — Keep under 60 characters, include your primary keyword near the front</LI>
        <LI><Strong>Meta descriptions</Strong> — Keep under 155 characters, include a clear value proposition and call to action</LI>
        <LI><Strong>Unique tags</Strong> — Every page should have unique title and description — no duplicates</LI>
      </UL>

      <H2 id="step-4-analyze-content-quality">Step 4: Analyze Content Quality</H2>
      <P>Google's helpful content system rewards pages that provide genuine value. During your audit, check each key page for:</P>
      <UL>
        <LI><Strong>Search intent match</Strong> — Does your content answer what the searcher actually wants?</LI>
        <LI><Strong>Depth and completeness</Strong> — Do you cover the topic thoroughly?</LI>
        <LI><Strong>E-E-A-T signals</Strong> — Experience, Expertise, Authoritativeness, Trustworthiness</LI>
        <LI><Strong>Keyword usage</Strong> — Natural keyword inclusion without over-optimization</LI>
      </UL>
      <P>The <Link href="/tools/keyword-density-checker">{"Keyword Density Checker"}</Link> helps you verify your keyword frequency is natural (1-3% density for primary keywords). Over-optimized content triggers spam filters.</P>
      <P>Use the <Link href="/tools/headline-analyzer">{"Headline Analyzer"}</Link> to score your H1 headings for emotional impact and click-through potential.</P>

      <H2 id="step-5-add-structured-data">Step 5: Add Structured Data</H2>
      <P>Structured data (schema markup) helps search engines understand your content type and can earn you rich snippets — enhanced search results with star ratings, FAQs, prices, and more.</P>
      <P>The <Link href="/tools/schema-generator">{"Schema Generator"}</Link> creates valid JSON-LD markup for common schema types. Start with these high-impact schemas:</P>
      <UL>
        <LI><Strong>Organization</Strong> — Your business identity for the Knowledge Panel</LI>
        <LI><Strong>LocalBusiness</Strong> — Essential for local SEO (address, hours, phone)</LI>
        <LI><Strong>FAQPage</Strong> — Earn expandable FAQ rich results in search</LI>
        <LI><Strong>Article/BlogPosting</Strong> — Helps Google understand your content type</LI>
        <LI><Strong>BreadcrumbList</Strong> — Improves navigation display in search results</LI>
      </UL>

      <H2 id="step-6-test-page-speed">Step 6: Test Page Speed & Core Web Vitals</H2>
      <P>Page speed directly affects rankings. Google's Core Web Vitals measure three key metrics:</P>
      <UL>
        <LI><Strong>LCP (Largest Contentful Paint)</Strong> — Should be under 2.5 seconds</LI>
        <LI><Strong>INP (Interaction to Next Paint)</Strong> — Should be under 200 milliseconds</LI>
        <LI><Strong>CLS (Cumulative Layout Shift)</Strong> — Should be under 0.1</LI>
      </UL>
      <P>Run the <Link href="/tools/page-speed-estimator">{"Page Speed Estimator"}</Link> to get Core Web Vitals estimates and specific optimization recommendations for your pages.</P>

      <CalloutBox variant="info" title="Quick Win: Image Optimization">
        <P>Images are the #1 cause of slow pages. Convert to WebP/AVIF, add width/height attributes, and implement lazy loading for below-the-fold images.</P>
      </CalloutBox>

      <H2 id="step-7-check-ai-search-visibility">Step 7: Check AI Search Visibility</H2>
      <P>AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews) are reshaping how people find information. Your content needs to be structured for both traditional and AI search.</P>
      <P>The <Link href="/tools/neural-audit">{"Neural Audit"}</Link> analyzes how AI search engines perceive your brand — something no other free tool offers. It checks citation likelihood, content structure for LLM comprehension, and entity recognition.</P>

      <H2 id="step-8-prioritize-fixes">Step 8: Prioritize and Fix Issues</H2>
      <P>After completing your audit, prioritize fixes by impact:</P>

      <H3 id="fix-critical-first">Critical (Fix immediately)</H3>
      <UL>
        <LI>Pages blocked from crawling (robots.txt or noindex issues)</LI>
        <LI>Missing or duplicate title tags</LI>
        <LI>Broken redirect chains or 404 errors</LI>
        <LI>Missing XML sitemap</LI>
      </UL>

      <H3 id="fix-high-priority">High Priority (Fix this week)</H3>
      <UL>
        <LI>Core Web Vitals failures</LI>
        <LI>Missing structured data on key pages</LI>
        <LI>Thin or duplicate content</LI>
        <LI>Missing meta descriptions</LI>
      </UL>

      <H3 id="fix-medium-priority">Medium Priority (Fix this month)</H3>
      <UL>
        <LI>Internal linking gaps</LI>
        <LI>Image optimization</LI>
        <LI>Content depth improvements</LI>
        <LI>AI search optimization</LI>
      </UL>

      <ProTip>
        Re-run your audit after implementing fixes to measure improvement. Track your letter grade and Lighthouse score over time to see the cumulative impact of your optimizations.
      </ProTip>

      <H2 id="how-often-audit">How Often Should You Audit?</H2>
      <UL>
        <LI><Strong>Monthly</Strong> — Quick check of your top 10 pages with the SEO Checker</LI>
        <LI><Strong>Quarterly</Strong> — Full audit of technical foundations, meta tags, and structured data</LI>
        <LI><Strong>After major changes</Strong> — Redesigns, migrations, CMS updates, or significant content additions</LI>
        <LI><Strong>After algorithm updates</Strong> — Google core updates can shift what matters</LI>
      </UL>

      <H2 id="start-your-audit">Start Your Free Audit Now</H2>
      <P>You don't need to spend $99/month on audit tools. The <Link href="/tools/seo-checker">{"SEO Checker"}</Link> runs 50+ checks across 8 categories in under 30 seconds — no signup, no credit card. Paste your URL and see exactly what needs fixing.</P>

      <CalloutBox variant="info" title="All audit tools are free">
        <P>Every tool mentioned in this guide is available at <Link href="/tools">{"serpnap.com/tools"}</Link> with no signup required. Run unlimited audits on any website.</P>
      </CalloutBox>

      <TopicLinks
        title="Related Resources"
        links={[
          { href: "/tools/seo-checker", label: "Free SEO Checker" },
          { href: "/tools/technical-audit", label: "Technical SEO Audit Tool" },
          { href: "/blog/seo/seo-checklist-2026", label: "Complete SEO Checklist for 2026" },
          { href: "/blog/seo/best-free-seo-tools-2026", label: "11 Best Free SEO Tools in 2026" },
          { href: "/blog/seo/free-ahrefs-semrush-alternative", label: "Free Ahrefs & Semrush Alternative" },
        ]}
      />
    </article>
  );
}
