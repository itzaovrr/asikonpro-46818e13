import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Package,
  ShoppingBag,
  MessagesSquare,
  Palette,
  Tags,
  TrendingUp,
  AlertTriangle,
  Coins,
  Activity,
  Clock,
  UserPlus,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Sparkline } from "@/components/admin/Sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

/** Bucket an array of created_at timestamps into a 30-day count series. */
function bucketDays(rows: { created_at: string }[] | undefined | null, days = 30): number[] {
  const buckets = Array.from({ length: days }, () => 0);
  if (!rows?.length) return buckets;
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  for (const r of rows) {
    const d = new Date(r.created_at);
    const diff = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff < days) buckets[diff] += 1;
  }
  return buckets;
}

interface StatBlockProps {
  label: string;
  value: string | number;
  icon: any;
  trend?: number[];
  loading?: boolean;
  hint?: string;
  tone?: "default" | "warn" | "good";
}

const StatBlock = ({ label, value, icon: Icon, trend, loading, hint, tone = "default" }: StatBlockProps) => (
  <div className="glass rounded-2xl p-4 hover-lift">
    <div className="flex items-start justify-between mb-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-16 mt-1" />
        ) : (
          <p className="text-2xl font-display font-bold tracking-tight mt-1 truncate">{value}</p>
        )}
        {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <span
        className={`grid place-items-center h-9 w-9 rounded-xl ${
          tone === "warn"
            ? "bg-amber-500/15 text-amber-500"
            : tone === "good"
              ? "bg-emerald-500/15 text-emerald-500"
              : "gradient-primary-soft text-primary"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
    </div>
    {trend && trend.length > 0 && (
      <Sparkline data={trend} className="text-primary w-full" width={140} height={28} />
    )}
  </div>
);

export default function AdminOverview() {
  const { data: counts, isLoading } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const tables = ["profiles", "products", "categories", "orders", "posts", "mentors"] as const;
      const results = await Promise.all(
        tables.map((t) =>
          supabase.from(t as any).select("*", { count: "exact", head: true }).then((r) => r.count ?? 0),
        ),
      );
      return Object.fromEntries(tables.map((t, i) => [t, results[i]])) as Record<string, number>;
    },
  });

  // Real 30-day timeseries — one query per table, fetching only created_at.
  const { data: series } = useQuery({
    queryKey: ["admin-30d-series"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const sinceIso = since.toISOString();
      const tables = ["profiles", "products", "orders", "posts"] as const;
      const results = await Promise.all(
        tables.map((t) =>
          supabase
            .from(t as any)
            .select("created_at")
            .gte("created_at", sinceIso)
            .order("created_at", { ascending: true })
            .then((r) => bucketDays((r.data as any) ?? [])),
        ),
      );
      return Object.fromEntries(tables.map((t, i) => [t, results[i]])) as Record<string, number[]>;
    },
    staleTime: 5 * 60_000,
  });

  const { data: revenue } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("total, payment_status");
      const paid = (data ?? []).filter((o: any) => o.payment_status === "paid");
      return paid.reduce((s: number, o: any) => s + Number(o.total || 0), 0);
    },
  });

  const { data: pendingOrders } = useQuery({
    queryKey: ["admin-pending-orders-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      return count ?? 0;
    },
  });

  const { data: newUsersWeek } = useQuery({
    queryKey: ["admin-new-users-week"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since.toISOString());
      return count ?? 0;
    },
  });

  const { data: activeLearners } = useQuery({
    queryKey: ["admin-active-learners-7d"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const { data } = await supabase
        .from("lesson_completions")
        .select("user_id")
        .gte("completed_at", since.toISOString());
      const ids = new Set((data ?? []).map((r: any) => r.user_id));
      return ids.size;
    },
  });

  const { data: lowStock } = useQuery({
    queryKey: ["admin-low-stock"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, stock")
        .lte("stock", 5)
        .order("stock", { ascending: true })
        .limit(6);
      return data ?? [];
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const { data: recentSignups } = useQuery({
    queryKey: ["admin-recent-signups"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const baseStats = [
    { key: "profiles", label: "Users", icon: Users },
    { key: "products", label: "Products", icon: Package },
    { key: "categories", label: "Categories", icon: Tags },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "posts", label: "Posts", icon: MessagesSquare },
    { key: "mentors", label: "Mentors", icon: Palette },
  ] as const;

  return (
    <div className="space-y-7">
      <SectionHeader
        eyebrow="Overview"
        title="Platform health, at a glance"
        subtitle="Real-time snapshot of every key area of the platform."
      />

      {/* Headline KPIs (real 30-day sparklines where available) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {baseStats.map((s, i) => (
          <Reveal key={s.key} delay={i * 50}>
            <StatBlock
              label={s.label}
              value={(counts?.[s.key] ?? 0).toLocaleString()}
              icon={s.icon}
              trend={series?.[s.key]}
              loading={isLoading}
            />
          </Reveal>
        ))}
      </div>

      {/* Additional KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Reveal>
          <StatBlock
            label="Total Revenue"
            value={`৳${Math.round(revenue ?? 0).toLocaleString()}`}
            icon={TrendingUp}
            tone="good"
            hint="All paid orders"
          />
        </Reveal>
        <Reveal delay={50}>
          <StatBlock
            label="Active Learners"
            value={(activeLearners ?? 0).toLocaleString()}
            icon={Activity}
            hint="Distinct, last 7 days"
          />
        </Reveal>
        <Reveal delay={100}>
          <StatBlock
            label="Pending Orders"
            value={(pendingOrders ?? 0).toLocaleString()}
            icon={Clock}
            tone="warn"
            hint="Need fulfilment"
          />
        </Reveal>
        <Reveal delay={150}>
          <StatBlock
            label="New Users (7d)"
            value={(newUsersWeek ?? 0).toLocaleString()}
            icon={UserPlus}
            tone="good"
          />
        </Reveal>
      </div>

      {/* Revenue + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Reveal className="lg:col-span-2">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                  Total revenue (paid)
                </p>
                <p className="text-3xl font-display font-bold mt-1 text-gradient">
                  ৳{Math.round(revenue ?? 0).toLocaleString()}
                </p>
              </div>
              <span className="grid place-items-center h-11 w-11 rounded-xl gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                <TrendingUp className="h-5 w-5" />
              </span>
            </div>
            {series?.orders && (
              <Sparkline data={series.orders} className="text-primary w-full" width={600} height={56} />
            )}
          </div>
        </Reveal>

        <Reveal>
          <div className="glass rounded-2xl p-5 h-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-amber-500/15 text-amber-500">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <h3 className="font-semibold">Low stock</h3>
            </div>
            <ul className="space-y-2">
              {(lowStock ?? []).length === 0 && (
                <li className="text-sm text-muted-foreground">All products well stocked.</li>
              )}
              {(lowStock ?? []).map((p: any) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <Link to={`/product/${p.slug}`} className="truncate hover:text-primary transition-colors">
                    {p.name}
                  </Link>
                  <Badge variant={p.stock === 0 ? "destructive" : "secondary"} className="text-[10px]">
                    {p.stock} left
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Activity feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Reveal>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" /> Latest orders
              </h3>
              <Link to="/asikonasik/orders" className="text-xs text-primary hover:underline">
                See all
              </Link>
            </div>
            <ul className="space-y-2">
              {(recentOrders ?? []).length === 0 && <li className="text-sm text-muted-foreground">No orders yet.</li>}
              {(recentOrders ?? []).map((o: any) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0"
                >
                  <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                  <span className="font-medium">৳{Number(o.total).toFixed(0)}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {o.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> New members
              </h3>
              <Link to="/asikonasik/users" className="text-xs text-primary hover:underline">
                See all
              </Link>
            </div>
            <ul className="space-y-2">
              {(recentSignups ?? []).length === 0 && (
                <li className="text-sm text-muted-foreground">No signups yet.</li>
              )}
              {(recentSignups ?? []).map((u: any) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/15 grid place-items-center text-xs font-semibold text-primary">
                    {(u.username ?? u.full_name ?? "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{u.full_name || u.username || "—"}</div>
                    <div className="text-[10px] text-muted-foreground truncate">@{u.username ?? "—"}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
