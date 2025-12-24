import { Star, ThumbsUp, Play } from "lucide-react";
import { Review } from "@/types/community";
import { CreatorCard } from "./CreatorCard";
import { VerifiedBuyerBadge } from "./VerifiedBuyerBadge";
import { ProductTag } from "./ProductTag";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="bg-card border-b border-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <CreatorCard user={review.user} timestamp={review.timestamp} />
        {review.isVerifiedPurchase && <VerifiedBuyerBadge />}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        {review.title && (
          <span className="font-semibold text-sm">{review.title}</span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground">{review.content}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
          ))}
          {review.videoUrl && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Play className="h-8 w-8 fill-foreground" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product */}
      <ProductTag product={review.product} variant="inline" />

      {/* Helpful */}
      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ThumbsUp className="h-4 w-4" />
        <span>Helpful ({review.helpfulCount})</span>
      </button>
    </article>
  );
}
