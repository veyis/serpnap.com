import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "HTTP Header Checker | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
	return generateOgImage({
		title: "HTTP Header Checker",
		description: "Inspect server response headers and security configuration",
		features: ["Security Grade", "Header Analysis", "Recommendations"],
	});
}
