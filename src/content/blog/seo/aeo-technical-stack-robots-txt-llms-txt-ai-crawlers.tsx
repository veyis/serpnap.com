/**
 * Blog Post: The Complete AEO Technical Stack — robots.txt, llms.txt & AI Crawler Management for 2026
 * Category: seo
 * Premium technical guide on the infrastructure layer for AI search visibility
 */
import type { BlogPostMetadata, BlogContentProps } from "@/lib/blog/types";
import {
  H2,
  H3,
  H4,
  P,
  UL,
  OL,
  LI,
  Strong,
  Em,
  Link,
  CalloutBox,
  ProTip,
  Code,
  CodeBlock,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  TopicLinks,
} from "@/lib/blog/components/prose-components";
import { KnowledgeSummary } from "@/components/seo/knowledge-summary";
import { FAQSchema } from "@/components/blog/faq-section";

// ============================================================================
// METADATA
// ============================================================================
export const metadata: BlogPostMetadata = {
  slug: "aeo-technical-stack-robots-txt-llms-txt-ai-crawlers",
  title:
    "The Complete AEO Technical Stack: robots.txt, llms.txt & AI Crawler Management for 2026",
  excerpt:
    "Your content strategy means nothing if AI crawlers can't find and understand your pages. This guide covers the complete technical infrastructure for Answer Engine Optimization — from controlling 30+ AI bot user agents in robots.txt to implementing llms.txt and structuring content for machine extraction.",
  category: "seo",
  tags: [
    "AEO",
    "answer engine optimization",
    "robots.txt AI crawlers",
    "llms.txt",
    "AI crawler management",
    "schema markup for AI",
    "technical SEO 2026",
    "AI search infrastructure",
  ],
  author: {
    name: "SerpNap Team",
    role: "SEO Director",
    slug: "serpnap-team",
  },
  publishedAt: "2026-03-10",
  updatedAt: "2026-03-10",
  readingTimeMinutes: 20,
  featured: true,
  relatedSlugs: [
    "geo-content-playbook-data-driven-ai-citations",
    "how-to-optimize-for-ai-search",
    "structured-data-implementation-guide",
    "technical-seo-checklist-2026-complete-guide",
  ],
  seo: {
    metaTitle:
      "AEO Technical Stack 2026: robots.txt for AI Crawlers + llms.txt + Schema Markup Guide",
    metaDescription:
      "The complete technical guide to Answer Engine Optimization: manage 30+ AI crawler user agents in robots.txt, implement llms.txt for LLM context, and structure schema markup for AI citation. Includes copy-paste code for Next.js, WordPress, and any platform.",
  },
};

