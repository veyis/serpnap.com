/**
 * Tool: Keyword Density Checker
 * Path: /tools/keyword-density-checker
 * Analyze keyword frequency and density in any text content.
 */
"use client";

import { useState } from "react";
import {
  BarChart3,
  Sparkles,
  Info,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Type,
  Hash,
  Percent,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/agency";
import { ToolsNav } from "@/components/tools/tools-nav";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────
// Analysis engine
// ────────────────────────────────────────────────────────────────

interface KeywordResult {
  word: string;
  count: number;
  density: number;
}

interface AnalysisResult {
  totalWords: number;
  totalCharacters: number;
  totalSentences: number;
  avgWordsPerSentence: number;
  readingTimeMinutes: number;
  singleWords: KeywordResult[];
  twoGrams: KeywordResult[];
  threeGrams: KeywordResult[];
  targetKeywordCount: number;
  targetKeywordDensity: number;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "it", "its",
  "this", "that", "these", "those", "i", "you", "he", "she", "we",
  "they", "me", "him", "her", "us", "them", "my", "your", "his",
  "our", "their", "not", "no", "so", "if", "as", "up", "out", "about",
  "into", "over", "after", "all", "also", "am", "an", "any", "because",
  "before", "between", "both", "each", "few", "get", "got", "how",
  "just", "know", "like", "make", "more", "most", "much", "new", "now",
  "only", "other", "own", "same", "some", "such", "than", "then",
  "there", "through", "too", "very", "what", "when", "where", "which",
  "while", "who", "why", "here", "even", "still", "well", "way",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function analyzeText(text: string, targetKeyword: string): AnalysisResult {
  const words = tokenize(text);
  const totalWords = words.length;
  const totalCharacters = text.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const totalSentences = sentences.length;
  const avgWordsPerSentence =
    totalSentences > 0 ? Math.round(totalWords / totalSentences) : 0;
  const readingTimeMinutes = Math.max(1, Math.round(totalWords / 238));

  // Single word frequency (excluding stop words)
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    if (!STOP_WORDS.has(word) && word.length > 2) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  const singleWords: KeywordResult[] = [...wordCounts.entries()]
    .map(([word, count]) => ({
      word,
      count,
      density: totalWords > 0 ? (count / totalWords) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // N-gram generation
  function getNGrams(n: number): KeywordResult[] {
    const ngrams = new Map<string, number>();
    for (let i = 0; i <= words.length - n; i++) {
      const gram = words.slice(i, i + n).join(" ");
      // Skip grams that are mostly stop words
      const nonStopCount = words
        .slice(i, i + n)
        .filter((w) => !STOP_WORDS.has(w)).length;
      if (nonStopCount >= Math.ceil(n / 2)) {
        ngrams.set(gram, (ngrams.get(gram) || 0) + 1);
      }
    }
    return [...ngrams.entries()]
      .filter(([, count]) => count >= 2)
      .map(([word, count]) => ({
        word,
        count,
        density: totalWords > 0 ? (count / totalWords) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  const twoGrams = getNGrams(2);
  const threeGrams = getNGrams(3);

  // Target keyword analysis
  let targetKeywordCount = 0;
  let targetKeywordDensity = 0;
  if (targetKeyword.trim()) {
    const target = targetKeyword.toLowerCase().trim();
    const textLower = text.toLowerCase();
    let idx = 0;
    while (idx < textLower.length) {
      const found = textLower.indexOf(target, idx);
      if (found === -1) break;
      targetKeywordCount++;
      idx = found + target.length;
    }
    targetKeywordDensity =
      totalWords > 0 ? (targetKeywordCount / totalWords) * 100 : 0;
  }

  return {
    totalWords,
    totalCharacters,
    totalSentences,
    avgWordsPerSentence,
    readingTimeMinutes,
    singleWords,
    twoGrams,
    threeGrams,
    targetKeywordCount,
    targetKeywordDensity,
  };
}

// ────────────────────────────────────────────────────────────────
// Density bar helper
// ────────────────────────────────────────────────────────────────

function getDensityColor(density: number): string {
  if (density > 3) return "bg-red-500";
  if (density > 2) return "bg-amber-500";
  return "bg-emerald-500";
}

function getDensityLabel(density: number): string {
  if (density > 3) return "Over-optimized";
  if (density > 2) return "Borderline";
  if (density > 0.5) return "Good";
  return "Low";
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────

export default function KeywordDensityCheckerPage() {
  const [text, setText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "two" | "three">(
    "single"
  );
  const [copied, setCopied] = useState(false);

  const result = text.trim() ? analyzeText(text, targetKeyword) : null;

  function handleCopyStats() {
    if (!result) return;
    const stats = [
      `Words: ${result.totalWords}`,
      `Characters: ${result.totalCharacters}`,
      `Sentences: ${result.totalSentences}`,
      `Avg words/sentence: ${result.avgWordsPerSentence}`,
      `Reading time: ${result.readingTimeMinutes} min`,
      targetKeyword
        ? `"${targetKeyword}" density: ${result.targetKeywordDensity.toFixed(2)}% (${result.targetKeywordCount} occurrences)`
        : "",
      "",
      "Top keywords:",
      ...result.singleWords
        .slice(0, 10)
        .map(
          (k) =>
            `  ${k.word}: ${k.count}x (${k.density.toFixed(2)}%)`
        ),
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(stats);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tabs = [
    { key: "single" as const, label: "1-Word", count: result?.singleWords.length },
    { key: "two" as const, label: "2-Word", count: result?.twoGrams.length },
    { key: "three" as const, label: "3-Word", count: result?.threeGrams.length },
  ];

  const activeResults =
    activeTab === "single"
      ? result?.singleWords
      : activeTab === "two"
        ? result?.twoGrams
        : result?.threeGrams;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="pt-32 pb-12 container-padding">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Content Analysis
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Keyword Density{" "}
            <span className="text-primary italic">Checker</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Analyze keyword frequency in your content. Find over-optimized
            phrases, discover natural patterns, and hit the sweet spot for SEO.
          </p>
        </div>
      </section>

      {/* Main Interface */}
      <section className="pb-16 container-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-4">
            {/* Target keyword */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-2xl p-5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Target Keyword (optional)
              </label>
              <input
                type="text"
                className="w-full h-12 bg-white dark:bg-zinc-800 border-none rounded-xl px-4 font-medium text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g. ai chatbot for business"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
            </div>

            {/* Text input */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Your Content
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setText("")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-[400px] bg-white dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed"
                placeholder="Paste your article, blog post, or page content here...&#10;&#10;The analyzer will count keyword frequency, calculate density percentages, and identify your most-used 1-word, 2-word, and 3-word phrases."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Results */}
          <div className="relative">
            <div className="sticky top-32 space-y-4">
              {/* Stats row */}
              {result && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    {
                      icon: Type,
                      value: result.totalWords.toLocaleString(),
                      label: "Words",
                    },
                    {
                      icon: Hash,
                      value: result.totalCharacters.toLocaleString(),
                      label: "Chars",
                    },
                    {
                      icon: BarChart3,
                      value: String(result.totalSentences),
                      label: "Sentences",
                    },
                    {
                      icon: Type,
                      value: `${result.avgWordsPerSentence}`,
                      label: "Avg/Sent",
                    },
                    {
                      icon: BarChart3,
                      value: `${result.readingTimeMinutes}m`,
                      label: "Read Time",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 text-center"
                    >
                      <span className="text-lg font-black text-foreground block">
                        {stat.value}
                      </span>
                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Target keyword result */}
              {result && targetKeyword.trim() && (
                <div
                  className={cn(
                    "p-5 rounded-2xl border",
                    result.targetKeywordDensity > 3
                      ? "bg-red-500/5 border-red-500/15"
                      : result.targetKeywordDensity > 2
                        ? "bg-amber-500/5 border-amber-500/15"
                        : result.targetKeywordDensity > 0
                          ? "bg-emerald-500/5 border-emerald-500/15"
                          : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-white/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                        Target: &quot;{targetKeyword}&quot;
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-foreground">
                          {result.targetKeywordDensity.toFixed(2)}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {result.targetKeywordCount}{" "}
                          {result.targetKeywordCount === 1
                            ? "occurrence"
                            : "occurrences"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-muted-foreground" />
                      <span
                        className={cn(
                          "text-xs font-bold",
                          result.targetKeywordDensity > 3
                            ? "text-red-600 dark:text-red-400"
                            : result.targetKeywordDensity > 2
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {getDensityLabel(result.targetKeywordDensity)}
                      </span>
                    </div>
                  </div>
                  {result.targetKeywordDensity > 3 && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Keyword density above 3% risks over-optimization
                      penalties. Consider using synonyms and related terms.
                    </p>
                  )}
                </div>
              )}

              {/* Keyword frequency table */}
              {result && (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1 p-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                      {tabs.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={cn(
                            "px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all",
                            activeTab === tab.key
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {tab.label}
                          {tab.count != null && (
                            <span className="ml-1 opacity-60">
                              ({tab.count})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleCopyStats}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Copied" : "Export"}
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                    {activeResults && activeResults.length > 0 ? (
                      activeResults.map((kw, i) => (
                        <div
                          key={kw.word}
                          className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span className="text-[10px] font-mono text-muted-foreground/40 w-5 text-right shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
                            {kw.word}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground shrink-0 w-8 text-right">
                            {kw.count}x
                          </span>
                          <div className="w-24 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                getDensityColor(kw.density)
                              )}
                              style={{
                                width: `${Math.min(100, (kw.density / 4) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground shrink-0 w-14 text-right">
                            {kw.density.toFixed(2)}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        {text.trim()
                          ? "No repeated phrases found for this n-gram size."
                          : "Paste content to see keyword analysis."}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!result && (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-12 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Paste your content
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Enter text in the left panel to see keyword density
                    analysis, word frequency, and n-gram patterns.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Keyword Density Best Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                What is keyword density?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keyword density is the percentage of times a keyword appears
                compared to the total word count. If &quot;AI chatbot&quot;
                appears 5 times in a 500-word article, the density is 1%.
                Google doesn&apos;t use an exact threshold, but patterns matter.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                The sweet spot: 0.5%–2.5%
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most SEO professionals target 0.5%–2.5% for primary keywords.
                Below 0.5% and Google may not associate your page with that
                keyword. Above 3% and you risk over-optimization penalties.
                Natural writing usually lands in the right range.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                N-grams matter more than single words
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google understands phrases, not just individual words. A
                2-word phrase like &quot;voice agent&quot; carries more
                semantic weight than either word alone. Check your 2-word and
                3-word tabs to see which phrases dominate your content.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5">
              <h3 className="font-semibold text-foreground mb-2">
                Use synonyms and LSI keywords
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of repeating the same keyword, use related terms.
                For &quot;AI chatbot,&quot; also use &quot;conversational AI,&quot;
                &quot;chat assistant,&quot; &quot;automated support.&quot;
                This signals topical depth to Google without triggering
                keyword stuffing filters.
              </p>
            </div>
          </div>

          <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Pro tip:</span>{" "}
              Run your content through this tool, then compare your top 10
              keywords against your competitor&apos;s top-ranking page. If
              they use terms you don&apos;t, consider adding them naturally
              to fill semantic gaps.
            </div>
          </div>
        </div>
      </section>

      <ToolsNav />
      <CTASection />
    </main>
  );
}
