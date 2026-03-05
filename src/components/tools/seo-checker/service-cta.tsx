import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SEOCheckResult } from "@/schemas/seo-checker";

export function ServiceCTA({ categories }: { categories: SEOCheckResult["categories"] }) {
  const technicalErrors = categories.technical.issues.filter(i => i.type === "error").length;
  const technicalWarnings = categories.technical.issues.filter(i => i.type === "warning").length;
  const metaErrors = categories.meta.issues.filter(i => i.type === "error").length;
  const metaWarnings = categories.meta.issues.filter(i => i.type === "warning").length;
  const contentErrors = categories.content.issues.filter(i => i.type === "error").length;
  const contentWarnings = categories.content.issues.filter(i => i.type === "warning").length;
  const structuredErrors = categories.structured.issues.filter(i => i.type === "error").length;
  const structuredWarnings = categories.structured.issues.filter(i => i.type === "warning").length;
  const a11yErrors = categories.accessibility?.issues.filter(i => i.type === "error").length || 0;
  const a11yWarnings = categories.accessibility?.issues.filter(i => i.type === "warning").length || 0;
  const eeatErrors = categories.eeat?.issues.filter(i => i.type === "error").length || 0;
  const eeatWarnings = categories.eeat?.issues.filter(i => i.type === "warning").length || 0;
  const intlErrors = categories.international?.issues.filter(i => i.type === "error").length || 0;
  const intlWarnings = categories.international?.issues.filter(i => i.type === "warning").length || 0;
  const mobileErrors = categories.mobile?.issues.filter(i => i.type === "error").length || 0;
  const mobileWarnings = categories.mobile?.issues.filter(i => i.type === "warning").length || 0;

  const totalErrors = technicalErrors + metaErrors + contentErrors + structuredErrors + a11yErrors + eeatErrors + intlErrors + mobileErrors;
  const totalWarnings = technicalWarnings + metaWarnings + contentWarnings + structuredWarnings + a11yWarnings + eeatWarnings + intlWarnings + mobileWarnings;

  if (totalErrors === 0 && totalWarnings === 0) return null;

  const services: Array<{ name: string; issues: number; href: string; description: string }> = [];

  if (technicalErrors > 0 || technicalWarnings > 1) {
    services.push({
      name: "Technical SEO Fixes",
      issues: technicalErrors + technicalWarnings,
      href: "/services/seo",
      description: "SSL, speed, mobile optimization"
    });
  }

  if (metaErrors > 0 || metaWarnings > 1) {
    services.push({
      name: "Meta Tag Optimization",
      issues: metaErrors + metaWarnings,
      href: "/services/seo",
      description: "Titles, descriptions, social tags"
    });
  }

  if (contentErrors > 0 || contentWarnings > 1) {
    services.push({
      name: "Content Strategy",
      issues: contentErrors + contentWarnings,
      href: "/services/seo",
      description: "Headings, keywords, structure"
    });
  }

  if (structuredErrors > 0 || structuredWarnings > 0) {
    services.push({
      name: "Schema Implementation",
      issues: structuredErrors + structuredWarnings,
      href: "/services/web-design",
      description: "Rich snippets, structured data"
    });
  }

  if (a11yErrors > 0 || a11yWarnings > 1) {
    services.push({
      name: "Accessibility Audit",
      issues: a11yErrors + a11yWarnings,
      href: "/services/web-design",
      description: "WCAG compliance, contrast, navigation"
    });
  }

  if (eeatErrors > 0 || eeatWarnings > 1) {
    services.push({
      name: "Trust & Authority Building",
      issues: eeatErrors + eeatWarnings,
      href: "/services/seo",
      description: "Author markup, testimonials, credentials"
    });
  }

  if (intlErrors > 0 || intlWarnings > 1) {
    services.push({
      name: "International SEO",
      issues: intlErrors + intlWarnings,
      href: "/services/seo",
      description: "Hreflang, multi-language, geo-targeting"
    });
  }

  if (mobileErrors > 0 || mobileWarnings > 1) {
    services.push({
      name: "Mobile Optimization",
      issues: mobileErrors + mobileWarnings,
      href: "/services/web-design",
      description: "Responsive design, touch targets, viewport"
    });
  }

  // Don't render empty CTA when issues exist only in categories without service cards
  if (services.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-4 h-4 text-[var(--seo-icon)]" />
          <span className="text-[14px] font-semibold text-[var(--seo-text)]">We Can Fix These Issues</span>
          <span className="text-[11px] px-2 py-0.5 bg-destructive/15 rounded-full text-destructive">
            {totalErrors + totalWarnings} issues
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {services.slice(0, 6).map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="p-3 rounded-lg bg-[var(--seo-surface)] hover:bg-[var(--seo-surface-hover)] transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium text-[var(--seo-text)] group-hover:text-[var(--seo-text)] transition-colors">
                  {service.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">
                  {service.issues}
                </span>
              </div>
              <p className="text-[11px] text-[var(--seo-text-muted)]">{service.description}</p>
            </Link>
          ))}
        </div>

        <Link href="/contact?source=seo-checker" className="block">
          <Button className="w-full h-10 text-[14px] bg-[var(--seo-btn-bg)] text-[var(--seo-btn-text)] hover:bg-[var(--seo-btn-hover)] active:scale-[0.97] font-semibold rounded-full transition-all">
            Get All Issues Fixed
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <p className="text-[11px] text-center text-[var(--seo-text-faint)] mt-2">
          Average fix time: 2-3 business days
        </p>
      </div>
    </div>
  );
}
