"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
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

interface HeaderResult {
  name: string;
  status: "present" | "missing" | "warning";
  value: string;
  recommendation: string;
}

interface AnalysisResult {
  url: string;
  grade: string;
  gradeColor: string;
  presentCount: number;
  missingCount: number;
  warningCount: number;
  headers: HeaderResult[];
  scanTime: number;
}

// ────────────────────────────────────────────────────────────────
// Security header definitions
// ────────────────────────────────────────────────────────────────

interface SecurityHeaderDef {
  name: string;
  detect: (html: string, url: string) => { found: boolean; value: string; warning?: boolean };
  recommendation: string;
}

const SECURITY_HEADERS: SecurityHeaderDef[] = [
  {
    name: "Content-Security-Policy",
    detect: (html) => {
      const metaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']Content-Security-Policy["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      // Check for CSP-related nonce attributes on scripts
      const hasNonce = /nonce\s*=\s*["'][^"']+["']/i.test(html);
      if (hasNonce) return { found: true, value: "Detected via nonce attributes on inline scripts" };
      return { found: false, value: "" };
    },
    recommendation:
      "Add a Content-Security-Policy header to control which resources the browser can load. Start with: Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
  },
  {
    name: "X-Frame-Options",
    detect: (html) => {
      const metaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']X-Frame-Options["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      // Check for frame-ancestors in CSP meta tag as equivalent
      const cspMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']Content-Security-Policy["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (cspMatch && /frame-ancestors/i.test(cspMatch[1])) {
        return { found: true, value: "Handled via CSP frame-ancestors directive" };
      }
      return { found: false, value: "" };
    },
    recommendation:
      "Add X-Frame-Options: DENY or SAMEORIGIN to prevent your site from being embedded in iframes, protecting against clickjacking attacks.",
  },
  {
    name: "X-Content-Type-Options",
    detect: (html) => {
      const metaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']X-Content-Type-Options["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      return { found: false, value: "" };
    },
    recommendation:
      "Add X-Content-Type-Options: nosniff to prevent browsers from MIME-type sniffing, reducing exposure to drive-by download attacks.",
  },
  {
    name: "Strict-Transport-Security",
    detect: (_html, url) => {
      // HSTS can only be set via HTTP header, not meta tags.
      // If the site is served over HTTPS we infer it might be configured server-side.
      const isHttps = url.startsWith("https://");
      if (isHttps) {
        return { found: true, value: "Site served over HTTPS (HSTS likely configured server-side)", warning: true };
      }
      return { found: false, value: "" };
    },
    recommendation:
      "Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload to force HTTPS connections and protect against protocol downgrade attacks.",
  },
  {
    name: "Referrer-Policy",
    detect: (html) => {
      // Check meta tag
      const metaMatch = html.match(/<meta[^>]*name\s*=\s*["']referrer["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      return { found: false, value: "" };
    },
    recommendation:
      "Add Referrer-Policy: strict-origin-when-cross-origin to control how much referrer information is shared when navigating away from your site.",
  },
  {
    name: "Permissions-Policy",
    detect: (html) => {
      // Permissions-Policy (formerly Feature-Policy) can only be set via HTTP header.
      // Check for the old Feature-Policy meta tag as a hint.
      const metaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["'](?:Permissions-Policy|Feature-Policy)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      // Check for allow attribute on iframes as indirect signal
      const hasIframeAllow = /<iframe[^>]*allow\s*=\s*["'][^"']+["'][^>]*>/i.test(html);
      if (hasIframeAllow) {
        return { found: true, value: "Detected via iframe allow attributes (partial implementation)", warning: true };
      }
      return { found: false, value: "" };
    },
    recommendation:
      "Add Permissions-Policy: camera=(), microphone=(), geolocation=() to restrict which browser features your site can access, reducing attack surface.",
  },
  {
    name: "X-XSS-Protection",
    detect: (html) => {
      const metaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']X-XSS-Protection["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      return { found: false, value: "" };
    },
    recommendation:
      "Add X-XSS-Protection: 0 (modern recommendation) as browsers have deprecated the XSS auditor. Rely on Content-Security-Policy instead for XSS protection.",
  },
  {
    name: "Cache-Control",
    detect: (html) => {
      // Check for cache-control meta tags
      const metaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']Cache-Control["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (metaMatch) return { found: true, value: metaMatch[1] };
      // Check for pragma or expires as fallback indicator
      const pragmaMatch = html.match(/<meta[^>]*http-equiv\s*=\s*["']Pragma["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
      if (pragmaMatch) return { found: true, value: `Via Pragma: ${pragmaMatch[1]}` };
      return { found: false, value: "" };
    },
    recommendation:
      "Add Cache-Control headers to control how browsers and CDNs cache your content. For HTML pages: Cache-Control: no-cache, private. For static assets: Cache-Control: public, max-age=31536000, immutable.",
  },
];

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

function calculateGrade(headers: HeaderResult[]): { grade: string; gradeColor: string } {
  const total = headers.length;
  const present = headers.filter((h) => h.status === "present").length;
  const warnings = headers.filter((h) => h.status === "warning").length;
  const score = (present + warnings * 0.5) / total;

  if (score >= 0.95) return { grade: "A+", gradeColor: "text-emerald-500" };
  if (score >= 0.85) return { grade: "A", gradeColor: "text-emerald-500" };
  if (score >= 0.75) return { grade: "B", gradeColor: "text-green-500" };
  if (score >= 0.6) return { grade: "C", gradeColor: "text-amber-500" };
  if (score >= 0.4) return { grade: "D", gradeColor: "text-orange-500" };
  return { grade: "F", gradeColor: "text-red-500" };
}

// ────────────────────────────────────────────────────────────────
// FAQ Section
// ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "What are HTTP response headers?",
    answer:
      "HTTP response headers are metadata sent by a web server along with the requested content. They contain information about caching, security policies, content type, server software, and more. Properly configured headers improve security, performance, and SEO.",
  },
  {
    question: "Why are security headers important?",
    answer:
      "Security headers like Content-Security-Policy, Strict-Transport-Security, and X-Frame-Options protect your website and users from attacks such as cross-site scripting (XSS), clickjacking, and man-in-the-middle attacks. Missing security headers leave your site vulnerable.",
  },
  {
    question: "What is a Content-Security-Policy header?",
    answer:
      "Content-Security-Policy (CSP) is an HTTP header that controls which resources the browser is allowed to load for a given page. It helps prevent XSS attacks by specifying approved content sources. A well-configured CSP is one of the most effective security headers you can implement.",
  },
  {
    question: "What is HSTS and why should I enable it?",
    answer:
      "HTTP Strict-Transport-Security (HSTS) tells browsers to only connect to your site over HTTPS, preventing protocol downgrade attacks and cookie hijacking. Once a browser receives the HSTS header, it will automatically use HTTPS for all future requests to your domain.",
  },
  {
    question: "How is the security header grade calculated?",
    answer:
      "The grade is based on the presence and configuration of key security headers: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection, and Cache-Control. Each present header earns points, and the total determines the letter grade from A+ to F.",
  },
];

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function HttpHeaderCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [expandedHeader, setExpandedHeader] = useState<string | null>(null);

  const handleCheck = useCallback(async () => {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const startTime = Date.now();

    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(normalized)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        setError(`Could not fetch the page (${response.status}). Make sure the URL is accessible.`);
        setLoading(false);
        return;
      }

      const html = await response.text();

      // Analyze security headers based on HTML content and URL
      const headers: HeaderResult[] = SECURITY_HEADERS.map((def) => {
        const detection = def.detect(html, normalized);
        if (detection.found && detection.warning) {
          return {
            name: def.name,
            status: "warning" as const,
            value: detection.value,
            recommendation: def.recommendation,
          };
        }
        if (detection.found) {
          return {
            name: def.name,
            status: "present" as const,
            value: detection.value,
            recommendation: "",
          };
        }
        return {
          name: def.name,
          status: "missing" as const,
          value: "",
          recommendation: def.recommendation,
        };
      });

      const { grade, gradeColor } = calculateGrade(headers);

      setResult({
        url: normalized,
        grade,
        gradeColor,
        presentCount: headers.filter((h) => h.status === "present").length,
        missingCount: headers.filter((h) => h.status === "missing").length,
        warningCount: headers.filter((h) => h.status === "warning").length,
        headers,
        scanTime: Date.now() - startTime,
      });
    } catch {
      setError("Failed to analyze the page. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const toggleExpanded = (headerName: string) => {
    setExpandedHeader((prev) => (prev === headerName ? null : headerName));
  };

  return (
    <>
      {/* Hero */}
      <section className="hero-padding container-padding">
        <div className="container-tight mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Free SEO Tool
          </p>
          <h1 className="text-hero">
            HTTP Header Checker
          </h1>
          <p className="text-subheadline mt-4 max-w-md mx-auto">
            Analyze server response headers and security configuration for any URL.
          </p>

          {/* Input */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleCheck()}
              placeholder="https://example.com"
              className="flex-1 h-12 rounded-xl border border-border/60 bg-background px-4 text-[14px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
              disabled={loading}
            />
            <Button
              onClick={handleCheck}
              disabled={loading || !url.trim()}
              className="h-12 px-6 rounded-xl text-[14px] font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Headers
                </>
              )}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-[13px] text-red-500">{error}</p>
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
                  { label: "Security Grade", value: result.grade, color: result.gradeColor },
                  { label: "Present", value: result.presentCount, color: "text-emerald-500" },
                  { label: "Missing", value: result.missingCount, color: "text-red-500" },
                  { label: "Warnings", value: result.warningCount, color: "text-amber-500" },
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

              {/* Grade Summary */}
              <div className="rounded-xl border border-border/40 p-5 mb-8 bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Header Score
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {result.missingCount === 0
                        ? "All security headers are configured — excellent setup!"
                        : `${result.missingCount} security header${result.missingCount > 1 ? "s" : ""} missing. Review recommendations below.`}
                    </p>
                  </div>
                  <div className={cn("text-3xl font-bold", result.gradeColor)}>
                    {result.grade}
                  </div>
                </div>
                <div className="mt-3 h-2 bg-foreground/[0.05] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      result.missingCount === 0
                        ? "bg-emerald-500/50"
                        : result.missingCount <= 2
                          ? "bg-amber-500/50"
                          : "bg-red-500/50"
                    )}
                    style={{
                      width: `${((result.presentCount + result.warningCount * 0.5) / result.headers.length) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground/60 mt-2">
                  Analyzed in {(result.scanTime / 1000).toFixed(1)}s
                </p>
              </div>

              {/* Header List */}
              <div className="space-y-2">
                {result.headers.map((header, i) => (
                  <motion.div
                    key={header.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.4) }}
                    className="rounded-xl border border-border/40 bg-background hover:border-border/60 transition-colors overflow-hidden"
                  >
                    <div
                      className="flex items-start gap-3 p-4 cursor-pointer"
                      onClick={() => header.status !== "present" && toggleExpanded(header.name)}
                    >
                      {/* Status Icon */}
                      <div className="mt-0.5">
                        {header.status === "present" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : header.status === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>

                      {/* Header Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[14px] font-semibold tracking-tight">
                            {header.name}
                          </span>
                          <span
                            className={cn(
                              "text-[11px] font-medium px-2 py-0.5 rounded-full",
                              header.status === "present"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : header.status === "warning"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                            )}
                          >
                            {header.status === "present"
                              ? "Present"
                              : header.status === "warning"
                                ? "Partial"
                                : "Missing"}
                          </span>
                        </div>
                        {header.value && (
                          <p className="text-[12px] text-muted-foreground font-mono truncate">
                            {header.value}
                          </p>
                        )}
                      </div>

                      {/* Expand Icon */}
                      {header.status !== "present" && (
                        <div className="mt-0.5 shrink-0">
                          {expandedHeader === header.name ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground/50" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded Recommendation */}
                    <AnimatePresence>
                      {expandedHeader === header.name && header.recommendation && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 ml-7">
                            <div className="rounded-lg bg-foreground/[0.03] border border-border/30 p-3">
                              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                                Recommendation
                              </p>
                              <p className="text-[13px] text-muted-foreground leading-relaxed">
                                {header.recommendation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Tips for improving headers */}
              {result.missingCount > 0 && (
                <div className="mt-8 rounded-xl border border-border/40 p-5 bg-background">
                  <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    How to Add Security Headers
                  </h3>
                  <ul className="space-y-2 text-[13px] text-muted-foreground leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">1.</span>
                      <span><strong>Web server config</strong> — Add headers in your Nginx, Apache, or IIS configuration for server-wide coverage.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">2.</span>
                      <span><strong>CDN or hosting panel</strong> — Most CDNs (Cloudflare, Vercel, Netlify) let you set custom response headers in their dashboard.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">3.</span>
                      <span><strong>Application middleware</strong> — Set headers in your framework (Next.js next.config.js, Express middleware, etc.).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground/30 mt-0.5">4.</span>
                      <span><strong>Test after changes</strong> — Re-run this checker after deploying to verify headers are correctly applied.</span>
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
          { href: "/tools/ssl-checker", label: "SSL Checker", description: "Verify SSL certificate validity, expiry, and configuration." },
          { href: "/tools/seo-checker", label: "SEO Checker", description: "Comprehensive SEO audit with 50+ checks and letter grade." },
          { href: "/tools/broken-link-checker", label: "Broken Link Checker", description: "Scan any page for dead links, 404 errors, and redirects." },
        ]}
        articles={[
          { href: "/blog/seo/how-to-do-seo-audit", title: "How to Do a Complete SEO Audit" },
          { href: "/blog/seo/technical-seo-playbook-2026", title: "Technical SEO Playbook for 2026" },
        ]}
        glossaryTerms={[
          { href: "/glossary/what-is-technical-seo", term: "Technical SEO" },
          { href: "/glossary/what-is-core-web-vitals", term: "Core Web Vitals" },
          { href: "/glossary/what-is-https", term: "HTTPS" },
          { href: "/glossary/what-is-crawl-budget", term: "Crawl Budget" },
        ]}
      />
      <ToolsNav />
      <CTASection />
    </>
  );
}
