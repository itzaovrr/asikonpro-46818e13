import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { useTrackLessons, useLessonCompletions, useTracks } from "@/hooks/useTracks";

export function TrackProgress() {
  const { data: profile } = useLearnerProfile();
  const { data: tracks } = useTracks();
  const activeTrack = tracks?.find((t) => t.id === profile?.active_track_id);
  const { data: lessons } = useTrackLessons(profile?.active_track_id ?? undefined);
  const { data: done } = useLessonCompletions();

  if (!profile?.active_track_id || !activeTrack) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">No active track</p>
          <p className="text-xs text-muted-foreground">Pick one to start your daily mission.</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link to="/learn">Pick</Link></Button>
      </div>
    );
  }

  const total = lessons?.length ?? 0;
  const completed = lessons?.filter((l) => done?.has(l.id)).length ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Active track</p>
          <Link to={`/track/${activeTrack.slug}`} className="font-semibold text-sm hover:text-primary transition-colors">
            {activeTrack.name}
          </Link>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {completed}/{total} · {pct}%
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
