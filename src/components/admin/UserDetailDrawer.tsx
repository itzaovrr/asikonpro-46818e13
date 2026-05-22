import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsAdmin } from "@/hooks/useUserRole";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Coins,
  Trash2,
  ShieldOff,
  ShieldCheck,
  Sparkles,
  Activity as ActivityIcon,
  ExternalLink,
  Copy,
  ArrowUp,
  ArrowDown,
  History,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuditLog, resolveActorNames } from "@/hooks/useAuditLog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Props {
  userId: string | null;
  onClose: () => void;
}

const xpToLevel = (xp: number) => Math.floor((xp ?? 0) / 100) + 1;

export function UserDetailDrawer({ userId, onClose }: Props) {
  const qc = useQueryClient();
  const { isSuperAdmin } = useIsAdmin();
  const audit = useAuditLog();
  const open = !!userId;


  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["admin-user-profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: learner } = useQuery({
    queryKey: ["admin-user-learner", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("learner_profiles")
        .select("xp, streak_days, longest_streak, last_active_at, active_track_id")
        .eq("user_id", userId!)
        .maybeSingle();
      return data;
    },
  });

  const { data: lessonCount } = useQuery({
    queryKey: ["admin-user-lesson-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count } = await supabase
        .from("lesson_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!);
      return count ?? 0;
    },
  });

  const { data: userRoleList } = useQuery({
    queryKey: ["admin-user-roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      return (data ?? []).map((r: any) => r.role as string);
    },
  });

  const { data: auditTrail } = useQuery({
    queryKey: ["admin-user-audit", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_audit_log")
        .select("id, action, meta, created_at, actor_id")
        .eq("target_type", "user")
        .eq("target_id", userId!)
        .order("created_at", { ascending: false })
        .limit(30);
      const rows = data ?? [];
      const actorIds = Array.from(new Set(rows.map((r: any) => r.actor_id).filter(Boolean)));
      const names = await resolveActorNames(actorIds as string[]);
      return rows.map((r: any) => ({ ...r, actor_name: names[r.actor_id] ?? "system" }));
    },
  });

  const roleHistory = useMemo(
    () =>
      (auditTrail ?? []).filter((e: any) =>
        ["role.grant", "role.revoke", "user.ban", "user.unban"].includes(e.action),
      ),
    [auditTrail],
  );


  // --- Edit state ---
  const [editing, setEditing] = useState<Record<string, any>>({});
  const value = (k: string) => editing[k] ?? (profile as any)?.[k] ?? "";

  const saveProfile = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = {};
      ["full_name", "username", "bio", "avatar_url", "is_verified", "trust_score"].forEach((k) => {
        if (k in editing) payload[k] = editing[k];
      });
      if (Object.keys(payload).length === 0) return;
      const { error } = await supabase.from("profiles").update(payload).eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      setEditing({});
      qc.invalidateQueries({ queryKey: ["admin-user-profile", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const setXp = useMutation({
    mutationFn: async (next: number) => {
      const { error } = await supabase
        .from("learner_profiles")
        .upsert({ user_id: userId!, xp: next }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("XP updated");
      qc.invalidateQueries({ queryKey: ["admin-user-learner", userId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const setCoins = useMutation({
    mutationFn: async (next: number) => {
      const { error } = await supabase.from("profiles").update({ coins: next }).eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coins updated");
      qc.invalidateQueries({ queryKey: ["admin-user-profile", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const setStreak = useMutation({
    mutationFn: async (next: number) => {
      const { error } = await supabase
        .from("learner_profiles")
        .upsert({ user_id: userId!, streak_days: next }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Streak updated");
      qc.invalidateQueries({ queryKey: ["admin-user-learner", userId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const grantCoins = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      const current = (profile as any)?.coins ?? 0;
      const { error } = await supabase
        .from("profiles")
        .update({ coins: current + amount })
        .eq("id", userId!);
      if (error) throw error;
      return amount;
    },
    onSuccess: (amount) => {
      toast.success(`+${amount} coins granted to @${(profile as any)?.username ?? "user"}`);
      qc.invalidateQueries({ queryKey: ["admin-user-profile", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const setBan = useMutation({
    mutationFn: async (banned: boolean) => {
      const { error } = await supabase.from("profiles").update({ is_banned: banned }).eq("id", userId!);
      if (error) throw error;
      await audit({
        action: banned ? "user.ban" : "user.unban",
        target_type: "user",
        target_id: userId!,
      });
    },
    onSuccess: (_, banned) => {
      toast.success(banned ? "User banned" : "User unbanned");
      qc.invalidateQueries({ queryKey: ["admin-user-profile", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-user-audit", userId] });
    },
    onError: (e: any) => toast.error(e.message),
  });


  const resetCoins = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update({ coins: 0 }).eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coins reset to 0");
      qc.invalidateQueries({ queryKey: ["admin-user-profile", userId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      // Soft delete — clears identifying fields and bans the account.
      // True auth.users deletion requires a service-role edge function.
      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: true,
          username: `deleted_${userId!.slice(0, 8)}`,
          full_name: "[deleted]",
          bio: null,
          avatar_url: null,
        })
        .eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("User deleted (soft delete). This cannot be undone.");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const grantRole = useMutation({
    mutationFn: async (role: "moderator" | "admin") => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId!, role });
      if (error && !/duplicate/i.test(error.message)) throw error;
      await audit({ action: "role.grant", target_type: "user", target_id: userId!, meta: { role } });
    },
    onSuccess: (_, role) => {
      toast.success(`Granted ${role}`);
      qc.invalidateQueries({ queryKey: ["admin-user-roles", userId] });
      qc.invalidateQueries({ queryKey: ["admin-user-audit", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const revokeRole = useMutation({
    mutationFn: async (role: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId!)
        .eq("role", role as any);
      if (error) throw error;
      await audit({ action: "role.revoke", target_type: "user", target_id: userId!, meta: { role } });
    },
    onSuccess: (_, role) => {
      toast.success(`Removed ${role}`);
      qc.invalidateQueries({ queryKey: ["admin-user-roles", userId] });
      qc.invalidateQueries({ queryKey: ["admin-user-audit", userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });


  // --- Orders, posts, activity for tabs ---
  const { data: userOrders } = useQuery({
    queryKey: ["admin-user-orders", userId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const { data: userPosts } = useQuery({
    queryKey: ["admin-user-posts", userId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, type, content, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const { data: recentLessons } = useQuery({
    queryKey: ["admin-user-lesson-recent", userId],
    enabled: open,
    queryFn: async () => {
      const { data } = await supabase
        .from("lesson_completions")
        .select("lesson_id, completed_at, lessons:lesson_id (title)")
        .eq("user_id", userId!)
        .order("completed_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["admin-user-posts", userId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // --- UI state for confirmations / grant ---
  const [grantAmount, setGrantAmount] = useState<string>("");
  const [grantReason, setGrantReason] = useState<string>("");
  const [confirmKind, setConfirmKind] = useState<null | "ban" | "unban" | "reset" | "delete">(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const dirty = Object.keys(editing).length > 0;
  const initial = useMemo(() => ((profile as any)?.username ?? "?")[0]?.toUpperCase(), [profile]);
  const username = (profile as any)?.username ?? "user";
  const isBanned = (profile as any)?.is_banned;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] overflow-y-auto p-0 glass-strong border-border/60"
      >
        <SheetHeader className="p-5 border-b border-border/50 sticky top-0 z-10 glass-strong">
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={(profile as any)?.avatar_url ?? undefined} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-display font-semibold truncate">
                {profileLoading ? <Skeleton className="h-4 w-32" /> : (profile as any)?.full_name || username}
              </div>
              <div className="text-[11px] text-muted-foreground font-normal truncate">@{username}</div>
            </div>
            {isBanned && <Badge variant="destructive" className="text-[10px]">Banned</Badge>}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="profile" className="px-5 py-4">
          <TabsList className="grid grid-cols-6 mb-4 h-9">
            <TabsTrigger value="profile" className="text-[11px]">Profile</TabsTrigger>
            <TabsTrigger value="game" className="text-[11px]">Game</TabsTrigger>
            <TabsTrigger value="roles" className="text-[11px]">Roles</TabsTrigger>
            <TabsTrigger value="orders" className="text-[11px]">Orders</TabsTrigger>
            <TabsTrigger value="activity" className="text-[11px]">Activity</TabsTrigger>
            <TabsTrigger value="danger" className="text-[11px] text-destructive">Danger</TabsTrigger>
          </TabsList>

          {/* TAB 1 — PROFILE */}
          <TabsContent value="profile" className="space-y-3 mt-0">
            {/* Quick info header */}
            <div className="glass rounded-2xl p-3 space-y-2">
              <div className="grid grid-cols-4 gap-2 text-center">
                <Metric label="Level" value={xpToLevel(learner?.xp ?? 0)} />
                <Metric label="Coins" value={(profile as any)?.coins ?? 0} />
                <Metric label="Lessons" value={lessonCount ?? 0} />
                <Metric label="Streak" value={`${learner?.streak_days ?? 0}d`} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {(userRoleList ?? ["user"]).map((r) => (
                  <Badge key={r} variant={r === "super_admin" ? "destructive" : r === "admin" ? "default" : "secondary"} className="text-[10px]">
                    {r}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 text-[10.5px] text-muted-foreground pt-1">
                <span className="font-mono truncate">{userId}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => {
                    navigator.clipboard.writeText(userId ?? "");
                    toast.success("ID copied");
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2 text-[10.5px] text-muted-foreground">
                <span>Joined {(profile as any)?.created_at ? new Date((profile as any).created_at).toLocaleDateString() : "—"}</span>
                <span>Last seen {(profile as any)?.last_seen_at ? new Date((profile as any).last_seen_at).toLocaleString() : "—"}</span>
              </div>
            </div>

            <Field label="Full name">
              <Input

                value={value("full_name") ?? ""}
                onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
              />
            </Field>
            <Field label="Username">
              <Input
                value={value("username") ?? ""}
                onChange={(e) => setEditing({ ...editing, username: e.target.value })}
              />
            </Field>
            <Field label="Bio">
              <Textarea
                rows={3}
                value={value("bio") ?? ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
              />
            </Field>
            <Field label="Avatar URL">
              <Input
                value={value("avatar_url") ?? ""}
                onChange={(e) => setEditing({ ...editing, avatar_url: e.target.value })}
              />
              {value("avatar_url") && (
                <img
                  src={value("avatar_url")}
                  alt="Avatar preview"
                  className="mt-2 h-12 w-12 rounded-full object-cover ring-1 ring-border/60"
                />
              )}
            </Field>
            <div className="flex items-center justify-between gap-3 py-1">
              <Label className="text-xs text-muted-foreground">Verified</Label>
              <Switch
                checked={!!(value("is_verified") ?? false)}
                onCheckedChange={(c) => setEditing({ ...editing, is_verified: c })}
              />
            </div>
            <Field label="Trust score (0-100)">
              <Input
                type="number"
                min={0}
                max={100}
                value={value("trust_score") ?? 0}
                onChange={(e) => setEditing({ ...editing, trust_score: Number(e.target.value) })}
              />
            </Field>
            <Button
              className="w-full mt-2"
              disabled={!dirty || saveProfile.isPending}
              onClick={() => saveProfile.mutate()}
            >
              {saveProfile.isPending ? "Saving…" : "Save profile"}
            </Button>
          </TabsContent>

          {/* TAB 2 — GAME */}
          <TabsContent value="game" className="space-y-3 mt-0">
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Level" value={xpToLevel(learner?.xp ?? 0)} />
              <Metric label="Lessons" value={lessonCount ?? 0} />
              <Metric label="Streak" value={`${learner?.streak_days ?? 0}d`} />
            </div>

            <EditableMetric
              label="XP"
              current={learner?.xp ?? 0}
              onSave={(n) => setXp.mutate(n)}
              pending={setXp.isPending}
            />
            <EditableMetric
              label="Coins"
              current={(profile as any)?.coins ?? 0}
              onSave={(n) => setCoins.mutate(n)}
              pending={setCoins.isPending}
            />
            <EditableMetric
              label="Streak (days)"
              current={learner?.streak_days ?? 0}
              onSave={(n) => setStreak.mutate(n)}
              pending={setStreak.isPending}
            />

            <div className="text-[11px] text-muted-foreground">
              Last activity:{" "}
              {learner?.last_active_at ? new Date(learner.last_active_at).toLocaleString() : "—"}
            </div>

            <div className="glass rounded-2xl p-3 mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">Grant coins</h4>
              </div>
              <Input
                type="number"
                placeholder="Amount to add"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
              />
              <Input
                placeholder="Reason (optional)"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
              />
              <Button
                size="sm"
                className="w-full"
                disabled={!grantAmount || Number(grantAmount) <= 0 || grantCoins.isPending}
                onClick={() => {
                  grantCoins.mutate({ amount: Number(grantAmount) });
                  setGrantAmount("");
                  setGrantReason("");
                }}
              >
                <Coins className="h-3.5 w-3.5 mr-1.5" />
                Grant coins
              </Button>
            </div>
          </TabsContent>

          {/* TAB — ROLES */}
          <TabsContent value="roles" className="space-y-3 mt-0">
            <div className="glass rounded-2xl p-3 space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Current roles</h4>
              <div className="flex flex-wrap gap-1.5">
                {(userRoleList ?? []).length === 0 && (
                  <span className="text-xs text-muted-foreground">No explicit roles</span>
                )}
                {(userRoleList ?? []).map((r) => {
                  const isSuper = r === "super_admin";
                  const canRevoke = !isSuper && (r === "moderator" || (r === "admin" && isSuperAdmin));
                  return (
                    <Badge
                      key={r}
                      variant={isSuper ? "destructive" : r === "admin" ? "default" : "secondary"}
                      className="text-[10px] gap-1"
                    >
                      {r}
                      {canRevoke && (
                        <button
                          onClick={() => revokeRole.mutate(r)}
                          className="ml-1 hover:text-destructive-foreground"
                          aria-label={`Revoke ${r}`}
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-3 space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Grant role</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={(userRoleList ?? []).includes("moderator") || grantRole.isPending}
                  onClick={() => grantRole.mutate("moderator")}
                >
                  <ArrowUp className="h-3.5 w-3.5 mr-1.5" />
                  Moderator
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={!isSuperAdmin || (userRoleList ?? []).includes("admin") || grantRole.isPending}
                  onClick={() => grantRole.mutate("admin")}
                >
                  <ArrowUp className="h-3.5 w-3.5 mr-1.5" />
                  Admin
                </Button>
              </div>
              {!isSuperAdmin && (
                <p className="text-[10px] text-muted-foreground">Only super-admin can grant admin role.</p>
              )}
            </div>

            <div className="glass rounded-2xl p-3 space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="h-3 w-3" /> Role &amp; ban history
              </h4>
              {roleHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground py-1">No history yet.</p>
              ) : (
                <ul className="space-y-1">
                  {roleHistory.map((e: any) => (
                    <li key={e.id} className="flex items-start gap-2 text-[11px] border-l-2 border-border/60 pl-2 py-1">
                      <span className="font-mono text-muted-foreground whitespace-nowrap">
                        {new Date(e.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex-1">
                        <span className="font-semibold">{e.action}</span>
                        {e.meta?.role && <span className="text-muted-foreground"> · {e.meta.role}</span>}
                        <span className="text-muted-foreground"> by @{e.actor_name}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          {/* TAB 3 — ORDERS */}

          <TabsContent value="orders" className="space-y-2 mt-0">
            {(userOrders ?? []).length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No orders.</p>
            ) : (
              userOrders!.map((o: any) => (
                <Link
                  key={o.id}
                  to={`/asikonasik/orders`}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors"
                >
                  <span className="font-mono text-[11px] text-muted-foreground truncate">
                    #{o.id.slice(0, 8)}
                  </span>
                  <span className="text-sm font-medium">৳{Number(o.total).toFixed(0)}</span>
                  <Badge variant="outline" className="text-[10px]">{o.status}</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))
            )}
          </TabsContent>

          {/* TAB 4 — ACTIVITY */}
          <TabsContent value="activity" className="space-y-4 mt-0">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Recent posts
              </h4>
              {(userPosts ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No posts.</p>
              ) : (
                <ul className="space-y-1.5">
                  {userPosts!.map((p: any) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border/40"
                    >
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {p.type}
                      </Badge>
                      <span className="flex-1 text-xs truncate">
                        {(p.content ?? "").slice(0, 80) || "—"}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => deletePost.mutate(p.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <ActivityIcon className="h-3 w-3" /> Lessons completed
              </h4>
              {(recentLessons ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">None yet.</p>
              ) : (
                <ul className="space-y-1">
                  {recentLessons!.map((l: any, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-lg border border-border/40"
                    >
                      <span className="truncate">{l.lessons?.title ?? "Lesson"}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(l.completed_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <History className="h-3 w-3" /> Audit trail
              </h4>
              {(auditTrail ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No admin actions recorded.</p>
              ) : (
                <ul className="space-y-1">
                  {auditTrail!.slice(0, 15).map((e: any) => (
                    <li
                      key={e.id}
                      className="flex items-start gap-2 text-[11px] p-2 rounded-lg border border-border/40"
                    >
                      <Badge variant="outline" className="text-[10px] shrink-0">{e.action}</Badge>
                      <span className="flex-1 truncate text-muted-foreground">
                        by @{e.actor_name}
                        {e.meta && Object.keys(e.meta).length > 0 && (
                          <span> · {JSON.stringify(e.meta)}</span>
                        )}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(e.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>


          {/* TAB 5 — DANGER ZONE */}
          <TabsContent value="danger" className="space-y-3 mt-0">
            <div className="glass rounded-2xl p-4 border border-destructive/30">
              <h4 className="text-sm font-semibold mb-1">
                {isBanned ? "Unban user" : "Ban user"}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {isBanned
                  ? "Restore login access for this user."
                  : "Prevents the user from logging in."}
              </p>
              <Button
                variant={isBanned ? "default" : "destructive"}
                size="sm"
                onClick={() => setConfirmKind(isBanned ? "unban" : "ban")}
              >
                {isBanned ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    Unban
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
                    Ban user
                  </>
                )}
              </Button>
            </div>

            <div className="glass rounded-2xl p-4 border border-destructive/30">
              <h4 className="text-sm font-semibold mb-1">Reset coins to 0</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Sets this user's coin balance to zero.
              </p>
              <Button variant="destructive" size="sm" onClick={() => setConfirmKind("reset")}>
                Reset coins
              </Button>
            </div>

            {isSuperAdmin && (
              <div className="glass rounded-2xl p-4 border border-destructive/50">
                <h4 className="text-sm font-semibold text-destructive mb-1">Delete account</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Soft-deletes the user (anonymizes profile + bans). Super-admin only.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setConfirmKind("delete");
                    setDeleteConfirmText("");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete account
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AlertDialog
          open={!!confirmKind}
          onOpenChange={(o) => !o && setConfirmKind(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmKind === "ban" && "Ban this user?"}
                {confirmKind === "unban" && "Unban this user?"}
                {confirmKind === "reset" && "Reset coins to 0?"}
                {confirmKind === "delete" && "Delete this account?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmKind === "delete"
                  ? `Type the username "${username}" to confirm. This cannot be undone.`
                  : `@${username}`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {confirmKind === "delete" && (
              <Input
                placeholder={`type "${username}"`}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirmKind === "delete" && deleteConfirmText !== username}
                onClick={() => {
                  if (confirmKind === "ban") setBan.mutate(true);
                  if (confirmKind === "unban") setBan.mutate(false);
                  if (confirmKind === "reset") resetCoins.mutate();
                  if (confirmKind === "delete") deleteUser.mutate();
                  setConfirmKind(null);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-display font-bold">{value}</div>
    </div>
  );
}

function EditableMetric({
  label,
  current,
  onSave,
  pending,
}: {
  label: string;
  current: number;
  onSave: (n: number) => void;
  pending?: boolean;
}) {
  const [v, setV] = useState<string>("");
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label} <span className="text-foreground/60 normal-case">· now {current}</span>
        </Label>
        <Input
          type="number"
          placeholder={String(current)}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={v === "" || pending}
        onClick={() => {
          onSave(Number(v));
          setV("");
        }}
      >
        Set
      </Button>
    </div>
  );
}
