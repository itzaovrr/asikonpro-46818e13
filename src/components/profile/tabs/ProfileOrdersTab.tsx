import { ShoppingBag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Price } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { EmptyState } from "./ProfileFeedTab";

interface OrderRow {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  order_items?: Array<{
    id: string;
    quantity: number;
    products?: { name?: string | null; image_url?: string | null } | null;
  }>;
}

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  shipped: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export function ProfileOrdersTab({ orders }: { orders: OrderRow[] }) {
  const navigate = useNavigate();
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-8 w-8" />}
        title="No orders yet"
        hint="Your purchases will appear here for quick re-order."
      />
    );
  }
  return (
    <div className="space-y-2 pt-3">
      {orders.map((o) => {
        const firstImg = o.order_items?.[0]?.products?.image_url;
        const itemCount = o.order_items?.reduce((a, i) => a + (i.quantity || 0), 0) ?? 0;
        return (
          <button
            key={o.id}
            onClick={() => navigate(`/orders/${o.id}`)}
            className="w-full text-left rounded-2xl border border-border/60 bg-card/60 p-3 hover:bg-card transition-colors flex items-center gap-3"
          >
            <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
              {firstImg ? (
                <img src={firstImg} alt="" className="h-full w-full object-cover" />
              ) : (
                <ShoppingBag className="h-5 w-5 m-auto text-muted-foreground mt-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm truncate">Order #{o.id.slice(0, 8)}</p>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border",
                    STATUS_TONE[o.status] ?? "bg-secondary text-foreground border-border",
                  )}
                >
                  {o.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {itemCount} item{itemCount === 1 ? "" : "s"} · <Price amount={o.total} className="inline" />
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}
