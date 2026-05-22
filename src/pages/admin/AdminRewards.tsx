import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Gift, Coins } from "lucide-react";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";
import { formatDistanceToNow } from "date-fns";

interface Reward {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  coins_required: number;
  type: string;
  is_active: boolean;
  display_order: number;
}

interface RewardForm {
  title: string;
  description: string;
  image_url: string;
  coins_required: number;
  type: string;
  is_active: boolean;
  display_order: number;
}

const emptyForm: RewardForm = {
  title: "",
  description: "",
  image_url: "",
  coins_required: 100,
  type: "general",
  is_active: true,
  display_order: 0,
};

function RewardDialog({
  trigger,
  initial,
  onSubmit,
  title,
  busy,
}: {
  trigger: React.ReactNode;
  initial: RewardForm;
  onSubmit: (form: RewardForm) => Promise<void> | void;
  title: string;
  busy?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RewardForm>(initial);

  const submit = async () => {
    await onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setForm(initial);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Coins required</Label>
              <Input
                type="number"
                min={0}
                value={form.coins_required}
                onChange={(e) =>
                  setForm({ ...form, coins_required: parseInt(e.target.value || "0", 10) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1.5">
              <Label>Display order</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: parseInt(e.target.value || "0", 10) })
                }
              />
            </div>
            <label className="flex items-center justify-between rounded-lg border border-border p-2 mt-5">
              <span className="text-sm">Active</span>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !form.title.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminRewards() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const rewardsQ = useQuery({
    queryKey: ["admin-rewards"],
    queryFn: async (): Promise<Reward[]> => {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Reward[];
    },
  });

  const redemptionsQ = useQuery({
    queryKey: ["admin-redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reward_redemptions")
        .select("id,user_id,reward_key,coins_spent,created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  const createMut = useMutation({
    mutationFn: async (form: RewardForm) => {
      const { error } = await supabase.from("rewards").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        coins_required: form.coins_required,
        type: form.type.trim() || "general",
        is_active: form.is_active,
        display_order: form.display_order,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reward created");
      qc.invalidateQueries({ queryKey: ["admin-rewards"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, form }: { id: string; form: RewardForm }) => {
      const { error } = await supabase
        .from("rewards")
        .update({
          title: form.title.trim(),
          description: form.description.trim() || null,
          image_url: form.image_url.trim() || null,
          coins_required: form.coins_required,
          type: form.type.trim() || "general",
          is_active: form.is_active,
          display_order: form.display_order,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reward updated");
      qc.invalidateQueries({ queryKey: ["admin-rewards"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("rewards").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-rewards"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rewards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reward deleted");
      qc.invalidateQueries({ queryKey: ["admin-rewards"] });
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <SectionHeader
          eyebrow="Rewards"
          title="Manage rewards & redemptions"
          subtitle="Configure the coin store, stock and approve redemptions."
          className="mb-0"
        />
        <RewardDialog
          title="New reward"
          initial={emptyForm}
          busy={createMut.isPending}
          onSubmit={(form) => createMut.mutateAsync(form)}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New reward
            </Button>
          }
        />
      </div>

      {/* Rewards grid */}
      <div>
        {rewardsQ.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : !rewardsQ.data?.length ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Gift className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No rewards yet. Create your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardsQ.data.map((r) => (
              <div
                key={r.id}
                className="glass rounded-2xl overflow-hidden hover-lift flex flex-col"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {r.image_url ? (
                    <img
                      src={r.image_url}
                      alt={r.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <Gift className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={r.is_active ? "default" : "secondary"} className="text-[10px]">
                      {r.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{r.title}</h3>
                    <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold whitespace-nowrap">
                      <Coins className="h-3 w-3" />
                      {r.coins_required}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {r.description ?? "No description"}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={r.is_active}
                        onCheckedChange={(v) => toggleMut.mutate({ id: r.id, is_active: v })}
                      />
                      <span className="text-[11px] text-muted-foreground">#{r.display_order}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RewardDialog
                        title="Edit reward"
                        initial={{
                          title: r.title,
                          description: r.description ?? "",
                          image_url: r.image_url ?? "",
                          coins_required: r.coins_required,
                          type: r.type,
                          is_active: r.is_active,
                          display_order: r.display_order,
                        }}
                        busy={updateMut.isPending}
                        onSubmit={(form) => updateMut.mutateAsync({ id: r.id, form })}
                        trigger={
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent redemptions */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-semibold">Recent redemptions</h3>
          <Badge variant="secondary" className="text-[10px]">
            {redemptionsQ.data?.length ?? 0}
          </Badge>
        </div>
        {redemptionsQ.isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !redemptionsQ.data?.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">No redemptions yet.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {redemptionsQ.data.map((r: any) => (
              <li key={r.id} className="flex items-center justify-between py-2.5 text-sm gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{r.reward_key}</p>
                  <p className="text-[11px] text-muted-foreground font-mono truncate">
                    {r.user_id.slice(0, 8)}…
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Coins className="h-3 w-3" />
                  {r.coins_spent}
                </span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this reward?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the reward from the coin store. Existing redemptions are
              preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
