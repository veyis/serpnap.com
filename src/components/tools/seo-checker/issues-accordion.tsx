"use client";

import { useId, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Lock,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SEOCheckResult, SEOIssue } from "@/schemas/seo-checker";
import { CATEGORY_LABEL_TO_KEY } from "@/lib/data/seo-references";
import {
  CategoryReferenceInfo,
  type SEOReferenceCategoryKey,
} from "./category-reference-info";

// ============================================================================
// Issues Accordion (Dark themed, 3-tier)
// ============================================================================

type IssueWithLabel = SEOIssue & { categoryLabel: string };
type SectionType = "errors" | "warnings" | "success";

type IssueSectionProps = {
  type: SectionType;
  items: IssueWithLabel[];
  icon: typeof XCircle;
  label: string;
  color: string;
  borderColor: string;
  subtitle: string;
  isExpanded: boolean;
  copiedKey: string | null;
  onToggle: (type: SectionType) => void;
  onCopy: (text: string, key: string) => void;
};

function IssueSection({
  type,
  items,
  icon: Icon,
  label,
  color,
  borderColor,
  subtitle,
  isExpanded,
  copiedKey,
  onToggle,
  onCopy,
}: IssueSectionProps) {
  const panelId = useId();
  if (items.length === 0) return null;
  const sectionReferenceKeys = Array.from(
    new Set(
      items
        .map((item) => CATEGORY_LABEL_TO_KEY[item.categoryLabel])
        .filter((value): value is SEOReferenceCategoryKey => Boolean(value)),
    ),
  );

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] border",
        borderColor,
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => onToggle(type)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle(type);
          }
        }}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--seo-surface-hover)] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              type === "errors"
                ? "bg-destructive/20"
                : type === "warnings"
                  ? "bg-warning/20"
                  : "bg-success/20",
            )}
          >
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <div className="text-left">
            <span className={cn("text-sm font-semibold", color)}>{label}</span>
            <p className="text-[11px] text-[var(--seo-text-muted)]">
              {subtitle}
            </p>
            {sectionReferenceKeys.length > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[10px] text-[var(--seo-text-muted)] font-mono uppercase tracking-wide">
                  sources
                </span>
                {sectionReferenceKeys.slice(0, 3).map((referenceKey) => (
                  <CategoryReferenceInfo
                    key={`${type}-${referenceKey}`}
                    categoryKey={referenceKey}
                    ariaLabel={`${label} references`}
                    align="left"
                    stopPropagation
                    buttonClassName="hover:bg-[var(--seo-surface-hover)]"
                  />
                ))}
                {sectionReferenceKeys.length > 3 && (
                  <span className="text-[10px] text-[var(--seo-text-muted)]">
                    +{sectionReferenceKeys.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("text-lg font-bold tabular-nums", color)}>
            {items.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[var(--seo-text-muted)]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--seo-text-muted)]" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div id={panelId} className="px-4 pb-4 space-y-2">
          {items.map((issue, idx) => {
            const copyKey = `${type}-${idx}`;
            const referenceKey = CATEGORY_LABEL_TO_KEY[issue.categoryLabel];
            return (
              <div
                key={`${issue.categoryLabel}-${issue.message}-${idx}`}
                className={cn(
                  "p-4 rounded-xl bg-[var(--seo-surface-elevated)] hover:bg-[var(--seo-surface-hover)] transition-colors group border-l-2",
                  type === "errors"
                    ? "border-l-destructive/40"
                    : type === "warnings"
                      ? "border-l-warning/40"
                      : "border-l-success/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--seo-surface-hover)] text-[10px] font-medium text-[var(--seo-text-secondary)] mb-2">
                      {issue.categoryLabel}
                      {referenceKey && (
                        <CategoryReferenceInfo
                          categoryKey={referenceKey}
                          ariaLabel={`References for ${issue.categoryLabel}`}
                          align="left"
                          stopPropagation
                          buttonClassName="hover:bg-[var(--seo-surface-hover)]"
                        />
                      )}
                    </span>

                    <p className="text-sm font-medium text-[var(--seo-text)] leading-relaxed">
                      {issue.message}
                    </p>

                    {issue.fix && (
                      <div className="relative mt-3 p-3 rounded-lg bg-warning/5 border border-warning/10 overflow-hidden group/fix">
                        <div className="flex items-center gap-2 mb-1.5 opacity-50">
                          <Zap className="w-3.5 h-3.5 text-warning" />
                          <span className="text-[11px] font-semibold text-warning uppercase tracking-wider">
                            AI Recommended Fix
                          </span>
                        </div>
                        <p className="text-[12px] text-[var(--seo-text-secondary)] leading-relaxed blur-[5px] select-none opacity-60">
                          {issue.fix}
                        </p>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1.5px] opacity-0 group-hover/fix:opacity-100 transition-opacity duration-300">
                          <Link href="/#pricing" className="px-4 py-1.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors text-[11px] font-bold shadow-md flex items-center gap-1.5">
                            <Lock className="w-3 h-3" />
                            Unlock all fixes
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {issue.fix && (
                    <button
                      type="button"
                      onClick={() =>
                        onCopy(`${issue.message}\n\nFix: ${issue.fix}`, copyKey)
                      }
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--seo-surface-hover)] transition-[background-color,opacity] shrink-0"
                      title="Copy issue and fix"
                    >
                      {copiedKey === copyKey ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-[var(--seo-text-muted)]" />
                      )}
                    </button>
                  )}
                </div>

                {issue.impact && (
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                        issue.impact === "high"
                          ? "bg-destructive text-white"
                          : issue.impact === "medium"
                            ? "bg-warning text-white"
                            : "bg-[var(--seo-surface-active)] text-[var(--seo-text-secondary)]",
                      )}
                    >
                      {issue.impact}
                    </span>
                    <span className="text-[10px] text-[var(--seo-text-muted)]">
                      {issue.impact === "high"
                        ? "+10 pts potential"
                        : issue.impact === "medium"
                          ? "+5 pts potential"
                          : "+2 pts potential"}
                    </span>
                  </div>
                )}
                {!issue.impact && type === "errors" && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-destructive text-[10px] font-bold text-white uppercase tracking-wide">
                      High Priority
                    </span>
                    <span className="text-[10px] text-[var(--seo-text-muted)]">
                      Significantly impacts SEO performance
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function IssuesAccordion({
  categories,
}: {
  categories: SEOCheckResult["categories"];
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const allIssues: IssueWithLabel[] = [
    ...categories.technical.issues.map((i) => ({
      ...i,
      categoryLabel: "Technical",
    })),
    ...categories.meta.issues.map((i) => ({
      ...i,
      categoryLabel: "Meta Tags",
    })),
    ...categories.content.issues.map((i) => ({
      ...i,
      categoryLabel: "Content",
    })),
    ...categories.structured.issues.map((i) => ({
      ...i,
      categoryLabel: "Schema",
    })),
    ...(categories.accessibility?.issues || []).map((i) => ({
      ...i,
      categoryLabel: "Accessibility",
    })),
    ...(categories.international?.issues || []).map((i) => ({
      ...i,
      categoryLabel: "International",
    })),
    ...(categories.eeat?.issues || []).map((i) => ({
      ...i,
      categoryLabel: "E-E-A-T",
    })),
    ...(categories.mobile?.issues || []).map((i) => ({
      ...i,
      categoryLabel: "Mobile",
    })),
  ];

  const errors = allIssues.filter((i) => i.type === "error");
  const warnings = allIssues.filter((i) => i.type === "warning");
  const successes = allIssues.filter((i) => i.type === "success");

  const defaultSection: SectionType | null =
    errors.length > 0
      ? "errors"
      : warnings.length > 0
        ? "warnings"
        : successes.length > 0
          ? "success"
          : null;
  const [expanded, setExpanded] = useState<SectionType | null>(defaultSection);

  const handleToggle = (type: SectionType) => {
    setExpanded((current) => (current === type ? null : type));
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  return (
    <div className="space-y-3">
      <IssueSection
        type="errors"
        items={errors}
        icon={XCircle}
        label="Critical Issues"
        color="text-destructive"
        borderColor=""
        subtitle="Fix these first for maximum impact"
        isExpanded={expanded === "errors"}
        copiedKey={copiedKey}
        onToggle={handleToggle}
        onCopy={handleCopy}
      />
      <IssueSection
        type="warnings"
        items={warnings}
        icon={AlertTriangle}
        label="Warnings"
        color="text-warning"
        borderColor=""
        subtitle="Improvements to boost your score"
        isExpanded={expanded === "warnings"}
        copiedKey={copiedKey}
        onToggle={handleToggle}
        onCopy={handleCopy}
      />
      <IssueSection
        type="success"
        items={successes}
        icon={CheckCircle2}
        label="Passed Checks"
        color="text-success"
        borderColor=""
        subtitle="Great job on these optimizations"
        isExpanded={expanded === "success"}
        copiedKey={copiedKey}
        onToggle={handleToggle}
        onCopy={handleCopy}
      />
    </div>
  );
}
