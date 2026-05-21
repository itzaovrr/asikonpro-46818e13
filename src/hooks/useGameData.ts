import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface GameStats {
  coins: number;
  xp: number;
  level: number;
  levelProgress: number;
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

export interface RewardItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  coins_required: number;
  image_url: string | null;
  display_order: number;
}

export interface LeaderboardEntry {
  user_id: string;
  xp: number;
  streak_days: number;
  longest_streak: number;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

export interface HistoryEntry {
  id: string;
  completed_at: string;
  xp_awarded: number;
  lesson_title: string;
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
        supabase.from("profiles").select("coins").eq("id", user.id).maybeSingle(),
        db
          .from("learner_profiles")
          .select("xp,streak_days,longest_streak")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("lesson_completions")
          .select("completed_at")
          .eq("user_id", user.id),
      ]);

      const coins = profileRes.data?.coins ?? 0;
      const xp = learnerRes.data?.xp ?? 0;
      const streakDays = learnerRes.data?.streak_days ?? 0;
      const longestStreak = learnerRes.data?.longest_streak ?? streakDays;
      const completions: { completed_at: string }[] = completionsRes.data ?? [];

      const level = Math.floor(xp / XP_PER_LEVEL) + 1;
      const levelProgress = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);
      const xpToNextLevel = XP_PER_LEVEL - (xp % XP_PER_LEVEL);

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
        longestStreak,
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

      const { data: tracks, error: tErr } = await supabase
        .from("tracks")
        .select("id,name,icon,is_active")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (tErr) throw tErr;
      if (!tracks?.length) return [];

      const trackIds = tracks.map((t) => t.id);
      const [lessonsRes, completionsRes] = await Promise.all([
        supabase
          .from("lessons")
          .select("id,title,track_id,order")
          .in("track_id", trackIds)
          .order("order", { ascending: true }),
        supabase
          .from("lesson_completions")
          .select("lesson_id")
          .eq("user_id", user.id),
      ]);

      const lessons = lessonsRes.data ?? [];
      const completed = new Set<string>(
        (completionsRes.data ?? []).map((r) => r.lesson_id),
      );

      const enrolled: EnrolledCourse[] = [];
      for (const t of tracks) {
        const trackLessons = lessons.filter((l) => l.track_id === t.id);
        if (trackLessons.length === 0) continue;
        const doneCount = trackLessons.filter((l) => completed.has(l.id)).length;
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

export function useRewards() {
  return useQuery<RewardItem[]>({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await db
        .from("rewards")
        .select("id,title,description,type,coins_required,image_url,display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RewardItem[];
    },
  });
}

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard-top10"],
    queryFn: async () => {
      const { data: top, error } = await db
        .from("learner_profiles")
        .select("user_id,xp,streak_days,longest_streak")
        .order("xp", { ascending: false })
        .limit(10);
      if (error) throw error;
      const rows = (top ?? []) as Array<{ user_id: string; xp: number; streak_days: number; longest_streak: number }>;
      if (rows.length === 0) return [];
      const ids = rows.map((r) => r.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,full_name,username,avatar_url")
        .in("id", ids);
      const pMap = new Map((profs ?? []).map((p) => [p.id, p]));
      return rows.map((r) => ({
        ...r,
        full_name: pMap.get(r.user_id)?.full_name ?? null,
        username: pMap.get(r.user_id)?.username ?? null,
        avatar_url: pMap.get(r.user_id)?.avatar_url ?? null,
      }));
    },
  });
}

export function useLessonHistory() {
  const { user } = useAuth();
  return useQuery<HistoryEntry[]>({
    queryKey: ["lesson-history", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("lesson_completions")
        .select("id,completed_at,xp_awarded,lessons(title)")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        completed_at: r.completed_at,
        xp_awarded: r.xp_awarded,
        lesson_title: r.lessons?.title ?? "Lesson",
      }));
    },
  });
}

export function useRedeemReward() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ rewardKey, coins }: { rewardKey: string; coins: number }) => {
      const { data, error } = await supabase.rpc("redeem_reward", {
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
