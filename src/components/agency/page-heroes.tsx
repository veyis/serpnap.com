import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Users,
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  Zap,
  BarChart3,
  Shield,
  Star,
  Bot,
  Mic,
  Workflow,
  Puzzle,
  LucideIcon,
} from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";

// ============================================================================
// REUSABLE PAGE HERO COMPONENT
// ============================================================================

// Color theme configurations
type ColorTheme = "amber" | "emerald" | "violet" | "blue" | "rose" | "neutral";

const themeConfig: Record<
  ColorTheme,
  {
    primary: string;
    secondary: string;
    tertiary: string;
    gradient: string;
    gradientText: string;
    glow: string;
    badge: string;
    badgeBorder: string;
    badgeText: string;
    button: string;
    buttonHover: string;
    shadow: string;
  }
> = {
  amber: {
    primary: "from-amber-500/12 via-orange-500/8",
    secondary: "from-orange-500/10 via-red-500/5",
    tertiary: "from-yellow-500/8 via-amber-500/4",
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    gradientText: "from-amber-500 via-orange-500 to-amber-600",
    glow: "from-amber-500/30 via-orange-500/30 to-amber-500/30",
    badge: "bg-amber-500/5",
    badgeBorder: "border-amber-500/20",
    badgeText: "text-amber-600 dark:text-amber-400",
    button:
      "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    buttonHover: "hover:border-amber-500/30 hover:bg-amber-500/5",
    shadow: "shadow-amber-500/25 hover:shadow-amber-500/40",
  },
  emerald: {
    primary: "from-emerald-500/12 via-teal-500/8",
    secondary: "from-teal-500/10 via-cyan-500/5",
    tertiary: "from-green-500/8 via-emerald-500/4",
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    gradientText: "from-emerald-500 via-teal-500 to-emerald-600",
    glow: "from-emerald-500/30 via-teal-500/30 to-emerald-500/30",
    badge: "bg-emerald-500/5",
    badgeBorder: "border-emerald-500/20",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    button:
      "from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    buttonHover: "hover:border-emerald-500/30 hover:bg-emerald-500/5",
    shadow: "shadow-emerald-500/25 hover:shadow-emerald-500/40",
  },
  violet: {
    primary: "from-violet-500/12 via-purple-500/8",
    secondary: "from-purple-500/10 via-fuchsia-500/5",
    tertiary: "from-indigo-500/8 via-violet-500/4",
    gradient: "from-violet-500 via-purple-500 to-violet-600",
    gradientText: "from-violet-500 via-purple-500 to-violet-600",
    glow: "from-violet-500/30 via-purple-500/30 to-violet-500/30",
    badge: "bg-violet-500/5",
    badgeBorder: "border-violet-500/20",
    badgeText: "text-violet-600 dark:text-violet-400",
    button:
      "from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600",
    buttonHover: "hover:border-violet-500/30 hover:bg-violet-500/5",
    shadow: "shadow-violet-500/25 hover:shadow-violet-500/40",
  },
  blue: {
    primary: "from-blue-500/12 via-cyan-500/8",
    secondary: "from-cyan-500/10 via-sky-500/5",
    tertiary: "from-indigo-500/8 via-blue-500/4",
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    gradientText: "from-blue-500 via-cyan-500 to-blue-600",
    glow: "from-blue-500/30 via-cyan-500/30 to-blue-500/30",
    badge: "bg-blue-500/5",
    badgeBorder: "border-blue-500/20",
    badgeText: "text-blue-600 dark:text-blue-400",
    button: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    buttonHover: "hover:border-blue-500/30 hover:bg-blue-500/5",
    shadow: "shadow-blue-500/25 hover:shadow-blue-500/40",
  },
  rose: {
    primary: "from-rose-500/12 via-pink-500/8",
    secondary: "from-pink-500/10 via-fuchsia-500/5",
    tertiary: "from-red-500/8 via-rose-500/4",
    gradient: "from-rose-500 via-pink-500 to-rose-600",
    gradientText: "from-rose-500 via-pink-500 to-rose-600",
    glow: "from-rose-500/30 via-pink-500/30 to-rose-500/30",
    badge: "bg-rose-500/5",
    badgeBorder: "border-rose-500/20",
    badgeText: "text-rose-600 dark:text-rose-400",
    button: "from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    buttonHover: "hover:border-rose-500/30 hover:bg-rose-500/5",
    shadow: "shadow-rose-500/25 hover:shadow-rose-500/40",
  },
  neutral: {
    primary: "from-foreground/8 via-foreground/4",
    secondary: "from-foreground/6 via-foreground/3",
    tertiary: "from-foreground/5 via-foreground/2",
    gradient: "from-foreground to-foreground",
    gradientText: "from-foreground via-foreground to-foreground/70",
    glow: "from-foreground/20 via-foreground/10 to-foreground/20",
    badge: "bg-foreground/5",
    badgeBorder: "border-foreground/5",
    badgeText: "text-foreground/70",
    button:
      "from-foreground to-foreground hover:from-foreground/90 hover:to-foreground/90",
    buttonHover: "hover:border-foreground/20 hover:bg-foreground/5",
    shadow: "shadow-foreground/20 hover:shadow-foreground/30",
  },
};

