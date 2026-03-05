"use client";

import { useRef, useEffect } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function CommandInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasValue = value.trim().length > 0;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 pl-5 pr-1 py-1 rounded-full",
        "bg-(--seo-surface)",
        "border border-(--seo-border)",
        "transition-all duration-200",
        "hover:shadow-sm",
        "focus-within:shadow-md focus-within:border-(--seo-border)",
      )}
    >
      <Search className="w-5 h-5 text-(--seo-text-faint) group-focus-within:text-(--seo-text-muted) shrink-0 transition-colors duration-200" />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !disabled && onSubmit()}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 bg-transparent text-[17px] text-(--seo-text) placeholder:text-(--seo-text-faint) outline-none min-w-0",
          "tracking-[-0.01em]",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || isLoading}
        className={cn(
          "shrink-0 flex items-center justify-center gap-2 transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          hasValue
            ? "px-6 py-2 rounded-full text-[15px] font-medium text-(--seo-text) border border-(--seo-border) bg-(--seo-surface-hover) hover:bg-(--seo-surface) hover:border-(--seo-text-muted)/30 hover:shadow-md active:scale-[0.98] backdrop-blur-md"
            : "w-9 h-9 rounded-full bg-(--seo-surface-hover) text-(--seo-text-muted)",
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : hasValue ? (
          "Analyze"
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

export { CommandInput };
