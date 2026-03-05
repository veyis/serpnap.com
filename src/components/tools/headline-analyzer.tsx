"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  TrendingUp,
  Zap,
  Heart,
  Target,
  RefreshCw,
  Lightbulb,
  Type,
  ArrowRight,
  Eye,
  BarChart3,
  MessageCircleQuestion,
  List,
  BookOpen,
  FileText,
  Globe,
} from "lucide-react";
import { extractHeadlineFromUrl } from "@/app/actions/headline-extraction";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ToolsNav } from "./tools-nav";
import { AiAnalysisSection } from "./headline-analyzer/ai-analysis-section";

// ============================================================================
// Analysis Engine
// ============================================================================

const POWER_WORDS = {
  emotional: [
    "Amazing", "Incredible", "Stunning", "Powerful", "Essential", "Proven", "Guaranteed", "Exclusive", "Secret", "Ultimate",
    "Absurd", "Beautiful", "Best-Selling", "Breathtaking", "Brilliant", "Catastrophic", "Complete", "Confidential", "Crazy", "Dangerous",
    "Deadly", "Delightful", "Disastrous", "Epic", "Explosive", "Eye-Opening", "Fearless", "Fascinating", "Gorgeous", "Happy",
    "Heartbreaking", "Hilarious", "Horrifying", "Illegal", "Insane", "Inspiring", "Intense", "Jaw-Dropping", "Legendary", "Life-Changing",
    "Magic", "Magnet", "Magnificent", "Massive", "Mesmerizing", "Mind-Blowing", "Miracle", "Mysterious", "Naughty", "Obsessed",
    "Outstanding", "Painful", "Panic", "Perfect", "Phenomenal", "Polarizing", "Practical", "Precious", "Professional", "Rare",
    "Rebellious", "Remarkable", "Results", "Revolutionary", "Ridiculous", "Risky", "Ruthless", "Savage", "Scary", "Shocking",
    "Sick", "Silly", "Simple", "Smart", "Spectacular", "Special", "Spine-Chilling", "Strange", "Strong", "Stupid",
    "Successful", "Super", "Superior", "Surprising", "Terrifying", "Tested", "Thrilling", "Unbelievable", "Uncontrollable", "Underused",
    "Unique", "Unlimited", "Unusual", "Valuable", "Victorious", "Viral", "Vital", "Warned", "Wonderful", "Wondrous"
  ],
  urgency: [
    "Now", "Today", "Instant", "Quick", "Fast", "Limited", "Hurry", "Deadline", "Last Chance", "Don't Miss",
    "Act", "Alert", "Breakthrough", "Direct", "Download", "Early", "Ending", "Expires", "Final", "Going",
    "Immediately", "Imminent", "Instantly", "Just", "Launch", "Midnight", "Missing", "Never", "New", "Only",
    "Pressing", "Rare", "Running", "Rush", "Seconds", "Short", "Soon", "Speed", "Stop", "Temporary",
    "Time", "Timer", "Today", "Urgent", "Waiting", "While"
  ],
  curiosity: [
    "Surprising", "Unusual", "Strange", "Hidden", "Little-Known", "Unexpected", "Shocking", "Revealed", "Discover", "Uncover",
    "Accessible", "Backdoor", "Behind", "Bizarre", "Censored", "Concealed", "Confessions", "Covert", "Forbidden", "Forgotten",
    "Hacks", "Insider", "Lost", "Magic", "Members", "Myths", "Odd", "Open", "Private", "Puzzle",
    "Remote", "Restricted", "Secret", "Secrets", "Sneaky", "Strange", "Top-Secret", "Uncharted", "Underground", "Undiscovered",
    "Unlocked", "Unspoken", "Untold", "Weird", "Whispered", "X-Files"
  ],
  value: [
    "Free", "Save", "Bonus", "Extra", "Best", "Top", "Premium", "Exclusive", "Complete", "Full",
    "Affordable", "Bargain", "Budget", "Cash", "Cheap", "Deal", "Discount", "Dollar", "Double", "Economical",
    "Fortune", "Freebie", "Frugal", "Gain", "Gift", "Gold", "Half-Price", "Inexpensive", "Jackpot", "Luxury",
    "Money", "Nest Egg", "Pay", "Profit", "Promo", "Reduced", "Rich", "Sale", "Savings", "Special",
    "Steal", "Treasure", "Triple", "Value", "Wealth", "Win"
  ],
  trust: [
    "Proven", "Guaranteed", "Certified", "Expert", "Professional", "Trusted", "Reliable", "Authentic", "Official", "Verified",
    "Accurate", "Approved", "Authority", "Backed", "Best-Selling", "Case Study", "Complete", "Comprehensive", "Conclusive", "Confirmed",
    "Data", "Definitive", "Documented", "Endorsed", "Evidence", "Exact", "Fact", "Genuine", "Honest", "Ironclad",
    "Legitimate", "Lifetime", "Master", "No-Risk", "Official", "Protected", "Real", "Recognized", "Refund", "Report",
    "Research", "Result", "Safe", "Scientific", "Secure", "Solid", "Standard", "Study", "Tested", "Truth",
    "Validated", "Warranty", "Worldwide", "Improve", "Ways"
  ],
  negative: [
    "Stop", "Avoid", "Worst", "Never", "Don't", "Quit", "Wrong", "Fail", "Mistake", "Error",
    "Alarming", "Bad", "Warning", "Danger", "Death", "Destroy", "Disaster", "Dumb", "Embarrassing", "Evil",
    "Exposed", "Fake", "Fatal", "Fear", "Fool", "Frightening", "Gramat", "Hate", "Heartbreaking", "Horrible",
    "Horrifying", "Humiliating", "Hurt", "Ignorant", "Inferior", "Insane", "Lame", "Lies", "Losing", "Loss", "Lose",
    "Mediocre", "Miss", "Mistakes", "Nasty", "No", "Obnoxious", "Pain", "Panic", "Pitfalls", "Plague",
    "Poor", "Problem", "Reject", "Risk", "Rude", "Sad", "Scam", "Scared", "Shocked", "Shy",
    "Sick", "Sins", "Slow", "Stuck", "Stupid", "Suck", "Terrible", "Terrifying", "Threat", "Toxic",
    "Trap", "Trouble", "Ugly", "Unacceptable", "Underestimate", "Unfair", "Unhealthy", "Unsafe", "Unsightly", "Unstable",
    "Weak", "Worry", "Worse", "Worthless", "Wrong"
  ]
};



