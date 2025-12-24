import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockProducts } from "@/lib/mock-data";
import { CartItem } from "@/types";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: mockProducts[0], quantity: 1, size: "M" },
    { product: mockProducts[1], quantity: 1, size: "42" },
  ]);

  const updateQuantity = (index: number, delta: number) => {
    setCartItems((items) =>
      items.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (index: number) => {
    setCartItems((items) => items.filter((_, i) => i !== index));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        {/* Page Title */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground">{cartItems.length} items</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 px-4 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link to="/shop">
                <Button className="gradient-primary border-0">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        {item.product.brand}
                      </p>
                      <h3 className="font-medium text-sm line-clamp-1">
                        {item.product.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">${item.product.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
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

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-card border-t border-border p-4 space-y-4">
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
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full gradient-primary border-0" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Cart;
