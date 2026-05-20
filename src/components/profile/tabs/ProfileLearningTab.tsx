import { Flame, Sparkles, Trophy, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./ProfileFeedTab";

interface ProfileLearningTabProps {
  stats: {
    xp: number;
    streak: number;
    lessonsCompleted: number;
    milestones: Array<{ kind: string; unlocked_at: string }>;
  };
  isOwnProfile?: boolean;
}

const MILESTONE_LABEL: Record<string, string> = {
  first_lesson: "First lesson",
  streak_7: "7-day streak",
  streak_30: "30-day streak",
  track_complete: "Track complete",
};

export function ProfileLearningTab({ stats, isOwnProfile }: ProfileLearningTabProps) {
  const navigate = useNavigate();
  const hasAny = stats.xp > 0 || stats.lessonsCompleted > 0 || stats.streak > 0;

  if (!hasAny) {
    return (
      <EmptyState
        icon={<GraduationCap className="h-8 w-8" />}
        title="No learning progress yet"
        hint={isOwnProfile ? "Start a track to earn XP and build a streak." : "This profile hasn't started learning yet."}
        action={isOwnProfile ? <Button onClick={() => navigate("/learn")}>Start learning</Button> : undefined}
      />
    );
  }

  const tiles = [
    { label: "XP", value: stats.xp, icon: Sparkles, color: "text-primary" },
    { label: "Streak", value: `${stats.streak}d`, icon: Flame, color: "text-amber-400" },
    { label: "Lessons", value: stats.lessonsCompleted, icon: GraduationCap, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-4 pt-3">
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center">
            <t.icon className={`h-5 w-5 mx-auto mb-1 ${t.color}`} />
            <p className="text-lg font-bold tabular-nums">{t.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.label}</p>
          </div>
        ))}
      </div>

      {stats.milestones.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Milestones
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.milestones.map((m) => (
              <span
                key={m.kind + m.unlocked_at}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary"
              >
                <Trophy className="h-3.5 w-3.5" />
                {MILESTONE_LABEL[m.kind] ?? m.kind}
              </span>
            ))}
          </div>
        </section>
      )}

      {isOwnProfile && (
        <Button variant="secondary" className="w-full" onClick={() => navigate("/learn")}>
          Continue learning
        </Button>
      )}
    </div>
  );
}