// ============================================================================
// CONTENT
// ============================================================================
export function Content({ className }: BlogContentProps) {
  return (
    <article className={className}>
      <KnowledgeSummary
        title="The AEO Infrastructure Blueprint"
        summary="Answer Engine Optimization has a content layer (what to write) and a technical infrastructure layer (how to serve it to AI). This guide covers the infrastructure: managing 30+ AI crawler user agents in robots.txt, implementing llms.txt for content discovery, and structuring schema markup for machine extraction. With Gartner forecasting 25% of search traffic shifting to AI by 2026, this infrastructure is no longer optional."
        keyTakeaways={[
          "GPTBot (training) and ChatGPT-User (search) are separate — block one, allow the other.",
          "30+ AI crawler user agents exist across 4 categories: training, search index, user assistant, and autonomous agent.",
          "llms.txt is a curated content map for AI, NOT a replacement for robots.txt — they serve different purposes.",
          "Article schema with dateModified is critical: the vast majority of ChatGPT citations come from recently updated content, typically within the last 10-12 months.",
          "FAQPage schema still helps AI extract Q&A pairs even though Google no longer shows FAQ rich results for most sites.",
          "AI crawlers don't execute JavaScript — server-side rendering is mandatory for AI visibility.",
        ]}
        citation={{
          author: "Gartner",
          source: "Search Volume Forecast, 2024-2028",
        }}
      />

      <P>
        We&apos;ve implemented the AEO technical stack across dozens of
        websites — from SaaS companies to local service businesses — and
        the pattern is consistent: sites that properly configure their AI
        crawler access, provide an <Code>llms.txt</Code>, and implement
        structured schema see measurable increases in AI referral traffic
        within 4-8 weeks. The technical foundation isn&apos;t glamorous, but
        it&apos;s what separates sites that get cited from sites that get
        ignored.
      </P>
      <P>
        This guide covers that technical layer: the 30+ AI bot user agents
        you need to manage in your <Code>robots.txt</Code>, the{" "}
        <Code>llms.txt</Code> specification that gives AI systems a curated
        map of your content, and the schema markup patterns that make your
        pages machine-readable. If the{" "}
        <Link href="/blog/seo/geo-content-playbook-data-driven-ai-citations">
          GEO Content Playbook
        </Link>{" "}
        is <Em>what to write</Em>, this guide is{" "}
        <Em>how to serve it to AI</Em>.
      </P>

      {/* ================================================================== */}
      <H2 id="what-is-aeo">
        What Is Answer Engine Optimization (AEO)?
      </H2>
      <P>
        Answer Engine Optimization (AEO) is the technical infrastructure layer that enables AI answer engines — ChatGPT, Perplexity, Google AI Overviews, Gemini, and Claude — to discover, crawl, parse, and cite your content. It covers robots.txt AI crawler rules, llms.txt content maps, schema markup, and server-side rendering. With Gartner projecting 25% of search traffic shifting to AI by end of 2026, AEO is now a critical infrastructure investment.
      </P>
      <P>
        AEO sits at the intersection of three concerns: <Strong>access
        control</Strong> (which AI bots can crawl your site),{" "}
        <Strong>content discovery</Strong> (how AI systems find your most
        important pages), and <Strong>content structure</Strong> (how your
        information is formatted for machine extraction). Each of these maps to
        a specific technical implementation: <Code>robots.txt</Code>,{" "}
        <Code>llms.txt</Code>, and schema markup, respectively.
      </P>

      {/* ================================================================== */}
      <H2 id="ai-crawler-taxonomy">
        Understanding AI Crawlers: The Complete 2026 Taxonomy
      </H2>
      <P>
        There are now over 30 distinct AI crawler user agents active on the
        web. Understanding the difference between them is essential for making
        the right access control decisions, because blocking the wrong bot can
        either give away your training data for free or cut off your AI search
        visibility entirely.
      </P>

      <H3 id="training-scrapers">Category 1: AI Training Scrapers</H3>
      <P>
        Training scrapers collect web content to build and refine AI language
        models. Allowing these bots means your content may be used to train
        future models. Blocking them does <Strong>not</Strong> affect whether
        AI search products cite you — that&apos;s handled by separate crawler
        user agents.
      </P>
      <Table>
        <THead><TR><TH>User Agent</TH><TH>Company</TH><TH>Purpose</TH></TR></THead>
        <TBody>
          <TR><TD>GPTBot</TD><TD>OpenAI</TD><TD>Model training data collection</TD></TR>
          <TR><TD>ClaudeBot</TD><TD>Anthropic</TD><TD>Training data for Claude models</TD></TR>
          <TR><TD>Google-Extended</TD><TD>Google</TD><TD>Gemini/Vertex AI training</TD></TR>
          <TR><TD>Applebot-Extended</TD><TD>Apple</TD><TD>Foundation LLM development</TD></TR>
          <TR><TD>Bytespider</TD><TD>ByteDance</TD><TD>TikTok/Doubao LLM training</TD></TR>
          <TR><TD>CCBot</TD><TD>Common Crawl</TD><TD>Open web data repository</TD></TR>
          <TR><TD>meta-externalagent</TD><TD>Meta</TD><TD>Llama model training</TD></TR>
          <TR><TD>cohere-training-data-crawler</TD><TD>Cohere</TD><TD>Enterprise AI training</TD></TR>
          <TR><TD>Diffbot</TD><TD>Diffbot</TD><TD>Structured data for AI</TD></TR>
          <TR><TD>FacebookBot</TD><TD>Meta</TD><TD>Speech recognition training</TD></TR>
          <TR><TD>PanguBot</TD><TD>Huawei</TD><TD>Multimodal LLM training</TD></TR>
          <TR><TD>ChatGLM-Spider</TD><TD>Zhipu AI</TD><TD>Chinese LLM training</TD></TR>
          <TR><TD>omgili</TD><TD>Webz.io</TD><TD>Crawl data sold for AI</TD></TR>
          <TR><TD>webzio-extended</TD><TD>Webz.io</TD><TD>Extended crawl for models</TD></TR>
          <TR><TD>FirecrawlAgent</TD><TD>Firecrawl</TD><TD>Web-to-LLM conversion</TD></TR>
        </TBody>
      </Table>

      <H3 id="search-crawlers">Category 2: AI Search Index Crawlers</H3>
      <P>
        Search index crawlers build the knowledge base that AI search products
        use to answer user queries. <Strong>These are the bots you want to
        allow</Strong> — they drive your AI search visibility. Blocking them
        is equivalent to blocking Googlebot for traditional search.
      </P>
      <Table>
        <THead><TR><TH>User Agent</TH><TH>Company</TH><TH>Product</TH></TR></THead>
        <TBody>
          <TR><TD>OAI-SearchBot</TD><TD>OpenAI</TD><TD>SearchGPT / ChatGPT search</TD></TR>
          <TR><TD>Claude-SearchBot</TD><TD>Anthropic</TD><TD>Claude search feature</TD></TR>
          <TR><TD>PerplexityBot</TD><TD>Perplexity</TD><TD>Perplexity answer engine</TD></TR>
          <TR><TD>Bravebot</TD><TD>Brave</TD><TD>Brave Search AI answers</TD></TR>
          <TR><TD>YouBot</TD><TD>You.com</TD><TD>You.com AI search</TD></TR>
          <TR><TD>ExaBot</TD><TD>Exa</TD><TD>Semantic search</TD></TR>
          <TR><TD>Amzn-SearchBot</TD><TD>Amazon</TD><TD>Alexa AI search</TD></TR>
          <TR><TD>AzureAI-SearchBot</TD><TD>Microsoft</TD><TD>Azure AI search</TD></TR>
          <TR><TD>meta-webindexer</TD><TD>Meta</TD><TD>Meta AI search</TD></TR>
          <TR><TD>Google-CloudVertexBot</TD><TD>Google</TD><TD>Vertex AI Search</TD></TR>
          <TR><TD>PetalBot</TD><TD>Huawei</TD><TD>Petal Search</TD></TR>
          <TR><TD>LinkupBot</TD><TD>Linkup</TD><TD>Enterprise AI search</TD></TR>
          <TR><TD>Cloudflare-AutoRAG</TD><TD>Cloudflare</TD><TD>RAG service indexing</TD></TR>
        </TBody>
      </Table>

      <H3 id="user-assistants">Category 3: AI User Assistants</H3>
      <P>
        User assistant bots fetch content in real-time when a user asks an
        AI assistant a question. These are <Strong>user-initiated</Strong>{" "}
        — a human is actively requesting information. Blocking these bots
        prevents your content from appearing when someone directly asks an
        AI about topics you cover.
      </P>
      <Table>
        <THead><TR><TH>User Agent</TH><TH>Company</TH><TH>Context</TH></TR></THead>
        <TBody>
          <TR><TD>ChatGPT-User</TD><TD>OpenAI</TD><TD>Real-time browsing in ChatGPT</TD></TR>
          <TR><TD>Claude-User</TD><TD>Anthropic</TD><TD>Claude browsing for users</TD></TR>
          <TR><TD>Gemini-Deep-Research</TD><TD>Google</TD><TD>Gemini research feature</TD></TR>
          <TR><TD>Perplexity-User</TD><TD>Perplexity</TD><TD>User query responses</TD></TR>
          <TR><TD>MistralAI-User</TD><TD>Mistral</TD><TD>Mistral browsing</TD></TR>
          <TR><TD>Amzn-User</TD><TD>Amazon</TD><TD>Alexa information retrieval</TD></TR>
          <TR><TD>DuckAssistBot</TD><TD>DuckDuckGo</TD><TD>AI-assisted answers</TD></TR>
          <TR><TD>PhindBot</TD><TD>Phind</TD><TD>Developer answer engine</TD></TR>
          <TR><TD>kagi-fetcher</TD><TD>Kagi</TD><TD>Kagi AI assistant</TD></TR>
        </TBody>
      </Table>

      <H3 id="ai-agents">Category 4: AI Agents (Autonomous)</H3>
      <P>
        AI agents are autonomous bots that perform multi-step tasks on behalf
        of users. These are the newest category and the most unpredictable —
        they navigate websites, fill forms, and interact with content
        autonomously.
      </P>
      <Table>
        <THead><TR><TH>User Agent</TH><TH>Company</TH><TH>Purpose</TH></TR></THead>
        <TBody>
          <TR><TD>ChatGPT Agent</TD><TD>OpenAI</TD><TD>Autonomous task completion</TD></TR>
          <TR><TD>GoogleAgent-Mariner</TD><TD>Google</TD><TD>Browser-based interaction</TD></TR>
          <TR><TD>NovaAct</TD><TD>Amazon</TD><TD>Multi-step task agent</TD></TR>
          <TR><TD>Manus-User</TD><TD>Butterfly Effect</TD><TD>Autonomous navigation</TD></TR>
          <TR><TD>Devin</TD><TD>Cognition AI</TD><TD>Software engineering agent</TD></TR>
        </TBody>
      </Table>

      <ProTip>
        The critical distinction most people miss:{" "}
        <Code>GPTBot</Code> (training scraper) and{" "}
        <Code>ChatGPT-User</Code> (user assistant) are{" "}
        <Strong>completely separate</Strong> user agents. Blocking{" "}
        <Code>GPTBot</Code> prevents your content from being used for
        OpenAI&apos;s model training, but does <Em>not</Em> prevent
        ChatGPT from citing you when a user asks a question. Same for{" "}
        <Code>ClaudeBot</Code> vs. <Code>Claude-User</Code>. This
        distinction is the foundation of a smart AI crawler strategy.
      </ProTip>

      {/* ================================================================== */}
      <H2 id="robots-txt-strategy">
        The robots.txt Strategy for the AI Era
      </H2>
      <P>
        A modern robots.txt strategy follows one core principle: allow AI
        search and user-initiated bots (they drive visibility) while blocking
        pure training scrapers (they consume your content without driving
        traffic). This approach maximizes your AI search presence — which is
        fundamentally different from{" "}
        <Link href="/blog/seo/geo-vs-traditional-seo">
          traditional SEO optimization
        </Link>
        {" "}— while protecting your content from being used as training data
        without compensation.
      </P>

      <H3 id="recommended-robots-txt">Recommended robots.txt Configuration</H3>
      <P>
        Here is the complete, production-ready robots.txt configuration for
        2026. You can also use our{" "}
        <Link href="/tools/robots-txt-generator">
          free robots.txt generator
        </Link>{" "}
        to create a customized version for your site. Copy and adapt for your domain:
      </P>

      <CodeBlock language="txt">{`# ============================================
# robots.txt — AI Crawler Policy (2026)
# ============================================

# === Standard Search Engines (ALLOW) ===
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

# === AI SEARCH CRAWLERS (ALLOW — drives visibility) ===
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bravebot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Amzn-SearchBot
Allow: /

User-agent: AzureAI-SearchBot
Allow: /

User-agent: meta-webindexer
Allow: /

User-agent: Google-CloudVertexBot
Allow: /

# === AI USER ASSISTANTS (ALLOW — user-initiated) ===
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Gemini-Deep-Research
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: MistralAI-User
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: PhindBot
Allow: /

User-agent: Amzn-User
Allow: /

# === AI TRAINING SCRAPERS (BLOCK) ===
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: cohere-training-data-crawler
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: PanguBot
Disallow: /

User-agent: ChatGLM-Spider
Disallow: /

User-agent: omgili
Disallow: /

User-agent: webzio-extended
Disallow: /

User-agent: FirecrawlAgent
Disallow: /

User-agent: FacebookBot
Disallow: /

# === AI AGENTS (BLOCK by default) ===
User-agent: NovaAct
Disallow: /

User-agent: Manus-User
Disallow: /

# === ARCHIVE (ALLOW) ===
User-agent: archive.org_bot
Allow: /

# === DEFAULT ===
User-agent: *
Allow: /

Sitemap: https://yoursite.com/sitemap.xml`}</CodeBlock>

      <CalloutBox variant="warning" title="Important: robots.txt Is Voluntary">
        <P>
          The robots.txt standard is a <Strong>voluntary protocol</Strong>.
          Reputable crawlers from major companies (Google, OpenAI, Anthropic,
          Perplexity) respect it. But not all bots do. For critical content
          protection, combine robots.txt with server-side user agent filtering.
          That said, for most websites, robots.txt is sufficient for managing
          legitimate AI crawlers.
        </P>
      </CalloutBox>

      <H3 id="alternative-strategies">Alternative Strategies</H3>
      <P>
        The configuration above follows the &quot;protect training data, allow
        search visibility&quot; approach. But there are legitimate reasons to
        choose different strategies:
      </P>
      <UL>
        <LI>
          <Strong>Maximum visibility (allow everything)</Strong> — If you want
          your content to influence AI model training (building long-term brand
          presence in the models themselves), allow all crawlers including
          training scrapers. This is a valid strategy for brands that want to
          be &quot;baked into&quot; future AI knowledge.
        </LI>
        <LI>
          <Strong>Maximum protection (block everything except standard
          search)</Strong> — For publishers concerned about AI using their
          content without licensing. Major publishers like NYT, WSJ, and
          Reuters have taken this approach. Note: this significantly reduces
          AI search visibility.
        </LI>
        <LI>
          <Strong>Selective content exposure</Strong> — Allow AI crawlers on
          marketing pages and blog content but block premium/gated content.
          Use <Code>Disallow: /premium/</Code> paths for content you want
          to protect.
        </LI>
      </UL>

      <H3 id="nextjs-robots">Next.js robots.ts Implementation</H3>
      <P>
        For Next.js applications, implement robots.txt as a TypeScript route
        handler:
      </P>
      <CodeBlock language="typescript">{`// src/app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engines
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },

      // AI search crawlers (ALLOW)
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Bravebot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Gemini-Deep-Research", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },

      // AI training scrapers (BLOCK)
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "meta-externalagent", disallow: "/" },

      // Default
      { userAgent: "*", allow: "/" },
    ],
    sitemap: \`\${BASE_URL}/sitemap.xml\`,
  };
}`}</CodeBlock>

      <H3 id="wordpress-robots">WordPress robots.txt Setup</H3>
      <P>
        In WordPress, manage robots.txt through your SEO plugin or by creating
        a physical file:
      </P>
      <UL>
        <LI>
          <Strong>Yoast SEO</Strong> — Go to Yoast SEO → Tools → File
          editor. Paste the robots.txt content from the template above.
        </LI>
        <LI>
          <Strong>Rank Math</Strong> — Go to Rank Math → General Settings →
          Edit robots.txt.
        </LI>
        <LI>
          <Strong>Manual file</Strong> — Create a physical{" "}
          <Code>robots.txt</Code> file in your WordPress root directory
          (typically <Code>/var/www/html/robots.txt</Code> or{" "}
          <Code>/public_html/robots.txt</Code>).
        </LI>
      </UL>

      {/* ================================================================== */}
      <H2 id="llms-txt-implementation">
        llms.txt: The Treasure Map for AI Systems
      </H2>
      <P>
        The <Code>llms.txt</Code> file is a Markdown file served at your
        domain root (<Code>https://yoursite.com/llms.txt</Code>) that provides
        LLM-friendly documentation about your site. While{" "}
        <Code>robots.txt</Code> controls <Em>access</Em> (what bots can
        crawl), <Code>llms.txt</Code> controls <Em>understanding</Em> (what
        your site is about and where to find key content). Think of it as a
        curated table of contents designed specifically for AI context windows.
      </P>

      <H3 id="llms-txt-vs-robots">llms.txt vs. robots.txt: Different Jobs</H3>
      <P>
        A common misconception is that <Code>llms.txt</Code> is
        &quot;robots.txt for AI.&quot; They serve fundamentally different
        purposes:
      </P>
      <Table>
        <THead><TR><TH>Aspect</TH><TH>robots.txt</TH><TH>llms.txt</TH></TR></THead>
        <TBody>
          <TR><TD>Purpose</TD><TD>Access control</TD><TD>Content discovery and curation</TD></TR>
          <TR><TD>Format</TD><TD>Custom syntax</TD><TD>Markdown</TD></TR>
          <TR><TD>Controls</TD><TD>Which bots can crawl which paths</TD><TD>What content is most important</TD></TR>
          <TR><TD>Analogy</TD><TD>A security gate</TD><TD>A treasure map</TD></TR>
          <TR><TD>Adoption</TD><TD>Universal (1994 standard)</TD><TD>Emerging (2024+)</TD></TR>
          <TR><TD>Enforcement</TD><TD>Voluntary but widely respected</TD><TD>Optional, no enforcement</TD></TR>
        </TBody>
      </Table>
      <P>
        Google&apos;s Gary Illyes has compared <Code>llms.txt</Code> to the
        keywords meta tag — implying limited direct search impact. However,
        the SEO community&apos;s consensus is more nuanced: while Google may
        not directly use <Code>llms.txt</Code>, AI systems with smaller
        context windows (like API-based RAG applications) benefit
        significantly from a curated content index. And as more AI systems
        adopt it, early implementation builds a competitive advantage.
      </P>

      <H3 id="llms-txt-format">The llms.txt File Format</H3>
      <P>
        The specification (from llmstxt.org) defines a simple Markdown
        structure:
      </P>
      <CodeBlock language="markdown">{`# Your Company Name

> Brief one-line description of what your company does.

Additional context about your company, expertise, and what
makes your content authoritative. This section can include
paragraphs and lists but NO headings.

## Core Pages

- [About Us](https://yoursite.com/about): Company background and team
- [Services](https://yoursite.com/services): What we offer
- [Pricing](https://yoursite.com/pricing): Plans and pricing

## Documentation

- [Getting Started](https://yoursite.com/docs/start): Step-by-step guide
- [API Reference](https://yoursite.com/docs/api): API documentation
- [Glossary](https://yoursite.com/glossary): Key term definitions

## Blog

- [AI Implementation Guide](https://yoursite.com/blog/ai-guide): Complete guide
- [Case Studies](https://yoursite.com/case-studies): Client results

## Optional

- [Press Kit](https://yoursite.com/press): Brand assets
- [Careers](https://yoursite.com/careers): Open positions`}</CodeBlock>

      <H3 id="llms-txt-rules">Key Rules for llms.txt</H3>
      <OL>
        <LI>
          <Strong>H1 title (required)</Strong> — your site or company name
          only. Nothing else in the H1.
        </LI>
        <LI>
          <Strong>Blockquote (optional but recommended)</Strong> — a
          single-line summary of what your company does and its core value
          proposition.
        </LI>
        <LI>
          <Strong>Body text (optional)</Strong> — additional context with
          paragraphs and lists, but <Strong>no headings</Strong> in this
          section.
        </LI>
        <LI>
          <Strong>H2 sections (optional)</Strong> — organize your links into
          logical categories.
        </LI>
        <LI>
          <Strong>Link format</Strong> —{" "}
          <Code>- [Page Name](URL): Brief description</Code>
        </LI>
        <LI>
          <Strong>&quot;Optional&quot; section</Strong> — AI systems can skip
          this section when working with limited context, so put
          non-essential pages here.
        </LI>
      </OL>

      <H3 id="llms-txt-best-practices">Best Practices for Effective llms.txt</H3>
      <UL>
        <LI>
          <Strong>Curate ruthlessly</Strong> — don&apos;t list every page.
          Include your 20-30 most important and authoritative pages. Quality
          over quantity.
        </LI>
        <LI>
          <Strong>Lead with your strongest content</Strong> — put your most
          cited, most comprehensive pages in the first section after the
          header.
        </LI>
        <LI>
          <Strong>Use descriptive link text</Strong> — the link text should
          tell the AI what the page is about. &quot;Complete Guide to X&quot;
          is better than &quot;Learn More.&quot;
        </LI>
        <LI>
          <Strong>Include your glossary and FAQ pages</Strong> — these are
          the highest-value pages for AI citation. Always include them.
        </LI>
        <LI>
          <Strong>Update regularly</Strong> — when you publish significant
          new content, add it to your llms.txt. Remove pages that are
          outdated.
        </LI>
        <LI>
          <Strong>Consider a companion llms-full.txt</Strong> — for larger
          sites, provide an expanded version with more pages and fuller
          descriptions.
        </LI>
      </UL>

      <H3 id="llms-txt-nextjs">Next.js llms.txt Implementation</H3>
      <P>
        In Next.js, serve <Code>llms.txt</Code> as a route handler or as a
        static file in the <Code>public</Code> directory:
      </P>

      <H4>Option 1: Static file (simplest)</H4>
      <P>
        Create <Code>public/llms.txt</Code> with your Markdown content. It
        will be served at <Code>https://yoursite.com/llms.txt</Code>
        automatically.
      </P>

      <H4>Option 2: Dynamic route handler</H4>
      <CodeBlock language="typescript">{`// src/app/llms.txt/route.ts
const BASE = "https://yoursite.com";

export function GET() {
  const content = \`# Your Company Name

> One-line description of what your company does.

We specialize in [expertise] and have served [audience]
since [year].

## Core Pages

- [About Us](\${BASE}/about): Our team, mission, and credentials
- [Services](\${BASE}/services): Complete service offerings
- [Blog](\${BASE}/blog): Industry insights and guides
- [Glossary](\${BASE}/glossary): Key term definitions
- [Tools](\${BASE}/tools): Free tools and resources

## Top Resources

- [SEO Guide](\${BASE}/blog/seo/guide): Complete guide
- [AI Search Guide](\${BASE}/blog/seo/ai-search): AI optimization
\`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}`}</CodeBlock>

      <H3 id="llms-txt-wordpress">WordPress llms.txt Setup</H3>
      <P>
        For WordPress, create a physical file at your site root:
      </P>
      <CodeBlock language="bash">{`# SSH into your server
nano /var/www/html/llms.txt

# Or upload via FTP to your root directory
# The file should be accessible at: yoursite.com/llms.txt`}</CodeBlock>
      <P>
        If your WordPress installation uses <Code>.htaccess</Code> rewrites
        that interfere with static file serving, add this rule before the
        WordPress rewrite block:
      </P>
      <CodeBlock language="apache">{`# Serve llms.txt directly
RewriteRule ^llms\\.txt$ - [L]
RewriteRule ^llms-full\\.txt$ - [L]`}</CodeBlock>

      {/* ================================================================== */}
      <H2 id="schema-markup-for-ai">
        Schema Markup That Maximizes AI Extraction
      </H2>
      <P>
        Schema.org structured data gives AI systems machine-readable context
        about your content that goes beyond what they can infer from the HTML
        alone. The Princeton GEO study (arXiv:2311.09735) found that citing
        sources improved AI visibility by 27.8% — and schema markup is the
        machine-readable equivalent of citing sources. It tells AI systems exactly what your
        content is, who wrote it, when it was published, and why it&apos;s
        authoritative.
      </P>

      <P>
        If you need to generate JSON-LD schema quickly, our{" "}
        <Link href="/tools/schema-generator">free schema generator</Link>{" "}
        creates valid LocalBusiness and FAQPage markup you can paste directly
        into your page. For a deeper dive on all schema types, see our{" "}
        <Link href="/blog/seo/how-to-add-schema-markup">
          complete schema markup guide
        </Link>
        .
      </P>

      <H3 id="critical-schema-types">The Schema Priority Matrix for AEO</H3>
      <Table>
        <THead><TR><TH>Schema Type</TH><TH>Where to Place</TH><TH>Priority</TH><TH>AEO Impact</TH></TR></THead>
        <TBody>
          <TR><TD>Organization</TD><TD>Homepage</TD><TD>Critical</TD><TD>Establishes entity in AI knowledge graphs</TD></TR>
          <TR><TD>WebSite</TD><TD>Homepage</TD><TD>Critical</TD><TD>Site identity for AI systems</TD></TR>
          <TR><TD>Article + Person</TD><TD>Every blog post</TD><TD>Critical</TD><TD>Author E-E-A-T for citation confidence</TD></TR>
          <TR><TD>BreadcrumbList</TD><TD>Every page</TD><TD>High</TD><TD>Content hierarchy for AI understanding</TD></TR>
          <TR><TD>FAQPage</TD><TD>Pages with FAQ sections</TD><TD>High</TD><TD>Directly extractable Q&A pairs</TD></TR>
          <TR><TD>HowTo</TD><TD>Tutorial/guide pages</TD><TD>High</TD><TD>Step-by-step extraction for AI</TD></TR>
          <TR><TD>Speakable</TD><TD>Key articles</TD><TD>Medium</TD><TD>Voice search and AI assistant extraction</TD></TR>
          <TR><TD>DefinedTerm</TD><TD>Glossary pages</TD><TD>Medium</TD><TD>Definition extraction for AI</TD></TR>
          <TR><TD>Dataset</TD><TD>Research/data pages</TD><TD>Medium</TD><TD>Original data discovery</TD></TR>
        </TBody>
      </Table>

      <H3 id="article-schema">Article Schema with Author E-E-A-T</H3>
      <P>
        Article schema is the most important schema type for content sites.
        AI systems use it to verify author credentials, check publication
        dates, and assess content authority. The <Code>dateModified</Code>{" "}
        field is especially critical — analysis suggests that the vast
        majority of ChatGPT citations come from recently updated content
        (typically within the last 10-12 months), and pages with clear
        timestamps appear to receive significantly more citations than
        undated pages.
      </P>
      <CodeBlock language="json">{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Headline (Max 110 Characters)",
  "description": "150-160 character description as the answer capsule.",
  "datePublished": "2026-03-10T08:00:00+00:00",
  "dateModified": "2026-03-10T12:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://yoursite.com/authors/author-name",
    "jobTitle": "Senior SEO Strategist",
    "worksFor": {
      "@type": "Organization",
      "name": "Your Company"
    },
    "sameAs": [
      "https://linkedin.com/in/authorname",
      "https://twitter.com/authorname"
    ],
    "knowsAbout": ["SEO", "AI Search", "Content Strategy"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Company",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/logo.png"
    }
  },
  "isAccessibleForFree": true,
  "inLanguage": "en-US"
}`}</CodeBlock>

      <H3 id="faqpage-schema">FAQPage Schema for AI Q&A Extraction</H3>
      <P>
        Google now limits FAQ rich results to government and health authority
        sites. However, FAQPage schema still helps AI systems extract Q&A
        pairs, making it valuable for AEO even without the visual rich result
        in Google Search. Every page with a FAQ section should have matching
        FAQPage schema.
      </P>
      <CodeBlock language="json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is answer engine optimization?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer engine optimization (AEO) is the practice of structuring website content and technical infrastructure so AI-powered answer engines can discover, parse, and cite your content. It covers robots.txt configuration for AI crawlers, llms.txt implementation, schema markup, and content formatting for machine extraction."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need both robots.txt and llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — they serve different purposes. robots.txt controls which AI bots can access your site (access control). llms.txt tells AI systems what your most important content is and where to find it (content discovery). Using both together gives AI systems both the permission and the guidance to cite your content effectively."
      }
    }
  ]
}`}</CodeBlock>

      <H3 id="speakable-schema">Speakable Schema for Voice + AI Assistants</H3>
      <P>
        Speakable markup identifies content optimized for text-to-speech and
        AI assistant extraction. It tells AI systems which paragraphs on your
        page contain the most important, quotable information.
      </P>
      <CodeBlock language="json">{`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [
      ".article-headline",
      ".article-summary",
      ".key-takeaway"
    ]
  }
}`}</CodeBlock>
      <P>
        <Strong>Speakable rules:</Strong> Target 2-3 sentences per speakable
        section (~20-30 seconds of audio). Mark headlines and summaries, not
        captions. Rewrite marked content to read clearly aloud. Use{" "}
        <Code>cssSelector</Code> over <Code>xPath</Code> for easier
        maintenance. For a full guide, check our{" "}
        <Link href="/blog/seo/structured-data-implementation-guide">
          structured data implementation guide
        </Link>
        .
      </P>

      <H3 id="organization-schema">Organization Schema: Establishing Your Entity</H3>
      <P>
        Every site needs Organization schema on the homepage. It establishes
        your entity in AI knowledge graphs and provides the cross-reference
        points (via <Code>sameAs</Code>) that AI systems use to verify your
        identity — this is foundational for{" "}
        <Link href="/blog/seo/ai-citations-optimization-guide">
          getting cited by AI answer engines
        </Link>
        . Critical properties for AI citation:
      </P>
      <UL>
        <LI>
          <Strong>sameAs</Strong> — links to Wikipedia, Wikidata, Crunchbase,
          LinkedIn, and social profiles. This is how AI systems verify your
          entity across platforms.
        </LI>
        <LI>
          <Strong>knowsAbout</Strong> — explicitly declares your expertise
          areas so AI systems know what topics you&apos;re authoritative on.
        </LI>
        <LI>
          <Strong>publishingPrinciples</Strong> — links to your editorial
          policy page, signaling editorial standards to AI quality assessors.
        </LI>
        <LI>
          <Strong>founder + foundingDate</Strong> — verifiable company
          information that builds entity confidence.
        </LI>
      </UL>

      {/* ================================================================== */}
      <H2 id="content-structure-for-extraction">
        Content Structure Patterns for AI Extraction
      </H2>
      <P>
        Beyond schema markup, the HTML structure of your content determines
        how effectively AI systems can extract and cite specific information.
        Content structure for AI extraction follows three principles: clear
        heading hierarchy, self-contained sections, and machine-parseable data
        formats. Each principle maps to specific HTML patterns that you can
        implement today.
      </P>

      <H3 id="heading-hierarchy">Heading Hierarchy Rules</H3>
      <UL>
        <LI>
          <Strong>One H1 per page</Strong> — the page title, matching or
          closely related to the <Code>headline</Code> in your Article schema.
        </LI>
        <LI>
          <Strong>H2 for major sections</Strong> — each H2 should be
          phrased as or closely match a search query. &quot;What is
          answer engine optimization?&quot; is better than &quot;Overview.&quot;
        </LI>
        <LI>
          <Strong>H3 for subsections</Strong> — break detailed sections into
          scannable subsections.
        </LI>
        <LI>
          <Strong>Never skip levels</Strong> — don&apos;t jump from H2 to
          H4. AI systems use heading hierarchy to understand content
          relationships.
        </LI>
      </UL>

      <H3 id="answer-blocks">Answer Blocks After Every H2</H3>
      <P>
        Place a 40-60 word direct answer immediately after every H2 heading.
        This is the highest-impact structural change you can make for AI
        extraction. The answer block should be self-contained — AI systems
        should be able to extract just that paragraph as a complete, accurate
        answer. For detailed patterns and examples, see our{" "}
        <Link href="/blog/seo/geo-content-playbook-data-driven-ai-citations">
          GEO Content Playbook
        </Link>
        .
      </P>

      <H3 id="table-formatting">Table Formatting for AI Parsing</H3>
      <P>
        AI systems extract tabular data effectively when formatted cleanly.
        Use semantic HTML tables (not CSS grid or flexbox layouts) with clear
        header rows:
      </P>
      <UL>
        <LI>Use clear, descriptive column names in the header row</LI>
        <LI>Keep cell content under 50 characters</LI>
        <LI>Use consistent units within columns</LI>
        <LI>Include a descriptive H3 heading above every table</LI>
        <LI>Avoid merged cells, nested tables, or complex layouts</LI>
      </UL>

      <H3 id="server-side-rendering">Server-Side Rendering for AI Crawlers</H3>
      <P>
        Most AI crawlers do <Strong>not</Strong> execute JavaScript. If your
        content is rendered client-side (React SPA, Vue SPA without SSR),
        it&apos;s invisible to the majority of AI crawlers. Every content
        page must be server-side rendered (SSR) or statically generated (SSG).
      </P>
      <UL>
        <LI>
          <Strong>Next.js</Strong> — use Server Components (default in App
          Router) and <Code>generateStaticParams()</Code> for pre-rendering.
        </LI>
        <LI>
          <Strong>WordPress</Strong> — inherently server-rendered, no
          additional work needed.
        </LI>
        <LI>
          <Strong>Verify</Strong> — test with{" "}
          <Code>curl https://yoursite.com/page</Code> to confirm content
          appears in the raw HTML without JavaScript execution.
        </LI>
      </UL>

      {/* ================================================================== */}
      <H2 id="verifying-ai-crawlers">
        Verifying AI Crawler Activity on Your Site
      </H2>
      <P>
        After implementing your robots.txt and llms.txt, verify that AI
        crawlers are actually visiting your site and accessing the right
        content. Server log analysis is the most reliable method for
        confirming AI crawler activity and identifying which pages they
        prioritize.
      </P>

      <H3 id="server-log-commands">Server Log Analysis Commands</H3>
      <P>
        Run these commands against your server access logs to monitor AI
        crawler activity:
      </P>
      <CodeBlock language="bash">{`# Count total AI crawler hits
grep -E "(GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|Claude-SearchBot|ChatGPT-User)" access.log | wc -l

# See which pages Perplexity is crawling most
grep "PerplexityBot" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# Check if ChatGPT users are browsing your site
grep "ChatGPT-User" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# Monitor which training scrapers are ignoring your robots.txt
grep -E "(GPTBot|ClaudeBot|Bytespider)" access.log | awk '{print $1}' | sort -u | wc -l`}</CodeBlock>

      <H3 id="ga4-referral-tracking">GA4 Referral Traffic Tracking</H3>
      <P>
        In Google Analytics 4, check for AI platform referrals:
      </P>
      <UL>
        <LI>
          <Code>chat.openai.com</Code> — traffic from ChatGPT citations
        </LI>
        <LI>
          <Code>perplexity.ai</Code> — traffic from Perplexity citations
        </LI>
        <LI>
          <Code>gemini.google.com</Code> — traffic from Google Gemini
        </LI>
        <LI>
          <Code>claude.ai</Code> — traffic from Claude citations
        </LI>
      </UL>
      <P>
        Create a custom channel group in GA4 called &quot;AI Search&quot; that
        groups all AI platform referrals together. This gives you a single
        metric for AI-driven traffic that you can trend over time.
      </P>

      {/* ================================================================== */}
      <H2 id="complete-implementation-checklist">
        The Complete AEO Technical Checklist
      </H2>
      <P>
        The full AEO technical stack can be implemented in four weekly phases: robots.txt AI crawler configuration (week 1), llms.txt creation and deployment (week 2), schema markup for Article, FAQ, and Organization types (week 3), and server-side rendering verification with log monitoring (week 4). Complete each phase in order — they build on each other.
      </P>

      <H3 id="phase-1">Phase 1: Access Control (Week 1)</H3>
      <UL>
        <LI>
          Configure <Code>robots.txt</Code> with AI crawler rules (allow
          search bots, block training scrapers)
        </LI>
        <LI>
          Verify <Code>robots.txt</Code> is accessible at{" "}
          <Code>yoursite.com/robots.txt</Code>
        </LI>
        <LI>
          Reference your sitemap in <Code>robots.txt</Code>
        </LI>
        <LI>
          Ensure XML sitemap has accurate <Code>lastmod</Code> dates
        </LI>
        <LI>
          Verify every page has a self-referencing canonical tag
        </LI>
      </UL>

      <H3 id="phase-2">Phase 2: Content Discovery (Week 2)</H3>
      <UL>
        <LI>
          Create <Code>llms.txt</Code> at your domain root with your 20-30
          most important pages
        </LI>
        <LI>
          Optionally create <Code>llms-full.txt</Code> with expanded content
        </LI>
        <LI>
          Add Organization schema on your homepage
        </LI>
        <LI>
          Add WebSite schema on your homepage
        </LI>
        <LI>
          Populate <Code>sameAs</Code> with all your business profiles
        </LI>
      </UL>

      <H3 id="phase-3">Phase 3: Content Structure (Week 3)</H3>
      <UL>
        <LI>
          Add Article + Person schema to every blog post with author
          credentials
        </LI>
        <LI>
          Add BreadcrumbList schema to every page
        </LI>
        <LI>
          Add FAQPage schema to all pages with FAQ sections
        </LI>
        <LI>
          Add HowTo schema to tutorial and guide pages
        </LI>
        <LI>
          Add Speakable markup to your top 5-10 articles
        </LI>
      </UL>

      <H3 id="phase-4">Phase 4: Verification (Week 4)</H3>
      <UL>
        <LI>
          Test all schemas with{" "}
          <Link href="https://search.google.com/test/rich-results">
            Google Rich Results Test
          </Link>
        </LI>
        <LI>
          Validate with{" "}
          <Link href="https://validator.schema.org/">
            Schema.org Validator
          </Link>
        </LI>
        <LI>
          Verify SSR: run <Code>curl</Code> on your key pages to confirm
          content is in the raw HTML
        </LI>
        <LI>
          Check server logs for AI crawler activity
        </LI>
        <LI>
          Set up GA4 custom channel group for AI referral traffic
        </LI>
        <LI>
          Run baseline GEO audit across ChatGPT, Perplexity, and Gemini
        </LI>
      </UL>

      {/* ================================================================== */}
      <FAQSchema
        items={[
          {
            question: "What is Answer Engine Optimization (AEO)?",
            answer:
              "Answer Engine Optimization (AEO) is the practice of configuring your website's technical infrastructure so AI-powered answer engines like ChatGPT, Perplexity, Google AI Overviews, and Claude can discover, crawl, understand, and cite your content. AEO covers three core areas: access control via robots.txt for AI crawlers, content discovery via llms.txt, and content structure via schema markup and HTML formatting patterns.",
          },
          {
            question: "Should I block GPTBot in robots.txt?",
            answer:
              "It depends on your goals. Blocking GPTBot prevents your content from being used to train future OpenAI models, but it does not prevent ChatGPT from citing you. ChatGPT uses ChatGPT-User and OAI-SearchBot for real-time retrieval — those are separate user agents. Most sites benefit from blocking GPTBot (training) while allowing ChatGPT-User and OAI-SearchBot (search visibility).",
          },
          {
            question: "Is llms.txt required for AI search visibility?",
            answer:
              "No — llms.txt is not required, and many AI platforms don't currently read it directly. However, it is increasingly adopted by RAG-based applications, API-connected AI tools, and enterprise AI systems. Implementing it now is a low-effort investment (a single Markdown file) that positions your site ahead of competitors as adoption grows.",
          },
          {
            question: "Does schema markup directly improve AI citations?",
            answer:
              "Schema markup helps AI systems understand your content but doesn't guarantee citations on its own. The primary value is accuracy: Article schema tells AI the publication date, author credentials, and topic. FAQPage schema provides structured Q&A pairs that AI can extract directly. Combined with well-structured content, schema markup significantly increases citation probability.",
          },
          {
            question: "How often should I update my robots.txt and llms.txt?",
            answer:
              "Update robots.txt whenever new AI crawlers emerge — roughly quarterly in the current landscape. Update llms.txt whenever you publish significant new content or restructure your site. A good cadence is monthly for llms.txt updates.",
          },
          {
            question: "Do local businesses need AEO?",
            answer:
              "Yes — and local businesses should take a simpler approach. Allow all AI crawlers (including training scrapers) for maximum visibility. Create a basic llms.txt listing your services, service areas, and contact information. Implement LocalBusiness schema with areaServed and service-specific schemas.",
          },
        ]}
      />

      <H2 id="faq">Frequently Asked Questions</H2>

      <H3 id="faq-what-is-aeo">What is Answer Engine Optimization (AEO)?</H3>
      <P>
        Answer Engine Optimization (AEO) is the practice of configuring your
        website&apos;s technical infrastructure so AI-powered answer engines
        like ChatGPT, Perplexity, Google AI Overviews, and Claude can discover,
        crawl, understand, and cite your content. AEO covers three core areas:
        access control via <Code>robots.txt</Code> for AI crawlers, content
        discovery via <Code>llms.txt</Code>, and content structure via schema
        markup and HTML formatting patterns.
      </P>

      <H3 id="faq-block-gptbot">
        Should I block GPTBot in robots.txt?
      </H3>
      <P>
        It depends on your goals. Blocking <Code>GPTBot</Code> prevents your
        content from being used to train future OpenAI models, but it does{" "}
        <Strong>not</Strong> prevent ChatGPT from citing you. ChatGPT uses{" "}
        <Code>ChatGPT-User</Code> and <Code>OAI-SearchBot</Code> for
        real-time retrieval — those are separate user agents. Most sites
        benefit from blocking <Code>GPTBot</Code> (training) while allowing{" "}
        <Code>ChatGPT-User</Code> and <Code>OAI-SearchBot</Code> (search
        visibility). The same logic applies to <Code>ClaudeBot</Code> vs.{" "}
        <Code>Claude-User</Code>.
      </P>

      <H3 id="faq-llms-txt-required">
        Is llms.txt required for AI search visibility?
      </H3>
      <P>
        No — <Code>llms.txt</Code> is not required, and many AI platforms
        don&apos;t currently read it directly. However, it is increasingly
        adopted by RAG-based applications, API-connected AI tools, and
        enterprise AI systems. Implementing it now is a low-effort investment
        (a single Markdown file) that positions your site ahead of competitors
        as adoption grows. Think of it like implementing schema markup in 2015
        — early movers gained significant advantages.
      </P>

      <H3 id="faq-schema-impact">
        Does schema markup directly improve AI citations?
      </H3>
      <P>
        Schema markup helps AI systems <Strong>understand</Strong> your
        content but doesn&apos;t guarantee citations on its own. The primary
        value is accuracy: Article schema tells AI the publication date,
        author credentials, and topic. FAQPage schema provides structured Q&A
        pairs that AI can extract directly. Organization schema establishes
        your entity in knowledge graphs. Combined with well-structured content,
        schema markup significantly increases citation probability — especially
        for Google AI Overviews, which use the same index as Google Search.
      </P>

      <H3 id="faq-how-often-update">
        How often should I update my robots.txt and llms.txt?
      </H3>
      <P>
        Update <Code>robots.txt</Code> whenever new AI crawlers emerge —
        roughly quarterly in the current landscape. Update{" "}
        <Code>llms.txt</Code> whenever you publish significant new content or
        restructure your site. A good cadence is monthly for{" "}
        <Code>llms.txt</Code> updates. For the latest AI crawler user agent
        list, monitor the{" "}
        <Link href="https://github.com/ai-robots-txt/ai.robots.txt">
          ai-robots-txt
        </Link>{" "}
        GitHub repository which tracks new crawler additions.
      </P>

      <H3 id="faq-local-business">
        Do local businesses need AEO?
      </H3>
      <P>
        Yes — and local businesses should take a simpler approach. Allow{" "}
        <Strong>all</Strong> AI crawlers (including training scrapers) for
        maximum visibility. Create a basic <Code>llms.txt</Code> listing
        your services, service areas, and contact information. Implement
        LocalBusiness schema with <Code>areaServed</Code> and
        service-specific schemas. For local businesses, the &quot;find a
        plumber near me&quot; query in AI assistants is increasingly where
        customers come from — blocking any AI crawler reduces this
        visibility.
      </P>

      {/* ================================================================== */}
      <H2 id="bottom-line">Putting It All Together</H2>
      <P>
        The AEO technical stack is three layers working together:{" "}
        <Code>robots.txt</Code> controls which AI bots can access your site,{" "}
        <Code>llms.txt</Code> tells them where to find your best content, and
        schema markup helps them understand what they find. Without all three,
        you&apos;re leaving AI visibility on the table.
      </P>
      <P>
        The good news: implementing the complete stack takes 2-4 weeks for most
        sites. The <Code>robots.txt</Code> configuration is a one-time setup
        with quarterly updates. The <Code>llms.txt</Code> file is a single
        Markdown file. Schema markup is a one-time per-template implementation.
        Once these foundations are in place, your content is positioned to earn
        citations from every major AI platform.
      </P>
      <P>
        For the content strategy that sits on top of this technical foundation,
        see our{" "}
        <Link href="/blog/seo/geo-content-playbook-data-driven-ai-citations">
          GEO Content Playbook
        </Link>{" "}
        — the companion guide covering answer capsules, statistics formatting,
        and citation-optimized writing patterns.
      </P>
      <P>
        Need a quick health check? Start with our{" "}
        <Link href="/tools/seo-checker">free SEO checker</Link> to identify
        technical gaps, generate your{" "}
        <Link href="/tools/robots-txt-generator">robots.txt</Link> and{" "}
        <Link href="/tools/schema-generator">schema markup</Link>, then run
        a{" "}
        <Link href="/tools/neural-audit">Neural Audit</Link> to measure your
        current AI search visibility. The full toolkit is free at{" "}
        <Link href="/tools">SerpNap.com/tools</Link>.
      </P>

      {/* ================================================================== */}
      <TopicLinks
        title="Continue Learning"
        links={[
          {
            href: "/blog/seo/geo-content-playbook-data-driven-ai-citations",
            label: "The GEO Content Playbook: Data-Driven Strategies That Earn AI Citations",
          },
          {
            href: "/blog/seo/structured-data-implementation-guide",
            label: "Structured Data Implementation Guide: Schema Markup for SEO",
          },
          {
            href: "/blog/seo/how-to-optimize-for-ai-search",
            label: "How to Optimize for AI Search (GEO): A Step-by-Step Guide",
          },
          {
            href: "/blog/seo/technical-seo-checklist-2026-complete-guide",
            label: "Technical SEO Checklist 2026: The Complete Guide",
          },
          {
            href: "/blog/seo/eeat-complete-guide-2026",
            label: "E-E-A-T Complete Guide: Building Authority for Search and AI",
          },
          {
            href: "/tools/seo-checker",
            label: "Free SEO Checker — Audit Your Site's Technical Health",
          },
        ]}
      />
    </article>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default { metadata, Content };
