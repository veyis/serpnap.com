/**
 * Prose Components
 *
 * Reusable components for TSX blog posts, providing
 * consistent styling and semantic HTML.
 */
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import {
  Check,
  Lightbulb,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export function H2({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "text-[22px] font-bold mt-10 mb-4 text-foreground scroll-mt-24",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      id={id}
      className={cn(
        "text-[18px] font-semibold mt-8 mb-3 text-foreground scroll-mt-24",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      id={id}
      className={cn(
        "text-[16px] font-semibold mt-6 mb-2 text-foreground scroll-mt-24",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function P({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground leading-relaxed mb-4", className)}>
      {children}
    </p>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold text-foreground">{children}</strong>
  );
}

export function Em({ children }: { children: React.ReactNode }) {
  return <em className="italic">{children}</em>;
}

// ============================================================================
// LISTS
// ============================================================================

export function UL({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "space-y-2 my-4 text-muted-foreground list-disc pl-6",
        className
      )}
    >
      {children}
    </ul>
  );
}

export function OL({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "space-y-2 my-4 text-muted-foreground list-decimal pl-6",
        className
      )}
    >
      {children}
    </ol>
  );
}

export function LI({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <li className={cn("", className)}>{children}</li>;
}

export function ChecklistItem({
  children,
  checked = true,
}: {
  children: React.ReactNode;
  checked?: boolean;
}) {
  return (
    <li className="flex items-start gap-2 list-none -ml-6">
      {checked ? (
        <Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
      ) : (
        <div className="w-4 h-4 border border-muted-foreground/40 rounded mt-1 shrink-0" />
      )}
      <span>{children}</span>
    </li>
  );
}

// ============================================================================
// LINKS
// ============================================================================

export function Link({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const linkClasses =
    "text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors";

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={cn(linkClasses, "inline-flex items-center gap-1")}
      >
        {children}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClasses}>
      {children}
    </NextLink>
  );
}

// ============================================================================
// CALLOUTS
// ============================================================================

const calloutVariants = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: Info,
    iconColor: "text-blue-500",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: Check,
    iconColor: "text-emerald-500",
  },
};

export function CalloutBox({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = calloutVariants[variant];
  const Icon = styles.icon;

  return (
    <div className={cn("my-6 p-4 rounded-lg border", styles.bg, styles.border)}>
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", styles.iconColor)} />
        <div>
          {title && (
            <span className="font-semibold text-foreground block mb-1">
              {title}
            </span>
          )}
          <div className="text-muted-foreground text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ProTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-4 rounded-lg border bg-violet-500/10 border-violet-500/20">
      <div className="flex gap-3">
        <Lightbulb className="w-5 h-5 mt-0.5 shrink-0 text-violet-500" />
        <div>
          <span className="font-semibold text-foreground">Pro Tip: </span>
          <span className="text-muted-foreground">{children}</span>
        </div>
      </div>
    </div>
  );
}

export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-6 pl-4 border-l-4 border-muted-foreground/20 italic text-muted-foreground">
      {children}
    </blockquote>
  );
}

// ============================================================================
// CODE
// ============================================================================

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted/50 px-1.5 py-0.5 rounded text-[14px] font-mono">
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  language: _language,
}: {
  children: string;
  language?: string;
}) {
  return (
    <pre className="my-6 bg-muted/50 rounded-lg p-4 overflow-x-auto">
      <code className="text-[14px] font-mono text-foreground">{children}</code>
    </pre>
  );
}

// ============================================================================
// MEDIA
// ============================================================================

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg border border-border/50"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ============================================================================
// TABLES
// ============================================================================

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-border">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-border/50">{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 px-4 font-semibold text-foreground text-[14px]">
      {children}
    </th>
  );
}

export function TD({ children }: { children: React.ReactNode }) {
  return (
    <td className="py-3 px-4 text-muted-foreground text-[14px]">{children}</td>
  );
}

// ============================================================================
// DIVIDERS
// ============================================================================

export function HR() {
  return <hr className="my-8 border-border/50" />;
}

// ============================================================================
// STATS / KEY NUMBERS
// ============================================================================

export function StatHighlight({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="inline-flex items-baseline gap-2 bg-muted/30 px-3 py-1.5 rounded-lg">
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// ============================================================================
// CONTEXTUAL INTERNAL LINKS
// ============================================================================

/**
 * TopicLinks — contextual cross-linking component for blog posts.
 * Drop this into any blog post to create a styled "Related reading" or
 * "Explore this topic" box with internal links.
 *
 * Usage:
 * <TopicLinks
 *   title="Dive Deeper Into AI Automation"
 *   links={[
 *     { href: "/blog/ai-automation/how-to-set-up-n8n-ai-automation", label: "How to Set Up n8n AI Automation" },
 *     { href: "/ai-tools/automation/n8n", label: "n8n Tool Overview" },
 *     { href: "/ai-tools/compare/n8n-vs-zapier", label: "n8n vs Zapier Comparison" },
 *     { href: "/tools/ai-readiness-assessment", label: "Take the AI Readiness Assessment" },
 *   ]}
 * />
 */
export function TopicLinks({
  title = "Related Reading",
  links,
}: {
  title?: string;
  links: Array<{ href: string; label: string }>;
}) {
  if (links.length === 0) return null;

  return (
    <nav
      className="my-8 p-5 rounded-xl border border-primary/20 bg-primary/5"
      aria-label={title}
    >
      <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-primary block mb-3">
        {title}
      </span>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <NextLink
              href={link.href}
              className="text-[15px] text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              {link.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 p-6 rounded-xl border-2 border-foreground/10 bg-muted/20">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-background" />
        </div>
        <div>
          <span className="font-semibold text-foreground block mb-2">
            Key Takeaway
          </span>
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
