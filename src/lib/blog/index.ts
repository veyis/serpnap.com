/**
 * Blog Module - Main Exports
 *
 * Central export point for all blog-related types, utilities, and components.
 */

import { cache } from "react";
import type { BlogPostMetadata, BlogListResult, BlogQueryOptions } from "./types";
import { getAllPosts as getTsxPosts, getFeaturedPosts as getTsxFeaturedPosts } from "./registry";
import { getAllMdxBlogPosts } from "./mdx-loader";

// Types
export type {
  BlogCategory,
  BlogAuthor,
  BlogSEO,
  BlogPostMetadata,
  BlogContentProps,
  BlogPost,
  CategoryInfo,
  BlogQueryOptions,
  BlogListResult,
} from "./types";

// Registry & Query Functions
export {
  categories,
  initializeRegistry,
  getAllPosts,
  getPost,
  getPostBySlug,
  getFeaturedPosts,
  getLatestPosts,
  getPostsByCategory,
  getRelatedPosts,
  getAllTags,
  getCategoryInfo,
  isValidCategory,
  getAllPostParams,
  getAllCategoryParams,
  getTotalPostCount,
  getPostCountByCategory,
} from "./registry";

// MDX Loader Functions
export {
  getAllMdxBlogPaths,
  getMdxBlogMetadata,
  getAllMdxBlogPosts,
  getMdxBlogPostsByCategory,
  mdxBlogExists,
  getMdxImportPath,
} from "./mdx-loader";

// ============================================================================
// COMBINED FUNCTIONS (TSX + MDX)
// ============================================================================

/**
 * Get all posts from both TSX and MDX sources combined
 * Sorted by publishedAt date (newest first)
 */
export const getAllCombinedPosts = cache(async (options: BlogQueryOptions = {}): Promise<BlogListResult> => {
  // Get TSX posts
  const tsxResult = getTsxPosts({ ...options, limit: undefined, offset: undefined });

  // Get MDX posts
  let mdxPosts = await getAllMdxBlogPosts();

  // Apply filters to MDX posts
  if (options.authorSlug) {
    mdxPosts = mdxPosts.filter((p) => p.author.slug === options.authorSlug);
  }
  if (options.category) {
    mdxPosts = mdxPosts.filter((p) => p.category === options.category);
  }
  if (options.tag) {
    const tagLower = options.tag.toLowerCase();
    mdxPosts = mdxPosts.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === tagLower)
    );
  }
  if (options.featured !== undefined) {
    mdxPosts = mdxPosts.filter((p) => p.featured === options.featured);
  }
  if (options.excludeSlugs?.length) {
    const excludeSet = new Set(options.excludeSlugs);
    mdxPosts = mdxPosts.filter((p) => !excludeSet.has(p.slug));
  }

  // Combine and deduplicate by slug
  const seen = new Set<string>();
  const combined: BlogPostMetadata[] = [];

  for (const post of [...tsxResult.posts, ...mdxPosts]) {
    if (!seen.has(post.slug)) {
      seen.add(post.slug);
      combined.push(post);
    }
  }

  // Sort by date
  const sorted = combined.toSorted((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const total = sorted.length;

  // Apply pagination
  const offset = options.offset ?? 0;
  const limit = options.limit ?? sorted.length;
  const posts = sorted.slice(offset, offset + limit);

  return {
    posts,
    total,
    hasMore: offset + posts.length < total,
  };
});

/**
 * Get featured posts from both TSX and MDX sources
 */
export const getAllFeaturedPosts = cache(async (limit = 3): Promise<BlogPostMetadata[]> => {
  // Get TSX featured posts
  const tsxFeatured = getTsxFeaturedPosts(limit * 2); // Get more to merge

  // Get MDX featured posts
  const mdxPosts = await getAllMdxBlogPosts();
  const mdxFeatured = mdxPosts.filter((p) => p.featured);

  // Combine, dedupe, and sort
  const seen = new Set<string>();
  const combined: BlogPostMetadata[] = [];

  for (const post of [...tsxFeatured, ...mdxFeatured]) {
    if (!seen.has(post.slug)) {
      seen.add(post.slug);
      combined.push(post);
    }
  }

  const sortedCombined = combined.toSorted((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return sortedCombined.slice(0, limit);
});

// Author Profiles for E-E-A-T
export {
  authorProfiles,
  getAuthorProfile,
  getAuthorProfileByName,
  getAuthorSameAs,
  type AuthorProfile,
} from "./author-profiles";

// Components
export {
  H2,
  H3,
  H4,
  P,
  Strong,
  Em,
  UL,
  OL,
  LI,
  ChecklistItem,
  Link,
  CalloutBox,
  ProTip,
  Blockquote,
  Code,
  CodeBlock,
  Figure,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  HR,
  StatHighlight,
  KeyTakeaway,
} from "./components/prose-components";

export { BlogLayout, RelatedPostsSection } from "./components/blog-layout";
