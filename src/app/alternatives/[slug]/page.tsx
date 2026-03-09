import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, X, ArrowLeft, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import {
	getAlternative,
	getAllAlternativeSlugs,
} from "@/lib/data/alternatives";

interface Props {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return getAllAlternativeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const data = getAlternative(slug);
	if (!data) return {};

	return {
		title: data.metaTitle,
		description: data.metaDescription,
		keywords: data.keywords,
		alternates: {
			canonical: `${config.appUrl}/alternatives/${data.slug}`,
		},
		openGraph: {
			title: data.metaTitle,
			description: data.metaDescription,
			url: `${config.appUrl}/alternatives/${data.slug}`,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: data.metaTitle,
			description: data.metaDescription,
		},
	};
}

export default async function AlternativePage({ params }: Props) {
	const { slug } = await params;
	const data = getAlternative(slug);
	if (!data) notFound();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Alternatives", url: `${config.appUrl}/alternatives` },
		{
			name: `Free ${data.competitorName} Alternative`,
			url: `${config.appUrl}/alternatives/${data.slug}`,
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
								href="/alternatives"
								className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								All Alternatives
							</Link>
							<div className="text-center">
								<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
									Free Alternative
								</p>
								<h1 className="text-hero">{data.heroTitle}</h1>
								<p className="text-subheadline mt-5 max-w-xl mx-auto">
									{data.heroSubtitle}
								</p>
							</div>
						</RevealOnScroll>

						{/* Price comparison */}
						<RevealOnScroll delay={100}>
							<div className="mt-12 grid sm:grid-cols-2 gap-4">
								<div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/[0.03] p-6 text-center">
									<p className="text-[12px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
										SerpNap
									</p>
									<p className="text-[32px] font-bold tracking-tight">
										$0
									</p>
									<p className="text-[13px] text-muted-foreground mt-1">
										Free forever, no signup
									</p>
								</div>
								<div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center">
									<p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
										{data.competitorName}
									</p>
									<p className="text-[32px] font-bold tracking-tight">
										{data.competitorPrice}
									</p>
									<p className="text-[13px] text-muted-foreground mt-1">
										Paid subscription required
									</p>
								</div>
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* Why Switch */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								Why Switch to SerpNap
							</h2>
						</RevealOnScroll>

						<RevealOnScroll delay={50}>
							<div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/[0.02] p-6 sm:p-8">
								<ul className="space-y-4">
									{data.whySwitch.map((reason) => (
										<li
											key={reason}
											className="flex items-start gap-3"
										>
											<Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
											<span className="text-[14px] text-foreground leading-relaxed">
												{reason}
											</span>
										</li>
									))}
								</ul>
							</div>
						</RevealOnScroll>
					</div>
				</section>

				{/* What You Get vs What You Miss */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-8 text-center">
								What You Get — and What You Don&apos;t
							</h2>
						</RevealOnScroll>

						<div className="grid sm:grid-cols-2 gap-6">
							<RevealOnScroll delay={50}>
								<div className="rounded-2xl border border-emerald-500/20 bg-card/60 p-6 h-full">
									<p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
										What you get with SerpNap (free)
									</p>
									<ul className="space-y-3">
										{data.whatYouGet.map((item) => (
											<li
												key={item}
												className="flex items-start gap-3"
											>
												<Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
												<span className="text-[13.5px] text-muted-foreground leading-relaxed">
													{item}
												</span>
											</li>
										))}
									</ul>
								</div>
							</RevealOnScroll>

							<RevealOnScroll delay={100}>
								<div className="rounded-2xl border border-border/40 bg-card/60 p-6 h-full">
									<p className="text-[13px] font-semibold text-muted-foreground mb-4">
										What you&apos;ll miss from {data.competitorName}
									</p>
									<ul className="space-y-3">
										{data.whatYouMiss.map((item) => (
											<li
												key={item}
												className="flex items-start gap-3"
											>
												<X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
												<span className="text-[13.5px] text-muted-foreground leading-relaxed">
													{item}
												</span>
											</li>
										))}
									</ul>
								</div>
							</RevealOnScroll>
						</div>
					</div>
				</section>

				{/* Verdict */}
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-4 text-center">
								The Verdict
							</h2>
							<p className="text-[15px] text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
								{data.verdict}
							</p>
						</RevealOnScroll>
					</div>
				</section>

				{/* FAQ */}
				<section className="section-padding container-padding bg-muted/20 dark:bg-muted/5">
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
				<section className="section-padding container-padding">
					<div className="container-narrow mx-auto text-center">
						<RevealOnScroll>
							<h2 className="text-[22px] font-semibold tracking-tight mb-4">
								Try SerpNap free — right now
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
			</main>
			<Footer />
		</>
	);
}
