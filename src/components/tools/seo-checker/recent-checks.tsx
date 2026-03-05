"use client";

import { cn } from "@/lib/utils";
import type { RecentCheck } from "./utils";

export function RecentChecks({
  checks,
  onSelect,
}: {
  checks: RecentCheck[];
  onSelect: (url: string) => void;
}) {
  if (checks.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="text-[12px] text-[var(--seo-text-faint)] mb-3 tracking-wide uppercase">Recent</div>
      <div className="flex flex-wrap gap-2">
        {checks.slice(0, 3).map((check) => (
          <button
            type="button"
            key={check.url}
            onClick={() => onSelect(check.url)}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[13px]",
              "bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)]",
              "hover:bg-[var(--seo-surface-hover)] hover:shadow-[var(--seo-card-shadow-hover)]",
              "active:scale-[0.97] transition-all"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full shrink-0",
              check.score >= 80 ? "bg-success" : check.score >= 60 ? "bg-warning" : "bg-destructive"
            )} />
            <span className="text-[var(--seo-text-secondary)] truncate max-w-[140px]">{check.hostname}</span>
            <span className="text-[var(--seo-text-faint)] tabular-nums">{check.score}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
