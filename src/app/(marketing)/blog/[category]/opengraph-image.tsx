import { ImageResponse } from "next/og";
import { getCategoryInfo, type BlogCategory } from "@/lib/blog";
import "@/content/blog";

export const alt = "Blog Category | SerpNap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryInfo = getCategoryInfo(category as BlogCategory);
  const colors = categoryColors[category] || { bg: "#0f172a", accent: "#22c55e" };

  const title = categoryInfo?.name || category.replace(/-/g, " ");
  const description = categoryInfo?.description || "Expert insights and strategies";

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
        {/* Gradient overlay */}
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

        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
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
            Blog Category
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Description */}
        <p style={{ fontSize: "24px", color: "#94a3b8", margin: "0 0 40px 0", maxWidth: "70%" }}>
          {description.slice(0, 120)}
          {description.length > 120 ? "..." : ""}
        </p>

        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>S</span>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#fff" }}>serpnap</span>
        </div>

        {/* Accent */}
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
    { ...size }
  );
}
