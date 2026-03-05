import { Sparkles } from "lucide-react";

function TopRecommendations({
  recommendations,
}: {
  recommendations: string[];
}) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-warning" />
        <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
          Top Recommendations
        </span>
      </div>
      <div className="p-4 space-y-2">
        {recommendations.slice(0, 5).map((rec, i) => (
          <div
            key={rec}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--seo-surface-elevated)] border-l-2 border-l-warning/30"
          >
            <span className="text-[11px] font-bold text-warning tabular-nums mt-0.5 shrink-0">
              {i + 1}
            </span>
            <p className="text-[13px] text-[var(--seo-text)] leading-relaxed">
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TopRecommendations };
