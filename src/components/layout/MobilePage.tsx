import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobilePageProps {
  children: ReactNode;
  /** Sticky element rendered just under the global app header (e.g. tabs row). */
  sticky?: ReactNode;
  /** Override horizontal padding (default px-4). */
  padded?: boolean;
  /** Extra className for the inner content wrapper. */
  className?: string;
  /** Vertical spacing between top-level sections. Default "space-y-5". */
  spacing?: string;
}

/**
 * Consistent mobile-app page shell.
 * - Uses the global MobileHeader/DesktopHeader from AppLayout (don't double-stack).
 * - Standard horizontal padding (16px), top padding (12px), and bottom safe-area
 *   that clears the BottomNav.
 * - Optional sticky slot for sub-tab rows (chips, filters).
 * - Desktop (lg+) widens to the editorial container.
 */
export function MobilePage({
  children,
  sticky,
  padded = true,
  className,
  spacing = "space-y-5",
}: MobilePageProps) {
  return (
    <div className="page-enter page-enter-active">
      {sticky && (
        <div
          className="sticky z-30 glass-subtle hairline-bottom"
          style={{ top: "var(--app-header-h)" }}
        >
          <div className={cn("container-editorial", padded && "px-4 lg:px-8")}>
            {sticky}
          </div>
        </div>
      )}
      <div
        className={cn(
          "container-editorial",
          padded && "px-4 lg:px-8",
          "pt-3 lg:pt-6 pb-6",
          spacing,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
