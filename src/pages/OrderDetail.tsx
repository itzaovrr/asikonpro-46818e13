import { useParams, Link, useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileSection } from "@/components/ui/mobile-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Price } from "@/lib/currency";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-500/10 text-blue-600" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500/10 text-purple-600" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600" },
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: order, isLoading } = useOrder(id || "");

  if (authLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="4xl">
          <p className="text-center text-muted-foreground py-10">Loading...</p>
        </MobilePage>
      </AppLayout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="4xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 rounded-2xl" />
        </MobilePage>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <MobilePage maxWidth="4xl">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="text-lg font-semibold mb-2">Order Not Found</h1>
            <p className="text-sm text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
            <Link to="/orders"><Button>View All Orders</Button></Link>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;
  const shippingAddress = order.shipping_address as Record<string, string> | null;

  return (
    <AppLayout>
      <MobilePage maxWidth="4xl">
        {/* Status strip */}
        <MobileCard variant="glass" className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold">Order #{order.id.slice(0, 8)}</p>
            <p className="text-[11px] text-muted-foreground">
              Placed {format(new Date(order.created_at || ""), "MMM dd, yyyy")}
            </p>
          </div>
          <Badge className={status.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </MobileCard>

        {/* Items */}
        <MobileSection title="Items">
          <MobileCard variant="glass">
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden shrink-0">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.products?.name || "Product"}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <Price amount={item.price} className="font-semibold text-sm" />
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(order.total - 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$10.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-[15px]">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </MobileCard>
        </MobileSection>

        {/* Shipping */}
        <MobileSection title="Shipping Address">
          <MobileCard variant="glass">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              {shippingAddress ? (
                <div className="text-[13px] text-muted-foreground space-y-0.5 min-w-0">
                  <p className="font-medium text-foreground">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.phone}</p>
                  <p>{shippingAddress.street}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No address provided</p>
              )}
            </div>
          </MobileCard>
        </MobileSection>

        {/* Payment */}
        <MobileSection title="Payment">
          <MobileCard variant="glass">
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="text-[13px] min-w-0">
                <p className="font-medium">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : order.payment_method === "card"
                    ? "Credit/Debit Card"
                    : order.payment_method || "N/A"}
                </p>
                <p className="text-muted-foreground capitalize mt-0.5">
                  Status: {order.payment_status || "Pending"}
                </p>
              </div>
            </div>
          </MobileCard>
        </MobileSection>

        {order.tracking_number && (
          <MobileSection title="Tracking">
            <MobileCard variant="glass">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Tracking number</p>
              <p className="font-mono text-sm bg-secondary/60 px-3 py-2 rounded-lg">{order.tracking_number}</p>
            </MobileCard>
          </MobileSection>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default OrderDetail;
