/**
 * Enhanced Author Profiles for E-E-A-T SEO Signals
 *
 * These profiles provide additional context for author pages:
 * - Bio and expertise for credibility
 * - Certifications for authority
 * - Experience details for expertise signals
 *
 * IMPORTANT: Only add profiles for real contributors with actual blog posts.
 * Do not add fake social links — only include verified, live URLs.
 */

import { config } from "@/lib/config";

export interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio: string;
  expertise: string[];
  certifications?: string[];
  yearsOfExperience: number;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  education?: string[];
  publications?: number;
  speakingEngagements?: string[];
}

/**
 * Author profiles — only for contributors with published blog posts.
 * Social links must be verified, real URLs. No fabricated profiles.
 */
export const authorProfiles: Record<string, AuthorProfile> = {
  "john-v-akgul": {
    slug: "john-v-akgul",
    name: "John V. Akgul",
    role: "Founder & Lead Developer",
    bio: "John V. Akgul is a software engineer, fintech specialist, and entrepreneur with over 30 years of hands-on experience building enterprise-grade software for the global financial industry. He is the founder of SerpNap and ByteTonic, where he leads the development of modern web applications and digital products for businesses worldwide. For 18 years, John worked in New York's banking sector, developing mission-critical software for leading financial institutions spanning core banking platforms, financial reporting systems, and regulatory compliance tools — earning him Federal Reserve certifications and the Z.Bank Innovation Award for developing a groundbreaking balance sheet audit tool.",
    expertise: [
      "Fintech",
      "Banking Systems",
      "Next.js",
      "React",
      "Python",
      "Enterprise Software Development",
      "Web Application Development",
      "SEO",
      "Full-Stack Development",
    ],
    certifications: [
      "Federal Reserve Certification",
    ],
    yearsOfExperience: 30,
    social: {
      website: config.appUrl,
    },
    education: [
      "Computer Programming",
      "Computer Science",
    ],
  },
  "can-genc": {
    slug: "can-genc",
    name: "Can Genc",
    role: "Founder & AI Strategist",
    bio: "Can Genc is the founder of SerpNap and a hands-on AI strategist who helps businesses integrate AI tools into their daily operations. With deep expertise in web development, SEO, and automation, Can bridges the gap between cutting-edge AI capabilities and real-world business outcomes.",
    expertise: [
      "AI Strategy",
      "Web Development",
      "SEO & GEO",
      "Business Automation",
      "AI Tool Integration",
    ],
    yearsOfExperience: 10,
    social: {
      website: config.appUrl,
    },
  },
  "can-duruk": {
    slug: "can-duruk",
    name: "Can Duruk",
    role: "Founder & CEO",
    bio: "Can Duruk is a technology leader and entrepreneur focused on helping businesses leverage AI for competitive advantage. His executive-level perspective on digital transformation informs SerpNap's strategic direction and client advisory services.",
    expertise: [
      "AI Strategy",
      "Digital Transformation",
      "Business Development",
      "Technology Leadership",
    ],
    yearsOfExperience: 15,
    social: {
      website: config.appUrl,
    },
  },
  "serpnap-team": {
    slug: "serpnap-team",
    name: "SerpNap Team",
    role: "AI Implementation Experts",
    bio: "The SerpNap Team is a collective of AI implementation professionals with expertise spanning chatbot development, voice agents, workflow automation, AI integration, and content production. Our team collaborates to deliver comprehensive insights and actionable strategies for businesses of all sizes.",
    expertise: [
      "AI Implementation Strategy",
      "Chatbot & Agent Development",
      "Voice AI & Phone Automation",
      "Workflow Automation",
      "AI Integration",
      "AI-Powered SEO & GEO",
      "AI Content Production",
    ],
    yearsOfExperience: 5,
    social: {
      website: config.appUrl,
    },
  },
};

/**
 * Get author profile by slug
 */
export function getAuthorProfile(slug: string): AuthorProfile | null {
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-");
  return authorProfiles[normalizedSlug] || null;
}

/**
 * Get author profile by name (fuzzy match)
 */
export function getAuthorProfileByName(name: string): AuthorProfile | null {
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
  return authorProfiles[slug] || null;
}

/**
 * Get all social links as URLs for sameAs schema
 */
export function getAuthorSameAs(profile: AuthorProfile): string[] {
  const links: string[] = [];
  if (profile.social.linkedin) links.push(profile.social.linkedin);
  if (profile.social.twitter) links.push(profile.social.twitter);
  if (profile.social.github) links.push(profile.social.github);
  if (profile.social.website) links.push(profile.social.website);
  return links;
}
