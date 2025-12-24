import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UsePostsOptions {
  type?: string;
  userId?: string;
  limit?: number;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { type, userId, limit = 20 } = options;

  return useQuery({
    queryKey: ["posts", { type, userId, limit }],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (*)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq("type", type);
      }

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (*)
        `)
        .eq("id", postId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      content,
      images,
      videoUrl,
      type = "post",
      productId,
    }: {
      content?: string;
      images?: string[];
      videoUrl?: string;
      type?: string;
      productId?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content,
          images,
          video_url: videoUrl,
          type,
          product_id: productId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Check if already liked
      const { data: existing } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        return { liked: false };
      } else {
        // Like
        const { error } = await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error) throw error;
        return { liked: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          *,
          profiles (*)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
      parentId,
    }: {
      postId: string;
      content: string;
      parentId?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
