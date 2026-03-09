import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	ArrowRight,
	ArrowLeft,
	AlertTriangle,
	Check,
	Wrench,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { ToolsNav } from "@/components/tools/tools-nav";
import { RelatedResources } from "@/components/tools/related-resources";
import {
	getUseCase,
	getAllUseCaseSlugs,
} from "@/lib/data/use-cases";

interface Props {
	params: Promise<{ audience: string }>;
}

export function generateStaticParams() {
	return getAllUseCaseSlugs().map((slug) => ({ audience: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { audience } = await params;
	const data = getUseCase(audience);
	if (!data) return {};

	return {
		title: data.metaTitle,
		description: data.metaDescription,
		keywords: data.keywords,
		alternates: {
			canonical: `${config.appUrl}/for/${data.slug}`,
		},
		openGraph: {
			title: data.metaTitle,
			description: data.metaDescription,
			url: `${config.appUrl}/for/${data.slug}`,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: data.metaTitle,
			description: data.metaDescription,
		},
	};
}

export default async function UseCasePage({ params }: Props) {
	const { audience } = await params;
	const data = getUseCase(audience);
	if (!data) notFound();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Use Cases", url: `${config.appUrl}/for` },
		{
			name: `Free SEO Tools for ${data.audience}`,
			url: `${config.appUrl}/for/${data.slug}`,
		},
	]);

	const faqSchema = getFAQPageSchema(data.faqs);

	return (
		<>
			<MultipleStructuredData schemas={[breadcrumbSchema, faqSchema]} />
			<Header />
			<main id="main" className="min-h-screen pt-14">
				{/* Hero */}
				<section className="hero-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<Link
								href="/for"
								className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								All Use Cases
							</Link>
							<div className="text-center">
								<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
									Free SEO Tools
								</p>
								<h1 className="text-hero">{data.heroTitle}</h1>
								<p className="text-subheadline mt-5 max-w-xl mx-auto">
									{data.heroSubtitle}
								</p>
							</div>
						</RevealOnScroll>

						<RevealOnScroll delay={100}>
							<div className="mt-10 flex justify-center">
								<Link
									href="/tools/seo-checker"
									className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-8 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
								>
									Try Free SEO Checker
									<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
								</Link>
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* Pain Points */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								The Problem {data.audience} Face
							</h2>
						</RevealOnScroll>

						<div className="grid sm:grid-cols-2 gap-4">
							{data.painPoints.map((point, i) => (
								<RevealOnScroll key={point} delay={i * 60}>
									<div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/40 p-5">
										<AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
										<span className="text-[14px] text-muted-foreground leading-relaxed">
											{point}
										</span>
									</div>
								</RevealOnScroll>
							))}
						</div>
					</div>
				</section>

				{/* Recommended Tools */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-3 text-center">
								Recommended Tools for {data.audience}
							</h2>
							<p className="text-[14px] text-muted-foreground text-center mb-8 max-w-lg mx-auto">
								Every tool is free, requires no signup, and works
								instantly in your browser.
							</p>
						</RevealOnScroll>

						<div className="space-y-4">
							{data.recommendedTools.map((tool, i) => (
								<RevealOnScroll key={tool.slug} delay={i * 60}>
									<Link
										href={`/tools/${tool.slug}`}
										className="group flex items-center gap-6 p-6 rounded-2xl border border-border/40 bg-card/40 transition-all duration-300 hover:border-border/70 hover:bg-card hover:shadow-lg"
									>
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 shrink-0">
											<Wrench className="h-5 w-5 text-foreground/60" />
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="text-[15px] font-semibold tracking-tight group-hover:text-foreground transition-colors">
												{tool.name}
											</h3>
											<p className="text-[13.5px] text-muted-foreground leading-relaxed mt-0.5">
												{tool.reason}
											</p>
										</div>
										<ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-foreground/60 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
									</Link>
								</RevealOnScroll>
							))}
						</div>
					</div>
				</section>

				{/* Benefits */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								Why {data.audience} Choose SerpNap
							</h2>
						</RevealOnScroll>

						<RevealOnScroll delay={50}>
							<div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/[0.02] p-6 sm:p-8">
								<ul className="space-y-4">
									{data.benefits.map((benefit) => (
										<li
											key={benefit}
											className="flex items-start gap-3"
										>
											<Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
											<span className="text-[14px] text-foreground leading-relaxed">
												{benefit}
											</span>
										</li>
									))}
								</ul>
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* FAQ */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								Frequently Asked Questions
							</h2>
						</RevealOnScroll>

						<div className="space-y-6 max-w-2xl mx-auto">
							{data.faqs.map((faq, i) => (
								<RevealOnScroll
									key={faq.question}
									delay={i * 60}
								>
									<div>
										<h3 className="text-[15px] font-semibold tracking-tight mb-2">
											{faq.question}
										</h3>
										<p className="text-[14px] text-muted-foreground leading-relaxed">
											{faq.answer}
										</p>
									</div>
								</RevealOnScroll>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto text-center">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-4">
								Start using free SEO tools — right now
							</h2>
							<p className="text-[15px] text-muted-foreground mb-8">
								No signup, no credit card, no trial period. Just
								paste a URL and see the results.
							</p>
							<Link
								href="/tools/seo-checker"
								className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-8 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
							>
								Run Free SEO Audit
								<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
							</Link>
						</RevealOnScroll>
					</div>
				</section>

				{/* Tools Nav */}
				<ToolsNav />
				<RelatedResources />
			</main>
			<Footer />
		</>
	);
}
