"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportSectionGroup({
  icon: Icon,
  title,
  description,
  badge,
  defaultExpanded = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  title: string;
  description?: string;
  badge?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--seo-surface-hover)] transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-[var(--seo-surface-hover)] flex items-center justify-center shrink-0">
          <Icon className="w-[18px] h-[18px] text-[var(--seo-icon)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-destructive/10 text-destructive">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[12px] text-[var(--seo-text-muted)] mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[var(--seo-text-faint)] shrink-0 transition-transform duration-300",
            expanded && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
