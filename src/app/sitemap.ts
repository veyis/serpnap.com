import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { getAllPosts } from "@/lib/blog";
import { getAllDocPaths } from "@/lib/docs/loader";
import { getAllGlossarySlugs } from "@/lib/glossary";

const TOOLS = [
  "seo-checker",
  "technical-audit",
  "neural-audit",
  "meta-tag-generator",
  "schema-generator",
  "sitemap-validator",
  "headline-analyzer",
  "keyword-density-checker",
  "page-speed-estimator",
  "redirect-checker",
  "robots-txt-generator",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.appUrl;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2026-03-05",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: "2026-03-05",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: "2026-03-05",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/seo`,
      lastModified: "2026-03-05",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-03-05",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: "2026-03-05",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: "2026-03-05",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const { posts } = getAllPosts({ limit: 500 });
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Docs pages
  let docPages: MetadataRoute.Sitemap = [];
  try {
    const docPaths = await getAllDocPaths();
    docPages = docPaths.map((docPath) => ({
      url: `${baseUrl}/docs/${docPath}`,
      lastModified: "2026-03-05",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Docs may not be available during build
  }

  // Glossary pages
  const glossarySlugs = getAllGlossarySlugs();
  const glossaryIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/glossary`,
      lastModified: "2026-03-05",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
  const glossaryPages: MetadataRoute.Sitemap = glossarySlugs.map((slug) => ({
    url: `${baseUrl}/glossary/${slug}`,
    lastModified: "2026-03-05",
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...toolPages, ...blogPages, ...docPages, ...glossaryIndex, ...glossaryPages];
}
