import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo, useDeferredValue } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Search, Download, ShieldOff, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";

const ROLE_OPTIONS = ["all", "user", "moderator", "admin", "super_admin"] as const;
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

export default function AdminUsers() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_OPTIONS)[number]>("all");
  const [page, setPage] = useState(0);
  const [range, setRange] = useState(defaultDateRange());
  const [useRange, setUseRange] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, trust_score, coins, is_verified, is_banned, last_seen_at, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as ProfileRow[];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: learnerMap } = useQuery({
    queryKey: ["admin-users-learner-map"],
    queryFn: async () => {
      const { data } = await supabase.from("learner_profiles").select("user_id, xp, streak_days");
      const m = new Map<string, { xp: number; streak: number }>();
      (data ?? []).forEach((r: any) =>
        m.set(r.user_id, { xp: r.xp ?? 0, streak: r.streak_days ?? 0 }),
      );
      return m;
    },
  });

  const { data: lessonCounts } = useQuery({
    queryKey: ["admin-users-lesson-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("lesson_completions").select("user_id");
      const m = new Map<string, number>();
      (data ?? []).forEach((r: any) => m.set(r.user_id, (m.get(r.user_id) ?? 0) + 1));
      return m;
    },
  });

  const rolesByUser = useMemo(() => {
    const m = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = m.get(r.user_id) ?? [];
      arr.push(r.role);
      m.set(r.user_id, arr);
    });
    return m;
  }, [roles]);

  const filtered = useMemo(() => {
    let list = (profiles ?? []) as ProfileRow[];
    if (roleFilter !== "all") {
      list = list.filter((p) => (rolesByUser.get(p.id) ?? ["user"]).includes(roleFilter));
    }
    if (dq.trim()) {
      const needle = dq.toLowerCase();
      list = list.filter(
        (p) =>
          p.username?.toLowerCase().includes(needle) ||
          p.full_name?.toLowerCase().includes(needle) ||
          p.id?.toLowerCase().includes(needle),
      );
    }
    if (useRange) {
      const fromT = new Date(range.from).getTime();
      const toT = new Date(range.to).getTime() + 24 * 3600_000;
      list = list.filter((p) => {
        const t = new Date(p.created_at).getTime();
        return t >= fromT && t < toT;
      });
    }
    return list;
  }, [profiles, dq, roleFilter, rolesByUser, useRange, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page],
  );

  // Reset page if filters shrink the list below current page
  if (page > 0 && page >= totalPages) setPage(0);

  const banBulk = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("profiles").update({ is_banned: true }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      toast.success(`Banned ${ids.length} users`);
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const exportCsv = (rows: ProfileRow[], label = "users") => {
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
        (rolesByUser.get(p.id) ?? ["user"]).join("|"),
        p.last_seen_at ?? "",
        p.created_at ?? "",
      ]);
    });
    const csv = out
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asikonasik-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <Button
          size="sm"
          variant="outline"
          className="ml-auto h-8"
          onClick={() => exportCsv(filtered, "users")}
        >
          <Download className="h-3.5 w-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
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
          {filtered.length.toLocaleString()} match{filtered.length === 1 ? "" : "es"}
        </span>
      </Reveal>

      {/* Mobile: card list */}
      <Reveal className="md:hidden space-y-2">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Loading…</p>
        ) : pageRows.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No matching users.</p>
        ) : (
          pageRows.map((p) => {
            const lm = learnerMap?.get(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setDrawerUserId(p.id)}
                className="w-full text-left glass rounded-2xl p-3 pressable"
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
                  <th className="text-left font-semibold px-4 py-3">XP</th>
                  <th className="text-left font-semibold px-4 py-3">Coins</th>
                  <th className="text-left font-semibold px-4 py-3">Lessons</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-left font-semibold px-4 py-3">Joined</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted-foreground py-8">
                      Loading…
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted-foreground py-8">
                      No matching users.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((p) => {
                    const userRoles = rolesByUser.get(p.id) ?? ["user"];
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
                        <td
                          className="px-3 py-2.5"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => setDrawerUserId(p.id)}
                          >
                            Manage
                          </Button>
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
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Bulk action bar (desktop, slides up from bottom) */}
      {selected.size > 0 && (
        <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-strong rounded-2xl border border-border/60 shadow-2xl px-4 py-2.5 items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-medium">
            {selected.size} user{selected.size === 1 ? "" : "s"} selected
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => banBulk.mutate(Array.from(selected))}
            disabled={banBulk.isPending}
          >
            <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
            Ban All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              exportCsv(
                (profiles ?? []).filter((p) => selected.has(p.id)),
                "users-selection",
              )
            }
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export Selected
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Clear
          </Button>
        </div>
      )}

      <UserDetailDrawer userId={drawerUserId} onClose={() => setDrawerUserId(null)} />
    </div>
  );
}
