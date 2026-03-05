import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Robots.txt Generator | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Robots.txt Generator",
    description: "Generate valid robots.txt with framework presets",
    features: ["CMS Presets", "AI Bot Rules", "Instant Export"],
  });
}
