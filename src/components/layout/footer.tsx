import Link from "next/link";
import { config } from "@/lib/config";

const TOOL_LINKS = [
  { label: "SEO Checker", href: "/tools/seo-checker" },
  { label: "Technical Audit", href: "/tools/technical-audit" },
  { label: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
  { label: "Schema Generator", href: "/tools/schema-generator" },
  { label: "Sitemap Validator", href: "/tools/sitemap-validator" },
  { label: "All Tools", href: "/tools" },
] as const;

const RESOURCE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "/docs" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: `mailto:${config.business.contact.email}` },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container-wide container-padding">
        {/* Main footer */}
        <div className="py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="text-base font-semibold tracking-tight">
              {config.brand.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Free, powerful SEO tools to audit, analyze, and optimize your website for search engines.
            </p>
          </div>

          {/* Tools */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
              Tools
            </h3>
            <ul className="space-y-2.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} {config.brand.name}
          </p>
          <p className="text-xs text-muted-foreground/50">
            Built by{" "}
            <a
              href="https://www.pxlpeak.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors"
            >
              PxlPeak
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
