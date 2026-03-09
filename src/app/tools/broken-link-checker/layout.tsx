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
	title: "Free Broken Link Checker — Find Dead Links on Any Website",
	description:
		"Scan any webpage for broken links, dead pages, and redirect issues. Get a full report with status codes, anchor text, and fix suggestions — free, no signup.",
	keywords: [
		"broken link checker",
		"dead link checker",
		"broken link finder",
		"check broken links",
		"find dead links",
		"404 checker",
		"link checker tool",
		"broken link checker free",
		"website link checker",
		"broken url checker",
		"dead link finder",
	],
	alternates: {
		canonical: `${config.appUrl}/tools/broken-link-checker`,
	},
	openGraph: {
		title: "Free Broken Link Checker — Find Dead Links on Any Website",
		description:
			"Scan any webpage for broken links, dead pages, and redirect issues. Free, instant results.",
		url: `${config.appUrl}/tools/broken-link-checker`,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Broken Link Checker | SerpNap",
		description:
			"Find broken links on any page. Get status codes, anchor text, and fix suggestions.",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Tools", url: `${config.appUrl}/tools` },
		{
			name: "Broken Link Checker",
			url: `${config.appUrl}/tools/broken-link-checker`,
		},
	]);

	const appSchema = getSoftwareApplicationSchema({
		name: "Free Broken Link Checker",
		description:
			"Scan any webpage for broken links, dead pages, and redirect issues. Get status codes, anchor text, and fix suggestions.",
		url: `${config.appUrl}/tools/broken-link-checker`,
		applicationCategory: "WebApplication",
		featureList: [
			"Scan all links on a page",
			"HTTP status code detection",
			"Redirect chain detection",
			"Anchor text extraction",
			"Internal vs external link classification",
			"Exportable results",
		],
	});

	const faqSchema = getFAQPageSchema([
		{
			question: "What is a broken link?",
			answer:
				"A broken link (also called a dead link) is a hyperlink that points to a page or resource that no longer exists, returning a 404 Not Found or other error status code. Broken links hurt user experience and can negatively impact your SEO rankings.",
		},
		{
			question: "How does the broken link checker work?",
			answer:
				"Enter a URL and the tool fetches the page, extracts all hyperlinks, then checks each link's HTTP status code. Links returning 4xx or 5xx errors are flagged as broken. Redirects (3xx) are also identified so you can update them to point directly to the final destination.",
		},
		{
			question: "Do broken links affect SEO?",
			answer:
				"Yes. Broken links waste crawl budget, create poor user experience, and can cause link equity loss. Google has confirmed that pages with many broken links may be seen as lower quality. Regularly checking and fixing broken links is a key part of technical SEO maintenance.",
		},
		{
			question: "Is this broken link checker free?",
			answer:
				"Yes, completely free with no signup required. Scan any page instantly and get a full report with status codes, anchor text, and link types.",
		},
		{
			question: "How often should I check for broken links?",
			answer:
				"For active websites, check monthly. For large sites with frequently changing content (e-commerce, news), check weekly. After any site migration, redesign, or URL structure change, run a full broken link audit immediately.",
		},
	]);

	const howToSchema = getHowToSchema({
		name: "How to Find Broken Links on Your Website",
		description:
			"Use the free SerpNap Broken Link Checker to scan any page for dead links in seconds.",
		totalTime: "PT1M",
		steps: [
			{
				name: "Enter a URL",
				text: "Paste the URL of the page you want to scan for broken links.",
			},
			{
				name: "Run the scan",
				text: "Click 'Check Links' to scan all hyperlinks on the page. The tool checks each link's HTTP status code.",
			},
			{
				name: "Review and fix",
				text: "Review broken links (4xx/5xx errors) and redirects (3xx). Update or remove broken links to improve SEO and user experience.",
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
