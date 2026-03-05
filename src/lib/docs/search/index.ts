/**
 * Documentation Search Module
 *
 * Provides full-text search for documentation with:
 * - Build-time index generation
 * - FlexSearch-powered fuzzy matching
 * - Relevance scoring
 * - Content snippets
 * - Section filtering
 */

export * from "./types";
export { generateSearchIndex, getSearchIndex } from "./index-generator";
export { DocsSearchEngine, getSearchEngine } from "./engine";
