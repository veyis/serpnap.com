import { ImageResponse } from "next/og";

export const alt = "SerpNap - Free SEO Tools to Audit, Analyze & Optimize Your Website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#171717"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#171717",
              letterSpacing: -1,
            }}
          >
            SerpNap
          </span>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#171717",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 800,
            letterSpacing: -2,
          }}
        >
          Snap Your SEO Into Shape
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#737373",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 650,
            lineHeight: 1.5,
          }}
        >
          Free SEO tools to audit, analyze, and optimize your website. 50+ checks, no signup required.
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["SEO Checker", "Meta Tags", "Schema", "Sitemap", "Speed"].map(
            (tool) => (
              <div
                key={tool}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  fontSize: 16,
                  color: "#525252",
                  fontWeight: 500,
                }}
              >
                {tool}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
