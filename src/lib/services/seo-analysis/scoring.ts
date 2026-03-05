import type {
  SEOCheckResult,
  SEOGrade,
  Readability,
  ContentMetrics,
  SEOIssue,
} from "@/schemas/seo-checker";
import { BENCHMARKS, WEIGHTS } from "./constants";

export type OverallCategoryScores = {
  technical: number;
  meta: number;
  content: number;
  structured: number;
  performance: number;
  accessibility: number;
  international: number;
  eeat: number;
  mobile: number;
};

/**
 * Compute weighted SEO score before critical-blocker penalties.
 */
export function calculateWeightedOverallScore(
  scores: OverallCategoryScores,
): number {
  return Math.round(
    scores.technical * WEIGHTS.technical +
      scores.meta * WEIGHTS.meta +
      scores.content * WEIGHTS.content +
      scores.structured * WEIGHTS.structured +
      scores.performance * WEIGHTS.performance +
      scores.accessibility * WEIGHTS.accessibility +
      scores.international * WEIGHTS.international +
      scores.eeat * WEIGHTS.eeat +
      scores.mobile * WEIGHTS.mobile,
  );
}

/**
 * Apply additional penalties for indexability blockers that should dominate
 * overall SEO quality regardless of healthy secondary signals.
 */
export function calculateCriticalBlockerPenalty(
  technicalIssues: SEOIssue[],
): number {
  let penalty = 0;

  const hasRobotsBlocked = technicalIssues.some((issue) =>
    issue.message.includes("robots.txt disallows crawling for this URL"),
  );
  if (hasRobotsBlocked) penalty += 20;

  const noindexSignals = technicalIssues.filter(
    (issue) => issue.type === "error" && /noindex/i.test(issue.message),
  ).length;
  if (noindexSignals > 0) {
    // First noindex signal is severe; additional signals stack but cap.
    penalty += Math.min(30, 22 + (noindexSignals - 1) * 8);
  }

  const hasSoft404 = technicalIssues.some(
    (issue) => issue.type === "error" && /soft 404/i.test(issue.message),
  );
  if (hasSoft404) penalty += 24;

  const hasMissingHtmlStructure = technicalIssues.some((issue) =>
    issue.message.includes("Missing essential HTML elements"),
  );
  if (hasMissingHtmlStructure) penalty += 8;

  const hasNoHttps = technicalIssues.some(
    (issue) => issue.message === "Site not using HTTPS",
  );
  if (hasNoHttps) penalty += 6;

  return Math.min(45, penalty);
}

export function calculateOverallScore(
  scores: OverallCategoryScores,
  technicalIssues: SEOIssue[],
): number {
  const weightedScore = calculateWeightedOverallScore(scores);
  const blockerPenalty = calculateCriticalBlockerPenalty(technicalIssues);
  return Math.max(0, Math.min(100, weightedScore - blockerPenalty));
}

