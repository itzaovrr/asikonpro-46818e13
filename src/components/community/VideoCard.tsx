import { Play, Eye } from "lucide-react";
import { Video } from "@/types/community";
import { CreatorCard } from "./CreatorCard";
import { VerifiedBuyerBadge } from "./VerifiedBuyerBadge";
import { ProductTag } from "./ProductTag";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/20">
          <div className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-5 w-5 fill-foreground ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
          {formatDuration(video.duration)}
        </div>

        {/* Verified buyer badge */}
        {video.isVerifiedBuyer && (
          <div className="absolute top-2 left-2">
            <VerifiedBuyerBadge showText={false} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViews(video.views)} views
              </span>
              <span>•</span>
              <span>{video.timestamp}</span>
            </div>
          </div>
        </div>

        <CreatorCard user={video.user} variant="compact" />

        {/* Product tag */}
        {video.products && video.products.length > 0 && (
          <ProductTag product={video.products[0]} variant="inline" />
        )}
      </div>
    </article>
  );
}
