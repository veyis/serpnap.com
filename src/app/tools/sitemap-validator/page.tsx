/**
 * Tool: Sitemap Validator
 * Path: /tools/sitemap-validator
 * Validate XML sitemaps against the Sitemap Protocol specification.
 */
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Globe,
  Sparkles,
  Info,
  Copy,
  Check,
  FileSearch,
  ChevronDown,
  ChevronUp,
  FileText,
  Link2,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { ToolsNav } from "@/components/tools/tools-nav";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

type Severity = "error" | "warning" | "info";

interface ValidationIssue {
  severity: Severity;
  message: string;
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface ValidationResult {
  valid: boolean;
  score: number;
  isSitemapIndex: boolean;
  urlCount: number;
  uniqueUrlCount: number;
  issues: ValidationIssue[];
  urls: SitemapUrl[];
  stats: {
    avgPriority: number | null;
    mostCommonChangefreq: string | null;
    dateRange: { earliest: string | null; latest: string | null };
  };
  fileSizeBytes: number;
}

// ────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────

const VALID_CHANGEFREQ = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
];

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

const INPUT_MODES = ["url", "xml"] as const;
type InputMode = (typeof INPUT_MODES)[number];

// ────────────────────────────────────────────────────────────────
// Validation logic
// ────────────────────────────────────────────────────────────────

