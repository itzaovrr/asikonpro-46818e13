import { ShieldCheck, Truck, RefreshCw, CreditCard } from "lucide-react";

export function TrustIndicators() {
  const indicators = [
    { icon: CreditCard, label: "Cash on Delivery", color: "text-success" },
    { icon: RefreshCw, label: "Easy Returns", color: "text-primary" },
    { icon: Truck, label: "Fast Delivery", color: "text-amber-500" },
    { icon: ShieldCheck, label: "Quality Checked", color: "text-success" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {indicators.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50"
        >
          <item.icon className={`h-4 w-4 ${item.color}`} />
          <span className="text-xs font-medium text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
