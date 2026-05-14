import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { db } from "@/lib/db";

export interface LearnerProfile {
  user_id: string;
  goal: string | null;
  level: string | null;
  interests: string[] | null;
  learning_style: string | null;
  active_track_id: string | null;
  locale: string;
  onboarded_at: string | null;
  last_active_at: string | null;
  streak_days: number;
  xp: number;
}

export function useLearnerProfile() {
  const { user } = useAuth();
  return useQuery<LearnerProfile | null>({
    queryKey: ["learner_profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await db
        .from("learner_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
    staleTime: 60_000,
  });
}

export function useUpsertLearnerProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<LearnerProfile>) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await db
        .from("learner_profiles")
        .upsert({ user_id: user.id, ...patch }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data as LearnerProfile;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["learner_profile", user?.id] });
    },
  });
}
