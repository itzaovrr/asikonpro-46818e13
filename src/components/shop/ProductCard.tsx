import { Heart } from "lucide-react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { TrustBadge } from "@/components/ui/trust-badge";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, variant = "default" }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
      <div ref={ref} className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted ? "fill-primary text-primary" : "text-foreground"
              )}
            />
          </button>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isAuthentic && <TrustBadge type="authentic" />}
            {product.isTrending && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full gradient-primary text-foreground">
                HOT
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-amber-400">★</span>
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";
