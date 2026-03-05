"use client";

import { useState } from "react";
import { Check, Minus, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LighthouseEstimation } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

export function LighthouseGauge({
  score,
  label,
  confidence,
}: {
  score: number;
  label: string;
  confidence: "low" | "medium" | "high";
}) {
  const color =
    score >= 90
      ? "var(--color-success)"
      : score >= 50
        ? "var(--color-warning)"
        : "var(--color-destructive)";
  const textColor =
    score >= 90
      ? "text-success"
      : score >= 50
        ? "text-warning"
        : "text-destructive";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;
  const confidenceColor =
    confidence === "high"
      ? "bg-success"
      : confidence === "medium"
        ? "bg-warning"
        : "bg-destructive";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90"
          viewBox="0 0 80 80"
          role="img"
          aria-label={`${label} score ${score}`}
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--seo-track)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "text-xl sm:text-2xl font-bold tabular-nums",
              textColor,
            )}
          >
            {score}
          </span>
        </div>
      </div>
      <span className="text-[11px] text-[var(--seo-text-secondary)] tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <div className={cn("w-1.5 h-1.5 rounded-full", confidenceColor)} />
        <span className="text-[9px] text-[var(--seo-text-muted)] uppercase tracking-widest">
          {confidence}
        </span>
      </div>
    </div>
  );
}

export function LighthouseEstimationSection({
  data,
}: {
  data: LighthouseEstimation;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const cats = [
    { key: "performance", label: "Perf", data: data.performance },
    { key: "accessibility", label: "A11y", data: data.accessibility },
    { key: "bestPractices", label: "Best P.", data: data.bestPractices },
    { key: "seo", label: "SEO", data: data.seo },
  ] as const;

  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)]">
      <div className="px-4 sm:px-5 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            Lighthouse Estimation
          </span>
          <CategoryReferenceInfo
            categoryKey="technical"
            ariaLabel="Lighthouse references"
            align="left"
          />
        </div>
        <span className="text-[10px] text-[var(--seo-text-faint)] uppercase tracking-wider">
          est. scores
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {cats.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setExpanded(expanded === cat.key ? null : cat.key)}
              className="focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--seo-dialog-bg)] rounded-lg group outline-none"
              aria-expanded={expanded === cat.key}
              aria-label={`${cat.label} score ${cat.data.score}, click to ${expanded === cat.key ? "collapse" : "expand"} details`}
            >
              <LighthouseGauge
                score={cat.data.score}
                label={cat.label}
                confidence={cat.data.confidence}
              />
            </button>
          ))}
        </div>

        {/* Expanded audit details */}
        {expanded &&
          (() => {
            const cat = cats.find((c) => c.key === expanded);
            if (!cat || cat.data.audits.length === 0) return null;
            return (
              <div className="mt-4 pt-4 border-t border-[var(--seo-border)]">
                <div className="text-[11px] text-[var(--seo-text-muted)] uppercase tracking-wider mb-2">
                  {cat.label} Audits
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {cat.data.audits.map((audit) => (
                    <div
                      key={audit.name}
                      className="flex items-center gap-2 py-0.5"
                    >
                      {audit.score >= 1 ? (
                        <Check className="w-3 h-3 text-success shrink-0" />
                      ) : audit.score > 0 ? (
                        <Minus className="w-3 h-3 text-warning shrink-0" />
                      ) : (
                        <X className="w-3 h-3 text-destructive shrink-0" />
                      )}
                      <span className="text-[11px] text-[var(--seo-text-muted)] truncate">
                        {audit.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        <p className="text-[10px] text-[var(--seo-text-faint)] mt-4 leading-relaxed">
          Estimated from HTML analysis. Run{" "}
          <a
            href="https://pagespeed.web.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--seo-text-muted)] underline decoration-[var(--seo-text-faint)] hover:text-[var(--seo-text-secondary)] transition-colors"
          >
            Lighthouse
          </a>{" "}
          for exact scores.
        </p>
      </div>
    </div>
  );
}
