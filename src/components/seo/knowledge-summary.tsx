"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeSummaryProps {
  title: string;
  summary: string;
  keyTakeaways: string[];
  citation?: {
    author: string;
    source: string;
  };
  className?: string;
}

/**
 * A highly structured summary component designed to be easily read by 
 * Search AI (Google AI Overviews, Perplexity, etc.) and humans alike.
 */
export function KnowledgeSummary({
  title,
  summary,
  keyTakeaways,
  citation,
  className
}: KnowledgeSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "my-12 p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-white/5 relative overflow-hidden",
        className
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Executive Summary / AI Insights</span>
        </div>

        <h2 className="text-2xl font-black tracking-tight mb-4 text-foreground" data-speakable="summary-title">
          {title}
        </h2>

        <p className="text-md text-muted-foreground font-medium leading-relaxed mb-8" data-speakable="summary">
          {summary}
        </p>

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Key Takeaways</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {keyTakeaways.map((item, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-[13px] font-bold text-foreground/80 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {citation && (
          <div className="pt-6 border-t border-zinc-200 dark:border-white/5 flex items-center gap-4">
            <Quote className="w-8 h-8 text-primary/20 shrink-0" />
            <div className="text-[12px] font-medium text-muted-foreground italic leading-relaxed">
                Source: <span className="text-foreground font-bold not-italic">{citation.author}</span> · {citation.source}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
