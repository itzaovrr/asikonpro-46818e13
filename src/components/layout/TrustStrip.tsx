import { Truck, MapPin, RefreshCw } from "lucide-react";

interface TrustStripProps {
  show?: boolean;
}

export function TrustStrip({ show = true }: TrustStripProps) {
  if (!show) return null;

  const trustItems = [
    { icon: <Truck className="w-3.5 h-3.5" />, text: "Cash on Delivery Available" },
    { icon: <MapPin className="w-3.5 h-3.5" />, text: "Made in Bangladesh" },
    { icon: <RefreshCw className="w-3.5 h-3.5" />, text: "7 Days Easy Exchange" },
  ];

  return (
    <div className="hidden md:flex items-center justify-center gap-6 py-1.5 px-4 bg-secondary/50 border-b border-border text-xs">
      {trustItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
