import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { getAllGuides } from "@/lib/data/guides";

export const metadata: Metadata = {
	title: "SEO How-To Guides — Step-by-Step Tutorials with Free Tools",
	description:
		"Learn how to check SEO scores, find broken links, optimize meta tags, test page speed, validate schema markup, and more — with free step-by-step guides and tools.",
	keywords: [
		"how to check seo score",
		"how to find broken links",
		"how to check meta tags",
		"how to test page speed",
		"how to validate schema markup",
		"how to check redirects",
		"how to check keyword density",
		"seo guides",
		"seo tutorials",
	],
	alternates: {
		canonical: `${config.appUrl}/guides`,
	},
	openGraph: {
		title: "SEO How-To Guides — Step-by-Step Tutorials with Free Tools",
		description:
			"Step-by-step SEO guides with free tools. Learn how to audit, optimize, and fix your website.",
		type: "website",
	},
};

export default function GuidesPage() {
	const guides = getAllGuides();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Guides", url: `${config.appUrl}/guides` },
	]);

	const itemListSchema = getItemListSchema({
		name: "SEO How-To Guides",
		description:
			"Step-by-step SEO tutorials with free tools for auditing, optimizing, and fixing your website.",
		itemListElement: guides.map((g) => ({
			name: `How to ${g.action}`,
			url: `/guides/${g.slug}`,
			description: g.metaDescription,
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
									Guides
								</p>
								<h1 className="text-hero">
									SEO How-To Guides
								</h1>
								<p className="text-subheadline mt-5 max-w-lg mx-auto">
									Step-by-step tutorials to audit, optimize,
									and fix your website — each paired with a
									free tool.
								</p>
							</div>
						</RevealOnScroll>

						<div className="space-y-4">
							{guides.map((guide, i) => (
								<RevealOnScroll
									key={guide.slug}
									delay={i * 80}
								>
									<Link
										href={`/guides/${guide.slug}`}
										className="group flex items-center gap-6 p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/40 transition-all duration-300 hover:border-border/70 hover:bg-card hover:shadow-lg"
									>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-1.5">
												<h2 className="text-[17px] font-semibold tracking-tight group-hover:text-foreground transition-colors">
													How to {guide.action}
												</h2>
												<span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full shrink-0">
													Free Tool
												</span>
											</div>
											<p className="text-[13.5px] text-muted-foreground leading-relaxed">
												{guide.heroSubtitle}
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
