import { Heart, Star, ShoppingBag } from "lucide-react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { TrustBadge } from "@/components/ui/trust-badge";
import { Button } from "@/components/ui/button";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, variant = "default" }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0;

    return (
      <>
        <div 
          ref={ref} 
          className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 card-hover"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={cn(
                "absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300",
                isWishlisted 
                  ? "bg-primary/20 backdrop-blur-sm" 
                  : "bg-background/60 backdrop-blur-sm hover:bg-background/80"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isWishlisted 
                    ? "fill-primary text-primary scale-110" 
                    : "text-foreground group-hover:text-primary"
                )}
              />
            </button>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isAuthentic && <TrustBadge type="authentic" />}
              {product.isTrending && (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full gradient-primary text-primary-foreground shadow-lg">
                  🔥 Hot
                </span>
              )}
              {discount > 0 && (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-success text-white">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Quick Add Button - Shows on Hover */}
            <div className={cn(
              "absolute bottom-3 left-3 right-3 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}>
              <Button 
                size="sm" 
                className="w-full gradient-primary text-primary-foreground font-semibold shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1.5">
              {product.brand}
            </p>
            <h3 className="font-medium text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-foreground">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <ProductQuickView
          product={product}
          open={showQuickView}
          onOpenChange={setShowQuickView}
        />
      </>
    );
  }
);

ProductCard.displayName = "ProductCard";
