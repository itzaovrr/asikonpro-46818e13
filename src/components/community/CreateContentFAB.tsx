import { Plus, Image, Video, Film, Star, Radio, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Image, label: "Post", color: "bg-primary", href: "/create/post" },
  { icon: Video, label: "Video", color: "bg-purple-500", href: "/create/video" },
  { icon: Film, label: "Short", color: "bg-pink-500", href: "/create/short" },
  { icon: Star, label: "Review", color: "bg-yellow-500", href: "/create/review" },
  { icon: Radio, label: "Go Live", color: "bg-red-500", href: "/go-live" },
];

export function CreateContentFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (href: string) => {
    setIsOpen(false);
    navigate(href);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8">
      {/* Action buttons */}
      <div className={cn(
        "absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => handleAction(action.href)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg transition-all",
              action.color,
              "text-white font-medium text-sm hover:scale-105"
            )}
            style={{ 
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              transform: isOpen ? "translateX(0)" : "translateX(20px)",
              opacity: isOpen ? 1 : 0,
            }}
          >
            <action.icon className="h-5 w-5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-secondary text-foreground rotate-45" 
            : "gradient-primary glow-primary"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
