import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Coins, Share2, Save, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductConfig {
  type: "tshirt";
  fit: "regular" | "oversized";
  gender: "unisex" | "men" | "women";
  color: string;
  size: string;
}

interface PricingPanelProps {
  productConfig: ProductConfig;
}

export function PricingPanel({ productConfig }: PricingPanelProps) {
  // Calculate pricing
  const basePrice = productConfig.fit === "oversized" ? 29.99 : 24.99;
  const customizationFee = 5.00;
  const coinDiscount = 2.50; // Example discount from coins
  const finalPrice = basePrice + customizationFee - coinDiscount;

  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-border p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Price Breakdown */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">
                ${(basePrice + customizationFee).toFixed(2)}
              </span>
              <Badge variant="secondary" className="text-xs gap-1">
                <Coins className="h-3 w-3 text-amber-500" />
                -${coinDiscount.toFixed(2)}
              </Badge>
            </div>
            
            {/* Breakdown details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Base: ${basePrice.toFixed(2)}</span>
              <span>+Custom: ${customizationFee.toFixed(2)}</span>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                <span>Quality guaranteed</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 text-primary" />
                <span>Est. 5-7 days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button className="gradient-primary border-0 gap-2 px-6">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
