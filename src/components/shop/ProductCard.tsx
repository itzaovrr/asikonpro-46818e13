import { Heart, Star, ShoppingBag, Eye, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { Price } from "@/lib/currency";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

/**
 * Apple-inspired Product Card
 * Clean, minimal design with subtle hover effects
 */
const DEFAULT_BRAND = "Asikon Academy";

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, variant = "default" }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const discount = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";

    return (
      <>
        <article
          ref={ref}
          className={cn(
            "group relative bg-card rounded-2xl overflow-hidden h-full flex flex-col",
            "transition-all duration-300 ease-out",
            "hover:shadow-xl hover:-translate-y-1",
            isFeatured && "lg:flex-row"
          )}
        >
          {/* Image */}
          <figure
            className={cn(
              "relative overflow-hidden bg-secondary/20",
              isCompact ? "aspect-[4/3]" : "aspect-[4/5]",
              isFeatured && "lg:w-1/2 lg:aspect-auto lg:h-full"
            )}
          >
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Wishlist button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "no-min-tap absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full transition-all duration-200",
                "bg-background/80 backdrop-blur-md",
                isWishlisted ? "ring-2 ring-primary/50" : "hover:bg-background"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  isWishlisted ? "fill-primary text-primary" : "text-foreground"
                )}
              />
            </button>

            {/* Discount badge */}
            {discount > 0 && (
              <Badge className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                Save {discount}%
              </Badge>
            )}

            {/* New badge */}
            {product.isNew && !discount && (
              <Badge className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 bg-secondary text-foreground rounded-full">
                New
              </Badge>
            )}

            {/* Quick view overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "flex items-end justify-center pb-6"
              )}
            >
              <Button
                size="sm"
                className="bg-background text-foreground hover:bg-background/90 rounded-full px-6"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
            </div>
          </figure>

          {/* Content */}
          <div
            className={cn(
              "p-4 md:p-5 flex-1 flex flex-col",
              isFeatured && "lg:flex-1 lg:justify-center lg:p-8"
            )}
          >
            {/* Brand */}
            {product.brand && product.brand !== DEFAULT_BRAND && (
              <p className="text-xs font-medium text-muted-foreground mb-1.5 tracking-wide uppercase">
                {product.brand}
              </p>
            )}

            {/* Title */}
            <h3
              className={cn(
                "font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200",
                isCompact ? "text-sm" : "text-base",
                isFeatured && "lg:text-xl lg:line-clamp-3"
              )}
            >
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-auto pt-3">
              <Price
                amount={product.price}
                className={cn(
                  "font-semibold text-foreground",
                  isCompact ? "text-base" : "text-lg",
                  isFeatured && "lg:text-2xl"
                )}
              />
              {product.originalPrice && (
                <Price
                  amount={product.originalPrice}
                  strike
                  className="text-sm text-muted-foreground"
                />
              )}
            </div>

            {/* Featured extras */}
            {isFeatured && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            )}
          </div>
        </article>

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
