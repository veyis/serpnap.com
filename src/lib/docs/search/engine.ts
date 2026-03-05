/**
 * Search Engine using FlexSearch
 * Provides fast, fuzzy full-text search with relevance ranking
 */

import FlexSearch from "flexsearch";
import type {
  SearchDocument,
  SearchIndex,
  SearchResult,
  SearchOptions,
} from "./types";

// FlexSearch types (library doesn't export proper types)
interface FlexSearchResult {
  field: string;
  result: (string | number)[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexSearchIndex = any;

/**
 * Search Engine class
 * Manages FlexSearch indexes and provides search functionality
 */
export class DocsSearchEngine {
  private index: FlexSearchIndex = null;
  private documents: Map<string, SearchDocument> = new Map();
  private isInitialized = false;

  /**
   * Initialize the search engine with the search index
   */
  async initialize(searchIndex: SearchIndex): Promise<void> {
    if (this.isInitialized) return;

    // Create FlexSearch document index with multiple fields
    this.index = new FlexSearch.Document({
      // Document configuration
      document: {
        id: "id",
        index: ["title", "description", "content", "keywords"],
        store: true,
      },
      // Tokenization settings for better fuzzy matching
      tokenize: "forward",
      // Enable context-aware search
      context: {
        depth: 2,
        bidirectional: true,
        resolution: 9,
      },
      // Caching for performance
      cache: 100,
    });

    // Index all documents
    for (const doc of searchIndex.documents) {
      await this.index.addAsync(doc.id, {
        ...doc,
        // Flatten keywords for indexing
        keywords: doc.keywords?.join(" ") || "",
      });
      this.documents.set(doc.id, doc);
    }

    this.isInitialized = true;
  }

  /**
   * Search the index with query
   */
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    if (!this.index || !this.isInitialized) {
      console.warn("Search engine not initialized");
      return [];
    }

    const { limit = 10, section, includeHeadings = true, threshold = 0 } = options;

    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return this.getPopularDocs(limit, section);
    }

    // Search across all indexed fields
    const searchResults: FlexSearchResult[] = await this.index.searchAsync(trimmedQuery, {
      limit: limit * 2, // Get more results for scoring
      enrich: true,
    });

    // Collect and score results
    const scoredResults = new Map<string, SearchResult>();

    // Process results from each field with different weights
    const fieldWeights: Record<string, number> = {
      title: 10,
      description: 5,
      content: 2,
      keywords: 8,
    };

    for (const fieldResult of searchResults) {
      const field = fieldResult.field;
      const weight = fieldWeights[field] || 1;

      for (const result of fieldResult.result) {
        const id = String(result);
        const doc = this.documents.get(id);

        if (!doc) continue;

        // Apply section filter
        if (section && doc.section !== section) continue;

        const existing = scoredResults.get(id);
        const matchType = this.getMatchType(field);
        const baseScore = weight;

        if (existing) {
          // Combine scores from multiple field matches
          existing.score += baseScore;
          // Prefer title matches for display
          if (matchType === "title" && existing.matchType !== "title") {
            existing.matchType = matchType;
          }
        } else {
          scoredResults.set(id, {
            id,
            title: doc.title,
            description: doc.description,
            section: doc.section,
            sectionTitle: doc.sectionTitle,
            href: doc.href,
            badge: doc.badge,
            score: baseScore,
            matchType,
            snippet: this.generateSnippet(doc, trimmedQuery, matchType),
          });
        }
      }
    }

    // Also check headings for matches
    if (includeHeadings) {
      for (const [id, doc] of this.documents) {
        if (section && doc.section !== section) continue;

        for (const heading of doc.headings) {
          if (heading.title.toLowerCase().includes(trimmedQuery)) {
            const existing = scoredResults.get(id);
            if (existing) {
              existing.score += 7; // Heading match weight
              if (!existing.matchedHeading) {
                existing.matchedHeading = heading;
              }
            } else {
              scoredResults.set(id, {
                id,
                title: doc.title,
                description: doc.description,
                section: doc.section,
                sectionTitle: doc.sectionTitle,
                href: `${doc.href}#${heading.id}`,
                badge: doc.badge,
                score: 7,
                matchType: "heading",
                snippet: `${heading.title}`,
                matchedHeading: heading,
              });
            }
          }
        }
      }
    }

    // Sort by score and apply threshold
    const results = Array.from(scoredResults.values())
      .filter((r) => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  /**
   * Get popular/featured docs when no query
   */
  private getPopularDocs(limit: number, section?: string): SearchResult[] {
    const docs = Array.from(this.documents.values());

    // Filter by section if specified
    const filtered = section ? docs.filter((d) => d.section === section) : docs;

    // Prioritize docs with badges, then by section order
    const sorted = filtered.sort((a, b) => {
      // Badge priority: new > updated > beta > none
      const badgePriority: Record<string, number> = {
        new: 3,
        updated: 2,
        beta: 1,
      };
      const aPriority = a.badge ? badgePriority[a.badge] || 0 : 0;
      const bPriority = b.badge ? badgePriority[b.badge] || 0 : 0;

      if (aPriority !== bPriority) return bPriority - aPriority;

      // Then alphabetically by section
      return a.sectionTitle.localeCompare(b.sectionTitle);
    });

    return sorted.slice(0, limit).map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      section: doc.section,
      sectionTitle: doc.sectionTitle,
      href: doc.href,
      badge: doc.badge,
      score: 0,
      matchType: "title" as const,
    }));
  }

  /**
   * Get match type from field name
   */
  private getMatchType(
    field: string
  ): "title" | "description" | "content" | "heading" {
    switch (field) {
      case "title":
        return "title";
      case "description":
        return "description";
      default:
        return "content";
    }
  }

  /**
   * Generate a context snippet showing where the match was found
   */
  private generateSnippet(
    doc: SearchDocument,
    query: string,
    matchType: string
  ): string | undefined {
    if (matchType === "title" || matchType === "description") {
      return undefined; // Title/description are already shown
    }

    const content = doc.content;
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const matchIndex = contentLower.indexOf(queryLower);

    if (matchIndex === -1) {
      return undefined;
    }

    // Extract snippet around the match
    const snippetStart = Math.max(0, matchIndex - 60);
    const snippetEnd = Math.min(content.length, matchIndex + query.length + 60);

    let snippet = content.slice(snippetStart, snippetEnd);

    // Add ellipsis if truncated
    if (snippetStart > 0) snippet = "..." + snippet;
    if (snippetEnd < content.length) snippet = snippet + "...";

    return snippet;
  }

  /**
   * Get all sections for filtering UI
   */
  getSections(): { slug: string; title: string; count: number }[] {
    const sectionCounts = new Map<string, { title: string; count: number }>();

    for (const doc of this.documents.values()) {
      const existing = sectionCounts.get(doc.section);
      if (existing) {
        existing.count++;
      } else {
        sectionCounts.set(doc.section, {
          title: doc.sectionTitle,
          count: 1,
        });
      }
    }

    return Array.from(sectionCounts.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Check if engine is ready
   */
  get ready(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance for client-side use
let searchEngineInstance: DocsSearchEngine | null = null;

export function getSearchEngine(): DocsSearchEngine {
  if (!searchEngineInstance) {
    searchEngineInstance = new DocsSearchEngine();
  }
  return searchEngineInstance;
}
