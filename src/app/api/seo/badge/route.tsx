import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const score = parseInt(searchParams.get("score") || "0", 10);
  const style = searchParams.get("style") || "default"; // default, minimal, dark

  // Determine score color
  const getScoreColor = (s: number) => {
    if (s >= 90) return "#10b981"; // emerald
    if (s >= 80) return "#10b981"; // emerald
    if (s >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const color = getScoreColor(score);

  if (style === "minimal") {
    // Minimal badge - just score
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: 700, color }}>
              {score}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>SEO</span>
          </div>
        </div>
      ),
      { width: 100, height: 36 }
    );
  }

  if (style === "dark") {
    // Dark badge
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#18181b",
            borderRadius: "12px",
            padding: "12px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* SerpNap Logo Circle */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            {/* Score */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color }}>
                  {score}
                </span>
                <span style={{ fontSize: "14px", color: "#71717a" }}>/100</span>
              </div>
              <span style={{ fontSize: "10px", color: "#71717a", letterSpacing: "0.5px" }}>
                SEO SCORE
              </span>
            </div>

            {/* Verified Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: `${color}20`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={color}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: 600, color }}>
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      ),
      { width: 280, height: 56 }
    );
  }

  // Default badge
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          padding: "12px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* SerpNap Logo Circle */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          {/* Score */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color }}>
                {score}
              </span>
              <span style={{ fontSize: "14px", color: "#9ca3af" }}>/100</span>
            </div>
            <span style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.5px" }}>
              SEO SCORE
            </span>
          </div>

          {/* Verified by SerpNap */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "#f4f4f5",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#10b981">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: "9px", fontWeight: 600, color: "#10b981" }}>
                VERIFIED
              </span>
            </div>
            <span style={{ fontSize: "9px", color: "#71717a" }}>by SerpNap</span>
          </div>
        </div>
      </div>
    ),
    { width: 280, height: 56 }
  );
}
