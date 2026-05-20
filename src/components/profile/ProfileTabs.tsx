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
} from "lucide-react";

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
  /** Hide private tabs when viewing someone else's profile. */
  showPrivate?: boolean;
  counts?: Partial<Record<ProfileTabType, number>>;
}

const ALL_TABS: { id: ProfileTabType; label: string; icon: React.ReactNode; private?: boolean }[] = [
  { id: "posts", label: "Posts", icon: <Newspaper className="h-4 w-4" /> },
  { id: "media", label: "Media", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
  { id: "learning", label: "Learning", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "library", label: "Library", icon: <Library className="h-4 w-4" />, private: true },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" />, private: true },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" />, private: true },
];

export function ProfileTabs({ activeTab, onTabChange, showPrivate = true, counts }: ProfileTabsProps) {
  const tabs = ALL_TABS.filter((t) => showPrivate || !t.private);
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
    <div ref={containerRef} className="relative flex overflow-x-auto hide-scrollbar">
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
              "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("transition-all duration-200", isActive ? "text-primary scale-110" : "")}>
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
  );
}
