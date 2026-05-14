import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { GlassPanel } from "@/components/admin/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/db";
import { toast } from "sonner";

interface Track { id: string; name: string; slug: string }
interface Lesson {
  id: string; track_id: string; order: number; title: string; outcome: string | null;
  duration_min: number; content_md: string | null; video_url: string | null;
  transcript: string | null; pdf_url: string | null; is_preview: boolean;
}

export default function AdminLessons() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const trackFilter = params.get("track") ?? "";
  const [editing, setEditing] = useState<Partial<Lesson> | null>(null);

  const { data: tracks = [] } = useQuery<Track[]>({
    queryKey: ["admin_tracks_list"],
    queryFn: async () => {
      const { data } = await db.from("tracks").select("id,name,slug").order("display_order");
      return (data ?? []) as Track[];
    },
  });

  const { data: lessons = [], isLoading } = useQuery<Lesson[]>({
    queryKey: ["admin_lessons", trackFilter],
    queryFn: async () => {
      let q = db.from("lessons").select("*").order("order");
      if (trackFilter) q = q.eq("track_id", trackFilter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Lesson[];
    },
  });

  const save = useMutation({
    mutationFn: async (l: Partial<Lesson>) => {
      const payload = {
        track_id: l.track_id, order: l.order ?? 0, title: l.title,
        outcome: l.outcome ?? null, duration_min: l.duration_min ?? 5,
        content_md: l.content_md ?? null, video_url: l.video_url ?? null,
        transcript: l.transcript ?? null, pdf_url: l.pdf_url ?? null,
        is_preview: l.is_preview ?? false,
      };
      if (l.id) {
        const { error } = await db.from("lessons").update(payload).eq("id", l.id);
        if (error) throw error;
      } else {
        const { error } = await db.from("lessons").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin_lessons"] });
      qc.invalidateQueries({ queryKey: ["track_lessons"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin_lessons"] });
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    lessons.forEach((l) => {
      const arr = map.get(l.track_id) ?? [];
      arr.push(l);
      map.set(l.track_id, arr);
    });
    return map;
  }, [lessons]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Filter by track</Label>
          <Select value={trackFilter || "all"} onValueChange={(v) => setParams(v === "all" ? {} : { track: v })}>
            <SelectTrigger className="w-56 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tracks</SelectItem>
              {tracks.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setEditing({
          track_id: trackFilter || tracks[0]?.id, order: (lessons[lessons.length-1]?.order ?? 0) + 1,
          duration_min: 5, is_preview: false,
        })} disabled={tracks.length === 0}>
          <Plus className="h-4 w-4 mr-1" /> New lesson
        </Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="space-y-4">
          {tracks
            .filter((t) => !trackFilter || t.id === trackFilter)
            .map((t) => (
              <div key={t.id}>
                <h3 className="font-semibold text-sm mb-2 px-1">{t.name}</h3>
                <div className="grid gap-2">
                  {(grouped.get(t.id) ?? []).map((l) => (
                    <GlassPanel key={l.id} className="p-3 flex items-center gap-3">
                      <span className="grid place-items-center h-8 w-8 rounded-lg bg-muted text-xs font-semibold tabular-nums">{l.order}</span>
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{l.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {l.duration_min} min{l.is_preview ? " · Preview" : ""} · {l.outcome ?? "no outcome set"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setEditing(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => confirm("Delete lesson?") && del.mutate(l.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </GlassPanel>
                  ))}
                  {(grouped.get(t.id) ?? []).length === 0 && (
                    <p className="text-xs text-muted-foreground px-1">No lessons yet.</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {editing && (
        <GlassPanel className="p-4 space-y-3">
          <h3 className="font-semibold">{editing.id ? "Edit lesson" : "New lesson"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <Label>Track</Label>
              <Select value={editing.track_id ?? ""} onValueChange={(v) => setEditing({ ...editing, track_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select track" /></SelectTrigger>
                <SelectContent>
                  {tracks.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input type="number" value={editing.duration_min ?? 5} onChange={(e) => setEditing({ ...editing, duration_min: Number(e.target.value) })} />
            </div>
            <div className="flex items-end gap-2">
              <Switch checked={editing.is_preview ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_preview: v })} />
              <Label>Free preview</Label>
            </div>
            <div className="sm:col-span-2">
              <Label>Outcome (the "why")</Label>
              <Input value={editing.outcome ?? ""} onChange={(e) => setEditing({ ...editing, outcome: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Content (markdown)</Label>
              <Textarea rows={6} value={editing.content_md ?? ""} onChange={(e) => setEditing({ ...editing, content_md: e.target.value })} />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input value={editing.video_url ?? ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} />
            </div>
            <div>
              <Label>PDF URL</Label>
              <Input value={editing.pdf_url ?? ""} onChange={(e) => setEditing({ ...editing, pdf_url: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save.mutate(editing)} disabled={save.isPending || !editing.title || !editing.track_id}>Save</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
