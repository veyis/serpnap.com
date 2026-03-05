import {
  CheckCircle2,
  Eye,
} from "lucide-react";
import type { ContrastAnalysis } from "@/schemas/seo-checker";

export function ContrastSection({ data }: { data: ContrastAnalysis }) {
  if (data.checkedPairs === 0) return null;

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">Color Contrast (WCAG AA)</span>
        </div>
        <span className="text-xs text-[var(--seo-text-muted)]">{data.checkedPairs} pairs checked</span>
      </div>
      <div className="p-4 space-y-3">
        {data.violationCount === 0 ? (
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>All {data.checkedPairs} color pairs pass WCAG AA</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-destructive uppercase tracking-wider font-medium">
              {data.violationCount} Violation{data.violationCount > 1 ? "s" : ""}
            </div>
            {data.violations.map((v, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <div
                    className="w-5 h-5 rounded border border-[var(--seo-border)]"
                    style={{ backgroundColor: v.foreground }}
                    title={`Foreground: ${v.foreground}`}
                  />
                  <div
                    className="w-5 h-5 rounded border border-[var(--seo-border)]"
                    style={{ backgroundColor: v.background }}
                    title={`Background: ${v.background}`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[var(--seo-text)] text-xs">
                    <span className="text-destructive font-mono">{v.ratio}:1</span>
                    <span className="text-[var(--seo-text-muted)] mx-1">/</span>
                    <span className="text-[var(--seo-text-secondary)]">need {v.requiredRatio}:1{v.isLargeText ? " (large text)" : ""}</span>
                  </div>
                  <div className="text-[var(--seo-text-muted)] text-xs truncate">{v.context}</div>
                </div>
              </div>
            ))}
            {data.passCount > 0 && (
              <div className="text-xs text-[var(--seo-text-muted)]">{data.passCount} other pair{data.passCount > 1 ? "s" : ""} pass</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
