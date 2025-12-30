import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, ShieldCheck, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedDesigns, PodDesign } from "@/hooks/usePodDesigns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TrendingDesignsCarouselProps {
  title?: string;
  showViewAll?: boolean;
  limit?: number;
}

export function TrendingDesignsCarousel({ 
  title = "Trending Custom Designs",
  showViewAll = true,
  limit = 8 
}: TrendingDesignsCarouselProps) {
  const { data: designs, isLoading } = useFeaturedDesigns(limit);

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3 px-4 lg:px-0">
          <Skeleton className="h-6 w-48" />
          {showViewAll && <Skeleton className="h-4 w-16" />}
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 lg:px-0 pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-36">
              <Skeleton className="aspect-square rounded-xl mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!designs || designs.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-4 lg:px-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
        {showViewAll && (
          <Link to="/pod/designs" className="text-sm text-primary flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 lg:px-0 pb-2">
        {designs.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </div>
    </section>
  );
}

function DesignCard({ design }: { design: PodDesign }) {
  return (
    <Link
      to={`/pod/designs?id=${design.id}`}
      className="flex-shrink-0 w-36 group"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border/50 group-hover:border-primary/50 transition-all">
        <img
          src={design.image_url}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        {design.sales_count > 10 && (
          <Badge className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 gradient-primary border-0">
            <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
            Hot
          </Badge>
        )}
        {/* Wishlist Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent" />
        {/* Creator info */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5">
          <Avatar className="h-5 w-5 border border-background">
            <AvatarImage src={design.profiles?.avatar_url || undefined} />
            <AvatarFallback className="text-[8px]">
              {design.profiles?.username?.[0]?.toUpperCase() || "D"}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-foreground font-medium truncate">
            {design.profiles?.username || "Designer"}
          </span>
          {design.profiles?.is_verified && (
            <ShieldCheck className="h-3 w-3 text-primary flex-shrink-0" />
          )}
        </div>
      </div>
      <h3 className="font-medium text-sm mt-2 line-clamp-1 group-hover:text-primary transition-colors">
        {design.title}
      </h3>
      <p className="text-xs text-muted-foreground">
        {design.sales_count > 0 ? `${design.sales_count} sold` : "New design"}
      </p>
    </Link>
  );
}
