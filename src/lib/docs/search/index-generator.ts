import "server-only";
import fs from "fs";
import path from "path";
import { cache } from "react";
import { docFrontmatterSchema } from "../schema";
import type {
  SearchDocument,
  SearchIndex,
  SearchSection,
  SearchHeading,
} from "./types";

const DOCS_PATH = path.join(process.cwd(), "src/content/docs");

/**
 * Section configuration with display titles and icons
 */
const SECTION_CONFIG: Record<string, { title: string; icon: string }> = {
  seo: { title: "SEO Guide", icon: "sparkles" },
  "local-seo": { title: "Local SEO", icon: "mapPin" },
};

/**
 * Strip MDX/JSX syntax and extract plain text for indexing
 */
function stripMdxSyntax(content: string): string {
  return (
    content
      // Remove JSX imports
      .replace(/^import\s+.*$/gm, "")
      // Remove export statements except meta
      .replace(/^export\s+(?!const\s+meta).*$/gm, "")
      // Remove meta export
      .replace(/^export const meta = \{[\s\S]*?\};/m, "")
      // Remove JSX components (self-closing)
      .replace(/<[A-Z][a-zA-Z]*\s*[^>]*\/>/g, "")
      // Remove JSX components (with content) - be careful with nested
      .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "")
      // Remove code blocks (preserve for search but simplify)
      .replace(/```[\s\S]*?```/g, " ")
      // Remove inline code backticks
      .replace(/`([^`]+)`/g, "$1")
      // Remove markdown links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove markdown images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      // Remove HTML tags
      .replace(/<[^>]+>/g, "")
      // Remove markdown formatting
      .replace(/[*_~]+([^*_~]+)[*_~]+/g, "$1")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Extract headings from MDX content for deep linking
 */
function extractHeadings(content: string): SearchHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: SearchHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, title, level });
  }

  return headings;
}

/**
 * Extract meta export from MDX file content
 */
function extractMeta(fileContent: string): {
  meta: Record<string, unknown>;
  content: string;
} {
  const startMatch = fileContent.match(/^export const meta = \{/m);

  if (!startMatch || startMatch.index === undefined) {
    return { meta: {}, content: fileContent };
  }

  const startIndex = startMatch.index + startMatch[0].length - 1;
  let braceCount = 1;
  let endIndex = startIndex + 1;

  while (braceCount > 0 && endIndex < fileContent.length) {
    const char = fileContent[endIndex];
    if (char === "{") braceCount++;
    else if (char === "}") braceCount--;
    endIndex++;
  }

  if (braceCount !== 0) {
    return { meta: {}, content: fileContent };
  }

  const objectStr = fileContent.slice(startIndex, endIndex);
  const fullMatch = fileContent.slice(startMatch.index, endIndex + 1);

  try {
    const meta = new Function(`return ${objectStr}`)() as Record<
      string,
      unknown
    >;
    const content = fileContent.replace(fullMatch, "").trim();
    return { meta, content };
  } catch {
    return { meta: {}, content: fileContent };
  }
}

/**
 * Recursively get all MDX files
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
 * Build a single search document from an MDX file
 */
function buildSearchDocument(docPath: string): SearchDocument | null {
  const filePath = path.join(DOCS_PATH, docPath);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { meta, content } = extractMeta(fileContent);

  // Validate frontmatter
  const parseResult = docFrontmatterSchema.safeParse(meta);
  if (!parseResult.success) {
    console.warn(`Invalid frontmatter in ${docPath}, skipping...`);
    return null;
  }

  const frontmatter = parseResult.data;
  const pathWithoutExt = docPath.replace(/\.mdx$/, "");
  const section = frontmatter.section;
  const sectionConfig = SECTION_CONFIG[section] || {
    title: section,
    icon: "file",
  };

  return {
    id: pathWithoutExt,
    title: frontmatter.title,
    description: frontmatter.description,
    section,
    sectionTitle: sectionConfig.title,
    href: `/docs/${pathWithoutExt}`,
    content: stripMdxSyntax(content),
    badge: frontmatter.badge,
    keywords: frontmatter.seo?.keywords,
    headings: extractHeadings(content),
  };
}

/**
 * Generate the complete search index
 * This should be called at build time
 */
export const generateSearchIndex = cache(async (): Promise<SearchIndex> => {
  const files = getMdxFiles(DOCS_PATH);
  const documents: SearchDocument[] = [];
  const sectionCounts: Record<string, number> = {};

  for (const file of files) {
    const doc = buildSearchDocument(file);
    if (doc) {
      documents.push(doc);
      sectionCounts[doc.section] = (sectionCounts[doc.section] || 0) + 1;
    }
  }

  // Build section metadata
  const sections: SearchSection[] = Object.entries(sectionCounts).map(
    ([slug, count]) => {
      const config = SECTION_CONFIG[slug] || { title: slug, icon: "file" };
      return {
        slug,
        title: config.title,
        icon: config.icon,
        docCount: count,
      };
    },
  );

  // Sort sections by doc count (most docs first)
  sections.sort((a, b) => b.docCount - a.docCount);

  return {
    version: "1.0.0",
    builtAt: new Date().toISOString(),
    documents,
    totalDocs: documents.length,
    sections,
  };
});

/**
 * Get the search index (cached)
 */
export const getSearchIndex = generateSearchIndex;
