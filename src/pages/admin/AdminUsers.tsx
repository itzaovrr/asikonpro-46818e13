import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import {
  Search,
  Download,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuditLog } from "@/hooks/useAuditLog";

const ROLE_OPTIONS = ["all", "user", "moderator", "admin", "super_admin"] as const;
type RoleOpt = (typeof ROLE_OPTIONS)[number];
const BAN_OPTIONS = ["all", "active", "banned"] as const;
type BanOpt = (typeof BAN_OPTIONS)[number];
const PAGE_SIZE = 50;

interface ProfileRow {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  trust_score: number | null;
  coins: number | null;
  is_verified: boolean | null;
  is_banned: boolean | null;
  last_seen_at: string | null;
  created_at: string;
}

function statusOf(p: ProfileRow): { label: string; tone: "online" | "today" | "ago" | "banned" } {
  if (p.is_banned) return { label: "Banned", tone: "banned" };
  if (!p.last_seen_at) return { label: "—", tone: "ago" };
  const last = new Date(p.last_seen_at).getTime();
  const diff = Date.now() - last;
  const min = diff / 60_000;
  if (min < 5) return { label: "Active", tone: "online" };
  if (diff < 24 * 3600_000) return { label: "Online today", tone: "today" };
  const days = Math.floor(diff / (24 * 3600_000));
  return { label: `${days}d ago`, tone: "ago" };
}

function StatusPill({ p }: { p: ProfileRow }) {
  const s = statusOf(p);
  if (s.tone === "banned") return <Badge variant="destructive" className="text-[10px]">Banned</Badge>;
  if (s.tone === "online")
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-500">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  if (s.tone === "today")
    return <span className="text-[11px] text-foreground/70">Online today</span>;
  return <span className="text-[11px] text-muted-foreground">{s.label}</span>;
}

function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

type ConfirmAction =
  | { kind: "ban"; user: ProfileRow }
  | { kind: "unban"; user: ProfileRow }
  | { kind: "promote"; user: ProfileRow; role: "moderator" | "admin" }
  | { kind: "demote"; user: ProfileRow; role: "moderator" | "admin" }
  | { kind: "bulkBan"; ids: string[] }
  | { kind: "bulkUnban"; ids: string[] };

// Build a windowed page-number array with ellipses.
function buildPageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out: (number | "…")[] = [];
  const c = current;
  const last = total - 1;
  out.push(0);
  if (c > 3) out.push("…");
  for (let i = Math.max(1, c - 1); i <= Math.min(last - 1, c + 1); i++) out.push(i);
  if (c < last - 3) out.push("…");
  out.push(last);
  return out;
}

