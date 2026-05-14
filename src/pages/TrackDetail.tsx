import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Clock, Lock, PlayCircle, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrack, useTrackLessons, useLessonCompletions } from "@/hooks/useTracks";
import { useLearnerProfile, useUpsertLearnerProfile } from "@/hooks/useLearnerProfile";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function TrackDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data: track, isLoading } = useTrack(slug);
  const { data: lessons = [] } = useTrackLessons(track?.id);
  const { data: done } = useLessonCompletions();
  const { data: profile } = useLearnerProfile();
  const upsert = useUpsertLearnerProfile();

  const completed = lessons.filter((l) => done?.has(l.id)).length;
  const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  const isActive = profile?.active_track_id === track?.id;

  const setActive = async () => {
    if (!track) return;
    await upsert.mutateAsync({ active_track_id: track.id });
    toast.success(`${track.name} is now your active track`);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="px-4 py-4 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!track) {
    return (
      <AppLayout>
        <div className="px-4 py-10 text-center text-muted-foreground">Track not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 lg:px-6 py-4 max-w-3xl mx-auto space-y-5">
        <Link to="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground gap-1">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>

        <header>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Learning track</p>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1">{track.name}</h1>
          {track.description && (
            <p className="text-sm text-muted-foreground mt-2">{track.description}</p>
          )}
        </header>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progress</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {completed}/{lessons.length} · {pct}%
            </span>
          </div>
          <Progress value={pct} className="h-2" />
          {user && !isActive && (
            <Button size="sm" variant="premium" className="mt-3" onClick={setActive} disabled={upsert.isPending}>
              Make this my active track
            </Button>
          )}
          {isActive && (
            <p className="mt-3 text-xs text-emerald-400 font-medium">This is your active track</p>
          )}
        </div>

        <ol className="space-y-2">
          {lessons.map((l, i) => {
            const isDone = done?.has(l.id);
            const isLocked = !user && !l.is_preview;
            return (
              <li key={l.id}>
                <Link
                  to={isLocked ? "/auth" : `/lesson/${l.id}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 bg-card/40 hover:border-primary/40 transition-colors pressable"
                >
                  <span className="grid place-items-center h-9 w-9 rounded-xl bg-muted/60 text-xs font-semibold tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{l.title}</p>
                    <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {l.duration_min} min
                      {l.is_preview && <span className="ml-1 text-primary">· Free preview</span>}
                    </p>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <PlayCircle className="h-5 w-5 text-primary shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </AppLayout>
  );
}
