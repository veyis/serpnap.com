import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { CTASection } from "@/components/agency";

// Import from new blog registry
import "@/content/blog"; // Initialize registry
import {
  getAllCombinedPosts,
  getCategoryInfo,
  getAllCategoryParams,
  isValidCategory,
  categories,
  type BlogCategory,
  type BlogPostMetadata,
} from "@/lib/blog";

import type { Metadata } from "next";

const CATEGORY_HUB_LINKS: Partial<Record<string, { href: string; label: string; cta: string }>> = {
  "ai-agents":     { href: "/ai-agents",               label: "Explore AI agents for small business",  cta: "Looking for AI agents for your small business?" },
  "ai-automation": { href: "/services/ai-automation",   label: "Explore AI automation solutions",       cta: "Ready to automate your business with AI?" },
  "ai-voice":      { href: "/services/ai-voice-agents", label: "Explore AI voice agents",               cta: "Looking for AI voice agents for your business?" },
  "ai-tools":      { href: "/ai-tools",                 label: "Browse all AI tools",                   cta: "Looking for the right AI tools for your workflow?" },
  "ai-strategy":   { href: "/ai-agents",                label: "Explore our AI agent services",         cta: "Ready to build your AI strategy?" },
};

// Static generation for all categories
export function generateStaticParams() {
  return getAllCategoryParams();
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const categoryInfo = getCategoryInfo(category);

  if (!categoryInfo) {
    notFound();
  }

  return {
    title: `${categoryInfo.name} Articles & Guides`,
    description: categoryInfo.description,
    alternates: {
      canonical: `${config.appUrl}/blog/${category}`,
    },
    openGraph: {
      title: `${categoryInfo.name} Articles & Guides | SerpNap Blog`,
      description: categoryInfo.description,
      type: "website",
      url: `${config.appUrl}/blog/${category}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryInfo.name} Articles & Guides | SerpNap Blog`,
      description: categoryInfo.description,
    },
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function CategoryHero({
  categoryInfo,
  postCount,
}: {
  categoryInfo: NonNullable<ReturnType<typeof getCategoryInfo>>;
  postCount: number;
}) {
  return (
    <section className="section-padding container-padding pt-32 sm:pt-40">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Category badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6",
            categoryInfo.color.bg,
            categoryInfo.color.text
          )}
        >
          <span>{categoryInfo.name}</span>
          <span className="opacity-50">•</span>
          <span>
            {postCount} {postCount === 1 ? "article" : "articles"}
          </span>
        </div>

        <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
          {categoryInfo.name}
        </h1>

        <p className="text-[17px] sm:text-[19px] text-muted-foreground mt-6 leading-relaxed max-w-2xl">
          {categoryInfo.description}
        </p>
      </div>
    </section>
  );
}

function BlogPostCard({
  post,
  index,
}: {
  post: BlogPostMetadata;
  index: number;
}) {
  const categoryInfo = getCategoryInfo(post.category);
  const colors = categoryInfo?.color || {
    bg: "bg-muted",
    text: "text-foreground",
  };

  return (
    <Link
      href={`/blog/${post.category}/${post.slug}`}
      className={cn(
        "group flex flex-col p-6 sm:p-8",
        "bg-background",
        "border-border/50 hover:border-border",
        "hover:shadow-lg transition-[border-color,box-shadow]",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Category */}
          <div
            className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-medium mb-4",
              colors.bg,
              colors.text
            )}
          >
            {categoryInfo?.name || post.category}
          </div>

          {/* Title */}
          <h2 className="text-[20px] sm:text-[24px] font-bold tracking-[-0.02em] text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-[15px] text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Updated
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 group-hover:bg-muted transition-colors shrink-0 mt-2">
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function CategorySidebar({ currentCategory }: { currentCategory: string }) {
  return (
    <aside className="hidden lg:block lg:w-64 shrink-0">
      <div className="sticky top-24">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Categories
        </h3>
        <nav className="space-y-2">
          {categories.map((cat) => {
            const isActive = cat.slug === currentCategory;
            return (
              <Link
                key={cat.slug}
                href={`/blog/${cat.slug}`}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? cn(cat.color.bg, cat.color.text, "font-medium")
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>

        {/* All posts link */}
        <Link
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileText className="w-4 h-4" />
          View all articles
        </Link>
      </div>
    </aside>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const categoryInfo = getCategoryInfo(category);

  if (!categoryInfo) {
    notFound();
  }

  const { posts } = await getAllCombinedPosts({ category: category as BlogCategory });

  // Structured data
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: categoryInfo.name, url: `/blog/${category}` },
  ]);

  const itemListSchema = getItemListSchema({
    name: `${categoryInfo.name} Articles`,
    description: categoryInfo.description,
    itemListElement: posts.slice(0, 10).map((post) => ({
      name: post.title,
      url: `${config.appUrl}/blog/${category}/${post.slug}`,
    })),
  });

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, itemListSchema]} />

      <CategoryHero categoryInfo={categoryInfo} postCount={posts.length} />

      {/* Posts with sidebar */}
      <section className="container-padding section-padding">
        <div className="max-w-5xl mx-auto flex gap-12">
          {/* Posts grid */}
          <div className="flex-1 space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No articles in this category yet.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-foreground hover:text-foreground/80"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to all articles
                </Link>
              </div>
            ) : (
              posts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} index={index} />
              ))
            )}
          </div>

          {/* Sidebar */}
          <CategorySidebar currentCategory={category} />
        </div>
      </section>

      {CATEGORY_HUB_LINKS[category] && (() => {
        const link = CATEGORY_HUB_LINKS[category]!;
        return (
          <section className="container-padding pb-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-muted-foreground text-sm">
                {link.cta}{" "}
                <Link href={link.href} className="text-primary font-medium underline hover:text-primary/80">
                  {link.label}
                </Link>
                {" "}or{" "}
                <Link href="/contact" className="text-primary font-medium underline hover:text-primary/80">
                  get a quote
                </Link>.
              </p>
            </div>
          </section>
        );
      })()}

      <CTASection />
    </>
  );
}
