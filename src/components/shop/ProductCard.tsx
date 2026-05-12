import { Heart, Star, ShoppingBag, Eye, TrendingUp, Shield } from "lucide-react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, variant = "default" }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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
            "group relative bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300",
            "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
            isFeatured && "lg:flex lg:flex-row"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <figure className={cn(
            "relative overflow-hidden bg-secondary/30",
            isCompact ? "aspect-square" : "aspect-[4/5]",
            isFeatured && "lg:w-1/2 lg:aspect-auto lg:h-full"
          )}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 backdrop-blur-md",
                isWishlisted 
                  ? "bg-primary/20 ring-2 ring-primary/30" 
                  : "bg-background/60 hover:bg-background/80"
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

            {/* Badges Stack */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isAuthentic && (
                <Badge variant="secondary" className="gap-1 text-[10px] font-semibold bg-background/80 backdrop-blur-sm border-0">
                  <Shield className="h-3 w-3 text-success" />
                  Authentic
                </Badge>
              )}
              {product.isTrending && (
                <Badge className="gap-1 text-[10px] font-semibold gradient-primary border-0">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="text-[10px] font-bold">
                  -{discount}% OFF
                </Badge>
              )}
              {product.isNew && (
                <Badge className="text-[10px] font-semibold bg-accent text-accent-foreground border-0">
                  NEW
                </Badge>
              )}
            </div>

            {/* Quick Actions - Shows on Hover */}
            <div className={cn(
              "absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}>
              <Button 
                size="sm" 
                variant="secondary"
                className="flex-1 bg-background/90 backdrop-blur-md hover:bg-background font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
              <Button 
                size="sm" 
                className="gradient-primary border-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          </figure>

          {/* Content */}
          <div className={cn(
            "p-4",
            isFeatured && "lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:p-6"
          )}>
            {/* Brand */}
            {product.brand && (
              <p className="text-[10px] font-semibold text-primary/80 uppercase tracking-[0.14em] mb-1.5">
                {product.brand}
              </p>
            )}
            
            {/* Title */}
            <h3 className={cn(
              "font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors",
              isCompact ? "text-sm" : "text-[15px]",
              isFeatured && "lg:text-xl lg:line-clamp-3"
            )}>
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/60">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{product.rating}</span>
              </div>
              {product.reviews > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              )}
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={cn(
                "font-bold text-foreground",
                isCompact ? "text-lg" : "text-xl",
                isFeatured && "lg:text-2xl"
              )}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-medium text-success">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Trust Indicators for Featured */}
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
