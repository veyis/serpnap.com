/**
 * Blog Post: How to Write Perfect Meta Tags for SEO
 * Category: seo
 * Targets "how to write meta tags", "meta tags for seo", "meta tag best practices"
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
  slug: "how-to-write-meta-tags",
  title: "How to Write Perfect Meta Tags for SEO in 2026 (With Examples)",
  excerpt: "Learn how to write title tags and meta descriptions that rank higher and get more clicks. Includes formulas, character limits, examples, and a free generator tool.",
  category: "seo",
  tags: [
    "meta tags",
    "how to write meta tags",
    "meta description",
    "title tag",
    "meta tags seo",
    "meta tag best practices",
    "meta tag examples",
    "seo meta tags",
  ],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2026-03-05",
  readingTimeMinutes: 10,
  featured: false,
  relatedSlugs: [
    "seo-checklist-2026",
    "how-to-do-seo-audit",
    "best-free-seo-tools-2026",
  ],
};

// ============================================================================
// CONTENT
// ============================================================================
export function Content({ className }: BlogContentProps) {
  return (
    <article className={className}>
      <P>Meta tags are your website's first impression in search results. A well-crafted title tag and meta description can be the difference between a searcher clicking your result or scrolling past it. Studies show optimized meta tags can increase click-through rates by 20-30% — without changing your rankings at all.</P>
      <P>This guide covers exactly how to write title tags and meta descriptions that satisfy both Google's algorithm and human psychology. No fluff — just proven formulas and real examples.</P>

      <H2 id="what-are-meta-tags">What Are Meta Tags (And Which Ones Matter for SEO)?</H2>
      <P>Meta tags are HTML elements in your page's {"<head>"} section that provide information about the page to search engines and browsers. While there are dozens of meta tags, only a few directly impact SEO:</P>
      <UL>
        <LI><Strong>Title tag</Strong> — The clickable headline in search results. Direct ranking factor.</LI>
        <LI><Strong>Meta description</Strong> — The summary text below the title. Influences CTR (indirect ranking factor).</LI>
        <LI><Strong>Meta robots</Strong> — Controls crawling and indexing behavior (noindex, nofollow).</LI>
        <LI><Strong>Canonical tag</Strong> — Specifies the preferred URL for duplicate content.</LI>
        <LI><Strong>Viewport tag</Strong> — Essential for mobile rendering.</LI>
        <LI><Strong>Open Graph tags</Strong> — Control how your page appears when shared on social media.</LI>
      </UL>

      <H2 id="title-tag-rules">Title Tag: Rules for Higher Rankings and Clicks</H2>

      <H3 id="title-tag-length">Character Limit</H3>
      <P>Google displays approximately <Strong>55-60 characters</Strong> of your title tag (or about 580 pixels wide on desktop). Titles longer than this get truncated with an ellipsis (...). Keep your most important information within the first 55 characters.</P>

      <H3 id="title-tag-formula">Proven Formulas</H3>
      <P>Here are battle-tested title tag formulas that balance SEO and CTR:</P>
      <UL>
        <LI><Strong>How-to:</Strong> How to [Action] in [Year] ([Benefit]) — "How to Write Meta Tags in 2026 (Free Guide)"</LI>
        <LI><Strong>List:</Strong> [Number] [Adjective] [Keyword] for [Audience] — "16 Free SEO Tools for Small Businesses"</LI>
        <LI><Strong>Question:</Strong> What Is [Keyword]? [Clarifier] — "What Is Schema Markup? A Beginner's Guide"</LI>
        <LI><Strong>Best of:</Strong> Best [Keyword] in [Year] ([Qualifier]) — "Best Free SEO Tools in 2026 (No Signup)"</LI>
      </UL>

      <H3 id="title-tag-best-practices">Best Practices</H3>
      <UL>
        <LI>Place your primary keyword near the beginning of the title</LI>
        <LI>Include your brand name at the end, separated by | or —</LI>
        <LI>Make every page title unique (no duplicates across your site)</LI>
        <LI>Include the year for time-sensitive content (guides, best-of lists)</LI>
        <LI>Use power words: Free, Complete, Ultimate, Proven, Step-by-Step</LI>
        <LI>Write for humans first — compelling titles get clicks, and CTR influences rankings</LI>
      </UL>

      <ProTip>
        Use the <Link href="/tools/headline-analyzer">{"Headline Analyzer"}</Link> to score your title tags before publishing. Aim for a score above 70 for optimal emotional impact and CTR potential.
      </ProTip>

      <H2 id="meta-description-rules">Meta Description: Rules for Higher Click-Through Rates</H2>

      <H3 id="meta-description-length">Character Limit</H3>
      <P>Google displays approximately <Strong>150-160 characters</Strong> of your meta description on desktop (about 920 pixels). On mobile, it's closer to 120 characters. Write your most compelling copy within 120 characters, with supporting details up to 155.</P>

      <H3 id="meta-description-formula">Proven Formulas</H3>
      <UL>
        <LI><Strong>Problem → Solution → CTA:</Strong> "Struggling with [Problem]? [Solution] with our [Tool/Guide]. [CTA]."</LI>
        <LI><Strong>Benefit-led:</Strong> "[Benefit 1], [Benefit 2], and [Benefit 3]. [Qualifier] — [CTA]."</LI>
        <LI><Strong>Question hook:</Strong> "[Question]? Learn [what you'll learn] in this [content type]. [Social proof]."</LI>
      </UL>

      <H3 id="meta-description-best-practices">Best Practices</H3>
      <UL>
        <LI>Include your target keyword naturally — Google bolds matching terms in results</LI>
        <LI>Write a clear value proposition — why should someone click YOUR result?</LI>
        <LI>Include a call-to-action: "Learn how", "Get started", "Try free"</LI>
        <LI>Add specificity: numbers, data, or unique qualifiers ("50+ checks", "no signup")</LI>
        <LI>Avoid duplicate descriptions across pages</LI>
        <LI>Don't use quotes — Google may truncate at quotation marks</LI>
      </UL>

      <CalloutBox variant="info" title="Google may rewrite your meta description">
        <P>Google rewrites meta descriptions about 63% of the time, pulling text from your page content instead. This is more likely when your description doesn't match the specific search query. Write great descriptions anyway — they still influence CTR for exact-match queries, and they're used for social sharing.</P>
      </CalloutBox>

      <H2 id="open-graph-tags">Open Graph Tags: Control Social Sharing</H2>
      <P>Open Graph (OG) meta tags control how your page appears when shared on Facebook, LinkedIn, Twitter, and messaging apps. The key tags:</P>
      <UL>
        <LI><Strong>og:title</Strong> — The title shown in social shares (can differ from your SEO title)</LI>
        <LI><Strong>og:description</Strong> — The description shown in social shares</LI>
        <LI><Strong>og:image</Strong> — The image displayed in the social card (1200x630px recommended)</LI>
        <LI><Strong>og:type</Strong> — Content type (website, article, product)</LI>
        <LI><Strong>og:url</Strong> — The canonical URL of the page</LI>
      </UL>
      <P>For Twitter/X, also include twitter:card (summary_large_image for posts with images) and twitter:site (your @handle).</P>

      <H2 id="common-mistakes">Common Meta Tag Mistakes to Avoid</H2>
      <UL>
        <LI><Strong>Duplicate tags</Strong> — Every page needs unique title and description. Duplicate tags confuse search engines and reduce CTR.</LI>
        <LI><Strong>Keyword stuffing</Strong> — "SEO tools, free SEO tools, best SEO tools, SEO tools 2026" reads like spam and Google will rewrite it.</LI>
        <LI><Strong>Too vague</Strong> — "Welcome to our website" tells neither Google nor users what the page offers.</LI>
        <LI><Strong>Missing descriptions</Strong> — Empty meta descriptions mean Google auto-generates one from your page content, which may not be compelling.</LI>
        <LI><Strong>Wrong length</Strong> — Too short wastes valuable real estate. Too long gets cut off mid-sentence.</LI>
        <LI><Strong>No call-to-action</Strong> — Descriptions without a CTA have lower click-through rates.</LI>
      </UL>

      <H2 id="generate-meta-tags">Generate Perfect Meta Tags (Free Tool)</H2>
      <P>Writing meta tags manually for every page is time-consuming. The <Link href="/tools/meta-tag-generator">{"SerpNap Meta Tag Generator"}</Link> creates SEO-optimized title tags and meta descriptions with:</P>
      <UL>
        <LI>Live Google SERP preview (desktop and mobile)</LI>
        <LI>Real-time character counters</LI>
        <LI>One-click HTML code copy</LI>
        <LI>Open Graph tag generation</LI>
      </UL>
      <P>Paste your page details, preview how it'll look in search results, and copy the HTML. No signup required.</P>

      <P>After creating your meta tags, run the <Link href="/tools/seo-checker">{"SEO Checker"}</Link> on your live page to verify they're implemented correctly and check for other on-page SEO issues.</P>

      <TopicLinks
        title="Related Resources"
        links={[
          { href: "/tools/meta-tag-generator", label: "Free Meta Tag Generator" },
          { href: "/tools/headline-analyzer", label: "Headline Analyzer" },
          { href: "/tools/seo-checker", label: "Free SEO Checker" },
          { href: "/blog/seo/how-to-do-seo-audit", label: "How to Do an SEO Audit" },
          { href: "/blog/seo/seo-checklist-2026", label: "Complete SEO Checklist for 2026" },
          { href: "/glossary/what-is-meta-description", label: "What Is a Meta Description?" },
          { href: "/glossary/what-is-title-tag", label: "What Is a Title Tag?" },
        ]}
      />
    </article>
  );
}
