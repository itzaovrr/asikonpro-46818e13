/**
 * Apple.com-Inspired Hero Section
 * Large typography, clean imagery, subtle animations
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppleHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  backgroundImage?: string;
  gradient?: string;
  align?: "center" | "left";
  size?: "default" | "large";
  darkOverlay?: boolean;
}

export function AppleHeroSection({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  gradient,
  align = "center",
  size = "default",
  darkOverlay = false,
}: AppleHeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        size === "large" ? "min-h-[80vh] md:min-h-[85vh]" : "min-h-[60vh] md:min-h-[70vh]",
        "flex items-center"
      )}
    >
      {/* Background */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {darkOverlay && (
            <div className="absolute inset-0 bg-foreground/20" />
          )}
        </div>
      ) : (
        <div
          className={cn(
            "absolute inset-0",
            gradient || "bg-gradient-to-b from-background via-background to-muted/30"
          )}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32",
          "transition-all duration-1000 ease-out delay-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          align === "center" && "text-center",
          align === "left" && "text-left"
        )}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <p
            className={cn(
              "eyebrow mb-4 transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {eyebrow}
          </p>
        )}

        {/* Title */}
        <h1
          className={cn(
            "font-display font-semibold tracking-tight leading-[1.05]",
            size === "large"
              ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
            darkOverlay ? "text-white" : "text-foreground",
            "transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            "max-w-4xl",
            align === "center" && "mx-auto"
          )}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={cn(
              "mt-4 md:mt-6 text-lg md:text-xl max-w-2xl",
              darkOverlay ? "text-white/80" : "text-muted-foreground",
              "leading-relaxed",
              "transition-all duration-700 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 mt-8",
              align === "center" && "justify-center",
              "transition-all duration-700 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {primaryCta && (
              <Link
                to={primaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-8 py-4 rounded-full text-base font-medium",
                  "bg-primary text-primary-foreground",
                  "transition-all duration-200",
                  "hover:scale-105 hover:shadow-lg"
                )}
              >
                {primaryCta.label}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "px-8 py-4 rounded-full text-base font-medium",
                  darkOverlay
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-secondary text-foreground hover:bg-secondary/80",
                  "transition-all duration-200"
                )}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Apple-style Product Showcase Grid
 */
export function AppleProductGrid({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("section-padding", className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="display-2">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Apple-style Product Card
 */
export function AppleProductCard({
  title,
  subtitle,
  price,
  image,
  href,
  badge,
}: {
  title: string;
  subtitle?: string;
  price: string;
  image: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      to={href}
      className="product-card-apple group block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary/30 rounded-t-2xl overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {subtitle}
          </p>
        )}
        <p className="mt-3 text-base font-medium text-foreground">
          {price}
        </p>
      </div>
    </Link>
  );
}

/**
 * Apple-style Feature Card (Large)
 */
export function AppleFeatureCard({
  title,
  description,
  image,
  href,
  layout = "default",
}: {
  title: string;
  description?: string;
  image: string;
  href: string;
  layout?: "default" | "wide";
}) {
  return (
    <Link
      to={href}
      className={cn(
        "product-card-apple relative overflow-hidden group block",
        layout === "wide" ? "aspect-[21/9]" : "aspect-square md:aspect-[4/3]"
      )}
    >
      {/* Background Image */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-display font-semibold text-white tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm md:text-base text-white/80 max-w-md">
            {description}
          </p>
        )}
        <span className="link-chevron mt-4 text-white inline-flex items-center gap-1 text-sm font-medium">
          Learn more
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Apple-style Section Divider
 */
export function AppleSectionDivider() {
  return (
    <div className="divider-soft max-w-7xl mx-auto px-6 lg:px-8" />
  );
}

/**
 * Apple-style Text Showcase
 */
export function AppleTextShowcase({
  eyebrow,
  title,
  description,
  image,
  imagePosition = "right",
  features,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  imagePosition?: "left" | "right";
  features?: Array<{ title: string; description: string }>;
}) {
  return (
    <section className="section-padding bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={cn(
            "grid md:grid-cols-2 gap-12 lg:gap-20 items-center",
            imagePosition === "left" && "md:flex-row-reverse"
          )}
        >
          {/* Text */}
          <div className={imagePosition === "left" ? "md:order-2" : ""}>
            {eyebrow && (
              <p className="eyebrow mb-4">{eyebrow}</p>
            )}
            <h2 className="display-2">{title}</h2>
            {description && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
            {features && features.length > 0 && (
              <div className="mt-8 space-y-6">
                {features.map((feature, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-base">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className={imagePosition === "left" ? "md:order-1" : ""}>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={image}
                alt=""
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
