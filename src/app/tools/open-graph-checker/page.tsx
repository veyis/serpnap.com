/**
 * Tool: Open Graph Checker
 * Path: /tools/open-graph-checker
 * Check OG tags and Twitter Cards for any URL with social media previews.
 */
"use client";

import { useState } from "react";
import {
	Globe,
	ArrowRight,
	Check,
	X,
	AlertTriangle,
	Image as ImageIcon,
	ExternalLink,
	Copy,
	Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { ToolsNav } from "@/components/tools/tools-nav";
import { RelatedResources } from "@/components/tools/related-resources";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

interface OGTags {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: string;
	siteName?: string;
	locale?: string;
}

interface TwitterTags {
	card?: string;
	title?: string;
	description?: string;
	image?: string;
	site?: string;
	creator?: string;
}

interface AnalysisResult {
	url: string;
	pageTitle?: string;
	og: OGTags;
	twitter: TwitterTags;
	issues: string[];
	warnings: string[];
	passed: string[];
}

// ────────────────────────────────────────────────────────────────
// Parser
// ────────────────────────────────────────────────────────────────

function parseHTML(html: string, url: string): AnalysisResult {
	const getMetaContent = (property: string): string | undefined => {
		const regex = new RegExp(
			`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
			"i"
		);
		const match = html.match(regex);
		return match?.[1] || match?.[2] || undefined;
	};

	const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	const pageTitle = titleMatch?.[1]?.trim();

	const og: OGTags = {
		title: getMetaContent("og:title"),
		description: getMetaContent("og:description"),
		image: getMetaContent("og:image"),
		url: getMetaContent("og:url"),
		type: getMetaContent("og:type"),
		siteName: getMetaContent("og:site_name"),
		locale: getMetaContent("og:locale"),
	};

	const twitter: TwitterTags = {
		card: getMetaContent("twitter:card"),
		title: getMetaContent("twitter:title"),
		description: getMetaContent("twitter:description"),
		image: getMetaContent("twitter:image"),
		site: getMetaContent("twitter:site"),
		creator: getMetaContent("twitter:creator"),
	};

	const issues: string[] = [];
	const warnings: string[] = [];
	const passed: string[] = [];

	// OG checks
	if (!og.title) issues.push("Missing og:title — social shares will use the page <title> as fallback");
	else passed.push("og:title is set");

	if (!og.description) issues.push("Missing og:description — social platforms will auto-generate a description");
	else passed.push("og:description is set");

	if (!og.image) issues.push("Missing og:image — shares will appear without an image preview");
	else passed.push("og:image is set");

	if (!og.url) warnings.push("Missing og:url — the canonical URL for social sharing is not specified");
	else passed.push("og:url is set");

	if (!og.type) warnings.push("Missing og:type — defaults to 'website'. Set to 'article' for blog posts");
	else passed.push(`og:type is set to "${og.type}"`);

	if (!og.siteName) warnings.push("Missing og:site_name — helps brand recognition in social previews");
	else passed.push("og:site_name is set");

	// Twitter checks
	if (!twitter.card) warnings.push("Missing twitter:card — Twitter will fall back to 'summary' card type");
	else passed.push(`twitter:card is set to "${twitter.card}"`);

	if (!twitter.title && !og.title) issues.push("No twitter:title or og:title — Twitter shares will have no title");
	else if (twitter.title) passed.push("twitter:title is set");

	if (!twitter.image && !og.image) issues.push("No twitter:image or og:image — Twitter shares will have no image");
	else if (twitter.image) passed.push("twitter:image is set");

	// Image checks
	if (og.image) {
		if (!og.image.startsWith("http")) {
			warnings.push("og:image should be an absolute URL (starting with https://)");
		}
		if (og.image.startsWith("http://")) {
			warnings.push("og:image uses HTTP — should use HTTPS for secure rendering");
		}
	}

	// Title length
	const socialTitle = og.title || twitter.title || pageTitle || "";
	if (socialTitle.length > 95) {
		warnings.push(`Social title is ${socialTitle.length} characters — may be truncated (keep under 95)`);
	}

	// Description length
	const socialDesc = og.description || twitter.description || "";
	if (socialDesc.length > 200) {
		warnings.push(`Social description is ${socialDesc.length} characters — may be truncated (keep under 200)`);
	}

	return { url, pageTitle, og, twitter, issues, warnings, passed };
}

// ────────────────────────────────────────────────────────────────
// Tag Row Component
// ────────────────────────────────────────────────────────────────

function TagRow({ label, value }: { label: string; value?: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!value) return;
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="flex items-start gap-3 py-2.5 border-b border-(--seo-border-subtle) last:border-0">
			<code className="text-[11.5px] font-mono text-(--seo-accent) bg-(--seo-accent)/10 px-2 py-0.5 rounded shrink-0 mt-0.5">
				{label}
			</code>
			{value ? (
				<div className="flex-1 flex items-start gap-2 min-w-0">
					<span className="text-[13px] text-(--seo-text) break-all leading-relaxed">
						{value}
					</span>
					<button
						onClick={handleCopy}
						className="shrink-0 p-1 rounded hover:bg-(--seo-surface-hover) transition-colors mt-0.5"
					>
						{copied ? (
							<Check className="h-3 w-3 text-emerald-500" />
						) : (
							<Copy className="h-3 w-3 text-(--seo-text-faint)" />
						)}
					</button>
				</div>
			) : (
				<span className="text-[13px] text-(--seo-text-faint) italic">
					Not set
				</span>
			)}
		</div>
	);
}

// ────────────────────────────────────────────────────────────────
// Social Preview Component
// ────────────────────────────────────────────────────────────────

function SocialPreview({
	platform,
	title,
	description,
	image,
	url,
	siteName,
}: {
	platform: "Facebook" | "Twitter" | "LinkedIn";
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	siteName?: string;
}) {
	const displayTitle = title || "No title set";
	const displayDesc = description || "No description set";
	const displayDomain = url
		? new URL(url).hostname
		: siteName || "example.com";

	return (
		<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) overflow-hidden">
			<div className="px-4 py-2.5 border-b border-(--seo-border-subtle)">
				<span className="text-[11px] font-semibold uppercase tracking-wider text-(--seo-text-faint)">
					{platform} Preview
				</span>
			</div>
			<div className="p-3">
				<div className="rounded-lg border border-(--seo-border-subtle) overflow-hidden bg-(--seo-bg)">
					{/* Image */}
					{image ? (
						<div className="relative w-full aspect-[1.91/1] bg-(--seo-surface-hover)">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={image}
								alt="OG Preview"
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = "none";
								}}
							/>
						</div>
					) : (
						<div className="w-full aspect-[1.91/1] bg-(--seo-surface-hover) flex items-center justify-center">
							<ImageIcon className="h-8 w-8 text-(--seo-text-faint)" />
						</div>
					)}
					{/* Text */}
					<div className="p-3">
						<p className="text-[11px] text-(--seo-text-faint) uppercase">
							{displayDomain}
						</p>
						<p className="text-[14px] font-semibold text-(--seo-text) mt-1 line-clamp-2 leading-snug">
							{displayTitle}
						</p>
						{platform !== "Twitter" && (
							<p className="text-[12.5px] text-(--seo-text-muted) mt-1 line-clamp-2 leading-relaxed">
								{displayDesc}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// ────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────

export default function OpenGraphCheckerPage() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setResult(null);

		let targetUrl = url.trim();
		if (!targetUrl) return;
		if (!/^https?:\/\//i.test(targetUrl)) {
			targetUrl = `https://${targetUrl}`;
		}

		try {
			new URL(targetUrl);
		} catch {
			setError("Please enter a valid URL");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`/api/seo/analyze?url=${encodeURIComponent(targetUrl)}&type=og`,
				{ method: "GET" }
			);

			if (!response.ok) {
				// Fallback: try fetching directly via a proxy approach
				const proxyResponse = await fetch(targetUrl);
				const html = await proxyResponse.text();
				setResult(parseHTML(html, targetUrl));
				return;
			}

			const data = await response.json();
			if (data.html) {
				setResult(parseHTML(data.html, targetUrl));
			} else {
				setError("Could not fetch the page. Please check the URL and try again.");
			}
		} catch {
			// Client-side parsing fallback
			try {
				const corsProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
				const response = await fetch(corsProxy);
				const html = await response.text();
				setResult(parseHTML(html, targetUrl));
			} catch {
				setError(
					"Could not fetch this URL. The site may block external requests. Try a publicly accessible page."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const socialTitle = result?.og.title || result?.twitter.title || result?.pageTitle;
	const socialDesc = result?.og.description || result?.twitter.description;
	const socialImage = result?.og.image || result?.twitter.image;
	const socialUrl = result?.og.url || result?.url;

	return (
		<div className="min-h-screen bg-(--seo-bg)">
			{/* Hero */}
			<section className="pt-12 sm:pt-16 pb-8 px-4 sm:px-6">
				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-(--seo-surface) border border-(--seo-border-subtle) mb-6">
						<Globe className="h-3.5 w-3.5 text-(--seo-accent)" />
						<span className="text-[12px] font-medium text-(--seo-text-muted)">
							Free Tool — No Signup Required
						</span>
					</div>
					<h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-(--seo-text) leading-tight">
						Open Graph Checker
					</h1>
					<p className="mt-3 text-[15px] text-(--seo-text-muted) max-w-lg mx-auto leading-relaxed">
						Preview how your pages look when shared on Facebook, Twitter/X,
						LinkedIn, and Slack. Check all OG and Twitter Card meta tags.
					</p>
				</div>
			</section>

			{/* URL Input */}
			<section className="px-4 sm:px-6 pb-8">
				<div className="max-w-2xl mx-auto">
					<form onSubmit={handleSubmit} className="flex gap-3">
						<div className="flex-1 relative">
							<Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-(--seo-text-faint)" />
							<input
								type="text"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								placeholder="Enter any URL (e.g., example.com)"
								className="w-full h-12 pl-11 pr-4 rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) text-[14px] text-(--seo-text) placeholder:text-(--seo-text-faint) focus:outline-none focus:ring-2 focus:ring-(--seo-accent)/20 focus:border-(--seo-accent)/40 transition-all"
							/>
						</div>
						<Button
							type="submit"
							disabled={loading || !url.trim()}
							className="h-12 px-6 rounded-xl"
						>
							{loading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<>
									Check
									<ArrowRight className="h-4 w-4 ml-1.5" />
								</>
							)}
						</Button>
					</form>
					{error && (
						<p className="mt-3 text-[13px] text-red-500 flex items-center gap-2">
							<AlertTriangle className="h-3.5 w-3.5" />
							{error}
						</p>
					)}
				</div>
			</section>

			{/* Results */}
			<AnimatePresence>
				{result && (
					<motion.section
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="px-4 sm:px-6 pb-16"
					>
						<div className="max-w-4xl mx-auto space-y-8">
							{/* Score Summary */}
							<div className="grid grid-cols-3 gap-4">
								<div className={cn(
									"rounded-xl border p-4 text-center",
									result.issues.length === 0
										? "border-emerald-500/30 bg-emerald-500/5"
										: "border-red-500/30 bg-red-500/5"
								)}>
									<p className="text-[24px] font-bold">{result.issues.length}</p>
									<p className="text-[11px] text-(--seo-text-faint) uppercase tracking-wider">Errors</p>
								</div>
								<div className={cn(
									"rounded-xl border p-4 text-center",
									result.warnings.length === 0
										? "border-emerald-500/30 bg-emerald-500/5"
										: "border-amber-500/30 bg-amber-500/5"
								)}>
									<p className="text-[24px] font-bold">{result.warnings.length}</p>
									<p className="text-[11px] text-(--seo-text-faint) uppercase tracking-wider">Warnings</p>
								</div>
								<div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
									<p className="text-[24px] font-bold">{result.passed.length}</p>
									<p className="text-[11px] text-(--seo-text-faint) uppercase tracking-wider">Passed</p>
								</div>
							</div>

							{/* Issues & Warnings */}
							{(result.issues.length > 0 || result.warnings.length > 0) && (
								<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5 space-y-3">
									{result.issues.map((issue) => (
										<div key={issue} className="flex items-start gap-3">
											<X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
											<p className="text-[13px] text-(--seo-text) leading-relaxed">{issue}</p>
										</div>
									))}
									{result.warnings.map((warning) => (
										<div key={warning} className="flex items-start gap-3">
											<AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
											<p className="text-[13px] text-(--seo-text-muted) leading-relaxed">{warning}</p>
										</div>
									))}
									{result.passed.map((pass) => (
										<div key={pass} className="flex items-start gap-3">
											<Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
											<p className="text-[13px] text-(--seo-text-muted) leading-relaxed">{pass}</p>
										</div>
									))}
								</div>
							)}

							{/* Social Previews */}
							<div>
								<h2 className="text-[15px] font-semibold text-(--seo-text) mb-4">
									Social Media Previews
								</h2>
								<div className="grid md:grid-cols-2 gap-4">
									<SocialPreview
										platform="Facebook"
										title={socialTitle}
										description={socialDesc}
										image={socialImage}
										url={socialUrl}
										siteName={result.og.siteName}
									/>
									<SocialPreview
										platform="Twitter"
										title={result.twitter.title || socialTitle}
										description={result.twitter.description || socialDesc}
										image={result.twitter.image || socialImage}
										url={socialUrl}
										siteName={result.og.siteName}
									/>
									<SocialPreview
										platform="LinkedIn"
										title={socialTitle}
										description={socialDesc}
										image={socialImage}
										url={socialUrl}
										siteName={result.og.siteName}
									/>
								</div>
							</div>

							{/* Extracted Tags */}
							<div className="grid md:grid-cols-2 gap-6">
								<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5">
									<h3 className="text-[13px] font-semibold text-(--seo-text) mb-3 flex items-center gap-2">
										<Globe className="h-3.5 w-3.5" />
										Open Graph Tags
									</h3>
									<div className="divide-y divide-(--seo-border-subtle)">
										<TagRow label="og:title" value={result.og.title} />
										<TagRow label="og:description" value={result.og.description} />
										<TagRow label="og:image" value={result.og.image} />
										<TagRow label="og:url" value={result.og.url} />
										<TagRow label="og:type" value={result.og.type} />
										<TagRow label="og:site_name" value={result.og.siteName} />
										<TagRow label="og:locale" value={result.og.locale} />
									</div>
								</div>
								<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5">
									<h3 className="text-[13px] font-semibold text-(--seo-text) mb-3 flex items-center gap-2">
										<ExternalLink className="h-3.5 w-3.5" />
										Twitter Card Tags
									</h3>
									<div className="divide-y divide-(--seo-border-subtle)">
										<TagRow label="twitter:card" value={result.twitter.card} />
										<TagRow label="twitter:title" value={result.twitter.title} />
										<TagRow label="twitter:description" value={result.twitter.description} />
										<TagRow label="twitter:image" value={result.twitter.image} />
										<TagRow label="twitter:site" value={result.twitter.site} />
										<TagRow label="twitter:creator" value={result.twitter.creator} />
									</div>
								</div>
							</div>
						</div>
					</motion.section>
				)}
			</AnimatePresence>

			{/* Related Resources */}
			<RelatedResources
				tools={[
					{ href: "/tools/meta-tag-generator", label: "Meta Tag Generator", description: "Generate optimized title tags and meta descriptions with SERP preview." },
					{ href: "/tools/seo-checker", label: "SEO Checker", description: "Full 50+ check SEO audit including meta tag validation." },
					{ href: "/tools/schema-generator", label: "Schema Generator", description: "Create JSON-LD structured data for rich search results." },
				]}
				articles={[
					{ href: "/blog/seo/how-to-write-meta-tags", title: "How to Write Perfect Meta Tags" },
					{ href: "/blog/seo/featured-snippets-rich-results-implementation-guide", title: "Featured Snippets & Rich Results Guide" },
				]}
				glossaryTerms={[
					{ href: "/glossary/what-is-meta-description", term: "Meta Description" },
					{ href: "/glossary/what-is-title-tag", term: "Title Tag" },
					{ href: "/glossary/what-is-schema-markup", term: "Schema Markup" },
					{ href: "/glossary/what-is-rich-snippets", term: "Rich Snippets" },
				]}
			/>

			{/* Tools nav + CTA */}
			<ToolsNav />
			<CTASection />
		</div>
	);
}
