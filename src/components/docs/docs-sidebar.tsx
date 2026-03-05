"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DocNavSection, DocNavCategory } from "@/lib/docs/schema";
import {
  ChevronRight,
  Rocket,
  Layers,
  Sparkles,
  Code2,
  BookOpen,
  FolderOpen,
  Mail,
  Users,
  MapPin,
  Video,
  BarChart3,
  Search,
  FileText,
  Bot,
  Tag,
  GitBranch,
  TrendingUp,
  Target,
  HelpCircle,
} from "lucide-react";

// Brand icons as simple SVG components
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MetaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.77-3.92 1.09 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const iconMap: Record<string, React.ElementType> = {
  // Platform icons
  rocket: Rocket,
  layers: Layers,
  sparkles: Sparkles,
  code: Code2,
  book: BookOpen,
  folder: FolderOpen,
  mail: Mail,
  users: Users,
  mapPin: MapPin,
  video: Video,
  chart: BarChart3,
  // New icons for reorganized nav
  search: Search,
  fileText: FileText,
  bot: Bot,
  tag: Tag,
  gitBranch: GitBranch,
  trendingUp: TrendingUp,
  target: Target,
  helpCircle: HelpCircle,
  // Brand icons
  google: GoogleIcon,
  meta: MetaIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
};

interface DocsSidebarProps {
  className?: string;
  navigation?: DocNavSection[];
  categories?: DocNavCategory[];
}

export function DocsSidebar({
  className,
  navigation,
  categories,
}: DocsSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["getting-started"])
  );

  // Flatten categories to sections if using categorized navigation
  const allSections = categories
    ? categories.flatMap((cat) => cat.sections)
    : (navigation || []);

  // Auto-expand the section containing the current page
  React.useEffect(() => {
    if (allSections.length === 0) return;
    const currentPath = pathname.replace("/docs/", "");
    const section = allSections.find((s) =>
      s.items.some((item) => currentPath === `${s.slug}/${item.slug}`)
    );
    if (section) {
      setExpandedSections((prev) => new Set([...prev, section.slug]));
    }
  }, [pathname, allSections]);

  const toggleSection = (slug: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <nav
      className={cn("w-64 flex-shrink-0 border-r border-border/40", className)}
      aria-label="Documentation navigation"
    >
      <div className="sticky top-0 h-screen overflow-y-auto py-8 px-4">
        {/* Docs header */}
        <div className="mb-8">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span>Documentation</span>
          </Link>
        </div>

        {/* Categorized Navigation */}
        {categories ? (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.title}>
                {/* Category header */}
                <div className="mb-2 px-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                    {category.title}
                  </span>
                </div>
                {/* Category sections */}
                <div className="space-y-0.5">
                  {category.sections.map((section) => (
                    <SidebarSection
                      key={section.slug}
                      section={section}
                      isExpanded={expandedSections.has(section.slug)}
                      onToggle={() => toggleSection(section.slug)}
                      currentPath={pathname}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Legacy flat navigation */
          <div className="space-y-1">
            {(navigation || []).map((section) => (
              <SidebarSection
                key={section.slug}
                section={section}
                isExpanded={expandedSections.has(section.slug)}
                onToggle={() => toggleSection(section.slug)}
                currentPath={pathname}
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

interface SidebarSectionProps {
  section: DocNavSection;
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
}

function SidebarSection({
  section,
  isExpanded,
  onToggle,
  currentPath,
}: SidebarSectionProps) {
  const Icon = iconMap[section.icon || "folder"] || FolderOpen;

  return (
    <div className="relative">
      {/* Section header */}
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-[color,background-color] duration-200",
          "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
          isExpanded && "text-foreground"
        )}
        aria-expanded={isExpanded}
      >
        <Icon className="h-4 w-4 flex-shrink-0 opacity-60" />
        <span className="flex-1 text-left">{section.title}</span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 opacity-40 transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
      </button>

      {/* Section items */}
      <div
        className={cn(
          "overflow-hidden transition-[transform,opacity] duration-300 ease-out",
          isExpanded ? "opacity-100" : "h-0 opacity-0"
        )}
      >
        <div className="relative ml-4 mt-1 space-y-0.5 border-l border-border/40 pl-3">
          {section.items.map((item) => {
            const href = `/docs/${item.path}`;
            const isActive = currentPath === href;

            return (
              <Link
                key={item.slug}
                href={href}
                className={cn(
                  "group relative flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-[color,background-color] duration-200",
                  isActive
                    ? "bg-foreground/5 text-foreground font-medium"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute -left-[13px] top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-foreground" />
                )}
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      item.badge === "new" &&
                        "bg-success/10 text-success",
                      item.badge === "updated" &&
                        "bg-warning/10 text-warning",
                      item.badge === "beta" &&
                        "bg-muted/20 text-muted"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Mobile sidebar - receives navigation as prop
interface DocsSidebarMobileProps {
  navigation?: DocNavSection[];
  categories?: DocNavCategory[];
}

export function DocsSidebarMobile({
  navigation,
  categories,
}: DocsSidebarMobileProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  // Close on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <BookOpen className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/40 px-4">
          <span className="text-sm font-semibold">Documentation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1.5 text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
            aria-label="Close navigation"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <DocsSidebar
          className="border-r-0"
          navigation={navigation}
          categories={categories}
        />
      </div>
    </>
  );
}
