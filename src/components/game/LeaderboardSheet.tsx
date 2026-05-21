import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame } from "lucide-react";
import { useLeaderboard } from "@/hooks/useGameData";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function LeaderboardSheet({ open, onOpenChange }: Props) {
  const { data = [], isLoading } = useLeaderboard();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" /> Top Learners
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No learners yet. Be the first!</p>
          ) : (
            data.map((u, i) => {
              const name = u.full_name || u.username || "Anonymous";
              const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
              return (
                <div key={u.user_id} className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border/40 px-3 py-2.5">
                  <span className="text-sm font-bold w-8 text-center">{medal}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.avatar_url ?? undefined} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{name}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-400" /> {u.longest_streak ?? 0}-day best
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">{u.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
