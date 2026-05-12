import { ShoppingBag, Palette, Star, Shield, Award, Sparkles, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
}

interface ProfileBadgesProps {
  badges: string[];
  /** Number of completed AI tutor sessions / MCQ quizzes for this user. */
  learnerSessions?: number;
  learnerQuizzes?: number;
}

const allBadges: Badge[] = [
  { id: "buyer", name: "Learner", icon: <ShoppingBag className="h-3.5 w-3.5" />, color: "text-blue-400 bg-blue-400/10 border-blue-400/20", earned: false },
  { id: "creator", name: "Creator", icon: <Sparkles className="h-3.5 w-3.5" />, color: "text-purple-400 bg-purple-400/10 border-purple-400/20", earned: false },
  { id: "designer", name: "Note Maker", icon: <Palette className="h-3.5 w-3.5" />, color: "text-pink-400 bg-pink-400/10 border-pink-400/20", earned: false },
  { id: "reviewer", name: "Top Reviewer", icon: <Star className="h-3.5 w-3.5" />, color: "text-amber-400 bg-amber-400/10 border-amber-400/20", earned: false },
  { id: "trusted", name: "Verified Student", icon: <Shield className="h-3.5 w-3.5" />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", earned: false },
  { id: "elite", name: "Scholar", icon: <Award className="h-3.5 w-3.5" />, color: "text-primary bg-primary/10 border-primary/20", earned: false },
];

export function ProfileBadges({ badges, learnerSessions = 0, learnerQuizzes = 0 }: ProfileBadgesProps) {
  const earnedBadges = allBadges.filter(b => badges.includes(b.id));
  const totalLearn = learnerSessions + learnerQuizzes;
  const hasLearner = totalLearn > 0;

  if (earnedBadges.length === 0 && !hasLearner) return null;

  return (
    <div className="px-4 sm:px-6 pb-4">
      <div className="flex flex-wrap gap-2">
        {hasLearner && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
              "text-primary bg-primary/10 border-primary/20"
            )}
            title={`${learnerSessions} tutor session${learnerSessions === 1 ? "" : "s"} • ${learnerQuizzes} quiz${learnerQuizzes === 1 ? "" : "zes"}`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>AI Learner · {totalLearn}</span>
          </div>
        )}
        {earnedBadges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
              badge.color
            )}
          >
            {badge.icon}
            <span>{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
