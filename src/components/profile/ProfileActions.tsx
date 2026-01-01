import { MessageCircle, Share2, UserPlus, UserMinus, Flag, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ProfileActionsProps {
  isFollowing?: boolean;
  isOwnProfile?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onEditProfile?: () => void;
}

export function ProfileActions({
  isFollowing = false,
  isOwnProfile = false,
  onFollow,
  onMessage,
  onShare,
  onReport,
  onBlock,
  onEditProfile,
}: ProfileActionsProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
    onFollow?.();
  };

  if (isOwnProfile) {
    return (
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex-1" onClick={onEditProfile}>
            Edit Profile
          </Button>
          <Button variant="secondary" size="icon" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pb-4">
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleFollow}
          className={following ? "flex-1 bg-secondary hover:bg-secondary/80" : "flex-1 gradient-primary border-0"}
        >
          {following ? (
            <>
              <UserMinus className="h-4 w-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </>
          )}
        </Button>
        
        <Button variant="secondary" className="flex-1" onClick={onMessage}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-strong">
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onReport} className="text-amber-400">
              <Flag className="h-4 w-4 mr-2" />
              Report User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlock} className="text-destructive">
              <Ban className="h-4 w-4 mr-2" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