// Floating icon component
interface FloatingIconProps {
  icon: LucideIcon;
  position: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  theme: ColorTheme;
}

function FloatingIcon({
  icon: Icon,
  position,
  size = "md",
  delay = 0,
  theme,
}: FloatingIconProps) {
  const config = themeConfig[theme];
  const sizeClasses = {
    sm: "w-11 h-11 rounded-xl",
    md: "w-12 h-12 rounded-xl",
    lg: "w-14 h-14 rounded-2xl",
  };
  const iconSizes = { sm: "w-5 h-5", md: "w-5 h-5", lg: "w-6 h-6" };
  const delayClass =
    delay === 0
      ? ""
      : delay === 2000
        ? "animation-delay-2000"
        : "animation-delay-4000";

  return (
    <div
      className={cn(
        "absolute flex items-center justify-center backdrop-blur-sm animate-float",
        sizeClasses[size],
        `bg-linear-to-br ${config.primary.replace("/12", "/10").replace("/8", "/5")} to-transparent`,
        `border ${config.badgeBorder.replace("/20", "/10")}`,
        position,
        delayClass,
      )}
    >
      <Icon
        className={cn(
          iconSizes[size],
          config.badgeText
            .replace("text-", "text-")
            .replace("-600", "-500/60")
            .replace("-400", "-500/60"),
        )}
      />
    </div>
  );
}

// Main Hero Props
interface PageHeroProps {
  theme: ColorTheme;
  badgeIcon: LucideIcon;
  badgeText: string;
  headline: ReactNode;
  highlightedText: string;
  headlineAfter?: ReactNode;
  description: ReactNode;
  floatingIcons?: Array<{
    icon: LucideIcon;
    position: string;
    size?: "sm" | "md" | "lg";
    delay?: number;
  }>;
  pills?: Array<{ icon?: LucideIcon; label: string }>;
  stats?: Array<{ value: string; label: string }>;
  trustBadges?: Array<{ icon: LucideIcon; text: string }>;
  contactMethods?: Array<{ icon: LucideIcon; label: string; value: string }>;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  minHeight?: string;
  useUnderlineInsteadOfGradient?: boolean;
  backgroundImage?: string;
  backgroundAlt?: string;
  backgroundMode?: "full" | "minimal";
}

