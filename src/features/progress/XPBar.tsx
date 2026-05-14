import { Progress } from "@/components/ui/progress";
import { copy } from "@/copy/copy";

const LEVEL_STEP = 100;

export function XPBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / LEVEL_STEP) + 1;
  const currentLevelXp = xp % LEVEL_STEP;
  const pct = (currentLevelXp / LEVEL_STEP) * 100;
  const toNext = LEVEL_STEP - currentLevelXp;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold">Level {level}</span>
        <span className="text-muted-foreground tabular-nums">
          {xp} {copy.progress.xpLabel} · {toNext} to next
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
