import { config } from "@/lib/config";

/**
 * SoftwareApplication Schema
 *
 * Used for SEO tool pages to show rich results in Google
 */
export function getSoftwareApplicationSchema(app: {
	name: string;
	description: string;
	url: string;
	applicationCategory?: string;
	operatingSystem?: string;
	offers?: {
		price?: string;
		priceCurrency?: string;
	};
	screenshot?: string;
	featureList?: string[];
	authorName?: string;
	authorUrl?: string;
	aggregateRating?: {
		ratingValue: number;
		reviewCount: number;
	};
	datePublished?: string;
	dateModified?: string;
}) {
	const schema: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: app.name,
		description: app.description,
		url: app.url,
		applicationCategory: app.applicationCategory || "WebApplication",
		operatingSystem: app.operatingSystem || "Web Browser",
		datePublished: app.datePublished || "2025-01-15",
		dateModified: app.dateModified || "2026-03-10",
		offers: {
			"@type": "Offer",
			price: app.offers?.price || "0",
			priceCurrency: app.offers?.priceCurrency || "USD",
		},
	};

	if (app.featureList?.length) {
		schema.featureList = app.featureList.join(", ");
	}

	if (app.authorName) {
		schema.author = {
			"@type": "Organization",
			name: app.authorName,
			...(app.authorUrl ? { url: app.authorUrl } : {}),
		};
	}

	if (app.screenshot) {
		schema.screenshot = app.screenshot;
	}

	if (app.aggregateRating) {
		schema.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: app.aggregateRating.ratingValue.toString(),
			reviewCount: app.aggregateRating.reviewCount.toString(),
		};
	}

	return schema;
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(
	items: Array<{ name: string; url: string }>
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url.startsWith("http")
				? item.url
				: `${config.appUrl}${item.url}`,
		})),
	};
}

/**
 * WebSite Schema
 */
export function getWebSiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${config.appUrl}/#website`,
		name: config.brand.name,
		url: config.appUrl,
		description: config.brand.description,
		publisher: {
			"@type": "Organization",
			"@id": `${config.appUrl}/#organization`,
			name: config.brand.name,
		},
		inLanguage: "en-US",
	};
}

/**
 * Organization Schema
 */
export function getOrganizationSchema(options?: {
	address?: Record<string, string>;
	telephone?: string;
	email?: string;
	socialLinks?: string[];
	foundingDate?: string;
	numberOfEmployees?: { min: number; max: number };
}) {
	const schema: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${config.appUrl}/#organization`,
		name: config.brand.name,
		legalName: config.business.legalName,
		url: config.appUrl,
		description: config.brand.description,
		foundingDate: options?.foundingDate || config.business.foundingDate,
		publishingPrinciples: `${config.appUrl}/editorial-policy`,
		knowsAbout: [
			"Search Engine Optimization",
			"SEO Audit",
			"Technical SEO",
			"On-Page SEO",
			"Core Web Vitals",
			"Schema Markup",
			"Meta Tags",
			"Website Performance",
			"E-E-A-T",
			"Generative Engine Optimization",
		],
	};

	if (options?.email) {
		schema.contactPoint = {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: options.email,
			availableLanguage: ["English"],
		};
	}

	if (options?.numberOfEmployees) {
		schema.numberOfEmployees = {
			"@type": "QuantitativeValue",
			minValue: options.numberOfEmployees.min,
			maxValue: options.numberOfEmployees.max,
		};
	}

	if (options?.socialLinks?.length) {
		schema.sameAs = options.socialLinks.filter(Boolean);
	}

	return schema;
}

/**
 * FAQPage Schema
 */
export function getFAQPageSchema(
	faqs: Array<{ question: string; answer: string }>
) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * HowTo Schema
 */
export function getHowToSchema(howTo: {
	name: string;
	description: string;
	steps: Array<{ name: string; text: string }>;
	totalTime?: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: howTo.name,
		description: howTo.description,
		...(howTo.totalTime ? { totalTime: howTo.totalTime } : {}),
		step: howTo.steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.name,
			text: step.text,
		})),
	};
}

/**
 * ServiceProvider Schema (simplified for serpnap)
 */
export function getServiceProviderSchema(_options?: Record<string, unknown>) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: config.brand.name,
		url: config.appUrl,
	};
}

/**
 * ItemList Schema - for blog listing pages
 */
export function getItemListSchema(options: {
	name?: string;
	description?: string;
	itemListElement: Array<{ name: string; url: string; description?: string }>;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		...(options.name ? { name: options.name } : {}),
		...(options.description ? { description: options.description } : {}),
		itemListElement: options.itemListElement.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			url: item.url.startsWith("http")
				? item.url
				: `${config.appUrl}${item.url}`,
		})),
	};
}

/**
 * Speakable Schema - for voice search optimization
 */
export function getSpeakableSchema(options: {
	url: string;
	cssSelector: string[];
}) {
	return {
		"@context": "https://schema.org",
		"@type": "SpeakableSpecification",
		url: options.url,
		cssSelector: options.cssSelector,
	};
}

/**
 * Article Schema - for blog posts
 */
export function getArticleSchema(article: {
	headline: string;
	description: string;
	url: string;
	imageUrl?: string;
	datePublished: string;
	dateModified?: string;
	author: {
		name: string;
		jobTitle?: string;
		url?: string;
		sameAs?: string[];
		knowsAbout?: string[];
		alumniOf?: string[] | Array<{ name: string; url?: string }>;
	};
	keywords?: string[];
	wordCount?: number;
}) {
	const authorSchema: Record<string, unknown> = {
		"@type": "Person",
		name: article.author.name,
	};
	if (article.author.jobTitle) authorSchema.jobTitle = article.author.jobTitle;
	if (article.author.url) authorSchema.url = article.author.url;
	if (article.author.sameAs?.length) authorSchema.sameAs = article.author.sameAs;
	if (article.author.knowsAbout?.length) authorSchema.knowsAbout = article.author.knowsAbout;
	if (article.author.alumniOf?.length) {
		authorSchema.alumniOf = article.author.alumniOf.map((a) => ({
			"@type": "EducationalOrganization",
			...(typeof a === "string" ? { name: a } : { name: a.name, ...(a.url ? { url: a.url } : {}) }),
		}));
	}

	const schema: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.headline,
		description: article.description,
		url: article.url.startsWith("http")
			? article.url
			: `${config.appUrl}${article.url}`,
		datePublished: article.datePublished,
		...(article.dateModified ? { dateModified: article.dateModified } : {}),
		author: authorSchema,
		publisher: {
			"@type": "Organization",
			name: config.brand.name,
			url: config.appUrl,
		},
		isPartOf: {
			"@type": "WebSite",
			"@id": `${config.appUrl}/#website`,
		},
		inLanguage: "en-US",
	};

	if (article.keywords?.length) {
		schema.keywords = article.keywords.join(", ");
	}

	if (article.wordCount) {
		schema.wordCount = article.wordCount;
	}

	return schema;
}
