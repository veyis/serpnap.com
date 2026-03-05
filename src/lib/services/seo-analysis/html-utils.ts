export function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&trade;/g, "\u2122")
    .replace(/&reg;/g, "\u00AE")
    .replace(/&copy;/g, "\u00A9")
    .replace(/&bull;/g, "\u2022")
    .replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCodePoint(parseInt(code));
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
      try {
        return String.fromCodePoint(parseInt(code, 16));
      } catch {
        return "";
      }
    })
    .replace(/&[a-zA-Z]+;/g, "");
}

export function stripHtmlToText(html: string): string {
  const stripped = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, "")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

/**
 * Extract main content text, excluding nav/header/footer/aside chrome.
 * Prioritises <main> or <article> content for accurate word count & readability.
 * Falls back to full page text when content landmarks are absent.
 */
export function extractMainContentText(html: string): string {
  // Try to find <main> content first (most accurate)
  const mainMatch = html.match(/<main[\s>][\s\S]*?<\/main>/i);
  if (mainMatch) return stripHtmlToText(mainMatch[0]);

  // Try <article> content
  const articleMatch = html.match(/<article[\s>][\s\S]*?<\/article>/i);
  if (articleMatch) return stripHtmlToText(articleMatch[0]);

  // Try role="main" content — use depth tracking for proper closing match
  // (non-greedy regex fails on deeply nested tags like <div role="main"><div>...</div></div>)
  const roleMainOpen = html.match(/<(\w+)[^>]+role=["']main["'][^>]*>/i);
  if (roleMainOpen) {
    const tagName = roleMainOpen[1].toLowerCase();
    const startIdx = roleMainOpen.index!;
    let depth = 1;
    let pos = startIdx + roleMainOpen[0].length;
    const openRe = new RegExp(`<${tagName}[\\s>]`, "gi");
    const closeRe = new RegExp(`</${tagName}\\s*>`, "gi");
    while (depth > 0 && pos < html.length) {
      openRe.lastIndex = pos;
      closeRe.lastIndex = pos;
      const nextOpen = openRe.exec(html);
      const nextClose = closeRe.exec(html);
      if (!nextClose) break;
      if (nextOpen && nextOpen.index < nextClose.index) {
        depth++;
        pos = nextOpen.index + nextOpen[0].length;
      } else {
        depth--;
        pos = nextClose.index + nextClose[0].length;
      }
    }
    if (depth === 0) {
      return stripHtmlToText(html.slice(startIdx, pos));
    }
  }

  // Fallback: strip nav, header, footer, aside, then extract text
  const contentHtml = html
    .replace(/<nav[\s>][\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s>][\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s>][\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s>][\s\S]*?<\/aside>/gi, "");
  return stripHtmlToText(contentHtml);
}

/**
 * Extract meta content in an attribute-order and quote-style agnostic way.
 * Supports double-quoted, single-quoted, and unquoted attribute values.
 */
export function extractMetaContentSafe(html: string, name: string): string {
  const targetName = name.toLowerCase();
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const metaName = extractTagAttributeValue(tag, "name");
    if (!metaName || metaName.trim().toLowerCase() !== targetName) continue;
    const content =
      extractTagAttributeValue(tag, "content") ??
      extractTagAttributeValue(tag, "value"); // Some sites (e.g. Amazon) use value= instead of content=
    if (content) return content.trim();
  }
  return "";
}

export function extractTagAttributeValue(
  tag: string,
  attr: string,
): string | null {
  const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Use negative lookbehind for word chars and hyphens to prevent matching
  // data-href when searching for href (hyphen is not a word char so \b alone
  // would still match the boundary between '-' and 'h' in data-href).
  const attrRegex = new RegExp(
    `(?<![\\w-])${escapedAttr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = tag.match(attrRegex);
  if (match) return match[1] ?? match[2] ?? match[3] ?? null;
  // Check for bare boolean attribute (e.g. <img alt> without =).
  // In HTML5 a bare attribute is equivalent to the empty string value.
  // Exclude matches after '=' to avoid matching inside unquoted values (e.g. class=alt).
  const booleanRegex = new RegExp(
    `(?<![\\w-=])${escapedAttr}(?=[\\s/>]|$)`,
    "i",
  );
  if (booleanRegex.test(tag)) return "";
  return null;
}

export function extractLinkTagsByRel(html: string, rel: string): string[] {
  const target = rel.toLowerCase();
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];

  return linkTags.filter((tag) => {
    const relValue = extractTagAttributeValue(tag, "rel");
    if (!relValue) return false;
    return relValue
      .toLowerCase()
      .split(/\s+/)
      .some((token) => token === target);
  });
}

export function extractLinkHrefByRelSafe(html: string, rel: string): string {
  const tags = extractLinkTagsByRel(html, rel);
  if (tags.length === 0) return "";
  return extractTagAttributeValue(tags[0], "href")?.trim() || "";
}

export function extractCanonicalFromLinkHeader(
  linkHeader: string | null | undefined,
): string {
  if (!linkHeader) return "";
  const entries = linkHeader.split(",");
  for (const entry of entries) {
    const urlMatch = entry.match(/<([^>]+)>/);
    if (!urlMatch?.[1]) continue;

    const params = entry.split(";").slice(1);
    for (const param of params) {
      const relMatch = param.match(
        /^\s*rel\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s,]+))/i,
      );
      if (!relMatch) continue;
      const relValue = (
        relMatch[1] ??
        relMatch[2] ??
        relMatch[3] ??
        ""
      ).toLowerCase();
      const relTokens = relValue.split(/\s+/).filter(Boolean);
      if (relTokens.includes("canonical")) {
        return urlMatch[1].trim();
      }
    }
  }
  return "";
}

export type AnchorTagMatch = {
  fullTag: string;
  href: string;
  innerHtml: string;
  index: number;
};

/**
 * Extract anchor tags with href values across quoted and unquoted attribute styles.
 * Supports:
 * - href="..."
 * - href='...'
 * - href=/relative/path
 */
export function extractAnchorTagMatches(html: string): AnchorTagMatch[] {
  const matches = [
    ...html.matchAll(
      /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ];

  return matches.map((match) => ({
    fullTag: match[0],
    href: (match[1] ?? match[2] ?? match[3] ?? "").trim(),
    innerHtml: match[4] ?? "",
    index: match.index ?? -1,
  }));
}

export function isSameHost(href: string, baseUrl: URL): boolean {
  try {
    const linkUrl = new URL(href, baseUrl.href);
    const linkHost = linkUrl.hostname.replace(/^www\./i, "").toLowerCase();
    const baseHost = baseUrl.hostname.replace(/^www\./i, "").toLowerCase();
    return linkHost === baseHost;
  } catch {
    // Relative paths that fail to parse are likely same-host
    return !href.startsWith("http://") && !href.startsWith("https://");
  }
}

/**
 * Extract the effective base URL from the HTML `<base href="...">` tag.
 * Returns the resolved base URL if present, or the page URL as fallback.
 */
export function extractBaseUrl(html: string, pageUrl: URL): URL {
  const baseMatch = html.match(/<base\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  const baseHref = baseMatch?.[1] ?? baseMatch?.[2] ?? baseMatch?.[3];
  if (baseHref) {
    try {
      return new URL(baseHref, pageUrl.href);
    } catch {
      return pageUrl;
    }
  }
  return pageUrl;
}

/** Strip non-rendered containers (script, style, template, noscript, comments) to get visible-only HTML */
export function getVisibleHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
}
