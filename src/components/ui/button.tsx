import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-[transform,box-shadow,background-color,border-color,color,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] hover:-translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:scale-110 overflow-hidden isolate",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground shadow-[var(--shadow-elevated)] border border-white/10 [background:var(--gradient-primary)] hover:shadow-[var(--shadow-glow)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,hsl(0_0%_100%/0.18),transparent_55%)] before:pointer-events-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md border border-white/10 hover:bg-destructive/90 hover:shadow-[0_0_0_1px_hsl(var(--destructive)/0.4),0_12px_32px_-8px_hsl(var(--destructive)/0.45)]",
        outline:
          "border border-[hsl(var(--glass-border)/0.7)] bg-[hsl(var(--glass-bg)/0.4)] backdrop-blur-xl hover:bg-[hsl(var(--glass-bg)/0.7)] hover:border-primary/40 hover:text-foreground shadow-sm",
        secondary:
          "bg-secondary/80 text-secondary-foreground backdrop-blur-md border border-[hsl(var(--glass-border)/0.5)] hover:bg-secondary shadow-sm",
        ghost:
          "hover:bg-accent/10 hover:text-accent-foreground hover:backdrop-blur-md",
        link:
          "text-primary underline-offset-4 hover:underline hover:translate-y-0",
        glass:
          "glass text-foreground hover:bg-[hsl(var(--glass-bg)/0.75)] hover:border-primary/30 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,hsl(var(--glass-highlight)/0.12),transparent_60%)] before:pointer-events-none",
        premium:
          "text-primary-foreground border border-white/15 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-glow)] [background:var(--gradient-primary)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(180deg,hsl(0_0%_100%/0.22),transparent_55%)] before:pointer-events-none after:absolute after:inset-x-4 after:-bottom-px after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:pointer-events-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
