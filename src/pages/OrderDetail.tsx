import { useParams, Link, useNavigate } from "react-router-dom";
import { Package, ChevronLeft, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/useOrders";
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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: order, isLoading } = useOrder(id || "");

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <h1 className="text-xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
          <Link to="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;
  const shippingAddress = order.shipping_address as Record<string, string> | null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(order.created_at || ""), "MMMM dd, yyyy")}
            </p>
          </div>
          <Badge className={status.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Items
              </h2>

              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden">
                      <img
                        src={item.products?.image_url || "/placeholder.svg"}
                        alt={item.products?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.products?.name || "Product"}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.total - 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$10.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            {/* Shipping Address */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Shipping Address
              </h2>
              {shippingAddress ? (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.phone}</p>
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No address provided</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment
              </h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : order.payment_method === "card"
                    ? "Credit/Debit Card"
                    : order.payment_method || "N/A"}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Status:{" "}
                <span className="font-medium text-foreground capitalize">
                  {order.payment_status || "Pending"}
                </span>
              </p>
            </div>

            {order.tracking_number && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-semibold mb-2">Tracking Number</h2>
                <p className="text-sm font-mono bg-secondary px-3 py-2 rounded-lg">
                  {order.tracking_number}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderDetail;
