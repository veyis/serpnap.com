import * as React from "react";
import { cn } from "@/lib/utils";
import { Lightbulb, CheckCircle2, Sparkles } from "lucide-react";

interface KeyTakeawaysProps {
  items: string[];
  title?: string;
  variant?: "default" | "numbered" | "success";
  className?: string;
}

/**
 * Key Takeaways component for blog posts
 * Displays at the top of articles for quick summary
 * Optimized for featured snippets
 *
 * Usage in MDX:
 * <KeyTakeaways items={[
 *   "SEO takes 3-6 months to show results",
 *   "Content quality matters more than quantity",
 *   "Technical SEO is the foundation"
 * ]} />
 */
export function KeyTakeaways({
  items,
  title = "Key Takeaways",
  variant = "default",
  className,
}: KeyTakeawaysProps) {
  if (!items || items.length === 0) return null;

  const icons = {
    default: Lightbulb,
    numbered: Sparkles,
    success: CheckCircle2,
  };

  const Icon = icons[variant];

  return (
    <aside
      className={cn(
        "my-8 rounded-2xl border p-6",
        variant === "default" && "border-amber-500/20 bg-amber-500/5",
        variant === "numbered" && "border-blue-500/20 bg-blue-500/5",
        variant === "success" && "border-emerald-500/20 bg-emerald-500/5",
        className
      )}
      aria-label="Key takeaways"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            variant === "default" && "bg-amber-500/10 text-amber-600",
            variant === "numbered" && "bg-blue-500/10 text-blue-600",
            variant === "success" && "bg-emerald-500/10 text-emerald-600"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>

      {/* Items */}
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            {variant === "numbered" ? (
              <span
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  "bg-blue-500/10 text-blue-600"
                )}
              >
                {index + 1}
              </span>
            ) : (
              <CheckCircle2
                className={cn(
                  "h-5 w-5 flex-shrink-0 mt-0.5",
                  variant === "default" && "text-amber-600",
                  variant === "success" && "text-emerald-600"
                )}
              />
            )}
            <span className="text-foreground/80 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * Article Summary component
 * Concise summary for quick understanding
 */
interface ArticleSummaryProps {
  children: React.ReactNode;
  className?: string;
}

export function ArticleSummary({ children, className }: ArticleSummaryProps) {
  return (
    <aside
      className={cn(
        "my-8 rounded-2xl border border-foreground/10 bg-foreground/5 p-6",
        className
      )}
      aria-label="Article summary"
    >
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground/60">
        <Sparkles className="h-4 w-4" />
        <span>TL;DR</span>
      </div>
      <div className="text-foreground/80 leading-relaxed">{children}</div>
    </aside>
  );
}

/**
 * What You'll Learn component
 * Shows learning outcomes for the article
 */
interface WhatYoullLearnProps {
  items: string[];
  className?: string;
}

export function WhatYoullLearn({ items, className }: WhatYoullLearnProps) {
  if (!items || items.length === 0) return null;

  return (
    <aside
      className={cn(
        "my-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6",
        className
      )}
      aria-label="What you'll learn"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          What You'll Learn
        </h2>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-1 text-purple-600" />
            <span className="text-sm text-foreground/70">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
