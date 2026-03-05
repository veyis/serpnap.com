import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const score = parseInt(searchParams.get("score") || "0", 10);
  const url = searchParams.get("url") || "example.com";
  const hostname = url.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0];

  // Determine score color and label
  const getScoreConfig = (s: number) => {
    if (s >= 90) return { color: "#10b981", bg: "#10b98120", label: "Excellent", emoji: "🏆" };
    if (s >= 80) return { color: "#10b981", bg: "#10b98120", label: "Great", emoji: "🎉" };
    if (s >= 60) return { color: "#f59e0b", bg: "#f59e0b20", label: "Good", emoji: "👍" };
    return { color: "#ef4444", bg: "#ef444420", label: "Needs Work", emoji: "⚠️" };
  };

  const config = getScoreConfig(score);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        {/* Card Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 80px",
            borderRadius: "32px",
            backgroundColor: "#111111",
            border: "1px solid #333",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
              SerpNap
            </span>
          </div>

          {/* URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              borderRadius: "16px",
              backgroundColor: "#1a1a1a",
              marginBottom: "40px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#666" strokeWidth="2"/>
            </svg>
            <span style={{ fontSize: "28px", color: "#999", fontFamily: "monospace" }}>
              {hostname}
            </span>
          </div>

          {/* Score Circle */}
          <div
            style={{
              position: "relative",
              width: "220px",
              height: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "32px",
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: config.bg,
                filter: "blur(20px)",
              }}
            />
            {/* Circle border */}
            <div
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: `8px solid ${config.color}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0a0a0a",
              }}
            >
              <span
                style={{
                  fontSize: "80px",
                  fontWeight: 800,
                  color: config.color,
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span style={{ fontSize: "20px", color: "#666", marginTop: "4px" }}>
                out of 100
              </span>
            </div>
          </div>

          {/* Label Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              borderRadius: "100px",
              backgroundColor: config.bg,
              border: `2px solid ${config.color}40`,
            }}
          >
            <span style={{ fontSize: "32px" }}>{config.emoji}</span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: config.color,
              }}
            >
              {config.label}
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "40px",
              color: "#666",
              fontSize: "20px",
            }}
          >
            <span>Free SEO Analysis at</span>
            <span style={{ color: "#f97316", fontWeight: 600 }}>serpnap.com/tools/seo-checker</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
