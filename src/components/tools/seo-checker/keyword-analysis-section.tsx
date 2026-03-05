"use client";

import { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import { extractKeywords, type KeywordData } from "./utils";

interface ExtendedKeywordData extends KeywordData {
  inBody: boolean;
}

export function KeywordAnalysisSection({ result }: { result: SEOCheckResult }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = result.pagePreview?.title || "";
  const description = result.pagePreview?.description || "";

  const titleWords = extractKeywords(title);
  const descWords = extractKeywords(description);

  // Extract body keywords from heading hierarchy
  const bodyWords: string[] = [];
  if (result.headingHierarchy) {
    for (const heading of result.headingHierarchy) {
      bodyWords.push(...extractKeywords(heading.text));
    }
  }

  const keywordCounts = new Map<string, { count: number; inTitle: boolean; inDescription: boolean; inBody: boolean }>();

  titleWords.forEach(word => {
    const existing = keywordCounts.get(word) || { count: 0, inTitle: false, inDescription: false, inBody: false };
    keywordCounts.set(word, { ...existing, count: existing.count + 1, inTitle: true });
  });

  descWords.forEach(word => {
    const existing = keywordCounts.get(word) || { count: 0, inTitle: false, inDescription: false, inBody: false };
    keywordCounts.set(word, { ...existing, count: existing.count + 1, inDescription: true });
  });

  bodyWords.forEach(word => {
    const existing = keywordCounts.get(word) || { count: 0, inTitle: false, inDescription: false, inBody: false };
    keywordCounts.set(word, { ...existing, count: existing.count + 1, inBody: true });
  });

  const totalWords = titleWords.length + descWords.length + bodyWords.length;

  const keywords: ExtendedKeywordData[] = Array.from(keywordCounts.entries())
    .map(([keyword, data]) => ({
      keyword,
      count: data.count,
      inTitle: data.inTitle,
      inDescription: data.inDescription,
      inBody: data.inBody,
      density: totalWords > 0 ? (data.count / totalWords) * 100 : 0,
    }))
    .sort((a, b) => {
      const aScore = (a.inTitle ? 3 : 0) + (a.inDescription ? 2 : 0) + (a.inBody ? 1 : 0);
      const bScore = (b.inTitle ? 3 : 0) + (b.inDescription ? 2 : 0) + (b.inBody ? 1 : 0);
      if (bScore !== aScore) return bScore - aScore;
      return b.count - a.count;
    })
    .slice(0, 10);

  const focusKeyword = keywords.find(k => k.inTitle && k.inDescription);

  const tips: string[] = [];
  if (!focusKeyword) {
    tips.push("No keyword appears in both title and description — consider aligning them");
  }
  if (titleWords.length < 3) {
    tips.push("Title has few keywords — add more relevant terms");
  }
  if (descWords.length < 5) {
    tips.push("Description could include more keywords naturally");
  }
  if (focusKeyword && focusKeyword.density < 2) {
    tips.push(`Keyword "${focusKeyword.keyword}" could be emphasized more`);
  }

  if (keywords.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--seo-surface-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--seo-surface-hover)] flex items-center justify-center">
            <Hash className="w-5 h-5 text-[var(--seo-icon)]" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-semibold text-[var(--seo-text)] flex items-center gap-2">
              Keyword Analysis
              {focusKeyword && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-success/15 text-success rounded">
                  Focus: {focusKeyword.keyword}
                </span>
              )}
            </p>
            <p className="text-[13px] text-[var(--seo-text-muted)]">
              {keywords.length} keywords detected in meta tags
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[var(--seo-text-muted)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--seo-text-muted)]" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Keyword Grid */}
          <div className="grid grid-cols-2 gap-2">
            {keywords.slice(0, 8).map((kw) => (
              <div
                key={kw.keyword}
                className={cn(
                  "p-3 rounded-lg",
                  kw.inTitle && kw.inDescription
                    ? "bg-success/10"
                    : kw.inTitle
                    ? "bg-info/10"
                    : "bg-[var(--seo-surface)]"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-[var(--seo-text)]">{kw.keyword}</span>
                  <span className="text-[10px] text-[var(--seo-text-muted)]">&times;{kw.count}</span>
                </div>
                <div className="flex items-center gap-1">
                  {kw.inTitle && (
                    <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-info/15 text-info">
                      Title
                    </span>
                  )}
                  {kw.inDescription && (
                    <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-primary/15 text-primary">
                      Desc
                    </span>
                  )}
                  {(kw as ExtendedKeywordData).inBody && (
                    <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-info/15 text-info">
                      Body
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SEO Tips */}
          {tips.length > 0 && (
            <div className="p-3 rounded-lg bg-warning/10">
              <p className="text-[11px] font-medium text-warning mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Keyword Optimization Tips
              </p>
              <ul className="space-y-1">
                {tips.slice(0, 3).map((tip) => (
                  <li key={tip} className="text-[12px] text-warning/80 flex items-start gap-2">
                    <span className="text-warning mt-0.5">&bull;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--seo-text-muted)] flex-wrap">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              In Both
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-info" />
              Title
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Description
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-info" />
              Body
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
