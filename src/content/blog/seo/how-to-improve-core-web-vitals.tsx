/**
 * Blog Post: How to Improve Core Web Vitals
 * Category: seo
 * Targets "core web vitals", "how to improve core web vitals", "page speed seo"
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
  slug: "how-to-improve-core-web-vitals",
  title: "How to Improve Core Web Vitals in 2026 (LCP, CLS, INP Fixes)",
  excerpt: "Your Core Web Vitals are killing your rankings? Fix LCP, CLS, and INP with these proven optimization techniques. Free speed testing included.",
  category: "seo",
  tags: [
    "core web vitals",
    "how to improve core web vitals",
    "page speed",
    "lcp optimization",
    "cls fix",
    "inp optimization",
    "website speed",
    "page speed seo",
  ],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2026-03-05",
  readingTimeMinutes: 14,
  featured: false,
  relatedSlugs: [
    "technical-seo-audit",
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
      <P>Core Web Vitals are Google's way of measuring user experience — and they're a confirmed ranking factor. If your LCP is over 2.5 seconds, your CLS is above 0.1, or your INP exceeds 200ms, you're losing rankings to competitors with faster pages.</P>
      <P>This guide breaks down each Core Web Vital and gives you specific, actionable fixes. Start with the <Link href="/tools/page-speed-estimator">{"Page Speed Estimator"}</Link> to see where your pages stand, then work through the optimizations below.</P>

      <H2 id="what-are-core-web-vitals">What Are Core Web Vitals?</H2>
      <P>Core Web Vitals are three metrics that measure the real-world user experience of your pages:</P>
      <UL>
        <LI><Strong>LCP (Largest Contentful Paint)</Strong> — Loading speed. How fast does the main content appear? Target: under 2.5 seconds.</LI>
        <LI><Strong>CLS (Cumulative Layout Shift)</Strong> — Visual stability. Does content jump around during loading? Target: under 0.1.</LI>
        <LI><Strong>INP (Interaction to Next Paint)</Strong> — Responsiveness. How fast does the page respond to clicks/taps? Target: under 200ms.</LI>
      </UL>
      <P>Google uses field data (real user measurements from Chrome) — not lab tests — for ranking purposes. This means your actual visitors' experience is what matters, not just your Lighthouse score.</P>

      <H2 id="fix-lcp">Fixing LCP (Largest Contentful Paint)</H2>
      <P>LCP measures how long it takes for the largest content element in the viewport to render. This is usually a hero image, a large text block, or a video poster.</P>

      <H3 id="lcp-find-element">1. Identify Your LCP Element</H3>
      <P>Use Chrome DevTools {">"} Performance panel {">"} record a page load {">"} look for the LCP marker. The element highlighted is what you need to optimize.</P>

      <H3 id="lcp-server-response">2. Reduce Server Response Time (TTFB)</H3>
      <UL>
        <LI>Use a CDN (Cloudflare, Vercel, Fastly) to serve content from edge locations</LI>
        <LI>Enable server-side caching and static page generation where possible</LI>
        <LI>Upgrade your hosting if TTFB consistently exceeds 800ms</LI>
        <LI>Use HTTP/2 or HTTP/3 for multiplexed connections</LI>
      </UL>

      <H3 id="lcp-optimize-images">3. Optimize Images</H3>
      <UL>
        <LI>Convert to WebP or AVIF (30-50% smaller than JPEG/PNG)</LI>
        <LI>Use responsive images with srcset and sizes attributes</LI>
        <LI>Preload your LCP image: {"<link rel=\"preload\" as=\"image\" href=\"hero.webp\">"}</LI>
        <LI>Set explicit width and height attributes on all images</LI>
        <LI>Use a modern image CDN for automatic format conversion and resizing</LI>
      </UL>

      <H3 id="lcp-render-blocking">4. Eliminate Render-Blocking Resources</H3>
      <UL>
        <LI>Inline critical CSS (above-the-fold styles) in the {"<head>"}</LI>
        <LI>Defer non-critical CSS with media="print" and onload swap</LI>
        <LI>Add async or defer to non-critical JavaScript</LI>
        <LI>Move third-party scripts below the fold or load them after user interaction</LI>
      </UL>

      <ProTip>
        The single biggest LCP win for most sites: preload your hero image and serve it in WebP/AVIF format. This alone can cut LCP by 1-2 seconds.
      </ProTip>

      <H2 id="fix-cls">Fixing CLS (Cumulative Layout Shift)</H2>
      <P>CLS measures how much visible content shifts unexpectedly. Every time an element moves after initial render without user interaction, it adds to your CLS score.</P>

      <H3 id="cls-images-videos">1. Set Dimensions on Media</H3>
      <UL>
        <LI>Always include width and height attributes on images and videos</LI>
        <LI>Use CSS aspect-ratio for responsive containers</LI>
        <LI>Reserve space for embeds (iframes, YouTube videos) with a container</LI>
      </UL>

      <H3 id="cls-fonts">2. Fix Font Loading</H3>
      <UL>
        <LI>Use font-display: swap to prevent invisible text (FOIT)</LI>
        <LI>Preload your primary web fonts</LI>
        <LI>Use size-adjust in @font-face to match fallback font metrics</LI>
        <LI>Consider using system fonts for body text</LI>
      </UL>

      <H3 id="cls-dynamic-content">3. Handle Dynamic Content</H3>
      <UL>
        <LI>Reserve space for ads with min-height on their containers</LI>
        <LI>Never inject content above existing content (cookie banners, notification bars)</LI>
        <LI>Use transform animations instead of properties that trigger layout (top, left, width, height)</LI>
        <LI>Load third-party widgets (chat, analytics) after the page settles</LI>
      </UL>

      <H2 id="fix-inp">Fixing INP (Interaction to Next Paint)</H2>
      <P>INP replaced FID in March 2024 and is significantly harder to pass. While FID only measured the first interaction, INP measures ALL interactions and reports the worst one.</P>

      <H3 id="inp-long-tasks">1. Break Up Long Tasks</H3>
      <UL>
        <LI>Any JavaScript task over 50ms is a "long task" that blocks the main thread</LI>
        <LI>Use {"requestIdleCallback()"} or {"setTimeout()"} to yield back to the browser</LI>
        <LI>Split large functions into smaller chunks with {"scheduler.yield()"} (where supported)</LI>
        <LI>Move heavy computation to Web Workers</LI>
      </UL>

      <H3 id="inp-reduce-js">2. Reduce JavaScript</H3>
      <UL>
        <LI>Audit your bundle size — remove unused libraries and polyfills</LI>
        <LI>Code-split by route (most frameworks do this automatically)</LI>
        <LI>Lazy-load below-the-fold components</LI>
        <LI>Replace heavy libraries with lighter alternatives (e.g., date-fns instead of moment.js)</LI>
      </UL>

      <H3 id="inp-dom-size">3. Reduce DOM Size</H3>
      <UL>
        <LI>Keep total DOM nodes under 1,500 (Google recommends under 800 for best performance)</LI>
        <LI>Virtualize long lists (react-window, tanstack-virtual)</LI>
        <LI>Remove unnecessary wrapper elements</LI>
        <LI>Use CSS Grid/Flexbox instead of deeply nested layout divs</LI>
      </UL>

      <CalloutBox variant="info" title="INP is the hardest Core Web Vital">
        <P>INP is the metric most sites fail. Unlike LCP (optimize images) and CLS (set dimensions), INP requires architectural changes to how your JavaScript executes. Start with the biggest offenders: analytics scripts, heavy frameworks, and complex event handlers.</P>
      </CalloutBox>

      <H2 id="testing-tools">Testing Your Core Web Vitals</H2>
      <UL>
        <LI><Strong><Link href="/tools/page-speed-estimator">{"SerpNap Page Speed Estimator"}</Link></Strong> — Quick Core Web Vitals estimates and optimization recommendations (free, no signup)</LI>
        <LI><Strong>Google PageSpeed Insights</Strong> — Lab and field data with detailed diagnostics</LI>
        <LI><Strong>Google Search Console</Strong> — Core Web Vitals report showing which URLs pass/fail across your entire site</LI>
        <LI><Strong>Chrome DevTools Performance panel</Strong> — Detailed waterfall analysis for debugging specific issues</LI>
        <LI><Strong>Web Vitals Chrome Extension</Strong> — Real-time CWV metrics as you browse your site</LI>
      </UL>

      <H2 id="prioritize-fixes">Prioritization Framework</H2>
      <P>Focus your optimization efforts in this order for maximum ranking impact:</P>
      <UL>
        <LI><Strong>Step 1:</Strong> Run the <Link href="/tools/page-speed-estimator">{"Page Speed Estimator"}</Link> on your top 10 traffic pages</LI>
        <LI><Strong>Step 2:</Strong> Fix any "Poor" metrics (red) first — these actively hurt rankings</LI>
        <LI><Strong>Step 3:</Strong> Improve "Needs Improvement" metrics (yellow) to "Good" (green)</LI>
        <LI><Strong>Step 4:</Strong> Re-test after each change to measure impact</LI>
        <LI><Strong>Step 5:</Strong> Monitor Search Console's Core Web Vitals report weekly</LI>
      </UL>

      <P>For a complete site health check beyond speed, run the <Link href="/tools/seo-checker">{"SEO Checker"}</Link> to catch technical SEO issues, meta tag problems, and structured data gaps alongside your Core Web Vitals optimization.</P>

      <TopicLinks
        title="Related Resources"
        links={[
          { href: "/tools/page-speed-estimator", label: "Free Page Speed Estimator" },
          { href: "/tools/seo-checker", label: "Free SEO Checker" },
          { href: "/blog/seo/how-to-do-seo-audit", label: "How to Do an SEO Audit" },
          { href: "/blog/seo/technical-seo-audit", label: "Technical SEO Audit Guide" },
          { href: "/glossary/what-is-core-web-vitals", label: "What Are Core Web Vitals?" },
          { href: "/glossary/what-is-lcp", label: "What Is LCP?" },
          { href: "/glossary/what-is-cls", label: "What Is CLS?" },
          { href: "/glossary/what-is-inp", label: "What Is INP?" },
        ]}
      />
    </article>
  );
}
