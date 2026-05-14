import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodayMission } from "@/hooks/useTodayMission";
import { useLesson } from "@/hooks/useTracks";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { copy } from "@/copy/copy";

export function TodayMissionCard() {
  const { data: profile } = useLearnerProfile();
  const { data: mission, isLoading } = useTodayMission();
  const { data: lesson } = useLesson(mission?.lesson_id ?? undefined);

  if (isLoading) {
    return (
      <div className="rounded-3xl glass border border-primary/20 p-5 lg:p-6">
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  // No track picked yet
  if (!profile?.active_track_id) {
    return (
      <CardShell>
        <h2 className="text-lg lg:text-xl font-bold">{copy.mission.needsTrackTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{copy.mission.needsTrackSubtitle}</p>
        <Button asChild variant="premium"><Link to="/onboarding">Pick a track</Link></Button>
      </CardShell>
    );
  }

  // No more lessons in track
  if (!mission || !lesson) {
    return (
      <CardShell>
        <h2 className="text-lg lg:text-xl font-bold">{copy.mission.emptyTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{copy.mission.emptySubtitle}</p>
        <Button asChild variant="outline"><Link to="/onboarding">Switch track</Link></Button>
      </CardShell>
    );
  }

  if (mission.completed) {
    return (
      <CardShell>
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">{copy.mission.completedTitle}</span>
        </div>
        <h2 className="text-lg lg:text-xl font-bold">{lesson.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{copy.mission.completedSubtitle}</p>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <div className="flex items-center gap-2 text-primary mb-2">
        <Sparkles className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{copy.mission.eyebrow}</span>
      </div>
      <h2 className="text-lg lg:text-2xl font-bold leading-tight">{lesson.title}</h2>
      {lesson.outcome && (
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-medium text-foreground/80">{copy.mission.why}: </span>
          {lesson.outcome}
        </p>
      )}
      <div className="flex items-center gap-3 mt-4">
        <Button asChild variant="premium" size="lg" className="group">
          <Link to={`/lesson/${lesson.id}`}>
            {copy.mission.cta}
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {copy.mission.duration(lesson.duration_min)}
        </span>
      </div>
    </CardShell>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-primary/25 p-5 lg:p-6"
      style={{ background: "var(--gradient-primary-soft)" }}
    >
      {children}
    </div>
  );
}
