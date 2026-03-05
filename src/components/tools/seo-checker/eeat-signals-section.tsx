import { BookOpen, Clock, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EEATData } from "@/schemas/seo-checker";
import { CategoryReferenceInfo } from "./category-reference-info";

export function EEATSignalsSection({ eeatData }: { eeatData: EEATData }) {
  const signals = [
    { label: "Author Markup", found: eeatData.hasAuthorMarkup, icon: BookOpen },
    { label: "Privacy Policy", found: eeatData.hasPrivacyPolicy, icon: Shield },
    { label: "Published Date", found: eeatData.hasPublishedDate, icon: Clock },
  ];

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-warning" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)] tracking-[-0.01em]">
            E-E-A-T Trust Signals
          </span>
        </div>
        <CategoryReferenceInfo
          categoryKey="eeat"
          ariaLabel="E-E-A-T references"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {signals.map(({ label, found, icon: Icon }) => (
            <div
              key={label}
              className="p-3 rounded-lg bg-[var(--seo-surface)] text-center"
            >
              <Icon
                className={cn(
                  "w-4 h-4 mx-auto mb-2",
                  found ? "text-success" : "text-destructive",
                )}
              />
              <div
                className={cn(
                  "text-xs font-medium",
                  found ? "text-success" : "text-destructive",
                )}
              >
                {found ? "Found" : "Missing"}
              </div>
              <div className="text-[11px] text-[var(--seo-text-muted)] mt-1">{label}</div>
            </div>
          ))}
        </div>
        {eeatData.trustPageLinks.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--seo-surface)]">
            <div className="text-[12px] text-[var(--seo-text-secondary)] mb-2">Trust Pages Found</div>
            <div className="flex flex-wrap gap-1.5">
              {eeatData.trustPageLinks.map((link) => (
                <span
                  key={link}
                  className="px-2 py-0.5 text-[11px] bg-success/10 text-success rounded"
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        )}
        {eeatData.trustSignalCount > 0 && (
          <div className="text-xs text-[var(--seo-text-secondary)]">
            {eeatData.trustSignalCount} trust signal
            {eeatData.trustSignalCount !== 1 ? "s" : ""} detected (testimonials,
            reviews, certifications)
          </div>
        )}
      </div>
    </div>
  );
}
