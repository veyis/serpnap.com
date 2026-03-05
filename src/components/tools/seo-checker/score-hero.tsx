import {
  Accessibility,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Code2,
  FileText,
  Languages,
  Layout,
  Shield,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SEOCheckResult, SEOIssue } from "@/schemas/seo-checker";
import {
  CategoryReferenceInfo,
  type SEOReferenceCategoryKey,
} from "./category-reference-info";

// Tailwind color classes for score ring
const SCORE_COLORS = {
  excellent: {
    stroke: "var(--color-success)",
    text: "text-success",
    glow: "var(--color-success)",
  },
  good: {
    stroke: "var(--color-warning)",
    text: "text-warning",
    glow: "var(--color-warning)",
  },
  poor: {
    stroke: "var(--color-destructive)",
    text: "text-destructive",
    glow: "var(--color-destructive)",
  },
} as const;

export function ScoreHero({
  result,
  url,
  animatedScore,
  showContent,
}: {
  result: SEOCheckResult;
  url: string;
  animatedScore: number;
  showContent: boolean;
}) {
  const allIssues = (() => {
    const issues: Array<SEOIssue & { categoryName: string }> = [];
    const categoryNames = [
      "technical",
      "meta",
      "content",
      "structured",
    ] as const;
    for (const catName of categoryNames) {
      const cat = result.categories[catName];
      for (const issue of cat.issues) {
        issues.push({ ...issue, categoryName: catName });
      }
    }
    if (result.categories.accessibility) {
      for (const issue of result.categories.accessibility.issues) {
        issues.push({ ...issue, categoryName: "accessibility" });
      }
    }
    if (result.categories.international) {
      for (const issue of result.categories.international.issues) {
        issues.push({ ...issue, categoryName: "international" });
      }
    }
    if (result.categories.eeat) {
      for (const issue of result.categories.eeat.issues) {
        issues.push({ ...issue, categoryName: "eeat" });
      }
    }
    if (result.categories.mobile) {
      for (const issue of result.categories.mobile.issues) {
        issues.push({ ...issue, categoryName: "mobile" });
      }
    }
    return issues;
  })();

  const getScoreTier = (score: number) => {
    if (score >= 80) return SCORE_COLORS.excellent;
    if (score >= 60) return SCORE_COLORS.good;
    return SCORE_COLORS.poor;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };

  const getGradeStyle = (grade: string) => {
    if (grade.startsWith("A")) return "text-success bg-success/10";
    if (grade.startsWith("B")) return "text-info bg-info/10";
    if (grade.startsWith("C")) return "text-warning bg-warning/10";
    return "text-destructive bg-destructive/10";
  };

  const categoryIcons: Record<string, typeof Shield> = {
    technical: Shield,
    meta: FileText,
    content: Layout,
    structured: Code2,
    accessibility: Accessibility,
    international: Languages,
    eeat: ShieldCheck,
    mobile: Smartphone,
  };

  const categoryLabels: Record<string, string> = {
    technical: "Technical",
    meta: "Meta Tags",
    content: "Content",
    structured: "Schema",
    accessibility: "A11y",
    international: "Intl",
    eeat: "E-E-A-T",
    mobile: "Mobile",
  };

  const categoryNames: SEOReferenceCategoryKey[] = [
    "technical",
    "meta",
    "content",
    "structured",
    "accessibility",
    "international",
    "eeat",
    "mobile",
  ];
  const errorCount = allIssues.filter((i) => i.type === "error").length;
  const warningCount = allIssues.filter((i) => i.type === "warning").length;

  const tier = getScoreTier(animatedScore);
  const circumference = 2 * Math.PI * 68;

  return (
    <div className="overflow-y-auto">
      {/* Score Hero — centered with ambient glow */}
      <div className="relative px-6 sm:px-8 py-14 sm:py-20 flex flex-col items-center text-center">
        {/* Ambient glow behind ring */}
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{
            backgroundColor: tier.glow,
            opacity: 0.06,
            animation: "seo-glow-pulse 4s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        {/* Activity Ring Score */}
        <div
          className="relative w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] mb-8"
          style={{
            animation:
              "seo-score-pop 600ms cubic-bezier(0.34,1.56,0.64,1) 300ms both",
          }}
        >
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            <title>SEO score {animatedScore}</title>
            {/* Track */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="var(--seo-track)"
              strokeWidth="7"
            />
            {/* Progress arc with glow */}
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke={tier.stroke}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${(animatedScore / 100) * circumference} ${circumference}`}
              className="transition-[stroke-dasharray] duration-300"
              style={{
                filter: `drop-shadow(0 0 12px color-mix(in srgb, ${tier.stroke} 40%, transparent))`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "text-[56px] sm:text-[64px] font-extralight tabular-nums leading-none tracking-tight",
                tier.text,
              )}
            >
              {animatedScore}
            </span>
          </div>
        </div>

        {/* Grade pill + score label inline */}
        <div
          className="flex items-center gap-3 mb-3"
          style={{
            animation:
              "seo-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms both",
          }}
        >
          {result.grade && (
            <span
              className={cn(
                "px-3.5 py-1 rounded-full text-[14px] font-semibold",
                getGradeStyle(result.grade),
              )}
            >
              {result.grade}
            </span>
          )}
          <span
            className={cn(
              "text-[20px] font-semibold tracking-tight",
              tier.text,
            )}
          >
            {getScoreLabel(result.overallScore)}
          </span>
        </div>

        {/* Issue counts */}
        <div
          className="flex items-center justify-center gap-4 text-[14px] mb-3"
          style={{
            animation:
              "seo-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both",
          }}
        >
          {errorCount > 0 && (
            <span className="flex items-center gap-1.5 text-destructive">
              <XCircle className="w-4 h-4" />
              {errorCount} {errorCount === 1 ? "error" : "errors"}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="w-4 h-4" />
              {warningCount} {warningCount === 1 ? "warning" : "warnings"}
            </span>
          )}
          {errorCount === 0 && warningCount === 0 && (
            <span className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="w-4 h-4" />
              All checks passed
            </span>
          )}
        </div>

        {/* URL + checks count */}
        <div
          className="text-[13px] text-(--seo-text-muted) truncate max-w-full"
          style={{
            animation:
              "seo-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) 800ms both",
          }}
        >
          {url}
          {result.totalChecksRun && (
            <span className="text-(--seo-text-faint)">
              {" "}
              &middot; {result.totalChecksRun} checks
            </span>
          )}
        </div>
      </div>

      {/* Category Cards — stagger in with shadows */}
      <div
        className={cn(
          "transition-all duration-500",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoryNames.map((catName, i) => {
              const cat =
                result.categories[catName as keyof typeof result.categories];
              if (!cat) return null;
              const Icon = categoryIcons[catName] || Shield;
              const issues = cat.issues;
              const problemCount = issues.filter(
                (i) => i.type === "error" || i.type === "warning",
              ).length;
              const passCount = issues.filter(
                (i) => i.type === "success",
              ).length;
              const catTier = getScoreTier(cat.score);

              return (
                <div
                  key={catName}
                  className="p-4 rounded-2xl bg-(--seo-surface) shadow-(--seo-card-shadow) hover:shadow-(--seo-card-shadow-hover) hover:bg-(--seo-surface-hover) transition-all duration-300 cursor-default"
                  style={{
                    animation: `seo-scale-in 400ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms both`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-(--seo-surface-hover) flex items-center justify-center">
                      <Icon className="w-4 h-4 text-(--seo-icon)" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CategoryReferenceInfo
                        categoryKey={catName}
                        stopPropagation
                        iconClassName="text-(--seo-text-faint)"
                        panelClassName="w-60"
                      />
                      <span
                        className={cn(
                          "text-lg font-semibold tabular-nums",
                          catTier.text,
                        )}
                      >
                        {cat.score}
                      </span>
                    </div>
                  </div>
                  <div className="text-[14px] text-(--seo-text-secondary)">
                    {categoryLabels[catName] || catName}
                  </div>
                  {/* Thin progress bar */}
                  <div className="h-[2px] bg-(--seo-border) rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{
                        width: `${cat.score}%`,
                        backgroundColor: catTier.stroke,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-(--seo-text-faint) mt-2">
                    {problemCount > 0
                      ? `${problemCount} ${problemCount === 1 ? "issue" : "issues"}`
                      : `${passCount} passed`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint — minimal */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="flex items-center justify-center gap-2 text-(--seo-text-faint) text-[12px] py-2">
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            <span>Full report below</span>
          </div>
        </div>
      </div>
    </div>
  );
}
