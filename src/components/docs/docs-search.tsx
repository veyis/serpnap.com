"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  ArrowRight,
  Command,
  X,
  Clock,
  FileText,
  Hash,
  Loader2,
  Filter,
  Sparkles,
} from "lucide-react";
import type {
  SearchResult,
  SearchIndex,
  RecentSearch,
} from "@/lib/docs/search/types";
import { DocsSearchEngine, getSearchEngine } from "@/lib/docs/search/engine";

const RECENT_SEARCHES_KEY = "docs-recent-searches";
const MAX_RECENT_SEARCHES = 5;

/**
 * Enhanced documentation search with full-text search, fuzzy matching,
 * and content snippets
 */
export function DocsSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<RecentSearch[]>(
    []
  );
  const [selectedSection, setSelectedSection] = React.useState<string | null>(
    null
  );
  const [sections, setSections] = React.useState<
    { slug: string; title: string; count: number }[]
  >([]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchEngine = React.useRef<DocsSearchEngine>(getSearchEngine());
  const router = useRouter();

  // Load recent searches from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Initialize search engine
  React.useEffect(() => {
    const controller = new AbortController();

    const initSearch = async () => {
      if (searchEngine.current.ready) {
        setIsInitialized(true);
        setSections(searchEngine.current.getSections());
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/docs/search", { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch search index");

        const searchIndex: SearchIndex = await response.json();
        if (controller.signal.aborted) return;
        await searchEngine.current.initialize(searchIndex);
        setIsInitialized(true);
        setSections(searchEngine.current.getSections());
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to initialize search:", error);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    if (isOpen && !isInitialized) {
      initSearch();
    }

    return () => controller.abort();
  }, [isOpen, isInitialized]);

  // Perform search when query or section changes
  React.useEffect(() => {
    const performSearch = async () => {
      if (!isInitialized) return;

      setIsLoading(true);
      try {
        const searchResults = await searchEngine.current.search(query, {
          limit: 10,
          section: selectedSection || undefined,
          includeHeadings: true,
        });
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 100);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedSection, isInitialized]);

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
      setSelectedSection(null);
    }
  }, [isOpen]);

  // Save recent search
  const saveRecentSearch = (searchQuery: string, resultCount: number) => {
    if (!searchQuery.trim()) return;

    const newSearch: RecentSearch = {
      query: searchQuery.trim(),
      timestamp: Date.now(),
      resultCount,
    };

    const updated = [
      newSearch,
      ...recentSearches.filter((s) => s.query !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Navigate to result
  const navigate = (href: string) => {
    saveRecentSearch(query, results.length);
    router.push(href);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    }
  };

  // Highlight matching text in snippet
  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark
          key={i}
          className="bg-foreground/10 text-foreground rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Get result icon based on match type
  const getResultIcon = (matchType: SearchResult["matchType"]) => {
    switch (matchType) {
      case "heading":
        return <Hash className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 text-sm",
          "text-foreground/40 transition-[color] duration-200",
          "hover:border-border hover:bg-background hover:text-foreground/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
        )}
      >
        <Search className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border/50 bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium text-foreground/40 sm:flex">
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200 transition-[transform,opacity]"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-2xl sm:inset-x-0 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            <div
              className={cn(
                "overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl",
                "ring-1 ring-foreground/5"
              )}
            >
              {/* Search header */}
              <div className="flex items-center gap-3 border-b border-border/40 px-4">
                <Search className="h-5 w-5 text-foreground/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search documentation..."
                  className={cn(
                    "flex-1 bg-transparent py-4 text-base outline-none",
                    "placeholder:text-foreground/30"
                  )}
                />
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-foreground/30" />
                )}
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded hover:bg-foreground/5 transition-colors"
                  >
                    <X className="h-4 w-4 text-foreground/30" />
                  </button>
                )}
                <kbd className="flex items-center rounded border border-border/50 bg-foreground/5 px-2 py-1 text-[11px] font-medium text-foreground/40">
                  ESC
                </kbd>
              </div>

              {/* Section filter */}
              {sections.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 overflow-x-auto scrollbar-hide">
                  <Filter className="h-3.5 w-3.5 text-foreground/30 flex-shrink-0" />
                  <button
                    onClick={() => setSelectedSection(null)}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors",
                      !selectedSection
                        ? "bg-foreground/10 text-foreground"
                        : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5"
                    )}
                  >
                    All
                  </button>
                  {sections.slice(0, 6).map((section) => (
                    <button
                      key={section.slug}
                      onClick={() =>
                        setSelectedSection(
                          selectedSection === section.slug ? null : section.slug
                        )
                      }
                      className={cn(
                        "px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors",
                        selectedSection === section.slug
                          ? "bg-foreground/10 text-foreground"
                          : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              <div className="max-h-[55vh] overflow-y-auto">
                {/* Recent searches (when no query) */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
                        Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] text-foreground/30 hover:text-foreground/50 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((recent) => (
                        <button
                          key={recent.query}
                          onClick={() => setQuery(recent.query)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
                            "hover:bg-foreground/5 transition-colors"
                          )}
                        >
                          <Clock className="h-4 w-4 text-foreground/30" />
                          <span className="text-sm text-foreground/70">
                            {recent.query}
                          </span>
                          <span className="ml-auto text-xs text-foreground/30">
                            {recent.resultCount} results
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search results */}
                {(query || (!query && recentSearches.length === 0)) && (
                  <div className="p-2">
                    {results.length > 0 ? (
                      <div className="space-y-1">
                        {results.map((result, index) => (
                          <button
                            key={`${result.id}-${result.matchedHeading?.id || ""}`}
                            onClick={() => navigate(result.href)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-[background-color,border-color] duration-150",
                              selectedIndex === index
                                ? "bg-foreground/5"
                                : "hover:bg-foreground/5"
                            )}
                          >
                            <div className="mt-0.5 text-foreground/30">
                              {getResultIcon(result.matchType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
                                  {result.sectionTitle}
                                </span>
                                {result.badge && (
                                  <span
                                    className={cn(
                                      "px-1.5 py-0.5 text-[10px] font-medium rounded",
                                      result.badge === "new" &&
                                        "bg-emerald-500/10 text-emerald-500",
                                      result.badge === "updated" &&
                                        "bg-blue-500/10 text-blue-500",
                                      result.badge === "beta" &&
                                        "bg-amber-500/10 text-amber-500"
                                    )}
                                  >
                                    {result.badge}
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 font-medium text-foreground">
                                {highlightMatch(result.title, query)}
                                {result.matchedHeading && (
                                  <span className="text-foreground/50">
                                    {" "}
                                    &rsaquo; {result.matchedHeading.title}
                                  </span>
                                )}
                              </div>
                              {result.snippet ? (
                                <div className="mt-1 text-sm text-foreground/50 line-clamp-2">
                                  {highlightMatch(result.snippet, query)}
                                </div>
                              ) : (
                                result.description && (
                                  <div className="mt-0.5 text-sm text-foreground/50 truncate">
                                    {highlightMatch(result.description, query)}
                                  </div>
                                )
                              )}
                            </div>
                            <ArrowRight
                              className={cn(
                                "h-4 w-4 flex-shrink-0 mt-1 transition-opacity",
                                selectedIndex === index
                                  ? "opacity-40"
                                  : "opacity-0"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    ) : isInitialized && query ? (
                      <div className="py-12 text-center">
                        <div className="text-foreground/30">
                          No results found for &ldquo;{query}&rdquo;
                        </div>
                        <div className="mt-1 text-sm text-foreground/20">
                          Try a different search term or browse by section
                        </div>
                      </div>
                    ) : !isInitialized ? (
                      <div className="py-12 text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-foreground/30 mx-auto" />
                        <div className="mt-2 text-sm text-foreground/30">
                          Loading search index...
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="text-foreground/30">
                          Type to search documentation
                        </div>
                        <div className="mt-1 text-sm text-foreground/20">
                          Search titles, descriptions, and full content
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/40 px-4 py-2.5 text-[11px] text-foreground/30">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/50 bg-foreground/5 px-1 py-0.5">
                      &uarr;&darr;
                    </kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/50 bg-foreground/5 px-1 py-0.5">
                      &crarr;
                    </kbd>
                    <span>Select</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {results.length > 0 && (
                    <span className="text-foreground/20">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/50 bg-foreground/5 px-1 py-0.5">
                      esc
                    </kbd>
                    <span>Close</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
