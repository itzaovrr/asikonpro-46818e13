import { Star, ThumbsUp, CheckCircle2, Image, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; count: number }[];
}

export function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ProductReviewsProps) {
  const maxCount = Math.max(...ratingDistribution.map((r) => r.count), 1);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-secondary/30 border border-border/50">
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex items-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{totalReviews} reviews</span>
        </div>

        <div className="flex-1 space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-xs w-3">{item.stars}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Progress value={(item.count / maxCount) * 100} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="p-4 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback>{review.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{review.userName}</span>
                  {review.isVerifiedPurchase && (
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-semibold">{review.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{review.content}</p>
            </div>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" className="gap-2 text-xs">
                <ThumbsUp className="h-3 w-3" />
                Helpful ({review.helpfulCount})
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
