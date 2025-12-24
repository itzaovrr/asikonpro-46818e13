import { Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function CreateContentFAB() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/create")}
      className={cn(
        "fixed bottom-20 right-4 z-50 md:bottom-8",
        "w-14 h-14 rounded-2xl",
        "gradient-primary glow-primary",
        "flex items-center justify-center",
        "shadow-xl shadow-primary/25",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-2xl hover:shadow-primary/40",
        "active:scale-95",
        "group"
      )}
    >
      <div className="relative">
        <Plus className="h-6 w-6 text-primary-foreground transition-transform duration-300 group-hover:rotate-90" />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
