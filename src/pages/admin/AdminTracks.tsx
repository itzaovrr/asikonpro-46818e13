import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, GraduationCap, ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/admin/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { db } from "@/lib/db";
import { toast } from "sonner";

interface Track {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export default function AdminTracks() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Track> | null>(null);

  const { data: tracks = [], isLoading } = useQuery<Track[]>({
    queryKey: ["admin_tracks"],
    queryFn: async () => {
      const { data, error } = await db.from("tracks").select("*").order("display_order");
      if (error) throw error;
      return (data ?? []) as Track[];
    },
  });

  const save = useMutation({
    mutationFn: async (t: Partial<Track>) => {
      if (t.id) {
        const { error } = await db.from("tracks").update({
          slug: t.slug, name: t.name, description: t.description,
          icon: t.icon, display_order: t.display_order, is_active: t.is_active,
        }).eq("id", t.id);
        if (error) throw error;
      } else {
        const { error } = await db.from("tracks").insert({
          slug: t.slug, name: t.name, description: t.description,
          icon: t.icon, display_order: t.display_order ?? 0,
          is_active: t.is_active ?? true,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin_tracks"] });
      qc.invalidateQueries({ queryKey: ["tracks"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("tracks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin_tracks"] });
      qc.invalidateQueries({ queryKey: ["tracks"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Learning tracks shown across the app.</p>
        <Button onClick={() => setEditing({ display_order: (tracks[tracks.length-1]?.display_order ?? 0) + 1, is_active: true })}>
          <Plus className="h-4 w-4 mr-1" /> New track
        </Button>
      </div>

      <div className="grid gap-3">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : tracks.map((t) => (
          <GlassPanel key={t.id} className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shrink-0">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">{t.name}</p>
                {!t.is_active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted">Hidden</span>}
              </div>
              <p className="text-xs text-muted-foreground truncate">/{t.slug} · order {t.display_order}</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to={`/asikonasik/lessons?track=${t.id}`}>Lessons <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setEditing(t)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => confirm(`Delete ${t.name}? This removes its lessons.`) && del.mutate(t.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </GlassPanel>
        ))}
      </div>

      {editing && (
        <GlassPanel className="p-4 space-y-3">
          <h3 className="font-semibold">{editing.id ? "Edit track" : "New track"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div>
              <Label>Icon (lucide name)</Label>
              <Input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
            <Label>Active</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save.mutate(editing)} disabled={save.isPending || !editing.name || !editing.slug}>Save</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
