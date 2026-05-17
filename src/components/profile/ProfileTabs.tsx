import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Newspaper, ShoppingBag, Star, Image as ImageIcon, Activity } from "lucide-react";

export type ProfileTabType = "feed" | "shop" | "reviews" | "media" | "activity";

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  counts?: Partial<Record<ProfileTabType, number>>;
}

const tabs: { id: ProfileTabType; label: string; icon: React.ReactNode }[] = [
  { id: "feed", label: "Posts", icon: <Newspaper className="h-4 w-4" /> },
  { id: "shop", label: "Projects", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
  { id: "media", label: "Media", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "activity", label: "Activity", icon: <Activity className="h-4 w-4" /> },
];

export function ProfileTabs({ activeTab, onTabChange, counts }: ProfileTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = buttonRefs.current[activeTab];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setIndicator({ left: eRect.left - cRect.left + container.scrollLeft, width: eRect.width });
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  useEffect(() => {
    const onResize = () => {
      const el = buttonRefs.current[activeTab];
      const container = containerRef.current;
      if (!el || !container) return;
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      setIndicator({ left: eRect.left - cRect.left + container.scrollLeft, width: eRect.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  return (
    <div className="sticky top-0 z-20 bg-background/75 backdrop-blur-xl border-b border-border/60">
      <div ref={containerRef} className="relative flex overflow-x-auto hide-scrollbar px-2">
        {/* Animated indicator */}
        <span
          aria-hidden
          className="absolute bottom-0 h-[2px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
        {tabs.map((tab) => {
          const count = counts?.[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (buttonRefs.current[tab.id] = el)}
              onClick={() => onTabChange(tab.id)}
              aria-selected={isActive}
              role="tab"
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap",
                "transition-colors duration-200",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "transition-all duration-200",
                  isActive ? "text-primary scale-110" : "scale-100",
                )}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors",
                    isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
