import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, GripVertical, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";

type Row = {
  id: string;
  key: string;
  enabled: boolean;
  display_order: number;
  title_override: string | null;
  subtitle_override: string | null;
};

const PRETTY: Record<string, string> = {
  hero: "Hero carousel",
  quick_actions: "AI tutor + Daily streak",
  quick_categories: "Quick categories",
  trending: "Trending now",
  community: "From the community",
  how_it_works: "How Asikon helps you grow",
  why_trust: "Why learners trust Asikon",
  curated: "Curated for you",
  new_arrivals: "New arrivals",
  testimonials: "Loved by learners",
  faq: "Common questions",
  final_cta: "Final call-to-action",
};

export default function AdminHomeSections() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-home-sections"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("home_sections")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { if (data) setRows(data); }, [data]);

  const saveMut = useMutation({
    mutationFn: async (row: Partial<Row> & { id: string }) => {
      const { error } = await (supabase as any)
        .from("home_sections")
        .update(row)
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-home-sections"] });
      qc.invalidateQueries({ queryKey: ["home-sections"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save"),
  });

  const reorderMut = useMutation({
    mutationFn: async (next: Row[]) => {
      // Re-stride display_order in steps of 10 for clean future inserts.
      const updates = next.map((r, i) => ({ id: r.id, display_order: (i + 1) * 10 }));
      for (const u of updates) {
        const { error } = await (supabase as any)
          .from("home_sections")
          .update({ display_order: u.display_order })
          .eq("id", u.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Order saved");
      qc.invalidateQueries({ queryKey: ["admin-home-sections"] });
      qc.invalidateQueries({ queryKey: ["home-sections"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to reorder"),
  });

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setRows(next);
    reorderMut.mutate(next);
  };

  const toggle = (row: Row, enabled: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, enabled } : r)));
    saveMut.mutate({ id: row.id, enabled });
  };

  const updateText = (row: Row, field: "title_override" | "subtitle_override", value: string) => {
    const v = value.trim() === "" ? null : value;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [field]: v } : r)));
    saveMut.mutate({ id: row.id, [field]: v });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Home sections"
        subtitle="Toggle, reorder, and rename the blocks shown on the home page"
      />

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className="rounded-2xl border border-border/60 bg-card p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3"
            >
              <div className="flex items-center gap-2 md:w-64 shrink-0">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{PRETTY[row.key] ?? row.key}</p>
                  <p className="text-[11px] text-muted-foreground font-mono truncate">{row.key}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                <Input
                  defaultValue={row.title_override ?? ""}
                  placeholder="Title override (optional)"
                  onBlur={(e) => {
                    if ((e.target.value || null) !== row.title_override)
                      updateText(row, "title_override", e.target.value);
                  }}
                  className="h-9"
                />
                <Input
                  defaultValue={row.subtitle_override ?? ""}
                  placeholder="Subtitle override (optional)"
                  onBlur={(e) => {
                    if ((e.target.value || null) !== row.subtitle_override)
                      updateText(row, "subtitle_override", e.target.value);
                  }}
                  className="h-9"
                />
              </div>

              <div className="flex items-center gap-1.5 md:ml-auto shrink-0">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 pl-2">
                  <Switch checked={row.enabled} onCheckedChange={(v) => toggle(row, v)} />
                  <span className="text-xs text-muted-foreground w-10">{row.enabled ? "On" : "Off"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5" />
        Changes save automatically and update the home page within a minute.
      </div>
    </div>
  );
}
