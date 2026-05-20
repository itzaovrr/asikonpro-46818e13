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

// Home is intentionally lean — trust/marketing sections live on /about now.
const FALLBACK: Pick<HomeSection, "key" | "enabled" | "display_order">[] = [
  { key: "hero", enabled: true, display_order: 10 },
  { key: "quick_categories", enabled: true, display_order: 30 },
  { key: "mentorship", enabled: true, display_order: 35 },
  { key: "trending", enabled: true, display_order: 40 },
  { key: "new_arrivals", enabled: true, display_order: 50 },
  { key: "curated", enabled: true, display_order: 60 },
  { key: "community", enabled: true, display_order: 70 },
  { key: "final_cta", enabled: true, display_order: 120 },
  // Disabled on home by default — surfaced on /about. Admin can re-enable.
  { key: "quick_actions", enabled: false, display_order: 200 },
  { key: "how_it_works", enabled: false, display_order: 210 },
  { key: "why_trust", enabled: false, display_order: 220 },
  { key: "testimonials", enabled: false, display_order: 230 },
  { key: "faq", enabled: false, display_order: 240 },
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