export function generateRecommendations(
  overallScore: number,
  categories: SEOCheckResult["categories"],
  contentMetrics?: ContentMetrics,
): string[] {
  const recommendations: string[] = [];

  if (overallScore >= 90)
    recommendations.push(
      `Excellent! Your score of ${overallScore} is in the top 10% of websites we analyze.`,
    );
  else if (overallScore >= BENCHMARKS.topPercentile)
    recommendations.push(
      `Great work! Your score of ${overallScore} is above ${BENCHMARKS.topPercentile}% of websites.`,
    );
  else if (overallScore >= BENCHMARKS.avgScore)
    recommendations.push(
      `Your score of ${overallScore} is above average (${BENCHMARKS.avgScore}). Address warnings to reach the top tier.`,
    );
  else if (overallScore >= 50)
    recommendations.push(
      `Your score of ${overallScore} is below the industry average of ${BENCHMARKS.avgScore}. Focus on fixing errors first.`,
    );
  else
    recommendations.push(
      `Critical: Your score of ${overallScore} needs immediate attention. Start with the red errors.`,
    );

  const issues: { category: string; score: number; rec: string }[] = [];
  if (categories.technical.score < 80)
    issues.push({
      category: "technical",
      score: categories.technical.score,
      rec: "Fix technical issues first - HTTPS, viewport, and DOCTYPE are foundational.",
    });
  if (categories.meta.score < 70)
    issues.push({
      category: "meta",
      score: categories.meta.score,
      rec: "Optimize title (50-60 chars) and description (120-160 chars) for better CTR.",
    });
  if (categories.content.score < 70)
    issues.push({
      category: "content",
      score: categories.content.score,
      rec: "Add proper heading hierarchy (one H1, multiple H2s) and internal links.",
    });
  if (categories.structured.score < 70)
    issues.push({
      category: "structured",
      score: categories.structured.score,
      rec: "Add JSON-LD schema markup for rich snippets in search results.",
    });
  if (categories.eeat && categories.eeat.score < 70)
    issues.push({
      category: "eeat",
      score: categories.eeat.score,
      rec: "Improve E-E-A-T signals: add author info, trust pages (about/contact/privacy), and reviews.",
    });
  if (categories.mobile && categories.mobile.score < 80)
    issues.push({
      category: "mobile",
      score: categories.mobile.score,
      rec: "Fix mobile issues: ensure proper viewport, avoid small fonts, and use responsive widths.",
    });
  const sortedIssues = issues.toSorted((a, b) => a.score - b.score);
  sortedIssues.forEach((issue) => recommendations.push(issue.rec));

  if (contentMetrics) {
    if (contentMetrics.wordCount < BENCHMARKS.minWordCount)
      recommendations.push(
        `Content is thin (${contentMetrics.wordCount} words). Aim for ${BENCHMARKS.minWordCount}+ words for better rankings.`,
      );
    else if (contentMetrics.wordCount >= BENCHMARKS.idealWordCount)
      recommendations.push(
        `Great content depth (${contentMetrics.wordCount} words). This helps establish topical authority.`,
      );
    if (contentMetrics.imageCount.withoutAlt > 0)
      recommendations.push(
        `${contentMetrics.imageCount.withoutAlt} images missing alt text. Add descriptive alt attributes.`,
      );
    if (contentMetrics.linkCount.internal < 3)
      recommendations.push(
        "Add more internal links to help users and search engines discover related content.",
      );
  }

  return recommendations.slice(0, 6);
}

export function calculateGrade(score: number): SEOGrade {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 45) return "D";
  return "F";
}

// Irregular words lookup - words that heuristic syllable counting gets wrong
// Based on words/syllable (MIT) by Titus Wormer
export const SYLLABLE_PROBLEMATIC: Record<string, number> = {
  abalone: 4,
  abare: 3,
  abed: 2,
  aborigine: 5,
  acreage: 3,
  adame: 3,
  adieu: 2,
  adobe: 3,
  anemone: 4,
  anyone: 3,
  apache: 3,
  aphrodite: 4,
  apostrophe: 4,
  area: 3,
  ariadne: 4,
  cafe: 2,
  calliope: 4,
  catastrophe: 4,
  chile: 2,
  chloe: 2,
  circe: 2,
  coyote: 3,
  daphne: 2,
  epitome: 4,
  eurydice: 4,
  euterpe: 3,
  every: 2,
  everywhere: 3,
  forever: 3,
  gethsemane: 4,
  guacamole: 4,
  hermione: 4,
  hyperbole: 4,
  jesse: 2,
  jukebox: 2,
  karate: 3,
  machete: 3,
  maybe: 2,
  naive: 2,
  newlywed: 3,
  penelope: 4,
  people: 2,
  persephone: 4,
  phoebe: 2,
  pulse: 1,
  queue: 1,
  recipe: 3,
  riverbed: 3,
  sesame: 3,
  shoreline: 2,
  simile: 3,
  sometimes: 2,
  syncope: 3,
  tamale: 3,
  waterbed: 3,
  wednesday: 2,
  yosemite: 4,
  zoe: 2,
};

