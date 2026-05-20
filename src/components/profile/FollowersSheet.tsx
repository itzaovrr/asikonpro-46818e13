import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

interface UserRow {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface FollowersSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: "Followers" | "Following";
  users: UserRow[];
  loading?: boolean;
}

export function FollowersSheet({ open, onOpenChange, title, users, loading }: FollowersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-y-auto max-h-[calc(75vh-4rem)] -mx-6 px-6 space-y-1">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No {title.toLowerCase()} yet.</p>
          ) : (
            users.map((u) => (
              <Link
                key={u.id}
                to={`/profile/${u.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={u.avatar_url ?? undefined} alt={u.full_name ?? u.username ?? ""} />
                  <AvatarFallback>{(u.full_name ?? u.username ?? "?")[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name || u.username}</p>
                  {u.username && <p className="text-xs text-muted-foreground">@{u.username}</p>}
                </div>
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
