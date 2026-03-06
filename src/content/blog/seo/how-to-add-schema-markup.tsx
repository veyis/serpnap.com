/**
 * Blog Post: How to Add Schema Markup to Your Website
 * Category: seo
 * Targets "how to add schema markup", "schema markup guide", "structured data seo"
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
  slug: "how-to-add-schema-markup",
  title: "How to Add Schema Markup to Your Website (2026 Guide)",
  excerpt: "Learn how to implement JSON-LD structured data to earn rich snippets in Google. Step-by-step instructions for Organization, LocalBusiness, FAQ, HowTo, and Article schemas — with a free generator.",
  category: "seo",
  tags: [
    "schema markup",
    "structured data",
    "how to add schema markup",
    "json-ld",
    "rich snippets",
    "schema markup guide",
    "structured data seo",
    "google rich results",
  ],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2026-03-05",
  readingTimeMinutes: 12,
  featured: false,
  relatedSlugs: [
    "structured-data-implementation-guide",
    "how-to-do-seo-audit",
    "seo-checklist-2026",
  ],
};

// ============================================================================
// CONTENT
// ============================================================================
export function Content({ className }: BlogContentProps) {
  return (
    <article className={className}>
      <P>Schema markup tells search engines exactly what your content means — not just what it says. Pages with schema markup are eligible for rich results (star ratings, FAQ dropdowns, recipe cards, how-to steps), which can increase click-through rates by 20-35%.</P>
      <P>Despite its impact, fewer than 33% of websites use structured data. This guide shows you exactly how to add schema markup using JSON-LD — Google's recommended format — with copy-paste examples for every common schema type.</P>

      <H2 id="what-is-schema-markup">What Is Schema Markup?</H2>
      <P>Schema markup is code (in JSON-LD format) that you add to your web pages to provide explicit information about your content to search engines. It uses a shared vocabulary from <Strong>Schema.org</Strong> — created collaboratively by Google, Bing, Yahoo, and Yandex.</P>
      <P>Without schema: Google guesses what your page is about based on content analysis.</P>
      <P>With schema: You tell Google explicitly: "This page describes a LocalBusiness with this address, these hours, and this phone number."</P>

      <H2 id="why-schema-matters">Why Schema Markup Matters in 2026</H2>
      <UL>
        <LI><Strong>Rich results</Strong> — Earn enhanced search listings with star ratings, FAQs, prices, and more</LI>
        <LI><Strong>Higher CTR</Strong> — Rich results see 20-35% higher click-through rates than standard listings</LI>
        <LI><Strong>Voice search</Strong> — Schema helps voice assistants understand and cite your content</LI>
        <LI><Strong>AI search</Strong> — AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews) use structured data to understand entity relationships</LI>
        <LI><Strong>Knowledge panels</Strong> — Organization schema helps Google build Knowledge Panels for your brand</LI>
      </UL>

      <ProTip>
        Schema markup is increasingly important for GEO (Generative Engine Optimization). AI search engines rely heavily on structured data to understand entity authority and relationships. Run the <Link href="/tools/neural-audit">{"Neural Audit"}</Link> to check how AI engines perceive your brand.
      </ProTip>

      <H2 id="json-ld-format">JSON-LD: Google's Recommended Format</H2>
      <P>Google recommends JSON-LD (JavaScript Object Notation for Linked Data) over Microdata or RDFa. JSON-LD is added as a {"<script>"} tag in your page's {"<head>"} section — it doesn't modify your HTML content at all, making it easy to implement and maintain.</P>

      <H2 id="essential-schemas">Essential Schema Types (With Examples)</H2>

      <H3 id="organization-schema">1. Organization Schema</H3>
      <P>Every website should have Organization schema on the homepage. It establishes your brand identity for Google's Knowledge Panel and entity recognition.</P>
      <P>Key properties: name, url, logo, description, sameAs (social profiles), contactPoint.</P>

      <H3 id="localbusiness-schema">2. LocalBusiness Schema</H3>
      <P>Critical for any business with a physical location. Helps you appear in local search results, Google Maps, and the local pack.</P>
      <P>Key properties: name, address, telephone, openingHours, geo (latitude/longitude), priceRange.</P>

      <H3 id="faqpage-schema">3. FAQPage Schema</H3>
      <P>One of the easiest schemas to implement with the highest visual impact. FAQ rich results show expandable question-answer pairs directly in search results.</P>
      <P>Requirements: questions must be visible on the page (not hidden), answers should be comprehensive, and the content must be genuinely helpful.</P>

      <H3 id="howto-schema">4. HowTo Schema</H3>
      <P>Perfect for tutorial and guide content. HowTo rich results can show numbered steps, time estimates, and images directly in search results.</P>
      <P>Key properties: name, step (with text and optional image), totalTime, estimatedCost.</P>

      <H3 id="article-schema">5. Article / BlogPosting Schema</H3>
      <P>Helps Google understand your content as a news article or blog post. Important properties include headline, datePublished, dateModified, author, and publisher.</P>

      <H3 id="breadcrumb-schema">6. BreadcrumbList Schema</H3>
      <P>Improves how your page's navigation path appears in search results. Instead of showing a raw URL, Google displays a breadcrumb trail (Home {">"} Blog {">"} SEO {">"} Article).</P>

      <H2 id="how-to-implement">How to Implement Schema Markup</H2>

      <H3 id="step-1-generate">Step 1: Generate Your Schema</H3>
      <P>Use the <Link href="/tools/schema-generator">{"SerpNap Schema Generator"}</Link> to create valid JSON-LD markup. Select your schema type, fill in your details, and copy the generated code. The tool validates your markup in real-time so you don't have to worry about syntax errors.</P>

      <H3 id="step-2-add-to-page">Step 2: Add to Your Page</H3>
      <P>Paste the JSON-LD script tag into your page's {"<head>"} section. If you're using a CMS:</P>
      <UL>
        <LI><Strong>WordPress</Strong> — Use the Yoast SEO or Rank Math plugin, or add via a custom header plugin</LI>
        <LI><Strong>Shopify</Strong> — Add to your theme's theme.liquid file or use an app like JSON-LD for SEO</LI>
        <LI><Strong>Next.js</Strong> — Add to your page's metadata or use a {"<script type=\"application/ld+json\">"} tag</LI>
        <LI><Strong>Static HTML</Strong> — Paste directly into the {"<head>"} section</LI>
      </UL>

      <H3 id="step-3-validate">Step 3: Validate Your Markup</H3>
      <P>After adding schema to your live page, validate it using:</P>
      <UL>
        <LI>Google's Rich Results Test — Check if your markup qualifies for rich results</LI>
        <LI>Schema.org Validator — Verify your JSON-LD syntax is correct</LI>
        <LI>The <Link href="/tools/seo-checker">{"SerpNap SEO Checker"}</Link> — Audits structured data as part of 50+ SEO checks</LI>
      </UL>

      <H3 id="step-4-monitor">Step 4: Monitor in Search Console</H3>
      <P>Google Search Console's Enhancements section shows which rich results your site is eligible for, any errors in your markup, and how many pages have valid structured data.</P>

      <CalloutBox variant="info" title="Multiple schemas per page">
        <P>You can (and should) use multiple schema types on a single page. For example, a blog post might have Article + FAQPage + BreadcrumbList schemas. Combine them using separate {"<script>"} tags or a single tag with @graph.</P>
      </CalloutBox>

      <H2 id="common-mistakes">Common Schema Markup Mistakes</H2>
      <UL>
        <LI><Strong>Marking up invisible content</Strong> — Google requires FAQ and HowTo content to be visible on the page</LI>
        <LI><Strong>Incorrect nesting</Strong> — Make sure @type, @context, and property names match Schema.org specifications exactly</LI>
        <LI><Strong>Outdated schema</Strong> — Schema.org evolves; check for deprecated properties</LI>
        <LI><Strong>Missing required properties</Strong> — Each schema type has required and recommended properties</LI>
        <LI><Strong>Misleading markup</Strong> — Schema that doesn't match page content violates Google's guidelines</LI>
      </UL>

      <H2 id="get-started">Generate Your Schema Now (Free)</H2>
      <P>The <Link href="/tools/schema-generator">{"Schema Generator"}</Link> creates valid, copy-paste JSON-LD for LocalBusiness, FAQPage, and more — no signup required. Generate your markup in 30 seconds, add it to your page, and start earning rich results.</P>

      <TopicLinks
        title="Related Resources"
        links={[
          { href: "/tools/schema-generator", label: "Free Schema Generator" },
          { href: "/tools/seo-checker", label: "Free SEO Checker" },
          { href: "/blog/seo/structured-data-implementation-guide", label: "Structured Data Implementation Guide" },
          { href: "/blog/seo/how-to-do-seo-audit", label: "How to Do an SEO Audit" },
          { href: "/glossary/what-is-schema-markup", label: "What Is Schema Markup?" },
          { href: "/glossary/what-is-json-ld", label: "What Is JSON-LD?" },
          { href: "/glossary/what-is-rich-snippets", label: "What Are Rich Snippets?" },
        ]}
      />
    </article>
  );
}
