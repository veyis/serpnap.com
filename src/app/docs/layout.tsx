import type { Metadata } from "next";
import {
  DocsSidebar,
  DocsSidebarMobile,
  DocsHeader,
  DocsSearchPreload,
} from "@/components/docs";
import { getCategorizedNavigation } from "@/lib/docs";

export const metadata: Metadata = {
  title: {
    default: "Documentation",
    template: "%s | SerpNap Docs",
  },
  description:
    "Comprehensive documentation for the SerpNap platform. Learn how to get started, explore features, and master the API.",
};

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categorized navigation from MDX files (server-side)
  const categories = await getCategorizedNavigation();

  return (
    <div className="min-h-screen bg-background">
      {/* Preload search index in background */}
      <DocsSearchPreload />

      {/* Docs Header */}
      <DocsHeader />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <DocsSidebar className="hidden lg:block" categories={categories} />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl px-6 py-10 lg:px-12 xl:max-w-5xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      <DocsSidebarMobile categories={categories} />
    </div>
  );
}
