import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function AdminMentors() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["admin-mentors"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("mentors")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: waitlist } = useQuery({
    queryKey: ["admin-mentor-waitlist"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("mentor_waitlist")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await (supabase as any)
        .from("mentors")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-mentors"] });
      toast({ title: "Updated" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display font-bold text-2xl mb-1">Mentors</h1>
        <p className="text-sm text-muted-foreground mb-4">Manage 1-on-1 tutors and waitlist requests.</p>

        {isLoading ? (
          <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <div className="rounded-xl border border-border/60 divide-y divide-border/60">
            {(mentors ?? []).map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {m.subjects?.join(", ")} · {m.languages?.join("/")}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">৳{m.hourly_rate}/hr</Badge>
                <Switch
                  checked={m.is_active}
                  onCheckedChange={(v) => toggle.mutate({ id: m.id, is_active: v })}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display font-bold text-xl mb-1">Waitlist requests</h2>
        <p className="text-sm text-muted-foreground mb-4">{waitlist?.length ?? 0} total</p>
        <div className="rounded-xl border border-border/60 divide-y divide-border/60">
          {(waitlist ?? []).map((w: any) => (
            <div key={w.id} className="p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {w.parent_name} · {w.child_name} ({w.child_age})
                </p>
                <Badge variant="outline">{w.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {w.subject} · {w.preferred_language} · {w.parent_contact}
              </p>
              {w.notes && <p className="text-xs mt-1 line-clamp-2">{w.notes}</p>}
            </div>
          ))}
          {!waitlist?.length && (
            <p className="p-6 text-center text-sm text-muted-foreground">No requests yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
