import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const db: any = supabase;

export interface GameStats {
  coins: number;
  xp: number;
  level: number;
  levelProgress: number; // 0-100
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  lessonsCompletedTotal: number;
  lessonsToday: number;
  weekActivity: { day: string; active: boolean }[];
}

export interface EnrolledCourse {
  id: string;
  title: string;
  cover: string | null;
  completed: number;
  total: number;
  nextLessonTitle: string | null;
  nextLessonId: string | null;
}

const XP_PER_LEVEL = 100;
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function useGameStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["game-stats", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<GameStats> => {
      if (!user) throw new Error("Not signed in");

      const [profileRes, learnerRes, completionsRes] = await Promise.all([
        db.from("profiles").select("coins").eq("id", user.id).maybeSingle(),
        db
          .from("learner_profiles")
          .select("xp,streak_days")
          .eq("user_id", user.id)
          .maybeSingle(),
        db
          .from("lesson_completions")
          .select("completed_at")
          .eq("user_id", user.id),
      ]);

      const coins = profileRes.data?.coins ?? 0;
      const xp = learnerRes.data?.xp ?? 0;
      const streakDays = learnerRes.data?.streak_days ?? 0;
      const completions: { completed_at: string }[] = completionsRes.data ?? [];

      const level = Math.floor(xp / XP_PER_LEVEL) + 1;
      const levelProgress = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);
      const xpToNextLevel = XP_PER_LEVEL - (xp % XP_PER_LEVEL);

      // Week activity — last 7 days, today is the last cell
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const week: { day: string; active: boolean }[] = [];
      const activeDays = new Set(
        completions.map((c) => {
          const d = new Date(c.completed_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
      );
      let lessonsToday = 0;
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const t = d.getTime();
        week.push({ day: DAY_LABELS[d.getDay()], active: activeDays.has(t) });
        if (i === 0) {
          lessonsToday = completions.filter((c) => {
            const cd = new Date(c.completed_at);
            cd.setHours(0, 0, 0, 0);
            return cd.getTime() === t;
          }).length;
        }
      }

      return {
        coins,
        xp,
        level,
        levelProgress,
        xpToNextLevel,
        streakDays,
        longestStreak: streakDays, // no historical column yet; show current
        lessonsCompletedTotal: completions.length,
        lessonsToday,
        weekActivity: week,
      };
    },
  });
}

export function useEnrolledCourses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["enrolled-courses", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<EnrolledCourse[]> => {
      if (!user) return [];

      // Get all tracks with their lessons
      const { data: tracks, error: tErr } = await db
        .from("tracks")
        .select("id,name,icon,is_active")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (tErr) throw tErr;
      if (!tracks?.length) return [];

      const [lessonsRes, completionsRes] = await Promise.all([
        db
          .from("lessons")
          .select("id,title,track_id,order")
          .in("track_id", tracks.map((t: any) => t.id))
          .order("order", { ascending: true }),
        db
          .from("lesson_completions")
          .select("lesson_id")
          .eq("user_id", user.id),
      ]);

      const lessons: { id: string; title: string; track_id: string; order: number }[] =
        lessonsRes.data ?? [];
      const completed = new Set<string>(
        (completionsRes.data ?? []).map((r: any) => r.lesson_id),
      );

      const enrolled: EnrolledCourse[] = [];
      for (const t of tracks as any[]) {
        const trackLessons = lessons.filter((l) => l.track_id === t.id);
        if (trackLessons.length === 0) continue;
        const doneCount = trackLessons.filter((l) => completed.has(l.id)).length;
        // Only show tracks the user has started OR all (here: only started)
        if (doneCount === 0) continue;
        const next = trackLessons.find((l) => !completed.has(l.id));
        enrolled.push({
          id: t.id,
          title: t.name,
          cover: t.icon ?? null,
          completed: doneCount,
          total: trackLessons.length,
          nextLessonTitle: next?.title ?? null,
          nextLessonId: next?.id ?? null,
        });
      }
      return enrolled;
    },
  });
}

export function useRedeemReward() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ rewardKey, coins }: { rewardKey: string; coins: number }) => {
      const { data, error } = await db.rpc("redeem_reward", {
        _reward_key: rewardKey,
        _coins: coins,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Reward redeemed!", {
        description: "Coins deducted from your balance.",
      });
      qc.invalidateQueries({ queryKey: ["game-stats", user?.id] });
    },
    onError: (err: any) => {
      toast.error("Couldn't redeem", {
        description: err.message ?? "Please try again.",
      });
    },
  });
}
