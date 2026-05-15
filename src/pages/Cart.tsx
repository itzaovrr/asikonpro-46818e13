import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Price } from "@/lib/currency";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: cartItems, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleUpdateQuantity = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateCartItem.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        });
      },
    });
  };

  const subtotal = cartItems?.reduce((sum, item) => {
    const price = item.products?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0) || 0;

  const shipping = cartItems && cartItems.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (authLoading || isLoading) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="flex flex-col min-h-[calc(100vh-56px)]">
          <div className="px-4 pt-4 pb-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
          <div className="flex-1 px-4 py-4 space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
          <h1 className="text-xl font-bold mb-2">Please login to view your cart</h1>
          <p className="text-muted-foreground mb-4">Sign in to add items to your cart</p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
      <div className="container-editorial py-6 lg:py-10">
        <div className="mb-6 lg:mb-10">
          <p className="eyebrow-bar mb-2">Your bag</p>
          <h1 className="display-2">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">{cartItems?.length || 0} items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-12">
          {/* Cart Items */}
          <div className="space-y-3 lg:space-y-4">
            {!cartItems || cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-2xl">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Link to="/shop">
                  <Button className="gradient-primary border-0">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 lg:p-5 rounded-2xl glass hover-lift"
                >
                  <Link to={`/product/${item.products?.slug}`} className="shrink-0">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product"}
                      className="w-20 h-20 lg:w-28 lg:h-28 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80">ASIKON</p>
                        <Link to={`/product/${item.products?.slug}`}>
                          <h3 className="font-medium text-sm lg:text-base line-clamp-2 hover:text-primary transition-colors">
                            {item.products?.name}
                          </h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        disabled={removeFromCart.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Price amount={item.products?.price || 0} className="font-bold text-base lg:text-lg" />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, -1)}
                          className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                          disabled={updateCartItem.isPending}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, 1)}
                          className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                          disabled={updateCartItem.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary — sticky on desktop, fixed bottom on mobile */}
          {cartItems && cartItems.length > 0 && (
            <div className="lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start">
              {/* Desktop card */}
              <div className="hidden lg:block glass rounded-2xl p-6 space-y-5">
                <div>
                  <p className="eyebrow-bar mb-1">Summary</p>
                  <h2 className="font-display text-xl font-semibold">Order total</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full gradient-primary border-0"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Mobile fixed bar */}
              <div
                className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border/40 lg:hidden"
                style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
              >
                <div className="container-editorial py-3 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full gradient-primary border-0"
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Cart;
