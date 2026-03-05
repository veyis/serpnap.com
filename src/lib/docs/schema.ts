import { z } from "zod";

/**
 * Zod schema for MDX frontmatter validation.
 * All doc pages must have valid frontmatter matching this schema.
 */
export const docFrontmatterSchema = z.object({
  // Required fields
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  lastUpdated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format"),
  section: z.string().min(1, "Section slug is required"),

  // Optional fields
  order: z.number().int().positive().optional(),
  badge: z.enum(["new", "updated", "beta", "Essential", "Advanced"]).optional(),
  readTime: z.string().optional(), // Auto-calculated if not provided

  // SEO overrides
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      noIndex: z.boolean().optional(),
    })
    .optional(),
});

export type DocFrontmatter = z.infer<typeof docFrontmatterSchema>;

/**
 * Table of contents item extracted from headings
 */
export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

/**
 * Full doc page with content and computed fields
 */
export interface DocPage {
  /** URL-friendly identifier (filename without extension) */
  slug: string;
  /** Full path relative to docs root (e.g., "seo/complete-guide") */
  path: string;
  /** Validated frontmatter */
  frontmatter: DocFrontmatter;
  /** Raw MDX content (without frontmatter) */
  content: string;
  /** Auto-extracted table of contents */
  tableOfContents: TableOfContentsItem[];
  /** Calculated reading time in minutes */
  readingTimeMinutes: number;
}

/**
 * Navigation category (e.g., "Getting Started", "Paid Advertising")
 */
export interface DocNavCategory {
  title: string;
  sections: DocNavSection[];
}

/**
 * Navigation section (e.g., "SEO Guide", "Google Ads Guide")
 */
export interface DocNavSection {
  title: string;
  slug: string;
  icon: string;
  category?: string;
  items: DocNavItem[];
}

/**
 * Navigation item within a section
 */
export interface DocNavItem {
  title: string;
  slug: string;
  path: string;
  description?: string;
  badge?: "new" | "updated" | "beta" | "Essential" | "Advanced";
  order?: number;
}

/**
 * Prev/next navigation context
 */
export interface DocNavContext {
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
}
