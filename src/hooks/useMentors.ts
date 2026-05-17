import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Mentor = {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
  bio: string | null;
  subjects: string[];
  languages: string[];
  hourly_rate: number;
  rating: number;
  experience_years: number;
  for_age_min: number;
  for_age_max: number;
  is_active: boolean;
  display_order: number;
};

export function useMentors() {
  return useQuery({
    queryKey: ["mentors"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Mentor[]> => {
      const { data, error } = await (supabase as any)
        .from("mentors")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Mentor[];
    },
  });
}
