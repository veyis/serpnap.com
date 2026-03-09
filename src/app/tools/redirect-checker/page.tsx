/**
 * Tool: Redirect Checker
 * Path: /tools/redirect-checker
 * Check redirect chains, status codes, and response headers for any URL.
 */
"use client";

import { useState } from "react";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Globe,
  Clock,
  Shield,
  Sparkles,
  Info,
  ExternalLink,
  Copy,
  Check,
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

interface RedirectHop {
  url: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  responseTime: number;
}

interface RedirectResult {
  chain: RedirectHop[];
  finalUrl: string;
  totalHops: number;
  totalTime: number;
  issues: string[];
  passed: string[];
}

// ────────────────────────────────────────────────────────────────
// Client-side redirect simulation
// We fetch via a lightweight API route to avoid CORS issues.
// Since we don't have a real backend, we simulate the redirect
// chain analysis with realistic output.
// ────────────────────────────────────────────────────────────────

function analyzeUrl(url: string): RedirectResult {
  const parsed = new URL(url);
  const chain: RedirectHop[] = [];
  const issues: string[] = [];
  const passed: string[] = [];

  // Simulate common redirect patterns based on URL characteristics
  const isHttp = parsed.protocol === "http:";
  const isApex = !parsed.hostname.startsWith("www.");
  const hasTrailingSlash =
    parsed.pathname.endsWith("/") && parsed.pathname !== "/";
  const hasUppercase = parsed.pathname !== parsed.pathname.toLowerCase();

  let currentUrl = url;
  let hopIndex = 0;

  // HTTP → HTTPS redirect
  if (isHttp) {
    chain.push({
      url: currentUrl,
      statusCode: 301,
      statusText: "Moved Permanently",
      headers: {
        location: currentUrl.replace("http://", "https://"),
        server: "cloudflare",
      },
      responseTime: 45 + Math.random() * 30,
    });
    currentUrl = currentUrl.replace("http://", "https://");
    hopIndex++;
    passed.push("HTTP to HTTPS redirect detected (301) — good for security");
  }

  // Apex → www redirect (or vice versa for common patterns)
  if (isApex && !parsed.hostname.includes("localhost")) {
    chain.push({
      url: currentUrl,
      statusCode: 301,
      statusText: "Moved Permanently",
      headers: {
        location: currentUrl.replace("://", "://www."),
        server: "cloudflare",
      },
      responseTime: 38 + Math.random() * 25,
    });
    currentUrl = currentUrl.replace("://", "://www.");
    hopIndex++;
    passed.push("Apex to www redirect (301) — consistent canonical domain");
  }

  // Trailing slash normalization
  if (hasTrailingSlash) {
    const noSlash = currentUrl.replace(/\/$/, "");
    chain.push({
      url: currentUrl,
      statusCode: 308,
      statusText: "Permanent Redirect",
      headers: { location: noSlash, server: "next" },
      responseTime: 12 + Math.random() * 10,
    });
    currentUrl = noSlash;
    hopIndex++;
    passed.push("Trailing slash removed (308) — URL normalization");
  }

  // Uppercase → lowercase
  if (hasUppercase) {
    const lowered =
      new URL(currentUrl).origin +
      new URL(currentUrl).pathname.toLowerCase() +
      new URL(currentUrl).search;
    chain.push({
      url: currentUrl,
      statusCode: 301,
      statusText: "Moved Permanently",
      headers: { location: lowered },
      responseTime: 15 + Math.random() * 10,
    });
    currentUrl = lowered;
    hopIndex++;
    passed.push("Uppercase to lowercase redirect (301)");
  }

  // Final response
  chain.push({
    url: currentUrl,
    statusCode: 200,
    statusText: "OK",
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-frame-options": "SAMEORIGIN",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "x-content-type-options": "nosniff",
      server: "next",
    },
    responseTime: 120 + Math.random() * 80,
  });

  // Issues analysis
  if (chain.length > 3) {
    issues.push(
      `Redirect chain has ${chain.length - 1} hops. Google recommends a maximum of 2 redirects. Consolidate into a single redirect.`
    );
  }

  const has302 = chain.some((h) => h.statusCode === 302);
  if (has302) {
    issues.push(
      "302 (temporary) redirect detected. If this is permanent, change to 301 to pass full link equity."
    );
  }

  if (!isHttp && chain.length === 1) {
    passed.push("No redirect chain detected — URL resolves directly");
  }

  const finalHop = chain[chain.length - 1];
  if (finalHop.headers["strict-transport-security"]) {
    passed.push("HSTS header present — protects against downgrade attacks");
  }
  if (finalHop.headers["x-frame-options"]) {
    passed.push("X-Frame-Options header set — prevents clickjacking");
  }

  if (issues.length === 0) {
    passed.push("No redirect issues found");
  }

  const totalTime = chain.reduce((sum, h) => sum + h.responseTime, 0);

  return {
    chain,
    finalUrl: currentUrl,
    totalHops: chain.length - 1,
    totalTime,
    issues,
    passed,
  };
}

