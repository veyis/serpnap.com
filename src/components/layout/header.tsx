"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "glass border-b border-border/40 shadow-xs"
            : "bg-transparent"
        )}
      >
        <div className="container-wide container-padding flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-[15px] tracking-tight transition-opacity duration-300 hover:opacity-70"
          >
            <Image
              src="/pxlpeak-logo.png"
              alt="PxlPeak Logo"
              width={26}
              height={26}
              className="rounded-lg"
            />
            <span className="tracking-[-0.02em]">SerpNap</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300",
                    isActive
                      ? "text-foreground bg-foreground/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex sm:hidden h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground hover:bg-accent/50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-14 left-0 right-0 glass border-b border-border/40 p-5">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-3 text-[15px] font-medium rounded-xl transition-colors duration-200",
                      isActive
                        ? "text-foreground bg-foreground/[0.05]"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
