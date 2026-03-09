"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  Shield,
  Zap,
  Search,
  FileText,
  Award,
  Code2,
  Image,
  MapPin,
  Network,
  Link2,
  Accessibility,
  MousePointer,
  Clock,
  Lock,
  Bot,
  Activity,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import {
  evaluateCheckpoints,
} from "@/lib/services/seo-analysis/checkpoint-evaluator";
import type {
  CheckpointAuditResult,
  PillarScore,
  EvaluatedCheckpoint,
  CheckpointStatus,
  CheckpointPriority,
} from "@/lib/data/seo-checkpoint-data";

// ---------------------------------------------------------------------------
// Pillar icon mapping
// ---------------------------------------------------------------------------

const PILLAR_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Search,
  2: Code2,
  3: Zap,
  4: FileText,
  5: Award,
  6: Code2,
  7: Image,
  8: MapPin,
  9: Network,
  10: Link2,
  11: Accessibility,
  12: MousePointer,
  13: Clock,
  14: Lock,
  15: Bot,
  16: Activity,
};

// ---------------------------------------------------------------------------
// Status components
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: CheckpointStatus }) {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    case "fail":
      return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    case "manual":
      return <HelpCircle className="w-4 h-4 text-[var(--seo-text-faint)] shrink-0" />;
    case "na":
      return <Minus className="w-4 h-4 text-[var(--seo-text-faint)] shrink-0" />;
  }
}

