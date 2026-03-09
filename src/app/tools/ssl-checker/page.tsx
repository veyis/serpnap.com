"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Globe,
  Info,
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

interface SSLIssue {
  label: string;
  severity: "critical" | "warning" | "info";
  description: string;
}

interface SSLResult {
  url: string;
  httpsAccessible: boolean;
  protocol: string;
  hstsEnabled: boolean;
  hstsMaxAge: number | null;
  mixedContentCount: number;
  secureCookies: boolean;
  cdnProvider: string | null;
  issues: SSLIssue[];
  recommendations: string[];
  grade: string;
  scanTime: number;
}

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

function detectCdnProvider(headers: Headers): string | null {
  const serverHeader = (headers.get("server") || "").toLowerCase();
  const viaHeader = (headers.get("via") || "").toLowerCase();
  const poweredBy = (headers.get("x-powered-by") || "").toLowerCase();
  const cfRay = headers.get("cf-ray");
  const xCache = (headers.get("x-cache") || "").toLowerCase();

  if (cfRay) return "Cloudflare";
  if (serverHeader.includes("cloudflare")) return "Cloudflare";
  if (xCache.includes("cloudfront") || viaHeader.includes("cloudfront")) return "Amazon CloudFront";
  if (serverHeader.includes("akamai") || xCache.includes("akamai")) return "Akamai";
  if (serverHeader.includes("fastly") || xCache.includes("fastly")) return "Fastly";
  if (serverHeader.includes("vercel") || poweredBy.includes("vercel")) return "Vercel";
  if (serverHeader.includes("netlify")) return "Netlify";
  if (serverHeader.includes("nginx")) return "Nginx";
  if (serverHeader.includes("apache")) return "Apache";
  if (serverHeader.includes("litespeed")) return "LiteSpeed";
  if (serverHeader.includes("iis") || serverHeader.includes("microsoft")) return "Microsoft IIS";
  return null;
}

function countMixedContent(html: string): number {
  const httpResourcePattern = /(?:src|href|action)\s*=\s*["']http:\/\/[^"']+["']/gi;
  const matches = html.match(httpResourcePattern);
  return matches ? matches.length : 0;
}

function checkSecureCookies(headers: Headers): boolean {
  const setCookie = headers.get("set-cookie") || "";
  if (!setCookie) return true; // No cookies to evaluate
  const hasSecureFlag = setCookie.toLowerCase().includes("secure");
  return hasSecureFlag;
}

