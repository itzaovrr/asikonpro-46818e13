import { ReactNode, forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "glass" | "flat" | "outline" | "soft";

interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  /** Removes inner padding for media-heavy cards. */
  noPadding?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  glass: "glass",
  flat: "bg-card border border-border/50",
  outline: "border border-border/70 bg-transparent",
  soft: "bg-secondary/40 border border-border/40",
};

/**
 * Mobile-app style card — single rounded-2xl surface with consistent padding
 * and tactile press feedback. Use everywhere instead of ad-hoc div+rounded+border.
 */
export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ variant = "glass", noPadding, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl pressable",
        variantClasses[variant],
        !noPadding && "p-4",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
MobileCard.displayName = "MobileCard";
