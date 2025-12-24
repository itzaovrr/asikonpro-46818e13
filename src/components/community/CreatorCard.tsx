import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorCardProps {
  user: User;
  showFollowButton?: boolean;
  variant?: "default" | "compact" | "overlay";
  timestamp?: string;
}

export function CreatorCard({ 
  user, 
  showFollowButton = false, 
  variant = "default",
  timestamp 
}: CreatorCardProps) {
  if (variant === "overlay") {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 ring-2 ring-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground drop-shadow-md">
            @{user.username}
          </span>
          {user.isVerified && (
            <BadgeCheck className="h-4 w-4 text-primary fill-primary-foreground" />
          )}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{user.username}</span>
          {user.isVerified && (
            <BadgeCheck className="h-3.5 w-3.5 text-primary fill-primary-foreground" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm">{user.username}</span>
            {user.isVerified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary-foreground" />
            )}
          </div>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
      </div>
      {showFollowButton && (
        <Button size="sm" variant="outline" className="rounded-full">
          Follow
        </Button>
      )}
    </div>
  );
}
