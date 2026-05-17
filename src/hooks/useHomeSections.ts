import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HomeSection = {
  id: string;
  key: string;
  enabled: boolean;
  display_order: number;
  title_override: string | null;
  subtitle_override: string | null;
};

const FALLBACK: Pick<HomeSection, "key" | "enabled" | "display_order">[] = [
  { key: "hero", enabled: true, display_order: 10 },
  { key: "quick_actions", enabled: true, display_order: 20 },
  { key: "quick_categories", enabled: true, display_order: 30 },
  { key: "mentorship", enabled: true, display_order: 35 },
  { key: "trending", enabled: true, display_order: 40 },
  { key: "community", enabled: true, display_order: 50 },
  { key: "how_it_works", enabled: true, display_order: 60 },
  { key: "why_trust", enabled: true, display_order: 70 },
  { key: "curated", enabled: true, display_order: 80 },
  { key: "new_arrivals", enabled: true, display_order: 90 },
  { key: "testimonials", enabled: true, display_order: 100 },
  { key: "faq", enabled: true, display_order: 110 },
  { key: "final_cta", enabled: true, display_order: 120 },
];

export function useHomeSections() {
  return useQuery({
    queryKey: ["home-sections"],
    staleTime: 60_000,
    queryFn: async (): Promise<HomeSection[]> => {
      const { data, error } = await (supabase as any)
        .from("home_sections")
        .select("id, key, enabled, display_order, title_override, subtitle_override")
        .order("display_order", { ascending: true });
      if (error || !data?.length) {
        return FALLBACK.map((f) => ({
          id: f.key,
          title_override: null,
          subtitle_override: null,
          ...f,
        }));
      }
      return data as HomeSection[];
    },
  });
}
