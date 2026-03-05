"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEO_CATEGORY_REFERENCES } from "@/lib/data/seo-references";

export type SEOReferenceCategoryKey = keyof typeof SEO_CATEGORY_REFERENCES;

type CategoryReferenceInfoProps = {
  categoryKey: SEOReferenceCategoryKey;
  ariaLabel?: string;
  align?: "left" | "right";
  stopPropagation?: boolean;
  buttonClassName?: string;
  iconClassName?: string;
  panelClassName?: string;
};

export function CategoryReferenceInfo({
  categoryKey,
  ariaLabel = "View official sources",
  align = "right",
  stopPropagation = false,
  buttonClassName,
  iconClassName,
  panelClassName,
}: CategoryReferenceInfoProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const references = SEO_CATEGORY_REFERENCES[categoryKey];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={(event) => {
          if (stopPropagation) event.stopPropagation();
          setOpen((value) => !value);
        }}
        className={cn(
          "p-0.5 rounded hover:bg-[var(--seo-surface-hover)] transition-colors",
          buttonClassName,
        )}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <Info
          className={cn(
            "w-3 h-3 text-[var(--seo-text-muted)] hover:text-[var(--seo-text-secondary)] transition-colors",
            iconClassName,
          )}
        />
      </button>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Official SEO references"
          className={cn(
            "absolute top-full mt-1.5 z-50 w-64 rounded-xl bg-[var(--seo-dialog-bg)] shadow-xl p-2.5 animate-in fade-in-0 zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          <p className="text-[10px] text-[var(--seo-text-muted)] uppercase tracking-wider mb-2">
            Official Sources
          </p>
          <div className="space-y-1">
            {references.map((reference) => (
              <a
                key={reference.url}
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[var(--seo-text-secondary)] hover:text-[var(--seo-text)] hover:bg-[var(--seo-surface-hover)] transition-colors group"
                onClick={(event) => {
                  if (stopPropagation) event.stopPropagation();
                }}
              >
                <ExternalLink className="w-3 h-3 shrink-0 text-[var(--seo-text-muted)] group-hover:text-info transition-colors" />
                <span className="truncate">{reference.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
