"use client";

import { useId, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeadingNode } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

export function HeadingHierarchySection({
  headings,
}: {
  headings: HeadingNode[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();

  if (!headings || headings.length === 0) return null;

  const levelColors: Record<number, string> = {
    1: "bg-warning/20 text-warning border-warning/30",
    2: "bg-info/20 text-info border-info/30",
    3: "bg-primary/20 text-primary border-primary/30",
    4: "bg-[var(--seo-surface-hover)] text-[var(--seo-text-secondary)] border-[var(--seo-border)]",
    5: "bg-[var(--seo-surface-hover)] text-[var(--seo-text-secondary)] border-[var(--seo-border)]",
    6: "bg-[var(--seo-surface-hover)] text-[var(--seo-text-secondary)] border-[var(--seo-border)]",
  };

  const skippedCount = headings.filter((h) => h.isSkipped).length;

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsExpanded((value) => !value);
          }
        }}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--seo-surface-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--seo-surface-hover)] flex items-center justify-center">
            <TreePine className="w-5 h-5 text-[var(--seo-icon)]" />
          </div>
          <div className="text-left">
            <span className="text-[15px] font-semibold text-[var(--seo-text)] flex items-center gap-2">
              Heading Hierarchy
              <CategoryReferenceInfo
                categoryKey="content"
                ariaLabel="Heading hierarchy references"
                align="left"
                stopPropagation
              />
              {skippedCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-destructive/15 text-destructive rounded">
                  {skippedCount} skipped
                </span>
              )}
            </span>
            <p className="text-[13px] text-[var(--seo-text-muted)]">
              {headings.length} headings found
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[var(--seo-text-muted)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--seo-text-muted)]" />
        )}
      </div>

      {isExpanded && (
        <div id={panelId} className="px-4 pb-4 space-y-1">
          {headings.slice(0, 20).map((heading, idx) => (
            <div
              key={`h${heading.level}-${heading.text.slice(0, 30)}-${idx}`}
              className={cn(
                "flex items-center gap-2 py-1.5",
                heading.level === 1 && "pl-0",
                heading.level === 2 && "pl-4",
                heading.level === 3 && "pl-8",
                heading.level === 4 && "pl-12",
                heading.level === 5 && "pl-16",
                heading.level === 6 && "pl-20",
              )}
            >
              {heading.isSkipped && (
                <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
              )}
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold font-mono border shrink-0",
                  levelColors[heading.level] || levelColors[4],
                )}
              >
                H{heading.level}
              </span>
              <span className="text-sm text-[var(--seo-text)] truncate">
                {heading.text.slice(0, 60)}
                {heading.text.length > 60 ? "..." : ""}
              </span>
            </div>
          ))}
          {headings.length > 20 && (
            <p className="text-[11px] text-[var(--seo-text-muted)] pl-4 pt-2">
              + {headings.length - 20} more headings...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
