"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV_ITEMS = [
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
] as const;

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-wide container-padding flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <Search className="h-5 w-5" />
          <span>SerpNap</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
