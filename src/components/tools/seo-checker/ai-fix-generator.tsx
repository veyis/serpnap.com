"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Lock,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import type { SEOCheckResult } from "@/schemas/seo-checker";

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

  if (!hasFixableIssues) return null;

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden relative group/ai">
      {/* Header */}
      <div className="w-full p-4 flex items-center justify-between border-b border-border/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--seo-surface-hover)] flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-semibold text-[var(--seo-text)] flex items-center gap-2">
              AI Meta Tag Optimizer
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/15 text-primary rounded">
                PRO
              </span>
            </p>
            <p className="text-[13px] text-[var(--seo-text-muted)]">
              Automatically generate high-converting titles and descriptions
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[14px] font-semibold">
          <Sparkles className="w-4 h-4" />
          Auto-Fix
        </div>
      </div>

      {/* Blurred Dummy Content */}
      <div className="px-4 py-5 select-none opacity-40 blur-[4px]">
        {hasTitleIssue && (
          <div className="mb-5 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] font-medium text-[var(--seo-text-secondary)]">
                Optimized Title Tag
              </span>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-[14px] font-medium text-success whitespace-nowrap overflow-hidden text-ellipsis">
                 Buy the Best Organic Cotton T-Shirts | SerpNap Apparel
              </p>
              <p className="text-[11px] text-success/70 mt-1 font-mono">
                54 characters (optimal: 50-60)
              </p>
            </div>
          </div>
        )}

        {hasDescriptionIssue && (
          <div className="mb-5 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] font-medium text-[var(--seo-text-secondary)]">
                Optimized Meta Description
              </span>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-[14px] text-success">
                Discover our premium organic cotton t-shirts. Sustainable, ultra-soft, and made to last. Shop now and get 15% off your first true-to-fit order.
              </p>
              <p className="text-[11px] text-success/70 mt-1 font-mono">
                154 characters (optimal: 150-160)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Paywall Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/30 backdrop-blur-[2px]">
        <div className="bg-background border border-border/50 shadow-2xl rounded-2xl p-6 text-center max-w-[320px] mx-auto transform transition-transform group-hover/ai:scale-105 duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-[16px] font-semibold text-foreground mb-2">
            Unlock AI Generation
          </h3>
          <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
            Upgrade to SerpNap Starter to instantly generate and apply perfectly optimized meta tags for this page and your entire store.
          </p>
          <Link
            href="/#pricing"
            className="w-full py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-[14px] font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
