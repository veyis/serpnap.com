"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Globe2, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NeuralAuditTool() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "complete">("idle");
  const [currentTask, setCurrentTask] = useState("");
  const [results, setResults] = useState<{ label: string; score: number; status: string }[]>([]);

  const runAudit = async () => {
    if (!url) return;
    setStatus("scanning");
    
    const tasks = [
      "Querying Gemini Knowledge Graph...",
      "Simulating Claude RAG citation nodes...",
      "Analyzing GPT-4o Perplexity index...",
      "Verifying E-E-A-T entity signals...",
      "Parsing GEO Information Gain scores..."
    ];

    for (let i = 0; i < tasks.length; i++) {
      setCurrentTask(tasks[i]);
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    }

    setResults([
      { label: "AI Search Share", score: 14, status: "Critical" },
      { label: "Entity Resolution", score: 42, status: "Weak" },
      { label: "Citation Index", score: 8, status: "Poor" },
      { label: "Topic Authority", score: 29, status: "Moderate" }
    ]);
    setStatus("complete");
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Outer glass card */}
      <div className="relative p-8 sm:p-12 rounded-3xl sm:rounded-[40px] overflow-hidden
        bg-white/80 dark:bg-white/[0.04]
        border border-black/[0.06] dark:border-white/[0.08]
        shadow-xl shadow-black/[0.03] dark:shadow-black/40
        backdrop-blur-2xl
      ">
        
        {/* Ambient gradient orbs — teal tones */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-teal-500/[0.06] dark:bg-teal-500/[0.05] blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-cyan-500/[0.04] dark:bg-cyan-400/[0.03] blur-[60px] pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6
                bg-teal-50 dark:bg-teal-500/[0.08]
                border border-teal-200/60 dark:border-teal-500/15
                text-teal-600 dark:text-teal-400
                text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              <Sparkles className="w-3 h-3" /> 2026 Engine Diagnosis
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4"
            >
              Neural Search Audit
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto leading-relaxed"
            >
              Analyze your brand&apos;s visibility within AI search models. Our diagnostic tool simulates Gemini, OpenAI, and Anthropic citation behaviors to reveal your &quot;Share of Model.&quot;
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {/* ─── IDLE STATE ─── */}
            {status === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Input */}
                <div className="relative max-w-xl mx-auto group/input">
                  <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within/input:text-teal-500 dark:group-focus-within/input:text-teal-400">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <input 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter Domain (e.g. company.com)"
                    className="w-full h-16 sm:h-[4.5rem] pl-14 sm:pl-16 pr-6 rounded-2xl
                      bg-gray-50 dark:bg-white/[0.04]
                      border border-gray-200 dark:border-white/[0.08]
                      text-base sm:text-lg font-medium
                      text-gray-900 dark:text-white
                      placeholder:text-gray-400 dark:placeholder:text-gray-600
                      focus:bg-white dark:focus:bg-white/[0.06]
                      focus:border-teal-300 dark:focus:border-teal-500/30
                      focus:ring-4 focus:ring-teal-500/[0.08] dark:focus:ring-teal-500/[0.06]
                      transition-all duration-300 outline-hidden"
                  />
                </div>

                {/* CTA Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={runAudit}
                    disabled={!url}
                    size="lg" 
                    className="h-14 sm:h-16 px-10 sm:px-12 rounded-2xl
                      bg-gradient-to-b from-teal-500 to-teal-600 
                      dark:from-teal-500 dark:to-teal-600
                      hover:from-teal-400 hover:to-teal-500
                      dark:hover:from-teal-400 dark:hover:to-teal-500
                      text-white font-semibold text-sm tracking-wide
                      shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30
                      dark:shadow-teal-500/20 dark:hover:shadow-teal-500/30
                      active:scale-[0.98]
                      transition-all duration-200
                      disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none"
                  >
                    Initiate Audit <ArrowRight className="ml-3 w-4 h-4" />
                  </Button>
                </div>

                <p className="text-center text-[10px] text-gray-400/60 dark:text-gray-600 font-medium uppercase tracking-[0.15em]">
                  Data processed via SerpNap NeuroConnect Layer
                </p>
              </motion.div>
            )}

            {/* ─── SCANNING STATE ─── */}
            {status === "scanning" && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center space-y-10"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-teal-200 dark:border-teal-500/20 border-t-teal-500 dark:border-t-teal-400"
                  />
                  {/* Inner glow */}
                  <div className="absolute inset-4 rounded-full bg-teal-500/[0.04] dark:bg-teal-400/[0.06]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 dark:text-teal-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2.5">
                  <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white animate-pulse tracking-tight">{currentTask}</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Scanning Entity Map for {url}</p>
                </div>
              </motion.div>
            )}

            {/* ─── COMPLETE STATE ─── */}
            {status === "complete" && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
                className="space-y-8 sm:space-y-10"
              >
                {/* Score Cards — neutral cards with teal-tinted score numbers */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {results.map((res, i) => (
                    <motion.div 
                      key={res.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className={cn(
                        "group/card p-5 sm:p-6 rounded-2xl text-center space-y-2.5 relative overflow-hidden cursor-default",
                        "border transition-all duration-300",
                        "hover:-translate-y-0.5 hover:shadow-md",
                        // Subtle neutral card with teal border on hover
                        "bg-gray-50/80 dark:bg-white/[0.03]",
                        "border-gray-200/50 dark:border-white/[0.06]",
                        "hover:border-teal-300/50 dark:hover:border-teal-500/20"
                      )}
                    >
                      <div className="absolute top-3 right-3">
                        <AlertCircle className={cn(
                          "w-3.5 h-3.5 opacity-40 group-hover/card:opacity-70 transition-opacity text-gray-400 dark:text-gray-500"
                        )} />
                      </div>
                      <div className={cn(
                        "text-3xl sm:text-4xl font-semibold tracking-tight",
                        // All scores use teal — single accent color
                        "text-teal-600 dark:text-teal-400"
                      )}>
                        {res.score}%
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{res.label}</div>
                      <div className={cn(
                        "text-[9px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full inline-block",
                        res.status === "Critical" && "bg-red-50 dark:bg-red-500/8 text-red-600 dark:text-red-400",
                        res.status === "Weak" && "bg-amber-50 dark:bg-amber-500/8 text-amber-600 dark:text-amber-400",
                        res.status === "Moderate" && "bg-teal-50 dark:bg-teal-500/8 text-teal-600 dark:text-teal-400",
                        res.status === "Poor" && "bg-orange-50 dark:bg-orange-500/8 text-orange-600 dark:text-orange-400"
                      )}>
                        {res.status}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Card — teal gradient */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="relative p-8 sm:p-10 rounded-3xl overflow-hidden
                    bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700
                    dark:from-teal-600 dark:via-teal-700 dark:to-cyan-800
                    flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8"
                >
                  {/* CTA glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/[0.06] blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cyan-400/10 blur-[40px] pointer-events-none translate-y-1/2 -translate-x-1/4" />
                  
                  <div className="relative z-10 space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-200 mb-1">
                      <Zap className="w-3 h-3" /> Opportunity Detected
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Claim Your GEO Advantage</h3>
                    <p className="text-teal-100/70 text-sm max-w-md leading-relaxed">
                      Most brands are underrepresented in GenAI search results. SerpNap's GEO frameworks help improve your AI citation visibility and search presence.
                    </p>
                  </div>
                  <div className="relative z-10 flex gap-3 shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setStatus("idle")}
                      className="rounded-xl border-white/20 bg-white/10 hover:bg-white/[0.15] text-white font-medium text-xs h-12 px-6 backdrop-blur-sm transition-all duration-200"
                    >
                      New Audit
                    </Button>
                    <Link href={`/tools/neural-audit/studio?domain=${url}`}>
                      <Button className="rounded-xl bg-white text-teal-700 hover:bg-teal-50 font-semibold text-xs h-12 px-6 shadow-lg shadow-black/10 transition-all duration-200">
                        Full Intelligence Studio
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
