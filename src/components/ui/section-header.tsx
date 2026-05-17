import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  eyebrow?: string;
}

/**
 * Editorial section header — left accent bar (gradient), display font title,
 * optional eyebrow kicker, and an animated "View all →" link.
 */
export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  className,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-4 lg:mb-5", className)}>
      <div className="min-w-0 flex items-stretch gap-3">
        {/* Vertical gradient accent bar */}
        <span
          aria-hidden
          className="w-[3px] rounded-full self-stretch shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary/80 mb-1">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-[15px] sm:text-lg lg:text-2xl font-semibold tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[12px] sm:text-[13px] text-muted-foreground mt-1 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="group/va shrink-0 inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold text-primary hover:text-primary transition-colors focus-ring rounded-md px-1 -mx-1"
        >
          <span className="relative">
            {viewAllLabel}
            <span
              aria-hidden
              className="absolute left-0 right-0 -bottom-0.5 h-px bg-current scale-x-0 group-hover/va:scale-x-100 origin-left transition-transform duration-300"
            />
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/va:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
