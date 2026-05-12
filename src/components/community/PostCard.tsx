import { Heart, MessageCircle, Share2, MoreHorizontal, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <article className="bg-card border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{post.user.username}</span>
              {post.user.isVerified && (
                <span className="text-primary text-xs">✓</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative">
          <SmartImage
            src={post.image}
            alt="Post content"
            className="w-full aspect-[4/5] object-cover"
          />
          
          {/* Product Tag */}
          {post.product && (
            <button className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-border">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-sm font-medium">Shop the look</span>
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 p-4">
        <button onClick={handleLike} className="flex items-center gap-1.5">
          <Heart
            className={cn(
              "h-6 w-6 transition-colors",
              isLiked ? "fill-primary text-primary" : "text-foreground"
            )}
          />
          <span className="text-sm font-medium">{likes.toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-1.5">
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5">
          <Share2 className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-sm">
          <span className="font-semibold">{post.user.username}</span>{" "}
          {post.content}
        </p>
      </div>
    </article>
  );
}
