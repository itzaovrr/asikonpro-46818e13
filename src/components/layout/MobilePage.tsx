import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";

interface MobilePageProps {
  children: ReactNode;
  /** Sticky element rendered just under the global app header (e.g. tabs row). */
  sticky?: ReactNode;
  /** Override horizontal padding (default px-4 lg:px-8). */
  padded?: boolean;
  /** Extra className for the inner content wrapper. */
  className?: string;
  /** Vertical spacing between top-level sections. Default "space-y-5". */
  spacing?: string;
  /** Constrain content width (uses Tailwind max-w-*). Default "full" = editorial container. */
  maxWidth?: MaxWidth;
  /** Render the full-bleed area before the padded content (e.g. profile cover). */
  bleed?: ReactNode;
}

const maxWidthMap: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "",
};

/**
 * Consistent mobile-app page shell.
 * - Uses the global MobileHeader/DesktopHeader from AppLayout (don't double-stack).
 * - Standard horizontal padding (16px), top padding (12px), and bottom safe-area
 *   handled by AppLayout's pb-28 on mobile.
 * - Optional sticky slot for sub-tab rows (chips, filters).
 * - Optional bleed slot for full-width covers/heroes before padded content.
 */
export function MobilePage({
  children,
  sticky,
  padded = true,
  className,
  spacing = "space-y-5",
  maxWidth = "full",
  bleed,
}: MobilePageProps) {
  const isContainer = maxWidth === "full";
  const widthClass = isContainer ? "container-editorial" : `mx-auto w-full ${maxWidthMap[maxWidth]}`;
  return (
    <div className="page-enter page-enter-active">
      {bleed}
      {sticky && (
        <>
          {/* Fixed sub-header tab strip — sits directly under the global app header
              and stays pinned on scroll, immune to layout gaps from siblings. */}
          <div
            className="fixed left-0 right-0 z-30 bg-background/95 backdrop-blur-md hairline-bottom"
            style={{ top: "var(--app-header-h)" }}
          >
            <div className={cn(widthClass, padded && "px-3 sm:px-4 lg:px-8")}>
              {sticky}
            </div>
          </div>
          {/* Spacer that reserves the tab strip's height in normal flow. */}
          <div aria-hidden className="invisible" style={{ paddingTop: 0 }}>
            <div className={cn(widthClass, padded && "px-3 sm:px-4 lg:px-8")}>
              {sticky}
            </div>
          </div>
        </>
      )}
      <div
        className={cn(
          widthClass,
          padded && "px-3 sm:px-4 lg:px-8",
          "pt-3 lg:pt-6 pb-6 min-w-0 overflow-x-clip",
          spacing,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
