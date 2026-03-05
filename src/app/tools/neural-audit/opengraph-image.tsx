import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Neural Search Audit | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Neural Search Audit",
    description: "Diagnose your brand visibility in AI search models",
    features: ["Share of Model", "AI Citations", "GEO Strategy"],
  });
}
