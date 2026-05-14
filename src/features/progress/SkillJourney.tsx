import { Trophy, Flame, BookOpen, Award } from "lucide-react";
import { useMilestones } from "@/hooks/useTodayMission";
import { copy } from "@/copy/copy";

const META: Record<string, { label: string; icon: any }> = {
  first_lesson: { label: "First lesson completed", icon: BookOpen },
  streak_7: { label: "7-day streak", icon: Flame },
  streak_30: { label: "30-day streak", icon: Flame },
  track_complete: { label: "Track completed", icon: Trophy },
};

export function SkillJourney() {
  const { data: milestones = [], isLoading } = useMilestones();

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        {copy.progress.journey}
      </h3>
      {isLoading ? (
        <div className="text-xs text-muted-foreground">Loading…</div>
      ) : milestones.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Complete your first lesson to unlock your first milestone.
        </p>
      ) : (
        <ol className="space-y-2.5">
          {milestones.map((m) => {
            const meta = META[m.kind] ?? { label: m.kind, icon: Award };
            const Icon = meta.icon;
            return (
              <li key={m.id} className="flex items-center gap-3 text-sm">
                <span className="grid place-items-center h-8 w-8 rounded-lg gradient-primary text-primary-foreground shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">{meta.label}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {new Date(m.unlocked_at).toLocaleDateString()}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
