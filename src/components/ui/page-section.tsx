import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Add aurora ambient background (use only on hero bands). */
  aurora?: boolean;
  /** Add hairline gradient divider above the section. */
  divider?: boolean;
  /** Tighter vertical rhythm. */
  compact?: boolean;
  as?: "section" | "div" | "header";
  id?: string;
}

/**
 * Editorial page section — eyebrow + display title + content.
 * Standardizes vertical rhythm across pages.
 */
export function PageSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  innerClassName,
  aurora,
  divider,
  compact,
  as: As = "section",
  id,
}: PageSectionProps) {
  return (
    <As
      id={id}
      className={cn(
        "relative",
        aurora && "aurora-bg",
        compact ? "py-6 sm:py-8 lg:py-10" : "py-8 sm:py-12 lg:py-16",
        className,
      )}
    >
      {divider && <div className="divider-soft mb-8 lg:mb-12" />}
      <div className={cn("container-editorial", innerClassName)}>
        {(eyebrow || title || action) && (
          <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8">
            <div className="min-w-0">
              {eyebrow && <p className="eyebrow-bar mb-2">{eyebrow}</p>}
              {title && (
                <h2 className="display-2 text-foreground">{title}</h2>
              )}
              {description && (
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </As>
  );
}
