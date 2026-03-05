"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { checkSEO } from "@/lib/actions/seo-checker";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import { ANALYSIS_PHASES, ANALYSIS_PHASES_V2, saveRecentCheck } from "./utils";
import { CommandInput } from "./command-input";
import { TheatricalProgress } from "./theatrical-progress";
import { ScoreHero } from "./score-hero";
import { FullReport } from "./full-report";
import { getSeoConfettiColors, SEO_PHASE_COLORS } from "./theme";
import { ToolsNav } from "../tools-nav";

// ============================================================================
// Main Component
// ============================================================================

export function SEOCheckerTerminal() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SEOCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const totalDuration = ANALYSIS_PHASES.reduce(
      (sum, p) => sum + p.duration,
      0,
    );
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const advancePhase = (phaseIndex: number) => {
      if (phaseIndex >= ANALYSIS_PHASES.length) return;

      setCurrentPhase(phaseIndex);
      const phaseDuration = ANALYSIS_PHASES[phaseIndex].duration;

      const progressInterval = setInterval(() => {
        elapsed += 50;
        setProgress((elapsed / totalDuration) * 100);
      }, 50);
      intervals.push(progressInterval);

      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        advancePhase(phaseIndex + 1);
      }, phaseDuration);
      timers.push(timer);
    };

    advancePhase(0);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      intervals.forEach((i) => clearInterval(i));
    };
  }, [isAnalyzing]);

  useEffect(() => {
    if (!result) return;
    const duration = 1500;
    const startTime = Date.now();
    const targetScore = result.overallScore;
    let rafId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      setAnimatedScore(Math.round(targetScore * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setShowContent(true);
        if (targetScore >= 85) {
          import("canvas-confetti").then(({ default: confetti }) => {
            confetti({
              particleCount: 60,
              spread: 50,
              origin: { y: 0.3 },
              colors: getSeoConfettiColors(),
            });
          });
        }
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [result]);

  async function handleSubmit() {
    if (!url.trim() || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    setCurrentPhase(0);
    setProgress(0);
    setElapsedTime(0);
    setAnimatedScore(0);
    setShowContent(false);

    let normalizedUrl = url.trim();
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    try {
      const parsed = new URL(normalizedUrl);
      parsed.hostname = parsed.hostname.toLowerCase();
      normalizedUrl = parsed.href;
    } catch {
      normalizedUrl = normalizedUrl.trim();
    }

    const animationStart = Date.now();

    startTransition(async () => {
      try {
        const checkResult = await checkSEO({ url: normalizedUrl });

        const totalDuration = ANALYSIS_PHASES.reduce(
          (sum, p) => sum + p.duration,
          0,
        );
        const elapsed = Date.now() - animationStart;
        const remaining = totalDuration - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        if (checkResult.success && checkResult.data) {
          setResult(checkResult.data);

          const hostname = new URL(normalizedUrl).hostname;
          saveRecentCheck({
            url: normalizedUrl,
            score: checkResult.data.overallScore,
            timestamp: new Date().toISOString(),
            hostname,
          });
        } else {
          setError(checkResult.error || "Failed to analyze URL");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setIsAnalyzing(false);
        isSubmittingRef.current = false;
      }
    });
  }

  function handleReset() {
    setUrl("");
    setResult(null);
    setError(null);
    setCurrentPhase(0);
    setProgress(0);
    setElapsedTime(0);
    setAnimatedScore(0);
    setShowContent(false);
  }

  useEffect(() => {
    if (!result && !error) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isAnalyzing) {
        handleReset();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAnalyzing, result, error]);

  // Derive current phase color for background gradient
  const currentPhaseColor =
    isAnalyzing && ANALYSIS_PHASES_V2[currentPhase]
      ? SEO_PHASE_COLORS[ANALYSIS_PHASES_V2[currentPhase].color] ||
        "var(--color-warning)"
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-(--seo-page-bg) -mt-20 pt-20">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 transition-[background] duration-1000"
          style={{
            background:
              isAnalyzing && currentPhaseColor
                ? `radial-gradient(ellipse at 50% 35%, ${currentPhaseColor}0A 0%, var(--seo-page-bg) 55%)`
                : "var(--seo-page-bg)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          {/* Hero Section - Always Visible */}
          <div className="flex flex-col items-center pt-[6vh] sm:pt-[8vh] pb-6 sm:pb-8 transition-all duration-500">
            {/* Hero Logo - Proportional sizing (10-12% of viewport height max) */}
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 sm:mb-6"
              style={{
                animation:
                  "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
              }}
            >
              <Image
                src="/pxlpeak-logo.png"
                alt="PxlPeak Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 96px, 112px"
                priority
              />
            </div>

            {/* Text Content - Typography Scale 1.25 */}
            <div
              className="flex flex-col items-center text-center w-full max-w-2xl mb-6 sm:mb-8"
              style={{
                animation:
                  "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both",
              }}
            >
              <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100">
                {/* Eyebrow - 11px mobile, 12px desktop */}
                <span className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-(--seo-text-muted) font-medium mb-4 sm:mb-5">
                  Best Free SEO Audit Tool | 2026
                </span>
                {/* Main Headline - 36px → 48px → 56px (1.25 scale) */}
                <span className="block text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1]">
                  <span className="relative inline-block">
                    {/* Aurora animated gradient text */}
                    <span
                      className="aurora-text relative z-10 bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 25%, #06B6D4 50%, #8B5CF6 75%, #D946EF 100%)",
                        backgroundSize: "300% 100%",
                        animation: "aurora-text 10s ease-in-out infinite",
                      }}
                    >
                      SEO
                    </span>
                    <span className="relative z-10 text-(--seo-text) ml-2 sm:ml-3">
                      Checker
                    </span>
                    {/* Subtle glow effect */}
                    <span className="absolute inset-0 bg-linear-to-r from-violet-500/25 via-fuchsia-500/25 to-cyan-500/25 blur-2xl opacity-60 scale-150" />
                  </span>
                  <span className="text-(--seo-text)/40">.</span>
                </span>
              </h1>

              {/* Subheadline - 14px → 16px → 18px (60% of headline) */}
              {!isAnalyzing && (
                <p
                  data-speakable="intro"
                  className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-(--seo-text-secondary) max-w-lg mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600 delay-150"
                >
                  Uncover hidden{" "}
                  <span className="text-(--seo-text) font-medium">
                    technical errors
                  </span>
                  , boost{" "}
                  <span className="text-(--seo-text) font-medium">
                    ranking factors
                  </span>
                  , and spy on competitors.
                </p>
              )}
            </div>

            {/* Search Input - Max width for comfortable reading */}
            <div
              className="w-full max-w-md sm:max-w-lg transition-all duration-500"
              style={{
                animation:
                  "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) 140ms both",
              }}
            >
              <CommandInput
                value={url}
                onChange={setUrl}
                onSubmit={handleSubmit}
                placeholder="example.com"
                disabled={isAnalyzing || isPending}
                isLoading={isPending}
              />
            </div>

            {/* Feature chips - Hide when analyzing */}
            {!isAnalyzing && !result && (
              <div
                className="flex items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8"
                style={{
                  animation:
                    "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both",
                }}
              >
                {[
                  "Technical",
                  "Meta",
                  "Content",
                  "Schema",
                  "A11y",
                  "E-E-A-T",
                  "Mobile",
                  "Intl",
                ].map((label) => (
                  <span
                    key={label}
                    className="hidden sm:inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-(--seo-surface) text-[11px] sm:text-xs text-(--seo-text-muted) font-medium"
                  >
                    {label}
                  </span>
                ))}
                <span className="sm:hidden text-xs text-(--seo-text-muted)">
                  Comprehensive analysis · 8 categories · 100% free
                </span>
              </div>
            )}
          </div>

          {/* PROGRESS SECTION - NEW (Scroll target) */}
          <div
            ref={(el) => {
              if (isAnalyzing && el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          >
            {isAnalyzing && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
                <TheatricalProgress
                  url={url}
                  currentPhase={currentPhase}
                  progress={progress}
                  elapsedTime={elapsedTime}
                />
              </div>
            )}
          </div>

          {/* Results — Score Hero */}
          {result && !isAnalyzing && (
            <ScoreHero
              result={result}
              url={url}
              animatedScore={animatedScore}
              showContent={showContent}
            />
          )}

          {/* Error State */}
          {error && !isAnalyzing && (
            <div
              className="max-w-md mx-auto pt-8"
              style={{
                animation:
                  "seo-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-(--seo-text) mb-2 tracking-tight">
                  We couldn&apos;t analyze that URL
                </h3>
                <p className="text-[15px] text-(--seo-text-secondary) mb-2 leading-relaxed">
                  {error}
                </p>
                <p className="text-[13px] text-(--seo-text-secondary)/60 mb-8">
                  This usually happens with login-protected pages, very slow servers, or invalid URLs.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-3 rounded-full bg-(--seo-btn-bg) text-(--seo-btn-text) text-[15px] font-semibold hover:bg-(--seo-btn-hover) active:scale-[0.97] transition-all"
                >
                  Analyze a Different URL
                </button>
              </div>
            </div>
          )}

          {/* Full Report */}
          {result && !isAnalyzing && showContent && (
            <FullReport result={result} url={url} onReset={handleReset} />
          )}

          {/* Tools Nav */}
          {!isAnalyzing && <ToolsNav />}
        </div>
      </div>
    </div>
  );
}