// Monosyllabic corrections: vowel sequences that form a single syllable
const SYL_MONO_ONE = new RegExp(
  [
    "awe($|d|so)",
    "cia(?:l|$)",
    "tia",
    "cius",
    "cious",
    "[^aeiou]giu",
    "[aeiouy][^aeiouy]ion",
    "iou",
    "sia$",
    "eous$",
    "[oa]gue$",
    ".[^aeiuoycgltdb]{2,}ed$",
    ".ely$",
    "^jua",
    "uai",
    "eau",
    "^busi$",
  ].join("|"),
  "g",
);

const SYL_MONO_TWO = new RegExp(
  "[aeiouy](?:" +
    [
      "[bcdfgklmnprstvyz]",
      "ch",
      "dg",
      "g[hn]",
      "l[lv]",
      "mm",
      "n[cgns]",
      "r[cnsv]",
      "squ",
      "s[cklst]",
      "th",
    ].join("|") +
    ")e$",
  "g",
);

// Double-syllabic corrections: sequences that look like 1 syllable but are 2
const SYL_DBL_ONE = new RegExp(
  "(?:" +
    [
      "([^aeiouy])\\1l",
      "[^aeiouy]ie(?:r|s?t)",
      "[aeiouym]bl",
      "eo",
      "ism",
      "asm",
      "thm",
      "dnt",
      "snt",
      "uity",
      "dea",
      "gean",
      "oa",
      "ua",
      "react?",
      "orbed",
      "shred",
      "eings?",
      "[aeiouy]sh?e[rs]",
    ].join("|") +
    ")$",
  "g",
);

const SYL_DBL_TWO = new RegExp(
  [
    "creat(?!u)",
    "[^gq]ua[^auieo]",
    "[aeiou]{3}",
    "^(?:ia|mc|coa[dglx].)",
    "(th|d)eist",
    "^re(app|es|im|us)",
  ].join("|"),
  "g",
);

const SYL_DBL_THREE = new RegExp(
  [
    "[^aeiou]y[ae]",
    "[^l]lien",
    "riet",
    "dien",
    "iu",
    "io",
    "ii",
    "uen",
    "[aeilotu]real",
    "real[aeilotu]",
    "iell",
    "eo[^aeiou]",
    "[aeiou]y[aeiou]",
  ].join("|"),
  "g",
);

const SYL_DBL_FOUR = /[^s]ia/g;

// Known affix syllable counts
const SYL_SINGLE_AFFIX = new RegExp(
  [
    "^(?:un|fore|ware|none?|out|post|sub|pre|pro|dis|side|some)",
    "(?:ly|less|some|ful|ers?|ness|cians?|ments?|ettes?|villes?|ships?|sides?|ports?|shires?|[gnst]ion(?:ed|s)?)$",
  ].join("|"),
  "g",
);

const SYL_DOUBLE_AFFIX = new RegExp(
  [
    "^(?:above|anti|ante|counter|hyper|afore|agri|infra|intra|inter|over|semi|ultra|under|extra|dia|micro|mega|kilo|pico|nano|macro|somer)",
    "(?:fully|berry|woman|women|edly|union|(?:(?:[bcdfghjklmnpqrstvwxz])|[aeiou])ye?ing)$",
  ].join("|"),
  "g",
);

const SYL_TRIPLE_AFFIX = /(creations?|ology|ologist|onomy|onomist)$/g;

/**
 * Count syllables in an English word using heuristic analysis with
 * irregular-word lookup and affix/vowel-cluster corrections.
 * Based on words/syllable (MIT) by Titus Wormer. ~85-90% accuracy.
 */
