import {
  Check,
  Clock,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PerformanceHints } from "@/schemas/seo-checker";

export function PerformanceHintsSection({ hints, loadTime }: { hints: PerformanceHints; loadTime?: number }) {
  const optimizations = [
    { label: "Preconnect", active: hints.hasPreconnect },
    { label: "Preload", active: hints.hasPreload },
    { label: "Defer Scripts", active: hints.hasDeferredScripts },
    { label: "Async Scripts", active: hints.hasAsyncScripts },
    { label: "Lazy Images", active: hints.hasLazyImages },
  ];

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">Performance Hints</span>
        </div>
        {loadTime && (
          <span className="text-[10px] text-[var(--seo-text-muted)] flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {loadTime}ms
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Optimization pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {optimizations.map((opt) => (
            <span
              key={opt.label}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1",
                opt.active
                  ? "bg-success/10 text-success"
                  : "bg-[var(--seo-surface-hover)] text-[var(--seo-text-muted)]"
              )}
            >
              {opt.active ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              {opt.label}
            </span>
          ))}
        </div>

        {/* Counts */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-lg bg-[var(--seo-surface)]">
            <div className="text-lg font-semibold text-[var(--seo-text)] tabular-nums">{hints.scriptCount}</div>
            <div className="text-[10px] text-[var(--seo-text-muted)]">Scripts</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--seo-surface)]">
            <div className="text-lg font-semibold text-[var(--seo-text)] tabular-nums">{hints.stylesheetCount}</div>
            <div className="text-[10px] text-[var(--seo-text-muted)]">Stylesheets</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--seo-surface)]">
            <div className="text-lg font-semibold text-[var(--seo-text)] tabular-nums">{hints.totalImageCount}</div>
            <div className="text-[10px] text-[var(--seo-text-muted)]">Images</div>
          </div>
        </div>
      </div>
    </div>
  );
}
