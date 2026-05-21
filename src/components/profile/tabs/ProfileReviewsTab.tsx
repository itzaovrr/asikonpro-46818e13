import { Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import { EmptyState } from "./ProfileFeedTab";

export interface ReviewItem {
  id: string;
  rating: number | null;
  content: string;
  createdAt: string;
  productSlug?: string | null;
  productName?: string | null;
  productImage?: string | null;
}

export function ProfileReviewsTab({ reviews }: { reviews: ReviewItem[] }) {
  const navigate = useNavigate();
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<Star className="h-8 w-8" />}
        title="No reviews yet"
        hint="Reviews this profile writes on products will appear here."
        action={<Button onClick={() => navigate("/shop")}>Browse products to review</Button>}
      />
    );
  }
  const rated = reviews.filter((r) => r.rating != null) as Array<ReviewItem & { rating: number }>;
  const total = reviews.length;
  const avg = rated.length > 0 ? (rated.reduce((a, r) => a + r.rating, 0) / rated.length).toFixed(1) : "—";

  return (
    <div className="space-y-3 pt-3">
      <div className="mx-1 rounded-2xl border border-border/60 bg-card/40 p-4 grid grid-cols-2 gap-2">
        <div className="text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reviews</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-400">{avg}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg rating</p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-2xl border border-border/60 bg-card/60 p-4">
            {r.productSlug && (
              <Link
                to={`/product/${r.productSlug}`}
                className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                {r.productImage && (
                  <img src={r.productImage} alt={r.productName ?? ""} className="w-12 h-12 rounded-lg object-cover" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{r.productName}</p>
                  <p className="text-[11px] text-muted-foreground">View product →</p>
                </div>
              </Link>
            )}
            {r.rating != null && (
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={
                      s <= r.rating!
                        ? "h-4 w-4 fill-amber-400 text-amber-400"
                        : "h-4 w-4 text-muted-foreground/30"
                    }
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">{timeAgo(r.createdAt)}</span>
              </div>
            )}
            {r.rating == null && (
              <p className="text-[11px] text-muted-foreground mb-2">{timeAgo(r.createdAt)}</p>
            )}
            <p className="text-sm whitespace-pre-wrap">{r.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
