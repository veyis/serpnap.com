import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Meta Tag Generator | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Meta Tag Generator",
    description: "Generate optimized title tags and meta descriptions",
    features: ["SERP Preview", "Character Count", "SEO Score"],
  });
}
