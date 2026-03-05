import type { ContrastAnalysis, ContrastViolation } from "@/schemas/seo-checker";
import type { AnalysisContext } from "./types";

const CSS_NAMED_COLORS: Record<string, [number, number, number]> = {
  // CSS 2.1 basic colors
  black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 128, 0],
  blue: [0, 0, 255], yellow: [255, 255, 0], cyan: [0, 255, 255], magenta: [255, 0, 255],
  gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192], maroon: [128, 0, 0],
  olive: [128, 128, 0], navy: [0, 0, 128], teal: [0, 128, 128], purple: [128, 0, 128],
  aqua: [0, 255, 255], fuchsia: [255, 0, 255], lime: [0, 255, 0],
  // Common CSS3 extended colors
  orange: [255, 165, 0], pink: [255, 192, 203], brown: [165, 42, 42], coral: [255, 127, 80],
  crimson: [220, 20, 60], gold: [255, 215, 0], indigo: [75, 0, 130], ivory: [255, 255, 240],
  khaki: [240, 230, 140], lavender: [230, 230, 250], linen: [250, 240, 230],
  plum: [221, 160, 221], salmon: [250, 128, 114], sienna: [160, 82, 45], tan: [210, 180, 140],
  tomato: [255, 99, 71], violet: [238, 130, 238], wheat: [245, 222, 179],
  // Grays (very commonly used in web design)
  darkgray: [169, 169, 169], darkgrey: [169, 169, 169],
  dimgray: [105, 105, 105], dimgrey: [105, 105, 105],
  lightgray: [211, 211, 211], lightgrey: [211, 211, 211],
  gainsboro: [220, 220, 220], whitesmoke: [245, 245, 245],
  darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79],
  lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153],
  slategray: [112, 128, 144], slategrey: [112, 128, 144],
  // Blues & cyans
  aliceblue: [240, 248, 255], cadetblue: [95, 158, 160], cornflowerblue: [100, 149, 237],
  darkblue: [0, 0, 139], darkcyan: [0, 139, 139], deepskyblue: [0, 191, 255],
  dodgerblue: [30, 144, 255], lightblue: [173, 216, 230], lightskyblue: [135, 206, 250],
  lightcyan: [224, 255, 255], mediumblue: [0, 0, 205], midnightblue: [25, 25, 112],
  royalblue: [65, 105, 225], skyblue: [135, 206, 235], steelblue: [70, 130, 180],
  powderblue: [176, 224, 230], turquoise: [64, 224, 208],
  // Greens
  darkgreen: [0, 100, 0], darkolivegreen: [85, 107, 47], forestgreen: [34, 139, 34],
  limegreen: [50, 205, 50], lightgreen: [144, 238, 144], mediumseagreen: [60, 179, 113],
  seagreen: [46, 139, 87], springgreen: [0, 255, 127], yellowgreen: [154, 205, 50],
  olivedrab: [107, 142, 35], palegreen: [152, 251, 152], greenyellow: [173, 255, 47],
  // Reds & pinks
  darkred: [139, 0, 0], firebrick: [178, 34, 34], indianred: [205, 92, 92],
  lightcoral: [240, 128, 128], lightsalmon: [255, 160, 122], orangered: [255, 69, 0],
  hotpink: [255, 105, 180], deeppink: [255, 20, 147], lightpink: [255, 182, 193],
  mediumvioletred: [199, 21, 133], palevioletred: [219, 112, 147],
  // Yellows & oranges
  darkorange: [255, 140, 0], darkgoldenrod: [184, 134, 11], goldenrod: [218, 165, 32],
  lightyellow: [255, 255, 224], lemonchiffon: [255, 250, 205], palegoldenrod: [238, 232, 170],
  peachpuff: [255, 218, 185], moccasin: [255, 228, 181], papayawhip: [255, 239, 213],
  // Purples
  darkorchid: [153, 50, 204], darkviolet: [148, 0, 211], mediumpurple: [147, 112, 219],
  mediumorchid: [186, 85, 211], orchid: [218, 112, 214], rebeccapurple: [102, 51, 153],
  blueviolet: [138, 43, 226], slateblue: [106, 90, 205], thistle: [216, 191, 216],
  // Browns & earth tones
  chocolate: [210, 105, 30], peru: [205, 133, 63], saddlebrown: [139, 69, 19],
  sandybrown: [244, 164, 96], rosybrown: [188, 143, 143], burlywood: [222, 184, 135],
  bisque: [255, 228, 196], blanchedalmond: [255, 235, 205], cornsilk: [255, 248, 220],
  navajowhite: [255, 222, 173], antiquewhite: [250, 235, 215], beige: [245, 245, 220],
  floralwhite: [255, 250, 240], ghostwhite: [248, 248, 255], honeydew: [240, 255, 240],
  mintcream: [245, 255, 250], mistyrose: [255, 228, 225], oldlace: [253, 245, 230],
  seashell: [255, 245, 238], snow: [255, 250, 250], azure: [240, 255, 255],
  // Miscellaneous
  chartreuse: [127, 255, 0], darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143],
  darkturquoise: [0, 206, 209], mediumaquamarine: [102, 205, 170],
  mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204],
  paleturquoise: [175, 238, 238], aquamarine: [127, 255, 212],
  lawngreen: [124, 252, 0], lightseagreen: [32, 178, 170],
};

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function parseCSSColor(color: string): [number, number, number] | null {
  const c = color.trim().toLowerCase();

  // Skip CSS variables
  if (c.includes("var(")) return null;
  // Skip transparent / inherit / initial / currentColor
  if (c === "transparent" || c === "inherit" || c === "initial" || c === "currentcolor" || c === "unset") return null;

  // Named colors
  if (CSS_NAMED_COLORS[c]) return CSS_NAMED_COLORS[c];

  // #hex
  const hex3 = c.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (hex3) return [parseInt(hex3[1] + hex3[1], 16), parseInt(hex3[2] + hex3[2], 16), parseInt(hex3[3] + hex3[3], 16)];

  const hex6 = c.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})(?:[0-9a-f]{2})?$/);
  if (hex6) return [parseInt(hex6[1], 16), parseInt(hex6[2], 16), parseInt(hex6[3], 16)];

  // rgb(r, g, b) or rgba(r, g, b, a) — supports percentages
  const rgbMatch = c.match(/^rgba?\(\s*(\d{1,3})(%?)\s*[,\s]\s*(\d{1,3})(%?)\s*[,\s]\s*(\d{1,3})(%?)/);
  if (rgbMatch) {
    const r = rgbMatch[2] ? Math.round(parseInt(rgbMatch[1]) * 2.55) : parseInt(rgbMatch[1]);
    const g = rgbMatch[4] ? Math.round(parseInt(rgbMatch[3]) * 2.55) : parseInt(rgbMatch[3]);
    const b = rgbMatch[6] ? Math.round(parseInt(rgbMatch[5]) * 2.55) : parseInt(rgbMatch[5]);
    return [Math.min(255, r), Math.min(255, g), Math.min(255, b)];
  }

  // hsl(h, s%, l%) or hsla(h, s%, l%, a) — supports deg/turn/negative/decimal hue
  const hslMatch = c.match(/^hsla?\(\s*(-?[\d.]+)(?:deg|turn)?\s*[,\s]\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?/);
  if (hslMatch) {
    let h = parseFloat(hslMatch[1]);
    if (c.includes("turn")) h *= 360;
    h = ((h % 360) + 360) % 360; // normalize to 0-360
    return hslToRgb(h, parseFloat(hslMatch[2]), parseFloat(hslMatch[3]));
  }

  return null;
}

export function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function analyzeColorContrast(ctx: AnalysisContext): ContrastAnalysis {
  const violations: ContrastViolation[] = [];
  let passCount = 0;
  let checkedPairs = 0;

  // 1. Inline styles: style="color: X; background-color: Y" on same element
  const inlineStyleMatches = [...ctx.html.matchAll(/<[^>]+style=["']([^"']+)["'][^>]*>/gi)];
  for (const match of inlineStyleMatches) {
    const style = match[1];
    const fgMatch = style.match(/(?:^|;)\s*color\s*:\s*([^;!]+)/i);
    // Match background-color first, fall back to background shorthand (only if value looks like a color)
    const bgMatch = style.match(/background-color\s*:\s*([^;!]+)/i) ||
      style.match(/background\s*:\s*([^;!]+)/i);

    if (fgMatch && bgMatch) {
      const fg = parseCSSColor(fgMatch[1]);
      const bg = parseCSSColor(bgMatch[1]);
      if (fg && bg) {
        checkedPairs++;
        const ratio = contrastRatio(fg, bg);

        // Detect large text: 18px+, 1.2rem+, h1-3 tags, or 14px+ bold (WCAG AA)
        const isBold = /font-weight\s*:\s*(bold|[7-9]\d{2}|1000)/i.test(style) || /<(b|strong)[\s>]/i.test(match[0]);
        const hasFontSize14ptPlus = /font-size\s*:\s*(1[89]|[2-9]\d|\d{3,})px/i.test(style) || /font-size\s*:\s*(1\.[2-9]|[2-9](\.\d+)?)\s*rem/i.test(style);
        const isLargeText = /font-size\s*:\s*(1[89]|[2-9]\d|\d{3,})px/i.test(style) ||
          /font-size\s*:\s*(1\.[2-9]|[2-9](\.\d+)?)\s*rem/i.test(style) ||
          (/<h[1-3][\s>]/i.test(match[0])) ||
          (isBold && hasFontSize14ptPlus);
        const requiredRatio = isLargeText ? 3 : 4.5;

        if (ratio < requiredRatio) {
          // Extract context — tag name and first bit of text
          const tagMatch = match[0].match(/^<(\w+)/);
          const context = tagMatch ? `<${tagMatch[1]}>` : "element";
          violations.push({
            foreground: fgMatch[1].trim(),
            background: bgMatch[1].trim(),
            ratio: Math.round(ratio * 100) / 100,
            requiredRatio,
            context,
            isLargeText,
          });
        } else {
          passCount++;
        }
      }
    }
  }

  // 2. <style> blocks: extract rules with both color and background-color
  const styleBlocks = ctx.html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  for (const block of styleBlocks) {
    const cssContent = block.replace(/<\/?style[^>]*>/gi, "");

    // Skip dark mode media queries
    const withoutDarkMode = cssContent.replace(/@media\s*\([^)]*prefers-color-scheme\s*:\s*dark[^)]*\)\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/gi, "");

    // Extract CSS rules
    const ruleMatches = [...withoutDarkMode.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
    for (const rule of ruleMatches) {
      const selector = rule[1].trim();
      const declarations = rule[2];

      const fgMatch = declarations.match(/(?:^|;)\s*color\s*:\s*([^;!]+)/i);
      // Match background-color first, fall back to background shorthand
      const bgMatch = declarations.match(/background-color\s*:\s*([^;!]+)/i) ||
        declarations.match(/background\s*:\s*([^;!]+)/i);

      if (fgMatch && bgMatch) {
        const fg = parseCSSColor(fgMatch[1]);
        const bg = parseCSSColor(bgMatch[1]);
        if (fg && bg) {
          checkedPairs++;
          const ratio = contrastRatio(fg, bg);
          // Large text: h1-3 selectors, or selectors with large font-size, or bold + 18px+ (≈14pt per WCAG)
          const hasBoldWeight = /font-weight\s*:\s*(bold|[7-9]\d{2}|1000)/i.test(declarations);
          const hasBoldFontSize18Plus = /font-size\s*:\s*(1[89]|[2-9]\d|\d{3,})px/i.test(declarations) || /font-size\s*:\s*(1\.[2-9]|[2-9](\.\d+)?)\s*rem/i.test(declarations);
          const isLargeText = /^h[1-3]\b/i.test(selector) ||
            /font-size\s*:\s*(1[89]|[2-9]\d|\d{3,})px/i.test(declarations) ||
            /font-size\s*:\s*(1\.[2-9]|[2-9](\.\d+)?)\s*rem/i.test(declarations) ||
            (hasBoldWeight && hasBoldFontSize18Plus);
          const requiredRatio = isLargeText ? 3 : 4.5;

          if (ratio < requiredRatio) {
            violations.push({
              foreground: fgMatch[1].trim(),
              background: bgMatch[1].trim(),
              ratio: Math.round(ratio * 100) / 100,
              requiredRatio,
              context: selector.slice(0, 60),
              isLargeText,
            });
          } else {
            passCount++;
          }
        }
      }
    }
  }

  return {
    violationCount: violations.length,
    violations: violations.slice(0, 10), // Cap at 10 for display
    passCount,
    checkedPairs,
  };
}
