/**
 * Tool: Word Counter
 * Path: /tools/word-counter
 * Count words, characters, sentences, paragraphs with reading time and top keywords.
 */
"use client";

import { useState, useMemo } from "react";
import {
	Copy,
	Check,
	Trash2,
	FileText,
	Clock,
	Mic,
	Hash,
	AlignLeft,
	Type,
	BarChart3,
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

interface TextStats {
	words: number;
	characters: number;
	charactersNoSpaces: number;
	sentences: number;
	paragraphs: number;
	readingTime: string;
	speakingTime: string;
	avgWordLength: number;
	longestWord: string;
}

interface KeywordEntry {
	word: string;
	count: number;
	density: number;
}

// ────────────────────────────────────────────────────────────────
// Analysis
// ────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
	"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
	"of", "with", "by", "from", "is", "it", "as", "was", "are", "be",
	"has", "had", "have", "this", "that", "these", "those", "i", "you",
	"he", "she", "we", "they", "my", "your", "his", "her", "our", "their",
	"not", "no", "do", "does", "did", "will", "would", "could", "should",
	"can", "may", "might", "if", "so", "than", "then", "also", "just",
	"about", "up", "out", "all", "more", "some", "any", "its", "been",
	"were", "being", "which", "who", "whom", "what", "when", "where",
	"how", "each", "every", "both", "few", "most", "other", "into",
	"over", "after", "before", "between", "under", "again", "there",
	"here", "through", "very", "only", "own", "same", "such", "because",
]);

