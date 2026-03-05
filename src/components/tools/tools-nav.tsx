"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Type, DollarSign, Bot, ArrowRight, BarChart3, GitCompareArrows, Calculator, ShieldCheck, Tags, FileJson, Shield, Route, Hash, Palette, FileSearch, TypeIcon, LayoutGrid, Gauge, Brain, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
    { href: "/tools/neural-audit", icon: Brain, label: "Neural Audit" },
    { href: "/tools/seo-checker", icon: Search, label: "SEO Checker" },
    { href: "/tools/headline-analyzer", icon: Type, label: "Headline Analyzer" },
    { href: "/tools/roi-calculator", icon: DollarSign, label: "ROI Calculator" },
    { href: "/tools/ai-agent-roi-calculator", icon: Bot, label: "AI Agent ROI" },
    { href: "/tools/ai-cost-calculator", icon: Calculator, label: "Cost Calculator" },
    { href: "/tools/ai-roi-simulator", icon: Zap, label: "ROI Simulator" },
    { href: "/tools/ai-readiness-assessment", icon: BarChart3, label: "AI Readiness" },
    { href: "/tools/ai-tool-comparison", icon: GitCompareArrows, label: "Compare Tools" },
    { href: "/tools/lead-purity-demo", icon: ShieldCheck, label: "Lead Purity" },
    { href: "/tools/meta-tag-generator", icon: Tags, label: "Meta Tags" },
    { href: "/tools/schema-generator", icon: FileJson, label: "Schema Generator" },
    { href: "/tools/robots-txt-generator", icon: Shield, label: "Robots.txt" },
    { href: "/tools/redirect-checker", icon: Route, label: "Redirect Checker" },
    { href: "/tools/keyword-density-checker", icon: Hash, label: "Keyword Density" },
    { href: "/tools/color-palette-generator", icon: Palette, label: "Color Palette" },
    { href: "/tools/sitemap-validator", icon: FileSearch, label: "Sitemap Validator" },
    { href: "/tools/font-pairing-tool", icon: TypeIcon, label: "Font Pairing" },
    { href: "/tools/wireframe-builder", icon: LayoutGrid, label: "Wireframe" },
    { href: "/tools/page-speed-estimator", icon: Gauge, label: "Speed Estimator" },
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
                            <tool.icon className={cn(
                                "w-3 h-3 transition-colors duration-300",
                                isActive
                                    ? "text-(--seo-text)/60"
                                    : "text-(--seo-text-faint) group-hover/tool:text-(--seo-text-muted)"
                            )} />
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
