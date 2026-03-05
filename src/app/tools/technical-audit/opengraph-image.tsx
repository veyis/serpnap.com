import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Technical Audit Report | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Technical Audit Report",
    description: "Generate a professional diagnostic report for client presentations",
    features: ["Free Tool", "PDF Export", "Clinical Design"],
  });
}
