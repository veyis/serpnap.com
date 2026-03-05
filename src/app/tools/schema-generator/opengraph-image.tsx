import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Schema Markup Generator | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Schema Markup Generator",
    description: "Generate JSON-LD structured data for rich snippets",
    features: ["LocalBusiness", "FAQPage", "JSON-LD"],
  });
}
