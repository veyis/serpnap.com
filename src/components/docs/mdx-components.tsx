"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  ExternalLink,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { ToolRenderer } from "./tools/tool-renderer";

// ============================================================================
// HEADINGS
// ============================================================================

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export function DocsH2({ children, id, ...props }: HeadingProps) {
  return (
    <h2
      id={id}
      className="group mt-12 mb-4 text-2xl font-semibold tracking-tight text-foreground scroll-mt-24"
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-foreground/60"
          aria-label={`Link to ${children}`}
        >
          #
        </a>
      )}
    </h2>
  );
}

export function DocsH3({ children, id, ...props }: HeadingProps) {
  return (
    <h3
      id={id}
      className="group mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground scroll-mt-24"
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-foreground/60"
          aria-label={`Link to ${children}`}
        >
          #
        </a>
      )}
    </h3>
  );
}

// ============================================================================
// PARAGRAPH
// ============================================================================

export function DocsP({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="my-4 leading-7 text-foreground/70" {...props}>
      {children}
    </p>
  );
}

// ============================================================================
// CODE BLOCK
// ============================================================================

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

/**
 * Recursively extract text content from React children
 * Handles nested React elements, arrays, and primitive values
 */
function extractTextFromChildren(children: React.ReactNode): string {
  if (children === null || children === undefined) {
    return "";
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }

  if (React.isValidElement(children)) {
    // Recursively extract from element's children
    const props = children.props as { children?: React.ReactNode };
    return extractTextFromChildren(props.children);
  }

  // Fallback for other iterable types
  if (typeof children === "object" && Symbol.iterator in children) {
    return Array.from(children as Iterable<React.ReactNode>)
      .map(extractTextFromChildren)
      .join("");
  }

  return "";
}

export function DocsCodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  // Extract language and code from children
  // MDX wraps code blocks in <pre><code>...</code></pre>
  // Handle cases where children might be a single element or array
  const childArray = React.Children.toArray(children);
  const codeElement = childArray.find(
    (child): child is React.ReactElement<{ className?: string; children?: React.ReactNode }> =>
      React.isValidElement(child) && child.type === "code"
  );

  const className = codeElement?.props?.className || "";
  const language = className.replace(/language-/, "") || "code";

  // Use recursive extraction to handle nested React elements
  const code = extractTextFromChildren(codeElement?.props?.children || children).trim();

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border/40 bg-foreground/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <span className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-[color,background-color] duration-200",
            "text-foreground/40 hover:text-foreground hover:bg-foreground/5",
            copied && "text-emerald-500"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed" {...props}>
        <code className="font-mono text-foreground/80">{code}</code>
      </pre>
    </div>
  );
}

// ============================================================================
// INLINE CODE
// ============================================================================

export function DocsInlineCode({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // Skip if this is inside a pre block (handled by DocsCodeBlock)
  if (typeof children === "string" && children.includes("\n")) {
    return <code {...props}>{children}</code>;
  }

  return (
    <code
      className="rounded bg-foreground/5 px-1.5 py-0.5 text-[0.9em] font-mono text-foreground/80"
      {...props}
    >
      {children}
    </code>
  );
}

// ============================================================================
// TABLE
// ============================================================================

export function DocsTable({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border/40">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

// ============================================================================
// BLOCKQUOTE
// ============================================================================

export function DocsBlockquote({
  children,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="relative my-6 border-l-2 border-foreground/20 pl-6 italic text-foreground/70"
      {...props}
    >
      {children}
    </blockquote>
  );
}

// ============================================================================
// LINK
// ============================================================================

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export function DocsLink({ href, children, ...props }: LinkProps) {
  const isExternal = href?.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-foreground font-medium underline underline-offset-2 decoration-foreground/30 hover:decoration-foreground/60 transition-colors inline-flex items-center gap-0.5"
        {...props}
      >
        {children}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </a>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="text-foreground font-medium underline underline-offset-2 decoration-foreground/30 hover:decoration-foreground/60 transition-colors"
      {...props}
    >
      {children}
    </Link>
  );
}

// ============================================================================
// LISTS
// ============================================================================

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  ordered?: boolean;
}

export function DocsList({ children, ordered, ...props }: ListProps) {
  const Component = ordered ? "ol" : "ul";
  return (
    <Component
      className={cn(
        "my-4 space-y-2 pl-6 text-foreground/70",
        ordered ? "list-decimal" : "list-disc"
      )}
      {...(props as React.HTMLAttributes<HTMLOListElement>)}
    >
      {children}
    </Component>
  );
}

export function DocsListItem({
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className="marker:text-foreground/30" {...props}>
      {children}
    </li>
  );
}

// ============================================================================
// CALLOUT (Custom Component)
// ============================================================================

type CalloutVariant = "info" | "warning" | "tip" | "success";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const calloutVariants: Record<
  CalloutVariant,
  {
    icon: React.ElementType;
    bg: string;
    border: string;
    text: string;
    defaultTitle: string;
  }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    defaultTitle: "Info",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    defaultTitle: "Warning",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    defaultTitle: "Pro Tip",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-600 dark:text-green-400",
    defaultTitle: "Success",
  },
};

export function DocsCallout({
  variant = "info",
  title,
  children,
}: CalloutProps) {
  const config = calloutVariants[variant];
  const Icon = config.icon;

  return (
    <div className={cn("my-6 rounded-xl border p-4", config.bg, config.border)}>
      <div className={cn("flex items-center gap-2 font-medium mb-2", config.text)}>
        <Icon className="h-5 w-5" />
        {title || config.defaultTitle}
      </div>
      <div className="text-foreground/70 text-sm [&>p]:my-0">{children}</div>
    </div>
  );
}

// ============================================================================
// TOOL EMBED (Custom Component)
// ============================================================================

interface ToolEmbedProps {
  id: string;
  className?: string;
}

export function ToolEmbed({ id, className }: ToolEmbedProps) {
  return (
    <div className="my-8">
      <ToolRenderer toolId={id} className={className} />
    </div>
  );
}
