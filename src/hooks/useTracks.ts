import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useAuth } from "./useAuth";

export interface Track {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Lesson {
  id: string;
  track_id: string;
  order: number;
  title: string;
  outcome: string | null;
  duration_min: number;
  content_md: string | null;
  video_url: string | null;
  transcript: string | null;
  pdf_url: string | null;
  is_preview: boolean;
}

export function useTracks() {
  return useQuery<Track[]>({
    queryKey: ["tracks"],
    queryFn: async () => {
      const { data, error } = await db
        .from("tracks")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as Track[];
    },
    staleTime: 5 * 60_000,
  });
}

export function useTrack(slug?: string) {
  return useQuery<Track | null>({
    queryKey: ["track", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await db
        .from("tracks")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });
}

export function useTrackLessons(trackId?: string) {
  return useQuery<Lesson[]>({
    queryKey: ["track_lessons", trackId],
    enabled: !!trackId,
    queryFn: async () => {
      const { data, error } = await db
        .from("lessons")
        .select("*")
        .eq("track_id", trackId)
        .order("order");
      if (error) throw error;
      return (data ?? []) as Lesson[];
    },
  });
}

export function useLesson(id?: string) {
  return useQuery<Lesson | null>({
    queryKey: ["lesson", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await db
        .from("lessons")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });
}

export function useLessonCompletions() {
  const { user } = useAuth();
  return useQuery<Set<string>>({
    queryKey: ["lesson_completions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await db
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map((r: any) => r.lesson_id));
    },
    staleTime: 30_000,
  });
}
