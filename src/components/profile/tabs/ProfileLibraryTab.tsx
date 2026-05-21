import { Library, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "./ProfileFeedTab";

interface TrackGroup {
  track: { id: string; name: string; slug: string; icon: string | null; description: string | null };
  lessons: Array<{ id: string; title: string; completed_at: string }>;
}

import { Button } from "@/components/ui/button";

export function ProfileLibraryTab({ items }: { items: TrackGroup[] }) {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Library className="h-8 w-8" />}
        title="Library is empty"
        hint="Lessons you complete are organized here by track."
        action={<Button onClick={() => navigate("/shop?type=courses")}>Browse courses</Button>}
      />
    );
  }
  return (
    <div className="space-y-2 pt-3">
      {items.map(({ track, lessons }) => (
        <button
          key={track.id}
          onClick={() => navigate(`/track/${track.slug}`)}
          className="w-full text-left rounded-2xl border border-border/60 bg-card/60 p-4 hover:bg-card transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
              {track.icon ?? "📚"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{track.name}</p>
              <p className="text-xs text-muted-foreground">
                {lessons.length} lesson{lessons.length === 1 ? "" : "s"} completed
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      ))}
    </div>
  );
}
