import { X, Minus, Maximize2, Terminal } from "lucide-react";

function TerminalChrome({
  children,
  title = "seo-checker",
  isAnalyzing = false,
}: {
  children: React.ReactNode;
  title?: string;
  isAnalyzing?: boolean;
}) {
  return (
    <div className="flex flex-col h-full bg-foreground/95 rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border border-border/60 shadow-2xl">
      {/* Title Bar - macOS style */}
      <div className="flex items-center justify-between px-4 py-3 bg-foreground/95 border-b border-border/60 shrink-0">
        {/* Traffic Lights */}
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Close window" className="group w-3 h-3 rounded-full bg-destructive hover:bg-destructive/80 transition-colors flex items-center justify-center">
            <X className="w-2 h-2 text-destructive/70 opacity-0 group-hover:opacity-100" />
          </button>
          <button type="button" aria-label="Minimize window" className="group w-3 h-3 rounded-full bg-warning hover:bg-warning/80 transition-colors flex items-center justify-center">
            <Minus className="w-2 h-2 text-warning/70 opacity-0 group-hover:opacity-100" />
          </button>
          <button type="button" aria-label="Maximize window" className="group w-3 h-3 rounded-full bg-success hover:bg-success/80 transition-colors flex items-center justify-center">
            <Maximize2 className="w-1.5 h-1.5 text-success/70 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-mono">{title}</span>
          {isAnalyzing && (
            <span className="flex items-center gap-1.5 ml-2 text-warning">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              <span className="text-[11px]">analyzing</span>
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="w-[52px]" />
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export { TerminalChrome };
