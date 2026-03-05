import "server-only";
import { cache } from "react";
import { getAllDocPaths, getDocByPath } from "./loader";
import type {
  DocNavSection,
  DocNavItem,
  DocNavContext,
  DocNavCategory,
} from "./schema";

/**
 * Navigation section configuration organized by logical categories.
 *
 * CATEGORIES:
 * 1. SEO & Organic - SEO and Local SEO documentation
 */

type SectionConfig = Omit<DocNavSection, "items">;

interface CategoryConfig {
  title: string;
  sections: SectionConfig[];
}

const navigationCategories: CategoryConfig[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SEO & ORGANIC - Free traffic channels
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "SEO & Organic",
    sections: [
      {
        title: "SEO Guide",
        slug: "seo",
        icon: "search",
        category: "SEO & Organic",
      },
      {
        title: "Local SEO",
        slug: "local-seo",
        icon: "mapPin",
        category: "SEO & Organic",
      },
    ],
  },
];

/**
 * Flattened navigation config for backwards compatibility
 */
const navigationConfig: SectionConfig[] = navigationCategories.flatMap(
  (cat) => cat.sections
);

/**
 * Build section items from file system
 */
async function buildSectionItems(
  slug: string,
  allPaths: string[]
): Promise<DocNavItem[]> {
  const sectionPaths = allPaths.filter((p) => p.startsWith(`${slug}/`));
  const items: DocNavItem[] = [];

  for (const docPath of sectionPaths) {
    const doc = await getDocByPath(docPath);
    if (!doc) continue;

    items.push({
      title: doc.frontmatter.title,
      slug: doc.slug,
      path: docPath,
      description: doc.frontmatter.description,
      badge: doc.frontmatter.badge,
      order: doc.frontmatter.order,
    });
  }

  // Sort by order, then alphabetically
  items.sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });

  return items;
}

/**
 * Build full navigation structure from file system + config.
 * Sections without any docs are excluded.
 */
export const getDocsNavigation = cache(
  async (): Promise<DocNavSection[]> => {
    const allPaths = await getAllDocPaths();
    const navigation: DocNavSection[] = [];

    for (const config of navigationConfig) {
      const items = await buildSectionItems(config.slug, allPaths);
      if (items.length === 0) continue;

      navigation.push({
        ...config,
        items,
      });
    }

    return navigation;
  }
);

/**
 * Build categorized navigation structure.
 * Groups sections into logical categories for better UX.
 */
export const getCategorizedNavigation = cache(
  async (): Promise<DocNavCategory[]> => {
    const allPaths = await getAllDocPaths();
    const categories: DocNavCategory[] = [];

    for (const catConfig of navigationCategories) {
      const sections: DocNavSection[] = [];

      for (const sectionConfig of catConfig.sections) {
        const items = await buildSectionItems(sectionConfig.slug, allPaths);
        if (items.length === 0) continue;

        sections.push({
          ...sectionConfig,
          items,
        });
      }

      // Only include category if it has sections with content
      if (sections.length > 0) {
        categories.push({
          title: catConfig.title,
          sections,
        });
      }
    }

    return categories;
  }
);

/**
 * Get previous and next pages for navigation.
 * Flattens all sections into a single ordered list.
 */
export const getDocNavContext = cache(
  async (currentPath: string): Promise<DocNavContext> => {
    const nav = await getDocsNavigation();

    // Flatten all paths in order
    const allPaths = nav.flatMap((section) =>
      section.items.map((item) => item.path)
    );

    const currentIndex = allPaths.indexOf(currentPath);

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const getPrevNextInfo = async (
      pagePath: string | undefined
    ): Promise<{ title: string; href: string } | null> => {
      if (!pagePath) return null;
      const doc = await getDocByPath(pagePath);
      if (!doc) return null;
      return {
        title: doc.frontmatter.title,
        href: `/docs/${pagePath}`,
      };
    };

    const [prev, next] = await Promise.all([
      getPrevNextInfo(allPaths[currentIndex - 1]),
      getPrevNextInfo(allPaths[currentIndex + 1]),
    ]);

    return { prev, next };
  }
);

/**
 * Find which section a doc path belongs to
 */
export const getDocSection = cache(
  async (docPath: string): Promise<DocNavSection | null> => {
    const sectionSlug = docPath.split("/")[0];
    const nav = await getDocsNavigation();
    return nav.find((s) => s.slug === sectionSlug) ?? null;
  }
);
