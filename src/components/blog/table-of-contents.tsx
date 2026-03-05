"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  className?: string;
}

/**
 * Table of Contents component that auto-generates from H2/H3 headings
 * Features:
 * - Auto-extraction of headings from content
 * - Scroll spy to highlight current section
 * - Smooth scroll navigation
 * - Collapsible on mobile
 */
export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = React.useState<TOCItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Extract headings from the page on mount
  React.useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TOCItem[] = [];

    elements.forEach((element) => {
      const id = element.id || generateId(element.textContent || "");
      if (!element.id) {
        element.id = id;
      }

      items.push({
        id,
        title: element.textContent || "",
        level: element.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  // Scroll spy to highlight active section
  React.useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Don't render if no headings
  if (headings.length < 3) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
      setIsExpanded(false);
    }
  };

  return (
    <nav
      className={cn(
        "rounded-xl border border-border/40 bg-foreground/5",
        className
      )}
      aria-label="Table of contents"
    >
      {/* Header - clickable on mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 lg:cursor-default"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <List className="h-4 w-4" />
          <span>Table of Contents</span>
        </div>
        <span className="text-xs text-foreground/50 lg:hidden">
          {headings.length} sections
        </span>
      </button>

      {/* Content - always visible on desktop, collapsible on mobile */}
      <div
        className={cn(
          "overflow-hidden transition-[height,opacity] duration-300",
          isExpanded ? "max-h-[500px]" : "max-h-0 lg:max-h-[500px]"
        )}
      >
        <ul className="space-y-1 px-4 pb-4">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "block w-full text-left py-1.5 text-sm transition-colors duration-200",
                  "hover:text-foreground",
                  heading.level === 3 && "pl-4",
                  activeId === heading.id
                    ? "text-foreground font-medium"
                    : "text-foreground/50"
                )}
              >
                <span
                  className={cn(
                    "block truncate",
                    activeId === heading.id &&
                      "border-l-2 border-foreground pl-2 -ml-2"
                  )}
                >
                  {heading.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Sticky Table of Contents for desktop sidebar
 */
export function StickyTableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = React.useState<TOCItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TOCItem[] = [];

    elements.forEach((element) => {
      const id = element.id || generateId(element.textContent || "");
      if (!element.id) {
        element.id = id;
      }

      items.push({
        id,
        title: element.textContent || "",
        level: element.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  React.useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
    }
  };

  return (
    <nav
      className={cn("sticky top-24 hidden xl:block", className)}
      aria-label="Table of contents"
    >
      <div className="text-sm font-semibold text-foreground mb-4">
        On this page
      </div>
      <ul className="space-y-2 text-sm border-l border-border/40">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                "block w-full text-left py-1 transition-colors duration-200",
                "hover:text-foreground",
                heading.level === 2 ? "pl-4" : "pl-6",
                activeId === heading.id
                  ? "text-foreground font-medium border-l-2 border-foreground -ml-px"
                  : "text-foreground/50"
              )}
            >
              <span className="line-clamp-2">{heading.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Helper to generate ID from text
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
