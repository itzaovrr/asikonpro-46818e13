import { Star } from "lucide-react";
import { useState } from "react";
import { ReviewCard } from "@/components/community/ReviewCard";
import { mockReviews } from "@/lib/community-mock-data";
import { cn } from "@/lib/utils";

const filters = [
  { label: "All", value: 0 },
  { label: "5★", value: 5 },
  { label: "4★", value: 4 },
  { label: "3★", value: 3 },
  { label: "2★", value: 2 },
  { label: "1★", value: 1 },
];

export function ReviewsTab() {
  const [activeFilter, setActiveFilter] = useState(0);

  // Duplicate for demo
  const reviews = [...mockReviews, ...mockReviews.map(r => ({ ...r, id: `${r.id}-dup` }))];
  
  const filteredReviews = activeFilter === 0 
    ? reviews 
    : reviews.filter(r => r.rating === activeFilter);

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex gap-2 px-4 overflow-x-auto hide-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeFilter === filter.value
                ? "gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.value > 0 && <Star className="h-3 w-3 fill-current" />}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Stats banner */}
      <div className="mx-4 p-4 bg-secondary/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">4.8</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 5 ? "fill-gold text-gold" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on 1,234 verified reviews</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-success">98% Verified</p>
            <p className="text-xs text-muted-foreground">Purchases</p>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-0">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
