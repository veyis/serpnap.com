export const SEO_PHASE_COLORS: Record<string, string> = {
  blue: "var(--color-info)",
  violet: "var(--color-primary)",
  orange: "var(--color-warning)",
  emerald: "var(--color-success)",
  sky: "var(--color-info)",
  cyan: "var(--color-info)",
  amber: "var(--color-warning)",
  purple: "var(--color-primary)",
  rose: "var(--color-destructive)",
};

export function getSeoConfettiColors(): string[] {
  if (typeof window === "undefined") {
    return ["orange", "dodgerblue", "seagreen"];
  }

  const styles = window.getComputedStyle(document.documentElement);
  const warning = styles.getPropertyValue("--color-warning").trim();
  const info = styles.getPropertyValue("--color-info").trim();
  const success = styles.getPropertyValue("--color-success").trim();

  return [
    warning || "orange",
    info || "dodgerblue",
    success || "seagreen",
  ];
}
