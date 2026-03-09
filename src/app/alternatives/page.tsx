import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { getAllAlternatives } from "@/lib/data/alternatives";

export const metadata: Metadata = {
	title: "Free SEO Tool Alternatives — Replace Paid Tools with SerpNap",
	description:
		"Replace expensive SEO tools with SerpNap's free alternatives. See what you get for free vs. Semrush, Ahrefs, Moz, Ubersuggest, Screaming Frog, and SEOptimer.",
	keywords: [
		"free seo tool alternative",
		"semrush alternative free",
		"ahrefs alternative free",
		"moz alternative free",
		"ubersuggest alternative",
		"screaming frog alternative",
		"seoptimer alternative",
		"free seo audit tool",
	],
	alternates: {
		canonical: `${config.appUrl}/alternatives`,
	},
	openGraph: {
		title: "Free SEO Tool Alternatives — Replace Paid Tools with SerpNap",
		description:
			"See how SerpNap replaces paid SEO tools for free. Feature-by-feature breakdowns.",
		type: "website",
	},
};

export default function AlternativesPage() {
	const alternatives = getAllAlternatives();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Alternatives", url: `${config.appUrl}/alternatives` },
	]);

	const itemListSchema = getItemListSchema({
		name: "Free SEO Tool Alternatives",
		description:
			"Replace expensive SEO tools with SerpNap's free alternatives.",
		itemListElement: alternatives.map((a) => ({
			name: `Free ${a.competitorName} Alternative`,
			url: `/alternatives/${a.slug}`,
			description: a.metaDescription,
		})),
	});

	return (
		<>
			<MultipleStructuredData
				schemas={[breadcrumbSchema, itemListSchema]}
			/>
			<Header />
			<main id="main" className="min-h-screen pt-14">
				<section className="hero-padding container-padding">
					<div className="container-narrow mx-auto">
						<RevealOnScroll>
							<div className="text-center mb-16">
								<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-4">
									Alternatives
								</p>
								<h1 className="text-hero">
									Replace Paid SEO Tools
								</h1>
								<p className="text-subheadline mt-5 max-w-lg mx-auto">
									See exactly what you get for free with SerpNap
									versus $50–$140+/mo paid tools. Honest breakdowns.
								</p>
							</div>
						</RevealOnScroll>

						{/* Savings banner */}
						<RevealOnScroll delay={50}>
							<div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/[0.03] p-6 sm:p-8 text-center mb-10">
								<p className="text-[13px] text-muted-foreground mb-2">
									Average annual savings when switching to SerpNap
								</p>
								<p className="text-[40px] sm:text-[48px] font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
									$1,400+
								</p>
								<p className="text-[13px] text-muted-foreground/60 mt-1">
									All 13+ tools, forever free, no signup required
								</p>
							</div>
						</RevealOnScroll>

						<div className="space-y-4">
							{alternatives.map((alt, i) => (
								<RevealOnScroll key={alt.slug} delay={i * 80}>
									<Link
										href={`/alternatives/${alt.slug}`}
										className="group flex items-center gap-6 p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/40 transition-all duration-300 hover:border-border/70 hover:bg-card hover:shadow-lg"
									>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-1.5">
												<h2 className="text-[17px] font-semibold tracking-tight group-hover:text-foreground transition-colors">
													Free {alt.competitorName} Alternative
												</h2>
												<span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full shrink-0">
													Save {alt.competitorPrice}
												</span>
											</div>
											<p className="text-[13.5px] text-muted-foreground leading-relaxed">
												{alt.heroSubtitle}
											</p>
										</div>
										<ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-foreground/60 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
									</Link>
								</RevealOnScroll>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
