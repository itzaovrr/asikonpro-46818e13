import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[hsl(var(--glass-border)/0.7)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
      "data-[state=unchecked]:bg-[hsl(var(--glass-bg)/0.6)] data-[state=unchecked]:backdrop-blur-md data-[state=unchecked]:shadow-inner",
      "data-[state=checked]:[background:var(--gradient-primary)] data-[state=checked]:border-white/15 data-[state=checked]:shadow-[var(--shadow-glow)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,hsl(var(--glass-highlight)/0.18),transparent_60%)] before:pointer-events-none",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none relative block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        "data-[state=checked]:scale-100 data-[state=unchecked]:scale-95",
        "before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(180deg,hsl(0_0%_100%/0.6),transparent_60%)]",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
