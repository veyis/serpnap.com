/**
 * Tool: Page Speed Estimator
 * Path: /tools/page-speed-estimator
 * Estimate website loading speed based on page characteristics.
 */
"use client";

import { useState } from "react";
import {
  Gauge,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Code2,
  Globe,
  Server,
  Type,
  Video,
  Layout,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Clock,
  HardDrive,
  TrendingUp,
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

interface EstimationInput {
  framework: string;
  imageCount: number;
  imageSize: string;
  jsBundle: string;
  thirdPartyScripts: number;
  hosting: string;
  fonts: string;
  hasVideo: boolean;
  pageType: string;
}

interface WeightBreakdown {
  html: number;
  css: number;
  js: number;
  images: number;
  fonts: number;
  thirdParty: number;
  video: number;
}

interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface EstimationResult {
  score: number;
  lcp: number;
  fcp: number;
  tbt: number;
  cls: number;
  totalWeight: number;
  weightBreakdown: WeightBreakdown;
  recommendations: Recommendation[];
}

// ────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  { value: "nextjs", label: "Next.js" },
  { value: "wordpress", label: "WordPress" },
  { value: "shopify", label: "Shopify" },
  { value: "squarespace", label: "Squarespace" },
  { value: "html", label: "Custom HTML" },
  { value: "react-spa", label: "React SPA" },
];

const IMAGE_SIZES = [
  { value: "small", label: "Small (<50KB)" },
  { value: "medium", label: "Medium (50-200KB)" },
  { value: "large", label: "Large (200KB+)" },
  { value: "unoptimized", label: "Unoptimized (500KB+)" },
];

const JS_BUNDLES = [
  { value: "minimal", label: "Minimal (<100KB)" },
  { value: "medium", label: "Medium (100-500KB)" },
  { value: "heavy", label: "Heavy (500KB+)" },
  { value: "bloated", label: "Bloated (1MB+)" },
];

const HOSTING_OPTIONS = [
  { value: "budget-shared", label: "Budget Shared" },
  { value: "premium-shared", label: "Premium Shared" },
  { value: "vps", label: "VPS" },
  { value: "cdn-backed", label: "CDN-backed (Vercel/Netlify/Cloudflare)" },
  { value: "dedicated", label: "Dedicated" },
];

const FONT_OPTIONS = [
  { value: "system", label: "System fonts" },
  { value: "few", label: "1-2 web fonts" },
  { value: "many", label: "3+ web fonts" },
];

const PAGE_TYPES = [
  { value: "landing", label: "Landing Page" },
  { value: "blog", label: "Blog Post" },
  { value: "ecommerce", label: "E-commerce Product" },
  { value: "dashboard", label: "Dashboard" },
  { value: "portfolio", label: "Portfolio" },
];

const INDUSTRY_AVERAGES = {
  lcp: 2.5,
  fcp: 1.8,
  tbt: 200,
  cls: 0.1,
  score: 60,
};

// ────────────────────────────────────────────────────────────────
// Estimation engine
// ────────────────────────────────────────────────────────────────

