"use client";

import { useRef, useEffect } from "react";
import {
  BarChart3,
  BookOpen,
  Hash,
  Image as ImageIcon,
  Link2,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentMetrics, Readability } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

// ============================================================================
// Content Metrics (Dark themed, 4-column)
// ============================================================================

export function ContentMetricsSection({
  metrics,
  readability,
  contentToCodeRatio,
}: {
  metrics: ContentMetrics;
  readability?: Readability;
  contentToCodeRatio?: number;
}) {
  const ratioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ratioRef.current && contentToCodeRatio !== undefined) {
      ratioRef.current.style.setProperty(
        "--seo-ratio",
        `${Math.min(contentToCodeRatio, 100)}%`,
      );
    }
  }, [contentToCodeRatio]);

  const getWordCountStatus = (count: number) => {
    if (count >= 1000) return { status: "excellent", color: "emerald" };
    if (count >= 300) return { status: "good", color: "blue" };
    return { status: "low", color: "amber" };
  };

  const getHeadingStatus = (count: number) => {
    if (count >= 4) return { status: "excellent", color: "emerald" };
    if (count >= 2) return { status: "good", color: "blue" };
    return { status: "low", color: "amber" };
  };

  const getImageStatus = (total: number, withAlt: number, withoutAlt: number) => {
    if (total === 0) return { status: "none", color: "muted" };
    // Images truly missing alt attribute are the main concern
    if (withoutAlt > 0) {
      const hasAltRatio = (total - withoutAlt) / total;
      if (hasAltRatio >= 0.9) return { status: "good", color: "emerald" };
      if (hasAltRatio >= 0.5) return { status: "partial", color: "amber" };
      return { status: "poor", color: "red" };
    }
    // No missing alt — either descriptive or decorative (alt=""), both valid
    if (withAlt > 0) return { status: "excellent", color: "emerald" };
    // All decorative (alt="") — valid HTML pattern, not an error
    return { status: "good", color: "blue" };
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 60) return "emerald";
    if (score >= 40) return "amber";
    return "red";
  };

  const wordStatus = getWordCountStatus(metrics.wordCount);
  const headingCount = Object.values(metrics.headingCount).reduce(
    (a, b) => a + b,
    0,
  );
  const headingStatus = getHeadingStatus(headingCount);
  const imageStatus = getImageStatus(
    metrics.imageCount.total,
    metrics.imageCount.withAlt,
    metrics.imageCount.withoutAlt,
  );
  const totalLinks = metrics.linkCount.internal + metrics.linkCount.external;

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-success/10",
          text: "text-success",
          icon: "text-success",
        };
      case "blue":
        return {
          bg: "bg-info/10",
          text: "text-info",
          icon: "text-info",
        };
      case "amber":
        return {
          bg: "bg-warning/10",
          text: "text-warning",
          icon: "text-warning",
        };
      case "red":
        return {
          bg: "bg-destructive/10",
          text: "text-destructive",
          icon: "text-destructive",
        };
      default:
        return { bg: "bg-[var(--seo-surface-hover)]", text: "text-[var(--seo-text-muted)]", icon: "text-[var(--seo-text-muted)]" };
    }
  };

  const stats: Array<{
    label: string;
    value: string | number;
    icon: typeof Type;
    color: string;
    subtitle: string;
  }> = [
    {
      label: "Words",
      value: metrics.wordCount.toLocaleString(),
      icon: Type,
      color: wordStatus.color,
      subtitle: metrics.wordCount >= 300 ? "Good length" : "Add more content",
    },
    {
      label: "Headings",
      value: headingCount,
      icon: Hash,
      color: headingStatus.color,
      subtitle: `H1: ${metrics.headingCount.h1} \u2022 H2: ${metrics.headingCount.h2}`,
    },
    {
      label: "Images",
      value: metrics.imageCount.total,
      icon: ImageIcon,
      color: imageStatus.color,
      subtitle: (() => {
        const { total, withAlt, withoutAlt } = metrics.imageCount;
        const decorative = total - withAlt - withoutAlt;
        if (total === 0) return "No images";
        if (withoutAlt > 0) return `${withoutAlt} missing alt`;
        if (decorative === total) return 'all decorative (alt="")';
        if (decorative > 0) return `${withAlt} descriptive, ${decorative} decorative`;
        return `${withAlt} with alt text`;
      })(),
    },
    {
      label: "Links",
      value: totalLinks,
      icon: Link2,
      color: totalLinks > 0 ? "blue" : "muted",
      subtitle: `${metrics.linkCount.internal} int \u2022 ${metrics.linkCount.external} ext`,
    },
  ];

  // Add readability as 5th metric
  if (readability) {
    const readColor = getReadabilityColor(readability.fleschScore);
    stats.push({
      label: "Readability",
      value: Math.round(readability.fleschScore),
      icon: BookOpen,
      color: readColor,
      subtitle: `${readability.fleschGrade} \u2022 ~${readability.estimatedReadingTime}min`,
    });
  }

  const gridCols = stats.length >= 5 ? "sm:grid-cols-5" : "sm:grid-cols-4";

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-info" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            Content Metrics
          </span>
        </div>
        <CategoryReferenceInfo
          categoryKey="content"
          ariaLabel="Content metrics references"
        />
      </div>
      <div
        className={cn(
          "grid grid-cols-2 divide-x divide-y sm:divide-y-0 divide-[var(--seo-border)]",
          gridCols,
        )}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div key={stat.label} className="p-4 text-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center",
                  colors.bg,
                )}
              >
                <Icon className={cn("w-5 h-5", colors.icon)} />
              </div>
              <div
                className={cn("text-2xl font-bold tabular-nums", colors.text)}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium text-[var(--seo-text)] mt-1">
                {stat.label}
              </div>
              <div className="text-[10px] text-[var(--seo-text-muted)] mt-0.5">
                {stat.subtitle}
              </div>
            </div>
          );
        })}
      </div>
      {/* Content-to-code ratio */}
      {contentToCodeRatio !== undefined && (
        <div className="px-4 py-3 border-t border-[var(--seo-border)] flex items-center justify-between">
          <span className="text-[12px] text-[var(--seo-text-muted)]">Content-to-Code Ratio</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-[2px] bg-[var(--seo-surface-hover)] rounded-full overflow-hidden">
              <div
                ref={ratioRef}
                className={cn(
                  "h-full w-(--seo-ratio,0%) rounded-full",
                  contentToCodeRatio >= 25
                    ? "bg-success"
                    : contentToCodeRatio >= 10
                      ? "bg-warning"
                      : "bg-destructive",
                )}
              />
            </div>
            <span
              className={cn(
                "text-xs font-mono font-medium",
                contentToCodeRatio >= 25
                  ? "text-success"
                  : contentToCodeRatio >= 10
                    ? "text-warning"
                    : "text-destructive",
              )}
            >
              {contentToCodeRatio.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
