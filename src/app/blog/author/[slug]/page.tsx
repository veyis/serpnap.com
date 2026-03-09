import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { config } from "@/lib/config";
import { getAllPosts } from "@/lib/blog/registry";

// Author data - in a real app, this would come from a CMS/database
const authors = {
  "serpnap-team": {
    name: "SerpNap Team",
    role: "SEO Director",
    bio: "The SerpNap team consists of SEO experts with over 8+ years of combined experience in search engine optimization, content marketing, and technical SEO. We specialize in helping businesses improve their organic search visibility and drive sustainable growth through data-driven SEO strategies.",
    avatar: "/images/authors/serpnap-team.jpg", // Placeholder - replace with actual image
    social: {
      linkedin: config.business.social.linkedin,
      twitter: config.business.social.twitter,
    },
    expertise: [
      "Technical SEO",
      "Content Strategy",
      "E-E-A-T Optimization",
      "Local SEO",
      "AI Search Optimization",
      "Core Web Vitals",
    ],
    credentials: [
      "8+ years SEO experience",
      "400+ articles published",
      "2M+ organic visits generated",
      "Enterprise SEO campaigns",
      "Google Search Console certified",
    ],
  },
  // Add more authors as needed
};

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = authors[slug as keyof typeof authors];

  if (!author) {
    return {
      title: "Author Not Found | SerpNap",
    };
  }

  return {
    title: `${author.name} | ${config.brand.name}`,
    description: `${author.bio.substring(0, 155)}...`,
    keywords: ["SEO expert", "content writer", author.name, "SEO consultant"],
    openGraph: {
      title: `${author.name} - ${author.role}`,
      description: author.bio,
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({
    slug,
  }));
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = authors[slug as keyof typeof authors];

  if (!author) {
    notFound();
  }

  // Get author's posts
  const allPostsResult = await getAllPosts();
  const authorPosts = allPostsResult.posts.filter(
    (post) => post.author?.slug === slug,
  );

  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      knowsAbout: author.expertise,
      hasCredential: author.credentials,
      sameAs: [author.social.linkedin, author.social.twitter].filter(Boolean),
    },
  };

  return (
    <div className="container-wide container-padding py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Author Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
          <p className="text-xl text-muted-foreground mb-4">{author.role}</p>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            {author.bio}
          </p>
        </div>

        {/* Expertise & Credentials */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Expertise</h2>
            <ul className="space-y-2">
              {author.expertise.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Credentials</h2>
            <ul className="space-y-2">
              {author.credentials.map((credential, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{credential}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-4">Connect</h2>
          <div className="flex justify-center gap-4">
            {author.social.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            )}
            {author.social.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* Author's Posts */}
        {authorPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Articles by {author.name}
            </h2>
            <div className="grid gap-6">
              {authorPosts.map((post) => (
                <article key={post.slug} className="border rounded-lg p-6">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
