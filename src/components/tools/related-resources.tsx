"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Wrench, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedTool {
	href: string;
	label: string;
	description: string;
}

interface RelatedArticle {
	href: string;
	title: string;
}

interface RelatedGlossaryTerm {
	href: string;
	term: string;
}

interface RelatedResourcesProps {
	tools?: RelatedTool[];
	articles?: RelatedArticle[];
	glossaryTerms?: RelatedGlossaryTerm[];
}

export function RelatedResources({
	tools,
	articles,
	glossaryTerms,
}: RelatedResourcesProps) {
	const hasContent =
		(tools && tools.length > 0) ||
		(articles && articles.length > 0) ||
		(glossaryTerms && glossaryTerms.length > 0);

	if (!hasContent) return null;

	return (
		<section className="py-12 px-4 sm:px-6">
			<div className="max-w-4xl mx-auto">
				<p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-(--seo-text-faint) mb-6 text-center">
					Related Resources
				</p>

				<div
					className={cn(
						"grid gap-6",
						tools && articles && glossaryTerms
							? "md:grid-cols-3"
							: tools && (articles || glossaryTerms)
								? "md:grid-cols-2"
								: ""
					)}
				>
					{/* Related Tools */}
					{tools && tools.length > 0 && (
						<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5">
							<div className="flex items-center gap-2 mb-4">
								<Wrench className="h-3.5 w-3.5 text-(--seo-accent)" />
								<span className="text-[12px] font-semibold uppercase tracking-wider text-(--seo-text-faint)">
									Related Tools
								</span>
							</div>
							<ul className="space-y-3">
								{tools.map((tool) => (
									<li key={tool.href}>
										<Link
											href={tool.href}
											className="group flex items-start gap-3"
										>
											<ArrowRight className="h-3.5 w-3.5 text-(--seo-text-faint) shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
											<div>
												<span className="text-[13px] font-medium text-(--seo-text) group-hover:text-(--seo-accent) transition-colors">
													{tool.label}
												</span>
												<p className="text-[11.5px] text-(--seo-text-faint) leading-relaxed mt-0.5">
													{tool.description}
												</p>
											</div>
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Related Articles */}
					{articles && articles.length > 0 && (
						<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5">
							<div className="flex items-center gap-2 mb-4">
								<BookOpen className="h-3.5 w-3.5 text-(--seo-accent)" />
								<span className="text-[12px] font-semibold uppercase tracking-wider text-(--seo-text-faint)">
									Learn More
								</span>
							</div>
							<ul className="space-y-2.5">
								{articles.map((article) => (
									<li key={article.href}>
										<Link
											href={article.href}
											className="group flex items-center gap-2.5 text-[13px] text-(--seo-text-muted) hover:text-(--seo-accent) transition-colors"
										>
											<ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
											{article.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Glossary Terms */}
					{glossaryTerms && glossaryTerms.length > 0 && (
						<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5">
							<div className="flex items-center gap-2 mb-4">
								<GraduationCap className="h-3.5 w-3.5 text-(--seo-accent)" />
								<span className="text-[12px] font-semibold uppercase tracking-wider text-(--seo-text-faint)">
									SEO Glossary
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{glossaryTerms.map((term) => (
									<Link
										key={term.href}
										href={term.href}
										className="text-[12px] font-medium text-(--seo-text-muted) bg-(--seo-surface-hover) hover:bg-(--seo-accent)/10 hover:text-(--seo-accent) px-3 py-1.5 rounded-full border border-(--seo-border-subtle) transition-colors"
									>
										{term.term}
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
