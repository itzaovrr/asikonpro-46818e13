import { ShoppingBag } from "lucide-react";
import { Product } from "@/types";

interface ProductTagProps {
  product: Product;
  variant?: "overlay" | "inline";
}

export function ProductTag({ product, variant = "overlay" }: ProductTagProps) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-sm text-primary font-semibold">${product.price}</p>
        </div>
        <button className="p-2 rounded-full bg-primary text-primary-foreground">
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-border hover:bg-background transition-colors">
      <ShoppingBag className="h-4 w-4" />
      <span className="text-sm font-medium">Shop the look</span>
    </button>
  );
}
