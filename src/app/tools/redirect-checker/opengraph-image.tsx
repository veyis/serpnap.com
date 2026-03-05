import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Redirect Checker | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage({
    title: "Redirect Checker",
    description: "Trace redirect chains and detect link equity leaks",
    features: ["Chain Tracing", "301/302 Detection", "Status Codes"],
  });
}
