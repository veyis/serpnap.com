import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	ArrowRight,
	Check,
	AlertTriangle,
	ArrowLeft,
	Search,
	Globe,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import {
	getBreadcrumbSchema,
	getFAQPageSchema,
	getSoftwareApplicationSchema,
} from "@/lib/utils/seo";
import { config } from "@/lib/config";
import {
	getIndustry,
	getAllIndustrySlugs,
} from "@/lib/data/industries";

interface Props {
	params: Promise<{ industry: string }>;
}

export function generateStaticParams() {
	return getAllIndustrySlugs().map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { industry } = await params;
	const data = getIndustry(industry);
	if (!data) return {};

	return {
		title: data.metaTitle,
		description: data.metaDescription,
		keywords: data.keywords,
		alternates: {
			canonical: `${config.appUrl}/tools/seo-checker/${data.slug}`,
		},
		openGraph: {
			title: data.metaTitle,
			description: data.metaDescription,
			url: `${config.appUrl}/tools/seo-checker/${data.slug}`,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: data.metaTitle,
			description: data.metaDescription,
		},
	};
}

export default async function IndustryPage({ params }: Props) {
	const { industry } = await params;
	const data = getIndustry(industry);
	if (!data) notFound();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Tools", url: `${config.appUrl}/tools` },
		{ name: "SEO Checker", url: `${config.appUrl}/tools/seo-checker` },
		{
			name: `${data.name} SEO`,
			url: `${config.appUrl}/tools/seo-checker/${data.slug}`,
		},
	]);

	const faqSchema = getFAQPageSchema(data.faqs);

	const appSchema = getSoftwareApplicationSchema({
		name: `Free ${data.name} SEO Checker`,
		description: data.metaDescription,
		url: `${config.appUrl}/tools/seo-checker/${data.slug}`,
		applicationCategory: "WebApplication",
		featureList: [
			`${data.name}-specific SEO analysis`,
			"50+ ranking factor checks",
			"AI-powered fix suggestions",
			"Core Web Vitals assessment",
			"Structured data validation",
			"PDF report export",
		],
	});

	return (
		<>
			<MultipleStructuredData
				schemas={[breadcrumbSchema, faqSchema, appSchema]}
			/>
			<Header />
			<main id="main" className="min-h-screen pt-14">
				{/* Hero */}
				<section className="hero-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<Link
								href="/tools/seo-checker"
								className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								SEO Checker
							</Link>
							<div className="text-center">
								<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
									{data.name} SEO
								</p>
								<h1 className="text-hero">{data.heroTitle}</h1>
								<p className="text-subheadline mt-5 max-w-xl mx-auto">
									{data.heroSubtitle}
								</p>
							</div>
						</RevealOnScroll>

						{/* Inline CTA */}
						<RevealOnScroll delay={100}>
							<div className="mt-12 max-w-xl mx-auto">
								<form
									action="/tools/seo-checker"
									className="group relative flex items-center w-full rounded-full border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 overflow-hidden p-[6px]"
								>
									<div className="pl-5 pr-3 text-muted-foreground group-focus-within:text-emerald-500 transition-colors">
										<Globe className="h-[22px] w-[22px]" />
									</div>
									<input
										type="url"
										name="url"
										placeholder={`Enter your ${data.name.toLowerCase()} website URL`}
										required
										className="w-full bg-transparent text-[16px] font-medium outline-none placeholder:text-muted-foreground/60 placeholder:font-normal h-12"
									/>
									<button
										type="submit"
										className="shrink-0 flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full text-[15px] font-semibold tracking-tight transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
									>
										Audit Now
										<ArrowRight className="h-[18px] w-[18px]" />
									</button>
								</form>
								<p className="text-center text-[12.5px] text-muted-foreground/50 mt-4">
									Free, instant, no signup required — 50+ SEO checks
								</p>
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* Why SEO Matters for This Industry */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-4 text-center">
								Why SEO Matters for {data.name}
							</h2>
							<p className="text-[15px] text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
								{data.whyMatters}
							</p>
						</RevealOnScroll>
					</div>
				</section>

				{/* Common Issues */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								Common {data.name} SEO Issues We Detect
							</h2>
						</RevealOnScroll>

						<div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
							{data.commonIssues.map((issue, i) => (
								<RevealOnScroll key={issue} delay={i * 50}>
									<div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/60">
										<AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
										<p className="text-[13.5px] text-muted-foreground leading-relaxed">
											{issue}
										</p>
									</div>
								</RevealOnScroll>
							))}
						</div>
					</div>
				</section>

				{/* Tips */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								{data.name} SEO Tips
							</h2>
						</RevealOnScroll>

						<div className="space-y-6 max-w-2xl mx-auto">
							{data.tips.map((tip, i) => (
								<RevealOnScroll key={tip.title} delay={i * 60}>
									<div className="flex items-start gap-4">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[14px] font-bold text-emerald-600 dark:text-emerald-400">
											{i + 1}
										</div>
										<div>
											<h3 className="text-[15px] font-semibold tracking-tight mb-1.5">
												{tip.title}
											</h3>
											<p className="text-[14px] text-muted-foreground leading-relaxed">
												{tip.description}
											</p>
										</div>
									</div>
								</RevealOnScroll>
							))}
						</div>
					</div>
				</section>

				{/* FAQ */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								{data.name} SEO — FAQ
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
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto text-center">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-4">
								Audit your {data.name.toLowerCase()} site — free
							</h2>
							<p className="text-[15px] text-muted-foreground mb-8">
								50+ checks, AI-powered fixes, instant results. No
								signup required.
							</p>
							<Link
								href="/tools/seo-checker"
								className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-8 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
							>
								<Search className="h-4 w-4" />
								Run Free {data.name} SEO Audit
								<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
							</Link>
						</RevealOnScroll>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
