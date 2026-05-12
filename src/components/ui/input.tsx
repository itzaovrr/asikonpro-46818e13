import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[hsl(var(--glass-border)/0.6)] bg-[hsl(var(--glass-bg)/0.45)] backdrop-blur-xl px-3.5 py-2 text-base ring-offset-background shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.06)] transition-[border-color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-[hsl(var(--glass-border)/0.9)] hover:bg-[hsl(var(--glass-bg)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary/50 focus-visible:bg-[hsl(var(--glass-bg)/0.7)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
