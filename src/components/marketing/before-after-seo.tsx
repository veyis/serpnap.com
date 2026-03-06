"use client";

import { useState } from "react";
import { Check, ShieldAlert, Sparkles, X } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

export function BeforeAfterSeo() {
  const [isOptimized, setIsOptimized] = useState(false);

  return (
    <section className="section-padding container-padding">
      <div className="container-narrow mx-auto">
        <RevealOnScroll>
          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="text-section mb-4">Stop hiding your best products.</h2>
            <p className="text-subheadline text-muted-foreground/80">
              See what your customers see. SerpNap&apos;s AI automatically rewrites
              your titles and meta descriptions so they command attention and rank
              higher in search results.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="rounded-3xl border border-border/40 bg-card p-6 sm:p-10 shadow-xl dark:shadow-none mb-8 relative overflow-hidden">
            {/* Ambient Background glow effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-opacity duration-700" style={{ opacity: isOptimized ? 1 : 0 }} />

            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex bg-muted/30 p-1.5 rounded-full ring-1 ring-border/20">
                <button
                  onClick={() => setIsOptimized(false)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    !isOptimized
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Unoptimized
                </button>
                <button
                  onClick={() => setIsOptimized(true)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    isOptimized
                      ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Optimized
                </button>
              </div>

              {!isOptimized ? (
                <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 px-4 py-1.5 rounded-full">
                  <ShieldAlert className="w-4 h-4" />
                  Losing 43% of traffic
                </div>
              ) : (
                <div className="flex items-center gap-2 text-success text-sm font-medium bg-success/10 px-4 py-1.5 rounded-full animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                  <Check className="w-4 h-4" />
                  Perfectly Optimized
                </div>
              )}
            </div>

            {/* Google Results Display */}
            <div className={`p-6 bg-background rounded-2xl border transition-all duration-300 ${isOptimized ? 'border-primary/20 shadow-md ring-1 ring-primary/5' : 'border-border/40'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-muted-foreground">SN</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-foreground/80 font-medium">Your Store</span>
                  <span className="text-xs text-muted-foreground">https://yourstore.com › products › sneaker</span>
                </div>
              </div>

              <div className="mt-3 relative h-[100px] overflow-hidden">
                {/* Unoptimized Version */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-out-expo ${isOptimized ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                  <h3 className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl font-normal hover:underline cursor-pointer leading-tight mb-1">
                    Classic Sneaker - Store Name
                  </h3>
                  <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-snug max-w-2xl">
                    <span className="text-destructive font-medium bg-destructive/10 px-1 rounded mr-1">Missing meta description.</span> 
                    This is a classic sneaker. It is very good. Size 8, 9, 10, 11 available. Buy now from our store for the best price...
                  </p>
                </div>

                {/* Optimized Version */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-out-expo ${!isOptimized ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                  <h3 className="text-[#1a0dab] dark:text-[#8ab4f8] text-[22px] font-normal hover:underline cursor-pointer leading-tight mb-1">
                    Classic Leather Sneaker in Black | Comfort Fit | Store Name
                  </h3>
                  <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-snug max-w-2xl">
                    Upgrade your style with our premium Classic Leather Sneakers. Featuring cloud-like comfort, breathable materials, and a timeless design. Free shipping on orders over $50. Shop now!
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Analysis List */}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {!isOptimized ? (
                <>
                  <div className="flex items-start gap-3 p-3 text-sm text-muted-foreground">
                    <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <p>Title is too short and lacks important keywords (color, material).</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 text-sm text-muted-foreground">
                    <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <p>Google had to guess the description from the page text. Lacks CTA.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 text-sm text-foreground/80 animate-in fade-in slide-in-from-left-4 duration-500">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <p>Title optimized for search intent (Leather, Black, Comfort Fit).</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 text-sm text-foreground/80 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <p>Compelling meta description written with a strong Call-To-Action.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