function analyzeText(text: string): TextStats {
	if (!text.trim()) {
		return {
			words: 0,
			characters: 0,
			charactersNoSpaces: 0,
			sentences: 0,
			paragraphs: 0,
			readingTime: "0 min",
			speakingTime: "0 min",
			avgWordLength: 0,
			longestWord: "",
		};
	}

	const characters = text.length;
	const charactersNoSpaces = text.replace(/\s/g, "").length;
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
	const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1;

	const readingMinutes = Math.ceil(words / 238);
	const speakingMinutes = Math.ceil(words / 150);
	const readingTime = readingMinutes < 1 ? "< 1 min" : `${readingMinutes} min`;
	const speakingTime = speakingMinutes < 1 ? "< 1 min" : `${speakingMinutes} min`;

	const wordList = text.toLowerCase().match(/[a-z']+/g) || [];
	const totalLength = wordList.reduce((sum, w) => sum + w.length, 0);
	const avgWordLength = wordList.length > 0 ? +(totalLength / wordList.length).toFixed(1) : 0;
	const longestWord = wordList.reduce((a, b) => (a.length >= b.length ? a : b), "");

	return {
		words,
		characters,
		charactersNoSpaces,
		sentences,
		paragraphs,
		readingTime,
		speakingTime,
		avgWordLength,
		longestWord,
	};
}

function getTopKeywords(text: string, limit = 10): KeywordEntry[] {
	const wordList = text.toLowerCase().match(/[a-z']{2,}/g) || [];
	const totalWords = wordList.length;
	if (totalWords === 0) return [];

	const freq: Record<string, number> = {};
	for (const word of wordList) {
		if (!STOP_WORDS.has(word)) {
			freq[word] = (freq[word] || 0) + 1;
		}
	}

	return Object.entries(freq)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([word, count]) => ({
			word,
			count,
			density: +((count / totalWords) * 100).toFixed(2),
		}));
}

// ────────────────────────────────────────────────────────────────
// Stat Card
// ────────────────────────────────────────────────────────────────

function StatCard({
	icon: Icon,
	label,
	value,
	sublabel,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | number;
	sublabel?: string;
}) {
	return (
		<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-4">
			<div className="flex items-center gap-2 mb-2">
				<Icon className="h-3.5 w-3.5 text-(--seo-text-muted)" />
				<span className="text-[11px] font-medium uppercase tracking-wider text-(--seo-text-faint)">
					{label}
				</span>
			</div>
			<p className="text-[24px] font-bold tracking-tight text-(--seo-text)">
				{value}
			</p>
			{sublabel && (
				<p className="text-[11px] text-(--seo-text-faint) mt-0.5">{sublabel}</p>
			)}
		</div>
	);
}

// ────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────

export default function WordCounterPage() {
	const [text, setText] = useState("");
	const [copied, setCopied] = useState(false);

	const stats = useMemo(() => analyzeText(text), [text]);
	const keywords = useMemo(() => getTopKeywords(text), [text]);

	const handleCopy = async () => {
		const summary = `Words: ${stats.words}\nCharacters: ${stats.characters}\nCharacters (no spaces): ${stats.charactersNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nReading time: ${stats.readingTime}\nSpeaking time: ${stats.speakingTime}`;
		await navigator.clipboard.writeText(summary);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="min-h-screen bg-(--seo-bg)">
			{/* Hero */}
			<section className="pt-12 sm:pt-16 pb-8 px-4 sm:px-6">
				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-(--seo-surface) border border-(--seo-border-subtle) mb-6">
						<FileText className="h-3.5 w-3.5 text-(--seo-accent)" />
						<span className="text-[12px] font-medium text-(--seo-text-muted)">
							Free Tool — No Signup Required
						</span>
					</div>
					<h1 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-(--seo-text) leading-tight">
						Word Counter
					</h1>
					<p className="mt-3 text-[15px] text-(--seo-text-muted) max-w-lg mx-auto leading-relaxed">
						Count words, characters, sentences, and paragraphs. Get reading time,
						speaking time, and top keyword extraction — instantly.
					</p>
				</div>
			</section>

			{/* Main Interface */}
			<section className="px-4 sm:px-6 pb-16">
				<div className="max-w-4xl mx-auto">
					<div className="grid lg:grid-cols-5 gap-6">
						{/* Left: Text Input */}
						<div className="lg:col-span-3 space-y-4">
							<div className="flex items-center justify-between">
								<label
									htmlFor="text-input"
									className="text-[13px] font-semibold text-(--seo-text)"
								>
									Your text
								</label>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={handleCopy}
										disabled={!text}
										className="text-[12px] h-7 px-2.5"
									>
										{copied ? (
											<Check className="h-3 w-3 mr-1" />
										) : (
											<Copy className="h-3 w-3 mr-1" />
										)}
										{copied ? "Copied" : "Copy stats"}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setText("")}
										disabled={!text}
										className="text-[12px] h-7 px-2.5"
									>
										<Trash2 className="h-3 w-3 mr-1" />
										Clear
									</Button>
								</div>
							</div>
							<textarea
								id="text-input"
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder="Start typing or paste your text here..."
								className="w-full h-[400px] rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-5 text-[14px] text-(--seo-text) leading-relaxed placeholder:text-(--seo-text-faint) focus:outline-none focus:ring-2 focus:ring-(--seo-accent)/20 focus:border-(--seo-accent)/40 resize-none transition-all font-mono"
							/>

							{/* Character Limits Reference */}
							<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-4">
								<p className="text-[11px] font-semibold uppercase tracking-wider text-(--seo-text-faint) mb-3">
									Common character limits
								</p>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
									{[
										{ platform: "Meta Title", limit: 60 },
										{ platform: "Meta Description", limit: 160 },
										{ platform: "Twitter/X", limit: 280 },
										{ platform: "Google Ads Headline", limit: 30 },
										{ platform: "Google Ads Description", limit: 90 },
										{ platform: "LinkedIn Post", limit: 3000 },
									].map((item) => (
										<div
											key={item.platform}
											className={cn(
												"flex items-center justify-between px-3 py-1.5 rounded-lg text-[11.5px]",
												stats.characters > 0 && stats.characters <= item.limit
													? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
													: stats.characters > item.limit
														? "bg-red-500/10 text-red-600 dark:text-red-400"
														: "bg-(--seo-surface-hover) text-(--seo-text-muted)"
											)}
										>
											<span className="font-medium">{item.platform}</span>
											<span>
												{stats.characters}/{item.limit}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Right: Stats (Sticky) */}
						<div className="lg:col-span-2">
							<div className="lg:sticky lg:top-20 space-y-4">
								<AnimatePresence mode="wait">
									<motion.div
										key={stats.words}
										initial={{ opacity: 0.5 }}
										animate={{ opacity: 1 }}
										className="space-y-3"
									>
										<div className="grid grid-cols-2 gap-3">
											<StatCard
												icon={Hash}
												label="Words"
												value={stats.words.toLocaleString()}
											/>
											<StatCard
												icon={Type}
												label="Characters"
												value={stats.characters.toLocaleString()}
												sublabel={`${stats.charactersNoSpaces.toLocaleString()} without spaces`}
											/>
											<StatCard
												icon={AlignLeft}
												label="Sentences"
												value={stats.sentences.toLocaleString()}
											/>
											<StatCard
												icon={FileText}
												label="Paragraphs"
												value={stats.paragraphs.toLocaleString()}
											/>
											<StatCard
												icon={Clock}
												label="Reading Time"
												value={stats.readingTime}
												sublabel="~238 wpm"
											/>
											<StatCard
												icon={Mic}
												label="Speaking Time"
												value={stats.speakingTime}
												sublabel="~150 wpm"
											/>
										</div>

										{/* Extra stats */}
										{text.trim() && (
											<div className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-4 space-y-2">
												<div className="flex justify-between text-[12.5px]">
													<span className="text-(--seo-text-muted)">
														Avg. word length
													</span>
													<span className="font-medium text-(--seo-text)">
														{stats.avgWordLength} chars
													</span>
												</div>
												<div className="flex justify-between text-[12.5px]">
													<span className="text-(--seo-text-muted)">
														Longest word
													</span>
													<span className="font-medium text-(--seo-text) font-mono">
														{stats.longestWord}
													</span>
												</div>
											</div>
										)}
									</motion.div>
								</AnimatePresence>

								{/* Top Keywords */}
								{keywords.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										className="rounded-xl border border-(--seo-border-subtle) bg-(--seo-surface) p-4"
									>
										<div className="flex items-center gap-2 mb-3">
											<BarChart3 className="h-3.5 w-3.5 text-(--seo-text-muted)" />
											<span className="text-[11px] font-semibold uppercase tracking-wider text-(--seo-text-faint)">
												Top Keywords
											</span>
										</div>
										<div className="space-y-1.5">
											{keywords.map((kw, i) => (
												<div
													key={kw.word}
													className="flex items-center gap-3 text-[12.5px]"
												>
													<span className="w-4 text-(--seo-text-faint) text-right font-mono">
														{i + 1}
													</span>
													<span className="flex-1 font-medium text-(--seo-text) font-mono">
														{kw.word}
													</span>
													<span className="text-(--seo-text-muted)">
														{kw.count}x
													</span>
													<span className="text-(--seo-text-faint) w-12 text-right">
														{kw.density}%
													</span>
												</div>
											))}
										</div>
									</motion.div>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Related Resources */}
			<RelatedResources
				tools={[
					{ href: "/tools/keyword-density-checker", label: "Keyword Density Checker", description: "Analyze keyword frequency and detect over-optimization in your content." },
					{ href: "/tools/headline-analyzer", label: "Headline Analyzer", description: "Score your headlines for emotional impact and click-through potential." },
					{ href: "/tools/seo-checker", label: "SEO Checker", description: "Run a full 50+ check SEO audit on any page." },
				]}
				articles={[
					{ href: "/blog/seo/content-quality-seo-strategies-2026", title: "Content Quality & SEO Strategies for 2026" },
					{ href: "/blog/seo/how-to-write-meta-tags", title: "How to Write Perfect Meta Tags" },
				]}
				glossaryTerms={[
					{ href: "/glossary/what-is-keyword-density", term: "Keyword Density" },
					{ href: "/glossary/what-is-keyword-stuffing", term: "Keyword Stuffing" },
					{ href: "/glossary/what-is-on-page-seo", term: "On-Page SEO" },
					{ href: "/glossary/what-is-meta-description", term: "Meta Description" },
				]}
			/>

			{/* Tools nav + CTA */}
			<ToolsNav />
			<CTASection />
		</div>
	);
}
