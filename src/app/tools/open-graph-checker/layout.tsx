import type { Metadata } from "next";
import { config } from "@/lib/config";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import {
	getBreadcrumbSchema,
	getSoftwareApplicationSchema,
	getFAQPageSchema,
	getHowToSchema,
} from "@/lib/utils/seo";

export const metadata: Metadata = {
	title: "Free Open Graph Checker — Preview Social Media Sharing",
	description:
		"Check Open Graph tags and Twitter Card meta tags for any URL. Preview exactly how your pages look when shared on Facebook, Twitter/X, LinkedIn, and Slack.",
	keywords: [
		"open graph checker",
		"og tag checker",
		"social media preview",
		"twitter card checker",
		"og meta tag tester",
		"facebook share preview",
		"linkedin preview checker",
		"social share debugger",
		"open graph preview",
		"meta tag checker social",
	],
	alternates: {
		canonical: `${config.appUrl}/tools/open-graph-checker`,
	},
	openGraph: {
		title: "Free Open Graph Checker — Social Media Preview Tool",
		description:
			"Preview how your pages look on Facebook, Twitter/X, LinkedIn, and Slack. Check OG tags and Twitter Cards instantly.",
		url: `${config.appUrl}/tools/open-graph-checker`,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Open Graph Checker — Social Preview Tool",
		description:
			"Check Open Graph and Twitter Card tags for any URL. See exactly how your page appears when shared.",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Tools", url: `${config.appUrl}/tools` },
		{
			name: "Open Graph Checker",
			url: `${config.appUrl}/tools/open-graph-checker`,
		},
	]);

	const appSchema = getSoftwareApplicationSchema({
		name: "Free Open Graph Checker",
		description:
			"Check OG tags and Twitter Cards for any URL. Preview social media sharing on Facebook, Twitter/X, LinkedIn, and Slack.",
		url: `${config.appUrl}/tools/open-graph-checker`,
		applicationCategory: "WebApplication",
		featureList: [
			"Open Graph tag extraction",
			"Twitter Card meta tag detection",
			"Facebook share preview",
			"Twitter/X share preview",
			"LinkedIn share preview",
			"Missing tag warnings",
			"Image dimension validation",
			"Structured tag report",
		],
	});

	const faqSchema = getFAQPageSchema([
		{
			question: "What are Open Graph tags?",
			answer:
				"Open Graph (OG) tags are HTML meta tags that control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Slack. They specify the title, description, image, and URL that appear in the social preview card.",
		},
		{
			question: "What is the difference between OG tags and Twitter Cards?",
			answer:
				"OG tags (og:title, og:description, og:image) are used by Facebook, LinkedIn, and most platforms. Twitter Cards (twitter:card, twitter:title, twitter:image) are Twitter/X-specific. Twitter falls back to OG tags if no Twitter Card tags are present, but OG tags don't work in reverse.",
		},
		{
			question: "What image size should I use for OG tags?",
			answer:
				"The recommended OG image size is 1200x630 pixels for Facebook and LinkedIn (1.91:1 ratio). For Twitter summary_large_image cards, use 1200x628 pixels. Always keep file size under 5MB for reliable rendering across platforms.",
		},
		{
			question: "Why does my shared link show the wrong image or title?",
			answer:
				"Social platforms cache OG tag data. After updating your tags, use Facebook's Sharing Debugger, Twitter's Card Validator, or LinkedIn's Post Inspector to clear their cache. Also ensure your tags appear in the <head> before any scripts load.",
		},
		{
			question: "Is this Open Graph checker free?",
			answer:
				"Yes, completely free with no signup required. Enter any URL to instantly extract and preview all Open Graph and Twitter Card meta tags with social media previews.",
		},
	]);

	const howToSchema = getHowToSchema({
		name: "How to Check Open Graph Tags",
		description:
			"Use the free SerpNap Open Graph Checker to preview your social media sharing.",
		totalTime: "PT1M",
		steps: [
			{
				name: "Enter a URL",
				text: "Paste the URL of the page you want to check into the input field.",
			},
			{
				name: "View extracted tags",
				text: "See all Open Graph and Twitter Card meta tags found on the page, with any missing or problematic tags highlighted.",
			},
			{
				name: "Preview social cards",
				text: "See exactly how your page will appear when shared on Facebook, Twitter/X, and LinkedIn.",
			},
			{
				name: "Fix issues",
				text: "Add or update any missing tags in your HTML head section. The tool shows you the exact meta tags to add.",
			},
		],
	});

	return (
		<>
			<MultipleStructuredData
				schemas={[breadcrumbSchema, appSchema, faqSchema, howToSchema]}
			/>
			{children}
		</>
	);
}
