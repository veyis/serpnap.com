"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { generateTitleFix, generateDescriptionFix } from "@/lib/utils/seo-fix-generator";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import { decodeHTMLEntities } from "./utils";

export function AIFixGenerator({ result }: { result: SEOCheckResult }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [fixes, setFixes] = useState<{
    title?: { original: string; suggested: string; improvement: string };
    description?: { original: string; suggested: string; improvement: string };
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const metaIssues = result.categories.meta?.issues || [];
  const hasTitleIssue = metaIssues.some(i =>
    i.message.toLowerCase().includes("title") &&
    (i.type === "error" || i.type === "warning")
  );
  const hasDescriptionIssue = metaIssues.some(i =>
    i.message.toLowerCase().includes("description") &&
    (i.type === "error" || i.type === "warning")
  );

  const hasFixableIssues = hasTitleIssue || hasDescriptionIssue;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsExpanded(true);

    try {
      const newFixes: typeof fixes = {};

      if (hasTitleIssue && result.pagePreview?.title) {
        newFixes.title = await generateTitleFix(result.pagePreview.title, result.url);
      }

      if (hasDescriptionIssue) {
        newFixes.description = await generateDescriptionFix(
          result.pagePreview?.description || "",
          result.url,
          result.pagePreview?.title
        );
      }

      setFixes(newFixes);
    } catch (error) {
      console.error("Error generating fixes:", error);
    }

    setIsGenerating(false);
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  if (!hasFixableIssues) return null;

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => fixes ? setIsExpanded(!isExpanded) : handleGenerate()}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--seo-surface-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--seo-surface-hover)] flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-[var(--seo-icon)]" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-semibold text-[var(--seo-text)] flex items-center gap-2">
              AI Fix Generator
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/15 text-primary rounded">
                NEW
              </span>
            </p>
            <p className="text-[13px] text-[var(--seo-text-muted)]">
              {fixes ? "Click to view optimized meta tags" : "Generate optimized meta tags instantly"}
            </p>
          </div>
        </div>
        {isGenerating ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : fixes ? (
          isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--seo-text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--seo-text-muted)]" />
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--seo-btn-bg)] text-[var(--seo-btn-text)] text-[14px] font-semibold">
            <Sparkles className="w-4 h-4" />
            Generate
          </div>
        )}
      </button>

      {/* Generated Fixes */}
      {isExpanded && fixes && (
        <div className="px-4 pb-4 space-y-3">
          {/* Title Fix */}
          {fixes.title && fixes.title.suggested !== fixes.title.original && (
            <div className="p-4 rounded-2xl bg-[var(--seo-surface)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-[var(--seo-text-secondary)] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Optimized Title Tag
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {fixes.title.improvement}
                </span>
              </div>

              <div className="mb-2">
                <p className="text-[11px] text-[var(--seo-text-muted)] mb-1">Original:</p>
                <p className="text-[13px] text-[var(--seo-text-muted)] line-through">{decodeHTMLEntities(fixes.title.original)}</p>
              </div>

              <div className="p-3 rounded-lg bg-success/10">
                <p className="text-[11px] text-success mb-1">Suggested:</p>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[14px] font-medium text-success">{decodeHTMLEntities(fixes.title.suggested)}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(decodeHTMLEntities(fixes.title?.suggested ?? ""), "title")}
                    className="p-1.5 rounded-lg hover:bg-success/20 transition-colors shrink-0"
                  >
                    {copiedField === "title" ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-success" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-success/70 mt-1 font-mono">
                  {decodeHTMLEntities(fixes.title.suggested).length} characters (optimal: 50-60)
                </p>
              </div>
            </div>
          )}

          {/* Description Fix */}
          {fixes.description && fixes.description.suggested !== fixes.description.original && (
            <div className="p-4 rounded-2xl bg-[var(--seo-surface)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-[var(--seo-text-secondary)] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Optimized Meta Description
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {fixes.description.improvement}
                </span>
              </div>

              {fixes.description.original && (
                <div className="mb-2">
                  <p className="text-[11px] text-[var(--seo-text-muted)] mb-1">Original:</p>
                  <p className="text-[13px] text-[var(--seo-text-muted)] line-through">{decodeHTMLEntities(fixes.description.original)}</p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-success/10">
                <p className="text-[11px] text-success mb-1">Suggested:</p>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[14px] text-success">{decodeHTMLEntities(fixes.description.suggested)}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(decodeHTMLEntities(fixes.description?.suggested ?? ""), "description")}
                    className="p-1.5 rounded-lg hover:bg-success/20 transition-colors shrink-0"
                  >
                    {copiedField === "description" ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-success" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-success/70 mt-1 font-mono">
                  {decodeHTMLEntities(fixes.description.suggested).length} characters (optimal: 150-160)
                </p>
              </div>
            </div>
          )}

          {/* Regenerate */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full p-2.5 rounded-full bg-[var(--seo-surface-hover)] text-[13px] text-[var(--seo-text-secondary)] hover:bg-[var(--seo-surface-active)] hover:text-[var(--seo-text)] transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Regenerate Suggestions
          </button>
        </div>
      )}
    </div>
  );
}
