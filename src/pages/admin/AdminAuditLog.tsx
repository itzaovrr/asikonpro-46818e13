import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { resolveActorNames } from "@/hooks/useAuditLog";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Search, ShieldAlert } from "lucide-react";
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

interface AuditRow {
  id: string;
  actor_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  meta: Record<string, any>;
  created_at: string;
}

const destructive = new Set([
  "user.ban",
  "user.soft_delete",
  "post.delete",
  "comment.delete",
  "product.delete",
  "order.cancel",
  "reward.delete",
]);

export default function AdminAuditLog() {
  const [q, setQ] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const logQ = useQuery({
    queryKey: ["admin-audit-log"],
    queryFn: async (): Promise<AuditRow[]> => {
      const { data, error } = await db
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const actorIds = useMemo(
    () => Array.from(new Set((logQ.data ?? []).map((r) => r.actor_id))),
    [logQ.data],
  );

  const namesQ = useQuery({
    queryKey: ["audit-actor-names", actorIds.sort().join(",")],
    enabled: actorIds.length > 0,
    queryFn: () => resolveActorNames(actorIds),
  });

  const actions = useMemo(() => {
    const set = new Set<string>();
    (logQ.data ?? []).forEach((r) => set.add(r.action));
    return Array.from(set).sort();
  }, [logQ.data]);

  const filtered = useMemo(() => {
    const list = logQ.data ?? [];
    return list.filter((r) => {
      if (actionFilter !== "all" && r.action !== actionFilter) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        const haystack = [
          r.action,
          r.target_type ?? "",
          r.target_id ?? "",
          namesQ.data?.[r.actor_id] ?? "",
          JSON.stringify(r.meta),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [logQ.data, actionFilter, q, namesQ.data]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Audit"
        title="Admin audit log"
        subtitle="Every destructive or sensitive admin action — who, what, when."
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] sm:max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by actor, action, target…"
            className="pl-9 bg-background/60"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-44 bg-background/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {actions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {logQ.isLoading ? (
          <div className="p-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No audit entries match.
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((r) => {
              const isDestructive = destructive.has(r.action);
              const actor = namesQ.data?.[r.actor_id] ?? `${r.actor_id.slice(0, 8)}…`;
              return (
                <li
                  key={r.id}
                  className="p-3 sm:p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div
                    className={`rounded-lg p-2 shrink-0 ${
                      isDestructive
                        ? "bg-destructive/15 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isDestructive ? (
                      <ShieldAlert className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold font-mono">{r.action}</span>
                      {r.target_type && (
                        <Badge variant="outline" className="text-[10px]">
                          {r.target_type}
                          {r.target_id ? ` · ${r.target_id.slice(0, 8)}` : ""}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      by <span className="text-foreground">@{actor}</span> ·{" "}
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </p>
                    {r.meta && Object.keys(r.meta).length > 0 && (
                      <pre className="mt-1.5 text-[11px] text-muted-foreground bg-muted/40 rounded p-2 font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(r.meta, null, 0)}
                      </pre>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
