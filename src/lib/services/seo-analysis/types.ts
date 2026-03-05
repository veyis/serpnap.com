import type { SEOIssue } from "@/schemas/seo-checker";

export interface AnalysisContext {
  html: string;
  url: URL;
  /** Base URL for resolving relative hrefs — from `<base>` tag, defaults to `url` */
  baseUrl?: URL;
  responseHeaders?: Headers;
  responseTime?: number;
  robotsTxtStatus?: "found" | "not_found" | "blocked" | "error";
  robotsTxtHasSitemapRef?: boolean;
  robotsTxtCrawlDelay?: number;
  sitemapStatus?: "found" | "not_found" | "error";
  faviconIcoUrl?: string | null;
  finalUrl?: string;
  inputUrl?: string;
  htmlSize?: number;
}

export interface AnalysisInput {
  url: string;
}

export interface AnalysisError {
  error: string;
  code: string;
}

/** Thrown from "use cache" functions so errors are NOT cached */
export class SEOAnalysisError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "SEOAnalysisError";
  }
}

export interface AnalyzerResult {
  score: number;
  issues: SEOIssue[];
}
