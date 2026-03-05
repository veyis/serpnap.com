import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UrlAnalysis } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

export function URLAnalysisSection({
  urlAnalysis,
  url,
}: {
  urlAnalysis: UrlAnalysis;
  url: string;
}) {
  const checks = [
    {
      label: "URL Length",
      value: `${urlAnalysis.length} chars`,
      pass: urlAnalysis.length <= 75,
      detail: urlAnalysis.length <= 75 ? "Good length" : "Too long (>75)",
    },
    {
      label: "Depth",
      value: `${urlAnalysis.depth} levels`,
      pass: urlAnalysis.depth <= 3,
      detail: urlAnalysis.depth <= 3 ? "Good depth" : "Too deep",
    },
    {
      label: "Clean URL",
      value: urlAnalysis.isClean ? "Yes" : "No",
      pass: urlAnalysis.isClean,
      detail: urlAnalysis.isClean ? "SEO-friendly" : "Has special chars",
    },
    {
      label: "Trailing Slash",
      value: urlAnalysis.trailingSlashConsistent
        ? "Consistent"
        : "Inconsistent",
      pass: urlAnalysis.trailingSlashConsistent,
      detail: urlAnalysis.trailingSlashConsistent
        ? "Good"
        : "May cause duplicates",
    },
  ];

  // Parse URL into parts for visual breakdown
  let urlParts: { protocol: string; domain: string; path: string[] } = {
    protocol: "",
    domain: "",
    path: [],
  };
  try {
    const parsed = new URL(
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`,
    );
    urlParts = {
      protocol: parsed.protocol.replace(":", ""),
      domain: parsed.hostname,
      path: parsed.pathname.split("/").filter(Boolean),
    };
  } catch {}

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-info" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">URL Analysis</span>
        </div>
        <CategoryReferenceInfo
          categoryKey="technical"
          ariaLabel="URL analysis references"
        />
      </div>

      {/* URL breakdown */}
      <div className="px-4 py-3 border-b border-[var(--seo-border)]">
        <div className="flex items-center gap-1 flex-wrap font-mono text-xs">
          <span className="px-2 py-1 rounded bg-info/10 text-info">
            {urlParts.protocol}://
          </span>
          <span className="px-2 py-1 rounded bg-success/10 text-success">
            {urlParts.domain}
          </span>
          {urlParts.path.map((segment, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: path segments can repeat, order matters
            <span key={`${segment}-${idx}`} className="flex items-center gap-1">
              <span className="text-[var(--seo-text-muted)]">/</span>
              <span className="px-2 py-1 rounded bg-[var(--seo-surface-hover)] text-[var(--seo-text-secondary)]">
                {segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[var(--seo-border)]">
        {checks.map((check) => (
          <div key={check.label} className="p-3 text-center">
            <div
              className={cn(
                "text-sm font-semibold mb-1",
                check.pass ? "text-success" : "text-warning",
              )}
            >
              {check.value}
            </div>
            <div className="text-[11px] text-[var(--seo-text)] font-medium">
              {check.label}
            </div>
            <div className="text-[10px] text-[var(--seo-text-muted)]">{check.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
