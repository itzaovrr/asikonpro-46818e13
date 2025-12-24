import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EngagementBarProps {
  likes: number;
  comments: number;
  shares?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  variant?: "horizontal" | "vertical";
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export function EngagementBar({
  likes,
  comments,
  shares = 0,
  isLiked: initialLiked = false,
  isSaved: initialSaved = false,
  variant = "horizontal",
  onLike,
  onComment,
  onShare,
  onSave,
}: EngagementBarProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (variant === "vertical") {
    return (
      <div className="flex flex-col items-center gap-4">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
            <Heart className={cn("h-6 w-6", isLiked && "fill-primary text-primary")} />
          </div>
          <span className="text-xs font-medium">{formatNumber(likeCount)}</span>
        </button>
        <button onClick={onComment} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">{formatNumber(comments)}</span>
        </button>
        <button onClick={onShare} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium">{formatNumber(shares)}</span>
        </button>
        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
            <Bookmark className={cn("h-6 w-6", isSaved && "fill-foreground")} />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button onClick={handleLike} className="flex items-center gap-1.5">
        <Heart className={cn("h-6 w-6 transition-colors", isLiked && "fill-primary text-primary")} />
        <span className="text-sm font-medium">{formatNumber(likeCount)}</span>
      </button>
      <button onClick={onComment} className="flex items-center gap-1.5">
        <MessageCircle className="h-6 w-6" />
        <span className="text-sm font-medium">{formatNumber(comments)}</span>
      </button>
      <button onClick={onShare} className="flex items-center gap-1.5">
        <Share2 className="h-6 w-6" />
      </button>
      <button onClick={handleSave} className="ml-auto">
        <Bookmark className={cn("h-6 w-6", isSaved && "fill-foreground")} />
      </button>
    </div>
  );
}
