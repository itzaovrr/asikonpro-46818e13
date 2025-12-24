import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBuyerBadgeProps {
  className?: string;
  showText?: boolean;
}

export function VerifiedBuyerBadge({ className, showText = true }: VerifiedBuyerBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success rounded-full text-xs font-medium",
      className
    )}>
      <ShieldCheck className="h-3 w-3" />
      {showText && <span>Verified Buyer</span>}
    </div>
  );
}
