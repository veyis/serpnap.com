"use server";

// Smart SEO Fix Generator - Rule-based optimization
// Generates improved meta tags based on SEO best practices

interface FixSuggestion {
  original: string;
  suggested: string;
  improvement: string;
  confidence: "high" | "medium" | "low";
}

// Power words that increase CTR
const POWER_WORDS = [
  "Ultimate", "Complete", "Essential", "Proven", "Expert",
  "Free", "New", "Exclusive", "Limited", "Best",
  "Top", "Premium", "Professional", "Advanced", "Simple",
];

// Action words for meta descriptions
const ACTION_WORDS = [
  "Discover", "Learn", "Get", "Find", "Explore",
  "Start", "Try", "See", "Build", "Create",
  "Transform", "Unlock", "Master", "Boost", "Improve",
];

// Common filler words to remove
const FILLER_WORDS = [
  "very", "really", "just", "actually", "basically",
  "simply", "literally", "honestly", "absolutely",
];

// Pre-compiled filler word regexes (hoisted to avoid re-creating on every call)
const FILLER_WORD_REGEXES = FILLER_WORDS.map(
  (w) => new RegExp(`\\b${w}\\b`, "gi"),
);

export async function generateTitleFix(
  currentTitle: string,
  url: string,
  _pageContent?: string
): Promise<FixSuggestion> {
  const hostname = new URL(url).hostname.replace("www.", "");
  const brandName = hostname.split(".")[0];
  const capitalizedBrand = brandName.charAt(0).toUpperCase() + brandName.slice(1);

  let suggested = currentTitle;
  let improvement = "";

  // Check title length
  if (currentTitle.length < 30) {
    // Too short - expand it
    const powerWord = POWER_WORDS[Math.floor(Math.random() * 5)];
    suggested = `${powerWord} ${currentTitle} | ${capitalizedBrand}`;
    improvement = "Added power word and brand for better CTR";
  } else if (currentTitle.length > 60) {
    // Too long - truncate smartly
    const words = currentTitle.split(" ");
    let truncated = "";
    for (const word of words) {
      if ((truncated + " " + word).length <= 55) {
        truncated += (truncated ? " " : "") + word;
      } else break;
    }
    suggested = `${truncated} | ${capitalizedBrand}`;
    improvement = "Shortened to optimal length (50-60 chars)";
  } else if (!currentTitle.includes("|") && !currentTitle.includes("-")) {
    // Missing brand separator
    suggested = `${currentTitle} | ${capitalizedBrand}`;
    improvement = "Added brand name for recognition";
  } else if (!POWER_WORDS.some(w => currentTitle.toLowerCase().includes(w.toLowerCase()))) {
    // Missing power words
    const powerWord = POWER_WORDS[Math.floor(Math.random() * 5)];
    const words = currentTitle.split("|")[0].trim().split(" ");
    words.splice(1, 0, powerWord);
    suggested = words.join(" ") + (currentTitle.includes("|") ? " |" + currentTitle.split("|")[1] : "");
    improvement = "Added power word to increase click-through rate";
  }

  // Ensure proper capitalization
  suggested = suggested
    .split(" ")
    .map(word => {
      if (["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for"].includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return {
    original: currentTitle,
    suggested: suggested.slice(0, 60),
    improvement: improvement || "Optimized capitalization and structure",
    confidence: suggested !== currentTitle ? "high" : "medium",
  };
}

export async function generateDescriptionFix(
  currentDescription: string,
  url: string,
  title?: string
): Promise<FixSuggestion> {
  let suggested = currentDescription;
  let improvement = "";

  // Check description length
  if (!currentDescription || currentDescription.length < 50) {
    // Too short or missing - generate from title
    const actionWord = ACTION_WORDS[Math.floor(Math.random() * ACTION_WORDS.length)];
    const titleBase = title || "our services";
    suggested = `${actionWord} ${titleBase.toLowerCase().replace(/\|.*/, "").trim()}. Get expert solutions, proven results, and dedicated support. Start today!`;
    improvement = "Generated compelling description with call-to-action";
  } else if (currentDescription.length > 160) {
    // Too long - truncate at sentence boundary
    const sentences = currentDescription.split(/[.!?]+/);
    let truncated = "";
    for (const sentence of sentences) {
      if ((truncated + sentence + ".").length <= 155) {
        truncated += (truncated ? " " : "") + sentence.trim() + ".";
      } else break;
    }
    suggested = truncated || currentDescription.slice(0, 155) + "...";
    improvement = "Shortened to optimal length (150-160 chars)";
  } else if (!ACTION_WORDS.some(w => currentDescription.toLowerCase().startsWith(w.toLowerCase()))) {
    // Doesn't start with action word
    const actionWord = ACTION_WORDS[Math.floor(Math.random() * ACTION_WORDS.length)];
    suggested = `${actionWord} ${currentDescription.charAt(0).toLowerCase()}${currentDescription.slice(1)}`;
    improvement = "Added action word at start to drive engagement";
  }

  // Remove filler words
  for (const regex of FILLER_WORD_REGEXES) {
    regex.lastIndex = 0;
    if (regex.test(suggested)) {
      regex.lastIndex = 0;
      suggested = suggested.replace(regex, "").replace(/\s+/g, " ").trim();
      improvement = improvement || "Removed filler words for conciseness";
    }
  }

  // Ensure ends with CTA if no punctuation
  if (suggested && !suggested.match(/[.!?]$/)) {
    suggested += ". Learn more today!";
    improvement = improvement || "Added call-to-action";
  }

  return {
    original: currentDescription,
    suggested: suggested.slice(0, 160),
    improvement: improvement || "Optimized for better engagement",
    confidence: suggested !== currentDescription ? "high" : "medium",
  };
}

export async function generateH1Fix(
  currentH1: string,
  title?: string,
  _url?: string
): Promise<FixSuggestion> {
  let suggested = currentH1;
  let improvement = "";

  if (!currentH1) {
    // Missing H1 - generate from title
    suggested = title?.split("|")[0].trim() || "Welcome";
    improvement = "Generated H1 from page title";
  } else if (currentH1.length > 70) {
    // Too long
    const words = currentH1.split(" ").slice(0, 8);
    suggested = words.join(" ");
    improvement = "Shortened for better readability";
  } else if (currentH1.toLowerCase() === currentH1) {
    // All lowercase - fix capitalization
    suggested = currentH1
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    improvement = "Fixed capitalization for professionalism";
  }

  return {
    original: currentH1,
    suggested,
    improvement: improvement || "H1 looks good",
    confidence: suggested !== currentH1 ? "high" : "low",
  };
}

export async function generateAltTextFix(
  imageSrc: string,
  pageContext?: string
): Promise<FixSuggestion> {
  // Extract meaningful info from image filename
  const filename = imageSrc.split("/").pop()?.split("?")[0] || "";
  const cleanName = filename
    .replace(/\.[^.]+$/, "") // Remove extension
    .replace(/[-_]/g, " ") // Replace separators with spaces
    .replace(/\d+/g, "") // Remove numbers
    .trim();

  let suggested = cleanName || "Descriptive image";

  // Make it more descriptive
  if (cleanName) {
    suggested = cleanName
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    if (pageContext) {
      suggested += ` - ${pageContext}`;
    }
  }

  return {
    original: "",
    suggested: suggested.slice(0, 125),
    improvement: "Generated descriptive alt text from image filename",
    confidence: cleanName ? "medium" : "low",
  };
}

// Main function to generate all fixes for a page
export async function generateAllFixes(data: {
  url: string;
  title?: string;
  description?: string;
  h1?: string;
  missingAltImages?: string[];
}): Promise<{
  title?: FixSuggestion;
  description?: FixSuggestion;
  h1?: FixSuggestion;
  altTexts?: FixSuggestion[];
}> {
  const results: {
    title?: FixSuggestion;
    description?: FixSuggestion;
    h1?: FixSuggestion;
    altTexts?: FixSuggestion[];
  } = {};

  if (data.title) {
    results.title = await generateTitleFix(data.title, data.url);
  }

  if (data.description !== undefined) {
    results.description = await generateDescriptionFix(
      data.description,
      data.url,
      data.title
    );
  }

  if (data.h1 !== undefined) {
    results.h1 = await generateH1Fix(data.h1, data.title, data.url);
  }

  if (data.missingAltImages?.length) {
    results.altTexts = await Promise.all(
      data.missingAltImages.slice(0, 5).map(src => generateAltTextFix(src))
    );
  }

  return results;
}
