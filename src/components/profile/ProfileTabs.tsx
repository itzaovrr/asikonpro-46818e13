import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Newspaper,
  Image as ImageIcon,
  Star,
  GraduationCap,
  Library,
  ShoppingBag,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ProfileTabType =
  | "posts"
  | "media"
  | "reviews"
  | "learning"
  | "library"
  | "orders"
  | "wishlist";

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  /** Hide secondary (private) tabs when viewing someone else's profile. */
  showPrivate?: boolean;
  counts?: Partial<Record<ProfileTabType, number>>;
}

type TabDef = { id: ProfileTabType; label: string; icon: React.ReactNode };

const PRIMARY_TABS: TabDef[] = [
  { id: "posts", label: "Posts", icon: <Newspaper className="h-4 w-4" /> },
  { id: "media", label: "Media", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "learning", label: "Learning", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
];

const SECONDARY_TABS: TabDef[] = [
  { id: "library", label: "Library", icon: <Library className="h-4 w-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" /> },
];

export function ProfileTabs({ activeTab, onTabChange, showPrivate = true, counts }: ProfileTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [moreOpen, setMoreOpen] = useState(false);

  const activeSecondary = SECONDARY_TABS.find((t) => t.id === activeTab);
  const moreKey = activeSecondary ? `more-${activeSecondary.id}` : "more";

  useLayoutEffect(() => {
    const targetKey = activeSecondary ? "more" : activeTab;
    const el = buttonRefs.current[targetKey];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setIndicator({ left: eRect.left - cRect.left + container.scrollLeft, width: eRect.width });
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab, activeSecondary, moreKey]);

  useEffect(() => {
    const onResize = () => {
      const targetKey = activeSecondary ? "more" : activeTab;
      const el = buttonRefs.current[targetKey];
      const container = containerRef.current;
      if (!el || !container) return;
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      setIndicator({ left: eRect.left - cRect.left + container.scrollLeft, width: eRect.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab, activeSecondary]);

  const renderCount = (id: ProfileTabType, isActive: boolean) => {
    const count = counts?.[id];
    if (count === undefined || count <= 0) return null;
    return (
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors",
          isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative flex overflow-x-auto hide-scrollbar">
      <span
        aria-hidden
        className="absolute bottom-0 h-[2px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
      />

      {PRIMARY_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => (buttonRefs.current[tab.id] = el)}
            onClick={() => onTabChange(tab.id)}
            aria-selected={isActive}
            role="tab"
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("transition-all duration-200", isActive ? "text-primary scale-110" : "")}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {renderCount(tab.id, isActive)}
          </button>
        );
      })}

      {showPrivate && (
        <Popover open={moreOpen} onOpenChange={setMoreOpen}>
          <PopoverTrigger asChild>
            <button
              ref={(el) => (buttonRefs.current["more"] = el)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                activeSecondary ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeSecondary ? (
                <>
                  <span className="text-primary scale-110">{activeSecondary.icon}</span>
                  <span>{activeSecondary.label}</span>
                  {renderCount(activeSecondary.id, true)}
                </>
              ) : (
                <span>More</span>
              )}
              <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1 glass-strong">
            {SECONDARY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = counts?.[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary/60",
                  )}
                >
                  {tab.icon}
                  <span className="flex-1">{tab.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </button>
              );
            })}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
