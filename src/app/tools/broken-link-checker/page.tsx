"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Link as LinkIcon,
  ArrowRight,
  Copy,
  Check,
  Globe,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { ToolsNav } from "@/components/tools/tools-nav";
import { RelatedResources } from "@/components/tools/related-resources";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

interface LinkResult {
  url: string;
  anchorText: string;
  statusCode: number;
  statusText: string;
  isExternal: boolean;
  type: "ok" | "broken" | "redirect" | "error";
  redirectTo?: string;
}

interface ScanResult {
  pageUrl: string;
  totalLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  healthyLinks: number;
  links: LinkResult[];
  scanTime: number;
}

type FilterType = "all" | "broken" | "redirect" | "ok";

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    return new URL(url).toString();
  } catch {
    return "";
  }
}

function resolveUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function extractLinks(
  html: string,
  pageUrl: string
): { url: string; anchorText: string }[] {
  const linkRegex = /<a\s[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const seen = new Set<string>();
  const results: { url: string; anchorText: string }[] = [];

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].trim();
    if (!href || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;

    const resolved = resolveUrl(href, pageUrl);
    if (!resolved) continue;

    if (seen.has(resolved)) continue;
    seen.add(resolved);

    const anchorText = match[2].replace(/<[^>]*>/g, "").trim() || href;
    results.push({ url: resolved, anchorText });
  }

  return results;
}

function isExternalLink(linkUrl: string, pageUrl: string): boolean {
  try {
    return new URL(linkUrl).hostname !== new URL(pageUrl).hostname;
  } catch {
    return true;
  }
}

async function checkLink(url: string): Promise<{ statusCode: number; statusText: string; redirectTo?: string }> {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(proxyUrl, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    // allorigins always returns 200 if it can fetch, or an error
    if (response.ok) {
      return { statusCode: 200, statusText: "OK" };
    }
    return { statusCode: response.status, statusText: response.statusText };
  } catch {
    return { statusCode: 0, statusText: "Connection Failed" };
  }
}

function classifyStatus(code: number): LinkResult["type"] {
  if (code === 0) return "error";
  if (code >= 200 && code < 300) return "ok";
  if (code >= 300 && code < 400) return "redirect";
  return "broken";
}

