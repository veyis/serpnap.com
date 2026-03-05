"use client";

import { useState } from "react";
import { Activity, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WaterfallAnalysis } from "@/schemas/seo-checker";

// ============================================================================
// Resource Waterfall Section
// ============================================================================

const RESOURCE_TYPE_COLORS: Record<string, { bar: string; text: string }> = {
  document: { bar: "bg-info", text: "text-info" },
  script: { bar: "bg-warning", text: "text-warning" },
  stylesheet: { bar: "bg-primary", text: "text-primary" },
  image: { bar: "bg-success", text: "text-success" },
  font: { bar: "bg-primary", text: "text-primary" },
  iframe: { bar: "bg-warning", text: "text-warning" },
  preload: { bar: "bg-info", text: "text-info" },
  other: { bar: "bg-muted", text: "text-muted-foreground" },
};

export function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function WaterfallSection({ data }: { data: WaterfallAnalysis }) {
  const [showAll, setShowAll] = useState(false);
  const { resources, summary, skippedCount } = data;
  const maxTime = Math.max(...resources.map((r) => r.responseTimeMs ?? 0), 1);
  const visibleResources = showAll ? resources : resources.slice(0, 12);

  // Tick marks for timeline ruler
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((pct) => Math.round(maxTime * pct));

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-info" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            Resource Waterfall
          </span>
        </div>
        <span className="text-xs text-[var(--seo-text-muted)]">
          {summary.totalResources} resources &middot;{" "}
          {formatBytes(summary.totalSizeBytes)}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Resources",
              value: String(summary.totalResources),
              color: "text-[var(--seo-text)]",
            },
            {
              label: "Total Size",
              value: formatBytes(summary.totalSizeBytes),
              color:
                summary.totalSizeBytes > 3 * 1024 * 1024
                  ? "text-destructive"
                  : "text-[var(--seo-text)]",
            },
            {
              label: "Render-Blocking",
              value: String(summary.renderBlockingCount),
              color:
                summary.renderBlockingCount > 5
                  ? "text-destructive"
                  : summary.renderBlockingCount > 0
                    ? "text-warning"
                    : "text-success",
            },
            {
              label: "Third-Party",
              value: String(summary.thirdPartyCount),
              color:
                summary.thirdPartyCount > 10
                  ? "text-warning"
                  : "text-[var(--seo-text)]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--seo-surface)] rounded-lg px-3 py-2 text-center"
            >
              <div className={cn("text-sm font-mono font-bold", stat.color)}>
                {stat.value}
              </div>
              <div className="text-[10px] text-[var(--seo-text-muted)] uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Type legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(summary.byType).map(([type, count]) => {
            const colors =
              RESOURCE_TYPE_COLORS[type] || RESOURCE_TYPE_COLORS.other;
            return (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <div className={cn("w-2 h-2 rounded-full", colors.bar)} />
                <span className="text-[var(--seo-text-secondary)]">{type}</span>
                <span className="text-[var(--seo-text-muted)]">({count})</span>
              </div>
            );
          })}
        </div>

        {/* Timeline ruler */}
        <div className="hidden sm:flex items-center pl-[140px] pr-[80px]">
          <div className="flex-1 flex justify-between">
            {ticks.map((ms, idx) => (
              <span
                key={idx}
                className="text-[9px] text-[var(--seo-text-faint)] font-mono"
              >
                {ms}ms
              </span>
            ))}
          </div>
        </div>

        {/* Waterfall bars */}
        <div className="space-y-1">
          {visibleResources.map((resource, i) => {
            const colors =
              RESOURCE_TYPE_COLORS[resource.resourceType] ||
              RESOURCE_TYPE_COLORS.other;
            const barWidthPct =
              resource.responseTimeMs !== null
                ? Math.max((resource.responseTimeMs / maxTime) * 100, 2)
                : 0;
            const barOffsetPct = 0; // All start from left since we only have response time, not waterfall start

            return (
              <div key={i} className="flex items-center gap-0 group">
                {/* Resource name */}
                <div className="w-[100px] sm:w-[140px] shrink-0 pr-2 flex items-center gap-1 min-w-0">
                  {resource.isCriticalPath && (
                    <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
                  )}
                  <span
                    className={cn("text-xs font-mono truncate", colors.text)}
                    title={resource.url}
                  >
                    {resource.shortName}
                  </span>
                </div>

                {/* Bar area */}
                <div className="flex-1 h-5 relative bg-[var(--seo-surface)] rounded-sm overflow-hidden">
                  {resource.responseTimeMs !== null && (
                    <div
                      className={cn(
                        "absolute top-0 h-full rounded-sm transition-all",
                        colors.bar,
                        resource.isRenderBlocking ? "opacity-90" : "opacity-50",
                      )}
                      style={{
                        left: `${barOffsetPct}%`,
                        width: `${barWidthPct}%`,
                      }}
                    />
                  )}
                  {resource.isRenderBlocking &&
                    resource.responseTimeMs !== null && (
                      <div
                        className="absolute top-0 h-full rounded-sm opacity-20"
                        style={{
                          left: `${barOffsetPct}%`,
                          width: `${barWidthPct}%`,
                          backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 2px, color-mix(in srgb, var(--color-background) 20%, transparent) 2px, color-mix(in srgb, var(--color-background) 20%, transparent) 4px)",
                        }}
                      />
                    )}
                </div>

                {/* Timing + size */}
                <div className="w-[60px] sm:w-[80px] shrink-0 pl-1 sm:pl-2 text-right">
                  <span className="text-[10px] font-mono text-[var(--seo-text-secondary)]">
                    {resource.responseTimeMs !== null
                      ? `${resource.responseTimeMs}ms`
                      : "—"}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-[var(--seo-text-faint)] mx-0.5">
                    /
                  </span>
                  <span className="hidden sm:inline text-[10px] font-mono text-[var(--seo-text-muted)]">
                    {formatBytes(resource.sizeBytes)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more/less toggle */}
        {resources.length > 12 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-xs text-info hover:text-info transition-colors mx-auto"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show all {resources.length} resources
              </>
            )}
          </button>
        )}

        {/* Skipped notice */}
        {skippedCount > 0 && (
          <div className="text-xs text-[var(--seo-text-muted)] text-center">
            {skippedCount} additional resource{skippedCount > 1 ? "s" : ""} not
            checked (30 resource limit)
          </div>
        )}

        {/* Critical path callout */}
        {summary.criticalPathCount > 2 && (
          <div className="bg-destructive/5 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-destructive font-medium">
                {summary.criticalPathCount} critical-path resources in
                &lt;head&gt;
              </div>
              <div className="text-[11px] text-destructive/70 mt-0.5">
                These render-blocking resources delay First Contentful Paint.
                Consider deferring non-essential scripts and using media queries
                for non-critical CSS.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
