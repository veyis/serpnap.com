import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { getAllPosts } from "@/lib/blog";
import { getAllDocPaths } from "@/lib/docs/loader";
import { getAllGlossarySlugs } from "@/lib/glossary";
import { getAllComparisonSlugs } from "@/lib/data/comparisons";
import { getAllAlternativeSlugs } from "@/lib/data/alternatives";
import { getAllIndustrySlugs } from "@/lib/data/industries";
import { getAllGuideSlugs } from "@/lib/data/guides";
import { getAllUseCaseSlugs } from "@/lib/data/use-cases";

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
  "word-counter",
  "open-graph-checker",
  "broken-link-checker",
  "ssl-checker",
  "http-header-checker",
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
      url: `${baseUrl}/contact`,
      lastModified: "2026-03-05",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: "2026-03-05",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: "2026-03-05",
      changeFrequency: "yearly",
      priority: 0.3,
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

  // Comparison pages
  const comparisonSlugs = getAllComparisonSlugs();
  const comparisonIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/compare`,
      lastModified: "2026-03-07",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: "2026-03-07",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Alternative pages
  const alternativeSlugs = getAllAlternativeSlugs();
  const alternativeIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/alternatives`,
      lastModified: "2026-03-07",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
  const alternativePages: MetadataRoute.Sitemap = alternativeSlugs.map((slug) => ({
    url: `${baseUrl}/alternatives/${slug}`,
    lastModified: "2026-03-07",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Industry-specific SEO checker pages
  const industrySlugs = getAllIndustrySlugs();
  const industryPages: MetadataRoute.Sitemap = industrySlugs.map((slug) => ({
    url: `${baseUrl}/tools/seo-checker/${slug}`,
    lastModified: "2026-03-07",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Guide pages
  const guideSlugs = getAllGuideSlugs();
  const guideIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: "2026-03-07",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
  const guidePages: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: "2026-03-07",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Use-case pages
  const useCaseSlugs = getAllUseCaseSlugs();
  const useCaseIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/for`,
      lastModified: "2026-03-07",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
  const useCasePages: MetadataRoute.Sitemap = useCaseSlugs.map((slug) => ({
    url: `${baseUrl}/for/${slug}`,
    lastModified: "2026-03-07",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...blogPages, ...docPages, ...glossaryIndex, ...glossaryPages, ...comparisonIndex, ...comparisonPages, ...alternativeIndex, ...alternativePages, ...industryPages, ...guideIndex, ...guidePages, ...useCaseIndex, ...useCasePages];
}
