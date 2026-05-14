import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface TodayMission {
  id: string;
  lesson_id: string;
  date: string;
  completed: boolean;
}

export function useTodayMission() {
  const { user } = useAuth();
  return useQuery<TodayMission | null>({
    queryKey: ["today_mission", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await db.rpc("get_or_create_today_mission");
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return row ?? null;
    },
    staleTime: 60_000,
  });
}

export function useCompleteLesson() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await db
        .from("lesson_completions")
        .insert({ user_id: user.id, lesson_id: lessonId, xp_awarded: 10 });
      // Ignore unique-violation: already completed
      if (error && !`${error.message}`.toLowerCase().includes("duplicate")) throw error;
    },
    onSuccess: () => {
      toast.success("Nice. You showed up today.");
      qc.invalidateQueries({ queryKey: ["lesson_completions", user?.id] });
      qc.invalidateQueries({ queryKey: ["learner_profile", user?.id] });
      qc.invalidateQueries({ queryKey: ["today_mission", user?.id] });
      qc.invalidateQueries({ queryKey: ["milestones", user?.id] });
    },
  });
}

export interface Milestone { id: string; kind: string; unlocked_at: string }

export function useMilestones() {
  const { user } = useAuth();
  return useQuery<Milestone[]>({
    queryKey: ["milestones", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await db
        .from("milestones")
        .select("*")
        .eq("user_id", user!.id)
        .order("unlocked_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Milestone[];
    },
  });
}
