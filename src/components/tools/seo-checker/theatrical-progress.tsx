"use client";

import { useState, useEffect, useRef } from "react";
import { ANALYSIS_PHASES_V2 } from "./utils";
import { SEO_PHASE_COLORS } from "./theme";

function TheatricalProgress({
  currentPhase,
  progress,
  elapsedTime,
  url,
}: {
  currentPhase: number;
  progress: number;
  elapsedTime: number;
  url: string;
}) {
  const [activeSubCheck, setActiveSubCheck] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const phase = ANALYSIS_PHASES_V2[currentPhase];

  useEffect(() => {
    if (!phase) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    let cumulative = 0;
    phase.subChecks.forEach((sub, i) => {
      const activateTimer = setTimeout(() => {
        setActiveSubCheck(i);
      }, cumulative);
      timersRef.current.push(activateTimer);

      cumulative += sub.duration;
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [phase]);

  const hostname = (() => {
    try {
      let u = url.trim();
      if (!u.startsWith("http")) u = `https://${u}`;
      return new URL(u).hostname;
    } catch {
      return url;
    }
  })();

  if (!phase) return null;

  const Icon = phase.icon;
  const strokeColor = SEO_PHASE_COLORS[phase.color] || "var(--color-warning)";

  // Calculate phase-local progress (0-1)
  const totalDur = ANALYSIS_PHASES_V2.reduce((s, p) => s + p.duration, 0);
  let elapsedBefore = 0;
  for (let i = 0; i < currentPhase; i++)
    elapsedBefore += ANALYSIS_PHASES_V2[i].duration;

  // Normalized progress for the current phase
  const currentPhaseElapsed = (progress / 100) * totalDur - elapsedBefore;
  const rawPhaseProgress = currentPhaseElapsed / phase.duration;
  const phaseProgress = Math.min(Math.max(rawPhaseProgress, 0), 1);

  const size = 180;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto min-h-[700px] flex flex-col items-center py-12 px-4">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-tr from-transparent via-(--seo-surface-hover) to-transparent opacity-20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--seo-page-bg)_70%)]" />
      </div>

      {/* Header Info */}
      <div className="flex flex-col items-center mb-10 space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-(--seo-surface) border border-(--seo-border) backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-medium tracking-wide uppercase text-(--seo-text-muted)">
            Analyzing Target
          </span>
        </div>
        <h2 className="text-xl font-medium text-(--seo-text) tracking-tight">
          {hostname}
        </h2>
      </div>

      {/* Main Stage: Circular Progress */}
      <div className="relative flex flex-col items-center mb-12">
        {/* Central HUD Ring */}
        <div className="relative w-[180px] h-[180px] mb-8 group">
          {/* Rotating outer ring */}
          <div className="absolute -inset-4 rounded-full border border-(--seo-border) border-dashed opacity-20 animate-[spin_12s_linear_infinite]" />

          {/* Counter-rotating inner ring */}
          <div className="absolute -inset-1 rounded-full border border-(--seo-border) opacity-30 animate-[spin_8s_linear_infinite_reverse]" />

          {/* Glow backdrop */}
          <div
            className="absolute inset-0 rounded-full blur-[40px] transition-colors duration-700"
            style={{
              backgroundColor: `color-mix(in srgb, ${strokeColor} 20%, transparent)`,
            }}
          />

          {/* Main Progress SVG */}
          <svg className="w-full h-full -rotate-90 relative z-10 drop-shadow-sm">
            {/* Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="var(--seo-surface-hover)"
              strokeWidth={strokeWidth}
              className="opacity-50"
            />
            {/* Progress Arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - phaseProgress * circumference}
              className="transition-[stroke-dashoffset,stroke] duration-300"
              style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-(--seo-surface) border border-(--seo-border) shadow-2xl transition-all duration-300">
              <Icon
                className="w-8 h-8 transition-colors duration-300"
                style={{ color: strokeColor }}
              />
            </div>
          </div>
        </div>

        {/* Phase Title & Desc */}
        <div className="text-center mb-8 max-w-md transition-all duration-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-(--seo-text-muted) uppercase tracking-widest">
              Phase {currentPhase + 1}/{ANALYSIS_PHASES_V2.length}
            </span>
          </div>
          <h3 className="text-3xl md:text-3xl font-semibold tracking-tighter mb-2 bg-clip-text text-transparent bg-linear-to-b from-(--seo-text) to-(--seo-text-muted)">
            {phase.label}
          </h3>
          <p className="text-sm text-(--seo-text-secondary) leading-relaxed max-w-[300px] mx-auto">
            {phase.description}
          </p>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="w-full bg-(--seo-surface) backdrop-blur-md border border-(--seo-border) rounded-xl p-5 shadow-2xl font-mono text-sm leading-relaxed overflow-hidden relative group">
          {/* Ambient Glow */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 bg-(--seo-pulse)/10 blur-[80px] rounded-full transition-colors duration-1000"
            style={{ backgroundColor: strokeColor, opacity: 0.15 }}
          />

          {/* Line 1: Active Phase Status */}
          <div className="flex items-center gap-3 mb-3 relative z-10 w-full">
            <div className="flex items-center gap-2 text-(--seo-text) shrink-0">
              <span className="text-success font-bold">$</span>
              <span
                className="font-bold tracking-tight"
                style={{ color: strokeColor }}
              >
                {phase.label.toLowerCase().replace(/\s+/g, "-")}
              </span>
            </div>

            <div className="hidden sm:block text-(--seo-text-muted) whitespace-nowrap text-xs">
              <span className="text-success">executing</span>::phase(
              {currentPhase + 1})
            </div>

            <span className="ml-auto text-(--seo-text-faint) whitespace-nowrap text-xs w-[4ch] text-right">
              {formatTime(elapsedTime)}
            </span>
          </div>

          {/* Line 2: Active Sub-task (Typewriter style) */}
          <div className="flex items-center gap-2 border-l-2 border-(--seo-border) pl-3 ml-1 relative z-10 h-6">
            {phase.subChecks[activeSubCheck] ? (
              <>
                <span className="text-info shrink-0 hidden sm:inline">
                  const
                </span>
                <span className="text-warning shrink-0 hidden sm:inline">
                  task
                </span>
                <span className="text-(--seo-text-muted) hidden sm:inline">
                  =
                </span>
                <span className="text-(--seo-text) truncate">
                  &quot;
                  <span className="inline-block animate-[pulse_2s_infinite]">
                    {phase.subChecks[activeSubCheck].label}
                  </span>
                  &quot;
                </span>
                <span className="w-1.5 h-4 bg-(--seo-text) animate-blink ml-1" />
              </>
            ) : (
              <span className="text-success">Phase complete.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { TheatricalProgress };
