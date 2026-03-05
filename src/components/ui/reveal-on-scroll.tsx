"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
	children: ReactNode;
	className?: string;
	/** Animation delay in ms for staggered reveals */
	delay?: number;
	/** IntersectionObserver rootMargin — controls how early the reveal fires */
	margin?: string;
	/** IntersectionObserver threshold */
	threshold?: number;
	/** HTML element to render */
	as?: "div" | "section";
	/** Animation variant: fade-up (default), fade (opacity only), scale (zoom in) */
	variant?: "fade-up" | "fade" | "scale";
}

export function RevealOnScroll({
	children,
	className,
	delay = 0,
	margin = "0px 0px -60px 0px",
	threshold = 0.15,
	as: Tag = "div",
	variant = "fade-up",
}: RevealOnScrollProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Respect prefers-reduced-motion — show immediately
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.classList.add("reveal-visible");
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					el.classList.add("reveal-visible");
					observer.unobserve(el);
				}
			},
			{ threshold, rootMargin: margin }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold, margin]);

	return (
		<Tag
			ref={ref as React.RefObject<HTMLDivElement>}
			className={cn(
				variant === "fade" ? "reveal-fade-hidden" : variant === "scale" ? "reveal-scale-hidden" : "reveal-hidden",
				className
			)}
			style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</Tag>
	);
}
