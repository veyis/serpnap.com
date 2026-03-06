/**
 * Centralized Configuration — SerpNap
 *
 * Single source of truth for all application configuration.
 * Validates environment variables and provides type-safe access.
 */

import { z } from "zod";

const envSchema = z.object({
  // Supabase (optional for build, required at runtime for auth features)
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1).optional(),
  ),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1).optional(),
  ),

  // App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? val.trim() : val,
    z.string().url().optional(),
  ),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Multi-tenant website ID
  AGENCY_WEBSITE_ID: z.string().uuid().optional(),
});

// Parse environment — only throw in production if critical vars are missing
const parsed = envSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV === "production") {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

const env = parsed.success ? parsed.data : (process.env as unknown as z.infer<typeof envSchema>);

const isProd = env.NODE_ENV === "production";
const isDev = env.NODE_ENV === "development";

export const config = {
  appUrl: env.NEXT_PUBLIC_APP_URL || (isProd ? "https://www.serpnap.com" : "http://localhost:3000"),
  isProd,
  isDev,
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  analytics: {
    gaId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  websiteId: env.AGENCY_WEBSITE_ID,
  brand: {
    name: "SerpNap",
    tagline: "Free SEO Tools — Snap Your SEO Into Shape",
    description: "Free, powerful SEO tools to audit, analyze, and optimize your website. Check your SEO score, generate meta tags, validate sitemaps, and more.",
  },
  business: {
    name: "SerpNap",
    legalName: "SerpNap",
    foundingDate: "2026",
    numberOfEmployees: { min: 1, max: 10 },
    address: {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "US",
    },
    contact: {
      email: "hello@serpnap.com",
      phone: "",
    },
    social: {
      twitter: "https://x.com/serpnap",
      linkedin: "https://www.linkedin.com/company/serpnap",
      github: "https://github.com/serpnap",
    },
  },
} as const;
