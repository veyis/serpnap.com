"use client";

import { Check, Info, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

const PLANS = [
  {
    name: "Free SEO Audit",
    price: "$0",
    description: "Find out exactly what's holding you back.",
    features: [
      "Full store SEO scan",
      "Overall SEO Health Score",
      "See all existing issues",
      "Preview of AI fixes (blurred)",
    ],
    cta: "Scan Store Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$19",
    period: "/mo",
    description: "Perfect for new stores taking SEO seriously.",
    features: [
      "Everything in Free",
      "AI-generated fixes (up to 100 products)",
      "One-click 'Apply Fix'",
      "Weekly email report",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: "$39",
    period: "/mo",
    description: "For growing stores that want to fully automate SEO.",
    features: [
      "Unlimited products",
      "Bulk 'Fix All' button in one click",
      "Schema markup automated injection",
      "Duplicate content detection",
      "Priority AI model generation",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    description: "Advanced intelligence for established merchants.",
    features: [
      "Everything in Growth",
      "Track up to 100 keywords automatically",
      "Google Search Console integration",
      "AI content and blog suggestions",
      "Priority VIP support",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="section-padding container-padding bg-muted/10 relative overflow-hidden" id="pricing">
      {/* Background embellishments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] -left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-wide mx-auto relative z-10">
        <RevealOnScroll>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
              Simple Pricing
            </p>
            <h2 className="text-section mb-6">Pays for itself with one extra sale.</h2>
            <p className="text-subheadline text-muted-foreground/90">
              Start with a free comprehensive audit. Upgrade to fix everything automatically when you&apos;re ready to grow.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start max-w-7xl mx-auto">
          {PLANS.map((plan, i) => (
            <RevealOnScroll key={plan.name} delay={i * 100}>
              <div
                className={`relative flex flex-col h-full p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-foreground text-background shadow-xl scale-100 lg:scale-105 z-10 border border-foreground/10"
                    : "bg-surface-elevated border border-border/40 hover:border-border/80 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-background" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? "text-background/70" : "text-muted-foreground"} min-h-[40px]`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className={`text-[40px] font-extrabold tracking-tight leading-none ${plan.popular ? "text-background" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm font-medium ${plan.popular ? "text-background/60" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-[2px] ${plan.popular ? "bg-background/20 text-background" : "bg-primary/10 text-primary"}`}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] leading-snug ${plan.popular ? "text-background/90" : "text-foreground/80"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 px-6 rounded-full text-sm font-semibold transition-transform active:scale-95 ${
                    plan.popular
                      ? "bg-background text-foreground hover:bg-background/90 shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]"
                      : "bg-foreground text-background hover:bg-foreground/90 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={500}>
          <div className="mt-16 text-center flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4 opacity-70" />
            <span>All paid plans include a 7-day free trial. Cancel anytime directly in Shopify.</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
