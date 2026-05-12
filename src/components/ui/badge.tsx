import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "relative inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background overflow-hidden isolate [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-white/10 text-primary-foreground [background:var(--gradient-primary)] shadow-sm before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,hsl(0_0%_100%/0.18),transparent_60%)] before:pointer-events-none",
        secondary:
          "border-[hsl(var(--glass-border)/0.6)] bg-[hsl(var(--glass-bg)/0.6)] backdrop-blur-md text-secondary-foreground hover:bg-[hsl(var(--glass-bg)/0.8)]",
        destructive:
          "border-white/10 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-[hsl(var(--glass-border)/0.7)] bg-[hsl(var(--glass-bg)/0.35)] backdrop-blur-md text-foreground hover:bg-[hsl(var(--glass-bg)/0.55)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