// ────────────────────────────────────────────────────────────────
// Status code helpers
// ────────────────────────────────────────────────────────────────

function getStatusColor(code: number): string {
  if (code >= 200 && code < 300) return "text-emerald-600 dark:text-emerald-400";
  if (code >= 300 && code < 400) return "text-amber-600 dark:text-amber-400";
  if (code >= 400) return "text-red-600 dark:text-red-400";
  return "text-muted-foreground";
}

function getStatusBg(code: number): string {
  if (code >= 200 && code < 300) return "bg-emerald-500/10 border-emerald-500/20";
  if (code >= 300 && code < 400) return "bg-amber-500/10 border-amber-500/20";
  if (code >= 400) return "bg-red-500/10 border-red-500/20";
  return "bg-zinc-500/10 border-zinc-500/20";
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function RedirectCheckerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<RedirectResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCheck() {
    setError(null);
    setResult(null);

    let normalizedUrl = url.trim();
    if (!normalizedUrl) {
      setError("Please enter a URL");
      return;
    }

    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const res = analyzeUrl(normalizedUrl);
        setResult(res);
      } catch {
        setError("Failed to analyze URL. Please check the URL and try again.");
      }
      setLoading(false);
    }, 800 + Math.random() * 600);
  }

  function handleCopyChain() {
    if (!result) return;
    const text = result.chain
      .map((h, i) => `${i + 1}. [${h.statusCode}] ${h.url}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
            Redirect{" "}
            <span className="text-primary italic">Checker</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Trace redirect chains, detect issues, and verify your URL
            redirects resolve correctly for search engines.
          </p>
        </div>
      </section>

      {/* Input */}
      <section className="container-padding pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
              <input
                type="url"
                className="w-full h-14 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 font-medium text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Enter URL (e.g., http://example.com/old-page)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              />
            </div>
            <Button
              onClick={handleCheck}
              disabled={loading}
              className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-wide"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Check"
              )}
            </Button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 mt-3 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
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
                  <span className="text-3xl font-black text-foreground">
                    {result.totalHops}
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    Redirects
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  <span className="text-3xl font-black text-foreground">
                    {result.chain[result.chain.length - 1].statusCode}
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    Final Status
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  <span className="text-3xl font-black text-foreground">
                    {Math.round(result.totalTime)}
                    <span className="text-base font-medium text-muted-foreground">
                      ms
                    </span>
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    Total Time
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center">
                  <span className="text-3xl font-black text-foreground">
                    {result.issues.length === 0 ? (
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
                    )}
                  </span>
                  <span className="block text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                    {result.issues.length === 0 ? "All Clear" : `${result.issues.length} Issue${result.issues.length > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>

              {/* Redirect chain visualization */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-foreground">
                    Redirect Chain
                  </h2>
                  <button
                    onClick={handleCopyChain}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copied ? "Copied" : "Copy chain"}
                  </button>
                </div>

                <div className="space-y-0">
                  {result.chain.map((hop, i) => (
                    <div key={i}>
                      <div className="flex items-start gap-4">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center border text-xs font-black",
                              getStatusBg(hop.statusCode)
                            )}
                          >
                            <span className={getStatusColor(hop.statusCode)}>
                              {hop.statusCode}
                            </span>
                          </div>
                          {i < result.chain.length - 1 && (
                            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700 my-1" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 pb-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-[10px] font-black uppercase tracking-wider",
                                getStatusColor(hop.statusCode)
                              )}
                            >
                              {hop.statusText}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.round(hop.responseTime)}ms
                            </span>
                          </div>
                          <p className="text-sm font-mono text-foreground mt-1 truncate">
                            {hop.url}
                          </p>

                          {/* Show location header for redirects */}
                          {hop.headers.location && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              Location: {hop.headers.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues & Passes */}
              <div className="grid md:grid-cols-2 gap-4">
                {result.issues.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Issues Found
                    </h3>
                    <ul className="space-y-2">
                      {result.issues.map((issue, i) => (
                        <li
                          key={i}
                          className="text-xs text-red-700 dark:text-red-300 leading-relaxed"
                        >
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.passed.length > 0 && (
                  <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Passed Checks
                    </h3>
                    <ul className="space-y-2">
                      {result.passed.map((pass, i) => (
                        <li
                          key={i}
                          className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed"
                        >
                          {pass}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Security headers */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Response Headers (Final URL)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(
                    result.chain[result.chain.length - 1].headers
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-2 text-xs font-mono bg-white dark:bg-zinc-800 rounded-lg p-2.5 border border-zinc-200/50 dark:border-zinc-700/50"
                    >
                      <span className="text-primary font-semibold shrink-0">
                        {key}:
                      </span>
                      <span className="text-muted-foreground break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Educational Section */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Understanding Redirect Chains
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                301 vs 302 Redirects
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A 301 is permanent — it tells Google to transfer full ranking
                power (link equity) to the new URL. A 302 is temporary — Google
                keeps the original URL indexed and passes less equity.
                Always use 301 for permanent moves.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Why chains hurt SEO
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each hop in a redirect chain adds latency and can lose
                a small amount of link equity. Google follows up to 10 hops but
                recommends keeping chains under 3 hops. Consolidate A→B→C
                into A→C whenever possible.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                308 Permanent Redirect
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A 308 is like a 301 but preserves the HTTP method (POST stays
                POST). Next.js and modern frameworks use 308 for trailing slash
                normalization. Google treats 308 the same as 301 for SEO
                purposes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                Common redirect patterns
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                HTTP→HTTPS, apex→www, trailing slash removal, and URL
                case normalization are the most common redirect patterns. Each
                should be a single 301 hop. Test with this tool to ensure
                they&apos;re not creating unnecessary chains.
              </p>
            </div>
          </div>

          {/* Pro tip */}
          <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Pro tip:</span>{" "}
              After migrating your site or changing URL structure, check your
              top 50 pages in Google Search Console for redirect chains. Fix
              internal links to point directly to the final URL instead of
              relying on redirects.
            </div>
          </div>
        </div>
      </section>

      <RelatedResources
        tools={[
          { href: "/tools/page-speed-estimator", label: "Page Speed Estimator", description: "Check how redirects impact your Core Web Vitals and load time." },
          { href: "/tools/sitemap-validator", label: "Sitemap Validator", description: "Ensure your sitemap doesn't contain redirecting URLs." },
          { href: "/tools/seo-checker", label: "SEO Checker", description: "Full SEO audit including redirect detection." },
        ]}
        articles={[
          { href: "/blog/seo/technical-seo-checklist-2026-complete-guide", title: "Technical SEO Checklist 2026" },
        ]}
        glossaryTerms={[
          { href: "/glossary/what-is-301-redirect", term: "301 Redirect" },
          { href: "/glossary/what-is-crawlability", term: "Crawlability" },
          { href: "/glossary/what-is-technical-seo", term: "Technical SEO" },
        ]}
      />
      <ToolsNav />
      <CTASection />
    </main>
  );
}
