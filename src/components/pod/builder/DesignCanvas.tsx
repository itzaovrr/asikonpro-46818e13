import { cn } from "@/lib/utils";

interface ProductConfig {
  type: "tshirt";
  fit: "regular" | "oversized";
  gender: "unisex" | "men" | "women";
  color: string;
  size: string;
}

type ViewAngle = "front" | "back" | "left" | "right";

interface DesignCanvasProps {
  productConfig: ProductConfig;
  viewAngle: ViewAngle;
  zoom: number;
  selectedDesign: string | null;
}

export function DesignCanvas({ productConfig, viewAngle, zoom, selectedDesign }: DesignCanvasProps) {
  const isLightColor = productConfig.color === "#FFFFFF" || productConfig.color === "#F59E0B";

  return (
    <div 
      className="relative transition-transform duration-300"
      style={{ transform: `scale(${zoom})` }}
    >
      {/* T-shirt mockup */}
      <div 
        className={cn(
          "relative w-64 h-80 lg:w-80 lg:h-96 rounded-2xl shadow-2xl transition-colors duration-300",
          "flex items-center justify-center"
        )}
        style={{ backgroundColor: productConfig.color }}
      >
        {/* T-shirt shape outline */}
        <svg
          viewBox="0 0 200 240"
          className={cn(
            "absolute inset-0 w-full h-full",
            isLightColor ? "stroke-black/10" : "stroke-white/10"
          )}
          fill="none"
          strokeWidth="1"
        >
          {/* Collar */}
          <path d="M70 30 Q100 50 130 30" />
          {/* Shoulders */}
          <path d="M70 30 L40 50 L40 80 L60 80" />
          <path d="M130 30 L160 50 L160 80 L140 80" />
          {/* Body */}
          <path d="M60 80 L60 210 Q100 220 140 210 L140 80" />
        </svg>

        {/* Design area */}
        <div 
          className={cn(
            "relative w-32 h-40 lg:w-40 lg:h-48 rounded-lg border-2 border-dashed transition-colors",
            isLightColor ? "border-black/20" : "border-white/20",
            selectedDesign && "border-primary"
          )}
        >
          {selectedDesign ? (
            <img
              src={selectedDesign}
              alt="Selected design"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={cn(
                "text-xs text-center px-2",
                isLightColor ? "text-black/40" : "text-white/40"
              )}>
                {viewAngle === "front" && "Tap to add design"}
                {viewAngle === "back" && "Back design area"}
                {viewAngle === "left" && "Left sleeve area"}
                {viewAngle === "right" && "Right sleeve area"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Size label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className={cn(
          "text-xs font-medium px-3 py-1 rounded-full",
          isLightColor ? "bg-black/10 text-black/60" : "bg-white/10 text-white/60"
        )}>
          Size {productConfig.size}
        </span>
      </div>
    </div>
  );
}
