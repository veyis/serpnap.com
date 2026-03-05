import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

interface CTASectionProps {
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTASection({
  description = "Book a free 30-minute assessment. We'll map exactly which AI tools will save you time and money — with a clear timeline and pricing.",
  buttonText = "Book Free AI Assessment",
  buttonHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="py-24 sm:py-32 container-padding" data-nosnippet>
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 rounded-[32px] bg-foreground relative overflow-hidden text-center">
        {/* Label */}
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-background/10" />
            <p className="text-[11px] font-bold tracking-[0.2em] text-background/60 uppercase">
              Ready?
            </p>
            <div className="h-px w-8 bg-background/10" />
          </div>
        </RevealOnScroll>

        {/* Title */}
        <RevealOnScroll delay={100} variant="scale">
          <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-[-0.04em] leading-[1.1] text-background">
            Put AI to Work{" "}
            <span className="text-background/60 italic font-serif">
              for You.
            </span>
          </h2>
        </RevealOnScroll>

        {/* Description */}
        <RevealOnScroll delay={150} variant="fade">
          <p className="text-lg text-background/70 mt-6 leading-relaxed max-w-xl mx-auto">
            {description}
          </p>
        </RevealOnScroll>

        {/* CTA Button */}
        <RevealOnScroll delay={200}>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base font-semibold rounded-full bg-background text-foreground hover:bg-background/90 transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.25)]"
            >
              <Link href={buttonHref} className="group">
                {buttonText}
                <ArrowRight
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </RevealOnScroll>

        {/* Trust checkmarks */}
        <RevealOnScroll delay={250} variant="fade">
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-background/50">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" />
              Free assessment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" />
              No commitment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" />
              Results in 2 weeks
            </span>
          </div>
        </RevealOnScroll>

        {/* Explore links */}
        <RevealOnScroll delay={300} variant="fade">
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-xs text-background/40">
            <Link href="/about" className="px-2.5 py-2 hover:text-background/70 transition-colors">About Us</Link>
            <span>&middot;</span>
            <Link href="/solutions" className="px-2.5 py-2 hover:text-background/70 transition-colors">Solutions</Link>
            <span>&middot;</span>
            <Link href="/industries" className="px-2.5 py-2 hover:text-background/70 transition-colors">Industries</Link>
            <span>&middot;</span>
            <Link href="/locations" className="px-2.5 py-2 hover:text-background/70 transition-colors">Locations</Link>
            <span>&middot;</span>
            <Link href="/research" className="px-2.5 py-2 hover:text-background/70 transition-colors">AI Research</Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
