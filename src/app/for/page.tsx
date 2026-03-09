import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { MultipleStructuredData } from "@/components/seo/structured-data";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/utils/seo";
import { config } from "@/lib/config";
import { getAllUseCases } from "@/lib/data/use-cases";

export const metadata: Metadata = {
	title: "Free SEO Tools for Every Role — Find Your Perfect Toolkit",
	description:
		"Free SEO tools tailored for freelancers, agencies, bloggers, small businesses, developers, and startups. Find the right toolkit for your role and start optimizing today.",
	keywords: [
		"free seo tools",
		"seo tools for freelancers",
		"seo tools for agencies",
		"seo tools for bloggers",
		"seo tools for small business",
		"seo tools for developers",
		"seo tools for startups",
	],
	alternates: {
		canonical: `${config.appUrl}/for`,
	},
	openGraph: {
		title: "Free SEO Tools for Every Role — Find Your Perfect Toolkit",
		description:
			"Free SEO tools tailored for freelancers, agencies, bloggers, small businesses, developers, and startups.",
		type: "website",
	},
};

export default function UseCasesPage() {
	const useCases = getAllUseCases();

	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: "Home", url: config.appUrl },
		{ name: "Use Cases", url: `${config.appUrl}/for` },
	]);

	const itemListSchema = getItemListSchema({
		name: "Free SEO Tools by Role",
		description:
			"Free SEO tools tailored for different roles and use cases.",
		itemListElement: useCases.map((uc) => ({
			name: `Free SEO Tools for ${uc.audience}`,
			url: `/for/${uc.slug}`,
			description: uc.metaDescription,
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
									Use Cases
								</p>
								<h1 className="text-hero">
									Free SEO Tools for Every Role
								</h1>
								<p className="text-subheadline mt-5 max-w-lg mx-auto">
									Find the perfect toolkit for your role.
									Every tool is free, requires no signup, and
									works instantly in your browser.
								</p>
							</div>
						</RevealOnScroll>

						<div className="space-y-4">
							{useCases.map((uc, i) => (
								<RevealOnScroll key={uc.slug} delay={i * 80}>
									<Link
										href={`/for/${uc.slug}`}
										className="group flex items-center gap-6 p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/40 transition-all duration-300 hover:border-border/70 hover:bg-card hover:shadow-lg"
									>
										<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 shrink-0">
											<Users className="h-6 w-6 text-foreground/60" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-1.5">
												<h2 className="text-[17px] font-semibold tracking-tight group-hover:text-foreground transition-colors">
													Free SEO Tools for{" "}
													{uc.audience}
												</h2>
												<span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full shrink-0">
													{uc.recommendedTools.length}{" "}
													tools
												</span>
											</div>
											<p className="text-[13.5px] text-muted-foreground leading-relaxed">
												{uc.heroSubtitle}
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
