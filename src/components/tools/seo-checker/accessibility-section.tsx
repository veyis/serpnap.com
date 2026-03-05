import { Accessibility, Eye, FileText, Hash, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Accessibility as AccessibilityData } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

export function AccessibilitySection({
  accessibility,
}: {
  accessibility: AccessibilityData;
}) {
  const stats = [
    {
      label: "Skip Link",
      value: accessibility.hasSkipLink ? "Found" : "Missing",
      pass: accessibility.hasSkipLink,
      icon: Eye,
    },
    {
      label: "Landmarks",
      value: accessibility.hasLandmarks ? "Present" : "Missing",
      pass: accessibility.hasLandmarks,
      icon: Layout,
    },
    {
      label: "Form Labels",
      value:
        accessibility.formsWithoutLabels > 0
          ? `${accessibility.formsWithoutLabels} missing`
          : `${accessibility.formLabelsCount} found`,
      pass: accessibility.formsWithoutLabels === 0,
      icon: FileText,
    },
    {
      label: "Tab Order",
      value: accessibility.hasPositiveTabindex ? "Issues" : "Clean",
      pass: !accessibility.hasPositiveTabindex,
      icon: Hash,
    },
  ];

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Accessibility className="w-4 h-4 text-primary" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            Accessibility Snapshot
          </span>
        </div>
        <CategoryReferenceInfo
          categoryKey="accessibility"
          ariaLabel="Accessibility references"
        />
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-[var(--seo-border)]">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 text-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center",
                  stat.pass ? "bg-primary/10" : "bg-destructive/10",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    stat.pass ? "text-primary" : "text-destructive",
                  )}
                />
              </div>
              <div
                className={cn(
                  "text-sm font-semibold",
                  stat.pass ? "text-primary" : "text-destructive",
                )}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium text-[var(--seo-text)] mt-1">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
