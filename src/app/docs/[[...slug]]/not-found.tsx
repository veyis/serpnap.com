import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function DocNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
        <FileQuestion className="h-8 w-8 text-foreground/40" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mb-8 max-w-sm text-foreground/60">
        The documentation page you're looking for doesn't exist or may have been
        moved.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/docs"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          Back to Docs
        </Link>
        <Link
          href="/contact"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium transition-colors",
            "text-foreground/70 hover:border-border hover:text-foreground hover:bg-foreground/5"
          )}
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
