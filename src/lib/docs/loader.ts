import "server-only";
import fs from "fs";
import path from "path";
import { cache } from "react";
import {
  docFrontmatterSchema,
  type DocPage,
  type TableOfContentsItem,
} from "./schema";

const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

/**
 * Extract meta export from MDX file content
 * Format: export const meta = { ... };
 */
function extractMeta(fileContent: string): { meta: Record<string, unknown>; content: string } {
  // Match: export const meta = { ... }; with balanced braces
  const startMatch = fileContent.match(/^export const meta = \{/m);

  if (!startMatch || startMatch.index === undefined) {
    return { meta: {}, content: fileContent };
  }

  const startIndex = startMatch.index + startMatch[0].length - 1; // Position of opening {
  let braceCount = 1;
  let endIndex = startIndex + 1;

  // Find matching closing brace
  while (braceCount > 0 && endIndex < fileContent.length) {
    const char = fileContent[endIndex];
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    endIndex++;
  }

  if (braceCount !== 0) {
    console.error("Failed to find matching brace in meta export");
    return { meta: {}, content: fileContent };
  }

  const objectStr = fileContent.slice(startIndex, endIndex);
  const fullMatch = fileContent.slice(startMatch.index, endIndex + 1); // Include trailing ;

  try {
    // Use Function constructor to safely evaluate JS object literal
    // This handles trailing commas and other JS syntax that JSON.parse cannot
    const meta = new Function(`return ${objectStr}`)() as Record<string, unknown>;
    // Remove the export statement from content
    const content = fileContent.replace(fullMatch, "").trim();
    return { meta, content };
  } catch (e) {
    console.error("Failed to parse meta export:", e);
    return { meta: {}, content: fileContent };
  }
}

/**
 * Extract table of contents from MDX content by parsing h2 and h3 headings
 */
function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const title = match[2].trim();
    // Generate URL-safe id from title
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    toc.push({ id, title, level });
  }

  return toc;
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
 * Load a single doc by its path (e.g., "seo/complete-guide")
 * Returns null if the doc doesn't exist or has invalid frontmatter
 */
export const getDocByPath = cache(
  async (docPath: string): Promise<DocPage | null> => {
    const filePath = path.join(DOCS_PATH, `${docPath}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { meta, content } = extractMeta(fileContent);

    // Validate frontmatter against schema
    const parseResult = docFrontmatterSchema.safeParse(meta);
    if (!parseResult.success) {
      console.error(`Invalid frontmatter in ${docPath}:`, parseResult.error);
      return null;
    }

    const frontmatter = parseResult.data;
    const tableOfContents = extractTableOfContents(content);
    const readingTimeMinutes = calculateReadingTime(content);

    return {
      slug: path.basename(docPath),
      path: docPath,
      frontmatter,
      content,
      tableOfContents,
      readingTimeMinutes,
    };
  }
);

/**
 * Get all doc paths for generateStaticParams
 * Returns paths like ["seo/complete-guide", "google-ads/smart-bidding", ...]
 */
export const getAllDocPaths = cache(async (): Promise<string[]> => {
  const files = getMdxFiles(DOCS_PATH);
  return files.map((f) => f.replace(/\.mdx$/, ""));
});

/**
 * Get all docs in a specific section
 * Sorted by order field, then alphabetically
 */
export const getDocsBySection = cache(
  async (section: string): Promise<DocPage[]> => {
    const allPaths = await getAllDocPaths();
    const sectionPaths = allPaths.filter((p) => p.startsWith(`${section}/`));

    const docs = await Promise.all(sectionPaths.map(getDocByPath));

    return docs
      .filter((d): d is DocPage => d !== null)
      .sort((a, b) => {
        // Sort by order first, then alphabetically
        const orderA = a.frontmatter.order ?? 999;
        const orderB = b.frontmatter.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.frontmatter.title.localeCompare(b.frontmatter.title);
      });
  }
);

/**
 * Check if the docs directory exists and has content
 */
export function docsDirectoryExists(): boolean {
  return fs.existsSync(DOCS_PATH) && getMdxFiles(DOCS_PATH).length > 0;
}
