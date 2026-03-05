import {
  AlertTriangle,
  CheckCircle2,
  Link as LinkIcon,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InternalLinkStructure } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

export function InternalLinksSection({
  data,
}: {
  data: InternalLinkStructure;
}) {
  if (data.totalLinks === 0) return null;

  const hasIssues =
    data.genericAnchors.length > 0 ||
    data.emptyAnchors.length > 0 ||
    data.duplicateLinks.length > 0;

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-info" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            Internal Link Structure
          </span>
          <CategoryReferenceInfo
            categoryKey="content"
            ariaLabel="Internal linking references"
            align="left"
          />
        </div>
        <span className="text-xs text-[var(--seo-text-muted)]">
          {data.totalLinks} links, {data.uniqueDestinations} unique
        </span>
      </div>
      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[var(--seo-surface)] rounded-lg p-2.5 text-center">
            <div className="text-xs text-[var(--seo-text-muted)] mb-1">Content Links</div>
            <div className="text-lg font-bold text-[var(--seo-text)]">
              {data.contentBodyLinks}
            </div>
          </div>
          <div className="bg-[var(--seo-surface)] rounded-lg p-2.5 text-center">
            <div className="text-xs text-[var(--seo-text-muted)] mb-1">Nav Links</div>
            <div className="text-lg font-bold text-[var(--seo-text)]">
              {data.navigationLinks}
            </div>
          </div>
          <div className="bg-[var(--seo-surface)] rounded-lg p-2.5 text-center">
            <div className="text-xs text-[var(--seo-text-muted)] mb-1">Unique URLs</div>
            <div className="text-lg font-bold text-[var(--seo-text)]">
              {data.uniqueDestinations}
            </div>
          </div>
          <div className="bg-[var(--seo-surface)] rounded-lg p-2.5 text-center">
            <div className="text-xs text-[var(--seo-text-muted)] mb-1">Int:Ext Ratio</div>
            <div
              className={cn(
                "text-lg font-bold",
                data.internalToExternalRatio < 1
                  ? "text-warning"
                  : "text-[var(--seo-text)]",
              )}
            >
              {data.internalToExternalRatio}:1
            </div>
          </div>
        </div>

        {/* Depth Distribution */}
        {Object.keys(data.depthDistribution).length > 0 && (
          <div>
            <div className="text-xs text-[var(--seo-text-muted)] uppercase tracking-wider font-medium mb-2">
              Link Depth Distribution
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(data.depthDistribution)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([depth, count]) => (
                  <span
                    key={depth}
                    className="inline-flex items-center gap-1 bg-[var(--seo-surface-hover)] text-[var(--seo-text-secondary)] text-xs px-2 py-1 rounded-full"
                  >
                    <span className="text-[var(--seo-text-muted)]">depth {depth}:</span>
                    <span className="text-[var(--seo-text)] font-medium">{count}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {hasIssues ? (
          <div className="space-y-3">
            {data.emptyAnchors.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-destructive uppercase tracking-wider font-medium">
                  Empty Anchor Text ({data.emptyAnchors.length})
                </div>
                {data.emptyAnchors.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[var(--seo-text)] truncate font-mono text-xs">
                        {item.href}
                      </div>
                      <div className="text-[var(--seo-text-muted)] text-xs">{item.context}</div>
                    </div>
                  </div>
                ))}
                {data.emptyAnchors.length > 5 && (
                  <div className="text-xs text-[var(--seo-text-muted)]">
                    + {data.emptyAnchors.length - 5} more...
                  </div>
                )}
              </div>
            )}
            {data.genericAnchors.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-warning uppercase tracking-wider font-medium">
                  Generic Anchor Text ({data.genericAnchors.length})
                </div>
                {data.genericAnchors.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-warning text-xs">
                        &quot;{item.anchor}&quot;
                      </div>
                      <div className="text-[var(--seo-text-muted)] truncate font-mono text-xs">
                        {item.href}
                      </div>
                    </div>
                  </div>
                ))}
                {data.genericAnchors.length > 5 && (
                  <div className="text-xs text-[var(--seo-text-muted)]">
                    + {data.genericAnchors.length - 5} more...
                  </div>
                )}
              </div>
            )}
            {data.duplicateLinks.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-warning uppercase tracking-wider font-medium">
                  Excessive Duplicate Links ({data.duplicateLinks.length})
                </div>
                {data.duplicateLinks.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[var(--seo-text)] truncate font-mono text-xs">
                        {item.href}
                      </div>
                      <div className="text-[var(--seo-text-muted)] text-xs">
                        {item.count}x — anchors:{" "}
                        {item.anchors
                          .slice(0, 3)
                          .map((a) => `"${a}"`)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
                {data.duplicateLinks.length > 5 && (
                  <div className="text-xs text-[var(--seo-text-muted)]">
                    + {data.duplicateLinks.length - 5} more...
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Internal link structure looks healthy</span>
          </div>
        )}

        {/* Fragment-only info */}
        {data.fragmentOnlyLinks > 0 && (
          <div className="text-xs text-[var(--seo-text-muted)]">
            {data.fragmentOnlyLinks} fragment-only link
            {data.fragmentOnlyLinks > 1 ? "s" : ""} (anchor jumps)
          </div>
        )}
      </div>
    </div>
  );
}
