import { cn, formatCount } from "@/lib/utils";

interface ProfileStatsProps {
  posts: number;
  followers: number;
  following: number;
  coins: number;
  onPostsClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onCoinsClick?: () => void;
}

/** Instagram-style compact stat row (4 cells, tappable). */
export function ProfileStats({
  posts,
  followers,
  following,
  coins,
  onPostsClick,
  onFollowersClick,
  onFollowingClick,
  onCoinsClick,
}: ProfileStatsProps) {
  const stats = [
    { key: "Posts", value: posts, onClick: onPostsClick },
    { key: "Followers", value: followers, onClick: onFollowersClick },
    { key: "Following", value: following, onClick: onFollowingClick },
    { key: "Coins", value: coins, onClick: onCoinsClick },
  ];
  return (
    <div className="px-4 pt-4">
      <div className="grid grid-cols-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
        {stats.map((s, i) => (
          <button
            key={s.key}
            onClick={s.onClick}
            className={cn(
              "flex flex-col items-center justify-center py-2.5 text-center transition-colors",
              "hover:bg-secondary/40 active:scale-[0.98]",
              i !== 0 && "border-l border-border/40",
            )}
          >
            <span className="text-base font-bold tabular-nums text-foreground">{formatCount(s.value)}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
