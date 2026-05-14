import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLesson, useLessonCompletions, useTrack } from "@/hooks/useTracks";
import { useCompleteLesson } from "@/hooks/useTodayMission";
import { useAuth } from "@/hooks/useAuth";
import { copy } from "@/copy/copy";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

export default function LessonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: lesson, isLoading } = useLesson(id);
  const { data: done } = useLessonCompletions();
  const complete = useCompleteLesson();

  // Look up the track for the back link
  const { data: trackRow } = useQuery({
    queryKey: ["track_by_id", lesson?.track_id],
    enabled: !!lesson?.track_id,
    queryFn: async () => {
      const { data } = await db.from("tracks").select("slug,name").eq("id", lesson!.track_id).maybeSingle();
      return data as { slug: string; name: string } | null;
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </AppLayout>
    );
  }
  if (!lesson) {
    return (
      <AppLayout>
        <div className="px-4 py-10 text-center text-muted-foreground">Lesson not found.</div>
      </AppLayout>
    );
  }

  const isDone = done?.has(lesson.id);
  const canComplete = !!user && !isDone;

  return (
    <AppLayout>
      <article className="px-4 lg:px-6 py-4 max-w-2xl mx-auto space-y-5">
        {trackRow && (
          <Link to={`/track/${trackRow.slug}`} className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground gap-1">
            <ArrowLeft className="h-3 w-3" /> {copy.lesson.backToTrack}: {trackRow.name}
          </Link>
        )}

        <header>
          <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{lesson.title}</h1>
          <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {lesson.duration_min} min
          </p>
        </header>

        {lesson.outcome && (
          <div className="rounded-2xl border border-primary/25 p-4" style={{ background: "var(--gradient-primary-soft)" }}>
            <p className="text-[10px] uppercase tracking-[0.16em] text-primary mb-1">{copy.lesson.outcomeLabel}</p>
            <p className="text-sm">{lesson.outcome}</p>
          </div>
        )}

        {lesson.video_url && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
            <video controls src={lesson.video_url} className="w-full h-full" />
          </div>
        )}

        {lesson.content_md && (
          <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
            {lesson.content_md}
          </div>
        )}

        {!lesson.content_md && !lesson.video_url && (
          <p className="text-sm text-muted-foreground italic">
            Content for this lesson is being prepared. The mission still counts when you mark it complete below.
          </p>
        )}

        <div className="pt-2 flex items-center gap-3">
          {isDone ? (
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" /> {copy.lesson.completed}
            </span>
          ) : (
            <Button
              variant="premium"
              size="lg"
              disabled={!canComplete || complete.isPending}
              onClick={() => complete.mutate(lesson.id)}
            >
              {complete.isPending ? "Saving…" : copy.lesson.markComplete}
            </Button>
          )}
          {!user && (
            <Link to="/auth" className="text-xs text-primary underline">Sign in to track progress</Link>
          )}
        </div>
      </article>
    </AppLayout>
  );
}
