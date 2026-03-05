import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DocsContentMdx } from "@/components/docs";
import {
  getDocByPath,
  getAllDocPaths,
  getDocNavContext,
  getDocSection,
  getDocsNavigation,
} from "@/lib/docs";
import type { DocNavSection } from "@/lib/docs/schema";
import { config } from "@/lib/config";
import {
  Rocket,
  Layers,
  Sparkles,
  Code2,
  BookOpen,
  FolderOpen,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Generate static params for all doc pages
export async function generateStaticParams() {
  const paths = await getAllDocPaths();
  return [
    { slug: undefined },
    ...paths.map((path) => ({
      slug: path.split("/"),
    })),
  ];
}

// Generate metadata for each doc page
export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Handle base /docs route
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    return {
      title: "Documentation",
      description:
        "Comprehensive documentation for the SerpNap platform. Learn how to get started, explore features, and master the API.",
      alternates: {
        canonical: `${config.appUrl}/docs`,
      },
    };
  }

  const path = slug.join("/");
  const doc = await getDocByPath(path);

  if (!doc) {
    return { title: "Not Found" };
  }

  return {
    title: doc.frontmatter.seo?.metaTitle || doc.frontmatter.title,
    description: doc.frontmatter.seo?.metaDescription || doc.frontmatter.description,
    alternates: {
      canonical: `${config.appUrl}/docs/${path}`,
    },
  };
}

async function DocPageContent({ slug }: { slug?: string[] }) {
  // Handle base /docs route - render index page
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    const navigation = await getDocsNavigation();
    return <DocsIndexPage navigation={navigation} />;
  }

  const path = slug.join("/");

  // SECURITY: Validate path against whitelist to prevent path traversal
  const validPaths = await getAllDocPaths();
  if (!validPaths.includes(path)) {
    notFound();
  }

  const doc = await getDocByPath(path);

  if (!doc) {
    notFound();
  }

  const { prev, next } = await getDocNavContext(path);
  const section = await getDocSection(path);

  // Dynamically import the MDX file
  let MdxContent: React.ComponentType;
  try {
    const mdxModule = await import(`@/content/docs/${path}.mdx`);
    MdxContent = mdxModule.default;
  } catch {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-foreground/40">
        <Link
          href="/docs"
          className="hover:text-foreground/60 transition-colors"
        >
          Docs
        </Link>
        <span>/</span>
        {section && (
          <>
            <span className="text-foreground/60">{section.title}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground/80">{doc.frontmatter.title}</span>
      </nav>

      <DocsContentMdx
        title={doc.frontmatter.title}
        description={doc.frontmatter.description}
        lastUpdated={doc.frontmatter.lastUpdated}
        readingTimeMinutes={doc.readingTimeMinutes}
        tableOfContents={doc.tableOfContents}
        prevPage={prev}
        nextPage={next}
      >
        <MdxContent />
      </DocsContentMdx>
    </>
  );
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;

  return (
    <Suspense>
      <DocPageContent slug={slug} />
    </Suspense>
  );
}

// Docs index page component
function DocsIndexPage({ navigation }: { navigation: DocNavSection[] }) {
  const iconMap: Record<string, React.ElementType> = {
    rocket: Rocket,
    layers: Layers,
    sparkles: Sparkles,
    code: Code2,
    book: BookOpen,
    folder: FolderOpen,
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time analytics with sub-second response times",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Edge-deployed infrastructure across 30+ regions",
    },
  ];

  return (
    <div className="max-w-4xl">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          v2.0 just released
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
          Documentation
        </h1>
        <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
          Everything you need to build, integrate, and scale with SerpNap.
          Start with the basics or dive straight into the API.
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="mb-16 grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs/getting-started/quick-start"
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border/40 p-6 transition-[border-color,box-shadow] duration-300",
            "bg-linear-to-br from-foreground/5 to-transparent",
            "hover:border-border hover:shadow-lg hover:shadow-foreground/5"
          )}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
            <Rocket className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Quick Start
          </h2>
          <p className="mb-4 text-sm text-foreground/60 leading-relaxed">
            Get up and running in under 5 minutes with our step-by-step guide.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
            Start building
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-foreground/5 blur-2xl transition-opacity group-hover:opacity-60" />
        </Link>

        <Link
          href="/docs/api/overview"
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border/40 p-6 transition-[border-color,box-shadow] duration-300",
            "bg-linear-to-br from-foreground/5 to-transparent",
            "hover:border-border hover:shadow-lg hover:shadow-foreground/5"
          )}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10 text-foreground">
            <Code2 className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            API Reference
          </h2>
          <p className="mb-4 text-sm text-foreground/60 leading-relaxed">
            Complete API documentation with examples in multiple languages.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
            Explore API
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-foreground/5 blur-2xl transition-opacity group-hover:opacity-60" />
        </Link>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Why SerpNap
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/5">
                <feature.icon className="h-5 w-5 text-foreground/60" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
                <p className="mt-1 text-sm text-foreground/50">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Sections */}
      <div>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Browse Documentation
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {navigation.map((section) => {
            const Icon = iconMap[section.icon || "folder"] || FolderOpen;
            const firstItem = section.items[0];
            if (!firstItem) return null;
            const href = `/docs/${firstItem.path}`;

            return (
              <Link
                key={section.slug}
                href={href}
                className={cn(
                  "group rounded-xl border border-border/40 p-5 transition-[border-color,box-shadow] duration-200",
                  "hover:border-border hover:bg-foreground/5"
                )}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/60 transition-colors group-hover:bg-foreground/5 group-hover:text-foreground/80">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {section.items.slice(0, 3).map((item) => (
                    <li
                      key={item.slug}
                      className="text-sm text-foreground/50 transition-colors group-hover:text-foreground/60"
                    >
                      {item.title}
                    </li>
                  ))}
                  {section.items.length > 3 && (
                    <li className="text-sm text-foreground/40">
                      +{section.items.length - 3} more
                    </li>
                  )}
                </ul>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-16 rounded-2xl border border-border/40 bg-foreground/5 p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Need help?
        </h2>
        <p className="mb-6 text-foreground/60">
          Can't find what you're looking for? Our team is here to help.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            Contact Support
          </Link>
          <Link
            href="/docs/resources/faq"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium transition-colors",
              "text-foreground/70 hover:border-border hover:text-foreground hover:bg-foreground/5"
            )}
          >
            Browse FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
