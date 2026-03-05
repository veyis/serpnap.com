"use client";

import * as React from "react";

/**
 * Preloads the search index in the background for instant search
 * Uses requestIdleCallback to avoid blocking the main thread
 */
export function DocsSearchPreload() {
  React.useEffect(() => {
    // Use requestIdleCallback for non-blocking preload
    const preload = () => {
      // Prefetch the search index API
      fetch("/api/docs/search", {
        priority: "low",
      }).catch(() => {
        // Silently fail - search will load on demand
      });
    };

    // Schedule during idle time
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload, { timeout: 5000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for Safari
      const timeout = setTimeout(preload, 2000);
      return () => clearTimeout(timeout);
    }
  }, []);

  return null;
}
