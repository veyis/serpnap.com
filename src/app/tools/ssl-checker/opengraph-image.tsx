import { generateOgImage, ogImageSize } from "@/lib/og/default-image";

export const alt = "SSL Checker | SerpNap";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
	return generateOgImage({
		title: "SSL Checker",
		description: "Verify SSL certificates, HTTPS status and security headers",
		features: ["Security Grade", "Mixed Content", "HSTS Check"],
	});
}
