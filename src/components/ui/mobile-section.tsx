import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSectionProps {
  title?: ReactNode;
  /** Optional small descriptive line under the title. */
  subtitle?: ReactNode;
  /** Right-aligned action (e.g. "See all"). */
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
  /** Pad-less variant — used when child handles its own bleed (e.g. carousels). */
  flush?: boolean;
}

/**
 * Minimal mobile section with an "eyebrow" style title.
 * Consistent across every page: 11-12px uppercase, tracked, muted.
 */
export function MobileSection({
  title,
  subtitle,
  actionLabel,
  actionHref,
  onAction,
  children,
  className,
  flush = false,
}: MobileSectionProps) {
  const showHeader = title || actionLabel;
  return (
    <section className={cn(className)}>
      {showHeader && (
        <div className={cn("flex items-end justify-between gap-3 mb-3", flush && "px-4 lg:px-0")}>
          <div className="min-w-0">
            {title && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-[13px] text-foreground/85 leading-snug mt-0.5 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
          {actionLabel && (actionHref ? (
            <Link
              to={actionHref}
              className="shrink-0 inline-flex items-center gap-0.5 text-[12px] font-medium text-primary pressable focus-ring rounded-full px-1"
            >
              {actionLabel}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="shrink-0 inline-flex items-center gap-0.5 text-[12px] font-medium text-primary pressable focus-ring rounded-full px-1"
            >
              {actionLabel}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      )}
      {children}
    </section>
  );
}
