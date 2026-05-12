import { cn } from "@/lib/utils";
import { CommunityTab } from "@/types/community";
import { useEffect, useRef } from "react";

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

const tabs: { id: CommunityTab; label: string }[] = [
  { id: "my-feed", label: "My Feed" },
  { id: "posts", label: "Posts" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "reviews", label: "Reviews" },
  { id: "live", label: "Live" },
  { id: "offers", label: "Offers" },
  { id: "gallery", label: "Gallery" },
];

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the active tab visible when it changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1 px-3 pt-1 pb-2 overflow-x-auto hide-scrollbar"
      role="tablist"
      aria-label="Community sections"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeRef : undefined}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-3.5 py-2 text-[13px] font-medium rounded-full whitespace-nowrap",
              "transition-[color,background-color,transform] duration-200 ease-out",
              "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              isActive
                ? "text-primary-foreground gradient-primary shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.55)]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
