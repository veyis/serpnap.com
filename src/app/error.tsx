"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Intentional: error boundary should not rely on Next.js router */}
          <a
            href="/"
            className="px-6 py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
