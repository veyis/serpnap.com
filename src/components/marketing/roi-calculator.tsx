"use client";

import { useState } from "react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

export function RoiCalculator() {
  const [products, setProducts] = useState(250);

  // Agency cost: roughly $10-20 per product for manual SEO meta tag rewrite
  const agencyCost = products * 15;
  const timeSaved = Math.round(products * 0.25); // 15 mins per product = 0.25 hours

  return (
    <section className="section-padding container-padding bg-muted/20">
      <div className="container-narrow mx-auto">
        <RevealOnScroll>
          <div className="max-w-lg mx-auto text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
              Return on Investment
            </p>
            <h2 className="text-section">Manual SEO is dead.</h2>
            <p className="text-subheadline mt-4">
              Stop paying agencies to write meta tags by hand. See how much time
              and money you save with AI execution.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="rounded-3xl border border-border/50 bg-card p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
            <div className="mb-10">
              <label className="flex items-center justify-between font-semibold mb-6">
                <span>How many products are in your store?</span>
                <span className="text-primary text-xl px-4 py-1.5 bg-primary/10 rounded-lg">{products}</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={products}
                onChange={(e) => setProducts(Number(e.target.value))}
                className="w-full h-1.5 bg-muted/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-all outline-none"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${(products / 2000) * 100}%, transparent ${(products / 2000) * 100}%)`,
                  backgroundColor: "var(--color-muted)",
                }}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-8 border-t border-border/40">
              <div className="p-6 rounded-2xl bg-muted/10 border border-border/40 flex flex-col justify-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Agency Cost
                </p>
                <div className="flex items-baseline gap-1 relative">
                  <div className="absolute top-1/2 -left-2 -right-4 h-[2px] bg-red-400/80 -rotate-6 rounded-full" />
                  <span className="text-3xl font-bold text-muted-foreground/50 line-through decoration-transparent">
                    ${agencyCost.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 shadow-sm flex flex-col justify-center ring-1 ring-emerald-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 relative">
                  SerpNap Cost
                </p>
                <div className="flex items-baseline gap-1 text-emerald-700 dark:text-emerald-300">
                  <span className="text-4xl font-extrabold">$39</span>
                  <span className="text-sm font-medium opacity-80">/mo</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                  Time Saved
                </p>
                <div className="flex items-baseline gap-1 text-blue-700 dark:text-blue-300">
                  <span className="text-4xl font-extrabold">{timeSaved}</span>
                  <span className="text-sm font-medium opacity-80">hours</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
