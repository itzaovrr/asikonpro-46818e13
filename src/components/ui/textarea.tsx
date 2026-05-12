import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-[hsl(var(--glass-border)/0.6)] bg-[hsl(var(--glass-bg)/0.45)] backdrop-blur-xl px-3.5 py-2.5 text-sm ring-offset-background shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.06)] transition-[border-color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-muted-foreground hover:border-[hsl(var(--glass-border)/0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary/50 focus-visible:bg-[hsl(var(--glass-bg)/0.7)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
