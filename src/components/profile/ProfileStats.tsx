import { Users, UserPlus, FileText, ShoppingBag, Star, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  followers: number;
  following: number;
  posts: number;
  purchases: number;
  reviews: number;
  coins: number;
  onStatClick?: (stat: string) => void;
}

export function ProfileStats({
  followers,
  following,
  posts,
  purchases,
  reviews,
  coins,
  onStatClick,
}: ProfileStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const stats = [
    { key: "Followers", value: followers, icon: Users },
    { key: "Following", value: following, icon: UserPlus },
    { key: "Posts", value: posts, icon: FileText },
    { key: "Purchases", value: purchases, icon: ShoppingBag },
    { key: "Reviews", value: reviews, icon: Star },
    { key: "Coins", value: coins, icon: Coins },
  ];

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {stats.map(({ key, value, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onStatClick?.(key)}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-0.5 p-3 rounded-2xl",
              "border border-border/40 bg-card/40 backdrop-blur-md",
              "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:bg-card/70 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md",
              "active:scale-[0.97]",
            )}
            aria-label={`${value} ${key}`}
          >
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-base font-bold tracking-tight text-foreground tabular-nums">
              {formatNumber(value)}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
