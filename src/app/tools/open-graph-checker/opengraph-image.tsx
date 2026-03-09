import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Open Graph Checker | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
	return generateOgImage({
		title: "Open Graph Checker",
		description: "Preview how your pages look when shared on social media",
		features: ["OG Tag Validation", "Social Previews", "Twitter Cards"],
	});
}