function estimateSpeed(input: EstimationInput): EstimationResult {
  const recommendations: Recommendation[] = [];

  // --- Weight calculation (KB) ---
  const htmlWeight = 25;
  let cssWeight = 30;
  let jsWeight = 0;
  let imageWeight = 0;
  let fontWeight = 0;
  let thirdPartyWeight = 0;
  let videoWeight = 0;

  // Framework baseline adjustments
  const frameworkFactors: Record<string, { css: number; js: number; serverRender: boolean; ttfbMs: number }> = {
    nextjs: { css: 1.0, js: 0.8, serverRender: true, ttfbMs: 80 },
    wordpress: { css: 1.4, js: 1.3, serverRender: true, ttfbMs: 400 },
    shopify: { css: 1.2, js: 1.2, serverRender: true, ttfbMs: 200 },
    squarespace: { css: 1.3, js: 1.4, serverRender: true, ttfbMs: 250 },
    html: { css: 0.8, js: 0.5, serverRender: true, ttfbMs: 100 },
    "react-spa": { css: 1.0, js: 1.5, serverRender: false, ttfbMs: 60 },
  };

  const fw = frameworkFactors[input.framework] || frameworkFactors.html;
  cssWeight *= fw.css;

  // JS bundle
  const jsSizeMap: Record<string, number> = { minimal: 80, medium: 300, heavy: 650, bloated: 1200 };
  jsWeight = (jsSizeMap[input.jsBundle] || 300) * fw.js;

  if (input.jsBundle === "bloated") {
    recommendations.push({
      title: "Reduce JavaScript bundle size",
      description: "Your JS bundle is over 1MB. Use code splitting, tree shaking, and dynamic imports to reduce initial load by up to 60%.",
      impact: "high",
    });
  } else if (input.jsBundle === "heavy") {
    recommendations.push({
      title: "Optimize JavaScript delivery",
      description: "Consider lazy loading non-critical scripts and using dynamic imports for route-based code splitting.",
      impact: "medium",
    });
  }

  // Images
  const imgSizeMap: Record<string, number> = { small: 35, medium: 120, large: 300, unoptimized: 550 };
  const avgImgSize = imgSizeMap[input.imageSize] || 120;
  imageWeight = input.imageCount * avgImgSize;

  if (input.imageSize === "unoptimized" && input.imageCount > 5) {
    recommendations.push({
      title: "Compress images with WebP format",
      description: `Converting ${input.imageCount} unoptimized images to WebP could save ~60% bandwidth (${Math.round(imageWeight * 0.6)}KB reduction).`,
      impact: "high",
    });
  } else if (input.imageSize === "large") {
    recommendations.push({
      title: "Optimize image delivery",
      description: "Use modern formats (WebP/AVIF), responsive srcset, and lazy loading for below-fold images to improve LCP.",
      impact: "medium",
    });
  }

  if (input.imageCount > 20) {
    recommendations.push({
      title: "Implement lazy loading for images",
      description: `With ${input.imageCount} images, lazy loading below-the-fold images can reduce initial page weight by ~${Math.round((input.imageCount - 3) * avgImgSize * 0.7)}KB.`,
      impact: "high",
    });
  }

  // Third-party scripts
  thirdPartyWeight = input.thirdPartyScripts * 45;
  if (input.thirdPartyScripts > 5) {
    recommendations.push({
      title: `Reduce third-party scripts from ${input.thirdPartyScripts} to 3`,
      description: `Each third-party script adds ~45KB and ~${Math.round(input.thirdPartyScripts * 25)}ms TBT. Removing ${input.thirdPartyScripts - 3} scripts could save ~${(input.thirdPartyScripts - 3) * 25}ms of blocking time.`,
      impact: "high",
    });
  } else if (input.thirdPartyScripts > 3) {
    recommendations.push({
      title: "Defer non-critical third-party scripts",
      description: "Load analytics and chat widgets after the main content renders to improve FCP and TBT.",
      impact: "medium",
    });
  }

  // Fonts
  const fontWeightMap: Record<string, number> = { system: 0, few: 50, many: 150 };
  fontWeight = fontWeightMap[input.fonts] || 0;
  if (input.fonts === "many") {
    recommendations.push({
      title: "Reduce web font usage",
      description: "3+ web fonts add ~150KB. Consider using system font stacks or limiting to 1-2 variable fonts with font-display: swap.",
      impact: "medium",
    });
  }

  // Video
  if (input.hasVideo) {
    videoWeight = 500;
    recommendations.push({
      title: "Lazy load video content",
      description: "Use a poster image and load the video player only when the user clicks play, or use Intersection Observer for autoplay videos.",
      impact: "medium",
    });
  }

  // Hosting
  const hostingTtfb: Record<string, number> = {
    "budget-shared": 800,
    "premium-shared": 400,
    vps: 250,
    "cdn-backed": 60,
    dedicated: 150,
  };

  const hostingTtfbMs = hostingTtfb[input.hosting] || 400;

  if (input.hosting === "budget-shared") {
    recommendations.push({
      title: "Upgrade hosting for faster TTFB",
      description: "Budget shared hosting typically has 600-1000ms TTFB. Switching to a CDN-backed platform like Vercel or Cloudflare Pages can reduce this to under 100ms.",
      impact: "high",
    });
  }

  // Framework-specific recommendations
  if (input.framework === "wordpress" && input.jsBundle !== "minimal") {
    recommendations.push({
      title: "Optimize WordPress performance",
      description: "Use a caching plugin (WP Rocket, W3 Total Cache), minimize plugins, and consider a static site generator for content-heavy pages.",
      impact: "medium",
    });
  }

  if (input.framework === "react-spa") {
    recommendations.push({
      title: "Switch to Next.js with Vercel for ~40% faster LCP",
      description: "React SPAs send an empty HTML shell, delaying FCP until JS loads. Next.js with SSR/SSG renders HTML on the server, cutting LCP significantly.",
      impact: "high",
    });
  }

  // --- Timing calculations ---
  const totalWeight = htmlWeight + cssWeight + jsWeight + imageWeight + fontWeight + thirdPartyWeight + videoWeight;

  // Base TTFB from hosting
  const ttfb = hostingTtfbMs + fw.ttfbMs;

  // FCP: TTFB + CSS parse + font load + render
  const cssParseMsEstimate = cssWeight * 0.3;
  const fontDelayMs = input.fonts === "system" ? 0 : input.fonts === "few" ? 100 : 250;
  let fcp = (ttfb + cssParseMsEstimate + fontDelayMs + 200) / 1000;

  // If SPA, FCP has to wait for JS
  if (!fw.serverRender) {
    fcp += jsWeight * 0.5 / 1000;
  }

  // LCP: FCP + largest image load time or hero render
  const largestImageMs = input.imageCount > 0 ? avgImgSize * 1.5 : 0;
  const videoDelayMs = input.hasVideo ? 600 : 0;
  let lcp = fcp + Math.max(largestImageMs, videoDelayMs) / 1000;

  // TBT: JS parse + third-party blocking
  const jsParseMs = jsWeight * 0.4;
  const thirdPartyBlockMs = input.thirdPartyScripts * 25;
  const tbt = jsParseMs + thirdPartyBlockMs;

  // CLS estimate
  let cls = 0.02;
  if (input.fonts !== "system") cls += 0.03;
  if (input.hasVideo) cls += 0.05;
  if (input.imageCount > 0 && input.imageSize === "unoptimized") cls += 0.04;
  if (!fw.serverRender) cls += 0.03;

  // Page type adjustments
  const pageTypeFactors: Record<string, { lcpMult: number; tbtMult: number }> = {
    landing: { lcpMult: 1.0, tbtMult: 0.9 },
    blog: { lcpMult: 0.9, tbtMult: 0.8 },
    ecommerce: { lcpMult: 1.15, tbtMult: 1.2 },
    dashboard: { lcpMult: 1.1, tbtMult: 1.4 },
    portfolio: { lcpMult: 1.2, tbtMult: 0.9 },
  };

  const ptf = pageTypeFactors[input.pageType] || pageTypeFactors.landing;
  lcp *= ptf.lcpMult;
  const adjustedTbt = tbt * ptf.tbtMult;

  // Clamp values
  fcp = Math.max(0.3, Math.min(8.0, fcp));
  lcp = Math.max(0.5, Math.min(12.0, lcp));
  const clampedTbt = Math.max(0, Math.min(3000, adjustedTbt));
  cls = Math.max(0, Math.min(0.5, cls));

  // --- Score calculation (Lighthouse-like) ---
  // LCP scoring: 0-2.5s = good, 2.5-4s = needs improvement, 4s+ = poor
  const lcpScore = lcp <= 2.5 ? 100 - (lcp / 2.5) * 10 : lcp <= 4.0 ? 75 - ((lcp - 2.5) / 1.5) * 25 : Math.max(0, 50 - ((lcp - 4.0) / 4.0) * 50);

  // FCP scoring: 0-1.8s = good, 1.8-3s = needs improvement, 3s+ = poor
  const fcpScore = fcp <= 1.8 ? 100 - (fcp / 1.8) * 10 : fcp <= 3.0 ? 75 - ((fcp - 1.8) / 1.2) * 25 : Math.max(0, 50 - ((fcp - 3.0) / 3.0) * 50);

  // TBT scoring: 0-200ms = good, 200-600ms = needs improvement, 600ms+ = poor
  const tbtScore = clampedTbt <= 200 ? 100 - (clampedTbt / 200) * 10 : clampedTbt <= 600 ? 75 - ((clampedTbt - 200) / 400) * 25 : Math.max(0, 50 - ((clampedTbt - 600) / 1400) * 50);

  // CLS scoring: 0-0.1 = good, 0.1-0.25 = needs improvement, 0.25+ = poor
  const clsScore = cls <= 0.1 ? 100 - (cls / 0.1) * 10 : cls <= 0.25 ? 75 - ((cls - 0.1) / 0.15) * 25 : Math.max(0, 50 - ((cls - 0.25) / 0.25) * 50);

  // Weighted average (Lighthouse v10 weights)
  const score = Math.round(lcpScore * 0.25 + fcpScore * 0.10 + tbtScore * 0.30 + clsScore * 0.25 + (100 - Math.min(100, totalWeight / 50)) * 0.10);

  return {
    score: Math.max(0, Math.min(100, score)),
    lcp: Math.round(lcp * 10) / 10,
    fcp: Math.round(fcp * 10) / 10,
    tbt: Math.round(clampedTbt),
    cls: Math.round(cls * 100) / 100,
    totalWeight: Math.round(totalWeight),
    weightBreakdown: {
      html: Math.round(htmlWeight),
      css: Math.round(cssWeight),
      js: Math.round(jsWeight),
      images: Math.round(imageWeight),
      fonts: Math.round(fontWeight),
      thirdParty: Math.round(thirdPartyWeight),
      video: Math.round(videoWeight),
    },
    recommendations: recommendations.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.impact] - order[b.impact];
    }),
  };
}

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 90) return "stroke-emerald-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Fast";
  if (score >= 50) return "Moderate";
  return "Slow";
}

