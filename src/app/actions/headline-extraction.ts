"use server";

import { z } from "zod";

const UrlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
});

export async function extractHeadlineFromUrl(url: string) {
  try {
    // 1. Validate URL
    const result = UrlSchema.safeParse({ url });
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message ?? "Invalid URL" };
    }

    // 2. Fetch the page with a generic User-Agent to avoid blocking
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      return { success: false, error: `Failed to fetch URL: ${response.status} ${response.statusText}` };
    }

    const html = await response.text();

    // 3. Extract H1 tag content
    // Regex for first <h1 ...>content</h1>
    // Matches any attributes in the opening tag.
    // Non-greedy capture for content. [\s\S] matches any char including newlines (ES5-safe).
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

    let extractedText = "";

    if (h1Match && h1Match[1]) {
      extractedText = h1Match[1];
    } else {
      // Fallback: Try <title> tag
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        extractedText = titleMatch[1];
      } else {
        return { success: false, error: "Could not find a valid Headline (H1) or Title on this page." };
      }
    }

    // 4. Clean up HTML entities and tags within the headline
    // Remove any inner HTML tags (e.g., <h1>My <span>Title</span></h1> -> My Title)
    let cleanText = extractedText.replace(/<[^>]*>/g, "").trim();

    // Decode basic HTML entities (this is a simplified decoder)
    cleanText = cleanText
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
      
    // Collapse whitespace
    cleanText = cleanText.replace(/\s+/g, " ");

    if (!cleanText) {
       return { success: false, error: "Found an empty H1/Title tag." };
    }

    return { success: true, headline: cleanText };

  } catch (error) {
    console.error("Error extracting headline:", error);
    return { success: false, error: "An unexpected error occurred while analyzing the URL." };
  }
}
