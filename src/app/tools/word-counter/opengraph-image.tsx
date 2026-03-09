import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "Word Counter | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
	return generateOgImage({
		title: "Word Counter",
		description: "Count words, characters, sentences and paragraphs instantly",
		features: ["Reading Time", "Character Count", "Top Keywords"],
	});
}
