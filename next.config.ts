import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isTurboBuild = process.env.TURBO_BUILD === "1";

const nextConfig: NextConfig = {
  reactCompiler: !isTurboBuild,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,

  generateBuildId: async () => {
    return process.env.BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  experimental: {
    optimizePackageImports: isTurboBuild
      ? undefined
      : ["lucide-react"],
  },

  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    const cspHeader = isProd
      ? `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.google-analytics.com https://*.googletagmanager.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self' data:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.google-analytics.com https://*.googletagmanager.com;
        worker-src 'self' blob:;
        upgrade-insecure-requests;
      `
      : `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self' data:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        connect-src 'self' ws://localhost:* http://localhost:* https://*.supabase.co https://*.supabase.in;
        worker-src 'self' blob:;
      `;

    const formattedCsp = cspHeader.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: formattedCsp },
          ...(isProd
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
            : []),
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400" },
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
