import { AlertTriangle, CheckCircle2, Link2, XCircle } from "lucide-react";
import type { BrokenLinkAnalysis } from "@/schemas/seo-checker";

export function BrokenLinksSection({ data }: { data: BrokenLinkAnalysis }) {
  if (data.checkedCount === 0) return null;
  const hardBrokenLinks = data.brokenLinks.filter((l) => l.type === "broken");
  const unresolvedLinks = data.brokenLinks.filter((l) => l.type !== "broken");
  const hasHardBrokenLinks = hardBrokenLinks.length > 0;
  const normalizeConfidence = (value: unknown): "high" | "low" =>
    value === "low" ? "low" : "high";
  const confidenceLabel = (value: "high" | "low") =>
    value === "high" ? "High confidence" : "Low confidence";
  const confidenceTextClass = (value: "high" | "low") =>
    value === "high" ? "text-success" : "text-warning";
  const getConfidenceReason = (link: {
    confidence?: unknown;
    confidenceReason?: string;
  }) => {
    if (normalizeConfidence(link.confidence) === "high") return undefined;
    return (
      link.confidenceReason ??
      "Result may be affected by timeout/network/firewall behavior"
    );
  };

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-info" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            Outbound Link Health
          </span>
        </div>
        <span className="text-xs text-[var(--seo-text-muted)]">
          {data.checkedCount} checked
          {data.skippedCount > 0 ? `, ${data.skippedCount} skipped` : ""}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {!hasHardBrokenLinks ? (
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              No hard-broken outbound links in {data.checkedCount} checks
            </span>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="text-xs text-destructive uppercase tracking-wider font-medium">
                Broken Links
              </div>
              {hardBrokenLinks.map((link, i) => {
                const confidence = normalizeConfidence(link.confidence);
                return (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[var(--seo-text)] truncate font-mono text-xs">
                        {link.url}
                      </div>
                      <div className="text-destructive text-xs">
                        {link.statusCode > 0
                          ? `${link.statusCode} ${link.statusText}`
                          : link.statusText}
                      </div>
                      <div
                        className={`text-[11px] ${confidenceTextClass(confidence)}`}
                      >
                        {confidenceLabel(confidence)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {unresolvedLinks.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-warning uppercase tracking-wider font-medium">
              Unresolved Checks
            </div>
            {unresolvedLinks.map((link, i) => {
              const confidence = normalizeConfidence(link.confidence);
              const confidenceReason = getConfidenceReason(link);
              return (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[var(--seo-text)] truncate font-mono text-xs">
                      {link.url}
                    </div>
                    <div className="text-warning text-xs">
                      {link.statusCode > 0
                        ? `${link.statusCode} ${link.statusText}`
                        : link.statusText}
                    </div>
                    <div
                      className={`text-[11px] ${confidenceTextClass(confidence)}`}
                    >
                      {confidenceLabel(confidence)}
                    </div>
                    {confidenceReason && (
                      <div className="text-[11px] text-[var(--seo-text-secondary)]">
                        {confidenceReason}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {data.redirectLinks.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-warning uppercase tracking-wider font-medium">
              Redirecting Links
            </div>
            {data.redirectLinks.map((link, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[var(--seo-text)] truncate font-mono text-xs">
                    {link.url}
                  </div>
                  <div className="text-warning text-xs">
                    {link.statusCode} Redirect
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
