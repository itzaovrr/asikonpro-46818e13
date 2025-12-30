import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductConfig {
  type: "tshirt";
  fit: "regular" | "oversized";
  gender: "unisex" | "men" | "women";
  color: string;
  size: string;
}

interface ProductSelectorProps {
  config: ProductConfig;
  onChange: (config: ProductConfig) => void;
  compact?: boolean;
}

const colors = [
  { value: "#FFFFFF", name: "White" },
  { value: "#000000", name: "Black" },
  { value: "#1F2937", name: "Charcoal" },
  { value: "#991B1B", name: "Maroon" },
  { value: "#1E40AF", name: "Navy" },
  { value: "#166534", name: "Forest" },
  { value: "#F59E0B", name: "Mustard" },
  { value: "#EC4899", name: "Pink" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductSelector({ config, onChange, compact = false }: ProductSelectorProps) {
  const updateConfig = (key: keyof ProductConfig, value: string) => {
    onChange({ ...config, [key]: value });
  };

  if (compact) {
    return (
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {/* Fit */}
        <div className="flex-shrink-0">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Fit</Label>
          <div className="flex gap-1">
            {["regular", "oversized"].map((fit) => (
              <button
                key={fit}
                onClick={() => updateConfig("fit", fit)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full border transition-colors capitalize",
                  config.fit === fit
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="flex-shrink-0">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Gender</Label>
          <div className="flex gap-1">
            {["unisex", "men", "women"].map((gender) => (
              <button
                key={gender}
                onClick={() => updateConfig("gender", gender)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full border transition-colors capitalize",
                  config.gender === gender
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="flex-shrink-0">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Color</Label>
          <div className="flex gap-1">
            {colors.slice(0, 5).map((color) => (
              <button
                key={color.value}
                onClick={() => updateConfig("color", color.value)}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all",
                  config.color === color.value
                    ? "border-primary scale-110"
                    : "border-border hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="flex-shrink-0">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Size</Label>
          <div className="flex gap-1">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => updateConfig("size", size)}
                className={cn(
                  "w-8 h-8 text-xs rounded-lg border transition-colors",
                  config.size === size
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Product Options</h3>
      </div>

      {/* Product Type */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">Product Type</Label>
        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👕</span>
            <div>
              <p className="font-medium">T-Shirt</p>
              <p className="text-xs text-muted-foreground">Premium cotton blend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fit */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">Fit</Label>
        <RadioGroup
          value={config.fit}
          onValueChange={(v) => updateConfig("fit", v)}
          className="grid grid-cols-2 gap-2"
        >
          {["regular", "oversized"].map((fit) => (
            <Label
              key={fit}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors capitalize",
                config.fit === fit
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <RadioGroupItem value={fit} />
              {fit}
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Gender */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">Gender</Label>
        <RadioGroup
          value={config.gender}
          onValueChange={(v) => updateConfig("gender", v)}
          className="grid grid-cols-3 gap-2"
        >
          {["unisex", "men", "women"].map((gender) => (
            <Label
              key={gender}
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors capitalize text-sm",
                config.gender === gender
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <RadioGroupItem value={gender} className="sr-only" />
              {gender}
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Color */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">Color</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateConfig("color", color.value)}
              className={cn(
                "w-10 h-10 rounded-xl border-2 transition-all",
                config.color === color.value
                  ? "border-primary ring-2 ring-primary/30 scale-110"
                  : "border-border hover:scale-105"
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">Size</Label>
        <div className="grid grid-cols-6 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateConfig("size", size)}
              className={cn(
                "py-2 text-sm rounded-xl border transition-colors",
                config.size === size
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/30"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
