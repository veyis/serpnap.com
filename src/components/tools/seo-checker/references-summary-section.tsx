import { Info } from "lucide-react";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import { SEO_CATEGORY_REFERENCES } from "@/lib/data/seo-references";
import {
  CategoryReferenceInfo,
  type SEOReferenceCategoryKey,
} from "./category-reference-info";

const CATEGORY_REFERENCE_ORDER: Array<{
  key: SEOReferenceCategoryKey;
  label: string;
}> = [
  { key: "technical", label: "Technical" },
  { key: "meta", label: "Meta Tags" },
  { key: "content", label: "Content" },
  { key: "structured", label: "Schema" },
  { key: "accessibility", label: "Accessibility" },
  { key: "international", label: "International" },
  { key: "eeat", label: "E-E-A-T" },
  { key: "mobile", label: "Mobile" },
];

export function ReferencesSummarySection({
  categories,
}: {
  categories: SEOCheckResult["categories"];
}) {
  const visibleCategories = CATEGORY_REFERENCE_ORDER.filter(({ key }) =>
    Boolean(categories[key as keyof typeof categories]),
  );

  if (visibleCategories.length === 0) return null;

  return (
    <section className="rounded-2xl bg-[var(--seo-surface)] shadow-[var(--seo-card-shadow)] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-info" />
        <h2 className="text-sm font-semibold text-[var(--seo-text)]">References</h2>
      </div>
      <p className="text-xs text-[var(--seo-text-muted)] mb-3">
        Every category is mapped to official documentation. Click the info icons
        to open source links.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {visibleCategories.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-lg bg-[var(--seo-surface)] px-2.5 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--seo-text-secondary)] font-medium">{label}</span>
              <CategoryReferenceInfo
                categoryKey={key}
                ariaLabel={`References for ${label}`}
                iconClassName="text-[var(--seo-text-muted)]"
              />
            </div>
            <p className="text-[10px] text-[var(--seo-text-muted)] mt-1">
              {SEO_CATEGORY_REFERENCES[key].length} official source
              {SEO_CATEGORY_REFERENCES[key].length > 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