export default function AdminUsers() {
  const qc = useQueryClient();
  const audit = useAuditLog();
  const { isSuperAdmin } = useIsAdmin();

  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [roleFilter, setRoleFilter] = useState<RoleOpt>("all");
  const [banFilter, setBanFilter] = useState<BanOpt>("all");
  const [page, setPage] = useState(0);
  const [range, setRange] = useState(defaultDateRange());
  const [useRange, setUseRange] = useState(false);
  const [sort, setSort] = useState<{ col: "created_at" | "trust_score" | "coins" | "last_seen_at"; asc: boolean }>({
    col: "created_at",
    asc: false,
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  // Reset page on filter changes.
  useEffect(() => {
    setPage(0);
    setSelected(new Set());
  }, [dq, roleFilter, banFilter, useRange, range.from, range.to, sort.col, sort.asc]);

  // Step 1: when a role filter is set, fetch matching user_ids first.
  const { data: roleUserIds } = useQuery({
    queryKey: ["admin-users-role-ids", roleFilter],
    enabled: roleFilter !== "all",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", roleFilter as Exclude<RoleOpt, "all">);
      if (error) throw error;
      return (data ?? []).map((r) => r.user_id as string);
    },
  });

  // Step 2: paginated profile query.
  const usersQuery = useQuery({
    queryKey: [
      "admin-users",
      { dq, roleFilter, banFilter, useRange, range, page, sort, roleIds: roleUserIds },
    ],
    enabled: roleFilter === "all" || roleUserIds !== undefined,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      // Short-circuit: role filter has zero users.
      if (roleFilter !== "all" && (roleUserIds?.length ?? 0) === 0) {
        return { rows: [] as ProfileRow[], count: 0 };
      }

      let query = supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, trust_score, coins, is_verified, is_banned, last_seen_at, created_at",
          { count: "exact" },
        );

      if (dq.trim()) {
        const needle = dq.trim().replace(/[%,]/g, "");
        query = query.or(
          `username.ilike.%${needle}%,full_name.ilike.%${needle}%,id.ilike.%${needle}%`,
        );
      }
      if (banFilter !== "all") {
        query = query.eq("is_banned", banFilter === "banned");
      }
      if (useRange) {
        const toPlus = new Date(new Date(range.to).getTime() + 24 * 3600_000)
          .toISOString()
          .slice(0, 10);
        query = query.gte("created_at", range.from).lt("created_at", toPlus);
      }
      if (roleFilter !== "all" && roleUserIds && roleUserIds.length > 0) {
        query = query.in("id", roleUserIds);
      }

      query = query.order(sort.col, { ascending: sort.asc, nullsFirst: false });
      query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      return { rows: (data ?? []) as ProfileRow[], count: count ?? 0 };
    },
  });

  const pageRows = usersQuery.data?.rows ?? [];
  const totalCount = usersQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageIds = useMemo(() => pageRows.map((r) => r.id), [pageRows]);

  // Page-scoped aux lookups.
  const { data: rolesByUser } = useQuery({
    queryKey: ["admin-users-page-roles", pageIds],
    enabled: pageIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("user_id, role").in("user_id", pageIds);
      const m = new Map<string, string[]>();
      (data ?? []).forEach((r: any) => {
        const arr = m.get(r.user_id) ?? [];
        arr.push(r.role);
        m.set(r.user_id, arr);
      });
      return m;
    },
  });

  const { data: learnerMap } = useQuery({
    queryKey: ["admin-users-page-learner", pageIds],
    enabled: pageIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("learner_profiles")
        .select("user_id, xp, streak_days")
        .in("user_id", pageIds);
      const m = new Map<string, { xp: number; streak: number }>();
      (data ?? []).forEach((r: any) =>
        m.set(r.user_id, { xp: r.xp ?? 0, streak: r.streak_days ?? 0 }),
      );
      return m;
    },
  });

  const { data: lessonCounts } = useQuery({
    queryKey: ["admin-users-page-lessons", pageIds],
    enabled: pageIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("lesson_completions")
        .select("user_id")
        .in("user_id", pageIds);
      const m = new Map<string, number>();
      (data ?? []).forEach((r: any) => m.set(r.user_id, (m.get(r.user_id) ?? 0) + 1));
      return m;
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    qc.invalidateQueries({ queryKey: ["admin-users-role-ids"] });
    qc.invalidateQueries({ queryKey: ["admin-users-page-roles"] });
  };

  const banMut = useMutation({
    mutationFn: async ({ ids, banned }: { ids: string[]; banned: boolean }) => {
      const { error } = await supabase.from("profiles").update({ is_banned: banned }).in("id", ids);
      if (error) throw error;
      await Promise.all(
        ids.map((id) =>
          audit({ action: banned ? "user.ban" : "user.unban", target_type: "user", target_id: id }),
        ),
      );
      return ids.length;
    },
    onSuccess: (count, vars) => {
      toast.success(`${vars.banned ? "Banned" : "Unbanned"} ${count} user${count === 1 ? "" : "s"}`);
      setSelected(new Set());
      invalidate();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const promoteMut = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "moderator" | "admin" }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: id, role });
      if (error && !/duplicate/i.test(error.message)) throw error;
      await audit({ action: "role.grant", target_type: "user", target_id: id, meta: { role } });
    },
    onSuccess: (_, v) => {
      toast.success(`Promoted to ${v.role}`);
      invalidate();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const demoteMut = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "moderator" | "admin" }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", id)
        .eq("role", role);
      if (error) throw error;
      await audit({ action: "role.revoke", target_type: "user", target_id: id, meta: { role } });
    },
    onSuccess: (_, v) => {
      toast.success(`Removed ${v.role} role`);
      invalidate();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const runConfirm = () => {
    if (!confirm) return;
    switch (confirm.kind) {
      case "ban":
        banMut.mutate({ ids: [confirm.user.id], banned: true });
        break;
      case "unban":
        banMut.mutate({ ids: [confirm.user.id], banned: false });
        break;
      case "promote":
        promoteMut.mutate({ id: confirm.user.id, role: confirm.role });
        break;
      case "demote":
        demoteMut.mutate({ id: confirm.user.id, role: confirm.role });
        break;
      case "bulkBan":
        banMut.mutate({ ids: confirm.ids, banned: true });
        break;
      case "bulkUnban":
        banMut.mutate({ ids: confirm.ids, banned: false });
        break;
    }
    setConfirm(null);
  };

  // CSV export — current page (fast) or all matches (streams in 1000-row chunks).
  const buildCsv = (rows: ProfileRow[]) => {
    const header = [
      "id",
      "username",
      "full_name",
      "trust_score",
      "coins",
      "xp",
      "streak",
      "lessons",
      "is_banned",
      "roles",
      "last_seen_at",
      "created_at",
    ];
    const out = [header];
    rows.forEach((p) => {
      const lm = learnerMap?.get(p.id);
      out.push([
        p.id,
        p.username ?? "",
        p.full_name ?? "",
        String(p.trust_score ?? 0),
        String(p.coins ?? 0),
        String(lm?.xp ?? 0),
        String(lm?.streak ?? 0),
        String(lessonCounts?.get(p.id) ?? 0),
        String(p.is_banned ?? false),
        (rolesByUser?.get(p.id) ?? ["user"]).join("|"),
        p.last_seen_at ?? "",
        p.created_at ?? "",
      ]);
    });
    return out.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  };

  const download = (csv: string, label: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asikonasik-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPage = () => download(buildCsv(pageRows), "users-page");

  const exportAll = async () => {
    toast.loading("Exporting all matches…", { id: "export-all" });
    try {
      const all: ProfileRow[] = [];
      const CHUNK = 1000;
      for (let p = 0; p < Math.ceil(totalCount / CHUNK); p++) {
        let query = supabase
          .from("profiles")
          .select(
            "id, username, full_name, avatar_url, trust_score, coins, is_verified, is_banned, last_seen_at, created_at",
          );
        if (dq.trim()) {
          const needle = dq.trim().replace(/[%,]/g, "");
          query = query.or(
            `username.ilike.%${needle}%,full_name.ilike.%${needle}%,id.ilike.%${needle}%`,
          );
        }
        if (banFilter !== "all") query = query.eq("is_banned", banFilter === "banned");
        if (useRange) {
          const toPlus = new Date(new Date(range.to).getTime() + 24 * 3600_000)
            .toISOString()
            .slice(0, 10);
          query = query.gte("created_at", range.from).lt("created_at", toPlus);
        }
        if (roleFilter !== "all" && roleUserIds && roleUserIds.length > 0) {
          query = query.in("id", roleUserIds);
        }
        query = query.order(sort.col, { ascending: sort.asc, nullsFirst: false });
        query = query.range(p * CHUNK, p * CHUNK + CHUNK - 1);
        const { data, error } = await query;
        if (error) throw error;
        all.push(...((data ?? []) as ProfileRow[]));
      }
      download(buildCsv(all), "users-all");
      toast.success(`Exported ${all.length} users`, { id: "export-all" });
    } catch (e: any) {
      toast.error(e.message, { id: "export-all" });
    }
  };

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((p) => selected.has(p.id));
  const toggleAllOnPage = (checked: boolean) => {
    const next = new Set(selected);
    if (checked) pageRows.forEach((p) => next.add(p.id));
    else pageRows.forEach((p) => next.delete(p.id));
    setSelected(next);
  };
  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const toggleSort = (col: typeof sort.col) => {
    setSort((s) => (s.col === col ? { col, asc: !s.asc } : { col, asc: false }));
  };

  const pageWindow = buildPageWindow(page, totalPages);
  const from = totalCount === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min(totalCount, (page + 1) * PAGE_SIZE);

  const RowActions = ({ p }: { p: ProfileRow }) => {
    const roles = rolesByUser?.get(p.id) ?? ["user"];
    const isMod = roles.includes("moderator");
    const isAdminRole = roles.includes("admin");
    const isSuper = roles.includes("super_admin");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
            @{p.username ?? "user"}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDrawerUserId(p.id)}>Open details</DropdownMenuItem>
          <DropdownMenuSeparator />
          {!isSuper && !isMod && (
            <DropdownMenuItem onClick={() => setConfirm({ kind: "promote", user: p, role: "moderator" })}>
              <ArrowUp className="h-3.5 w-3.5 mr-2" /> Promote to moderator
            </DropdownMenuItem>
          )}
          {!isSuper && isMod && (
            <DropdownMenuItem onClick={() => setConfirm({ kind: "demote", user: p, role: "moderator" })}>
              <ArrowDown className="h-3.5 w-3.5 mr-2" /> Demote moderator
            </DropdownMenuItem>
          )}
          {isSuperAdmin && !isSuper && !isAdminRole && (
            <DropdownMenuItem onClick={() => setConfirm({ kind: "promote", user: p, role: "admin" })}>
              <ArrowUp className="h-3.5 w-3.5 mr-2" /> Promote to admin
            </DropdownMenuItem>
          )}
          {isSuperAdmin && !isSuper && isAdminRole && (
            <DropdownMenuItem onClick={() => setConfirm({ kind: "demote", user: p, role: "admin" })}>
              <ArrowDown className="h-3.5 w-3.5 mr-2" /> Demote admin
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {p.is_banned ? (
            <DropdownMenuItem onClick={() => setConfirm({ kind: "unban", user: p })}>
              <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Unban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setConfirm({ kind: "ban", user: p })}
            >
              <ShieldOff className="h-3.5 w-3.5 mr-2" /> Ban user
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Members"
        title="Users"
        subtitle="Search, filter and moderate every member."
      />

      <Reveal className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-background/60"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ROLE_OPTIONS.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? "default" : "outline"}
              onClick={() => setRoleFilter(r)}
              className="h-8"
            >
              {r}
            </Button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {BAN_OPTIONS.map((b) => (
            <Button
              key={b}
              size="sm"
              variant={banFilter === b ? "default" : "outline"}
              onClick={() => setBanFilter(b)}
              className="h-8 capitalize"
            >
              {b}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <Button size="sm" variant="outline" className="h-8" onClick={exportPage}>
            <Download className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Export page</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={exportAll} disabled={totalCount === 0}>
            <Download className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Export all</span>
          </Button>
        </div>
      </Reveal>

      {/* Date range */}
      <Reveal className="flex flex-wrap items-center gap-2 text-xs">
        <label className="flex items-center gap-1.5">
          <Checkbox checked={useRange} onCheckedChange={(c) => setUseRange(!!c)} />
          <span className="text-muted-foreground">Filter by signup date</span>
        </label>
        {useRange && (
          <>
            <Input
              type="date"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
              className="h-8 w-auto"
            />
            <span className="text-muted-foreground">→</span>
            <Input
              type="date"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
              className="h-8 w-auto"
            />
          </>
        )}
        <span className="ml-auto text-muted-foreground">
          {totalCount.toLocaleString()} match{totalCount === 1 ? "" : "es"}
        </span>
      </Reveal>

      {/* Mobile: card list */}
      <Reveal className="md:hidden space-y-2">
        {usersQuery.isLoading ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Loading…</p>
        ) : pageRows.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No matching users.</p>
        ) : (
          pageRows.map((p) => {
            const lm = learnerMap?.get(p.id);
            return (
              <div key={p.id} className="glass rounded-2xl p-3">
                <button
                  onClick={() => setDrawerUserId(p.id)}
                  className="w-full text-left pressable"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={p.avatar_url ?? undefined} loading="lazy" />
                      <AvatarFallback>{(p.username ?? "?")[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate text-sm">
                        {p.full_name || p.username || "—"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        @{p.username ?? "—"}
                      </div>
                    </div>
                    <StatusPill p={p} />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10.5px] text-muted-foreground">
                    <span>XP {lm?.xp ?? 0}</span>
                    <span>·</span>
                    <span>{p.coins ?? 0}c</span>
                    <span>·</span>
                    <span>{lessonCounts?.get(p.id) ?? 0} lessons</span>
                    <span className="ml-auto">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
                <div className="mt-2 flex justify-end">
                  <RowActions p={p} />
                </div>
              </div>
            );
          })
        )}
      </Reveal>

      {/* Desktop: table */}
      <Reveal className="hidden md:block">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 w-8">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={(c) => toggleAllOnPage(!!c)}
                    />
                  </th>
                  <th className="text-left font-semibold px-4 py-3">User</th>
                  <th className="text-left font-semibold px-4 py-3">Role</th>
                  <th className="text-left font-semibold px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("trust_score")}>
                    Trust {sort.col === "trust_score" ? (sort.asc ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-left font-semibold px-4 py-3">XP</th>
                  <th className="text-left font-semibold px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("coins")}>
                    Coins {sort.col === "coins" ? (sort.asc ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-left font-semibold px-4 py-3">Lessons</th>
                  <th className="text-left font-semibold px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("last_seen_at")}>
                    Status {sort.col === "last_seen_at" ? (sort.asc ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-left font-semibold px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("created_at")}>
                    Joined {sort.col === "created_at" ? (sort.asc ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.isLoading ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted-foreground py-8">
                      Loading…
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted-foreground py-8">
                      No matching users.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((p) => {
                    const userRoles = rolesByUser?.get(p.id) ?? ["user"];
                    const topRole = userRoles.includes("super_admin")
                      ? "super_admin"
                      : userRoles.includes("admin")
                        ? "admin"
                        : userRoles.includes("moderator")
                          ? "moderator"
                          : "user";
                    const lm = learnerMap?.get(p.id);
                    const isSel = selected.has(p.id);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setDrawerUserId(p.id)}
                        className="border-t border-border/40 hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSel}
                            onCheckedChange={(c) => toggleOne(p.id, !!c)}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={p.avatar_url ?? undefined} loading="lazy" />
                              <AvatarFallback>
                                {(p.username ?? "?")[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {p.full_name || p.username || "—"}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                @{p.username ?? "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant={
                              topRole === "super_admin"
                                ? "destructive"
                                : topRole === "admin"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {topRole}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">{p.trust_score ?? 0}</td>
                        <td className="px-4 py-2.5 tabular-nums">{lm?.xp ?? 0}</td>
                        <td className="px-4 py-2.5 tabular-nums">{p.coins ?? 0}</td>
                        <td className="px-4 py-2.5 tabular-nums">
                          {lessonCounts?.get(p.id) ?? 0}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusPill p={p} />
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td
                          className="px-4 py-2.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RowActions p={p} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          Showing {from.toLocaleString()}–{to.toLocaleString()} of {totalCount.toLocaleString()}
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(0)} className="h-8 px-2">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          {pageWindow.map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className="px-2 text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "default" : "outline"}
                onClick={() => setPage(p)}
                className="h-8 min-w-[2rem] px-2"
              >
                {p + 1}
              </Button>
            ),
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-8 px-2"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(totalPages - 1)}
            className="h-8 px-2"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-strong rounded-2xl border border-border/60 shadow-2xl px-4 py-2.5 items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-medium">
            {selected.size} user{selected.size === 1 ? "" : "s"} selected
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirm({ kind: "bulkBan", ids: Array.from(selected) })}
            disabled={banMut.isPending}
          >
            <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
            Ban
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirm({ kind: "bulkUnban", ids: Array.from(selected) })}
            disabled={banMut.isPending}
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Unban
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Clear
          </Button>
        </div>
      )}

      <UserDetailDrawer userId={drawerUserId} onClose={() => setDrawerUserId(null)} />

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "ban" && `Ban @${confirm.user.username ?? "user"}?`}
              {confirm?.kind === "unban" && `Unban @${confirm.user.username ?? "user"}?`}
              {confirm?.kind === "promote" && `Promote @${confirm.user.username ?? "user"} to ${confirm.role}?`}
              {confirm?.kind === "demote" && `Remove ${confirm.role} from @${confirm.user.username ?? "user"}?`}
              {confirm?.kind === "bulkBan" && `Ban ${confirm.ids.length} users?`}
              {confirm?.kind === "bulkUnban" && `Unban ${confirm.ids.length} users?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "ban" && "They will lose login access immediately. This is reversible."}
              {confirm?.kind === "unban" && "They will be able to log in again."}
              {confirm?.kind === "promote" && "Grants moderation privileges. Logged to audit trail."}
              {confirm?.kind === "demote" && "Removes the role. Logged to audit trail."}
              {(confirm?.kind === "bulkBan" || confirm?.kind === "bulkUnban") &&
                "Applied to all selected users. Each change is logged."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
