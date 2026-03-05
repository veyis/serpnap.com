"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Copy,
  Linkedin,
  Share2,
  Twitter,
  X,
} from "lucide-react";
import type { SEOCheckResult } from "@/schemas/seo-checker";

export function ShareModal({ result, onClose }: { result: SEOCheckResult; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape + auto-focus close button
  useEffect(() => {
    closeRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const shareText = `I scored ${result.overallScore}/100 on the SerpNap SEO Checker! Check your site's SEO for free:`;
  const shareUrl = "https://www.serpnap.com/tools/seo-checker";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "\u{1F3C6}";
    if (score >= 80) return "\u{1F389}";
    if (score >= 60) return "\u{1F44D}";
    return "\u26A0\uFE0F";
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share your score"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation only to prevent backdrop close */}
      <div
        className="bg-[var(--seo-dialog-bg)] rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 relative animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[var(--seo-surface-hover)] transition-colors z-10"
        >
          <X className="w-4 h-4 text-[var(--seo-text-muted)]" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-bold text-[var(--seo-text)]">Share Your Score</h3>
        </div>

        {/* Share Text Preview */}
        <div className="p-3 rounded-2xl bg-[var(--seo-surface)] mb-4 text-[14px]">
          <p className="text-[var(--seo-text)]">{getScoreEmoji(result.overallScore)} {shareText}</p>
          <p className="text-warning mt-1">{shareUrl}</p>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--seo-surface-hover)] hover:bg-[var(--seo-surface-active)] transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-[var(--seo-text-secondary)]" />}
            <span className="text-[10px] text-[var(--seo-text-secondary)]">{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${getScoreEmoji(result.overallScore)} ${shareText}`)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--seo-surface-hover)] hover:bg-[var(--seo-surface-active)] transition-colors"
          >
            <Twitter className="w-4 h-4 text-[var(--seo-text-secondary)]" />
            <span className="text-[10px] text-[var(--seo-text-secondary)]">Twitter</span>
          </button>
          <button
            type="button"
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--seo-surface-hover)] hover:bg-[var(--seo-surface-active)] transition-colors"
          >
            <Linkedin className="w-4 h-4 text-[var(--seo-text-secondary)]" />
            <span className="text-[10px] text-[var(--seo-text-secondary)]">LinkedIn</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-[var(--seo-text-muted)] mt-4">
          Share your score and help others discover their SEO potential!
        </p>
      </div>
    </div>
  );
}
