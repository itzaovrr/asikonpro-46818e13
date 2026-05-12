import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Tables are not in generated types yet — cast through any until migration is applied.
const db: any = supabase;

export interface AiThread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface StoredAiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  parts: any[];
}

export function useAiThreads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ai-threads", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AiThread[]> => {
      if (!user) return [];

      const { data, error } = await db
        .from("ai_threads")
        .select("id,title,created_at,updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AiThread[];
    },
  });
}

export function useCreateAiThread() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<AiThread> => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await db
        .from("ai_threads")
        .insert({ user_id: user.id, title: "New chat" })
        .select("id,title,created_at,updated_at")
        .single();
      if (error) throw error;
      return data as AiThread;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-threads"] }),
  });
}

export function useDeleteAiThread() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await db.from("ai_threads").delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-threads"] }),
  });
}

export function useAiThreadMessages(threadId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["ai-messages", threadId, user?.id],
    enabled: !!threadId && !!user,
    queryFn: async (): Promise<StoredAiMessage[]> => {
      if (!threadId || !user) return [];

      const { data, error } = await db
        .from("ai_messages")
        .select("id,role,parts,created_at")
        .eq("thread_id", threadId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((m) => ({
        id: m.id,
        role: m.role,
        parts: m.parts ?? [],
      }));
    },
  });
}
