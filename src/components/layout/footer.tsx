import Link from "next/link";
import { config } from "@/lib/config";

const TOOL_LINKS = [
  { label: "SEO Checker", href: "/tools/seo-checker" },
  { label: "Technical Audit", href: "/tools/technical-audit" },
  { label: "Neural Audit", href: "/tools/neural-audit" },
  { label: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
  { label: "Schema Generator", href: "/tools/schema-generator" },
  { label: "Word Counter", href: "/tools/word-counter" },
  { label: "OG Checker", href: "/tools/open-graph-checker" },
  { label: "Broken Link Checker", href: "/tools/broken-link-checker" },
  { label: "SSL Checker", href: "/tools/ssl-checker" },
  { label: "All Tools", href: "/tools" },
] as const;

const RESOURCE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "SEO Glossary", href: "/glossary" },
  { label: "Documentation", href: "/docs" },
  { label: "Compare Tools", href: "/compare" },
  { label: "Free Alternatives", href: "/alternatives" },
  { label: "How-To Guides", href: "/guides" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export function Footer() {
  return (
    <footer aria-label="Site footer" className="border-t border-border/30">
      <div className="container-wide container-padding">
        {/* Main footer */}
        <div className="py-16 sm:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[-0.02em]"
            >
              {config.brand.name}
            </Link>
            <p className="mt-4 max-w-xs text-[14px] md:text-[15px] text-muted-foreground leading-relaxed">
              Free, professional-grade SEO tools to audit, analyze, and optimize
              your website for search engines.
            </p>
          </div>

          {/* Tools */}
          <nav aria-label="SEO Tools" className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 mb-5">
              Tools
            </h3>
            <ul className="space-y-3">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] md:text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources" className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] md:text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] md:text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] md:text-[12px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} {config.brand.name}. All rights
            reserved.
          </p>
          <p className="text-[13px] md:text-[12px] text-muted-foreground/40">
            Built by{" "}
            <a
              href="https://pxlpeak.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground/70 transition-colors duration-200"
            >
              PxlPeak
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