function validateSitemap(xml: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  const fileSizeBytes = new Blob([xml]).size;

  // File size check
  if (fileSizeBytes > 50 * 1024 * 1024) {
    issues.push({
      severity: "error",
      message: `File size (${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit.`,
    });
  } else if (fileSizeBytes > 40 * 1024 * 1024) {
    issues.push({
      severity: "warning",
      message: `File size (${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB) is approaching the 50MB limit.`,
    });
  }

  // Parse XML
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  // Check for XML parse errors
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    return {
      valid: false,
      score: 0,
      isSitemapIndex: false,
      urlCount: 0,
      uniqueUrlCount: 0,
      issues: [
        {
          severity: "error",
          message: `Invalid XML: ${parseError.textContent?.slice(0, 200) || "Parse error"}`,
        },
      ],
      urls: [],
      stats: {
        avgPriority: null,
        mostCommonChangefreq: null,
        dateRange: { earliest: null, latest: null },
      },
      fileSizeBytes,
    };
  }

  // Detect sitemap index vs regular sitemap
  const root = doc.documentElement;
  const isSitemapIndex = root.localName === "sitemapindex";
  const isUrlset = root.localName === "urlset";

  if (!isSitemapIndex && !isUrlset) {
    issues.push({
      severity: "error",
      message: `Root element is <${root.localName}>, expected <urlset> or <sitemapindex>.`,
    });
  }

  // Namespace check
  const ns = root.namespaceURI;
  if (ns !== SITEMAP_NS) {
    if (ns) {
      issues.push({
        severity: "error",
        message: `Incorrect namespace "${ns}". Expected "${SITEMAP_NS}".`,
      });
    } else {
      issues.push({
        severity: "error",
        message: `Missing namespace. Expected xmlns="${SITEMAP_NS}".`,
      });
    }
  } else {
    issues.push({
      severity: "info",
      message: "Correct sitemap namespace detected.",
    });
  }

  if (isSitemapIndex) {
    // Handle sitemap index
    const sitemapEls = doc.getElementsByTagNameNS(SITEMAP_NS, "sitemap");
    const fallbackEls =
      sitemapEls.length === 0 ? doc.getElementsByTagName("sitemap") : null;
    const sitemaps = fallbackEls || sitemapEls;

    issues.push({
      severity: "info",
      message: `Sitemap index detected with ${sitemaps.length} child sitemap(s).`,
    });

    const urls: SitemapUrl[] = [];
    for (let i = 0; i < sitemaps.length; i++) {
      const el = sitemaps[i];
      const loc =
        el.getElementsByTagNameNS(SITEMAP_NS, "loc")[0]?.textContent ||
        el.getElementsByTagName("loc")[0]?.textContent;
      if (loc) urls.push({ loc: loc.trim() });
      else
        issues.push({
          severity: "error",
          message: `Child sitemap #${i + 1} is missing <loc> element.`,
        });
    }

    const score = issues.filter((i) => i.severity === "error").length === 0 ? 100 : 40;
    return {
      valid: score >= 70,
      score,
      isSitemapIndex: true,
      urlCount: sitemaps.length,
      uniqueUrlCount: new Set(urls.map((u) => u.loc)).size,
      issues,
      urls: urls.slice(0, 20),
      stats: {
        avgPriority: null,
        mostCommonChangefreq: null,
        dateRange: { earliest: null, latest: null },
      },
      fileSizeBytes,
    };
  }

  // Regular sitemap — extract <url> elements
  const urlEls = doc.getElementsByTagNameNS(SITEMAP_NS, "url");
  const fallbackUrlEls =
    urlEls.length === 0 ? doc.getElementsByTagName("url") : null;
  const urlElements = fallbackUrlEls || urlEls;

  if (urlElements.length === 0) {
    issues.push({
      severity: "error",
      message: "No <url> elements found in the sitemap.",
    });
  }

  // URL count check
  if (urlElements.length > 50000) {
    issues.push({
      severity: "error",
      message: `Contains ${urlElements.length.toLocaleString()} URLs. Maximum allowed per sitemap is 50,000.`,
    });
  } else if (urlElements.length > 45000) {
    issues.push({
      severity: "warning",
      message: `Contains ${urlElements.length.toLocaleString()} URLs, approaching the 50,000 limit.`,
    });
  } else {
    issues.push({
      severity: "info",
      message: `Contains ${urlElements.length.toLocaleString()} URL(s).`,
    });
  }

  const urls: SitemapUrl[] = [];
  const locSet = new Set<string>();
  const priorities: number[] = [];
  const changefreqs: Record<string, number> = {};
  const lastmods: string[] = [];
  let protocolHttp = 0;
  let protocolHttps = 0;

  const getChildText = (parent: Element, tag: string): string | null => {
    const el =
      parent.getElementsByTagNameNS(SITEMAP_NS, tag)[0] ||
      parent.getElementsByTagName(tag)[0];
    return el?.textContent?.trim() || null;
  };

  for (let i = 0; i < urlElements.length; i++) {
    const el = urlElements[i];
    const loc = getChildText(el, "loc");
    const lastmod = getChildText(el, "lastmod");
    const changefreq = getChildText(el, "changefreq");
    const priority = getChildText(el, "priority");

    // <loc> required
    if (!loc) {
      issues.push({
        severity: "error",
        message: `URL entry #${i + 1} is missing required <loc> element.`,
      });
      continue;
    }

    // Duplicate check
    if (locSet.has(loc)) {
      issues.push({
        severity: "warning",
        message: `Duplicate URL: ${loc.length > 80 ? loc.slice(0, 80) + "..." : loc}`,
      });
    }
    locSet.add(loc);

    // Protocol tracking
    if (loc.startsWith("http://")) protocolHttp++;
    else if (loc.startsWith("https://")) protocolHttps++;

    // <lastmod> validation
    if (lastmod) {
      const dateRegex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)?)?$/;
      if (!dateRegex.test(lastmod)) {
        issues.push({
          severity: "warning",
          message: `Invalid <lastmod> date "${lastmod}" in ${loc.length > 60 ? loc.slice(0, 60) + "..." : loc}. Expected ISO 8601 format.`,
        });
      } else {
        lastmods.push(lastmod);
      }
    }

    // <changefreq> validation
    if (changefreq) {
      if (!VALID_CHANGEFREQ.includes(changefreq.toLowerCase())) {
        issues.push({
          severity: "warning",
          message: `Invalid <changefreq> value "${changefreq}". Must be one of: ${VALID_CHANGEFREQ.join(", ")}.`,
        });
      } else {
        const cf = changefreq.toLowerCase();
        changefreqs[cf] = (changefreqs[cf] || 0) + 1;
      }
    }

    // <priority> validation
    if (priority) {
      const p = parseFloat(priority);
      if (isNaN(p) || p < 0 || p > 1) {
        issues.push({
          severity: "warning",
          message: `Invalid <priority> value "${priority}". Must be between 0.0 and 1.0.`,
        });
      } else {
        priorities.push(p);
      }
    }

    urls.push({ loc, lastmod: lastmod || undefined, changefreq: changefreq || undefined, priority: priority || undefined });
  }

  // Protocol consistency
  if (protocolHttp > 0 && protocolHttps > 0) {
    issues.push({
      severity: "warning",
      message: `Mixed protocols: ${protocolHttps} HTTPS and ${protocolHttp} HTTP URLs. Use HTTPS consistently.`,
    });
  } else if (protocolHttp > 0 && protocolHttps === 0) {
    issues.push({
      severity: "warning",
      message: "All URLs use HTTP. Consider migrating to HTTPS.",
    });
  } else if (protocolHttps > 0) {
    issues.push({
      severity: "info",
      message: "All URLs use HTTPS.",
    });
  }

  // Stats
  const avgPriority =
    priorities.length > 0
      ? priorities.reduce((a, b) => a + b, 0) / priorities.length
      : null;

  const mostCommonChangefreq =
    Object.keys(changefreqs).length > 0
      ? Object.entries(changefreqs).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  const sortedDates = lastmods.toSorted();
  const dateRange = {
    earliest: sortedDates[0] || null,
    latest: sortedDates[sortedDates.length - 1] || null,
  };

  // Compute score
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const score = Math.max(0, Math.min(100, 100 - errorCount * 20 - warningCount * 5));

  return {
    valid: errorCount === 0,
    score,
    isSitemapIndex: false,
    urlCount: urlElements.length,
    uniqueUrlCount: locSet.size,
    issues,
    urls: urls.slice(0, 20),
    stats: { avgPriority, mostCommonChangefreq, dateRange },
    fileSizeBytes,
  };
}

