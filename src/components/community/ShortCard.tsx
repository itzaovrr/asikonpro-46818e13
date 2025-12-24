import { Play, ShoppingBag } from "lucide-react";
import { Short } from "@/types/community";
import { CreatorCard } from "./CreatorCard";
import { EngagementBar } from "./EngagementBar";
import { VerifiedBuyerBadge } from "./VerifiedBuyerBadge";

interface ShortCardProps {
  short: Short;
}

export function ShortCard({ short }: ShortCardProps) {
  return (
    <article className="relative aspect-[9/16] rounded-xl overflow-hidden bg-card">
      {/* Video thumbnail */}
      <img
        src={short.thumbnailUrl}
        alt={short.description}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
          <Play className="h-6 w-6 fill-foreground ml-0.5" />
        </div>
      </div>

      {/* Verified buyer badge */}
      {short.isVerifiedBuyer && (
        <div className="absolute top-3 left-3">
          <VerifiedBuyerBadge />
        </div>
      )}

      {/* Right side engagement */}
      <div className="absolute right-3 bottom-32">
        <EngagementBar
          likes={short.likes}
          comments={short.comments}
          shares={short.shares}
          variant="vertical"
        />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        {/* Creator */}
        <CreatorCard user={short.user} variant="overlay" />

        {/* Description */}
        <p className="text-sm line-clamp-2">{short.description}</p>

        {/* Product tag */}
        {short.products && short.products.length > 0 && (
          <button className="flex items-center gap-2 px-3 py-2 bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium">
            <ShoppingBag className="h-4 w-4" />
            <span>${short.products[0].price}</span>
          </button>
        )}
      </div>
    </article>
  );
}
