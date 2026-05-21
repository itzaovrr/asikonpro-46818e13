import { Heart, MessageCircle, Share2, ShoppingBag, MoreHorizontal, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatCount, timeAgo } from "@/lib/utils";
import { Newspaper } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLikePost } from "@/hooks/usePosts";

export interface FeedPost {
  id: string;
  content: string;
  images?: string[] | null;
  videoUrl?: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  productSlug?: string | null;
  productName?: string | null;
}

interface ProfileFeedTabProps {
  posts: FeedPost[];
  user: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
}

export function ProfileFeedTab({ posts, user }: ProfileFeedTabProps) {
  const navigate = useNavigate();
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<Newspaper className="h-10 w-10" />}
        title="No posts yet"
        hint="When this profile shares posts, they'll show up here."
        action={<Button onClick={() => navigate("/community")}>Share your first post</Button>}
      />
    );
  }
  return (
    <div className="space-y-4 py-3">
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} user={user} />
      ))}
    </div>
  );
}

function FeedPostCard({ post, user }: { post: FeedPost; user: ProfileFeedTabProps["user"] }) {
  const [liked, setLiked] = useState(!!post.isLiked);
  const [count, setCount] = useState(post.likeCount);
  const like = useLikePost();

  const onLike = async () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    try {
      await like.mutateAsync(post.id);
    } catch {
      setLiked(!next);
      setCount((c) => Math.max(0, c + (next ? -1 : 1)));
    }
  };

  return (
    <article className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl overflow-hidden">
      <header className="flex items-center justify-between p-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm truncate">{user.name}</span>
              {user.isVerified && <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />}
            </div>
            <p className="text-[11px] text-muted-foreground">@{user.username} · {timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <button className="p-1.5 rounded-full hover:bg-secondary transition-colors" aria-label="More">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {post.content && (
        <p className="px-4 pb-3 text-sm whitespace-pre-wrap">{post.content}</p>
      )}

      {post.images && post.images[0] && (
        <div className="relative">
          <img src={post.images[0]} alt="" className="w-full max-h-[520px] object-cover" />
          {post.productSlug && (
            <Link
              to={`/product/${post.productSlug}`}
              className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border/60 text-[12px] font-medium hover:bg-background transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              {post.productName || "Shop now"}
            </Link>
          )}
        </div>
      )}

      {post.videoUrl && !post.images?.[0] && (
        <video src={post.videoUrl} controls className="w-full max-h-[520px] bg-black" />
      )}

      <div className="flex items-center gap-4 px-3.5 py-3 border-t border-border/40">
        <button onClick={onLike} className="flex items-center gap-1.5 text-sm" aria-pressed={liked}>
          <Heart className={cn("h-5 w-5 transition-colors", liked ? "fill-primary text-primary" : "text-muted-foreground")} />
          <span className={cn("tabular-nums", liked && "text-primary")}>{formatCount(count)}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span className="tabular-nums">{formatCount(post.commentCount)}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-16 px-6 flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/70 mb-4">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      {hint && <p className="text-sm text-muted-foreground mt-1 max-w-xs">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
