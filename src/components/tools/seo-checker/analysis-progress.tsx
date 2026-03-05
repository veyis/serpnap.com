"use client";

import { useRef, useEffect } from "react";
import { CheckCircle2, Loader2, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANALYSIS_PHASES } from "./utils";

function AnalysisProgress({
  url,
  currentPhase,
  progress,
  elapsedTime,
}: {
  url: string;
  currentPhase: number;
  progress: number;
  elapsedTime: number;
}) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current)
      progressRef.current.style.setProperty("--seo-progress", `${progress}%`);
  }, [progress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 font-mono text-sm">
      {/* Command echo */}
      <div className="flex items-start gap-2 text-muted-foreground mb-4">
        <span className="text-success">~</span>
        <span>$</span>
        <span className="text-warning">check</span>
        <span className="text-white break-all">{url}</span>
      </div>

      {/* Progress phases */}
      <div className="space-y-2 mb-6">
        {ANALYSIS_PHASES.map((phase, index) => {
          const isComplete = index < currentPhase;
          const isCurrent = index === currentPhase;
          const isPending = index > currentPhase;

          return (
            <div
              key={phase.id}
              className={cn(
                "flex items-center gap-3 py-1.5 transition-opacity duration-300",
                isPending && "opacity-30",
              )}
            >
              {/* Status icon */}
              <div className="w-5 flex justify-center shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-warning animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted" />
                )}
              </div>

              {/* Phase info */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    "text-muted-foreground",
                    isCurrent && "text-warning",
                    isComplete && "text-success",
                  )}
                >
                  {phase.command}
                </span>
                <span
                  className={cn(
                    "text-muted-foreground truncate",
                    isCurrent && "text-muted-foreground",
                  )}
                >
                  {phase.label}
                </span>
              </div>

              {/* Checkmark for complete */}
              {isComplete && (
                <span className="text-success text-xs shrink-0">done</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
          <span>Progress</span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full w-(--seo-progress,0%) bg-linear-to-r from-orange-500 to-amber-500 rounded-full transition-[width] duration-300"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-muted-foreground text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span className="tabular-nums">{formatTime(elapsedTime)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>Comprehensive audit</span>
        </div>
      </div>
    </div>
  );
}

export { AnalysisProgress };
