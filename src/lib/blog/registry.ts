/**
 * Blog Registry - Data Access Layer
 *
 * Follows the DAL pattern from CLAUDE.md with hardcoded data.
 * All functions are synchronous since data is in-memory.
 */
import "server-only";

import type {
  BlogPost,
  BlogPostMetadata,
  BlogCategory,
  BlogQueryOptions,
  BlogListResult,
  CategoryInfo,
} from "./types";

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================
export const categories: CategoryInfo[] = [
  {
    slug: "seo",
    name: "SEO",
    description:
      "Search engine optimization strategies, technical SEO guides, and ranking tactics to dominate organic search.",
    color: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
    },
  },
];

// ============================================================================
// POST STORAGE (populated by content/blog/index.ts)
// ============================================================================
let allPosts: BlogPost[] = [];
let postsByCategory: Record<BlogCategory, BlogPost[]> = {
  seo: [],
};
const postBySlug: Map<string, BlogPost> = new Map();
const postByCategorySlug: Map<string, BlogPost> = new Map();

/**
 * Initialize the registry with posts from content/blog
 * Called once during module initialization
 */
export function initializeRegistry(posts: BlogPost[]) {
  allPosts = posts.toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Reset category map
  postsByCategory = {
    seo: [],
  };

  // Populate indexes
  for (const post of allPosts) {
    postsByCategory[post.category].push(post);
    postBySlug.set(post.slug, post);
    postByCategorySlug.set(`${post.category}/${post.slug}`, post);
  }
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all posts with optional filtering
 */
export function getAllPosts(options: BlogQueryOptions = {}): BlogListResult {
  let posts = [...allPosts];

  // Filter by category
  if (options.category) {
    posts = posts.filter((p) => p.category === options.category);
  }

  // Filter by author
  if (options.authorSlug) {
    posts = posts.filter((p) => p.author.slug === options.authorSlug);
  }

  // Filter by tag
  if (options.tag) {
    const tagLower = options.tag.toLowerCase();
    posts = posts.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === tagLower)
    );
  }

  // Filter featured
  if (options.featured !== undefined) {
    posts = posts.filter((p) => p.featured === options.featured);
  }

  // Exclude specific slugs
  if (options.excludeSlugs?.length) {
    const excludeSet = new Set(options.excludeSlugs);
    posts = posts.filter((p) => !excludeSet.has(p.slug));
  }

  const total = posts.length;

  // Apply pagination
  const offset = options.offset ?? 0;
  const limit = options.limit ?? posts.length;
  posts = posts.slice(offset, offset + limit);

  return {
    posts: posts.map(stripContent),
    total,
    hasMore: offset + posts.length < total,
  };
}

/**
 * Get a single post by category and slug
 */
export function getPost(
  category: BlogCategory,
  slug: string
): BlogPost | null {
  return postByCategorySlug.get(`${category}/${slug}`) ?? null;
}

/**
 * Get a post by slug only (for backward compatibility / redirects)
 */
export function getPostBySlug(slug: string): BlogPost | null {
  return postBySlug.get(slug) ?? null;
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(limit = 3): BlogPostMetadata[] {
  return getAllPosts({ featured: true, limit }).posts;
}

/**
 * Get latest posts
 */
export function getLatestPosts(limit = 6): BlogPostMetadata[] {
  return getAllPosts({ limit }).posts;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(
  category: BlogCategory,
  limit?: number
): BlogPostMetadata[] {
  return getAllPosts({ category, limit }).posts;
}

/**
 * Get related posts based on tags and category
 */
export function getRelatedPosts(
  currentSlug: string,
  limit = 3
): BlogPostMetadata[] {
  const current = postBySlug.get(currentSlug);
  if (!current) return [];

  // Score posts by relevance
  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      let score = 0;

      // Same category = high relevance
      if (post.category === current.category) score += 5;

      // Shared tags
      const sharedTags = post.tags.filter((t) =>
        current.tags.some((ct) => ct.toLowerCase() === t.toLowerCase())
      );
      score += sharedTags.length * 2;

      // Manual override has highest priority
      if (current.relatedSlugs?.includes(post.slug)) score += 10;

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ post }) => stripContent(post));
}

/**
 * Get all unique tags with counts
 */
export function getAllTags(): Array<{ tag: string; count: number }> {
  const tagCounts = new Map<string, number>();

  for (const post of allPosts) {
    for (const tag of post.tags) {
      const normalized = tag.toLowerCase();
      tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get category info by slug
 */
export function getCategoryInfo(slug: string): CategoryInfo | null {
  return categories.find((c) => c.slug === slug) ?? null;
}

/**
 * Check if category slug is valid
 */
export function isValidCategory(slug: string): slug is BlogCategory {
  return categories.some((c) => c.slug === slug);
}

/**
 * Get all category/slug combinations for generateStaticParams
 */
export function getAllPostParams(): Array<{
  category: BlogCategory;
  slug: string;
}> {
  return allPosts.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

/**
 * Get all category slugs for generateStaticParams
 */
export function getAllCategoryParams(): Array<{ category: BlogCategory }> {
  return categories.map((c) => ({ category: c.slug }));
}

/**
 * Get total post count
 */
export function getTotalPostCount(): number {
  return allPosts.length;
}

/**
 * Get post count by category
 */
export function getPostCountByCategory(category: BlogCategory): number {
  return postsByCategory[category]?.length ?? 0;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Strip Content component for listings (reduces memory in lists)
 */
function stripContent(post: BlogPost): BlogPostMetadata {
   
  const { Content: _, ...metadata } = post;
  return metadata;
}
