/**
 * Tool: Robots.txt Generator
 * Path: /tools/robots-txt-generator
 * Generate valid robots.txt files with presets for common platforms.
 */
"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Shield,
  Sparkles,
  RotateCcw,
  Download,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { ToolsNav } from "@/components/tools/tools-nav";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

interface RobotsRule {
  id: string;
  userAgent: string;
  action: "allow" | "disallow";
  path: string;
}

interface Preset {
  name: string;
  description: string;
  rules: Omit<RobotsRule, "id">[];
  sitemapPath: string;
  crawlDelay: string;
}

// ────────────────────────────────────────────────────────────────
// Presets
// ────────────────────────────────────────────────────────────────

const presets: Record<string, Preset> = {
  standard: {
    name: "Standard Website",
    description: "Allow all crawlers, block admin and private paths",
    rules: [
      { userAgent: "*", action: "disallow", path: "/admin/" },
      { userAgent: "*", action: "disallow", path: "/api/" },
      { userAgent: "*", action: "disallow", path: "/private/" },
      { userAgent: "*", action: "disallow", path: "/*.json$" },
      { userAgent: "*", action: "allow", path: "/" },
    ],
    sitemapPath: "/sitemap.xml",
    crawlDelay: "",
  },
  wordpress: {
    name: "WordPress",
    description: "Optimized for WordPress sites with common exclusions",
    rules: [
      { userAgent: "*", action: "disallow", path: "/wp-admin/" },
      { userAgent: "*", action: "allow", path: "/wp-admin/admin-ajax.php" },
      { userAgent: "*", action: "disallow", path: "/wp-includes/" },
      { userAgent: "*", action: "disallow", path: "/wp-content/plugins/" },
      { userAgent: "*", action: "disallow", path: "/wp-content/cache/" },
      { userAgent: "*", action: "disallow", path: "/?s=" },
      { userAgent: "*", action: "disallow", path: "/search/" },
      { userAgent: "*", action: "disallow", path: "/author/" },
      { userAgent: "*", action: "disallow", path: "/tag/" },
      { userAgent: "*", action: "allow", path: "/" },
    ],
    sitemapPath: "/sitemap_index.xml",
    crawlDelay: "",
  },
  nextjs: {
    name: "Next.js",
    description: "Optimized for Next.js applications",
    rules: [
      { userAgent: "*", action: "disallow", path: "/_next/static/" },
      { userAgent: "*", action: "disallow", path: "/api/" },
      { userAgent: "*", action: "disallow", path: "/admin/" },
      { userAgent: "*", action: "disallow", path: "/dashboard/" },
      { userAgent: "*", action: "allow", path: "/_next/image" },
      { userAgent: "*", action: "allow", path: "/" },
    ],
    sitemapPath: "/sitemap.xml",
    crawlDelay: "",
  },
  ecommerce: {
    name: "E-Commerce",
    description: "For Shopify, WooCommerce, or custom stores",
    rules: [
      { userAgent: "*", action: "disallow", path: "/cart" },
      { userAgent: "*", action: "disallow", path: "/checkout" },
      { userAgent: "*", action: "disallow", path: "/account/" },
      { userAgent: "*", action: "disallow", path: "/search?*" },
      { userAgent: "*", action: "disallow", path: "/collections/*+*" },
      { userAgent: "*", action: "disallow", path: "/*?sort_by=" },
      { userAgent: "*", action: "disallow", path: "/*?page=" },
      { userAgent: "*", action: "disallow", path: "/admin/" },
      { userAgent: "*", action: "allow", path: "/" },
    ],
    sitemapPath: "/sitemap.xml",
    crawlDelay: "",
  },
  blockAiBots: {
    name: "Block AI Crawlers",
    description: "Block GPTBot, Google-Extended, CCBot, and other AI scrapers",
    rules: [
      { userAgent: "GPTBot", action: "disallow", path: "/" },
      { userAgent: "ChatGPT-User", action: "disallow", path: "/" },
      { userAgent: "Google-Extended", action: "disallow", path: "/" },
      { userAgent: "CCBot", action: "disallow", path: "/" },
      { userAgent: "anthropic-ai", action: "disallow", path: "/" },
      { userAgent: "ClaudeBot", action: "disallow", path: "/" },
      { userAgent: "PerplexityBot", action: "disallow", path: "/" },
      { userAgent: "Bytespider", action: "disallow", path: "/" },
      { userAgent: "Applebot-Extended", action: "disallow", path: "/" },
      { userAgent: "*", action: "allow", path: "/" },
    ],
    sitemapPath: "/sitemap.xml",
    crawlDelay: "",
  },
  restrictive: {
    name: "Restrictive",
    description: "Block everything except the homepage and key pages",
    rules: [
      { userAgent: "*", action: "disallow", path: "/" },
      { userAgent: "Googlebot", action: "allow", path: "/" },
      { userAgent: "Bingbot", action: "allow", path: "/" },
    ],
    sitemapPath: "/sitemap.xml",
    crawlDelay: "10",
  },
};

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

