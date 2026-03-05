/**
 * Search system types for documentation
 * Provides type-safe interfaces for the full-text search functionality
 */

/**
 * Individual document in the search index
 */
export interface SearchDocument {
  /** Unique identifier (path to doc) */
  id: string;
  /** Document title */
  title: string;
  /** Document description */
  description: string;
  /** Section slug (e.g., "seo", "google-ads") */
  section: string;
  /** Section display title */
  sectionTitle: string;
  /** Full URL path */
  href: string;
  /** Plain text content (stripped of MDX syntax) */
  content: string;
  /** Badge type if any */
  badge?: "new" | "updated" | "beta" | "Essential" | "Advanced";
  /** Keywords from SEO metadata */
  keywords?: string[];
  /** Headings in the document for anchor linking */
  headings: SearchHeading[];
}

/**
 * Heading within a document for deep linking
 */
export interface SearchHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

/**
 * Search result returned to the UI
 */
export interface SearchResult {
  /** Document ID (path) */
  id: string;
  /** Document title */
  title: string;
  /** Document description */
  description: string;
  /** Section slug */
  section: string;
  /** Section display title */
  sectionTitle: string;
  /** Full URL path */
  href: string;
  /** Badge type if any */
  badge?: "new" | "updated" | "beta" | "Essential" | "Advanced";
  /** Relevance score (higher = more relevant) */
  score: number;
  /** Match type for UI indication */
  matchType: "title" | "description" | "content" | "heading";
  /** Context snippet showing where match was found */
  snippet?: string;
  /** Matching heading if matched in heading */
  matchedHeading?: SearchHeading;
}

/**
 * Pre-built search index structure (serializable)
 */
export interface SearchIndex {
  /** Version for cache invalidation */
  version: string;
  /** Build timestamp */
  builtAt: string;
  /** All searchable documents */
  documents: SearchDocument[];
  /** Total document count */
  totalDocs: number;
  /** Section metadata for filtering */
  sections: SearchSection[];
}

/**
 * Section metadata for filtering
 */
export interface SearchSection {
  slug: string;
  title: string;
  icon: string;
  docCount: number;
}

/**
 * Search query options
 */
export interface SearchOptions {
  /** Maximum results to return */
  limit?: number;
  /** Filter by section slug */
  section?: string;
  /** Include heading matches */
  includeHeadings?: boolean;
  /** Minimum score threshold (0-1) */
  threshold?: number;
}

/**
 * Recent search entry for persistence
 */
export interface RecentSearch {
  query: string;
  timestamp: number;
  resultCount: number;
}
