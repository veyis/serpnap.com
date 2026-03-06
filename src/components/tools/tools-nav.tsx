"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Type,
  Bot,
  ArrowRight,
  BarChart3,
  Shield,
  Tags,
  FileJson,
  Route,
  Hash,
  FileSearch,
  Gauge,
  Brain,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { href: "/tools/seo-checker", icon: Search, label: "SEO Checker" },
  { href: "/tools/technical-audit", icon: Shield, label: "Technical Audit" },
  { href: "/tools/neural-audit", icon: Brain, label: "Neural Audit" },
  { href: "/tools/meta-tag-generator", icon: Tags, label: "Meta Tags" },
  { href: "/tools/schema-generator", icon: FileJson, label: "Schema Generator" },
  { href: "/tools/sitemap-validator", icon: FileSearch, label: "Sitemap Validator" },
  { href: "/tools/headline-analyzer", icon: Type, label: "Headline Analyzer" },
  { href: "/tools/keyword-density-checker", icon: Hash, label: "Keyword Density" },
  { href: "/tools/page-speed-estimator", icon: Gauge, label: "Speed Estimator" },
  { href: "/tools/redirect-checker", icon: Route, label: "Redirect Checker" },
  { href: "/tools/robots-txt-generator", icon: FileCode, label: "Robots.txt" },
] as const;

export function ToolsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <span className="text-[11px] text-(--seo-text-faint) font-medium uppercase tracking-[0.2em]">
        Free tools
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {tools.map((tool) => {
          const isActive = pathname === tool.href;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "group/tool inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-300",
                isActive
                  ? "bg-(--seo-text)/10 text-(--seo-text) border border-(--seo-text)/15"
                  : "text-(--seo-text-muted) bg-(--seo-surface) border border-(--seo-border-subtle) hover:text-(--seo-text) hover:bg-(--seo-surface-hover) hover:border-(--seo-text)/10"
              )}
            >
              <tool.icon
                className={cn(
                  "w-3 h-3 transition-colors duration-300",
                  isActive
                    ? "text-(--seo-text)/60"
                    : "text-(--seo-text-faint) group-hover/tool:text-(--seo-text-muted)"
                )}
              />
              {tool.label}
              {!isActive && (
                <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover/tool:opacity-60 group-hover/tool:ml-0 transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