let idCounter = 0;
function generateId() {
  return `rule-${++idCounter}`;
}

function generateRobotsTxt(
  rules: RobotsRule[],
  siteUrl: string,
  sitemapPath: string,
  crawlDelay: string
): string {
  if (rules.length === 0) {
    return "# No rules configured\nUser-agent: *\nAllow: /";
  }

  // Group rules by user-agent
  const groups = new Map<string, RobotsRule[]>();
  for (const rule of rules) {
    const ua = rule.userAgent || "*";
    if (!groups.has(ua)) groups.set(ua, []);
    groups.get(ua)!.push(rule);
  }

  const lines: string[] = [
    "# robots.txt generated by SerpNap Robots.txt Generator",
    `# Generated at serpnap.com/tools/robots-txt-generator`,
    "",
  ];

  for (const [ua, groupRules] of groups) {
    lines.push(`User-agent: ${ua}`);

    // Sort: Disallow before Allow for clarity
    const sorted = [...groupRules].sort((a, b) => {
      if (a.action === "disallow" && b.action === "allow") return -1;
      if (a.action === "allow" && b.action === "disallow") return 1;
      return 0;
    });

    for (const rule of sorted) {
      const directive = rule.action === "allow" ? "Allow" : "Disallow";
      lines.push(`${directive}: ${rule.path}`);
    }

    if (crawlDelay && ua === "*") {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }

    lines.push("");
  }

  // Sitemap
  if (sitemapPath) {
    const base = siteUrl.replace(/\/$/, "");
    const path = sitemapPath.startsWith("/") ? sitemapPath : `/${sitemapPath}`;
    lines.push(`Sitemap: ${base}${path}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function validateRules(rules: RobotsRule[]): string[] {
  const warnings: string[] = [];

  const hasWildcard = rules.some((r) => r.userAgent === "*");
  if (!hasWildcard) {
    warnings.push(
      "No wildcard (*) user-agent found. Crawlers not specifically named will have no rules."
    );
  }

  const disallowAll = rules.some(
    (r) => r.userAgent === "*" && r.action === "disallow" && r.path === "/"
  );
  if (disallowAll) {
    warnings.push(
      "You are blocking ALL crawlers from your entire site. This will remove your site from search engines."
    );
  }

  for (const rule of rules) {
    if (rule.path && !rule.path.startsWith("/") && !rule.path.startsWith("*")) {
      warnings.push(
        `Path "${rule.path}" should start with / — robots.txt paths are relative to the root.`
      );
    }
  }

  return warnings;
}

// ────────────────────────────────────────────────────────────────
// Common user agents for autocomplete
// ────────────────────────────────────────────────────────────────

const commonUserAgents = [
  "*",
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Bingbot",
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "PerplexityBot",
  "Bytespider",
  "Applebot",
  "Applebot-Extended",
  "Slurp",
  "DuckDuckBot",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "Yandex",
];

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function RobotsTxtGeneratorPage() {
  const [rules, setRules] = useState<RobotsRule[]>(() =>
    presets.standard.rules.map((r) => ({ ...r, id: generateId() }))
  );
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [sitemapPath, setSitemapPath] = useState("/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("standard");

  const output = generateRobotsTxt(rules, siteUrl, sitemapPath, crawlDelay);

  const warnings = validateRules(rules);

  function addRule() {
    setRules((prev) => [
      ...prev,
      { id: generateId(), userAgent: "*", action: "disallow", path: "/" },
    ]);
    setActivePreset("");
  }

  function removeRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
    setActivePreset("");
  }

  function updateRule(id: string, field: keyof RobotsRule, value: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    setActivePreset("");
  }

  function applyPreset(key: string) {
    const preset = presets[key];
    if (!preset) return;
    setRules(preset.rules.map((r) => ({ ...r, id: generateId() })));
    setSitemapPath(preset.sitemapPath);
    setCrawlDelay(preset.crawlDelay);
    setActivePreset(key);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
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
            <Shield className="w-4 h-4" />
            Crawl Control
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Robots.txt{" "}
            <span className="text-primary italic">Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Generate a valid robots.txt file in seconds. Choose a preset or
            build custom rules for any platform.
          </p>
        </div>
      </section>

      {/* Main Interface */}
      <section className="pb-16 container-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left: Config Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-4">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(presets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all border",
                      activePreset === key
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-foreground hover:border-primary/20"
                    )}
                  >
                    <span className="block font-semibold">{preset.name}</span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Site URL + Sitemap */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  className="w-full h-12 bg-white dark:bg-zinc-800 border-none rounded-xl px-4 font-medium text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="https://example.com"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                    Sitemap Path
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 bg-white dark:bg-zinc-800 border-none rounded-xl px-4 font-medium text-sm focus:ring-2 focus:ring-primary outline-none"
                    placeholder="/sitemap.xml"
                    value={sitemapPath}
                    onChange={(e) => setSitemapPath(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                    Crawl Delay (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    className="w-full h-12 bg-white dark:bg-zinc-800 border-none rounded-xl px-4 font-medium text-sm focus:ring-2 focus:ring-primary outline-none"
                    placeholder="None"
                    value={crawlDelay}
                    onChange={(e) => setCrawlDelay(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Rules ({rules.length})
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      applyPreset("standard");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                  <button
                    onClick={addRule}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Rule
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {rules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-700/50"
                    >
                      {/* User-agent */}
                      <select
                        value={rule.userAgent}
                        onChange={(e) =>
                          updateRule(rule.id, "userAgent", e.target.value)
                        }
                        className="h-9 bg-zinc-50 dark:bg-zinc-900 rounded-lg px-2 text-xs font-medium border-none focus:ring-2 focus:ring-primary outline-none min-w-[120px]"
                      >
                        {commonUserAgents.map((ua) => (
                          <option key={ua} value={ua}>
                            {ua}
                          </option>
                        ))}
                      </select>

                      {/* Action */}
                      <select
                        value={rule.action}
                        onChange={(e) =>
                          updateRule(
                            rule.id,
                            "action",
                            e.target.value as "allow" | "disallow"
                          )
                        }
                        className={cn(
                          "h-9 rounded-lg px-2 text-xs font-bold border-none focus:ring-2 focus:ring-primary outline-none min-w-[90px]",
                          rule.action === "disallow"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        <option value="disallow">Disallow</option>
                        <option value="allow">Allow</option>
                      </select>

                      {/* Path */}
                      <input
                        type="text"
                        value={rule.path}
                        onChange={(e) =>
                          updateRule(rule.id, "path", e.target.value)
                        }
                        className="flex-1 h-9 bg-zinc-50 dark:bg-zinc-900 rounded-lg px-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none border-none min-w-0"
                        placeholder="/path/"
                      />

                      {/* Delete */}
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="Remove rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
                {warnings.map((warning, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-amber-700 dark:text-amber-300">
                      {warning}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Preview + Output */}
          <div className="relative">
            <div className="sticky top-32 space-y-4">
              <div className="bg-zinc-950 dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 dark:border-zinc-700/50 overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      robots.txt
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {output.split("\n").length} lines
                  </span>
                </div>

                <pre className="text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {output}
                </pre>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCopy}
                  className="h-14 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="h-14 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Info box */}
              <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    Upload this file to the root of your website (e.g.,{" "}
                    <code className="bg-foreground/5 px-1 py-0.5 rounded font-mono text-foreground">
                      https://example.com/robots.txt
                    </code>
                    ).
                  </p>
                  <p>
                    Google typically picks up changes within 24-48 hours. You can
                    also submit it via{" "}
                    <span className="text-foreground font-medium">
                      Google Search Console &rarr; Settings &rarr; robots.txt
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            What is a robots.txt file?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Purpose
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A robots.txt file tells search engine crawlers which pages or
                files they can or can&apos;t request from your site. It&apos;s
                not a security mechanism — it&apos;s a crawl management tool
                that helps bots use your crawl budget efficiently.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Where to place it
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Always place robots.txt at the root of your domain:{" "}
                <code className="bg-foreground/5 px-1 py-0.5 rounded font-mono text-[13px]">
                  https://example.com/robots.txt
                </code>
                . Subdomain robots.txt files only apply to that subdomain.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Common mistakes
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Don&apos;t use robots.txt to hide sensitive pages — crawlers may
                still index the URL from external links. Use{" "}
                <code className="bg-foreground/5 px-1 py-0.5 rounded font-mono text-[13px]">
                  noindex
                </code>{" "}
                meta tags or HTTP headers instead. Also avoid blocking CSS/JS
                files that Google needs for rendering.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                AI crawlers in 2026
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                New AI bots like GPTBot, Google-Extended, and ClaudeBot respect
                robots.txt directives. Use the &quot;Block AI Crawlers&quot;
                preset above if you want to prevent your content from being used
                for AI training while still allowing search indexing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ToolsNav />
      <CTASection />
    </main>
  );
}