// ────────────────────────────────────────────────────────────────
// FAQ Section
// ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "What is a broken link?",
    answer:
      "A broken link (dead link) is a hyperlink that points to a page or resource that no longer exists, returning a 404 or other error. Broken links hurt user experience and SEO rankings.",
  },
  {
    question: "Do broken links affect SEO?",
    answer:
      "Yes. Broken links waste crawl budget, create poor user experience, and can cause link equity loss. Google has confirmed that pages with many broken links may be seen as lower quality.",
  },
  {
    question: "How often should I check for broken links?",
    answer:
      "For active websites, check monthly. After any site migration, redesign, or URL structure change, run a full audit immediately.",
  },
  {
    question: "Is this broken link checker free?",
    answer:
      "Yes, completely free with no signup required. Scan any page and get a full report with status codes, anchor text, and link types.",
  },
];

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function BrokenLinkCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleScan = useCallback(async () => {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setProgress({ checked: 0, total: 0 });

    const startTime = Date.now();

    try {
      // Fetch the page HTML
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(normalized)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        setError(`Could not fetch the page (${response.status}). Make sure the URL is accessible.`);
        setLoading(false);
        return;
      }

      const html = await response.text();
      const links = extractLinks(html, normalized);

      if (links.length === 0) {
        setResult({
          pageUrl: normalized,
          totalLinks: 0,
          brokenLinks: 0,
          redirectLinks: 0,
          healthyLinks: 0,
          links: [],
          scanTime: Date.now() - startTime,
        });
        setLoading(false);
        return;
      }

      setProgress({ checked: 0, total: links.length });

      // Check links in batches of 5 to avoid overwhelming the proxy
      const batchSize = 5;
      const linkResults: LinkResult[] = [];

      for (let i = 0; i < links.length; i += batchSize) {
        const batch = links.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (link) => {
            const check = await checkLink(link.url);
            const linkResult: LinkResult = {
              url: link.url,
              anchorText: link.anchorText.slice(0, 80),
              statusCode: check.statusCode,
              statusText: check.statusText,
              isExternal: isExternalLink(link.url, normalized),
              type: classifyStatus(check.statusCode),
              redirectTo: check.redirectTo,
            };
            return linkResult;
          })
        );
        linkResults.push(...batchResults);
        setProgress({ checked: linkResults.length, total: links.length });
      }

      // Sort: broken first, then redirects, then errors, then ok
      linkResults.sort((a, b) => {
        const order = { broken: 0, error: 1, redirect: 2, ok: 3 };
        return order[a.type] - order[b.type];
      });

      const broken = linkResults.filter((l) => l.type === "broken" || l.type === "error").length;
      const redirects = linkResults.filter((l) => l.type === "redirect").length;

      setResult({
        pageUrl: normalized,
        totalLinks: linkResults.length,
        brokenLinks: broken,
        redirectLinks: redirects,
        healthyLinks: linkResults.length - broken - redirects,
        links: linkResults,
        scanTime: Date.now() - startTime,
      });
    } catch {
      setError("Failed to scan the page. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  const filteredLinks = result
    ? filter === "all"
      ? result.links
      : result.links.filter((l) =>
          filter === "broken" ? l.type === "broken" || l.type === "error" : l.type === filter
        )
    : [];

  return (
    <>
      {/* Hero */}
      <section className="hero-padding container-padding">
        <div className="container-tight mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Free SEO Tool
          </p>
          <h1 className="text-hero">
            Broken Link Checker
          </h1>
          <p className="text-subheadline mt-4 max-w-md mx-auto">
            Scan any webpage for dead links, 404 errors, and redirect issues.
          </p>

          {/* Input */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleScan()}
              placeholder="https://example.com"
              className="flex-1 h-12 rounded-xl border border-border/60 bg-background px-4 text-[14px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
              disabled={loading}
            />
            <Button
              onClick={handleScan}
              disabled={loading || !url.trim()}
              className="h-12 px-6 rounded-xl text-[14px] font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Links
                </>
              )}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-[13px] text-red-500">{error}</p>
          )}

          {/* Progress */}
          {loading && progress.total > 0 && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
                <span>Checking links...</span>
                <span>{progress.checked} / {progress.total}</span>
              </div>
              <div className="h-1.5 bg-foreground/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-foreground/20 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.checked / progress.total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-padding container-padding"
          >
            <div className="container-tight mx-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Total Links", value: result.totalLinks, color: "text-foreground" },
                  { label: "Healthy", value: result.healthyLinks, color: "text-emerald-500" },
                  { label: "Broken", value: result.brokenLinks, color: "text-red-500" },
                  { label: "Redirects", value: result.redirectLinks, color: "text-amber-500" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/40 p-4 text-center bg-background"
                  >
                    <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>
                      {stat.value}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Health Score */}
              {result.totalLinks > 0 && (
                <div className="rounded-xl border border-border/40 p-5 mb-8 bg-background">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium">Link Health Score</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {result.brokenLinks === 0
                          ? "No broken links found — your page is healthy!"
                          : `${result.brokenLinks} broken link${result.brokenLinks > 1 ? "s" : ""} found. Fix them to improve SEO.`}
                      </p>
                    </div>
                    <div className={cn(
                      "text-2xl font-bold",
                      result.brokenLinks === 0 ? "text-emerald-500" : result.brokenLinks <= 3 ? "text-amber-500" : "text-red-500"
                    )}>
                      {Math.round((result.healthyLinks / result.totalLinks) * 100)}%
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-foreground/[0.05] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        result.brokenLinks === 0 ? "bg-emerald-500/50" : result.brokenLinks <= 3 ? "bg-amber-500/50" : "bg-red-500/50"
                      )}
                      style={{ width: `${(result.healthyLinks / result.totalLinks) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 mt-2">
                    Scanned in {(result.scanTime / 1000).toFixed(1)}s
                  </p>
                </div>
              )}

              {/* Filter Tabs */}
              {result.totalLinks > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground/50" />
                  {(["all", "broken", "redirect", "ok"] as FilterType[]).map((f) => {
                    const count =
                      f === "all"
                        ? result.links.length
                        : f === "broken"
                          ? result.links.filter((l) => l.type === "broken" || l.type === "error").length
                          : result.links.filter((l) => l.type === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[12px] font-medium transition-all",
                          filter === f
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                        )}
                      >
                        {f === "all" ? "All" : f === "broken" ? "Broken" : f === "redirect" ? "Redirects" : "Healthy"}
                        {" "}
                        <span className="text-muted-foreground/60">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Link List */}
              {result.totalLinks === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-[14px]">
                  No links found on this page.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLinks.map((link, i) => (
                    <motion.div
                      key={link.url}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      className="rounded-xl border border-border/40 p-4 bg-background hover:border-border/60 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="mt-0.5">
                          {link.type === "ok" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : link.type === "redirect" ? (
                            <ArrowRight className="h-4 w-4 text-amber-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>

                        {/* Link Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-[11px] font-medium px-2 py-0.5 rounded-full",
                              link.type === "ok"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : link.type === "redirect"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                            )}>
                              {link.statusCode || "ERR"} {link.statusText}
                            </span>
                            <span className={cn(
                              "text-[11px] px-2 py-0.5 rounded-full",
                              link.isExternal
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "bg-foreground/[0.06] text-muted-foreground"
                            )}>
                              {link.isExternal ? "External" : "Internal"}
                            </span>
                          </div>
                          <p className="text-[13px] truncate text-foreground/80 font-mono">
                            {link.url}
                          </p>
                          {link.anchorText && link.anchorText !== link.url && (
                            <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                              <LinkIcon className="h-3 w-3 inline mr-1 opacity-40" />
                              {link.anchorText}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopy(link.url)}
                            className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors"
                            title="Copy URL"
                          >
                            {copiedUrl === link.url ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground/50" />
                            )}
                          </button>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tips for broken links */}
              {result.brokenLinks > 0 && (
                <div className="mt-8 rounded-xl border border-border/40 p-5 bg-background">
                  <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    How to Fix Broken Links
                  </h3>
                  <ul className="space-y-2 text-[13px] text-muted-foreground leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">1.</span>
                      <span><strong>Update the link</strong> — If the page moved, update the href to the new URL.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">2.</span>
                      <span><strong>Set up a redirect</strong> — Add a 301 redirect from the old URL to the new one.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">3.</span>
                      <span><strong>Remove the link</strong> — If the content no longer exists, remove the hyperlink entirely.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">4.</span>
                      <span><strong>Create a custom 404</strong> — Design a helpful 404 page that guides users to relevant content.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <section className="section-padding container-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-[15px] font-semibold tracking-tight mb-2">
                  {item.question}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedResources
        tools={[
          { href: "/tools/redirect-checker", label: "Redirect Checker", description: "Trace redirect chains, detect loops, and verify redirect setup." },
          { href: "/tools/seo-checker", label: "SEO Checker", description: "Comprehensive SEO audit with 50+ checks and letter grade." },
          { href: "/tools/sitemap-validator", label: "Sitemap Validator", description: "Validate your XML sitemap for errors and best practices." },
        ]}
        articles={[
          { href: "/blog/seo/how-to-do-seo-audit", title: "How to Do a Complete SEO Audit" },
          { href: "/blog/seo/technical-seo-playbook-2026", title: "Technical SEO Playbook for 2026" },
        ]}
        glossaryTerms={[
          { href: "/glossary/what-is-technical-seo", term: "Technical SEO" },
          { href: "/glossary/what-is-crawl-budget", term: "Crawl Budget" },
          { href: "/glossary/what-is-indexing", term: "Indexing" },
          { href: "/glossary/what-is-core-web-vitals", term: "Core Web Vitals" },
        ]}
      />
      <ToolsNav />
      <CTASection />
    </>
  );
}
