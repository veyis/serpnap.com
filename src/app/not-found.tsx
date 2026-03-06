import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen pt-14 flex items-center justify-center">
        <div className="container-padding text-center py-32">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
            404
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight leading-[1.1]">
            Page not found.
          </h1>
          <p className="text-[15px] text-muted-foreground mt-4 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-7 py-3.5 text-[14px] font-semibold transition-all duration-300 hover:opacity-90 press-effect"
            >
              Go Home
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-7 py-3.5 text-[14px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all duration-300"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
