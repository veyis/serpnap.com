/**
 * Blog Layout Component
 *
 * Shared layout wrapper for individual blog posts.
 * Provides consistent structure for header, content, and footer sections.
 * Includes sticky Table of Contents for desktop.
 */
"use client";

import Link from "next/link";
import { Calendar, Clock, RefreshCw, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialShareButtons } from "@/components/ui/social-share";
import { config } from "@/lib/config";
import { StickyTableOfContents, TableOfContents } from "@/components/blog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BlogPostMetadata, CategoryInfo } from "../types";

// ============================================================================
// HELPERS
// ============================================================================

function formatDate(dateString: string): string {
  // Parse date-only strings (YYYY-MM-DD) as UTC to avoid timezone-based
  // hydration mismatches between server (UTC) and client (local TZ).
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ============================================================================
// POST HEADER
// ============================================================================

interface PostHeaderProps {
  post: BlogPostMetadata;
  categoryInfo: CategoryInfo | null;
}

function PostHeader({ post, categoryInfo }: PostHeaderProps) {
  const colors = categoryInfo?.color || {
    bg: "bg-muted",
    text: "text-foreground",
    border: "border-border",
  };

  return (
    <header className="section-padding container-padding pt-32 sm:pt-40">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blog">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/blog/${post.category}`}>
                  {categoryInfo?.name || post.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category */}
        <Link
          href={`/blog/${post.category}`}
          className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-medium mb-4",
            colors.bg,
            colors.text,
            "hover:opacity-80 transition-opacity"
          )}
        >
          {categoryInfo?.name || post.category}
        </Link>

        {/* Title */}
        <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold tracking-[-0.03em] text-foreground leading-[1.15]">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-[17px] sm:text-[19px] text-muted-foreground mt-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-8 border-t border-border/50">
          {post.author && (
            <Link
              href={`/blog/author/${post.author.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </Link>
          )}
          {post.publishedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <RefreshCw className="w-4 h-4" />
              <span>Updated {formatDate(post.updatedAt)}</span>
            </div>
          )}
          {post.readingTimeMinutes && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// TAGS AND SHARE
// ============================================================================

interface TagsAndShareProps {
  post: BlogPostMetadata;
}

function TagsAndShare({ post }: TagsAndShareProps) {
  const url = `${config.appUrl}/blog/${post.category}/${post.slug}`;

  return (
    <section className="container-padding pb-16">
      <div className="max-w-3xl mx-auto">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${slugifyTag(tag)}`}
                className="px-3 py-1 rounded-full text-sm bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Share buttons */}
        <div className="pt-6 border-t border-border/50">
          <SocialShareButtons
            title={post.title}
            url={url}
            description={post.excerpt || ""}
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// AUTHOR SECTION
// ============================================================================

interface AuthorSectionProps {
  author: BlogPostMetadata["author"];
}

function AuthorSection({ author }: AuthorSectionProps) {
  if (!author) return null;

  return (
    <section className="container-padding pb-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/blog/author/${author.slug}`}
          className="flex items-center gap-4 p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-[border-color,box-shadow] group"
        >
          {author.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-foreground/60">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium text-foreground group-hover:text-foreground/80 transition-colors">
              {author.name}
            </div>
            {author.role && (
              <div className="text-sm text-muted-foreground">{author.role}</div>
            )}
          </div>
          <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            View profile →
          </div>
        </Link>
      </div>
    </section>
  );
}

// ============================================================================
// RELATED POSTS
// ============================================================================

interface RelatedPostsProps {
  posts: BlogPostMetadata[];
}

export function RelatedPostsSection({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      className="section-padding container-padding bg-muted/30"
      aria-label="Related Articles"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[24px] font-bold tracking-[-0.02em] text-foreground mb-8 text-center">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.category}/${post.slug}`}
              className="group block p-5 rounded-xl border border-border/50 bg-background hover:border-border hover:shadow-sm transition-[border-color,box-shadow]"
            >
              <h3 className="text-[15px] font-semibold text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-[13px] text-muted-foreground mt-2 line-clamp-2">
                {post.excerpt}
              </p>
              {post.readingTimeMinutes && (
                <div className="mt-3 text-xs text-muted-foreground">
                  {post.readingTimeMinutes} min read
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN LAYOUT
// ============================================================================

export interface BlogLayoutProps {
  post: BlogPostMetadata;
  categoryInfo: CategoryInfo | null;
  relatedPosts?: BlogPostMetadata[];
  children: React.ReactNode;
}

export function BlogLayout({
  post,
  categoryInfo,
  relatedPosts = [],
  children,
}: BlogLayoutProps) {
  return (
    <>
      <PostHeader post={post} categoryInfo={categoryInfo} />

      {/* Content with TOC sidebar */}
      <div className="container-padding pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-8">
            {/* Main content */}
            <article className="flex-1 min-w-0 max-w-3xl mx-auto xl:mx-0">
              {/* Mobile TOC - shown at top of article on mobile/tablet */}
              <div className="xl:hidden mb-8">
                <TableOfContents />
              </div>
              {children}
            </article>

            {/* Desktop TOC sidebar */}
            <aside className="hidden xl:block w-64 shrink-0">
              <StickyTableOfContents />
            </aside>
          </div>
        </div>
      </div>

      <TagsAndShare post={post} />
      <AuthorSection author={post.author} />

      {relatedPosts.length > 0 && <RelatedPostsSection posts={relatedPosts} />}
    </>
  );
}

export default BlogLayout;
