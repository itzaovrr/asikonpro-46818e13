import { Flame, Sparkles, Trophy, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./ProfileFeedTab";

interface ProfileLearningTabProps {
  stats: {
    xp: number;
    streak: number;
    longestStreak: number;
    lessonsCompleted: number;
    milestones: Array<{ kind: string; unlocked_at: string }>;
    weeklyActivity: boolean[]; // length 7, Mon..Sun
  };
  isOwnProfile?: boolean;
}

const MILESTONE_LABEL: Record<string, string> = {
  first_lesson: "First lesson",
  streak_7: "7-day streak",
  streak_30: "30-day streak",
  track_complete: "Track complete",
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

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

  const level = Math.floor(stats.xp / 100) + 1;
  const progress = (stats.xp % 100) / 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const tiles = [
    { label: "XP", value: stats.xp, icon: Sparkles, color: "text-primary" },
    { label: "Streak", value: `${stats.streak}d`, icon: Flame, color: "text-amber-400" },
    { label: "Lessons", value: stats.lessonsCompleted, icon: GraduationCap, color: "text-emerald-400" },
    { label: "Best Streak", value: `${stats.longestStreak}d`, icon: Trophy, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-4 pt-3">
      {/* XP Progress Ring */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col items-center">
        <div className="relative w-[100px] h-[100px]">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" className="stroke-muted" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              className="stroke-primary transition-all duration-700"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold tabular-nums">{stats.xp}</span>
            <span className="text-[9px] uppercase tracking-wide text-muted-foreground">XP</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Level {level}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center">
            <t.icon className={`h-5 w-5 mx-auto mb-1 ${t.color}`} />
            <p className="text-base font-bold tabular-nums">{t.value}</p>
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground leading-tight">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          This Week
        </h3>
        <div className="flex gap-1.5 justify-between">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-lg ${stats.weeklyActivity[i] ? "bg-primary/80" : "bg-muted"}`}
                aria-label={stats.weeklyActivity[i] ? "Active" : "Inactive"}
              />
              <span className="text-[10px] text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>
      </section>

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