// ────────────────────────────────────────────────────────────────
// Severity helpers
// ────────────────────────────────────────────────────────────────

function getSeverityIcon(s: Severity) {
  if (s === "error") return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
  if (s === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
  return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
}

function getSeverityBg(s: Severity) {
  if (s === "error") return "bg-red-500/5 border-red-500/15";
  if (s === "warning") return "bg-amber-500/5 border-amber-500/15";
  return "bg-blue-500/5 border-blue-500/15";
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function SitemapValidatorPage() {
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [xmlInput, setXmlInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAllIssues, setShowAllIssues] = useState(false);

  function handleValidate() {
    setError(null);
    setResult(null);

    if (inputMode === "url") {
      let normalized = urlInput.trim();
      if (!normalized) {
        setError("Please enter a sitemap URL.");
        return;
      }
      if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
        normalized = `https://${normalized}`;
      }
      try {
        new URL(normalized);
      } catch {
        setError("Please enter a valid URL.");
        return;
      }

      setLoading(true);
      fetch(normalized)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.text();
        })
        .then((text) => {
          setResult(validateSitemap(text));
        })
        .catch((err) => {
          setError(
            `Could not fetch sitemap. This may be due to CORS restrictions. Try pasting the XML directly instead. (${err.message})`
          );
        })
        .finally(() => setLoading(false));
    } else {
      const xml = xmlInput.trim();
      if (!xml) {
        setError("Please paste your sitemap XML.");
        return;
      }
      if (!xml.startsWith("<?xml") && !xml.startsWith("<urlset") && !xml.startsWith("<sitemapindex")) {
        setError("Input does not appear to be valid XML. It should start with <?xml, <urlset, or <sitemapindex.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setResult(validateSitemap(xml));
        setLoading(false);
      }, 300);
    }
  }

  function handleCopyReport() {
    if (!result) return;
    const lines = [
      "SITEMAP VALIDATION REPORT",
      "=".repeat(40),
      `Score: ${result.score}/100`,
      `Valid: ${result.valid ? "Yes" : "No"}`,
      `Type: ${result.isSitemapIndex ? "Sitemap Index" : "URL Sitemap"}`,
      `URLs: ${result.urlCount} (${result.uniqueUrlCount} unique)`,
      `File size: ${(result.fileSizeBytes / 1024).toFixed(1)} KB`,
      "",
      "ISSUES",
      "-".repeat(40),
      ...result.issues.map(
        (i) => `[${i.severity.toUpperCase()}] ${i.message}`
      ),
      "",
      "STATS",
      "-".repeat(40),
      result.stats.avgPriority !== null
        ? `Avg priority: ${result.stats.avgPriority.toFixed(2)}`
        : "Avg priority: N/A",
      `Most common changefreq: ${result.stats.mostCommonChangefreq || "N/A"}`,
      `Date range: ${result.stats.dateRange.earliest || "N/A"} to ${result.stats.dateRange.latest || "N/A"}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const visibleIssues = showAllIssues ? result?.issues : result?.issues.slice(0, 10);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="pt-32 pb-12 container-padding">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            SEO Diagnostic
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Sitemap{" "}
            <span className="text-primary italic">Validator</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Validate your XML sitemap against the Sitemap Protocol specification.
            Catch errors before search engines do.
          </p>
        </div>
      </section>

      {/* Input */}
      <section className="container-padding pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-4">
            {INPUT_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setInputMode(mode);
                  setError(null);
                  setResult(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  inputMode === mode
                    ? "bg-foreground text-background"
                    : "bg-zinc-100 dark:bg-zinc-900 text-muted-foreground hover:text-foreground border border-zinc-200 dark:border-zinc-800"
                )}
              >
                {mode === "url" ? "Sitemap URL" : "Paste XML"}
              </button>
            ))}
          </div>

          {inputMode === "url" ? (
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type="url"
                  className="w-full h-14 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 font-medium text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/sitemap.xml"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleValidate()}
                />
              </div>
              <Button
                onClick={handleValidate}
                disabled={loading}
                className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-wide"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validate"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                className="w-full h-48 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-mono text-xs focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
                placeholder={'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n  </url>\n</urlset>'}
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
              />
              <Button
                onClick={handleValidate}
                disabled={loading}
                className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-wide"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Validate XML"}
              </Button>
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 mt-3 flex items-start gap-2"
            >
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </motion.p>
          )}
        </div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container-padding pb-16"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  <span className={cn("text-3xl font-black", getScoreColor(result.score))}>
                    {result.score}
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    Score
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  <span className="text-3xl font-black text-foreground">
                    {result.urlCount.toLocaleString()}
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    {result.isSitemapIndex ? "Sitemaps" : "URLs"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  <span className="text-3xl font-black text-foreground">
                    {result.issues.filter((i) => i.severity !== "info").length}
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    Issues
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  {result.valid ? (
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  ) : (
                    <XCircle className="w-8 h-8 mx-auto text-red-500" />
                  )}
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    {result.valid ? "Valid" : "Invalid"}
                  </span>
                </div>
              </div>

              {/* Type badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <FileText className="w-3.5 h-3.5" />
                  {result.isSitemapIndex ? "Sitemap Index" : "URL Sitemap"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(result.fileSizeBytes / 1024).toFixed(1)} KB
                  {result.uniqueUrlCount !== result.urlCount && (
                    <> &middot; {result.uniqueUrlCount} unique</>
                  )}
                </span>
              </div>

              {/* Issues list */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-foreground">
                    Validation Results
                  </h2>
                  <button
                    onClick={handleCopyReport}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy report"}
                  </button>
                </div>
                <div className="space-y-2">
                  {visibleIssues?.map((issue, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed",
                        getSeverityBg(issue.severity)
                      )}
                    >
                      {getSeverityIcon(issue.severity)}
                      <span className="text-foreground/80">{issue.message}</span>
                    </div>
                  ))}
                </div>
                {result.issues.length > 10 && (
                  <button
                    onClick={() => setShowAllIssues(!showAllIssues)}
                    className="mt-3 text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    {showAllIssues ? (
                      <>
                        Show less <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Show all {result.issues.length} issues{" "}
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stats */}
              {!result.isSitemapIndex && (
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">Avg Priority</span>
                    </div>
                    <span className="text-lg font-black text-foreground">
                      {result.stats.avgPriority !== null
                        ? result.stats.avgPriority.toFixed(2)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <FileSearch className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">Top Changefreq</span>
                    </div>
                    <span className="text-lg font-black text-foreground capitalize">
                      {result.stats.mostCommonChangefreq || "N/A"}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">Date Range</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {result.stats.dateRange.earliest
                        ? `${result.stats.dateRange.earliest.slice(0, 10)} to ${result.stats.dateRange.latest?.slice(0, 10)}`
                        : "No dates found"}
                    </span>
                  </div>
                </div>
              )}

              {/* Sample URLs */}
              {result.urls.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    {result.isSitemapIndex ? "Child Sitemaps" : "Sample URLs"} (first {result.urls.length})
                  </h3>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto">
                    {result.urls.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-zinc-800 rounded-lg p-2.5 border border-zinc-200/50 dark:border-zinc-700/50"
                      >
                        <span className="text-muted-foreground/50 shrink-0 w-6 text-right tabular-nums">
                          {i + 1}
                        </span>
                        <span className="text-foreground truncate">{u.loc}</span>
                        {u.priority && (
                          <span className="text-muted-foreground shrink-0 ml-auto">
                            p:{u.priority}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {result.urlCount > 20 && (
                    <p className="text-[10px] text-muted-foreground mt-3">
                      Showing 20 of {result.urlCount.toLocaleString()} URLs.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Educational Section */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Sitemap Best Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Size and URL limits
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each sitemap file can contain at most 50,000 URLs and must not
                exceed 50MB uncompressed. For larger sites, use a sitemap index
                file that references multiple sitemap files.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Use accurate lastmod dates
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google uses &lt;lastmod&gt; to prioritize crawling. Only update
                the date when content meaningfully changes. Setting all dates to
                today reduces trust in the signal and wastes crawl budget.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Only include canonical URLs
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every URL in your sitemap should be the canonical version. Do not
                include URLs that redirect, return 404, or have a different
                canonical tag. This keeps your crawl budget focused.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Reference in robots.txt
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add a <code className="text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">Sitemap: https://example.com/sitemap.xml</code>{" "}
                directive to your robots.txt file. This helps search engines discover
                your sitemap without needing to submit it manually.
              </p>
            </div>
          </div>

          {/* Pro tip */}
          <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Pro tip:</span>{" "}
              Submit your sitemap in Google Search Console and check the
              &quot;Sitemaps&quot; report regularly. It shows how many URLs were
              discovered vs. indexed, helping you identify crawl coverage gaps.
            </div>
          </div>
        </div>
      </section>

      <ToolsNav />
      <CTASection />
    </main>
  );
}
