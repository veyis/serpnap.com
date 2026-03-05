export const VOID_HTML_ELEMENTS = new Set([
  "area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr",
]);

export function extractRSCPayloadChunks(html: string): string[] {
  const chunks: string[] = [];
  const regex = /self\.__next_f\.push\(\[\d+,"((?:[^"\\]|\\.)*)"\]\)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      chunks.push(JSON.parse(`"${match[1]}"`));
    } catch {
      /* skip malformed chunks */
    }
  }
  return chunks;
}

export function rscNodeToHTML(node: unknown, depth: number): string {
  if (depth > 80 || node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string") {
    // Filter RSC internal references but keep real content like "$99"
    // RSC refs: $undefined, $Sreact.suspense, $L2a, $$, $@id, $!
    if (/^\$(?:undefined$|[A-Z$@!])/.test(node)) return "";
    // Concatenated lazy refs: "$L2a$L32$L33$L34" (no spaces, contains $L+hex)
    if (/\$L[0-9a-f]/i.test(node) && !/\s/.test(node)) return "";
    return node;
  }
  if (typeof node === "number") return String(node);

  if (Array.isArray(node)) {
    // RSC element: ["$", "tagName", key, props]
    if (node[0] === "$" && typeof node[1] === "string") {
      const tag = node[1] as string;
      const props = (node[3] as Record<string, unknown>) || {};

      // Custom/framework components (uppercase, $L refs, etc.)
      // Detect Next.js Link (has href) → render as <a>
      // Detect Next.js Image (has src) → render as <img>
      if (tag.startsWith("$") || tag.startsWith("L") || /^[A-Z]/.test(tag)) {
        if (typeof props.href === "string" && props.children) {
          const children = rscNodeToHTML(props.children, depth + 1);
          return `<a href="${String(props.href).replace(/"/g, "&quot;")}">${children}</a>`;
        }
        if (typeof props.src === "string") {
          const alt = typeof props.alt === "string" ? props.alt : "";
          const w = props.width ? ` width="${props.width}"` : "";
          const h = props.height ? ` height="${props.height}"` : "";
          // Mark component images (e.g. next/image) so dimension check skips fill-mode images
          return `<img src="${String(props.src).replace(/"/g, "&quot;")}" alt="${alt.replace(/"/g, "&quot;")}"${w}${h} data-nimg="rsc" />`;
        }
        return props.children ? rscNodeToHTML(props.children, depth + 1) : "";
      }

      const attrMap: Record<string, string> = {
        className: "class", htmlFor: "for", dateTime: "datetime", tabIndex: "tabindex",
      };
      const keepAttrs = [
        "href","src","alt","id","rel","type","name","content","className",
        "dateTime","aria-label","role","data-speakable","tabIndex","width","height","loading",
      ];
      const attrs = keepAttrs
        .filter(a => props[a] !== undefined && props[a] !== null && typeof props[a] !== "object")
        .map(a => `${attrMap[a] || a}="${String(props[a]).replace(/"/g, "&quot;")}"`)
        .join(" ");

      if (VOID_HTML_ELEMENTS.has(tag)) return `<${tag}${attrs ? " " + attrs : ""} />`;
      const children = props.children ? rscNodeToHTML(props.children, depth + 1) : "";
      return `<${tag}${attrs ? " " + attrs : ""}>${children}</${tag}>`;
    }
    return node.map(child => rscNodeToHTML(child, depth + 1)).join("");
  }

  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if ("children" in obj) return rscNodeToHTML(obj.children, depth + 1);
  }
  return "";
}

export function extractHTMLFromRSC(rawHtml: string): string {
  const chunks = extractRSCPayloadChunks(rawHtml);
  if (chunks.length === 0) return "";
  const fullPayload = chunks.join("");
  const lines = fullPayload.split("\n").filter(Boolean);
  const htmlParts: string[] = [];
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1 || colonIdx > 10) continue;
    const data = line.slice(colonIdx + 1).trim();
    if (data.startsWith("[") || data.startsWith("{")) {
      try {
        htmlParts.push(rscNodeToHTML(JSON.parse(data), 0));
      } catch {
        /* skip unparseable lines */
      }
    } else if (data.startsWith('"')) {
      // Standalone text strings in RSC payload (e.g. 5:"Some content text")
      try {
        const str = JSON.parse(data);
        if (typeof str === "string" && str.length > 2
          && !/^\$/.test(str)               // RSC type markers ($Sreact.fragment, etc.)
          && !/^https?:\/\//.test(str)       // URLs
          && !/^[a-f0-9]{8,}$/i.test(str)   // hex hashes
          && !/^[\w-]+\/[\w-]+/.test(str)    // MIME types or paths
          && str.includes(" ")              // must contain spaces (real text, not identifiers)
        ) {
          htmlParts.push(`<span>${str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`);
        }
      } catch {
        /* skip */
      }
    }
  }
  let result = htmlParts.join("\n");
  // Strip head-level elements to avoid duplicates with the real <head>
  result = result.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "");
  result = result.replace(/<meta[^>]*>/gi, "");
  result = result.replace(/<link[^>]*>/gi, "");
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  return result;
}
