import { cn } from "@/lib/utils";
import type { SEOGrade } from "@/schemas/seo-checker";

function GradeBadge({ grade, score }: { grade: SEOGrade; score: number }) {
  const getGradeStyle = (g: string) => {
    if (g.startsWith("A")) return { color: "text-success", bg: "bg-success/10", label: "Excellent" };
    if (g.startsWith("B")) return { color: "text-info", bg: "bg-info/10", label: "Good" };
    if (g.startsWith("C")) return { color: "text-warning", bg: "bg-warning/10", label: "Average" };
    return { color: "text-destructive", bg: "bg-destructive/10", label: "Below Average" };
  };

  const style = getGradeStyle(grade);

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden">
      <div className="p-6 flex items-center justify-center gap-6">
        <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center", style.bg)}>
          <span className={cn("text-4xl font-bold tracking-tight", style.color)}>{grade}</span>
        </div>
        <div>
          <div className={cn("text-lg font-semibold", style.color)}>{style.label}</div>
          <div className="text-[14px] text-[var(--seo-text-muted)]">
            {score >= 90 ? "Top 10% of websites" :
             score >= 75 ? "Above average" :
             score >= 60 ? "Room for improvement" :
             "Needs significant work"}
          </div>
          <div className="text-[12px] text-[var(--seo-text-faint)] mt-1">
            Score: {score}/100
          </div>
        </div>
      </div>
    </div>
  );
}

export { GradeBadge };