export function PageHero({
  theme,
  badgeIcon: BadgeIcon,
  badgeText,
  headline,
  highlightedText,
  headlineAfter,
  description,
  floatingIcons = [],
  pills,
  stats,
  trustBadges,
  contactMethods,
  primaryCta,
  secondaryCta,
  minHeight = "min-h-[85vh]",
  useUnderlineInsteadOfGradient = false,
  backgroundImage,
  backgroundAlt,
  backgroundMode = "full",
}: PageHeroProps) {
  const config = themeConfig[theme];
  const isMinimal = backgroundMode === "minimal";

  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        minHeight,
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-background">
        {!isMinimal && (
          <>
            <div
              className={cn(
                "absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-linear-to-br to-transparent blur-[120px] animate-blob",
                config.primary,
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-linear-to-br to-transparent blur-[100px] animate-blob animation-delay-2000",
                config.secondary,
              )}
            />
            <div
              className={cn(
                "absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-linear-to-br to-transparent blur-[80px] animate-blob animation-delay-4000",
                config.tertiary,
              )}
            />
          </>
        )}

        {!isMinimal && (
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        )}

        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      {/* Background Image (if provided) */}
      {backgroundImage && !isMinimal && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.12] dark:opacity-[0.2] mix-blend-soft-light">
          <Image
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            fetchPriority="high"
            decoding="async"
            quality={90}
          />
        </div>
      )}

      {/* Floating icons */}
      {!isMinimal && floatingIcons.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingIcons.map((item, i) => (
            <FloatingIcon key={i} {...item} theme={theme} />
          ))}
        </div>
      )}

      <div className="container-padding relative z-10 py-20 sm:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700",
              config.badge,
              `border ${config.badgeBorder}`,
            )}
          >
            <BadgeIcon className={cn("w-4 h-4", config.badgeText)} />
            <span className={cn("text-sm font-medium", config.badgeText)}>
              {badgeText}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <span className="block text-[clamp(2.5rem,8vw,5.5rem)] font-semibold tracking-[-0.04em] leading-[0.95]">
              {headline}
              <br />
              <span className="relative inline-block mt-2">
                {useUnderlineInsteadOfGradient ? (
                  <>
                    <span className="relative z-10 text-foreground">
                      {highlightedText}
                    </span>
                    <span className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-1 sm:h-1.5 bg-foreground rounded-full" />
                  </>
                ) : (
                  <>
                    <span
                      className={cn(
                        "relative z-10 bg-linear-to-r bg-clip-text text-transparent",
                        config.gradientText,
                      )}
                    >
                      {highlightedText}
                    </span>
                    <span
                      className={cn(
                        "absolute inset-0 bg-linear-to-r blur-2xl opacity-60 scale-150",
                        config.glow,
                      )}
                    />
                  </>
                )}
              </span>
              {headlineAfter}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 sm:mt-10 text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {description}
          </p>

          {/* Pills */}
          {pills && pills.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {pills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className={cn(
                    "group flex items-center gap-2.5 px-5 py-3 rounded-full bg-foreground/3 border border-foreground/8 transition-[border-color] duration-300 cursor-default",
                    config.buttonHover,
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "w-4 h-4 text-muted-foreground group-hover:transition-colors",
                        config.badgeText.replace("text-", "group-hover:text-"),
                      )}
                    />
                  )}
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto mt-14 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div
                    className={cn(
                      "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-linear-to-r bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300",
                      config.gradientText,
                    )}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trust Badges */}
          {trustBadges && trustBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {trustBadges.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Icon className={cn("w-4 h-4", config.badgeText)} />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Contact Methods */}
          {contactMethods && contactMethods.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {contactMethods.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="group p-4 rounded-2xl bg-foreground/2 border border-foreground/6 hover:border-foreground/20 hover:bg-foreground/4 transition-[background-color,border-color] duration-300"
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors mx-auto mb-2" />
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
              {primaryCta && (
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "group h-14 px-8 text-base font-medium rounded-full text-white shadow-2xl transition-[transform,box-shadow] duration-500 hover:scale-[1.02] active:scale-[0.98] border-0",
                    `bg-linear-to-r ${config.button}`,
                    config.shadow,
                  )}
                >
                  <Link href={primaryCta.href}>
                    {primaryCta.text}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-14 px-8 text-base font-medium rounded-full hover:bg-foreground/5 transition-[background-color] duration-300"
                >
                  <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
}

// ============================================================================
// PRE-CONFIGURED PAGE HEROES
// ============================================================================

export function ServicesHero() {
  return (
    <PageHero
      theme="amber"
      badgeIcon={Bot}
      badgeText="AI Implementation Agency"
      headline={<span className="text-foreground">AI that actually</span>}
      highlightedText="works"
      headlineAfter={<span className="text-foreground/30">.</span>}
      description={
        <>
          From custom chatbots to voice agents to workflow automation—we implement
          AI solutions that{" "}
          <span className="text-foreground font-medium">
            transform your business
          </span>
          .
        </>
      }
      pills={[
        { icon: Bot, label: "Chatbots" },
        { icon: Mic, label: "Voice Agents" },
        { icon: Workflow, label: "Automation" },
        { icon: Puzzle, label: "Integration" },
      ]}
      primaryCta={{ text: "Get Free AI Assessment", href: "/contact" }}
      secondaryCta={{ text: "Explore AI Tools", href: "/ai-tools" }}
      backgroundImage="/images/heroes/services.webp"
      backgroundAlt="SerpNap SEO tools overview"
    />
  );
}

export function IndustriesHero() {
  return (
    <PageHero
      theme="emerald"
      badgeIcon={Building2}
      badgeText="8 Industries We Serve"
      headline={
        <>
          <span className="text-foreground">We grow businesses</span>
          <span className="text-foreground/30">.</span>
        </>
      }
      highlightedText="Any industry"
      headlineAfter={<span className="text-foreground/30">.</span>}
      description={
        <>
          Whether you run a restaurant, law firm, or e-commerce store—our proven
          strategies{" "}
          <span className="text-foreground font-medium">
            adapt to your unique needs
          </span>
          .
        </>
      }
      floatingIcons={[
        {
          icon: Building2,
          position: "top-[25%] left-[10%]",
          size: "md",
          delay: 0,
        },
        {
          icon: TrendingUp,
          position: "top-[35%] right-[10%]",
          size: "lg",
          delay: 2000,
        },
        {
          icon: BarChart3,
          position: "bottom-[30%] left-[12%]",
          size: "sm",
          delay: 4000,
        },
      ]}
      pills={[
        { label: "Restaurants" },
        { label: "Home Services" },
        { label: "E-Commerce" },
        { label: "Contractors" },
        { label: "Legal" },
        { label: "Healthcare" },
        { label: "Auto" },
        { label: "Beauty" },
      ]}
      primaryCta={{ text: "Find Your Industry", href: "/contact" }}
      secondaryCta={{ text: "See Case Studies", href: "/results" }}
      backgroundImage="/images/heroes/industries.webp"
      backgroundAlt="AI implementation services for diverse industries like restaurants, healthcare, and construction"
    />
  );
}

export function ResultsHero() {
  return (
    <PageHero
      theme="violet"
      badgeIcon={Award}
      badgeText="Proven Results"
      headline={
        <>
          <span className="text-foreground">Real results</span>
          <span className="text-foreground/30">,</span>
        </>
      }
      highlightedText="real businesses"
      headlineAfter={<span className="text-foreground/30">.</span>}
      description={
        <>
          Don&apos;t take our word for it. See how we&apos;ve helped businesses
          like yours{" "}
          <span className="text-foreground font-medium">
            achieve extraordinary growth
          </span>
          .
        </>
      }
      floatingIcons={[
        {
          icon: Award,
          position: "top-[20%] right-[12%]",
          size: "lg",
          delay: 0,
        },
        {
          icon: TrendingUp,
          position: "top-[40%] left-[8%]",
          size: "md",
          delay: 2000,
        },
        {
          icon: Star,
          position: "bottom-[25%] right-[10%]",
          size: "sm",
          delay: 4000,
        },
      ]}
      stats={[
        { value: "50+", label: "Projects Delivered" },
        { value: "5 yrs", label: "In Business" },
        { value: "5.0", label: "Google Rating" },
      ]}
      primaryCta={{ text: "Get Similar Results", href: "/contact" }}
      secondaryCta={{ text: "Our Solutions", href: "/solutions" }}
      backgroundImage="/images/heroes/results.webp"
      backgroundAlt="SerpNap SEO analysis and optimization"
    />
  );
}

export function PricingHero() {
  return (
    <PageHero
      theme="blue"
      badgeIcon={Shield}
      badgeText="Transparent Pricing"
      headline={
        <>
          <span className="text-foreground">Simple</span>
          <span className="text-foreground/30">,</span>
        </>
      }
      highlightedText="honest pricing"
      headlineAfter={<span className="text-foreground/30">.</span>}
      description={
        <>
          No hidden fees. No surprises. Just{" "}
          <span className="text-foreground font-medium">clear value</span> at
          every tier.
          <br className="hidden sm:block" />
          Cancel anytime.
        </>
      }
      floatingIcons={[
        {
          icon: CheckCircle2,
          position: "top-[25%] left-[10%]",
          size: "md",
          delay: 0,
        },
        {
          icon: Shield,
          position: "top-[30%] right-[12%]",
          size: "lg",
          delay: 2000,
        },
        {
          icon: Zap,
          position: "bottom-[35%] left-[8%]",
          size: "sm",
          delay: 4000,
        },
      ]}
      trustBadges={[
        { icon: Shield, text: "30-Day Money-Back Guarantee" },
        { icon: CheckCircle2, text: "Month-to-month, no contract" },
        { icon: CheckCircle2, text: "Cancel with 30 days notice" },
      ]}
      minHeight="min-h-[70vh]"
      backgroundImage="/images/heroes/pricing.webp"
      backgroundAlt="Transparent AI implementation service pricing and plans"
    />
  );
}

