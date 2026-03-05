"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TableOfContentsItem } from "@/lib/docs/schema";

interface DocsContentMdxProps {
  /** Page title from frontmatter */
  title: string;
  /** Page description from frontmatter */
  description: string;
  /** Last updated date (YYYY-MM-DD) */
  lastUpdated: string;
  /** Reading time in minutes */
  readingTimeMinutes: number;
  /** Table of contents extracted from headings */
  tableOfContents: TableOfContentsItem[];
  /** Previous page link */
  prevPage?: { title: string; href: string } | null;
  /** Next page link */
  nextPage?: { title: string; href: string } | null;
  /** MDX content (rendered children) */
  children: React.ReactNode;
}

export function DocsContentMdx({
  title,
  description,
  lastUpdated,
  readingTimeMinutes,
  tableOfContents,
  prevPage,
  nextPage,
  children,
}: DocsContentMdxProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  // Format the date for display
  const formattedDate = (() => {
    try {
      const date = new Date(lastUpdated);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return lastUpdated;
    }
  })();

  // Intersection Observer for active heading
  React.useEffect(() => {
    const headings = document.querySelectorAll("article h2, article h3");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="flex flex-1 gap-12">
      {/* Main content */}
      <article className="min-w-0 flex-1 pb-20">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-foreground/50 mb-3">
            <time dateTime={lastUpdated}>{formattedDate}</time>
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
            <span>{readingTimeMinutes} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
            {title}
          </h1>
          <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl">
            {description}
          </p>
        </header>

        {/* MDX Content */}
        <div className="prose-docs">{children}</div>

        {/* Navigation */}
        <nav className="mt-16 flex items-stretch gap-4 border-t border-border/40 pt-8">
          {prevPage ? (
            <Link
              href={prevPage.href}
              className={cn(
                "group flex flex-1 flex-col rounded-xl border border-border/40 p-4 transition-[border-color,box-shadow] duration-200",
                "hover:border-border hover:bg-foreground/5"
              )}
            >
              <span className="flex items-center gap-1 text-xs font-medium text-foreground/40">
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </span>
              <span className="mt-1 font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {prevPage.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextPage ? (
            <Link
              href={nextPage.href}
              className={cn(
                "group flex flex-1 flex-col items-end rounded-xl border border-border/40 p-4 transition-[border-color,box-shadow] duration-200",
                "hover:border-border hover:bg-foreground/5"
              )}
            >
              <span className="flex items-center gap-1 text-xs font-medium text-foreground/40">
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1 font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {nextPage.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>

      {/* Table of Contents - Desktop only */}
      <aside className="hidden xl:block w-56 flex-shrink-0">
        <div className="sticky top-24">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground/40">
            On this page
          </h4>
          <nav className="space-y-1">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "block py-1.5 text-[13px] transition-colors duration-150",
                  item.level === 3 && "pl-4",
                  activeId === item.id
                    ? "text-foreground font-medium"
                    : "text-foreground/50 hover:text-foreground/80"
                )}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
