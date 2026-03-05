import { ImageResponse } from "next/og";

export const alt = "Free SEO Checker - Instant Website Analysis | SerpNap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #fbbf24 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "relative",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            padding: 40,
          }}
        >
          {/* Icon placeholder */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              fontSize: 40,
            }}
          >
            SEO
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Free SEO Checker
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              opacity: 0.9,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            Instant Website Analysis
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 40,
              fontSize: 20,
              opacity: 0.8,
            }}
          >
            <span
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 8,
              }}
            >
              Technical SEO
            </span>
            <span
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 8,
              }}
            >
              Meta Tags
            </span>
            <span
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 8,
              }}
            >
              Content
            </span>
            <span
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 8,
              }}
            >
              Structured Data
            </span>
          </div>

          {/* Brand */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              fontSize: 24,
              opacity: 0.7,
            }}
          >
            SerpNap
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
