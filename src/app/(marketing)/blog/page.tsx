import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema, getSpeakableSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { CTASection } from "@/components/agency";

// Import from new blog registry
import "@/content/blog"; // Initialize registry
import {
  getAllCombinedPosts,
  getAllFeaturedPosts,
  getAllPosts,
  getAllTags,
  getCategoryInfo,
  categories,
  type BlogPostMetadata,
} from "@/lib/blog";

import type { Metadata } from "next";

const POSTS_PER_PAGE = 18;

export const metadata: Metadata = {
  title: "SEO & AI Blog — Guides, Tools & Optimization Strategies",
  description:
    "Expert guides on SEO, AI search optimization, technical SEO, and content strategy. Practical tutorials from SEO practitioners with actionable tips.",
  keywords: [
    "SEO blog",
    "SEO guides",
    "technical SEO blog",
    "AI SEO blog",
    "GEO optimization",
    "free SEO tools blog",
    "SEO tips 2026",
    "content strategy",
  ],
  alternates: {
    canonical: `${config.appUrl}/blog`,
  },
  openGraph: {
    title: "SEO & AI Blog — Guides, Tools & Optimization Strategies",
    description:
      "Expert guides on SEO, AI search optimization, technical SEO, and content strategy. Practical tutorials with actionable tips.",
    type: "website",
    url: `${config.appUrl}/blog`,
  },
  twitter: {
      card: "summary_large_image",
      title: "SEO & AI Blog — Guides, Tools & Optimization Strategies",
      description: "Expert guides on SEO, AI search optimization, technical SEO, and content strategy. Practical tutorials with actionable tips.",
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogHero() {
  return (
    <section className="relative section-padding container-padding pt-32 sm:pt-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/heroes/blog.webp"
          alt="AI Implementation Blog"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12] dark:opacity-[0.2] mix-blend-soft-light"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Blog</span>
        </nav>

        <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
          SEO & AI Blog
        </h1>
        <p className="text-[17px] sm:text-[19px] text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto">
          Expert insights, actionable tips, and proven strategies to help your
          business grow online.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/${category.slug}`}
              className="px-4 py-2 rounded-full text-[13px] font-medium text-muted-foreground/70 bg-foreground/5 border border-foreground/5 hover:border-foreground/5 hover:text-foreground transition-colors duration-300"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPostCard({ post }: { post: BlogPostMetadata }) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <Link
      href={`/blog/${post.category}/${post.slug}`}
      className={cn(
        "group relative flex flex-col p-6 sm:p-8 rounded-[24px] overflow-hidden",
        "bg-linear-to-b from-foreground/5 to-background",
        "border border-foreground/5 hover:border-foreground/5",
        "transition-all duration-700 ease-out shadow-sm hover:shadow-xl"
      )}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          {/* Category */}
          <span className="inline-block text-[12px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em] mb-3">
            {categoryInfo?.name || post.category}
          </span>

          {/* Title */}
          <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-foreground leading-[1.2]">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-[15px] text-muted-foreground/80 mt-3 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-6 text-[13px] font-medium text-muted-foreground/60">
            <span>{formatDate(post.publishedAt)}</span>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <>
                <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                <span className="text-emerald-600 dark:text-emerald-400">Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>{post.readingTimeMinutes} min read</span>
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-foreground/20 group-hover:text-primary transition-colors duration-500 shrink-0 self-center sm:self-start mt-2" />
      </div>
    </Link>
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

  return (
    <Link
      href={`/blog/${post.category}/${post.slug}`}
      className={cn(
        "group relative flex flex-col p-6 sm:p-7 rounded-[22px] overflow-hidden",
        "bg-linear-to-b from-foreground/5 to-background",
        "border border-foreground/5 hover:border-foreground/5",
        "transition-all duration-700 ease-out shadow-sm hover:shadow-lg",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
      {/* Category */}
      <span className="inline-block text-[11px] font-medium text-muted-foreground/50 uppercase tracking-[0.08em] mb-2">
        {categoryInfo?.name || post.category}
      </span>

      {/* Title */}
      <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-foreground leading-[1.3] line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-[14px] text-muted-foreground/70 mt-2 leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between mt-auto pt-5 border-t border-foreground/5">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-muted-foreground/50">
            {post.updatedAt && post.updatedAt !== post.publishedAt
              ? formatDate(post.updatedAt)
              : formatDate(post.publishedAt)}
          </span>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Updated
            </span>
          )}
        </div>
        <span className="text-[12px] font-medium text-muted-foreground/50">
          {post.readingTimeMinutes} min
        </span>
      </div>
      </div>
    </Link>
  );
}

function TagCloud({ tags }: { tags: Array<{ tag: string; count: number }> }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((tagItem) => (
        <Link
          key={tagItem.tag}
          href={`/blog?tag=${encodeURIComponent(tagItem.tag)}`}
          className="px-3 py-1.5 rounded-full text-[13px] text-muted-foreground/60 bg-foreground/5 border border-foreground/5 hover:border-foreground/5 hover:text-muted-foreground transition-colors duration-300"
        >
          {tagItem.tag}
          <span className="ml-1.5 text-muted-foreground/40">
            {tagItem.count}
          </span>
        </Link>
      ))}
    </div>
  );
}

async function FeaturedSection() {
  const featuredPosts = await getAllFeaturedPosts(3);

  if (featuredPosts.length === 0) return null;

  return (
    <section
      className="section-padding container-padding"
      aria-label="Featured Articles"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase mb-6">
          Featured
        </p>
        <div className="space-y-4">
          {featuredPosts.map((post) => (
            <FeaturedPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function AllPostsSection({ page }: { page: number }) {
  const offset = (page - 1) * POSTS_PER_PAGE;
  const { posts, total } = await getAllCombinedPosts({
    limit: POSTS_PER_PAGE,
    offset,
  });
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  if (total === 0) {
    return (
      <section
        className="section-padding container-padding"
        aria-label="All Articles"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase mb-6">
            All Articles
          </p>
          <EmptyBlogState />
        </div>
      </section>
    );
  }

  return (
    <section
      className="section-padding container-padding"
      aria-label="All Articles"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase">
            All Articles
          </p>
          {totalPages > 1 && (
            <p className="text-[13px] text-muted-foreground/50">
              Page {page} of {totalPages}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post, index) => (
            <BlogPostCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </section>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-2 mt-12"
    >
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? "/blog" : `/blog?page=${currentPage - 1}`}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground/30 bg-foreground/5 border border-foreground/5 cursor-not-allowed">
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </span>
      )}

      <span className="px-4 py-2.5 text-[13px] font-medium text-foreground tabular-nums">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 transition-colors"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground/30 bg-foreground/5 border border-foreground/5 cursor-not-allowed">
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      )}
    </nav>
  );
}

function EmptyBlogState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        <FileText className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        New Content Coming Soon
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We're working on expert guides, case studies, and actionable AI
        implementation tips. Subscribe to get notified when we publish new content.
      </p>
    </div>
  );
}

function NewsletterSection() {
  return (
    <section className="section-padding container-padding" aria-label="Newsletter">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[13px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase mb-4">
          Newsletter
        </p>
        <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em] text-foreground leading-[1.2]">
          Get AI insights in your inbox
        </h2>
        <p className="text-muted-foreground/80 mt-3 text-[15px]">
          Join thousands of business owners receiving weekly insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            className="flex-1 px-4 py-3.5 rounded-xl border border-foreground/5 bg-foreground/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 transition-colors"
          />
          <button type="button" className="px-6 py-3.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
            Subscribe
          </button>
        </div>
        <p className="text-[12px] text-muted-foreground/50 mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pageParam = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? pageParam : 1;

  const popularTags = getAllTags().slice(0, 8);
  const { posts: recentPosts } = getAllPosts({ limit: 10 });

  // Structured data
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SerpNap Blog",
    description: "Expert insights on AI implementation for business: chatbots, voice agents, automation, AI tools, and strategies.",
    url: `${config.appUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "SerpNap",
      url: config.appUrl,
    },
  };

  const itemListSchema = getItemListSchema({
    name: "Featured Blog Posts",
    description: "Latest AI implementation insights and strategies for businesses",
    itemListElement: recentPosts.map((post) => ({
      name: post.title,
      url: `/blog/${post.category}/${post.slug}`,
      description: post.excerpt,
    })),
  });

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, blogSchema, itemListSchema, getSpeakableSchema({ url: `${config.appUrl}/blog`, cssSelector: ["h1", "[data-speakable='blog-intro']"] })]} />

      <BlogHero />

      {page === 1 && <FeaturedSection />}

      <AllPostsSection page={page} />

      {page === 1 && popularTags.length > 0 && (
        <section className="container-padding pb-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-[12px] font-medium tracking-widest text-muted-foreground/50 uppercase mb-4">
              Popular Topics
            </p>
            <TagCloud tags={popularTags} />
          </div>
        </section>
      )}

      <NewsletterSection />

      <CTASection />
    </>
  );
}