export function countSyllables(word: string): number {
  let value = word
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z]/g, "");
  let count = 0;

  if (value.length === 0) return 0;
  if (value.length < 3) return 1;

  // Check irregular words lookup (and simple singular form)
  if (value in SYLLABLE_PROBLEMATIC) return SYLLABLE_PROBLEMATIC[value];
  let singular = value;
  if (value.endsWith("ies") && value.length > 4)
    singular = value.slice(0, -3) + "y";
  else if (value.endsWith("ses") && value.length > 4)
    singular = value.slice(0, -2);
  else if (/(?:ch|sh|x|z)es$/.test(value)) singular = value.slice(0, -2);
  else if (
    value.endsWith("s") &&
    !value.endsWith("ss") &&
    !value.endsWith("us") &&
    value.length > 3
  )
    singular = value.slice(0, -1);
  if (singular !== value && singular in SYLLABLE_PROBLEMATIC)
    return SYLLABLE_PROBLEMATIC[singular];

  const add = () => {
    count++;
  };
  const sub = () => {
    count--;
  };

  // Count and strip known affixes
  value = value
    .replace(SYL_TRIPLE_AFFIX, () => {
      count += 3;
      return "";
    })
    .replace(SYL_DOUBLE_AFFIX, () => {
      count += 2;
      return "";
    })
    .replace(SYL_SINGLE_AFFIX, () => {
      count += 1;
      return "";
    });

  // Count vowel groups
  for (const part of value.split(/[^aeiouy]+/)) {
    if (part !== "") count++;
  }

  // Subtract for monosyllabic patterns (look like 2 syllables but are 1)
  value.replace(SYL_MONO_ONE, sub as never);
  value.replace(SYL_MONO_TWO, sub as never);

  // Add for double-syllabic patterns (look like 1 syllable but are 2)
  value.replace(SYL_DBL_ONE, add as never);
  value.replace(SYL_DBL_TWO, add as never);
  value.replace(SYL_DBL_THREE, add as never);
  value.replace(SYL_DBL_FOUR, add as never);

  return Math.max(1, count);
}

export function extractReadabilityFromText(text: string): Readability {
  // Protect abbreviations and decimals from sentence boundary over-counting.
  // Without this, "Dr. Smith works at Inc. headquarters." counts as 3 sentences instead of 1.
  const ABBR_DOT = "\u00B7"; // middle dot placeholder
  const preprocessed = text
    .replace(/\be\.g\./gi, `eg${ABBR_DOT}`)
    .replace(/\bi\.e\./gi, `ie${ABBR_DOT}`)
    .replace(/\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|Rev|Gen|Gov|Sgt|Cpl|Pvt|Lt|Col|Capt|Cmdr|Adm|Maj|Inc|Corp|Ltd|Co|vs|etc|approx|dept|est|vol|no|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\./gi, (m) =>
      m.replace(/\./g, ABBR_DOT),
    ) // Common single-dot abbreviations
    .replace(/\b([A-Z])\.([A-Z])\.([A-Z])?\.?/g, (m) =>
      m.replace(/\./g, ABBR_DOT),
    ) // U.S.A., A.M., etc.
    .replace(/(\d)\.(\d)/g, `$1${ABBR_DOT}$2`); // Decimal numbers (3.14, 2.5)
  const finalSentences = preprocessed
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const totalSentences = Math.max(finalSentences.length, 1);
  const totalWords = Math.max(words.length, 1);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength = totalWords / totalSentences;
  const avgSyllablesPerWord = totalSyllables / totalWords;
  const fleschScore = Math.max(
    0,
    Math.min(
      100,
      206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord,
    ),
  );

  let fleschGrade: string;
  if (fleschScore >= 90) fleschGrade = "Very Easy";
  else if (fleschScore >= 80) fleschGrade = "Easy";
  else if (fleschScore >= 70) fleschGrade = "Fairly Easy";
  else if (fleschScore >= 60) fleschGrade = "Standard";
  else if (fleschScore >= 50) fleschGrade = "Fairly Difficult";
  else if (fleschScore >= 30) fleschGrade = "Difficult";
  else fleschGrade = "Very Difficult";

  return {
    fleschScore: Math.round(fleschScore * 10) / 10,
    fleschGrade,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    estimatedReadingTime: Math.max(1, Math.round(totalWords / 200)),
  };
}
