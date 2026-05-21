import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCompletionBarProps {
  profile: {
    avatar_url?: string | null;
    cover_url?: string | null;
    bio?: string | null;
  } | null | undefined;
  learnerStats?: { lessonsCompleted?: number } | null;
  postCount: number;
  onEdit: () => void;
}

const DEFAULT_AVATAR_FRAGMENT = "photo-1494790108377-be9c29b29330";

export function ProfileCompletionBar({ profile, learnerStats, postCount, onEdit }: ProfileCompletionBarProps) {
  const navigate = useNavigate();

  const hasAvatar = !!profile?.avatar_url && !profile.avatar_url.includes(DEFAULT_AVATAR_FRAGMENT);
  const hasCover = !!profile?.cover_url;
  const hasBio = !!(profile?.bio && profile.bio.trim().length > 0);
  const hasLesson = (learnerStats?.lessonsCompleted ?? 0) > 0;
  const hasPost = postCount > 0;

  const checks = [hasAvatar, hasCover, hasBio, hasLesson, hasPost];
  const completed = checks.filter(Boolean).length;
  const percent = completed * 20;

  const missing: Array<{ label: string; onClick: () => void }> = [];
  if (!hasAvatar) missing.push({ label: "＋ Add a profile photo", onClick: onEdit });
  if (!hasCover) missing.push({ label: "＋ Add a cover photo", onClick: onEdit });
  if (!hasBio) missing.push({ label: "＋ Add a bio", onClick: onEdit });
  if (!hasLesson) missing.push({ label: "＋ Complete a lesson", onClick: () => navigate("/learn") });
  if (!hasPost) missing.push({ label: "＋ Make a post", onClick: () => navigate("/community") });

  if (percent === 100) {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-emerald-400/5 px-4 py-3 flex items-center gap-2">
        <Check className="h-4 w-4 text-emerald-400" />
        <p className="text-sm font-medium text-emerald-300">Profile complete! You're all set.</p>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md px-4 py-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Profile {percent}% complete</p>
        <span className="text-[11px] text-muted-foreground tabular-nums">{completed}/5</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {missing.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {missing.map((m) => (
            <button
              key={m.label}
              onClick={m.onClick}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium",
                "bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors",
                "border border-border/50"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


