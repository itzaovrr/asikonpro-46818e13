import { Search, X, TrendingUp, Clock, ArrowRight, Shirt, Star, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MobileSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const trendingSearches = [
  "Graphic T-Shirts",
  "Streetwear",
  "Bangla Pride",
  "New Arrivals",
  "Limited Edition",
];

const recentSearches = [
  "Black hoodie",
  "Oversized tee",
  "Summer collection",
];

const categoryShortcuts = [
  { icon: <Shirt className="w-4 h-4" />, label: "T-Shirts", href: "/shop?category=tshirts" },
  { icon: <Star className="w-4 h-4" />, label: "Trending", href: "/shop?category=trending" },
  { icon: <FileText className="w-4 h-4" />, label: "Reviews", href: "/community?tab=reviews" },
];

export function MobileSearchOverlay({ open, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    // TODO: Implement actual search
  };

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, posts, creators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-10 bg-secondary border-border"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7"
              onClick={() => setQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
        {/* Category Shortcuts */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            Quick Access
          </h4>
          <div className="flex gap-2">
            {categoryShortcuts.map((cat, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                onClick={() => {
                  onClose();
                  window.location.href = cat.href;
                }}
              >
                {cat.icon}
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Recent Searches
              </h4>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-auto p-0">
                Clear all
              </Button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => handleSearch(search)}
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            Trending Now
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, i) => (
              <button
                key={i}
                className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors flex items-center gap-1.5"
                onClick={() => handleSearch(search)}
              >
                {search}
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
