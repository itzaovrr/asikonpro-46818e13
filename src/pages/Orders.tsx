import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-500/10 text-blue-600" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500/10 text-purple-600" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-3 pb-24 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">Start shopping to see your orders here.</p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at || ""), "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.order_items?.length || 0} item(s)
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Orders;
