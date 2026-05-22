import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo, useDeferredValue } from "react";
import { toast } from "sonner";
import { Truck, Eye, Search, Download } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuditLog } from "@/hooks/useAuditLog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

export default function AdminOrders() {
  const qc = useQueryClient();
  const audit = useAuditLog();
  const [tab, setTab] = useState<Status>("all");
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [openOrder, setOpenOrder] = useState<any | null>(null);

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, status, payment_method, payment_status, shipping_address, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: items } = useQuery({
    queryKey: ["admin-order-items", openOrder?.id],
    enabled: !!openOrder,
    queryFn: async () => {
      const { data } = await supabase
        .from("order_items")
        .select("id, quantity, price, product_id, products(name, image_url, slug)")
        .eq("order_id", openOrder!.id);
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
      void audit({
        action: status === "cancelled" ? "order.cancel" : `order.${status}`,
        target_type: "order",
        target_id: id,
      });
    },
    onSuccess: () => {
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    let list = orders ?? [];
    if (tab !== "all") list = list.filter((o: any) => o.status === tab);
    if (dq.trim()) {
      const n = dq.toLowerCase();
      list = list.filter((o: any) => {
        const addr = o.shipping_address ? JSON.stringify(o.shipping_address).toLowerCase() : "";
        return (
          o.id.toLowerCase().includes(n) ||
          o.user_id.toLowerCase().includes(n) ||
          addr.includes(n)
        );
      });
    }
    return list;
  }, [orders, tab, dq]);

  const exportCsv = () => {
    const rows = filtered;
    if (!rows.length) {
      toast.error("Nothing to export");
      return;
    }
    const headers = ["id", "total", "status", "payment_method", "payment_status", "user_id", "created_at"];
    const body = rows.map((o: any) =>
      headers.map((h) => JSON.stringify(o[h] ?? "")).join(","),
    );
    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const revenue = useMemo(
    () => (orders ?? []).filter((o: any) => o.payment_status === "paid").reduce((s: number, o: any) => s + Number(o.total || 0), 0),
    [orders],
  );

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Fulfillment"
        title="Orders"
        subtitle={`Total revenue (paid): ৳${Math.round(revenue).toLocaleString()}`}
      />

      <Reveal className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => {
          const count = s === "all" ? (orders ?? []).length : (orders ?? []).filter((o: any) => o.status === s).length;
          return (
            <Button
              key={s}
              size="sm"
              variant={tab === s ? "default" : "outline"}
              onClick={() => setTab(s)}
              className="h-8"
            >
              {s} <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
            </Button>
          );
        })}
      </Reveal>

      {/* Mobile: cards */}
      <Reveal className="md:hidden space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">No orders.</p>
        )}
        {filtered.map((o: any) => (
          <button
            key={o.id}
            onClick={() => setOpenOrder(o)}
            className="w-full text-left glass rounded-2xl p-3 pressable"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">#{o.id.slice(0, 8)}</span>
              <Badge variant={o.status === "delivered" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"} className="text-[10px]">
                {o.status}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-display font-semibold">৳{Number(o.total).toFixed(0)}</span>
              <Badge variant={o.payment_status === "paid" ? "default" : "secondary"} className="text-[10px]">
                {o.payment_method ?? "—"} · {o.payment_status}
              </Badge>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{new Date(o.created_at).toLocaleDateString()}</span>
              {o.status !== "shipped" && o.status !== "delivered" && (
                <button
                  onClick={(e) => { e.stopPropagation(); update.mutate({ id: o.id, status: "shipped" }); }}
                  className="inline-flex items-center gap-1 text-primary font-medium"
                >
                  <Truck className="h-3 w-3" /> Ship
                </button>
              )}
            </div>
          </button>
        ))}
      </Reveal>

      {/* Desktop: table */}
      <Reveal className="hidden md:block">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Order</th>
                  <th className="text-left font-semibold px-4 py-3">Total</th>
                  <th className="text-left font-semibold px-4 py-3">Payment</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-left font-semibold px-4 py-3">Placed</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No orders.</td></tr>
                )}
                {filtered.map((o: any) => (
                  <tr key={o.id} className="border-t border-border/40 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-2.5 font-semibold">৳{Number(o.total).toFixed(0)}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <div>{o.payment_method ?? "—"}</div>
                      <Badge variant={o.payment_status === "paid" ? "default" : "secondary"} className="text-[10px] mt-0.5">{o.payment_status}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={o.status === "delivered" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"}>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        {o.status !== "shipped" && o.status !== "delivered" && (
                          <Button size="sm" variant="outline" onClick={() => update.mutate({ id: o.id, status: "shipped" })}>
                            <Truck className="h-3.5 w-3.5 mr-1.5" /> Ship
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => setOpenOrder(o)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Sheet open={!!openOrder} onOpenChange={(o) => !o && setOpenOrder(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order #{openOrder?.id?.slice(0, 8)}</SheetTitle>
          </SheetHeader>
          {openOrder && (
            <div className="mt-4 space-y-4 text-sm">
              <div className="glass rounded-xl p-3 space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge>{openOrder.status}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>{openOrder.payment_method} · {openOrder.payment_status}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold">৳{Number(openOrder.total).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Placed</span><span>{new Date(openOrder.created_at).toLocaleString()}</span></div>
              </div>

              {openOrder.shipping_address && (
                <div className="glass rounded-xl p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Shipping</div>
                  <pre className="text-xs whitespace-pre-wrap font-sans">
                    {JSON.stringify(openOrder.shipping_address, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Items</div>
                <div className="space-y-2">
                  {(items ?? []).map((it: any) => (
                    <div key={it.id} className="flex items-center gap-2 p-2 glass rounded-lg">
                      {it.products?.image_url && <img src={it.products.image_url} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 rounded object-cover" />}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{it.products?.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">×{it.quantity}</div>
                      </div>
                      <div className="font-semibold">৳{(Number(it.price) * it.quantity).toFixed(0)}</div>
                    </div>
                  ))}
                  {(items ?? []).length === 0 && <p className="text-xs text-muted-foreground">No items.</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" onClick={() => update.mutate({ id: openOrder.id, status: "processing" })}>Processing</Button>
                <Button variant="outline" onClick={() => update.mutate({ id: openOrder.id, status: "shipped" })}>Shipped</Button>
                <Button variant="outline" onClick={() => update.mutate({ id: openOrder.id, status: "delivered" })}>Delivered</Button>
                <Button variant="destructive" onClick={() => update.mutate({ id: openOrder.id, status: "cancelled" })}>Cancel</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
