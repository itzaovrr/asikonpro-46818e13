import { TrendingUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedDesigns } from "@/hooks/usePodDesigns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GalleryPanelProps {
  onSelectDesign: (url: string) => void;
}

const categories = ["All", "Minimal", "Bold", "Typography", "Anime", "Abstract", "Vintage"];

export function GalleryPanel({ onSelectDesign }: GalleryPanelProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { data: designs, isLoading } = useFeaturedDesigns(20);

  const filteredDesigns = designs?.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || d.category?.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search designs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9"
      />

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1 text-xs rounded-full border whitespace-nowrap transition-colors",
              category === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Designs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : filteredDesigns && filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {filteredDesigns.map((design) => (
            <button
              key={design.id}
              onClick={() => onSelectDesign(design.image_url)}
              className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors group"
            >
              <img
                src={design.image_url}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {design.sales_count > 10 && (
                <Badge className="absolute top-1 left-1 text-[8px] px-1 py-0 gradient-primary border-0">
                  <TrendingUp className="h-2 w-2" />
                </Badge>
              )}
              {design.profiles?.is_verified && (
                <ShieldCheck className="absolute top-1 right-1 h-3 w-3 text-primary" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No designs found
        </div>
      )}
    </div>
  );
}
