import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all, block private routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },

      // === Standard Search Engines (ALLOW) ===
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "bingbot", allow: "/" },
      { userAgent: "msnbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },

      // === AI Search Crawlers (ALLOW — drives visibility in AI answers) ===
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Bravebot", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "Amzn-SearchBot", allow: "/" },
      { userAgent: "AzureAI-SearchBot", allow: "/" },
      { userAgent: "meta-webindexer", allow: "/" },
      { userAgent: "Google-CloudVertexBot", allow: "/" },
      { userAgent: "ExaBot", allow: "/" },
      { userAgent: "LinkupBot", allow: "/" },

      // === AI User Assistants (ALLOW — user-initiated browsing) ===
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Gemini-Deep-Research", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "MistralAI-User", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "PhindBot", allow: "/" },
      { userAgent: "Amzn-User", allow: "/" },
      { userAgent: "kagi-fetcher", allow: "/" },

      // === AI Training Scrapers (BLOCK — no visibility benefit) ===
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "Applebot-Extended", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "meta-externalagent", disallow: "/" },
      { userAgent: "cohere-training-data-crawler", disallow: "/" },
      { userAgent: "Diffbot", disallow: "/" },
      { userAgent: "PanguBot", disallow: "/" },
      { userAgent: "ChatGLM-Spider", disallow: "/" },
      { userAgent: "omgili", disallow: "/" },
      { userAgent: "webzio-extended", disallow: "/" },
      { userAgent: "FirecrawlAgent", disallow: "/" },
      { userAgent: "FacebookBot", disallow: "/" },

      // === AI Agents (BLOCK — autonomous bots) ===
      { userAgent: "NovaAct", disallow: "/" },
      { userAgent: "Manus-User", disallow: "/" },

      // === Archive (ALLOW — historical presence) ===
      { userAgent: "archive.org_bot", allow: "/" },
    ],
    sitemap: `${config.appUrl}/sitemap.xml`,
  };
}