const ALL_POWER_WORDS = [...new Set(Object.values(POWER_WORDS).flat())];

const WEAK_WORDS = [
  "very", "really", "just", "actually", "basically", "literally", "honestly",
  "simply", "quite", "somewhat", "rather", "fairly", "pretty", "stuff", "things",
  "nice", "good", "great", "awesome", "cool", "interesting", "important",
];

const NUMBER_PATTERNS = /\b(\d+\+?|\d+k\+?|\d+%|\$\d+|\d+x)\b/gi;

type HeadlineType = "listicle" | "how-to" | "question" | "guide" | "statement" | "comparison";

interface AnalysisResult {
  overallScore: number;
  wordCount: number;
  characterCount: number;
  powerWords: string[];
  powerWordCategories: Record<string, string>;
  weakWords: string[];
  hasNumber: boolean;
  hasQuestion: boolean;
  hasColon: boolean;
  hasBrackets: boolean;
  sentimentScore: number;
  sentimentLabel: string;
  readingLevel: string;
  headlineType: HeadlineType;
  serpFit: "perfect" | "good" | "truncated";
  categories: {
    length: { score: number; feedback: string; detail: string };
    powerWords: { score: number; feedback: string; detail: string };
    emotion: { score: number; feedback: string; detail: string };
    clarity: { score: number; feedback: string; detail: string };
    uniqueness: { score: number; feedback: string; detail: string };
  };
  suggestions: string[];
  improvedVersions: string[];
}

function detectHeadlineType(headline: string): HeadlineType {
  const lower = headline.toLowerCase();
  if (/^\d+\s/.test(headline)) return "listicle";
  if (lower.startsWith("how to") || lower.startsWith("how ")) return "how-to";
  if (headline.includes("?")) return "question";
  if (/\b(guide|complete|definitive|comprehensive)\b/i.test(headline)) return "guide";
  if (/\bvs\.?\b|\bversus\b|\bcompared?\b/i.test(headline)) return "comparison";
  return "statement";
}

const HEADLINE_TYPE_META: Record<HeadlineType, { label: string; icon: React.ElementType; description: string }> = {
  "listicle": { label: "Listicle", icon: List, description: "Number-led headlines consistently outperform other formats. BuzzSumo found list posts get 2x more shares on average. The number sets a clear expectation of value and makes your content feel scannable." },
  "how-to": { label: "How-To", icon: BookOpen, description: "How-to headlines signal practical, actionable content. They rank well for informational search intent and attract readers actively looking to solve a problem. Google often features how-to content in featured snippets." },
  "question": { label: "Question", icon: MessageCircleQuestion, description: "Question headlines create a curiosity gap that compels clicks. They mirror how people actually search and can trigger Google's People Also Ask feature, giving you extra SERP visibility." },
  "guide": { label: "Guide", icon: FileText, description: "Guide-style headlines signal comprehensive, authoritative content. They attract readers looking for in-depth information and tend to earn more backlinks because they serve as definitive resources." },
  "comparison": { label: "Comparison", icon: BarChart3, description: "Comparison headlines target high-intent readers who are evaluating options. These perform well for commercial search queries and often capture readers closer to a purchase decision." },
  "statement": { label: "Statement", icon: Type, description: "Statement headlines make a direct claim or assertion. While straightforward, they can be strengthened by adding a number, question mark, or power word to increase emotional pull and click-through rate." },
};

