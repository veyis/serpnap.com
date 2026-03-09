import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	ArrowRight,
	ArrowLeft,
	Lightbulb,
	CheckCircle2,
	BookOpen,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import {
	getBreadcrumbSchema,
	getFAQPageSchema,
	getHowToSchema,
} from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { getGuide, getAllGuideSlugs } from "@/lib/data/guides";
import { RelatedResources } from "@/components/tools/related-resources";
import { ToolsNav } from "@/components/tools/tools-nav";

interface Props {
	params: Promise<{ action: string }>;
}

export function generateStaticParams() {
	return getAllGuideSlugs().map((action) => ({ action }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { action } = await params;
	const data = getGuide(action);
	if (!data) return {};

	return {
		title: data.metaTitle,
		description: data.metaDescription,
		keywords: data.keywords,
		alternates: {
			canonical: `${config.appUrl}/guides/${data.slug}`,
		},
		openGraph: {
			title: data.metaTitle,
			description: data.metaDescription,
			url: `${config.appUrl}/guides/${data.slug}`,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: data.metaTitle,
			description: data.metaDescription,
		},
	};
}

export default async function GuidePage({ params }: Props) {
	const { action } = await params;
	const data = getGuide(action);
	if (!data) notFound();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Guides", url: `${config.appUrl}/guides` },
		{
			name: `How to ${data.action}`,
			url: `${config.appUrl}/guides/${data.slug}`,
		},
	]);

	const faqSchema = getFAQPageSchema(data.faqs);

	const howToSchema = getHowToSchema({
		name: `How to ${data.action}`,
		description: data.heroSubtitle,
		steps: data.steps.map((step) => ({
			name: step.title,
			text: step.description,
		})),
	});

	return (
		<>
			<MultipleStructuredData
				schemas={[breadcrumbSchema, faqSchema, howToSchema]}
			/>
			<Header />
			<main id="main" className="min-h-screen pt-14">
				{/* Hero */}
				<section className="hero-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<Link
								href="/guides"
								className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								All Guides
							</Link>
							<div className="text-center">
								<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
									Step-by-Step Guide
								</p>
								<h1 className="text-hero">{data.heroTitle}</h1>
								<p className="text-subheadline mt-5 max-w-xl mx-auto">
									{data.heroSubtitle}
								</p>
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* Steps */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								Step-by-Step Instructions
							</h2>
						</RevealOnScroll>

						<div className="space-y-6 max-w-2xl mx-auto">
							{data.steps.map((step, i) => (
								<RevealOnScroll key={step.title} delay={i * 60}>
									<div className="flex gap-5">
										<div className="flex-shrink-0">
											<div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-[14px] font-bold">
												{i + 1}
											</div>
										</div>
										<div className="pt-1">
											<h3 className="text-[15px] font-semibold tracking-tight mb-1.5">
												{step.title}
											</h3>
											<p className="text-[14px] text-muted-foreground leading-relaxed">
												{step.description}
											</p>
										</div>
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
								Ready to {data.action}?
							</h2>
							<p className="text-[15px] text-muted-foreground mb-8">
								Use SerpNap&apos;s {data.toolName} — free, instant,
								no signup required.
							</p>
							<Link
								href={`/tools/${data.toolSlug}`}
								className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-8 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
							>
								Open {data.toolName}
								<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
							</Link>
						</RevealOnScroll>
					</div>
				</section>

				{/* Why It Matters */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<div className="flex items-center justify-center gap-2 mb-4">
								<BookOpen className="h-5 w-5 text-muted-foreground/60" />
								<h2 className="text-[22px] font-semibold tracking-tight text-center">
									Why It Matters
								</h2>
							</div>
							<p className="text-[15px] text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
								{data.whyItMatters}
							</p>
						</RevealOnScroll>
					</div>
				</section>

				{/* Pro Tips */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<div className="flex items-center justify-center gap-2 mb-8">
								<Lightbulb className="h-5 w-5 text-amber-500" />
								<h2 className="text-[22px] font-semibold tracking-tight text-center">
									Pro Tips
								</h2>
							</div>
						</RevealOnScroll>

						<RevealOnScroll delay={50}>
							<div className="rounded-2xl border-2 border-amber-500/20 bg-amber-500/[0.02] p-6 sm:p-8 max-w-2xl mx-auto">
								<ul className="space-y-4">
									{data.proTips.map((tip) => (
										<li
											key={tip}
											className="flex items-start gap-3"
										>
											<CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
											<span className="text-[14px] text-foreground leading-relaxed">
												{tip}
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

				{/* Related Resources */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<RelatedResources
						tools={[
							{
								href: `/tools/${data.toolSlug}`,
								label: data.toolName,
								description: `The free tool referenced in this guide.`,
							},
						]}
					/>
				</section>

				{/* Tools Nav */}
				<section className="section-padding container-padding">
					<ToolsNav />
				</section>
			</main>
			<Footer />
		</>
	);
}
