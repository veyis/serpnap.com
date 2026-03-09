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
	title: "Free Word Counter — Character, Sentence & Paragraph Counter",
	description:
		"Count words, characters, sentences, and paragraphs instantly. See reading time, speaking time, and readability stats for any text — free, no signup.",
	keywords: [
		"word counter",
		"character counter",
		"word count tool",
		"character count",
		"letter counter",
		"online word counter",
		"free word counter",
		"text counter",
		"paragraph counter",
		"sentence counter",
		"reading time calculator",
	],
	alternates: {
		canonical: `${config.appUrl}/tools/word-counter`,
	},
	openGraph: {
		title: "Free Word Counter — Character, Sentence & Paragraph Counter",
		description:
			"Count words, characters, sentences, and paragraphs instantly. See reading time and readability stats.",
		url: `${config.appUrl}/tools/word-counter`,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Word Counter — Text Analysis Tool",
		description:
			"Count words, characters, sentences, and paragraphs with reading time estimates.",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Tools", url: `${config.appUrl}/tools` },
		{
			name: "Word Counter",
			url: `${config.appUrl}/tools/word-counter`,
		},
	]);

	const appSchema = getSoftwareApplicationSchema({
		name: "Free Word Counter",
		description:
			"Count words, characters, sentences, and paragraphs with reading time and readability stats.",
		url: `${config.appUrl}/tools/word-counter`,
		applicationCategory: "WebApplication",
		featureList: [
			"Word count",
			"Character count (with and without spaces)",
			"Sentence count",
			"Paragraph count",
			"Reading time estimate",
			"Speaking time estimate",
			"Average word length",
			"Top keyword extraction",
		],
	});

	const faqSchema = getFAQPageSchema([
		{
			question: "How does the word counter work?",
			answer:
				"Paste or type your text and get instant counts for words, characters, sentences, and paragraphs. The tool also calculates reading time (based on 238 words per minute) and speaking time (based on 150 words per minute).",
		},
		{
			question: "Does this count characters with or without spaces?",
			answer:
				"Both. The tool shows total characters including spaces and a separate count excluding spaces, so you can use whichever metric you need for platforms like Twitter, Google Ads, or meta descriptions.",
		},
		{
			question: "What is the ideal word count for SEO?",
			answer:
				"There is no universal ideal, but studies show that top-ranking pages average 1,400–2,000 words for competitive keywords. However, quality and relevance matter more than length. Use this tool to check your content meets minimum thresholds for your target topic.",
		},
		{
			question: "Is this word counter free?",
			answer:
				"Yes, completely free with no signup required. Paste any text to get instant word, character, sentence, and paragraph counts with reading time estimates.",
		},
		{
			question: "Can I use this for social media character limits?",
			answer:
				"Absolutely. Use the character count to stay within platform limits: Twitter/X (280 characters), Instagram captions (2,200), LinkedIn posts (3,000), meta titles (60), and meta descriptions (160).",
		},
	]);

	const howToSchema = getHowToSchema({
		name: "How to Count Words in Your Content",
		description:
			"Use the free SerpNap Word Counter to analyze your text in seconds.",
		totalTime: "PT30S",
		steps: [
			{
				name: "Paste your text",
				text: "Copy your content and paste it into the text area, or start typing directly.",
			},
			{
				name: "View instant stats",
				text: "See word count, character count, sentence count, paragraph count, reading time, and speaking time update in real time.",
			},
			{
				name: "Check top keywords",
				text: "Review the most frequently used words in your content to ensure proper keyword focus.",
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
