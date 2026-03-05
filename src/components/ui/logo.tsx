import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// PXLPEAK LOGO SYSTEM v3 — Premium Tech Horizontal Lockup
// ═══════════════════════════════════════════════════════════════════════════════
//
// Design principles:
// - Gold Möbius loop icon (premium monochrome)
// - Switzer Bold with system fallback stack
// - Icon = 1.5× fontSize for visual anchoring
// - Gap = ⅓ cap-height (fontSize × 0.72 × 0.33)
// - Per-character optical kerning for display impact
// - "Pxl" at 60% opacity / "Peak" full weight (subtle hierarchy)
// ═══════════════════════════════════════════════════════════════════════════════

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type LogoVariant = "full" | "icon" | "text";

// ═══════════════════════════════════════════════════════════════════════════════
// PEAK MARK — Gold Möbius loop icon
// ═══════════════════════════════════════════════════════════════════════════════

function PeakMark({
	size,
	className,
}: {
	size: number;
	className?: string;
}) {
	return (
		<img
			src="/serpnap-logo-cropped.png"
			alt="SerpNap logo"
			width={size}
			height={size}
			className={cn("shrink-0 object-contain", className)}
			draggable={false}
		/>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const LOGO_FONT =
	'Switzer, "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

const LOGO_CONFIG = {
	// Icon = 1.5× fontSize for prominent gold mark, gap tuned per size
	sizes: {
		xs: { fontSize: 13, iconSize: 20, gap: 4 },
		sm: { fontSize: 16, iconSize: 24, gap: 5 },
		md: { fontSize: 20, iconSize: 30, gap: 6 },
		lg: { fontSize: 26, iconSize: 39, gap: 7 },
		xl: { fontSize: 32, iconSize: 48, gap: 9 },
		"2xl": { fontSize: 40, iconSize: 60, gap: 10 },
	},
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// WORDMARK — Per-character optical kerning
// ═══════════════════════════════════════════════════════════════════════════════

/** Optical kerning values (em) for each character in "SerpNap" */
const KERN: Record<string, number> = {
	P1: -0.020, // P→x: P's bowl creates optical space
	x:  -0.010, // x→l: diagonal meets vertical
	l:  -0.025, // l→P: thin stem looks gapped next to wide cap
	P2: -0.015, // P→e: bowl + round char
	e:  -0.005, // e→a: both round, minimal
	a:  -0.008, // a→k: slight tighten
	k:   0,     // last char
};

const WORDMARK_CHARS: { char: string; kern: number; muted?: boolean }[] = [
	{ char: "P", kern: KERN.P1, muted: true },
	{ char: "x", kern: KERN.x, muted: true },
	{ char: "l", kern: KERN.l, muted: true },
	{ char: "P", kern: KERN.P2 },
	{ char: "e", kern: KERN.e },
	{ char: "a", kern: KERN.a },
	{ char: "k", kern: KERN.k },
];

/** Renders "SerpNap" with per-character optical kerning */
export function Wordmark({
	fontSize,
	className,
}: {
	fontSize: number;
	className?: string;
}) {
	return (
		<span
			className={className}
			style={{
				fontFamily: LOGO_FONT,
				fontSize: `${fontSize}px`,
				fontWeight: 700,
				lineHeight: 1.15,
				fontKerning: "none",
				textRendering: "optimizeLegibility" as const,
				WebkitFontSmoothing: "antialiased" as const,
				MozOsxFontSmoothing: "grayscale" as const,
			}}
		>
			{WORDMARK_CHARS.map((ch, i) => (
				<span
					key={i}
					style={{
						...(ch.kern !== 0 ? { letterSpacing: `${ch.kern}em` } : {}),
						...(ch.muted ? { opacity: 0.6 } : {}),
					}}
				>
					{ch.char}
				</span>
			))}
		</span>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface LogoProps {
	variant?: LogoVariant;
	size?: LogoSize;
	className?: string;
	iconClassName?: string;
	textClassName?: string;
	animated?: boolean;
	ariaLabel?: string;
	priority?: boolean;
}

interface LogoIconProps {
	size?: LogoSize;
	className?: string;
	animated?: boolean;
	priority?: boolean;
}

interface LogoTextProps {
	size?: LogoSize;
	className?: string;
}

interface NavLogoProps {
	className?: string;
	compact?: boolean;
	priority?: boolean;
}

interface FooterLogoProps {
	className?: string;
}

interface VerticalLogoProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

interface LogoBadgeProps {
	size?: number;
	className?: string;
}

interface MonochromeLogoProps {
	size?: LogoSize;
	color?: "current" | "light" | "dark";
	className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LOGO
// ═══════════════════════════════════════════════════════════════════════════════

export function Logo({
	variant = "full",
	size = "md",
	className,
	iconClassName,
	textClassName,
	animated = false,
	ariaLabel = "SerpNap",
}: LogoProps) {
	const cfg = LOGO_CONFIG.sizes[size];

	return (
		<div
			className={cn(
				"flex items-center",
				animated && "transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]",
				className,
			)}
			style={{ gap: `${cfg.gap}px` }}
			role="img"
			aria-label={ariaLabel}
		>
			{(variant === "full" || variant === "icon") && (
				<PeakMark
					size={cfg.iconSize}
					className={cn("shrink-0 text-foreground", iconClassName)}
				/>
			)}
			{(variant === "full" || variant === "text") && (
				<Wordmark
					fontSize={cfg.fontSize}
					className={cn("text-foreground select-none", textClassName)}
					{...(variant === "full" ? { "aria-hidden": true } : {})}
				/>
			)}
			{variant === "icon" && <span className="sr-only">SerpNap</span>}
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGO ICON — standalone icon
// ═══════════════════════════════════════════════════════════════════════════════

export function LogoIcon({
	size = "md",
	className,
	animated = false,
}: LogoIconProps) {
	const cfg = LOGO_CONFIG.sizes[size];

	return (
		<div
			className={cn(
				"shrink-0",
				animated && "hover:scale-[1.03] active:scale-[0.97]",
				className,
			)}
			role="img"
			aria-label="SerpNap"
		>
			<PeakMark size={cfg.iconSize} className="text-foreground" />
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGO TEXT — standalone wordmark
// ═══════════════════════════════════════════════════════════════════════════════

export function LogoText({ size = "md", className }: LogoTextProps) {
	const cfg = LOGO_CONFIG.sizes[size];

	return (
		<Wordmark
			fontSize={cfg.fontSize}
			className={cn("text-foreground select-none", className)}
			{...{ role: "img", "aria-label": "SerpNap" }}
		/>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV LOGO — optimized for navigation bar
// ═══════════════════════════════════════════════════════════════════════════════

export function NavLogo({ className, compact = false }: NavLogoProps) {
	const cfg = compact ? LOGO_CONFIG.sizes.sm : LOGO_CONFIG.sizes.md;

	return (
		<div
			className={cn("flex items-center group", className)}
			style={{ gap: `${cfg.gap}px` }}
		>
			<PeakMark
				size={cfg.iconSize}
				className="shrink-0 text-foreground transition-transform duration-300 group-hover:scale-[1.03]"
			/>
			<Wordmark
				fontSize={cfg.fontSize}
				className="text-foreground select-none"
			/>
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER LOGO — larger for footer hierarchy
// ═══════════════════════════════════════════════════════════════════════════════

export function FooterLogo({ className }: FooterLogoProps) {
	const cfg = LOGO_CONFIG.sizes.lg;

	return (
		<div
			className={cn("flex items-center group", className)}
			style={{ gap: `${cfg.gap}px` }}
		>
			<PeakMark
				size={cfg.iconSize}
				className="shrink-0 text-foreground transition-transform duration-300 group-hover:scale-[1.03]"
			/>
			<Wordmark
				fontSize={cfg.fontSize}
				className="text-foreground select-none"
			/>
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERTICAL LOGO — stacked layout
// ═══════════════════════════════════════════════════════════════════════════════

export function VerticalLogo({ size = "md", className }: VerticalLogoProps) {
	const sizeConfig = {
		sm: { iconSize: 28, fontSize: 13, gap: 3 },
		md: { iconSize: 38, fontSize: 15, gap: 4 },
		lg: { iconSize: 50, fontSize: 18, gap: 5 },
	};
	const cfg = sizeConfig[size];

	return (
		<div
			className={cn("flex flex-col items-center group", className)}
			style={{ gap: `${cfg.gap}px` }}
			role="img"
			aria-label="SerpNap"
		>
			<PeakMark
				size={cfg.iconSize}
				className="shrink-0 text-foreground transition-transform duration-300 group-hover:scale-[1.03]"
			/>
			<Wordmark
				fontSize={cfg.fontSize}
				className="text-foreground select-none text-center"
				{...{ "aria-hidden": true }}
			/>
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGO BADGE — circular container
// ═══════════════════════════════════════════════════════════════════════════════

export function LogoBadge({ size = 40, className }: LogoBadgeProps) {
	const iconSize = Math.round(size * 0.6);

	return (
		<div
			className={cn(
				"relative flex items-center justify-center rounded-full",
				"bg-background border border-border",
				className,
			)}
			style={{ width: size, height: size }}
			role="img"
			aria-label="SerpNap"
		>
			<PeakMark size={iconSize} className="text-foreground" />
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MONOCHROME LOGO — single-color variant
// ═══════════════════════════════════════════════════════════════════════════════

export function MonochromeLogo({
	size = "md",
	color = "current",
	className,
}: MonochromeLogoProps) {
	const cfg = LOGO_CONFIG.sizes[size];

	const colorClass = {
		current: "text-current",
		light: "text-white",
		dark: "text-foreground",
	}[color];

	return (
		<div
			className={cn("flex items-center", colorClass, className)}
			style={{ gap: `${cfg.gap}px` }}
			role="img"
			aria-label="SerpNap"
		>
			<PeakMark size={cfg.iconSize} className="shrink-0" />
			<Wordmark
				fontSize={cfg.fontSize}
				className="select-none"
				{...{ "aria-hidden": true }}
			/>
		</div>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/** @deprecated Use LogoIcon instead */
export function LogoMinimal({
	size = "md",
	className,
}: {
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}) {
	const sizeMap: Record<string, LogoSize> = { sm: "sm", md: "md", lg: "lg", xl: "xl" };
	return <LogoIcon size={sizeMap[size] || "md"} className={className} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
	LogoProps,
	LogoIconProps,
	LogoTextProps,
	NavLogoProps,
	FooterLogoProps,
	VerticalLogoProps,
	LogoBadgeProps,
	MonochromeLogoProps,
};
