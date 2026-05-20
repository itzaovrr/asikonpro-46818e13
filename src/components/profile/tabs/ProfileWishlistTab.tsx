import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Price } from "@/lib/currency";
import { EmptyState } from "./ProfileFeedTab";

interface WishlistRow {
  id: string;
  product_id: string;
  products?: {
    id: string;
    slug: string;
    name: string;
    image_url: string | null;
    price: number;
  } | null;
}

export function ProfileWishlistTab({ items }: { items: WishlistRow[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="Wishlist is empty"
        hint="Tap the heart on any product to save it for later."
      />
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
      {items.map((it) =>
        it.products ? (
          <Link
            key={it.id}
            to={`/product/${it.products.slug}`}
            className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="aspect-square bg-muted">
              {it.products.image_url && (
                <img src={it.products.image_url} alt={it.products.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-2.5">
              <p className="text-sm font-medium line-clamp-1">{it.products.name}</p>
              <Price amount={it.products.price} className="text-sm font-bold text-primary" />
            </div>
          </Link>
        ) : null,
      )}
    </div>
  );
}
