/**
 * Blog System Type Definitions
 *
 * Following the project's DAL pattern with hardcoded data.
 * Each blog post is a TSX module that exports metadata and content.
 */

// Category slugs matching the URL structure
export type BlogCategory =
  | "seo";

// Author information
export interface BlogAuthor {
  name: string;
  role: string;
  slug: string;
  avatarUrl?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

// SEO metadata for each post
export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

// Core metadata every post must export
export interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  featured?: boolean;
  seo?: BlogSEO;
  image?: string;
  relatedSlugs?: string[];
}

// Props passed to content components
export interface BlogContentProps {
  className?: string;
}

// Full post including the React content component
export interface BlogPost extends BlogPostMetadata {
  Content: React.ComponentType<BlogContentProps>;
}

// Category metadata for listings
export interface CategoryInfo {
  slug: BlogCategory;
  name: string;
  description: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

// Query options for listing posts
export interface BlogQueryOptions {
  category?: BlogCategory;
  authorSlug?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  excludeSlugs?: string[];
}

// Result type for paginated listings
export interface BlogListResult {
  posts: BlogPostMetadata[];
  total: number;
  hasMore: boolean;
}
