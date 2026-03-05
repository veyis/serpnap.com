import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Page Speed Estimator | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Page Speed Estimator",
    description: "Estimate website loading speed and Core Web Vitals",
    features: ["LCP Score", "Performance Tips", "CWV Analysis"],
  });
}
