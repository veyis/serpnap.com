"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { decodeHTMLEntities } from "./utils";

// ============================================================================
// SERP Preview (Dark themed)
// ============================================================================

export function SERPPreview({
  title,
  description,
  url,
  favicon,
}: {
  title: string;
  description: string;
  url: string;
  favicon: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"google" | "social">("google");
  const displayUrl = (url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const [showFavicon, setShowFavicon] = useState(!!favicon);

  const urlParts = displayUrl.split("/").filter(Boolean);
  const domain = urlParts[0];
  const breadcrumbs = urlParts.slice(1);

  const titleLength = title?.length || 0;
  const isTitleTooLong = titleLength > 60;
  const isTitleTooShort = titleLength > 0 && titleLength < 30;

  const descLength = description?.length || 0;
  const isDescTooLong = descLength > 160;
  const isDescTooShort = descLength > 0 && descLength < 120;

  return (
    <div className="bg-[var(--seo-surface)] rounded-2xl overflow-hidden shadow-[var(--seo-card-shadow)]">
      {/* Header with tabs */}
      <div className="px-4 py-3 border-b border-[var(--seo-border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[var(--seo-surface-hover)] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("google")}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
                activeTab === "google"
                  ? "bg-[var(--seo-surface-active)] text-[var(--seo-text)]"
                  : "text-[var(--seo-text-muted)] hover:text-[var(--seo-text-secondary)]",
              )}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("social")}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
                activeTab === "social"
                  ? "bg-[var(--seo-surface-active)] text-[var(--seo-text)]"
                  : "text-[var(--seo-text-muted)] hover:text-[var(--seo-text-secondary)]",
              )}
            >
              Social
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium",
              isTitleTooLong || isTitleTooShort
                ? "bg-warning/10 text-warning"
                : "bg-success/10 text-success",
            )}
          >
            Title: {titleLength}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium",
              isDescTooLong || isDescTooShort || descLength === 0
                ? "bg-warning/10 text-warning"
                : "bg-success/10 text-success",
            )}
          >
            Desc: {descLength}
          </span>
        </div>
      </div>

      {activeTab === "google" ? (
        /* Google-style SERP result */
        <div className="p-5 bg-[var(--seo-surface)]">
          {/* Site info row */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-[var(--seo-surface-hover)] flex items-center justify-center overflow-hidden">
              {showFavicon && favicon ? (
                // eslint-disable-next-line @next/next/no-img-element -- favicon URL is dynamic/external; next/image is not suitable here
                <img
                  src={favicon}
                  alt=""
                  className="w-4 h-4 rounded"
                  onError={() => setShowFavicon(false)}
                />
              ) : (
                <Globe className="w-3.5 h-3.5 text-[var(--seo-text-muted)]" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-[var(--seo-text)] truncate">
                {domain}
              </span>
              <div className="flex items-center gap-1 text-xs text-[var(--seo-text-secondary)]">
                <span className="truncate">{displayUrl}</span>
                {breadcrumbs.length > 0 && (
                  <ChevronDown className="w-3 h-3 shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Title - Google blue link */}
          <h3 className="text-xl text-info font-normal leading-snug hover:underline cursor-pointer mb-1">
            {title ? (
              <>
                {decodeHTMLEntities(title).slice(0, 60)}
                {isTitleTooLong && <span className="text-[var(--seo-text-muted)]">...</span>}
              </>
            ) : (
              <span className="text-destructive">
                Missing title tag — Add a descriptive title
              </span>
            )}
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--seo-text-secondary)] leading-relaxed">
            {description ? (
              <>
                {decodeHTMLEntities(description).slice(0, 160)}
                {isDescTooLong && <span className="text-[var(--seo-text-muted)]">...</span>}
              </>
            ) : (
              <span className="italic text-warning">
                No meta description found. Add one to control how your page
                appears in search results.
              </span>
            )}
          </p>
        </div>
      ) : (
        /* Social / OG Card Preview */
        <div className="p-5 bg-[var(--seo-surface)]">
          <div className="rounded-xl overflow-hidden bg-[var(--seo-surface)]">
            {/* OG Image placeholder */}
            <div className="h-40 bg-[var(--seo-surface)] flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-[var(--seo-text-faint)] mx-auto mb-2" />
                <p className="text-[11px] text-[var(--seo-text-faint)]">OG Image Preview</p>
              </div>
            </div>
            {/* Card content */}
            <div className="p-4 bg-[var(--seo-surface)]">
              <p className="text-[10px] text-[var(--seo-text-muted)] uppercase tracking-wider mb-1">
                {domain}
              </p>
              <p className="text-sm font-semibold text-[var(--seo-text)] mb-1 line-clamp-2">
                {title ? decodeHTMLEntities(title) : "No title set"}
              </p>
              <p className="text-xs text-[var(--seo-text-secondary)] line-clamp-2">
                {description
                  ? decodeHTMLEntities(description)
                  : "No description set"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips section */}
      {(isTitleTooLong ||
        isTitleTooShort ||
        isDescTooLong ||
        isDescTooShort ||
        !title ||
        !description) && (
        <div className="px-4 py-3 bg-warning/5 border-t border-[var(--seo-border)]">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="text-xs text-warning space-y-1">
              {!title && <p>Missing title tag — critical for SEO</p>}
              {isTitleTooLong && (
                <p>Title is too long ({titleLength} chars) — aim for 50-60</p>
              )}
              {isTitleTooShort && (
                <p>
                  Title may be too short ({titleLength} chars) — aim for 50-60
                </p>
              )}
              {!description && (
                <p>Missing meta description — add 150-160 characters</p>
              )}
              {isDescTooLong && (
                <p>
                  Description too long ({descLength} chars) — aim for 150-160
                </p>
              )}
              {isDescTooShort && (
                <p>
                  Description may be too short ({descLength} chars) — aim for
                  150-160
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
