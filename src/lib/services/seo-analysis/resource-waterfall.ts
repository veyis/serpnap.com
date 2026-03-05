import type {
  WaterfallResource,
  WaterfallAnalysis,
} from "@/schemas/seo-checker";
import { isBlockedUrl as isBlockedLinkTarget } from "@/lib/security/ssrf";
import type { AnalysisContext } from "./types";
import {
  USER_AGENT,
  RESOURCE_CHECK_TIMEOUT,
  MAX_RESOURCES_TO_CHECK,
  RESOURCE_CHECK_CONCURRENCY,
} from "./constants";
import { extractTagAttributeValue } from "./html-utils";

export function extractResourcesFromHTML(ctx: AnalysisContext): {
  resources: WaterfallResource[];
  skippedCount: number;
} {
  // MAX_RESOURCES_TO_CHECK applies to external resources; +1 for the document row.
  const maxTotalResources = MAX_RESOURCES_TO_CHECK + 1;
  const resources: WaterfallResource[] = [];
  const seen = new Set<string>();
  const bodyIndex = ctx.html.indexOf("<body");
  let orderIndex = 0;
  let totalFound = 0;

  function getShortName(urlStr: string): string {
    try {
      const u = new URL(urlStr);
      const segments = u.pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1] || u.hostname;
      return last.length > 30 ? last.slice(0, 27) + "..." : last;
    } catch {
      return urlStr.slice(0, 30);
    }
  }

  function isThirdParty(urlStr: string): boolean {
    try {
      return new URL(urlStr).hostname !== ctx.url.hostname;
    } catch {
      return false;
    }
  }

  function addResource(
    url: string,
    resourceType: WaterfallResource["resourceType"],
    loadingStrategy: WaterfallResource["loadingStrategy"],
    isRenderBlocking: boolean,
    tagPosition: number,
  ) {
    if (seen.has(url)) return;
    seen.add(url);
    totalFound++;
    if (resources.length >= maxTotalResources) return;
    const isCritical =
      isRenderBlocking && (bodyIndex < 0 || tagPosition < bodyIndex);
    resources.push({
      url,
      shortName: getShortName(url),
      resourceType,
      loadingStrategy,
      isRenderBlocking,
      sizeBytes: null,
      responseTimeMs: null,
      statusCode: null,
      contentType: null,
      startOffset: orderIndex++,
      isCriticalPath: isCritical,
      isThirdParty: isThirdParty(url),
    });
  }

  function resolveUrl(href: string): string | null {
    if (
      !href ||
      href.startsWith("data:") ||
      href.startsWith("blob:") ||
      href.startsWith("javascript:")
    )
      return null;
    try {
      const resolved = new URL(href, (ctx.baseUrl ?? ctx.url).href);
      if (isBlockedLinkTarget(resolved.href)) return null;
      return resolved.href;
    } catch {
      return null;
    }
  }

  // 1. Document itself
  resources.push({
    url: ctx.url.href,
    shortName: "document",
    resourceType: "document",
    loadingStrategy: "n/a",
    isRenderBlocking: false,
    sizeBytes: ctx.htmlSize ?? null,
    responseTimeMs: ctx.responseTime ?? null,
    statusCode: 200,
    contentType: "text/html",
    startOffset: orderIndex++,
    isCriticalPath: false,
    isThirdParty: false,
  });
  seen.add(ctx.url.href);

  // 2. Stylesheets — <link rel="stylesheet" href="...">
  const linkRegex = /<link\b[^>]*>/gi;
  const hasRelToken = (tag: string, token: string): boolean => {
    const rel = extractTagAttributeValue(tag, "rel");
    if (!rel) return false;
    return rel
      .toLowerCase()
      .split(/\s+/)
      .some((entry) => entry === token);
  };
  let match;
  while ((match = linkRegex.exec(ctx.html)) !== null) {
    const tag = match[0];
    if (!hasRelToken(tag, "stylesheet")) continue;
    const href = extractTagAttributeValue(tag, "href");
    if (!href) continue;
    const resolved = resolveUrl(href);
    if (!resolved) continue;
    const media = (extractTagAttributeValue(tag, "media") || "").toLowerCase();
    const nonBlocking =
      media === "print" ||
      media === "speech" ||
      media === "none" ||
      media === "not all" ||
      media.includes("(");
    addResource(
      resolved,
      "stylesheet",
      nonBlocking ? "media" : "sync",
      !nonBlocking,
      match.index ?? -1,
    );
  }

  // 3. Scripts — <script src="...">
  // Only executable script types are fetched by the browser on page load.
  // Data containers (type="text/plain", "application/json", etc.) are skipped.
  const EXECUTABLE_SCRIPT_TYPES = new Set([
    "",
    "text/javascript",
    "application/javascript",
    "module",
    "text/ecmascript",
    "application/ecmascript",
  ]);
  const scriptRegex = /<script\b[^>]*>/gi;
  while ((match = scriptRegex.exec(ctx.html)) !== null) {
    const tag = match[0];
    const src = extractTagAttributeValue(tag, "src");
    if (!src) continue;
    const scriptType = (
      extractTagAttributeValue(tag, "type") || ""
    )
      .toLowerCase()
      .trim();
    if (!EXECUTABLE_SCRIPT_TYPES.has(scriptType)) continue;
    const resolved = resolveUrl(src);
    if (!resolved) continue;
    const hasAsync = /\basync\b/i.test(tag);
    const hasDefer = /\bdefer\b/i.test(tag);
    const hasModule = scriptType === "module";
    const hasNomodule = /\bnomodule\b/i.test(tag);
    let strategy: WaterfallResource["loadingStrategy"] = "sync";
    let blocking = true;
    if (hasModule) {
      strategy = "module";
      blocking = false;
    } else if (hasAsync) {
      strategy = "async";
      blocking = false;
    } else if (hasDefer) {
      strategy = "defer";
      blocking = false;
    } else if (hasNomodule) {
      blocking = false;
    }
    addResource(resolved, "script", strategy, blocking, match.index ?? -1);
  }

  // 4. Preloads — <link rel="preload" href="..." as="...">
  linkRegex.lastIndex = 0;
  while ((match = linkRegex.exec(ctx.html)) !== null) {
    const tag = match[0];
    if (!hasRelToken(tag, "preload")) continue;
    const href = extractTagAttributeValue(tag, "href");
    if (!href) continue;
    const resolved = resolveUrl(href);
    if (!resolved) continue;
    const asType = (extractTagAttributeValue(tag, "as") || "").toLowerCase();
    let resourceType: WaterfallResource["resourceType"] = "preload";
    if (asType === "font") resourceType = "font";
    else if (asType === "style") resourceType = "stylesheet";
    else if (asType === "script") resourceType = "script";
    else if (asType === "image") resourceType = "image";
    addResource(resolved, resourceType, "preload", false, match.index ?? -1);
  }

  // 5. Images — <img src="..."> (first 10)
  const imgRegex = /<img\b[^>]*>/gi;
  let imgCount = 0;
  while ((match = imgRegex.exec(ctx.html)) !== null && imgCount < 10) {
    const tag = match[0];
    const src = extractTagAttributeValue(tag, "src");
    if (!src) continue;
    const resolved = resolveUrl(src);
    if (!resolved) continue;
    const isLazy =
      (extractTagAttributeValue(tag, "loading") || "").toLowerCase() === "lazy";
    addResource(
      resolved,
      "image",
      isLazy ? "lazy" : "sync",
      false,
      match.index ?? -1,
    );
    imgCount++;
  }

  // 6. Fonts — @font-face url() patterns
  const fontFaceRegex =
    /@font-face\s*\{[^}]*url\(["']?([^"')]+)["']?\)[^}]*\}/gi;
  while ((match = fontFaceRegex.exec(ctx.html)) !== null) {
    const resolved = resolveUrl(match[1]);
    if (!resolved) continue;
    addResource(resolved, "font", "sync", true, match.index);
  }

  // 7. Iframes — <iframe src="..."> (first 3)
  const iframeRegex = /<iframe\b[^>]*>/gi;
  let iframeCount = 0;
  while ((match = iframeRegex.exec(ctx.html)) !== null && iframeCount < 3) {
    const tag = match[0];
    const src = extractTagAttributeValue(tag, "src");
    if (!src) continue;
    const resolved = resolveUrl(src);
    if (!resolved) continue;
    const isLazy =
      (extractTagAttributeValue(tag, "loading") || "").toLowerCase() === "lazy";
    addResource(
      resolved,
      "iframe",
      isLazy ? "lazy" : "sync",
      false,
      match.index ?? -1,
    );
    iframeCount++;
  }

  // totalFound counts regex-discovered resources; resources.length includes the document entry
  const addedFromRegex = resources.length - 1;
  const skippedCount = Math.max(0, totalFound - addedFromRegex);
  return { resources, skippedCount };
}

