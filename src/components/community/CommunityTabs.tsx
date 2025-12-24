import { cn } from "@/lib/utils";
import { CommunityTab } from "@/types/community";

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
];

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  return (
    <div className="flex items-center gap-1 px-4 pb-3 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
            activeTab === tab.id
              ? "gradient-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