function PriorityBadge({ priority }: { priority: CheckpointPriority }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0",
        priority === "P0" && "bg-red-500/15 text-red-600 dark:text-red-400",
        priority === "P1" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        priority === "P2" && "bg-blue-500/10 text-blue-500 dark:text-blue-400",
      )}
    >
      {priority}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  if (score < 0) return null;
  return (
    <div
      className={cn(
        "text-[11px] font-bold px-2 py-0.5 rounded-full",
        score >= 80 && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        score >= 50 && score < 80 && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        score < 50 && "bg-red-500/15 text-red-600 dark:text-red-400",
      )}
    >
      {score}%
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single checkpoint item
// ---------------------------------------------------------------------------

function CheckpointItemRow({ item }: { item: EvaluatedCheckpoint }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = item.result.message && item.result.status !== "manual";

  return (
    <div
      className={cn(
        "border-b border-[var(--seo-border)] last:border-b-0",
        item.result.status === "fail" && "bg-red-500/[0.03]",
      )}
    >
      <button
        type="button"
        onClick={() => hasDetail && setExpanded((prev) => !prev)}
        disabled={!hasDetail}
        className={cn(
          "w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left",
          hasDetail && "hover:bg-[var(--seo-surface-hover)] cursor-pointer",
          !hasDetail && "cursor-default",
        )}
      >
        <StatusIcon status={item.result.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={item.priority} />
            <span
              className={cn(
                "text-[13px] leading-snug",
                item.result.status === "pass" && "text-[var(--seo-text)]",
                item.result.status === "fail" && "text-red-600 dark:text-red-400 font-medium",
                item.result.status === "warning" && "text-[var(--seo-text)]",
                item.result.status === "manual" && "text-[var(--seo-text-muted)]",
                item.result.status === "na" && "text-[var(--seo-text-faint)]",
              )}
            >
              {item.title}
            </span>
          </div>
        </div>
        {item.autoCheck && (
          <span className="text-[9px] font-medium text-[var(--seo-text-faint)] bg-[var(--seo-surface-hover)] px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider">
            Auto
          </span>
        )}
      </button>
      {expanded && hasDetail && (
        <div className="px-3.5 pb-2.5 pl-9">
          <p className="text-[12px] text-[var(--seo-text-muted)] leading-relaxed">
            {item.result.message}
          </p>
          {item.description && (
            <p className="text-[11px] text-[var(--seo-text-faint)] mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pillar section
// ---------------------------------------------------------------------------

function PillarSection({ pillarScore }: { pillarScore: PillarScore }) {
  const [expanded, setExpanded] = useState(false);
  const { pillar, items, passCount, failCount, warningCount, manualCount, score } =
    pillarScore;
  const Icon = PILLAR_ICONS[pillar.number] ?? Shield;
  const total = items.length;

  return (
    <div className="rounded-xl border border-[var(--seo-border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--seo-surface-hover)] transition-colors"
      >
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            score >= 80 && "bg-emerald-500/10",
            score >= 50 && score < 80 && "bg-amber-500/10",
            score >= 0 && score < 50 && "bg-red-500/10",
            score < 0 && "bg-[var(--seo-surface-hover)]",
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              score >= 80 && "text-emerald-500",
              score >= 50 && score < 80 && "text-amber-500",
              score >= 0 && score < 50 && "text-red-500",
              score < 0 && "text-[var(--seo-text-faint)]",
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
              {pillar.number}. {pillar.shortName}
            </span>
            <ScoreBadge score={score} />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {passCount > 0 && (
              <span className="text-[11px] text-emerald-500 font-medium">
                {passCount} passed
              </span>
            )}
            {failCount > 0 && (
              <span className="text-[11px] text-red-500 font-medium">
                {failCount} failed
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[11px] text-amber-500 font-medium">
                {warningCount} warn
              </span>
            )}
            {manualCount > 0 && (
              <span className="text-[11px] text-[var(--seo-text-faint)]">
                {manualCount} manual
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[var(--seo-text-faint)] shrink-0 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--seo-border)]">
            <p className="text-[11px] text-[var(--seo-text-faint)] px-4 py-2 italic">
              {pillar.description}
            </p>
            {items.map((item) => (
              <CheckpointItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary header
// ---------------------------------------------------------------------------

function AuditSummary({ audit }: { audit: CheckpointAuditResult }) {
  const scoreColor =
    audit.overallScore >= 80
      ? "text-emerald-500"
      : audit.overallScore >= 50
        ? "text-amber-500"
        : "text-red-500";

  const scoreBg =
    audit.overallScore >= 80
      ? "bg-emerald-500"
      : audit.overallScore >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="space-y-4">
      {/* Score ring */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--seo-border)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className={scoreBg}
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${audit.overallScore * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-xl font-bold", scoreColor)}>
              {audit.overallScore}
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-[var(--seo-text)]">
            SEO Checkpoint Score
          </h4>
          <p className="text-[12px] text-[var(--seo-text-muted)] mt-0.5">
            {audit.autoChecked} of {audit.totalChecks} checks auto-evaluated
          </p>
          {audit.p0Failed > 0 && (
            <p className="text-[12px] text-red-500 font-medium mt-1">
              {audit.p0Failed} critical (P0) issue{audit.p0Failed > 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-2">
        <StatChip
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          label="Passed"
          value={audit.passed}
          color="bg-emerald-500/10"
        />
        <StatChip
          icon={<XCircle className="w-3.5 h-3.5 text-red-500" />}
          label="Failed"
          value={audit.failed}
          color="bg-red-500/10"
        />
        <StatChip
          icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
          label="Warnings"
          value={audit.warnings}
          color="bg-amber-500/10"
        />
        <StatChip
          icon={<HelpCircle className="w-3.5 h-3.5 text-[var(--seo-text-faint)]" />}
          label="Manual"
          value={audit.manual}
          color="bg-[var(--seo-surface-hover)]"
        />
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[var(--seo-surface-hover)] overflow-hidden flex">
        {audit.passed > 0 && (
          <div
            className="bg-emerald-500 h-full transition-all"
            style={{
              width: `${(audit.passed / audit.totalChecks) * 100}%`,
            }}
          />
        )}
        {audit.warnings > 0 && (
          <div
            className="bg-amber-500 h-full transition-all"
            style={{
              width: `${(audit.warnings / audit.totalChecks) * 100}%`,
            }}
          />
        )}
        {audit.failed > 0 && (
          <div
            className="bg-red-500 h-full transition-all"
            style={{
              width: `${(audit.failed / audit.totalChecks) * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-1 min-w-0",
        color,
      )}
    >
      {icon}
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-[var(--seo-text)]">
          {value}
        </div>
        <div className="text-[10px] text-[var(--seo-text-muted)] truncate">
          {label}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

type FilterMode = "all" | "failed" | "warnings" | "passed" | "manual";

function FilterTabs({
  mode,
  onChange,
  counts,
}: {
  mode: FilterMode;
  onChange: (m: FilterMode) => void;
  counts: Record<FilterMode, number>;
}) {
  const tabs: { key: FilterMode; label: string }[] = [
    { key: "all", label: "All" },
    { key: "failed", label: "Failed" },
    { key: "warnings", label: "Warnings" },
    { key: "passed", label: "Passed" },
    { key: "manual", label: "Manual" },
  ];

  return (
    <div className="flex gap-1 bg-[var(--seo-surface-hover)] p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
            mode === tab.key
              ? "bg-[var(--seo-surface)] text-[var(--seo-text)] shadow-sm"
              : "text-[var(--seo-text-muted)] hover:text-[var(--seo-text)]",
          )}
        >
          {tab.label}
          {counts[tab.key] > 0 && tab.key !== "all" && (
            <span className="ml-1 text-[10px] opacity-60">{counts[tab.key]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CheckpointSection({ result }: { result: SEOCheckResult }) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const audit = useMemo(() => evaluateCheckpoints(result), [result]);

  const filteredPillars = useMemo(() => {
    if (filterMode === "all") return audit.pillars;

    const statusMap: Record<FilterMode, CheckpointStatus[]> = {
      all: [],
      failed: ["fail"],
      warnings: ["warning"],
      passed: ["pass"],
      manual: ["manual", "na"],
    };
    const statuses = statusMap[filterMode];

    return audit.pillars
      .map((ps) => ({
        ...ps,
        items: ps.items.filter((i) => statuses.includes(i.result.status)),
      }))
      .filter((ps) => ps.items.length > 0);
  }, [audit, filterMode]);

  const counts: Record<FilterMode, number> = {
    all: audit.totalChecks,
    failed: audit.failed,
    warnings: audit.warnings,
    passed: audit.passed,
    manual: audit.manual,
  };

  return (
    <div className="space-y-4">
      <AuditSummary audit={audit} />

      <FilterTabs mode={filterMode} onChange={setFilterMode} counts={counts} />

      <div className="space-y-2.5">
        {filteredPillars.map((ps) => (
          <PillarSection key={ps.pillar.number} pillarScore={ps} />
        ))}
      </div>

      <p className="text-[11px] text-[var(--seo-text-faint)] text-center pt-2">
        Based on the Rank #1 SEO Checkpoint Guide (2026) — 16 pillars, {audit.totalChecks} checks.
        Items marked "Manual" require human verification.
      </p>
    </div>
  );
}