function getMetricColor(metric: string, value: number) {
  const thresholds: Record<string, [number, number]> = {
    lcp: [2.5, 4.0],
    fcp: [1.8, 3.0],
    tbt: [200, 600],
    cls: [0.1, 0.25],
  };
  const [good, moderate] = thresholds[metric] || [0, 0];
  if (value <= good) return "text-emerald-500";
  if (value <= moderate) return "text-amber-500";
  return "text-red-500";
}

function getImpactBadge(impact: "high" | "medium" | "low") {
  if (impact === "high") return "bg-red-500/10 text-red-400 border-red-500/20";
  if (impact === "medium") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-blue-500/10 text-blue-400 border-blue-500/20";
}

function formatWeight(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

// ────────────────────────────────────────────────────────────────
// Score Circle Component
// ────────────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-zinc-800"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={getScoreBg(score)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("text-4xl font-black", getScoreColor(score))}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function PageSpeedEstimatorPage() {
  const [input, setInput] = useState<EstimationInput>({
    framework: "wordpress",
    imageCount: 10,
    imageSize: "medium",
    jsBundle: "medium",
    thirdPartyScripts: 4,
    hosting: "premium-shared",
    fonts: "few",
    hasVideo: false,
    pageType: "landing",
  });
  const [result, setResult] = useState<EstimationResult | null>(null);

  function handleEstimate() {
    setResult(estimateSpeed(input));
  }

  const updateInput = <K extends keyof EstimationInput>(key: K, value: EstimationInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  };

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
            Performance Tool
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Page Speed{" "}
            <span className="text-primary italic">Estimator</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Estimate your website&apos;s loading speed based on technology stack,
            assets, and hosting. Get a Lighthouse-style performance score with
            specific optimization tips.
          </p>
        </div>
      </section>

      {/* Input Form */}
      <section className="container-padding pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Framework */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                Framework / CMS
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FRAMEWORKS.map((fw) => (
                  <button
                    key={fw.value}
                    onClick={() => updateInput("framework", fw.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      input.framework === fw.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {fw.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Count Slider */}
            <div>
              <label className="flex items-center justify-between text-sm font-bold text-foreground mb-3">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  Number of Images
                </span>
                <span className="text-primary tabular-nums">{input.imageCount}</span>
              </label>
              <input
                type="range"
                min={0}
                max={50}
                value={input.imageCount}
                onChange={(e) => updateInput("imageCount", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Image Size */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                Average Image Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_SIZES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateInput("imageSize", opt.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      input.imageSize === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* JS Bundles */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <Zap className="w-4 h-4 text-muted-foreground" />
                JavaScript Bundle Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {JS_BUNDLES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateInput("jsBundle", opt.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      input.jsBundle === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Third-party Scripts Slider */}
            <div>
              <label className="flex items-center justify-between text-sm font-bold text-foreground mb-3">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Third-party Scripts
                </span>
                <span className="text-primary tabular-nums">{input.thirdPartyScripts}</span>
              </label>
              <input
                type="range"
                min={0}
                max={20}
                value={input.thirdPartyScripts}
                onChange={(e) => updateInput("thirdPartyScripts", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span>
                <span>10</span>
                <span>20</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Analytics, chat widgets, ad scripts, social embeds</p>
            </div>

            {/* Hosting */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <Server className="w-4 h-4 text-muted-foreground" />
                Hosting
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HOSTING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateInput("hosting", opt.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border text-left",
                      input.hosting === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <Type className="w-4 h-4 text-muted-foreground" />
                Web Fonts
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FONT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateInput("fonts", opt.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      input.fonts === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Has Video */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <Video className="w-4 h-4 text-muted-foreground" />
                Has Video
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[false, true].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => updateInput("hasVideo", val)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      input.hasVideo === val
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <Layout className="w-4 h-4 text-muted-foreground" />
                Page Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PAGE_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateInput("pageType", opt.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      input.pageType === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white dark:bg-zinc-800 text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate Button */}
            <Button
              onClick={handleEstimate}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-wide"
            >
              <Gauge className="w-5 h-5 mr-2" />
              Estimate Page Speed
            </Button>
          </div>
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
              {/* Score + Core Web Vitals */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Score Circle */}
                  <div className="flex flex-col items-center gap-2">
                    <ScoreCircle score={result.score} />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Performance Score
                    </span>
                  </div>

                  {/* Core Web Vitals */}
                  <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">LCP</span>
                      </div>
                      <span className={cn("text-2xl font-black", getMetricColor("lcp", result.lcp))}>
                        {result.lcp}s
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Largest Contentful Paint</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">FCP</span>
                      </div>
                      <span className={cn("text-2xl font-black", getMetricColor("fcp", result.fcp))}>
                        {result.fcp}s
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">First Contentful Paint</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TBT</span>
                      </div>
                      <span className={cn("text-2xl font-black", getMetricColor("tbt", result.tbt))}>
                        {result.tbt}ms
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Total Blocking Time</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Layout className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CLS</span>
                      </div>
                      <span className={cn("text-2xl font-black", getMetricColor("cls", result.cls))}>
                        {result.cls}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Cumulative Layout Shift</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Weight Breakdown */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Page Weight Breakdown
                  <span className="ml-auto text-xs font-semibold text-muted-foreground">
                    Total: {formatWeight(result.totalWeight)}
                  </span>
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "HTML", value: result.weightBreakdown.html, color: "bg-blue-500" },
                    { label: "CSS", value: result.weightBreakdown.css, color: "bg-purple-500" },
                    { label: "JavaScript", value: result.weightBreakdown.js, color: "bg-amber-500" },
                    { label: "Images", value: result.weightBreakdown.images, color: "bg-emerald-500" },
                    { label: "Fonts", value: result.weightBreakdown.fonts, color: "bg-pink-500" },
                    { label: "Third-party", value: result.weightBreakdown.thirdParty, color: "bg-red-500" },
                    { label: "Video", value: result.weightBreakdown.video, color: "bg-cyan-500" },
                  ]
                    .filter((item) => item.value > 0)
                    .map((item) => {
                      const pct = Math.max(1, (item.value / result.totalWeight) * 100);
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-foreground">{item.label}</span>
                            <span className="text-muted-foreground tabular-nums">{formatWeight(item.value)}</span>
                          </div>
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              className={cn("h-full rounded-full", item.color)}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Industry Comparison */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Your Estimated Speed vs Industry Average
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Score", yours: result.score, avg: INDUSTRY_AVERAGES.score, unit: "", lower: false },
                    { label: "LCP", yours: result.lcp, avg: INDUSTRY_AVERAGES.lcp, unit: "s", lower: true },
                    { label: "FCP", yours: result.fcp, avg: INDUSTRY_AVERAGES.fcp, unit: "s", lower: true },
                    { label: "TBT", yours: result.tbt, avg: INDUSTRY_AVERAGES.tbt, unit: "ms", lower: true },
                  ].map((metric) => {
                    const isBetter = metric.lower
                      ? metric.yours <= metric.avg
                      : metric.yours >= metric.avg;
                    return (
                      <div key={metric.label} className="p-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                          {metric.label}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={cn("text-sm font-black", isBetter ? "text-emerald-500" : "text-red-500")}>
                              {metric.yours}{metric.unit}
                            </span>
                            {isBetter ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Avg: {metric.avg}{metric.unit}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                  <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    What&apos;s Slowing You Down
                  </h2>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50"
                      >
                        <div className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-foreground">{rec.title}</span>
                              <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border", getImpactBadge(rec.impact))}>
                                {rec.impact}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
            Understanding Core Web Vitals
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-foreground">
                  Largest Contentful Paint (LCP)
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Measures loading performance. LCP should occur within 2.5 seconds
                of when the page first starts loading. It tracks when the largest
                image or text block becomes visible in the viewport.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">
                  First Contentful Paint (FCP)
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Measures the time from navigation to when the browser renders the
                first piece of DOM content. A fast FCP (under 1.8s) reassures users
                that something is happening and the page is loading.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-foreground">
                  Total Blocking Time (TBT)
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Measures the total time between FCP and Time to Interactive where
                the main thread was blocked long enough to prevent input
                responsiveness. Keep TBT under 200ms for a responsive experience.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Layout className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">
                  Cumulative Layout Shift (CLS)
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Measures visual stability. CLS should be kept under 0.1. It
                quantifies how much visible content shifts unexpectedly during
                the page&apos;s lifetime, caused by images without dimensions,
                late-loading fonts, or dynamic content.
              </p>
            </div>
          </div>

          {/* Pro tip */}
          <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Pro tip:</span>{" "}
              These estimates are based on typical configurations. For accurate
              measurements, run a real Lighthouse audit in Chrome DevTools or use
              our{" "}
              <a href="/tools/seo-checker" className="text-primary hover:underline font-semibold">
                SEO Checker
              </a>{" "}
              which includes a full performance analysis of your live website.
            </div>
          </div>
        </div>
      </section>

      <RelatedResources
        tools={[
          { href: "/tools/technical-audit", label: "Technical Audit", description: "Deep technical analysis including server headers and crawlability." },
          { href: "/tools/seo-checker", label: "SEO Checker", description: "Full 50+ check audit including performance scoring." },
          { href: "/tools/redirect-checker", label: "Redirect Checker", description: "Trace redirect chains that slow down page loading." },
        ]}
        articles={[
          { href: "/blog/seo/how-to-improve-core-web-vitals", title: "How to Improve Core Web Vitals" },
          { href: "/blog/seo/technical-seo-playbook-2026", title: "Technical SEO Playbook for 2026" },
        ]}
        glossaryTerms={[
          { href: "/glossary/what-is-core-web-vitals", term: "Core Web Vitals" },
          { href: "/glossary/what-is-lcp", term: "LCP" },
          { href: "/glossary/what-is-cls", term: "CLS" },
          { href: "/glossary/what-is-inp", term: "INP" },
          { href: "/glossary/what-is-technical-seo", term: "Technical SEO" },
        ]}
      />
      <ToolsNav />
      <CTASection />
    </main>
  );
}
