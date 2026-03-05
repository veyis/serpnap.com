// Documentation Data Structure - Apple-style hierarchical navigation
// This is the single source of truth for all documentation content

export interface DocSection {
	title: string;
	slug: string;
	icon?: string;
	items: DocItem[];
}

export interface DocItem {
	title: string;
	slug: string;
	description?: string;
	content?: string;
	badge?: "new" | "updated" | "beta";
}

export const docsNavigation: DocSection[] = [
	{
		title: "SEO Guide",
		slug: "seo",
		icon: "sparkles",
		items: [
			{
				title: "Complete Guide",
				slug: "complete-guide",
				description: "Comprehensive guide to Google SEO in 2025",
				badge: "new",
			},
			{
				title: "Search Essentials",
				slug: "search-essentials",
				description: "Core fundamentals of how Google Search works",
			},
			{
				title: "Search Appearance",
				slug: "search-appearance",
				description: "Optimize titles, snippets, and rich results",
				badge: "updated",
			},
			{
				title: "Structured Data",
				slug: "structured-data",
				description: "Schema.org markup for rich results",
			},
			{
				title: "Core Updates & E-E-A-T",
				slug: "core-updates",
				description: "Algorithm updates and quality signals",
			},
			{
				title: "Expert Strategies",
				slug: "expert-strategies",
				description: "Advanced techniques for #1 rankings",
				badge: "new",
			},
		],
	},
	{
		title: "Local SEO",
		slug: "local-seo",
		icon: "mapPin",
		items: [
			{
				title: "Complete Guide",
				slug: "complete-guide",
				description: "Dominate local search and the map pack",
				badge: "new",
			},
			{
				title: "Google Business Profile",
				slug: "google-business-profile",
				description: "Setup, optimization, and features",
				badge: "updated",
			},
			{
				title: "Citations",
				slug: "citations",
				description: "NAP consistency and directory listings",
			},
			{
				title: "Reviews",
				slug: "reviews",
				description: "Getting reviews and reputation management",
				badge: "new",
			},
			{
				title: "Local Content",
				slug: "local-content",
				description: "Landing pages and local schema markup",
			},
			{
				title: "Local Link Building",
				slug: "local-link-building",
				description: "Community links and local partnerships",
			},
		],
	},
];
