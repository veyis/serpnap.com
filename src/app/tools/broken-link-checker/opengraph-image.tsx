import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Broken Link Checker | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
	return generateOgImage({
		title: "Broken Link Checker",
		description: "Find dead links, 404 errors, and redirect issues on any page",
		features: ["Status Codes", "Anchor Text", "Fix Suggestions"],
	});
}
