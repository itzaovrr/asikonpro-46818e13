import { Heart, Star, ShoppingBag, Eye, TrendingUp, Shield } from "lucide-react";
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
 * Universal product card.
 * - Mobile-app feel: rounded-2xl, hairline border, active:scale tap feedback.
 * - Hover overlay only shows on devices with hover (md+/desktop).
 * - Brand chip is hidden when it equals the default store brand to save space.
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
    const showBrand = product.brand && product.brand !== DEFAULT_BRAND;

    return (
      <>
        <article
          ref={ref}
          className={cn(
            "group relative bg-card rounded-2xl overflow-hidden border border-border/60 h-full flex flex-col",
            "transition-[transform,box-shadow,border-color] duration-200",
            "shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] hover:border-primary/30",
            "active:scale-[0.98]",
            isFeatured && "lg:flex-row"
          )}
        >
          {/* Image */}
          <figure
            className={cn(
              "relative overflow-hidden bg-secondary/30",
              isCompact ? "aspect-square" : "aspect-[4/5]",
              isFeatured && "lg:w-1/2 lg:aspect-auto lg:h-full"
            )}
          >
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Wishlist — always visible, app-style */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "no-min-tap absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full transition-all duration-200 backdrop-blur-md",
                isWishlisted
                  ? "bg-primary/20 ring-1 ring-primary/40"
                  : "bg-background/70 hover:bg-background/90"
              )}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isWishlisted ? "fill-primary text-primary" : "text-foreground"
                )}
              />
            </button>

            {/* Badge stack — capped at 2 */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 max-w-[60%]">
              {discount > 0 && (
                <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0">
                  -{discount}%
                </Badge>
              )}
              {product.isTrending && discount === 0 && (
                <Badge className="gap-1 text-[10px] font-semibold gradient-primary border-0 px-1.5 py-0">
                  <TrendingUp className="h-2.5 w-2.5" />
                  Hot
                </Badge>
              )}
              {product.isNew && discount === 0 && !product.isTrending && (
                <Badge className="text-[10px] font-semibold bg-accent text-accent-foreground border-0 px-1.5 py-0">
                  New
                </Badge>
              )}
              {product.isAuthentic && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-[10px] font-semibold bg-background/85 backdrop-blur-sm border-0 px-1.5 py-0"
                >
                  <Shield className="h-2.5 w-2.5 text-success" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Hover actions — desktop only */}
            <div
              className={cn(
                "hidden md:flex absolute bottom-2 left-2 right-2 gap-2 transition-all duration-300",
                "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              )}
            >
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 h-8 bg-background/90 backdrop-blur-md hover:bg-background text-xs font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Quick view
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 p-0 gradient-primary border-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
              </Button>
            </div>
          </figure>

          {/* Content */}
          <div
            className={cn(
              "p-3 flex-1 flex flex-col",
              isFeatured && "lg:flex-1 lg:justify-center lg:p-6"
            )}
          >
            {showBrand && (
              <p className="eyebrow text-primary/80 mb-1 line-clamp-1">{product.brand}</p>
            )}

            <h3
              className={cn(
                "font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors",
                isCompact ? "text-[13px] min-h-[2.25rem]" : "text-sm min-h-[2.5rem]",
                isFeatured && "lg:text-xl lg:line-clamp-3 lg:min-h-0"
              )}
            >
              {product.name}
            </h3>

            {/* Price + rating in one row to save vertical space */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <Price
                  amount={product.price}
                  className={cn(
                    "font-bold text-foreground tracking-tight",
                    isCompact ? "text-[15px]" : "text-base",
                    isFeatured && "lg:text-2xl"
                  )}
                />
                {product.originalPrice && (
                  <Price
                    amount={product.originalPrice}
                    strike
                    className="text-[11px] text-muted-foreground"
                  />
                )}
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            {isFeatured && (
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-success" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span>Bestseller</span>
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
