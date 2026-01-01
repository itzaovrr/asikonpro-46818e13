import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  onOpenGuide?: () => void;
}

export function SizeSelector({ sizes, selectedSize, onSelectSize, onOpenGuide }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">Select Size</p>
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="text-xs text-primary hover:underline font-medium"
          >
            Size Guide
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            className={cn(
              "min-w-[48px] px-4 py-2.5 rounded-xl font-medium transition-all duration-200",
              "border-2",
              selectedSize === size
                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
