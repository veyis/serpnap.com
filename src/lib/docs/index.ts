/**
 * Documentation System - MDX-based content management
 *
 * This module provides the infrastructure for loading and navigating
 * MDX-based documentation pages.
 *
 * Usage:
 * ```ts
 * import { getDocByPath, getAllDocPaths, getDocsNavigation } from "@/lib/docs";
 *
 * // In generateStaticParams
 * const paths = await getAllDocPaths();
 *
 * // In page component
 * const doc = await getDocByPath("seo/complete-guide");
 * const navigation = await getDocsNavigation();
 * ```
 */

// Schema and types
export {
  docFrontmatterSchema,
  type DocFrontmatter,
  type DocPage,
  type DocNavSection,
  type DocNavItem,
  type DocNavContext,
  type DocNavCategory,
  type TableOfContentsItem,
} from "./schema";

// Content loader
export {
  getDocByPath,
  getAllDocPaths,
  getDocsBySection,
  docsDirectoryExists,
} from "./loader";

// Navigation
export {
  getDocsNavigation,
  getCategorizedNavigation,
  getDocNavContext,
  getDocSection,
} from "./navigation";
