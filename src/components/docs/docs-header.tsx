"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/logo";
import { DocsSearch } from "./docs-search";
import { Sun, Moon, Github, ArrowUpRight } from "lucide-react";

export function DocsHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/40",
        "bg-background/80 backdrop-blur-xl backdrop-saturate-150"
      )}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        {/* Left side - Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-[5px] text-foreground/80 hover:text-foreground transition-colors"
          >
            <img
              src="/pxlpeak-logo-cropped.png"
              alt="SerpNap logo"
              width={24}
              height={24}
              className="shrink-0 object-contain"
              draggable={false}
            />
            <Wordmark
              fontSize={16}
              className="text-foreground select-none"
            />
          </Link>
          <div className="hidden h-5 w-px bg-border/60 sm:block" />
          <Link
            href="/docs"
            className="hidden text-sm font-medium text-foreground/60 hover:text-foreground transition-colors sm:block"
          >
            Documentation
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <DocsSearch />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* GitHub */}
          <a
            href="https://github.com/pxlpeak"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            )}
            aria-label="GitHub"
          >
            <Github className="h-4.5 w-4.5" />
          </a>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            )}
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4.5 w-4.5" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )
            ) : (
              <div className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Get Started */}
          <Link
            href="/contact"
            className={cn(
              "ml-2 hidden sm:flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-[color,background-color] duration-200",
              "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            <span>Get Started</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-border/40 px-4 py-2 sm:hidden">
        <DocsSearch />
      </div>
    </header>
  );
}
