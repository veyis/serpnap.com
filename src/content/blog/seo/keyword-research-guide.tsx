/**
 * Blog Post: Keyword Research Guide: Find Keywords You Can Actually Rank For
 * Category: seo
 * Generated from blog-posts.ts migration
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
  TopicLinks,
} from "@/lib/blog/components/prose-components";

// ============================================================================
// METADATA
// ============================================================================
export const metadata: BlogPostMetadata = {
  slug: "keyword-research-guide",
  title: "Keyword Research Guide: Find Winning Keywords",
  excerpt: "Master keyword research to find profitable keywords with real ranking potential. Tools, strategies, and step-by-step process.",
  category: "seo",
  tags: ["keyword research","SEO keywords","search intent","long-tail keywords"],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2025-02-11",
  updatedAt: "2026-01-10",
  
  readingTimeMinutes: 12,
  featured: true,
  relatedSlugs: [
    "seo-content-writing",
    "link-building-strategies",
    "seo-starter-guide-2026-what-google-actually-wants",
    "digital-marketing-tools-comparison",
  ],
};

// ============================================================================
// CONTENT
// ============================================================================
export function Content({ className }: BlogContentProps) {
  return (
    <article className={className}>
      <P>Keyword research is the foundation of SEO. Target wrong keywords, waste months of effort. Here's how to find the right ones.</P>
      <H2 id="what-makes-a-good-keyword">What Makes a Good Keyword?</H2>
      <P><Strong>Three Factors:</Strong></P>
      <UL>
        <LI><Strong>Search volume</Strong> - People actually search for it</LI>
        <LI><Strong>Relevance</Strong> - Matches what you offer</LI>
        <LI><Strong>Achievability</Strong> - You can realistically rank</LI>
      </UL>
      <H2 id="keyword-research-process">Keyword Research Process</H2>
      <H3 id="step-1-brainstorm-seed-keywords">Step 1: Brainstorm Seed Keywords</H3>
      <P>Start with what you offer:</P>
      <UL>
        <LI>Your services/products</LI>
        <LI>Problems you solve</LI>
        <LI>Questions customers ask</LI>
        <LI>Industry terminology</LI>
      </UL>
      <H3 id="step-2-expand-with-tools">Step 2: Expand with Tools</H3>
      <P><Strong>Free Tools:</Strong></P>
      <UL>
        <LI>Google Autocomplete</LI>
        <LI>Google "People Also Ask"</LI>
        <LI>Google "Related Searches"</LI>
        <LI>Answer The Public</LI>
        <LI>Google Keyword Planner</LI>
      </UL>
      <P><Strong>Paid Tools:</Strong></P>
      <UL>
        <LI>Ahrefs</LI>
        <LI>SEMrush</LI>
        <LI>Moz</LI>
        <LI>Mangools</LI>
      </UL>
      <H3 id="step-3-analyze-search-intent">Step 3: Analyze Search Intent</H3>
      <P><Strong>Four Types of Intent:</Strong></P>
      <P>| Intent | Signal | Example |</P>
      <P>|--------|--------|---------|</P>
      <P>| Informational | how, what, why | "how to fix leaky faucet" |</P>
      <P>| Navigational | brand names | "home depot plumbing" |</P>
      <P>| Commercial | best, review, compare | "best plumber Denver" |</P>
      <P>| Transactional | buy, price, near me | "emergency plumber near me" |</P>
      <P><Strong>Match content to intent.</Strong> Don't write a blog post for a "near me" search.</P>
      <H3 id="step-4-assess-competition">Step 4: Assess Competition</H3>
      <P><Strong>Check SERPs for:</Strong></P>
      <UL>
        <LI>Who ranks? (Big brands or smaller sites?)</LI>
        <LI>What content type? (Blog, product, service page?)</LI>
        <LI>Content quality? (Can you do better?)</LI>
        <LI>Domain authority? (Way higher than yours?)</LI>
      </UL>
      <H3 id="step-5-prioritize-keywords">Step 5: Prioritize Keywords</H3>
      <P>| Priority | Criteria |</P>
      <P>|----------|----------|</P>
      <P>| High | Volume + Relevance + Achievable |</P>
      <P>| Medium | Good volume but competitive, or low volume but high intent |</P>
      <P>| Low | High competition OR low relevance |</P>
      <H2 id="keyword-types-to-target">Keyword Types to Target</H2>
      <H3 id="head-terms">Head Terms</H3>
      <UL>
        <LI>High volume, high competition</LI>
        <LI>Example: "digital marketing"</LI>
        <LI>Good for: Authority building, long-term</LI>
      </UL>
      <H3 id="long-tail-keywords">Long-Tail Keywords</H3>
      <UL>
        <LI>Lower volume, lower competition</LI>
        <LI>Example: "digital marketing for restaurants Denver"</LI>
        <LI>Good for: Quick wins, high conversion</LI>
      </UL>
      <H3 id="local-keywords">Local Keywords</H3>
      <UL>
        <LI>Location-specific searches</LI>
        <LI>Example: "plumber [city]"</LI>
        <LI>Good for: Local businesses</LI>
      </UL>
      <H3 id="question-keywords">Question Keywords</H3>
      <UL>
        <LI>Start with how, what, why</LI>
        <LI>Good for: Blog content, featured snippets</LI>
      </UL>
      <H2 id="keyword-mapping">Keyword Mapping</H2>
      <P>Assign keywords to pages:</P>
      <P>| Page | Primary Keyword | Secondary Keywords |</P>
      <P>|------|-----------------|-------------------|</P>
      <P>| Homepage | digital marketing agency | marketing company, marketing services |</P>
      <P>| SEO Service | SEO services | SEO company, SEO agency |</P>
      <P>| Blog Post | how to improve SEO | SEO tips, SEO strategies |</P>
      <P><Strong>One primary keyword per page.</Strong> Avoid keyword cannibalization.</P>
      <H2 id="competitive-gap-analysis">Competitive Gap Analysis</H2>
      <P>Find keywords competitors rank for that you don't:</P>
      <UL>
        <LI>Enter competitors in Ahrefs/SEMrush</LI>
        <LI>Use "Content Gap" feature</LI>
        <LI>Filter by volume and difficulty</LI>
        <LI>Create content for gaps</LI>
      </UL>
      <H2 id="common-keyword-research-mistakes">Common Keyword Research Mistakes</H2>
      <UL>
        <LI><Strong>Chasing volume only</Strong> - High volume often means high competition</LI>
        <LI><Strong>Ignoring intent</Strong> - Wrong content for the keyword</LI>
        <LI><Strong>Too broad</Strong> - "marketing" vs "restaurant marketing Denver"</LI>
        <LI><Strong>Not checking SERPs</Strong> - Assuming you can rank without looking</LI>
        <LI><Strong>One and done</Strong> - Keyword research is ongoing</LI>
      </UL>
      <P>See our <Link href="/guide/seo-complete-guide">{"SEO guide"}</Link> for implementation.</P>
      <P><Link href="/contact">{"Get professional keyword research"}</Link>.</P>
      <P>---</P>
      <P><Strong>Related:</Strong> <Link href="/guide/seo-complete-guide">{"SEO Guide"}</Link> | <Link href="/blog/seo/seo-content-writing">{"Content Writing"}</Link></P>

      <TopicLinks
        title="More Keyword and SEO Resources"
        links={[
          { href: "/blog/seo/seo-content-writing", label: "SEO Content Writing: The Complete Guide" },
          { href: "/blog/seo/seo-for-saas-companies", label: "SEO for SaaS Companies" },
          { href: "/blog/seo/local-seo-checklist-2026", label: "Local SEO Checklist for 2026" },
          { href: "/tools/seo-checker", label: "Free SEO Checker Tool" },
          { href: "/tools/meta-tag-generator", label: "Meta Tag Generator Tool" },
        ]}
      />
    </article>
  );
}

export default { metadata, Content };
