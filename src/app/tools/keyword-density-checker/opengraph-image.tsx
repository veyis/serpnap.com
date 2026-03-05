import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Keyword Density Checker | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Keyword Density Checker",
    description: "Analyze keyword frequency and avoid over-optimization",
    features: ["1-3 Word Phrases", "Density Analysis", "SEO Warnings"],
  });
}
