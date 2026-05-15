import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StickyActionBarProps {
  children: ReactNode;
  className?: string;
  /** Hide on `lg+` (mobile-only sticky CTA). Default true. */
  mobileOnly?: boolean;
  /** Sit above the BottomNav (default true on mobile). */
  aboveBottomNav?: boolean;
}

/**
 * Glass sticky bottom bar with safe-area padding.
 * Used for mobile CTA bars (Add to cart / Buy now / Checkout).
 */
export function StickyActionBar({
  children,
  className,
  mobileOnly = true,
  aboveBottomNav = true,
}: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-40 glass-strong hairline-bottom border-t border-border/40",
        aboveBottomNav ? "bottom-16 lg:bottom-0" : "bottom-0",
        mobileOnly && "lg:hidden",
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="container-editorial py-3">{children}</div>
    </div>
  );
}
