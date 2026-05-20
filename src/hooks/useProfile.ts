import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ["profile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: {
      username?: string;
      full_name?: string;
      bio?: string;
      avatar_url?: string;
      cover_url?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_followers")
        .select(`
          *,
          follower:profiles!user_followers_follower_id_fkey (*)
        `)
        .eq("following_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_followers")
        .select(`
          *,
          following:profiles!user_followers_following_id_fkey (*)
        `)
        .eq("follower_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (followingId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_followers")
        .insert({
          follower_id: user.id,
          following_id: followingId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (followingId: string) => {
      await queryClient.cancelQueries({ queryKey: ["profile-counts", followingId] });
      const prev = queryClient.getQueryData<any>(["profile-counts", followingId]);
      if (prev) {
        queryClient.setQueryData(["profile-counts", followingId], {
          ...prev,
          followers: (prev.followers ?? 0) + 1,
        });
      }
      return { prev, followingId };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["profile-counts", ctx.followingId], ctx.prev);
    },
    onSettled: (_d, _e, followingId) => {
      queryClient.invalidateQueries({ queryKey: ["followers", followingId] });
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile-counts", followingId] });
      queryClient.invalidateQueries({ queryKey: ["profile-counts", user?.id] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (followingId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", followingId);

      if (error) throw error;
      return followingId;
    },
    onMutate: async (followingId: string) => {
      await queryClient.cancelQueries({ queryKey: ["profile-counts", followingId] });
      const prev = queryClient.getQueryData<any>(["profile-counts", followingId]);
      if (prev) {
        queryClient.setQueryData(["profile-counts", followingId], {
          ...prev,
          followers: Math.max(0, (prev.followers ?? 0) - 1),
        });
      }
      return { prev, followingId };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["profile-counts", ctx.followingId], ctx.prev);
    },
    onSettled: (_d, _e, followingId) => {
      queryClient.invalidateQueries({ queryKey: ["followers", followingId] });
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile-counts", followingId] });
      queryClient.invalidateQueries({ queryKey: ["profile-counts", user?.id] });
    },
  });
}

