/**
 * Blog Post: DIY SEO Audit: 15-Point Checklist for Small Business Owners
 * Category: seo
 * Differentiated from main SEO checklist - focuses on self-audit for non-technical owners
 */
import type { BlogPostMetadata, BlogContentProps } from "@/lib/blog/types";
import {
  H2,
  H3,
  P,
  UL,
  LI,
  Link,
  TopicLinks,
} from "@/lib/blog/components/prose-components";

// ============================================================================
// METADATA
// ============================================================================
export const metadata: BlogPostMetadata = {
  slug: "seo-checklist-small-business",
  title: "DIY SEO Audit: 15-Point Checklist for Small Business Owners",
  excerpt: "Run your own SEO audit in under an hour. This simplified 15-point checklist helps non-technical business owners identify and fix the SEO issues hurting.",
  category: "seo",
  tags: ["seo audit","small business seo","diy seo","seo for beginners","website audit"],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2024-04-12",
  updatedAt: "2026-01-10",
  readingTimeMinutes: 15,
  featured: false,
  relatedSlugs: [
    "seo-checklist-2026",
    "technical-seo-audit",
    "seo-for-small-business",
    "local-seo-checklist-2026",
  ],
};

// ============================================================================
// CONTENT
// ============================================================================
export function Content({ className }: BlogContentProps) {
  return (
    <article className={className}>
      <P>SEO doesn't have to be complicated. This checklist breaks down everything a small business needs to do to improve search rankings and drive more organic traffic.</P>
      <H2 id="technical-seo-checklist">Technical SEO Checklist</H2>
      <H3 id="website-foundation">Website Foundation</H3>
      <UL>
        <LI>[ ] Site loads in under 3 seconds on mobile</LI>
        <LI>[ ] Website is mobile-responsive</LI>
        <LI>[ ] SSL certificate installed (https://)</LI>
        <LI>[ ] XML sitemap created and submitted to Google Search Console</LI>
        <LI>[ ] Robots.txt file properly configured</LI>
      </UL>
      <H3 id="core-web-vitals">Core Web Vitals</H3>
      <UL>
        <LI>[ ] Largest Contentful Paint (LCP) under 2.5 seconds</LI>
        <LI>[ ] First Input Delay (FID) under 100 milliseconds</LI>
        <LI>[ ] Cumulative Layout Shift (CLS) under 0.1</LI>
      </UL>
      <H3 id="crawlability">Crawlability</H3>
      <UL>
        <LI>[ ] No orphan pages (every page linked internally)</LI>
        <LI>[ ] Clean URL structure (e.g., /services/web-design not /page?id=123)</LI>
        <LI>[ ] No broken internal links (404 errors)</LI>
        <LI>[ ] Proper use of canonical tags</LI>
      </UL>
      <H2 id="on-page-seo-checklist">On-Page SEO Checklist</H2>
      <H3 id="title-tags">Title Tags</H3>
      <UL>
        <LI>[ ] Unique title for every page</LI>
        <LI>[ ] Primary keyword near the beginning</LI>
        <LI>[ ] Under 60 characters</LI>
        <LI>[ ] Includes brand name</LI>
      </UL>
      <H3 id="meta-descriptions">Meta Descriptions</H3>
      <UL>
        <LI>[ ] Unique description for every page</LI>
        <LI>[ ] 150-160 characters</LI>
        <LI>[ ] Includes primary keyword naturally</LI>
        <LI>[ ] Compelling call-to-action</LI>
      </UL>
      <H3 id="header-tags">Header Tags</H3>
      <UL>
        <LI>[ ] One H1 per page with primary keyword</LI>
        <LI>[ ] H2s used for main sections</LI>
        <LI>[ ] Logical heading hierarchy (H1 → H2 → H3)</LI>
        <LI>[ ] Headers describe content accurately</LI>
      </UL>
      <H3 id="content-optimization">Content Optimization</H3>
      <UL>
        <LI>[ ] Minimum 500 words for service pages</LI>
        <LI>[ ] Minimum 1,500 words for blog posts</LI>
        <LI>[ ] Primary keyword in first 100 words</LI>
        <LI>[ ] Related keywords used naturally throughout</LI>
        <LI>[ ] Content answers user questions comprehensively</LI>
      </UL>
      <H3 id="images">Images</H3>
      <UL>
        <LI>[ ] Descriptive file names (e.g., "blue-widget-product.jpg")</LI>
        <LI>[ ] Alt text for all images with relevant keywords</LI>
        <LI>[ ] Images compressed for fast loading</LI>
        <LI>[ ] Next-gen formats (WebP) when possible</LI>
      </UL>
      <H2 id="local-seo-checklist">Local SEO Checklist</H2>
      <H3 id="google-business-profile">Google Business Profile</H3>
      <UL>
        <LI>[ ] Profile claimed and verified</LI>
        <LI>[ ] Business name, address, phone consistent everywhere (NAP)</LI>
        <LI>[ ] Correct business categories selected</LI>
        <LI>[ ] Complete business description with keywords</LI>
        <LI>[ ] Photos uploaded (exterior, interior, team, products)</LI>
        <LI>[ ] Regular posts (weekly minimum)</LI>
        <LI>[ ] Q&A section monitored and answered</LI>
      </UL>
      <H3 id="local-citations">Local Citations</H3>
      <UL>
        <LI>[ ] Listed on major directories (Yelp, Yellow Pages, etc.)</LI>
        <LI>[ ] Industry-specific directories</LI>
        <LI>[ ] NAP consistent across all listings</LI>
        <LI>[ ] Duplicate listings removed</LI>
      </UL>
      <H3 id="reviews">Reviews</H3>
      <UL>
        <LI>[ ] Active review generation strategy</LI>
        <LI>[ ] All reviews responded to within 24-48 hours</LI>
        <LI>[ ] Negative reviews addressed professionally</LI>
      </UL>
      <H2 id="content-seo-checklist">Content SEO Checklist</H2>
      <H3 id="blog-strategy">Blog Strategy</H3>
      <UL>
        <LI>[ ] Publishing schedule established (minimum 2x/month)</LI>
        <LI>[ ] Keyword research for each post</LI>
        <LI>[ ] Posts optimized for specific long-tail keywords</LI>
        <LI>[ ] Internal links to service pages</LI>
        <LI>[ ] External links to authoritative sources</LI>
      </UL>
      <H3 id="content-types">Content Types</H3>
      <UL>
        <LI>[ ] How-to guides for your services</LI>
        <LI>[ ] Industry trend articles</LI>
        <LI>[ ] FAQ pages addressing common questions</LI>
        <LI>[ ] Case studies and success stories</LI>
        <LI>[ ] Local content for your service area</LI>
      </UL>
      <H2 id="link-building-checklist">Link Building Checklist</H2>
      <H3 id="foundation-links">Foundation Links</H3>
      <UL>
        <LI>[ ] Social media profiles created and linked</LI>
        <LI>[ ] Industry association directories</LI>
        <LI>[ ] Chamber of commerce listing</LI>
        <LI>[ ] Better Business Bureau (if applicable)</LI>
      </UL>
      <H3 id="ongoing-link-building">Ongoing Link Building</H3>
      <UL>
        <LI>[ ] Guest posting strategy</LI>
        <LI>[ ] Local partnerships and sponsorships</LI>
        <LI>[ ] PR and local news coverage</LI>
        <LI>[ ] Quality over quantity approach</LI>
      </UL>
      <H2 id="measurement-checklist">Measurement Checklist</H2>
      <H3 id="tools-setup">Tools Setup</H3>
      <UL>
        <LI>[ ] Google Search Console connected</LI>
        <LI>[ ] Google Analytics 4 installed</LI>
        <LI>[ ] Rank tracking for target keywords</LI>
        <LI>[ ] Monthly reporting schedule</LI>
      </UL>
      <H3 id="key-metrics-to-track">Key Metrics to Track</H3>
      <UL>
        <LI>[ ] Organic traffic (month over month)</LI>
        <LI>[ ] Keyword rankings for target terms</LI>
        <LI>[ ] Click-through rate from search results</LI>
        <LI>[ ] Conversions from organic traffic</LI>
        <LI>[ ] Page speed scores</LI>
      </UL>
      <H2 id="priority-order">Priority Order</H2>
      <P>If you're just starting, focus on these areas first:</P>
      <UL>
        <LI>Technical foundation (speed, mobile, security)</LI>
        <LI>Google Business Profile (for local businesses)</LI>
        <LI>On-page optimization for key service pages</LI>
        <LI>Content creation for target keywords</LI>
        <LI>Link building for authority</LI>
      </UL>
      <H2 id="need-help-with-seo">Need Help With SEO?</H2>
      <P>This checklist gives you a roadmap, but SEO takes consistent effort over time. If you'd rather focus on running your business while experts handle your SEO, <Link href="/contact">{"contact us"}</Link> to learn about our <Link href="/services/seo">{"SEO services"}</Link>.</P>

      <TopicLinks
        title="More Small Business SEO Resources"
        links={[
          { href: "/blog/seo/seo-for-small-business", label: "SEO for Small Business: The Complete Guide" },
          { href: "/blog/seo/local-seo-checklist-2026", label: "Local SEO Checklist for 2026" },
          { href: "/blog/seo/keyword-research-guide", label: "Keyword Research Guide for Better Rankings" },
          { href: "/tools/seo-checker", label: "Free SEO Checker Tool" },
          { href: "/tools/meta-tag-generator", label: "Meta Tag Generator Tool" },
        ]}
      />
    </article>
  );
}

export default { metadata, Content };