function analyzeHeadline(headline: string): AnalysisResult {
  const words = headline.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = headline.length;

  // Deduplicate power words
  const foundPowerWordsSet = new Set<string>();
  const powerWordCategories: Record<string, string> = {};
  for (const pw of ALL_POWER_WORDS) {
    if (headline.toLowerCase().includes(pw.toLowerCase())) {
      foundPowerWordsSet.add(pw);
      // Find which category it belongs to
      for (const [cat, list] of Object.entries(POWER_WORDS)) {
        if (list.some(w => w.toLowerCase() === pw.toLowerCase())) {
          powerWordCategories[pw] = cat;
          break;
        }
      }
    }
  }
  const foundPowerWords = [...foundPowerWordsSet];

  const foundWeakWords = WEAK_WORDS.filter(ww =>
    words.some(w => w.toLowerCase() === ww.toLowerCase())
  );

  const hasNumber = NUMBER_PATTERNS.test(headline);
  const hasQuestion = headline.includes("?");
  const hasColon = headline.includes(":");
  const hasBrackets = /[\[\(]/.test(headline);
  const headlineType = detectHeadlineType(headline);

  // SERP fit (Google truncates around 60 chars)
  const serpFit: "perfect" | "good" | "truncated" =
    characterCount <= 55 ? "perfect" : characterCount <= 65 ? "good" : "truncated";

  let sentimentScore = 50;
  foundPowerWords.forEach(pw => {
    // Add weights
    if (POWER_WORDS.emotional.some(w => w.toLowerCase() === pw.toLowerCase())) sentimentScore += 5;
    if (POWER_WORDS.urgency.some(w => w.toLowerCase() === pw.toLowerCase())) sentimentScore += 5;
    if (POWER_WORDS.curiosity.some(w => w.toLowerCase() === pw.toLowerCase())) sentimentScore += 5;
    if (POWER_WORDS.value.some(w => w.toLowerCase() === pw.toLowerCase())) sentimentScore += 5;
    if (POWER_WORDS.trust.some(w => w.toLowerCase() === pw.toLowerCase())) sentimentScore += 5;
    // Negative words can either increase or decrease depending on context,
    // but for "sentiment strength" (impact), they add value.
    if (POWER_WORDS.negative.some(w => w.toLowerCase() === pw.toLowerCase())) {
        sentimentScore += 10;
    }
  });

  // Sentiment Analysis Logic
  const uniquePowerCount = foundPowerWords.length;
  let sentimentLabel = "Neutral";
  const negativeCount = foundPowerWords.filter(pw => powerWordCategories[pw] === 'negative').length;
  const positiveCount = foundPowerWords.filter(pw => powerWordCategories[pw] && powerWordCategories[pw] !== 'negative').length;

  if (negativeCount > positiveCount) sentimentLabel = "Negative / Urgent";
  else if (positiveCount > negativeCount) sentimentLabel = "Positive";
  else if (negativeCount > 0 && positiveCount > 0) sentimentLabel = "Mixed / Emotional";
  else if (uniquePowerCount > 1) sentimentLabel = "Strong";

  sentimentScore = Math.min(100, Math.max(0, sentimentScore));

  // --- Length ---
  const lengthScore = (() => {
    if (wordCount >= 6 && wordCount <= 12) return 100;
    if (wordCount >= 4 && wordCount <= 14) return 75;
    if (wordCount >= 3 && wordCount <= 16) return 50;
    return 25;
  })();

  const lengthFeedback = (() => {
    if (wordCount < 4) return "Too short — add more descriptive words to set context.";
    if (wordCount > 14) return "Too long — trim to 6-12 words for best performance.";
    if (wordCount >= 6 && wordCount <= 12) return "Perfect length for maximum engagement.";
    return "Acceptable length, but 6-12 words is the sweet spot.";
  })();

  const lengthDetail = (() => {
    if (wordCount < 4) return `Your headline is only ${wordCount} words. Research from CoSchedule shows that headlines between 6-12 words get the highest click-through rates. Short headlines often lack the context readers need to decide whether to click.`;
    if (wordCount > 14) return `At ${wordCount} words, your headline may get truncated in search results and social feeds. Google displays roughly 55-60 characters in SERPs. Try removing filler words or splitting the idea into a headline + subheadline.`;
    if (wordCount >= 6 && wordCount <= 12) return `At ${wordCount} words (${characterCount} characters), your headline hits the optimal range. It's long enough to convey value, short enough to display fully in Google search results, and scannable in social media feeds.`;
    return `At ${wordCount} words, you're close to the ideal range. Headlines with 6-12 words tend to see 21% higher engagement according to studies by Outbrain and CoSchedule.`;
  })();

  // --- Power Words ---
  const powerWordScore = (() => {
    if (uniquePowerCount >= 4) return 100;
    if (uniquePowerCount === 3) return 90;
    if (uniquePowerCount === 2) return 75;
    if (uniquePowerCount === 1) return 40;
    return 10;
  })();

  const powerWordFeedback = (() => {
    if (uniquePowerCount === 0) return "No power words detected — your headline lacks emotional triggers.";
    if (uniquePowerCount === 1) return `Found 1 power word. Adding 1-2 more will significantly boost impact.`;
    if (uniquePowerCount >= 3) return `Excellent — ${uniquePowerCount} power words create strong emotional pull.`;
    return `Good — ${uniquePowerCount} power words give your headline solid impact.`;
  })();

  const powerWordDetail = (() => {
    if (uniquePowerCount === 0) return "Power words are emotionally-charged terms that trigger a psychological response in readers. Headlines with at least 1-2 power words see 20-30% higher click-through rates. Try adding words like \"Proven,\" \"Essential,\" \"Secret,\" or \"Ultimate\" to create urgency and curiosity.";
    const cats = [...new Set(foundPowerWords.map(pw => powerWordCategories[pw]).filter(Boolean))];
    const catLabels = cats.map(c => c.charAt(0).toUpperCase() + c.slice(1));
    return `Your headline uses ${uniquePowerCount} power word${uniquePowerCount > 1 ? "s" : ""} from the ${catLabels.join(" and ")} categor${cats.length > 1 ? "ies" : "y"}. ${uniquePowerCount >= 2 ? "This combination creates a strong emotional cocktail that drives clicks." : "Adding words from other categories (urgency, curiosity, value) would diversify the emotional appeal."} Power words work because they bypass rational thinking and trigger emotional decision-making.`;
  })();

  // --- Emotion ---
  const emotionScore = (() => {
    let score = 20;
    if (hasQuestion) score += 15;
    if (hasNumber) score += 15;
    if (hasColon) score += 10;
    if (hasBrackets) score += 5;
    if (uniquePowerCount > 0) score += uniquePowerCount * 12;
    // Negativity boosts emotion significantly
    if (sentimentLabel.includes("Negative")) score += 15;
    return Math.min(100, score);
  })();

  const emotionFeedback = (() => {
    if (sentimentLabel !== "Neutral" && sentimentLabel !== "Positive") {
      return `Sentiment: ${sentimentLabel}. Strong emotional appeal triggers engagement.`;
    }
    const tips = [];
    if (!hasNumber) tips.push("Add a number for specificity");
    if (!hasQuestion && wordCount < 8) tips.push("Consider using a question format");
    if (uniquePowerCount === 0) tips.push("Include emotional trigger words");
    return tips.length > 0 ? tips.join(". ") + "." : "Strong emotional appeal — this headline triggers curiosity and engagement.";
  })();

  const emotionDetail = (() => {
    const signals = [];
    if (hasNumber) signals.push("a specific number (sets clear expectations)");
    if (hasQuestion) signals.push("a question mark (creates curiosity gap)");
    if (hasColon) signals.push("a colon (creates a two-part hook)");
    if (hasBrackets) signals.push("brackets (signals bonus value)");
    if (uniquePowerCount > 0) signals.push(`${uniquePowerCount} power word${uniquePowerCount > 1 ? "s" : ""} (emotional triggers)`);

    if (signals.length === 0) return "Your headline has no emotional triggers. It reads as purely informational, which means readers have little reason to click. Emotional headlines outperform neutral ones by 2-3x. Add a number, question, or power word to create a reason to click.";
    return `Your headline contains ${signals.join(", ")} and has a ${sentimentLabel} sentiment. ${signals.length >= 3 ? "This is an excellent combination — multiple emotional signals compound to create a headline that's hard to ignore." : "Each of these elements adds emotional pull."} Studies show headlines with 3+ emotional triggers see up to 3x higher engagement.`;
  })();

  // --- Clarity ---
  const clarityScore = (() => {
    let score = 80;
    if (foundWeakWords.length > 0) score -= foundWeakWords.length * 15;
    if (characterCount > 80) score -= 20;
    if (wordCount > 15) score -= 15;
    return Math.max(20, score);
  })();

  const clarityFeedback = (() => {
    if (foundWeakWords.length > 0) {
      return `Remove weak words: "${foundWeakWords.join('", "')}" — they dilute your message.`;
    }
    if (characterCount > 80) return "Your headline is too long for comfortable scanning — tighten the phrasing.";
    return "Clear and direct — every word earns its place.";
  })();

  const clarityDetail = (() => {
    if (foundWeakWords.length > 0) return `Your headline contains ${foundWeakWords.length} weak word${foundWeakWords.length > 1 ? "s" : ""}: "${foundWeakWords.join('", "')}". Weak words are filler that add length without adding meaning. They make your headline feel vague and uncommitted. Replace them with stronger, more specific alternatives — e.g., "very good" becomes "exceptional" or "proven."`;
    if (characterCount > 80) return `At ${characterCount} characters, your headline exceeds the ideal 50-70 character range. Long headlines get truncated in Google search results and social media previews, which can cut off your most important words. Focus on the one core benefit and cut everything else.`;
    return `Your headline is ${characterCount} characters with no weak or filler words. Every word contributes to the message. This kind of clarity is what makes readers trust your content before they even click — it signals confidence and authority.`;
  })();

  // --- Uniqueness ---
  const commonStarts = ["how to", "the best", "top 10", "why you", "what is", "lose", "10 ways", "7 ways", "5 ways"];
  const startsWithCommon = commonStarts.some(cs =>
    headline.toLowerCase().startsWith(cs)
  );

  const uniquenessScore = (() => {
    let score = startsWithCommon ? 40 : 70;
    if (hasBrackets) score += 15;
    if (hasColon) score += 15;
    return Math.min(100, score);
  })();

  const uniquenessFeedback = (() => {
    if (startsWithCommon) return "This opening format is heavily used — consider a more distinctive angle.";
    return "Distinctive structure — stands out from typical search results.";
  })();

  const uniquenessDetail = (() => {
    if (startsWithCommon) {
      const matchedStart = commonStarts.find(cs => headline.toLowerCase().startsWith(cs)) ?? "";
      return `Your headline starts with "${matchedStart}..." — one of the most common headline formats online. While this format is proven to work, it means you're competing directly with thousands of similar headlines in search results. Try rephrasing with a unique angle: lead with a result, a surprising statistic, or a contrarian take to stand out.`;
    }
    return `Your headline avoids the most overused formats ("How to...", "Top 10...", "The Best..."). In a sea of similar search results, a distinctive headline structure catches the eye and earns more clicks. ${hasBrackets ? "The brackets add visual variety that grabs attention in SERPs." : ""} ${hasColon ? "The colon creates a two-part structure that adds depth." : ""}`.trim();
  })();

  // Ultra-Deep Scoring Algorithm (Stricter)
  // 1. Length (20%)
  // 2. Power Words (25%) - reduced from 30
  // 3. Emotion (25%) - increased from 20
  // 4. Clarity (10%) - reduced from 15
  // 5. Uniqueness (20%) - increased from 15

  // Penalty for being too short or too long
  let lengthPenalty = 0;
  if (wordCount < 4) lengthPenalty = 25;
  if (wordCount > 18) lengthPenalty = 20;

  // New overall score calculation
  const weightedScore = (
    (lengthScore * 0.20) +
    (powerWordScore * 0.25) +
    (emotionScore * 0.25) +
    (clarityScore * 0.10) +
    (uniquenessScore * 0.20)
  ) - lengthPenalty;

  const overallScore = Math.max(0, Math.min(100, Math.round(weightedScore)));

  const suggestions: string[] = [];
  if (!hasNumber) suggestions.push("Add a specific number to set clear expectations (e.g., \"7 Ways\", \"50% More\", \"3 Steps\"). Numbered headlines get 36% higher click-through rates.");
  if (uniquePowerCount === 0) suggestions.push("Include 1-2 power words like \"Proven\", \"Ultimate\", or \"Essential\" to trigger an emotional response and boost engagement by 20-30%.");
  if (foundWeakWords.length > 0) suggestions.push(`Remove weak words (${foundWeakWords.join(", ")}) and replace them with specific, vivid language. \"Very fast\" becomes \"instant\" — shorter and more impactful.`);
  if (wordCount < 6) suggestions.push("Expand your headline to 6-12 words. Short headlines often lack the context readers need to understand the value of clicking through.");
  if (wordCount > 12) suggestions.push("Trim your headline to 12 words or fewer. Every word after the sweet spot dilutes impact and risks truncation in search results.");
  if (!hasQuestion && !hasNumber && !hasColon) suggestions.push("Add structural variety — a colon splits the headline into a hook + detail, a question creates a curiosity gap, and a number promises structured value.");
  if (serpFit === "truncated") suggestions.push(`At ${characterCount} characters, Google will truncate your headline in search results. Aim for 55-60 characters so readers see your complete message.`);
  if (!hasBrackets && wordCount >= 5) suggestions.push("Consider adding a bracket tag like [2026 Guide] or [Free Template]. HubSpot found brackets in headlines increase clicks by 38%.");

  const improvedVersions = generateImprovedVersions(headline, {
    hasNumber,
    hasQuestion,
    powerWords: foundPowerWords,
    wordCount,
    headlineType,
  });

  const avgWordLength = headline.length / wordCount;
  const readingLevel = avgWordLength < 5 ? "Easy" : avgWordLength < 7 ? "Moderate" : "Advanced";

  return {
    overallScore, wordCount, characterCount, powerWords: foundPowerWords,
    powerWordCategories, weakWords: foundWeakWords, hasNumber, hasQuestion,
    hasColon, hasBrackets, sentimentScore, sentimentLabel, readingLevel, headlineType, serpFit,
    categories: {
      length: { score: lengthScore, feedback: lengthFeedback, detail: lengthDetail },
      powerWords: { score: powerWordScore, feedback: powerWordFeedback, detail: powerWordDetail },
      emotion: { score: emotionScore, feedback: emotionFeedback, detail: emotionDetail },
      clarity: { score: clarityScore, feedback: clarityFeedback, detail: clarityDetail },
      uniqueness: { score: uniquenessScore, feedback: uniquenessFeedback, detail: uniquenessDetail },
    },
    suggestions, improvedVersions,
  };
}

function generateImprovedVersions(headline: string, context: { hasNumber: boolean; hasQuestion: boolean; powerWords: string[]; wordCount: number; headlineType: HeadlineType }): string[] {
  const versions: string[] = [];
  // Strip trailing punctuation for transformations
  const stripped = headline.replace(/[.!?]+$/, "").trim();
  const strippedLower = stripped.charAt(0).toLowerCase() + stripped.slice(1);

  // Number prefix — only if headline doesn't start with a number already
  if (!context.hasNumber && context.wordCount >= 3 && !/^\d/.test(headline)) {
    const numbers = ["7", "10", "5", "12"];
    const n = numbers[Math.floor(Math.random() * numbers.length)];
    versions.push(`${n} ${headline}`);
  }

  // Power word prefix — only if none found
  if (context.powerWords.length === 0) {
    const prefixes = ["The Ultimate Guide to", "Proven:", "Essential:"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    if (prefix.endsWith(":")) {
      versions.push(`${prefix} ${headline}`);
    } else {
      versions.push(`${prefix} ${strippedLower}`);
    }
  }

  // Question format — handle number-led headlines differently
  if (!context.hasQuestion && context.wordCount <= 12) {
    if (/^\d+\s/.test(headline)) {
      // "7 Ways to Boost..." → "Want to Boost...? Here Are 7 Ways"
      const match = headline.match(/^(\d+)\s+(.+)/);
      if (match) {
        const [, num, rest] = match;
        // Extract verb phrase after optional adjective + "Ways to", "Tips for", etc.
        const verbMatch = rest.match(/^(?:\w+\s+)?(?:ways?\s+to|tips?\s+(?:for|to)|steps?\s+to|reasons?\s+to|methods?\s+to)\s+(.+)/i);
        if (verbMatch) {
          versions.push(`Want to ${verbMatch[1].charAt(0).toLowerCase() + verbMatch[1].slice(1)}? Here are ${num} proven ways`);
        } else {
          versions.push(`Did you know these ${num} ${rest.toLowerCase()}?`);
        }
      }
    } else {
      const starters = ["Want to", "Ready to", "Struggling to"];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      versions.push(`${starter} ${strippedLower}?`);
    }
  }

  // How-to format — only for non-number, non-how-to headlines
  if (!headline.toLowerCase().startsWith("how to") && context.wordCount <= 8 && !/^\d/.test(headline)) {
    versions.push(`How to ${strippedLower} (step-by-step)`);
  }

  // Bracket tag — always useful for SEO
  if (context.wordCount >= 4) {
    const brackets = ["[2026 Guide]", "[Step-by-Step]", "[With Examples]", "[Backed by Data]"];
    const bracket = brackets[Math.floor(Math.random() * brackets.length)];
    versions.push(`${stripped} ${bracket}`);
  }

  return versions.slice(0, 4);
}

// ============================================================================
// Score Display
// ============================================================================

function ScoreRing({ score, animated, sentimentLabel }: { score: number; animated: number; sentimentLabel?: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  const color = score >= 80 ? "text-emerald-500" : score >= 65 ? "text-amber-500" : score >= 50 ? "text-orange-500" : "text-red-500";
  const strokeColor = score >= 80 ? "stroke-emerald-500" : score >= 65 ? "stroke-amber-500" : score >= 50 ? "stroke-orange-500" : "stroke-red-500";
  const label = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 50 ? "Average" : "Needs Work";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 sm:w-44 sm:h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-(--seo-border-subtle)" />
          <circle
            cx="60" cy="60" r={radius} fill="none" strokeWidth="6"
            strokeLinecap="round"
            className={cn(strokeColor, "transition-[stroke-dashoffset] duration-1000 ease-out")}
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl sm:text-5xl font-bold tracking-tight", color)}>{animated}</span>
          <span className="text-xs text-(--seo-text-muted) mt-0.5">/100</span>
        </div>
      </div>
      <div className="flex flex-col items-center mt-3">
        <span className={cn("text-lg font-bold", color)}>{label}</span>
        {/* Sentiment Badge */}
        <span className="mt-1 px-2.5 py-0.5 rounded-full bg-(--seo-surface) border border-(--seo-border-subtle) text-[11px] font-medium text-(--seo-text-muted) uppercase tracking-wider">
          {score < 50 ? "Needs Improvement" : "Sentiment: " + (sentimentLabel || "Neutral")}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Headline Preview — word-by-word highlighting
// ============================================================================

function HeadlinePreview({ headline, analysis, domain }: { headline: string; analysis: AnalysisResult; domain?: string }) {
  const words = headline.trim().split(/\s+/).filter(Boolean);
  const powerWordsLower = new Set(analysis.powerWords.map(w => w.toLowerCase()));
  const weakWordsLower = new Set(analysis.weakWords.map(w => w.toLowerCase()));

  return (
    <div className="p-5 sm:p-8 rounded-2xl bg-(--seo-surface-elevated) border border-(--seo-border-subtle)">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Eye className="w-3.5 h-3.5 text-violet-500" />
        </div>
        <h3 className="text-sm font-semibold text-(--seo-text)">Your Headline</h3>
      </div>

      {/* Headline with highlighted words */}
      <p className="text-xl sm:text-2xl font-semibold leading-relaxed tracking-[-0.01em] text-(--seo-text)">
        {words.map((word, i) => {
          const clean = word.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
          const isPower = powerWordsLower.has(clean);
          const isWeak = weakWordsLower.has(clean);
          const isNumber = /^\d/.test(word);

          return (
            <span key={i}>
              {i > 0 && " "}
              <span
                className={cn(
                  "inline-block",
                  isPower && "text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 decoration-2 underline-offset-4",
                  isWeak && "text-amber-600 dark:text-amber-400 line-through decoration-amber-500/40 decoration-2",
                  isNumber && !isPower && !isWeak && "text-violet-600 dark:text-violet-400",
                )}
              >
                {word}
              </span>
            </span>
          );
        })}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-(--seo-border-subtle)">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-(--seo-text-muted)">Power Word</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[11px] text-(--seo-text-muted)">Weak Word</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-[11px] text-(--seo-text-muted)">Number</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-(--seo-text-faint)" />
          <span className="text-[11px] text-(--seo-text-muted)">Regular</span>
        </div>
      </div>

      {/* SERP Preview */}
      <div className="mt-5 pt-4 border-t border-(--seo-border-subtle)">
        <p className="text-[11px] uppercase tracking-widest text-(--seo-text-faint) font-medium mb-2.5">Google Search Preview</p>
        <div className="p-4 rounded-xl bg-(--seo-surface) border border-(--seo-border-subtle)">
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium leading-snug line-clamp-1">
            {headline.length > 60 ? headline.slice(0, 57) + "..." : headline}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">{domain || "example.com"} &rsaquo; blog &rsaquo; article</p>
          <p className="text-xs text-(--seo-text-muted) mt-1.5 leading-relaxed line-clamp-2">
            Discover actionable insights from industry experts. Updated for 2026 with real-world examples and proven strategies...
          </p>
        </div>
        <p className={cn(
          "text-[11px] mt-2",
          analysis.serpFit === "perfect" ? "text-emerald-600 dark:text-emerald-400" :
          analysis.serpFit === "good" ? "text-amber-600 dark:text-amber-400" :
          "text-red-500"
        )}>
          {analysis.serpFit === "perfect" && `${analysis.characterCount} characters — fits perfectly in Google search results`}
          {analysis.serpFit === "good" && `${analysis.characterCount} characters — close to the limit, may be slightly trimmed`}
          {analysis.serpFit === "truncated" && `${analysis.characterCount} characters — will be truncated in Google (aim for 55-60)`}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Category Bar — now with expandable detail
// ============================================================================

function CategoryBar({ label, score, feedback, detail, icon: Icon }: { label: string; score: number; feedback: string; detail: string; icon: React.ElementType }) {
  const [expanded, setExpanded] = useState(false);
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  const textColor = score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-500";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-(--seo-surface) flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-(--seo-text-muted)" />
          </div>
          <span className="text-sm font-medium text-(--seo-text)">{label}</span>
        </div>
        <span className={cn("text-sm font-semibold tabular-nums", textColor)}>{score}/100</span>
      </div>
      <div className="h-1.5 bg-(--seo-surface) rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-(--seo-text-secondary) leading-relaxed">{feedback}</p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-(--seo-text-faint) hover:text-(--seo-text-muted) transition-colors duration-200 flex items-center gap-1"
      >
        {expanded ? "Show less" : "Why this matters"}
        <span className={cn("transition-transform duration-200 inline-block", expanded && "rotate-180")}>&#9662;</span>
      </button>
      {expanded && (
        <p className="text-xs text-(--seo-text-muted) leading-relaxed pl-9 animate-in fade-in slide-in-from-top-2 duration-300">
          {detail}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Headline Input (pill style matching SEO checker CommandInput)
// ============================================================================

function HeadlineInput({
  value,
  onChange,
  onSubmit,
  disabled,
  wordCount,
  charCount,
  icon: Icon = Type,
  submitLabel = "Analyze",
  isLoading = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  wordCount?: number;
  charCount?: number;
  icon?: React.ElementType;
  submitLabel?: string;
  isLoading?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasValue = value.trim().length > 0;

  return (
    <div className="w-full">
      <div
        className={cn(
          "group relative flex items-center gap-3 pl-5 pr-1 py-1 rounded-full",
          "bg-(--seo-surface)",
          "border border-(--seo-border)",
          "transition-all duration-200",
          "hover:shadow-sm",
          "focus-within:shadow-md focus-within:border-(--seo-border)",
        )}
      >
        <Icon className="w-5 h-5 text-(--seo-text-faint) group-focus-within:text-(--seo-text-muted) shrink-0 transition-colors duration-200" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onSubmit()}
          placeholder="Enter your headline..."
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent text-[17px] text-(--seo-text) placeholder:text-(--seo-text-faint) outline-none min-w-0",
            "tracking-[-0.01em]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !hasValue}
          className={cn(
            "shrink-0 flex items-center justify-center gap-2 transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            hasValue
              ? "px-6 py-2 rounded-full text-[15px] font-medium text-(--seo-text) border border-(--seo-border) bg-(--seo-surface-hover) hover:bg-(--seo-surface) hover:border-(--seo-text-muted)/30 hover:shadow-md active:scale-[0.98] backdrop-blur-md"
              : "w-9 h-9 rounded-full bg-(--seo-surface-hover) text-(--seo-text-muted)",
          )}
        >
          {hasValue ? (isLoading ? "..." : submitLabel) : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Live counter */}
      {hasValue && (
        <div className="flex items-center justify-center gap-4 mt-3 animate-in fade-in duration-300">
          <span className="text-xs text-(--seo-text-faint) tabular-nums">{charCount} chars</span>
          <span className="text-xs text-(--seo-text-faint)">·</span>
          <span className="text-xs text-(--seo-text-faint) tabular-nums">{wordCount} words</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mode, setMode] = useState<"text" | "url">("text");
  const [urlInput, setUrlInput] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const words = headline.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = headline.length;

  const analysis = useMemo(() => {
    if (!headline.trim()) return null;
    return analyzeHeadline(headline);
  }, [headline]);

  // Animate score
  useEffect(() => {
    if (!showResults || !analysis) {
      setAnimatedScore(0);
      return;
    }
    const target = analysis.overallScore;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [showResults, analysis]);

  const handleAnalyze = useCallback(() => {
    if (headline.trim()) {
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [headline]);

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) return;
    
    setIsFetchingUrl(true);
    try {
      const result = await extractHeadlineFromUrl(urlInput);
      if (result.success && result.headline) {
        setHeadline(result.headline);
        setMode("text");
        setShowResults(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        toast.success("Headline extracted successfully");
      } else {
        toast.error(result.error || "Failed to extract headline");
      }
    } catch {
      toast.error("An error occurred while fetching the URL");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleReset = useCallback(() => {
    setHeadline("");
    setShowResults(false);
    setCopiedIndex(null);
    setAnimatedScore(0);
  }, []);

  // Escape to reset
  useEffect(() => {
    if (!showResults) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleReset();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showResults, handleReset]);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--seo-page-bg) -mt-20 pt-20">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-(--seo-page-bg)" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">

          {/* Hero Section */}
          <div className="flex flex-col items-center pt-[6vh] sm:pt-[8vh] pb-6 sm:pb-8 transition-all duration-500">
            {/* Logo */}
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 sm:mb-6"
              style={{ animation: "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
            >
              <Image
                src="/pxl_peak_gold.png"
                alt="Headline Analyzer"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 96px, 112px"
                priority
              />
            </div>

            {/* Title */}
            <div
              className="flex flex-col items-center text-center w-full max-w-2xl mb-6 sm:mb-8"
              style={{ animation: "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both" }}
            >
              <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100">
                <span className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-(--seo-text-muted) font-medium mb-4 sm:mb-5">
                  Free Headline Analysis Tool | 2026
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1]">
                  <span className="relative inline-block">
                    <span
                      className="aurora-text relative z-10 bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 25%, #06B6D4 50%, #8B5CF6 75%, #D946EF 100%)",
                        backgroundSize: "300% 100%",
                        animation: "aurora-text 10s ease-in-out infinite",
                      }}
                    >
                      Headline
                    </span>
                    <span className="relative z-10 text-(--seo-text) ml-2 sm:ml-3">Analyzer</span>
                    <span className="absolute inset-0 bg-linear-to-r from-violet-500/25 via-fuchsia-500/25 to-cyan-500/25 blur-2xl opacity-60 scale-150" />
                  </span>
                  <span className="text-(--seo-text)/40">.</span>
                </span>
              </h1>

              {!showResults && (
                <p
                  className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-(--seo-text-secondary) max-w-lg mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600 delay-150"
                >
                  Score your headline for{" "}
                  <span className="text-(--seo-text) font-medium">emotional appeal</span>,{" "}
                  <span className="text-(--seo-text) font-medium">power words</span>, and{" "}
                  <span className="text-(--seo-text) font-medium">clarity</span>.
                </p>
              )}
            </div>

            {/* Input */}
            <div
              className="w-full max-w-md sm:max-w-lg transition-all duration-500"
              style={{ animation: "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) 140ms both" }}
            >
              {/* Tabs */}
              <div className="flex justify-center mb-6">
                <div className="bg-(--seo-surface-elevated) p-1 rounded-xl inline-flex border border-(--seo-border-subtle)">
                  <button
                    onClick={() => setMode("text")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      mode === "text"
                        ? "bg-(--seo-surface) text-(--seo-text) shadow-sm border border-(--seo-border-subtle)"
                        : "text-(--seo-text-muted) hover:text-(--seo-text)"
                    )}
                  >
                    <Type className="w-4 h-4" />
                    Analyze Text
                  </button>
                  <button
                    onClick={() => setMode("url")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      mode === "url"
                        ? "bg-(--seo-surface) text-(--seo-text) shadow-sm border border-(--seo-border-subtle)"
                        : "text-(--seo-text-muted) hover:text-(--seo-text)"
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    Analyze Website
                  </button>
                </div>
              </div>

              <div key={mode} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <HeadlineInput
                  value={mode === "text" ? headline : urlInput}
                  onChange={(v) => {
                    if (mode === "text") {
                      setHeadline(v);
                      if (showResults) setShowResults(false);
                    } else {
                      setUrlInput(v);
                    }
                  }}
                  onSubmit={mode === "text" ? handleAnalyze : handleAnalyzeUrl}
                  wordCount={mode === "text" ? wordCount : 0}
                  charCount={mode === "text" ? charCount : 0}
                  icon={mode === "text" ? Type : Globe}
                  submitLabel={mode === "text" ? "Analyze" : "Fetch"}
                  isLoading={isFetchingUrl}
                />
              </div>
            </div>

            {/* Feature chips */}
            {!showResults && (
              <div
                className="flex items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8"
                style={{ animation: "seo-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both" }}
              >
                {["Length", "Power Words", "Emotion", "Clarity", "Uniqueness"].map((label) => (
                  <span
                    key={label}
                    className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-(--seo-surface) text-xs text-(--seo-text-muted) font-medium"
                  >
                    {label}
                  </span>
                ))}
                <span className="sm:hidden text-xs text-(--seo-text-muted)">
                  5-factor analysis · Instant results · 100% free
                </span>
              </div>
            )}

            {/* Reset hint */}
            {showResults && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 mt-4 text-xs text-(--seo-text-faint) hover:text-(--seo-text-muted) transition-colors duration-200"
              >
                <RefreshCw className="w-3 h-3" />
                Try another headline
                <span className="hidden sm:inline text-(--seo-text-faint)/50">· Esc</span>
              </button>
            )}
          </div>

          {/* Results */}
          {showResults && analysis && (
            <div ref={resultsRef} className="space-y-5 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* 1. Headline Preview — the headline text with highlights + SERP */}
              <HeadlinePreview 
                headline={headline} 
                analysis={analysis} 
                domain={mode === "url" && urlInput ? (() => {
                  try {
                    return new URL(urlInput).hostname.replace(/^www\./, '');
                  } catch {
                    return undefined;
                  }
                })() : undefined}
              />

              {/* 2. Score Hero */}
              <div className="p-6 sm:p-10 rounded-2xl bg-(--seo-surface-elevated) border border-(--seo-border-subtle)">
                <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                  <ScoreRing
                    score={analysis.overallScore}
                    animated={animatedScore}
                    sentimentLabel={analysis.sentimentLabel}
                  />

                  <div className="flex-1 w-full">
                    <h2 className="text-lg font-semibold text-(--seo-text) text-center sm:text-left mb-5">Headline Score</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { value: analysis.wordCount, label: "Words", sub: analysis.wordCount >= 6 && analysis.wordCount <= 12 ? "Optimal" : analysis.wordCount < 6 ? "Too short" : "Too long" },
                        { value: analysis.characterCount, label: "Characters", sub: analysis.serpFit === "perfect" ? "SERP safe" : analysis.serpFit === "good" ? "Near limit" : "Will truncate" },
                        { value: analysis.powerWords.length, label: "Power Words", sub: analysis.powerWords.length >= 2 ? "Strong" : analysis.powerWords.length === 1 ? "Add more" : "Missing" },
                        { value: analysis.readingLevel, label: "Reading Level", sub: analysis.readingLevel === "Easy" ? "Wide audience" : analysis.readingLevel === "Moderate" ? "General" : "Niche" },
                        { value: `${analysis.sentimentScore}%`, label: "Sentiment", sub: analysis.sentimentScore >= 75 ? "High emotion" : analysis.sentimentScore >= 50 ? "Moderate" : "Low emotion" },
                        { value: HEADLINE_TYPE_META[analysis.headlineType].label, label: "Headline Type", sub: "Format detected" },
                      ].map((stat) => (
                        <div key={stat.label} className="p-3 rounded-xl bg-(--seo-surface) text-center">
                          <span className="text-lg font-bold text-(--seo-text) tabular-nums">{stat.value}</span>
                          <span className="text-[11px] text-(--seo-text-muted) block mt-0.5">{stat.label}</span>
                          <span className="text-[10px] text-(--seo-text-faint) block">{stat.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Headline Type insight */}
              {(() => {
                const typeMeta = HEADLINE_TYPE_META[analysis.headlineType];
                const TypeIcon = typeMeta.icon;
                return (
                  <div className="p-5 sm:p-6 rounded-2xl bg-(--seo-surface-elevated) border border-(--seo-border-subtle)">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <TypeIcon className="w-4 h-4 text-violet-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-(--seo-text) mb-1">
                          Headline Type: <span className="text-violet-600 dark:text-violet-400">{typeMeta.label}</span>
                        </h3>
                        <p className="text-sm text-(--seo-text-secondary) leading-relaxed">{typeMeta.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 4. Detailed Breakdown */}
              <div className="p-6 sm:p-8 rounded-2xl bg-(--seo-surface-elevated) border border-(--seo-border-subtle)">
                <h3 className="text-base font-semibold text-(--seo-text) mb-6">Detailed Analysis</h3>
                <div className="space-y-7">
                  <CategoryBar label="Length" score={analysis.categories.length.score} feedback={analysis.categories.length.feedback} detail={analysis.categories.length.detail} icon={Target} />
                  <CategoryBar label="Power Words" score={analysis.categories.powerWords.score} feedback={analysis.categories.powerWords.feedback} detail={analysis.categories.powerWords.detail} icon={Zap} />
                  <CategoryBar label="Emotional Appeal" score={analysis.categories.emotion.score} feedback={analysis.categories.emotion.feedback} detail={analysis.categories.emotion.detail} icon={Heart} />
                  <CategoryBar label="Clarity" score={analysis.categories.clarity.score} feedback={analysis.categories.clarity.feedback} detail={analysis.categories.clarity.detail} icon={Check} />
                  <CategoryBar label="Uniqueness" score={analysis.categories.uniqueness.score} feedback={analysis.categories.uniqueness.feedback} detail={analysis.categories.uniqueness.detail} icon={Sparkles} />
                </div>
              </div>

              {/* 5. Power Words + Weak Words side-by-side */}
              {(analysis.powerWords.length > 0 || analysis.weakWords.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {analysis.powerWords.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-(--seo-text)">Power Words Found</h3>
                      </div>
                      <p className="text-xs text-(--seo-text-muted) mb-4 leading-relaxed">
                        These emotionally-charged words trigger psychological responses that increase click-through rates by 20-30%.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.powerWords.map((word) => {
                          const cat = analysis.powerWordCategories[word];
                          return (
                            <span key={word} className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                              {word}
                              {cat && <span className="ml-1.5 opacity-60">({cat})</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {analysis.weakWords.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-(--seo-text)">Weak Words to Remove</h3>
                      </div>
                      <p className="text-xs text-(--seo-text-muted) mb-4 leading-relaxed">
                        Filler words that dilute your message. Replace each one with a more specific, vivid alternative.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.weakWords.map((word) => (
                          <span key={word} className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 line-through">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-(--seo-surface-elevated) border border-(--seo-border-subtle)">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-(--seo-text)">Improvement Tips</h3>
                  </div>
                  <ul className="space-y-4">
                    {analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-(--seo-text-secondary) leading-relaxed">
                        <TrendingUp className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 7. Improved Versions */}
              {analysis.improvedVersions.length > 0 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-violet-500/5 border border-violet-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-(--seo-text)">Improved Versions</h3>
                  </div>
                  <p className="text-xs text-(--seo-text-muted) mb-5 leading-relaxed">
                    Each variation applies a different proven technique. Click copy to try any version.
                  </p>
                  <div className="space-y-2.5">
                    {analysis.improvedVersions.map((version, i) => (
                      <div
                        key={i}
                        className="group/copy flex items-center justify-between gap-3 p-3.5 rounded-xl bg-(--seo-surface) border border-(--seo-border-subtle) hover:border-(--seo-border) transition-colors duration-200"
                      >
                        <span className="text-sm text-(--seo-text) leading-relaxed">{version}</span>
                        <button
                          onClick={() => copyToClipboard(version, i)}
                          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-(--seo-text-faint) hover:text-(--seo-text-muted) hover:bg-(--seo-surface-hover) transition-all duration-200"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. AI Expert Analysis */}
              <AiAnalysisSection
                headline={headline}
                scores={{
                  overallScore: analysis.overallScore,
                  wordCount: analysis.wordCount,
                  characterCount: analysis.characterCount,
                  headlineType: analysis.headlineType,
                  serpFit: analysis.serpFit,
                }}
              />
            </div>
          )}

          {/* Tools Nav */}
          <ToolsNav />
        </div>
      </div>
    </div>
  );
}
