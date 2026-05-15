import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  /** Make the right column sticky on `lg+`. */
  stickyRight?: boolean;
  /** Make the left column sticky on `lg+`. */
  stickyLeft?: boolean;
  /** Right column width on `lg+`. Default 380. */
  rightWidth?: 280 | 320 | 360 | 380 | 420;
  /** Reverse on desktop (right block becomes left). */
  reverse?: boolean;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

const widthMap: Record<number, string> = {
  280: "lg:grid-cols-[1fr_280px]",
  320: "lg:grid-cols-[1fr_320px]",
  360: "lg:grid-cols-[1fr_360px]",
  380: "lg:grid-cols-[1fr_380px]",
  420: "lg:grid-cols-[1fr_420px]",
};

const widthMapReverse: Record<number, string> = {
  280: "lg:grid-cols-[280px_1fr]",
  320: "lg:grid-cols-[320px_1fr]",
  360: "lg:grid-cols-[360px_1fr]",
  380: "lg:grid-cols-[380px_1fr]",
  420: "lg:grid-cols-[420px_1fr]",
};

/**
 * Two-column split: stacked on mobile, side-by-side on `lg+`.
 * Used by product detail, profile, cart/checkout, auth.
 */
export function SplitLayout({
  left,
  right,
  stickyRight,
  stickyLeft,
  rightWidth = 380,
  reverse,
  className,
  gap = "md",
}: SplitLayoutProps) {
  const gapClass =
    gap === "sm" ? "gap-6 lg:gap-8" : gap === "lg" ? "gap-8 lg:gap-16" : "gap-6 lg:gap-12";
  const cols = reverse ? widthMapReverse[rightWidth] : widthMap[rightWidth];

  return (
    <div className={cn("grid grid-cols-1", cols, gapClass, className)}>
      <div
        className={cn(
          stickyLeft && "lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start",
          reverse && "lg:order-2",
        )}
      >
        {left}
      </div>
      <div
        className={cn(
          stickyRight && "lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start",
          reverse && "lg:order-1",
        )}
      >
        {right}
      </div>
    </div>
  );
}
