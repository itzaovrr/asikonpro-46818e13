import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background overflow-hidden isolate transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] data-[state=on]:[background:var(--gradient-primary)] data-[state=on]:text-primary-foreground data-[state=on]:border-white/10 data-[state=on]:shadow-[var(--shadow-glow)] data-[state=on]:before:absolute data-[state=on]:before:inset-0 data-[state=on]:before:rounded-[inherit] data-[state=on]:before:bg-[linear-gradient(180deg,hsl(0_0%_100%/0.18),transparent_55%)] data-[state=on]:before:pointer-events-none [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:scale-110",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-transparent",
        outline: "border border-[hsl(var(--glass-border)/0.6)] bg-[hsl(var(--glass-bg)/0.4)] backdrop-blur-md hover:border-primary/30",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
