import Link from "next/link";
import { config } from "@/lib/config";

const TOOL_LINKS = [
  { label: "SEO Checker", href: "/tools/seo-checker" },
  { label: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
  { label: "Schema Generator", href: "/tools/schema-generator" },
  { label: "Sitemap Validator", href: "/tools/sitemap-validator" },
  { label: "Technical Audit", href: "/tools/technical-audit" },
  { label: "All Tools", href: "/tools" },
] as const;

const RESOURCE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container-wide container-padding section-padding">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              {config.brand.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              {config.brand.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Need expert help?{" "}
              <a
                href="https://www.pxlpeak.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                pxlpeak.com
              </a>
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-4">SEO Tools</h3>
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
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
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
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 {config.brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