function calculateGrade(result: {
  httpsAccessible: boolean;
  hstsEnabled: boolean;
  hstsMaxAge: number | null;
  mixedContentCount: number;
  secureCookies: boolean;
}): string {
  if (!result.httpsAccessible) return "F";

  let score = 100;

  // HSTS
  if (!result.hstsEnabled) {
    score -= 15;
  } else if (result.hstsMaxAge !== null && result.hstsMaxAge < 31536000) {
    score -= 5; // HSTS max-age less than 1 year
  }

  // Mixed content
  if (result.mixedContentCount > 0) {
    score -= Math.min(result.mixedContentCount * 10, 30);
  }

  // Cookies
  if (!result.secureCookies) {
    score -= 10;
  }

  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getGradeColor(grade: string): string {
  if (grade === "A+" || grade === "A") return "text-emerald-500";
  if (grade === "B") return "text-lime-500";
  if (grade === "C") return "text-amber-500";
  if (grade === "D") return "text-orange-500";
  return "text-red-500";
}

function getGradeBg(grade: string): string {
  if (grade === "A+" || grade === "A") return "bg-emerald-500/10";
  if (grade === "B") return "bg-lime-500/10";
  if (grade === "C") return "bg-amber-500/10";
  if (grade === "D") return "bg-orange-500/10";
  return "bg-red-500/10";
}

// ────────────────────────────────────────────────────────────────
// FAQ Data
// ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "What is an SSL certificate?",
    answer:
      "An SSL (Secure Sockets Layer) certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection. It ensures data transferred between users and the website remains private and secure. Websites with SSL certificates use HTTPS instead of HTTP.",
  },
  {
    question: "Why is SSL important for SEO?",
    answer:
      "Google has confirmed HTTPS as a ranking signal since 2014. Websites without SSL certificates may show 'Not Secure' warnings in browsers, which increases bounce rates and reduces trust. SSL is essential for both security and search engine rankings.",
  },
  {
    question: "What is mixed content and why is it bad?",
    answer:
      "Mixed content occurs when a secure HTTPS page loads resources (images, scripts, stylesheets) over insecure HTTP. This weakens the security of the entire page because attackers could intercept the insecure resources. Browsers may block mixed content or show security warnings.",
  },
  {
    question: "What is HSTS and why does it matter?",
    answer:
      "HSTS (HTTP Strict Transport Security) is a security header that tells browsers to only connect to your website via HTTPS. It prevents protocol downgrade attacks and cookie hijacking. A recommended max-age is at least one year (31536000 seconds).",
  },
  {
    question: "How can I fix SSL certificate issues?",
    answer:
      "Common fixes include: installing a valid SSL certificate from a trusted Certificate Authority, redirecting all HTTP traffic to HTTPS, updating internal links to use HTTPS, enabling HSTS headers, and fixing mixed content by updating resource URLs to use HTTPS.",
  },
];

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function SSLCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SSLResult | null>(null);
  const [error, setError] = useState("");

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
      // Attempt to fetch the URL via HTTPS through proxy
      const httpsUrl = normalized.replace(/^http:\/\//i, "https://");
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(httpsUrl)}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      let httpsAccessible = false;
      let html = "";
      let hstsEnabled = false;
      let hstsMaxAge: number | null = null;
      let secureCookies = true;
      let cdnProvider: string | null = null;
      let protocol = "Unknown";

      try {
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          httpsAccessible = true;
          protocol = "HTTPS (TLS)";
          html = await response.text();

          // Check HSTS from response headers (proxy may pass some through)
          const hstsHeader = response.headers.get("strict-transport-security") || "";
          if (hstsHeader) {
            hstsEnabled = true;
            const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/i);
            if (maxAgeMatch) {
              hstsMaxAge = parseInt(maxAgeMatch[1], 10);
            }
          }

          // Also check for HSTS in HTML meta tags (some frameworks emit them)
          if (!hstsEnabled && html.includes("strict-transport-security")) {
            hstsEnabled = true;
          }

          // Check secure cookies
          secureCookies = checkSecureCookies(response.headers);

          // Detect CDN
          cdnProvider = detectCdnProvider(response.headers);
        } else {
          protocol = "HTTP or Unavailable";
        }
      } catch {
        clearTimeout(timeout);
        httpsAccessible = false;
        protocol = "Connection Failed";
      }

      // Analyze mixed content
      const mixedContentCount = httpsAccessible ? countMixedContent(html) : 0;

      // Build issues list
      const issues: SSLIssue[] = [];
      const recommendations: string[] = [];

      if (!httpsAccessible) {
        issues.push({
          label: "HTTPS Not Accessible",
          severity: "critical",
          description: "The website could not be accessed over HTTPS. An SSL certificate may not be installed or configured correctly.",
        });
        recommendations.push("Install a valid SSL certificate from a trusted Certificate Authority (e.g., Let's Encrypt for free certificates).");
        recommendations.push("Configure your web server to serve content over HTTPS on port 443.");
      } else {
        if (!hstsEnabled) {
          issues.push({
            label: "HSTS Not Enabled",
            severity: "warning",
            description: "The Strict-Transport-Security header was not detected. Without HSTS, browsers may still attempt insecure HTTP connections.",
          });
          recommendations.push("Enable HSTS by adding the Strict-Transport-Security header with a max-age of at least 31536000 (1 year).");
        } else if (hstsMaxAge !== null && hstsMaxAge < 31536000) {
          issues.push({
            label: "HSTS Max-Age Too Short",
            severity: "info",
            description: `The HSTS max-age is set to ${hstsMaxAge.toLocaleString()} seconds. A minimum of 31,536,000 seconds (1 year) is recommended.`,
          });
          recommendations.push("Increase your HSTS max-age to at least 31536000 seconds (1 year) for optimal security.");
        }

        if (mixedContentCount > 0) {
          issues.push({
            label: `Mixed Content Detected (${mixedContentCount} resource${mixedContentCount > 1 ? "s" : ""})`,
            severity: "critical",
            description: "The page loads resources over insecure HTTP connections, which weakens HTTPS security and may trigger browser warnings.",
          });
          recommendations.push("Update all resource URLs (images, scripts, stylesheets) to use HTTPS instead of HTTP.");
          recommendations.push("Use protocol-relative URLs or Content-Security-Policy headers to prevent mixed content.");
        }

        if (!secureCookies) {
          issues.push({
            label: "Insecure Cookies Detected",
            severity: "warning",
            description: "One or more cookies are set without the Secure flag, allowing them to be transmitted over insecure HTTP connections.",
          });
          recommendations.push("Add the Secure flag to all cookies to ensure they are only sent over HTTPS connections.");
        }
      }

      if (issues.length === 0 && httpsAccessible) {
        recommendations.push("Your SSL configuration looks solid. Consider submitting your domain for HSTS preloading at hstspreload.org.");
      }

      // Calculate grade
      const grade = calculateGrade({
        httpsAccessible,
        hstsEnabled,
        hstsMaxAge,
        mixedContentCount,
        secureCookies,
      });

      setResult({
        url: httpsUrl,
        httpsAccessible,
        protocol,
        hstsEnabled,
        hstsMaxAge,
        mixedContentCount,
        secureCookies,
        cdnProvider,
        issues,
        recommendations,
        grade,
        scanTime: Date.now() - startTime,
      });
    } catch {
      setError("Failed to check the URL. Please verify the URL and try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const criticalCount = result?.issues.filter((i) => i.severity === "critical").length ?? 0;
  const warningCount = result?.issues.filter((i) => i.severity === "warning").length ?? 0;

  return (
    <>
      {/* Hero */}
      <section className="hero-padding container-padding">
        <div className="container-tight mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Free SEO Tool
          </p>
          <h1 className="text-hero">
            SSL Checker
          </h1>
          <p className="text-subheadline mt-4 max-w-md mx-auto">
            Verify SSL certificates, HTTPS status, and security headers for any website.
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
                  Checking...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check SSL
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
              {/* Grade & Status Header */}
              <div className="rounded-xl border border-border/40 p-6 bg-background mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Grade Badge */}
                  <div className={cn(
                    "w-24 h-24 rounded-2xl flex items-center justify-center shrink-0",
                    getGradeBg(result.grade)
                  )}>
                    <span className={cn("text-4xl font-bold tracking-tight", getGradeColor(result.grade))}>
                      {result.grade}
                    </span>
                  </div>

                  {/* Status Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      {result.httpsAccessible ? (
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ShieldX className="h-5 w-5 text-red-500" />
                      )}
                      <h2 className="text-[18px] font-semibold tracking-tight">
                        {result.httpsAccessible ? "SSL Certificate Active" : "SSL Certificate Missing or Invalid"}
                      </h2>
                    </div>
                    <p className="text-[13px] text-muted-foreground font-mono truncate">
                      {result.url}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">
                      Scanned in {(result.scanTime / 1000).toFixed(1)}s
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="rounded-xl border border-border/40 p-4 text-center bg-background">
                  <div className="flex items-center justify-center mb-2">
                    {result.httpsAccessible ? (
                      <Lock className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Unlock className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className={cn("text-[14px] font-semibold", result.httpsAccessible ? "text-emerald-500" : "text-red-500")}>
                    {result.httpsAccessible ? "HTTPS" : "No HTTPS"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Protocol</p>
                </div>

                <div className="rounded-xl border border-border/40 p-4 text-center bg-background">
                  <div className="flex items-center justify-center mb-2">
                    {result.hstsEnabled ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <p className={cn("text-[14px] font-semibold", result.hstsEnabled ? "text-emerald-500" : "text-amber-500")}>
                    {result.hstsEnabled ? "Enabled" : "Missing"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">HSTS</p>
                </div>

                <div className="rounded-xl border border-border/40 p-4 text-center bg-background">
                  <div className="flex items-center justify-center mb-2">
                    {result.mixedContentCount === 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className={cn("text-[14px] font-semibold", result.mixedContentCount === 0 ? "text-emerald-500" : "text-red-500")}>
                    {result.mixedContentCount === 0 ? "None" : result.mixedContentCount}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mixed Content</p>
                </div>

                <div className="rounded-xl border border-border/40 p-4 text-center bg-background">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-[14px] font-semibold text-foreground truncate px-1">
                    {result.cdnProvider || "Unknown"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Server / CDN</p>
                </div>
              </div>

              {/* Detailed Checks */}
              <div className="rounded-xl border border-border/40 p-5 bg-background mb-6">
                <h3 className="text-[14px] font-semibold mb-4">Security Details</h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "HTTPS Accessible",
                      value: result.httpsAccessible ? "Yes" : "No",
                      pass: result.httpsAccessible,
                    },
                    {
                      label: "Protocol",
                      value: result.protocol,
                      pass: result.httpsAccessible,
                    },
                    {
                      label: "HSTS Header",
                      value: result.hstsEnabled
                        ? result.hstsMaxAge
                          ? `Enabled (max-age: ${result.hstsMaxAge.toLocaleString()}s)`
                          : "Enabled"
                        : "Not detected",
                      pass: result.hstsEnabled,
                    },
                    {
                      label: "Mixed Content",
                      value: result.mixedContentCount === 0
                        ? "No mixed content found"
                        : `${result.mixedContentCount} insecure resource${result.mixedContentCount > 1 ? "s" : ""} detected`,
                      pass: result.mixedContentCount === 0,
                    },
                    {
                      label: "Secure Cookies",
                      value: result.secureCookies ? "All cookies use Secure flag" : "Cookies missing Secure flag",
                      pass: result.secureCookies,
                    },
                    {
                      label: "Server / CDN",
                      value: result.cdnProvider || "Could not determine",
                      pass: null,
                    },
                  ].map((check) => (
                    <div
                      key={check.label}
                      className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        {check.pass === true ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : check.pass === false ? (
                          <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        ) : (
                          <Info className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className="text-[13px] font-medium">{check.label}</span>
                      </div>
                      <span className={cn(
                        "text-[12px]",
                        check.pass === true
                          ? "text-emerald-600 dark:text-emerald-400"
                          : check.pass === false
                            ? "text-red-600 dark:text-red-400"
                            : "text-muted-foreground"
                      )}>
                        {check.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="rounded-xl border border-border/40 p-5 bg-background mb-6">
                  <h3 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    Issues Found
                    {criticalCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        {criticalCount} critical
                      </span>
                    )}
                    {warningCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {warningCount} warning{warningCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {result.issues.map((issue, i) => (
                      <motion.div
                        key={issue.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.05, 0.3) }}
                        className="rounded-xl border border-border/40 p-4 bg-background"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {issue.severity === "critical" ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : issue.severity === "warning" ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <Info className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[13px] font-medium">{issue.label}</span>
                              <span className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                                issue.severity === "critical"
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                  : issue.severity === "warning"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              )}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-[12px] text-muted-foreground leading-relaxed">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="rounded-xl border border-border/40 p-5 bg-background">
                  <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2 text-[13px] text-muted-foreground leading-relaxed">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-foreground/30 mt-0.5">{i + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
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
          { href: "/tools/seo-checker", label: "SEO Checker", description: "Comprehensive SEO audit with 50+ checks and letter grade." },
          { href: "/tools/redirect-checker", label: "Redirect Checker", description: "Trace redirect chains, detect loops, and verify redirect setup." },
          { href: "/tools/broken-link-checker", label: "Broken Link Checker", description: "Scan any webpage for dead links, 404 errors, and redirects." },
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
