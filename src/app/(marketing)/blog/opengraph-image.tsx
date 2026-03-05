import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Blog | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
	return generateOgImage({
		title: "Blog",
		description: "AI implementation insights, tools & strategies",
		features: ["AI Tools", "Automation", "Voice Agents", "Case Studies"]
	});
}
