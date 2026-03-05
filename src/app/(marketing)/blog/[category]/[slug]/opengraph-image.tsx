import { ImageResponse } from "next/og";
import { getPost, getMdxBlogMetadata, mdxBlogExists, getCategoryInfo, type BlogCategory } from "@/lib/blog";
import "@/content/blog"; // Initialize registry

// Note: runtime="edge" removed - incompatible with cacheComponents and Node.js modules
export const alt = "Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Category colors for visual distinction
const categoryColors: Record<string, { bg: string; accent: string }> = {
  seo: { bg: "#0f172a", accent: "#22c55e" },
  "google-ads": { bg: "#0f172a", accent: "#4285f4" },
  "meta-ads": { bg: "#0f172a", accent: "#0668e1" },
  "web-design": { bg: "#0f172a", accent: "#f472b6" },
  "lead-generation": { bg: "#0f172a", accent: "#a855f7" },
  "ai-agents": { bg: "#0f172a", accent: "#06b6d4" },
  analytics: { bg: "#0f172a", accent: "#3b82f6" },
  ga4: { bg: "#0f172a", accent: "#f97316" },
  gtm: { bg: "#0f172a", accent: "#0ea5e9" },
  "linkedin-ads": { bg: "#0f172a", accent: "#0a66c2" },
  "tiktok-ads": { bg: "#0f172a", accent: "#ff0050" },
  "youtube-ads": { bg: "#0f172a", accent: "#ff0000" },
  programmatic: { bg: "#0f172a", accent: "#6366f1" },
  attribution: { bg: "#0f172a", accent: "#8b5cf6" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  // Try TSX post first, then MDX
  let postData: { title: string; author: { name: string; role: string }; readingTimeMinutes: number; category: string } | null = null;

  const tsxPost = getPost(category as BlogCategory, slug);
  if (tsxPost) {
    postData = {
      title: tsxPost.title,
      author: tsxPost.author,
      readingTimeMinutes: tsxPost.readingTimeMinutes,
      category: tsxPost.category,
    };
  } else if (mdxBlogExists(category, slug)) {
    const mdxMetadata = await getMdxBlogMetadata(`${category}/${slug}`);
    if (mdxMetadata) {
      postData = {
        title: mdxMetadata.title,
        author: mdxMetadata.author,
        readingTimeMinutes: mdxMetadata.readingTimeMinutes,
        category: mdxMetadata.category,
      };
    }
  }

  if (!postData) {
    // Fallback for not found
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          SerpNap Blog
        </div>
      ),
      { ...size }
    );
  }

  const colors = categoryColors[category] || { bg: "#0f172a", accent: "#22c55e" };
  const categoryInfo = getCategoryInfo(category);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.bg,
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Accent gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background: `linear-gradient(135deg, transparent 0%, ${colors.accent}15 100%)`,
          }}
        />

        {/* Top bar with category and reading time */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: colors.accent,
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: colors.accent,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {categoryInfo?.name || category.replace(/-/g, " ")}
            </span>
          </div>

          {/* Reading time */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#94a3b8",
              fontSize: "20px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span>{postData.readingTimeMinutes} min read</span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: postData.title.length > 60 ? "48px" : "56px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              margin: 0,
              maxWidth: "90%",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {postData.title}
          </h1>
        </div>

        {/* Bottom bar with author and branding */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Author info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Author avatar placeholder */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {postData.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {postData.author.name}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#94a3b8",
                }}
              >
                {postData.author.role}
              </span>
            </div>
          </div>

          {/* Brand logo/name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                S
              </span>
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              serpnap
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "60px",
            width: "120px",
            height: "4px",
            backgroundColor: colors.accent,
            borderRadius: "2px",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
