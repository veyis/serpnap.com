"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisScores {
  overallScore: number;
  wordCount: number;
  characterCount: number;
  headlineType: string;
  serpFit: "perfect" | "good" | "truncated";
}

interface AiAnalysisSectionProps {
  headline: string;
  scores: AnalysisScores;
}

function StreamedMarkdown({ content }: { content: string }) {
  // Split by ## headers into sections
  const sections = content.split(/^(?=## )/m).filter(Boolean);

  return (
    <div className="space-y-5">
      {sections.map((section, i) => {
        const lines = section.trim().split("\n");
        const headerLine = lines[0];
        const isHeader = headerLine.startsWith("## ");
        const title = isHeader ? headerLine.replace("## ", "") : null;
        const body = isHeader ? lines.slice(1).join("\n").trim() : section.trim();

        return (
          <div key={i}>
            {title && (
              <h4 className="text-sm font-semibold text-(--seo-text) mb-2">
                {title}
              </h4>
            )}
            {body && (
              <div className="text-sm text-(--seo-text-secondary) leading-relaxed whitespace-pre-wrap">
                {body.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={j} className="text-(--seo-text) font-medium">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={j}>{part}</span>;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ShimmerPlaceholder() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div
            className="h-4 rounded-md bg-violet-500/10"
            style={{ width: `${40 + i * 10}%` }}
          />
          <div className="h-3 rounded-md bg-violet-500/5 w-full" />
          <div
            className="h-3 rounded-md bg-violet-500/5"
            style={{ width: `${70 + (i % 2) * 20}%` }}
          />
        </div>
      ))}
      <p className="text-xs text-violet-500/70 text-center pt-2">
        Analyzing with AI...
      </p>
    </div>
  );
}

export function AiAnalysisSection({ headline, scores }: AiAnalysisSectionProps) {
  const [hasTriggered, setHasTriggered] = useState(false);

  const { completion, isLoading, error, complete } = useCompletion({
    api: "/api/tools/headline-analysis",
    body: { scores },
  });

  async function handleAnalyze() {
    setHasTriggered(true);
    await complete(headline);
  }

  // Not yet triggered — show CTA button
  if (!hasTriggered) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-violet-500/5 border border-violet-500/10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-(--seo-text) mb-1">
              AI Expert Analysis
            </h3>
            <p className="text-xs text-(--seo-text-muted) leading-relaxed max-w-md">
              Get deep SEO insights, click psychology breakdown, platform-specific
              optimization tips, and 4 expert rewrites from AI.
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium",
              "bg-violet-600 text-white hover:bg-violet-700",
              "transition-all duration-200 active:scale-[0.98]",
              "shadow-sm hover:shadow-md"
            )}
          >
            Get AI Expert Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-violet-500/5 border border-violet-500/10">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-(--seo-text)">
          AI Expert Analysis
        </h3>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Analysis unavailable
            </p>
            <p className="text-xs text-(--seo-text-muted) mt-1">
              {error.message.includes("429")
                ? "Too many requests. Please wait a moment and try again."
                : error.message.includes("503")
                  ? "AI insights are temporarily unavailable. Your manual score is still accurate — check back shortly."
                  : "Something went wrong. Please try again later."}
            </p>
          </div>
        </div>
      )}

      {/* Loading shimmer */}
      {isLoading && !completion && <ShimmerPlaceholder />}

      {/* Streamed content */}
      {completion && <StreamedMarkdown content={completion} />}
    </div>
  );
}
