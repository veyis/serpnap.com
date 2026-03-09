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
	title: "Free SSL Checker — Verify SSL Certificate & Security",
	description:
		"Check any website's SSL certificate, HTTPS status, and security configuration instantly. Detect mixed content, missing HSTS, and get a security grade — free, no signup.",
	keywords: [
		"ssl checker",
		"ssl certificate checker",
		"https checker",
		"ssl test",
		"check ssl certificate",
		"ssl certificate verification",
		"ssl security check",
		"website security checker",
		"ssl certificate status",
		"https test",
		"ssl validator",
	],
	alternates: {
		canonical: `${config.appUrl}/tools/ssl-checker`,
	},
	openGraph: {
		title: "Free SSL Checker — Verify SSL Certificate & Security",
		description:
			"Check any website's SSL certificate, HTTPS status, and security headers instantly. Get a security grade and actionable recommendations.",
		url: `${config.appUrl}/tools/ssl-checker`,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SSL Checker — SSL Certificate & Security Tool",
		description:
			"Verify SSL certificates, detect mixed content, and check HTTPS security headers for any website.",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Tools", url: `${config.appUrl}/tools` },
		{
			name: "SSL Checker",
			url: `${config.appUrl}/tools/ssl-checker`,
		},
	]);

	const appSchema = getSoftwareApplicationSchema({
		name: "Free SSL Checker",
		description:
			"Check SSL certificates, HTTPS status, security headers, and mixed content issues for any website.",
		url: `${config.appUrl}/tools/ssl-checker`,
		applicationCategory: "WebApplication",
		featureList: [
			"SSL certificate status check",
			"HTTPS accessibility verification",
			"HSTS header detection",
			"Mixed content scanning",
			"Secure cookie flag check",
			"CDN and hosting provider detection",
			"Security grade (A+ to F)",
			"Actionable security recommendations",
		],
	});

	const faqSchema = getFAQPageSchema([
		{
			question: "What is an SSL certificate?",
			answer:
				"An SSL (Secure Sockets Layer) certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection. It ensures data transferred between users and the website remains private and secure. Websites with SSL certificates use HTTPS instead of HTTP.",
		},
		{
			question: "Why is SSL important for SEO?",
			answer:
				"Google has confirmed HTTPS as a ranking signal since 2014. Websites without SSL certificates may show 'Not Secure' warnings in browsers, which increases bounce rates and reduces trust. SSL is essential for both security and search engine rankings.",
		},
		{
			question: "What does this SSL checker test?",
			answer:
				"This tool checks whether a website is accessible over HTTPS, detects HSTS (HTTP Strict Transport Security) headers, scans for mixed content issues, verifies secure cookie flags, identifies CDN or hosting providers, and provides an overall security grade from A+ to F with recommendations.",
		},
		{
			question: "What is mixed content and why is it bad?",
			answer:
				"Mixed content occurs when a secure HTTPS page loads resources (images, scripts, stylesheets) over insecure HTTP. This weakens the security of the entire page because attackers could intercept the insecure resources. Browsers may block mixed content or show security warnings.",
		},
		{
			question: "How can I fix SSL certificate issues?",
			answer:
				"Common fixes include: installing a valid SSL certificate from a trusted Certificate Authority, redirecting all HTTP traffic to HTTPS, updating internal links to use HTTPS, enabling HSTS headers, and fixing mixed content by updating resource URLs to use HTTPS.",
		},
	]);

	const howToSchema = getHowToSchema({
		name: "How to Check SSL Certificate Security",
		description:
			"Use the free SerpNap SSL Checker to verify your website's SSL configuration and security.",
		totalTime: "PT30S",
		steps: [
			{
				name: "Enter your website URL",
				text: "Type or paste the website URL you want to check into the input field.",
			},
			{
				name: "Run the SSL check",
				text: "Click the 'Check SSL' button to scan the website for SSL certificate status, security headers, and mixed content issues.",
			},
			{
				name: "Review your security grade",
				text: "Review the security grade, identified issues, and follow the recommendations to improve your website's SSL configuration.",
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