export async function checkSingleResource(url: string): Promise<{
  sizeBytes: number | null;
  responseTimeMs: number | null;
  statusCode: number | null;
  contentType: string | null;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    RESOURCE_CHECK_TIMEOUT,
  );
  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeoutId);
    const elapsed = Date.now() - start;
    const contentLength = response.headers.get("content-length");
    const contentType = response.headers.get("content-type");
    return {
      sizeBytes: contentLength ? parseInt(contentLength, 10) : null,
      responseTimeMs: elapsed,
      statusCode: response.status,
      contentType: contentType ? contentType.split(";")[0].trim() : null,
    };
  } catch {
    clearTimeout(timeoutId);
    return {
      sizeBytes: null,
      responseTimeMs: null,
      statusCode: null,
      contentType: null,
    };
  }
}

export async function analyzeResourceWaterfall(
  ctx: AnalysisContext,
): Promise<WaterfallAnalysis> {
  const { resources, skippedCount } = extractResourcesFromHTML(ctx);

  if (resources.length <= 1) {
    return {
      resources,
      summary: {
        totalResources: resources.length,
        totalSizeBytes: ctx.htmlSize ?? 0,
        unknownSizeCount: 0,
        renderBlockingCount: 0,
        criticalPathCount: 0,
        thirdPartyCount: 0,
        byType: { document: 1 },
        documentResponseTimeMs: ctx.responseTime ?? 0,
        estimatedFullLoadMs: ctx.responseTime ?? 0,
      },
      skippedCount: 0,
      checkedCount: resources.length,
    };
  }

  // HEAD-request all resources except the document (index 0 already has data)
  const toCheck = resources.slice(1);
  const queue = [...toCheck];
  const workers = Array.from(
    { length: Math.min(RESOURCE_CHECK_CONCURRENCY, queue.length) },
    async () => {
      while (queue.length > 0) {
        const resource = queue.shift();
        if (!resource) break;
        const result = await checkSingleResource(resource.url);
        resource.sizeBytes = result.sizeBytes;
        resource.responseTimeMs = result.responseTimeMs;
        resource.statusCode = result.statusCode;
        resource.contentType = result.contentType;
      }
    },
  );
  await Promise.all(workers);

  // Build summary
  let totalSizeBytes = 0;
  let unknownSizeCount = 0;
  let renderBlockingCount = 0;
  let criticalPathCount = 0;
  let thirdPartyCount = 0;
  let maxEndTime = 0;
  const byType: Record<string, number> = {};

  for (const r of resources) {
    byType[r.resourceType] = (byType[r.resourceType] || 0) + 1;
    if (r.sizeBytes !== null) totalSizeBytes += r.sizeBytes;
    else unknownSizeCount++;
    if (r.isRenderBlocking) renderBlockingCount++;
    if (r.isCriticalPath) criticalPathCount++;
    if (r.isThirdParty) thirdPartyCount++;
    if (r.responseTimeMs !== null) {
      if (r.responseTimeMs > maxEndTime) maxEndTime = r.responseTimeMs;
    }
  }

  const docTime = ctx.responseTime ?? 0;

  return {
    resources,
    summary: {
      totalResources: resources.length,
      totalSizeBytes,
      unknownSizeCount,
      renderBlockingCount,
      criticalPathCount,
      thirdPartyCount,
      byType,
      documentResponseTimeMs: docTime,
      estimatedFullLoadMs: Math.max(docTime, maxEndTime),
    },
    skippedCount,
    checkedCount: resources.length,
  };
}
