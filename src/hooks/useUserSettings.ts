import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserSettings {
  user_id: string;
  profile_visibility: "public" | "followers" | "private";
  show_online_status: boolean;
  allow_messages_from: "everyone" | "followers" | "none";
  show_orders_to_followers: boolean;
  notify_orders: boolean;
  notify_promotions: boolean;
  notify_community: boolean;
  notify_messages: boolean;
  notify_follows: boolean;
}

export function useUserSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-settings", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as UserSettings;
      // Self-heal if backfill missed this user
      const { data: created, error: insErr } = await supabase
        .from("user_settings")
        .insert({ user_id: user!.id })
        .select()
        .single();
      if (insErr) throw insErr;
      return created as UserSettings;
    },
  });
}

export function useUpdateUserSettings() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (updates: Partial<Omit<UserSettings, "user_id">>) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("user_settings")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data as UserSettings;
    },
    onMutate: async (updates) => {
      await qc.cancelQueries({ queryKey: ["user-settings", user?.id] });
      const prev = qc.getQueryData<UserSettings>(["user-settings", user?.id]);
      if (prev) qc.setQueryData(["user-settings", user?.id], { ...prev, ...updates });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["user-settings", user?.id], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["user-settings", user?.id] });
    },
  });
}
