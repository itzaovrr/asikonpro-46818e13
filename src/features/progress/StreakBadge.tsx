import { Flame } from "lucide-react";
import { copy } from "@/copy/copy";
import { cn } from "@/lib/utils";

export function StreakBadge({ days, className }: { days: number; className?: string }) {
  const active = days > 0;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border",
        active
          ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
          : "border-border/60 bg-muted/40 text-muted-foreground",
        className,
      )}
    >
      <Flame className={cn("h-3.5 w-3.5", active && "fill-current")} />
      {active ? (
        <span className="tabular-nums">{days} {copy.progress.streakLabel}</span>
      ) : (
        <span>{copy.progress.streakNew}</span>
      )}
    </div>
  );
}
