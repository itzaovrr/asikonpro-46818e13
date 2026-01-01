import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, max = 10 }: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <p className="font-semibold text-foreground">Quantity</p>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="h-10 w-10 rounded-xl"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrease}
          disabled={quantity >= max}
          className="h-10 w-10 rounded-xl"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
