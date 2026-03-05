import { notFound } from "next/navigation";
import Link from "next/link";
import { CTASection } from "@/components/agency";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getArticleSchema, getSpeakableSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";

// Import from new blog registry
import "@/content/blog"; // Initialize registry
import {
  getPost,
  getRelatedPosts,
  getCategoryInfo,
  getAllPostParams,
  getAllMdxBlogPaths,
  getMdxBlogMetadata,
  mdxBlogExists,
  isValidCategory,
  type BlogCategory,
  type BlogPostMetadata,
} from "@/lib/blog";
import { getAuthorProfileByName, getAuthorSameAs } from "@/lib/blog";
import { BlogLayout } from "@/lib/blog/components/blog-layout";

import type { Metadata } from "next";

const CATEGORY_HUB_LINKS: Partial<Record<string, { href: string; label: string; cta: string }>> = {
  "ai-agents":     { href: "/ai-agents",               label: "Explore AI agents for small business",  cta: "Looking for AI agents for your small business?" },
  "ai-automation": { href: "/services/ai-automation",   label: "Explore AI automation solutions",       cta: "Ready to automate your business with AI?" },
  "ai-voice":      { href: "/services/ai-voice-agents", label: "Explore AI voice agents",               cta: "Looking for AI voice agents for your business?" },
  "ai-tools":      { href: "/ai-tools",                 label: "Browse all AI tools",                   cta: "Looking for the right AI tools for your workflow?" },
  "ai-strategy":   { href: "/ai-agents",                label: "Explore our AI agent services",         cta: "Ready to build your AI strategy?" },
};

// Static generation for all posts (TSX + MDX)
export async function generateStaticParams() {
  // Get TSX post params
  const tsxParams = getAllPostParams();

  // Get MDX post params
  const mdxPaths = await getAllMdxBlogPaths();
  const mdxParams = mdxPaths.map((path) => {
    const parts = path.split("/");
    return {
      category: parts[0] as BlogCategory,
      slug: parts[1],
    };
  });

  // Combine and deduplicate
  const allParams = [...tsxParams, ...mdxParams];
  const seen = new Set<string>();
  return allParams.filter((p) => {
    const key = `${p.category}/${p.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  // Try TSX post first, then MDX
  let post = getPost(category as BlogCategory, slug);

  if (!post && mdxBlogExists(category, slug)) {
    const mdxMetadata = await getMdxBlogMetadata(`${category}/${slug}`);
    if (mdxMetadata) {
      post = { ...mdxMetadata, Content: () => null } as Awaited<ReturnType<typeof getPost>>;
    }
  }

  if (!post) {
    notFound();
  }

  return {
    title: post.seo?.metaTitle || `${post.title} | Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords || post.tags,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `${config.appUrl}/blog/${category}/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${config.appUrl}/blog/${category}/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  // Check for TSX post first
  const tsxPost = getPost(category as BlogCategory, slug);

  // Check for MDX post
  const isMdx = !tsxPost && mdxBlogExists(category, slug);

  let postMetadata: BlogPostMetadata;
  let ContentComponent: React.ComponentType<{ className?: string }> | null = null;
  let MdxContent: React.ComponentType | null = null;

  if (tsxPost) {
    // TSX post - use the Content component
    const { Content, ...metadata } = tsxPost;
    postMetadata = metadata;
    ContentComponent = Content;
  } else if (isMdx) {
    // MDX post - get metadata and dynamically import content
    const mdxMetadata = await getMdxBlogMetadata(`${category}/${slug}`);
    if (!mdxMetadata) {
      notFound();
    }
    postMetadata = mdxMetadata;

    // Dynamically import the MDX file
    try {
      const mdxModule = await import(`@/content/blog/${category}/${slug}.mdx`);
      MdxContent = mdxModule.default;
    } catch {
      notFound();
    }
  } else {
    notFound();
  }

  const categoryInfo = getCategoryInfo(category);
  const relatedPosts = getRelatedPosts(slug, 3);

  // Structured data
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: categoryInfo?.name || category, url: `/blog/${category}` },
    { name: postMetadata.title, url: `/blog/${category}/${slug}` },
  ]);

  // Enrich author schema with E-E-A-T signals from author profiles
  const authorProfile = getAuthorProfileByName(postMetadata.author.name);
  const authorSameAs = authorProfile ? getAuthorSameAs(authorProfile) : undefined;

  const articleSchema = getArticleSchema({
    headline: postMetadata.title,
    description: postMetadata.excerpt,
    datePublished: postMetadata.publishedAt,
    dateModified: postMetadata.updatedAt,
    url: `/blog/${category}/${slug}`,
    author: {
      name: postMetadata.author.name,
      jobTitle: authorProfile?.role || postMetadata.author.role,
      url: `${config.appUrl}/blog/author/${postMetadata.author.slug}`,
      sameAs: authorSameAs,
      knowsAbout: authorProfile?.expertise,
      alumniOf: authorProfile?.education,
    },
    keywords: postMetadata.tags,
    wordCount: postMetadata.readingTimeMinutes * 200, // Estimate based on reading time
  });

  // Speakable schema for voice search optimization
  const speakableSchema = getSpeakableSchema({
    url: `${config.appUrl}/blog/${category}/${slug}`,
    cssSelector: [
      "h1", // Main headline
      "article h2", // Section headings
      "[data-speakable='summary']", // Article summary if present
    ],
  });

  return (
    <>
      <MultipleStructuredData schemas={[breadcrumbSchema, articleSchema, speakableSchema]} />

      <BlogLayout
        post={postMetadata}
        categoryInfo={categoryInfo}
        relatedPosts={relatedPosts}
      >
        {/* Render TSX or MDX content */}
        {ContentComponent && <ContentComponent className="" />}
        {MdxContent && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MdxContent />
          </div>
        )}
      </BlogLayout>

      {/* Explore More — internal link signals for crawl priority */}
      <section className="container-padding py-10 border-t border-foreground/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground/50 uppercase mb-4">
            Explore More
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/blog", label: "All Articles" },
              { href: "/guide", label: "Guides" },
              { href: "/docs", label: "Documentation" },
              { href: "/tools", label: "Free Tools" },
              { href: "/ai-agents", label: "AI Agents" },
              { href: "/ai-tools", label: "AI Tools" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full text-[13px] font-medium text-muted-foreground/70 bg-foreground/5 border border-foreground/5 hover:text-foreground hover:border-foreground/10 transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
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
