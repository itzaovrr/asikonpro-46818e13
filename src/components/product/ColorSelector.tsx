import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: { value: string; name: string; hex: string }[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onSelectColor }: ColorSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">
          Color: <span className="font-normal text-muted-foreground">{colors.find(c => c.value === selectedColor)?.name || "Select"}</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onSelectColor(color.value)}
            aria-label={`Select ${color.name} color`}
            className={cn(
              "w-10 h-10 rounded-full transition-all duration-200",
              "ring-offset-2 ring-offset-background",
              selectedColor === color.value
                ? "ring-2 ring-primary scale-110"
                : "hover:scale-105"
            )}
            style={{ backgroundColor: color.hex }}
          >
            {selectedColor === color.value && (
              <span className="flex items-center justify-center h-full">
                <svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
