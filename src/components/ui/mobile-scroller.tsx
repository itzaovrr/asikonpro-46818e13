import { cn } from "@/lib/utils";
import { ReactNode, Children } from "react";

interface MobileScrollerProps {
  children: ReactNode;
  /** Mobile basis e.g. "85%" or "20rem" */
  itemWidthMobile?: string;
  /** Tailwind grid columns class for md+ breakpoints */
  gridCols?: string;
  /** Gap between items */
  gap?: string;
  className?: string;
}

/**
 * Mobile-first horizontal snap scroller that collapses to a CSS grid on md+.
 * Renders two layout DOM trees (hidden via responsive utilities) for clean,
 * predictable behavior at each breakpoint.
 */
export function MobileScroller({
  children,
  itemWidthMobile = "85%",
  gridCols = "md:grid-cols-3",
  gap = "gap-3",
  className,
}: MobileScrollerProps) {
  const items = Children.toArray(children);

  return (
    <>
      {/* Mobile: horizontal snap scroll with edge bleed */}
      <div
        className={cn(
          "md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pr-10",
          gap,
          className,
        )}
      >
        {items.map((child, i) => (
          <div
            key={i}
            className="shrink-0 snap-start"
            style={{ flexBasis: itemWidthMobile, width: itemWidthMobile }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className={cn("hidden md:grid", gridCols, gap, className)}>
        {items.map((child, i) => (
          <div key={i} className="h-full">{child}</div>
        ))}
      </div>
    </>
  );
}
