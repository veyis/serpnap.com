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
	title: "Free HTTP Header Checker — Inspect Server Response Headers",
	description:
		"Analyze HTTP response headers for any URL. Check security headers like Content-Security-Policy, HSTS, X-Frame-Options, and more — free, no signup required.",
	keywords: [
		"http header checker",
		"response header checker",
		"check http headers",
		"server header analyzer",
		"security header checker",
		"http response headers",
		"content security policy checker",
		"hsts checker",
		"x-frame-options checker",
		"http security headers",
		"header analysis tool",
	],
	alternates: {
		canonical: `${config.appUrl}/tools/http-header-checker`,
	},
	openGraph: {
		title: "Free HTTP Header Checker — Inspect Server Response Headers",
		description:
			"Analyze HTTP response headers for any URL. Check security headers and get actionable recommendations.",
		url: `${config.appUrl}/tools/http-header-checker`,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTTP Header Checker — Security Header Analysis",
		description:
			"Inspect HTTP response headers, check security headers, and get recommendations to harden your site.",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Tools", url: `${config.appUrl}/tools` },
		{
			name: "HTTP Header Checker",
			url: `${config.appUrl}/tools/http-header-checker`,
		},
	]);

	const appSchema = getSoftwareApplicationSchema({
		name: "Free HTTP Header Checker",
		description:
			"Analyze HTTP response headers and security headers for any URL with actionable recommendations.",
		url: `${config.appUrl}/tools/http-header-checker`,
		applicationCategory: "WebApplication",
		featureList: [
			"HTTP response header inspection",
			"Security header analysis",
			"Content-Security-Policy check",
			"Strict-Transport-Security check",
			"X-Frame-Options check",
			"Referrer-Policy check",
			"Permissions-Policy check",
			"Overall security grade (A+ to F)",
		],
	});

	const faqSchema = getFAQPageSchema([
		{
			question: "What are HTTP response headers?",
			answer:
				"HTTP response headers are metadata sent by a web server along with the requested content. They contain information about caching, security policies, content type, server software, and more. Properly configured headers improve security, performance, and SEO.",
		},
		{
			question: "Why are security headers important?",
			answer:
				"Security headers like Content-Security-Policy, Strict-Transport-Security, and X-Frame-Options protect your website and users from attacks such as cross-site scripting (XSS), clickjacking, and man-in-the-middle attacks. Missing security headers leave your site vulnerable.",
		},
		{
			question: "What is a Content-Security-Policy header?",
			answer:
				"Content-Security-Policy (CSP) is an HTTP header that controls which resources the browser is allowed to load for a given page. It helps prevent XSS attacks by specifying approved content sources. A well-configured CSP is one of the most effective security headers you can implement.",
		},
		{
			question: "What is HSTS and why should I enable it?",
			answer:
				"HTTP Strict-Transport-Security (HSTS) tells browsers to only connect to your site over HTTPS, preventing protocol downgrade attacks and cookie hijacking. Once a browser receives the HSTS header, it will automatically use HTTPS for all future requests to your domain.",
		},
		{
			question: "How is the security header grade calculated?",
			answer:
				"The grade is based on the presence and configuration of key security headers: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection, and Cache-Control. Each present header earns points, and the total determines the letter grade from A+ to F.",
		},
	]);

	const howToSchema = getHowToSchema({
		name: "How to Check HTTP Headers for Any Website",
		description:
			"Use the free SerpNap HTTP Header Checker to analyze server response headers in seconds.",
		totalTime: "PT30S",
		steps: [
			{
				name: "Enter the URL",
				text: "Type or paste the URL you want to analyze into the input field.",
			},
			{
				name: "Run the analysis",
				text: "Click 'Check Headers' to fetch and analyze the HTTP response headers and security configuration.",
			},
			{
				name: "Review the results",
				text: "Examine your security grade, individual header statuses, and follow the recommendations to fix any missing or misconfigured headers.",
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
