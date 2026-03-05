"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { SEOCheckResult } from "@/schemas/seo-checker";

function ChecksPassedCounter({ result }: { result: SEOCheckResult }) {
  const allIssues = Object.values(result.categories).flatMap(cat => cat?.issues || []);
  const passed = allIssues.filter(i => i.type === "success").length;
  const total = allIssues.length;
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
  const pctRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pctRef.current) pctRef.current.style.setProperty("--seo-pct", `${percentage}%`);
  }, [percentage]);

  return (
    <div className="p-4 rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-medium text-[var(--seo-text)]">{passed}/{total} checks passed</span>
        <span className={cn(
          "text-[14px] font-bold tabular-nums",
          percentage >= 70 ? "text-success" : percentage >= 50 ? "text-warning" : "text-destructive"
        )}>{percentage}%</span>
      </div>
      <div className="h-[2px] bg-[var(--seo-border)] rounded-full overflow-hidden">
        <div
          ref={pctRef}
          className={cn(
            "h-full w-(--seo-pct,0%) rounded-full transition-[width] duration-700",
            percentage >= 70 ? "bg-success" : percentage >= 50 ? "bg-warning" : "bg-destructive"
          )}
        />
      </div>
    </div>
  );
}

export { ChecksPassedCounter };
