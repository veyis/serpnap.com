import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Headline Analyzer | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Headline Analyzer",
    description: "Optimize your headlines for maximum engagement and CTR",
    features: ["AI Powered", "SEO Score", "Emotional Impact"],
  });
}
