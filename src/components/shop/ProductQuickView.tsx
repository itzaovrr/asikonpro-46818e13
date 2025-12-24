import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Minus, Plus, Package, Truck, Shield } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { TrustBadge } from "@/components/ui/trust-badge";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) return null;

  const sizes = ["XS", "S", "M", "L", "XL"];
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border/50">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-secondary/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isAuthentic && <TrustBadge type="authentic" />}
              {discount > 0 && (
                <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-success text-white">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                "absolute top-4 right-4 p-3 rounded-full transition-all duration-300",
                isWishlisted 
                  ? "bg-primary/20 backdrop-blur-sm" 
                  : "bg-background/60 backdrop-blur-sm hover:bg-background/80"
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isWishlisted 
                    ? "fill-primary text-primary" 
                    : "text-foreground"
                )}
              />
            </button>
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col">
            {/* Brand & Title */}
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
              {product.brand}
            </p>
            <h2 className="text-xl font-bold mb-3">{product.name}</h2>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating}) · {product.reviews || 0} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Select Size</p>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-10 h-10 rounded-lg border text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button className="flex-1 gradient-primary text-primary-foreground font-semibold h-12">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
              <div className="flex flex-col items-center text-center gap-1">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">Free Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
