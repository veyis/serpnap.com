/**
 * Blog MDX Loader
 *
 * Loads MDX blog posts with export const meta pattern.
 * Turbopack-compatible - no remark plugins needed.
 */
import "server-only";
import fs from "fs";
import path from "path";
import { cache } from "react";
import type { BlogPostMetadata, BlogCategory } from "./types";

const BLOG_PATH = path.join(process.cwd(), "src/content/blog");

/**
 * Extract and parse export const meta from MDX content
 * Handles the Turbopack-compatible pattern: export const meta = { ... };
 */
function parseMetaExport(
  fileContent: string,
  filePath: string
): { meta: BlogPostMetadata; content: string } | null {
  try {
    // Match export const meta = { ... };
    const metaMatch = fileContent.match(
      /export\s+const\s+meta\s*=\s*(\{[\s\S]*?\n\});/
    );

    if (!metaMatch) {
      console.error(`No export const meta found in ${filePath}`);
      return null;
    }

    // Extract content after the meta export
    const metaEnd = (metaMatch.index || 0) + metaMatch[0].length;
    const content = fileContent.slice(metaEnd).trim();

    // Parse the meta object using Function constructor (safe for object literals)
     
    const metaObj = new Function(`return ${metaMatch[1]}`)();

    // Validate required fields
    if (!metaObj.title || !metaObj.slug || !metaObj.category || !metaObj.excerpt) {
      console.error(`Missing required meta fields in ${filePath}`);
      return null;
    }

    const meta: BlogPostMetadata = {
      slug: metaObj.slug,
      title: metaObj.title,
      excerpt: metaObj.excerpt,
      category: metaObj.category as BlogCategory,
      tags: metaObj.tags || [],
      author: metaObj.author || {
        name: "SerpNap Team",
        role: "Content Team",
        slug: "serpnap-team",
      },
      publishedAt: metaObj.publishedAt || new Date().toISOString().split("T")[0],
      updatedAt: metaObj.updatedAt,
      readingTimeMinutes: metaObj.readingTimeMinutes || calculateReadingTime(content),
      featured: metaObj.featured || false,
      seo: metaObj.seo,
      relatedSlugs: metaObj.relatedSlugs,
    };

    return { meta, content };
  } catch (error) {
    console.error(`Failed to parse meta in ${filePath}:`, error);
    return null;
  }
}

/**
 * Calculate reading time based on word count (average 200 words per minute)
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Recursively get all MDX files in a directory
 */
function getMdxFiles(dir: string, basePath: string = ""): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath, relativePath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Get all MDX blog post paths
 * Returns paths like ["ga4/ga4-complete-guide-2026", "gtm/gtm-complete-guide-2026", ...]
 */
export const getAllMdxBlogPaths = cache(async (): Promise<string[]> => {
  const files = getMdxFiles(BLOG_PATH);
  return files.map((f) => f.replace(/\.mdx$/, ""));
});

/**
 * Get metadata for a single MDX blog post by path
 */
export const getMdxBlogMetadata = cache(
  async (blogPath: string): Promise<BlogPostMetadata | null> => {
    const filePath = path.join(BLOG_PATH, `${blogPath}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = parseMetaExport(fileContent, blogPath);

    if (!parsed) {
      return null;
    }

    return parsed.meta;
  }
);

/**
 * Get all MDX blog posts metadata
 * Sorted by publishedAt date (newest first)
 */
export const getAllMdxBlogPosts = cache(
  async (): Promise<BlogPostMetadata[]> => {
    const allPaths = await getAllMdxBlogPaths();
    const posts = await Promise.all(allPaths.map(getMdxBlogMetadata));

    return posts
      .filter((p): p is BlogPostMetadata => p !== null)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }
);

/**
 * Get MDX blog posts by category
 */
export const getMdxBlogPostsByCategory = cache(
  async (category: BlogCategory): Promise<BlogPostMetadata[]> => {
    const allPosts = await getAllMdxBlogPosts();
    return allPosts.filter((p) => p.category === category);
  }
);

/**
 * Check if a blog post exists as MDX
 */
export function mdxBlogExists(category: string, slug: string): boolean {
  const filePath = path.join(BLOG_PATH, category, `${slug}.mdx`);
  return fs.existsSync(filePath);
}

/**
 * Get the import path for an MDX blog post
 */
export function getMdxImportPath(category: string, slug: string): string {
  return `@/content/blog/${category}/${slug}.mdx`;
}
