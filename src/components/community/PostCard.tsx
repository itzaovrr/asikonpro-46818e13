import { Heart, MessageCircle, Share2, MoreHorizontal, ShoppingBag, Bookmark } from "lucide-react";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmartImage } from "@/components/ui/smart-image";

interface PostCardProps {
  post: Post;
}

function PostCardImpl({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <article
      className={cn(
        "group/post mx-auto w-full max-w-[640px]",
        "bg-card/70 backdrop-blur-xl",
        "border-y border-border/60 sm:border sm:border-border/60",
        "sm:rounded-2xl overflow-hidden",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "sm:hover:-translate-y-[2px] sm:hover:shadow-[var(--shadow-lg)] sm:hover:border-primary/30"
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-3.5 sm:p-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-11 w-11 ring-2 ring-primary/25 ring-offset-2 ring-offset-background">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-[14px] truncate">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <span
                  aria-label="Verified"
                  className="inline-grid place-items-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold"
                >
                  ✓
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span>{post.user.name}</span>
              <span aria-hidden className="opacity-50">·</span>
              <span>{post.timestamp}</span>
            </p>
          </div>
        </div>
        <button
          aria-label="More options"
          className="p-2 hover:bg-secondary/60 rounded-full transition-colors"
        >
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* Image */}
      {post.image && (
        <div className="relative px-3.5 sm:px-4">
          <div className="relative overflow-hidden rounded-xl bg-muted">
            <SmartImage
              src={post.image}
              alt="Post content"
              className="w-full aspect-[4/5] sm:aspect-[16/11] object-cover transition-transform duration-700 group-hover/post:scale-[1.03]"
            />
            {/* Bottom scrim */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
            />
            {post.product && (
              <button className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border/60 text-[12px] font-medium hover:bg-background transition-colors shadow-sm">
                <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                Shop the look
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action strip */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 pt-3">
        <div className="flex items-center gap-1">
          <ActionButton onClick={handleLike} active={isLiked} ariaLabel="Like">
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-all",
                isLiked && "fill-primary text-primary scale-110"
              )}
            />
            <span className="text-[12px] font-medium tabular-nums">
              {likes.toLocaleString()}
            </span>
          </ActionButton>
          <ActionButton ariaLabel="Comment">
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-[12px] font-medium tabular-nums">{post.comments}</span>
          </ActionButton>
          <ActionButton ariaLabel="Share">
            <Share2 className="h-[18px] w-[18px]" />
          </ActionButton>
        </div>
        <ActionButton
          onClick={() => setSaved((s) => !s)}
          active={saved}
          ariaLabel="Save"
        >
          <Bookmark
            className={cn(
              "h-[18px] w-[18px] transition-all",
              saved && "fill-primary text-primary"
            )}
          />
        </ActionButton>
      </div>

      {/* Caption */}
      <div className="px-3.5 sm:px-4 pt-2.5 pb-4">
        <p className="text-[13.5px] leading-relaxed">
          <span className="font-semibold mr-1.5">{post.user.username}</span>
          <span className="text-foreground/85">{post.content}</span>
        </p>
      </div>
    </article>
  );
}

function ActionButton({
  children,
  onClick,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200",
        "hover:bg-secondary/60 active:scale-[0.96]",
        active && "bg-primary/10"
      )}
    >
      {children}
    </button>
  );
}

export const PostCard = memo(PostCardImpl);
