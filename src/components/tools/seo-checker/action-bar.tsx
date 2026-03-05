"use client";

import { useState } from "react";
import {
  Download,
  Loader2,
  Search,
  Share2,
} from "lucide-react";
import type { SEOCheckResult } from "@/schemas/seo-checker";

export function ActionBar({
  result,
  onReset,
  onShare,
}: {
  result: SEOCheckResult;
  onReset: () => void;
  onShare: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { generatePDFReport } = await import("@/lib/utils/pdf-report-generator");
      await generatePDFReport(result);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
    setIsDownloading(false);
  };

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] p-3 sm:p-4">
      <div className="flex gap-2 sm:gap-3">
        {/* Secondary actions */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl bg-[var(--seo-surface-hover)] hover:bg-[var(--seo-surface-active)] transition-all text-[13px] sm:text-[14px] text-[var(--seo-text-secondary)] hover:text-[var(--seo-text)] disabled:opacity-50 active:scale-[0.98]"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">PDF</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl bg-[var(--seo-surface-hover)] hover:bg-[var(--seo-surface-active)] transition-all text-[13px] sm:text-[14px] text-[var(--seo-text-secondary)] hover:text-[var(--seo-text)] active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
        {/* Primary CTA */}
        <button
          type="button"
          onClick={onReset}
          className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-[var(--seo-btn-bg)] text-[var(--seo-btn-text)] hover:bg-[var(--seo-btn-hover)] active:scale-[0.97] transition-all text-[13px] sm:text-[14px] font-semibold"
        >
          <Search className="w-4 h-4" />
          Check Another URL
        </button>
      </div>
    </div>
  );
}
