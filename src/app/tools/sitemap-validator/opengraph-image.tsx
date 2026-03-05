import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Sitemap Validator | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Sitemap Validator",
    description: "Validate XML sitemaps against the protocol spec",
    features: ["11 Checks", "URL Analysis", "Error Report"],
  });
}
