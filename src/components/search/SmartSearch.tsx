import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SmartSearchProps {
  className?: string;
}

const trendingSearches = [
  "Graphic T-Shirts",
  "Streetwear",
  "Bangla Pride",
  "New Arrivals",
];

const recentSearches = [
  "Black hoodie",
  "Oversized tee",
];

export function SmartSearch({ className }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown = isFocused && query.length === 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, community, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-10 h-10 bg-secondary border-border focus:border-primary"
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

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Recent
              </h4>
              <div className="space-y-1">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-foreground hover:bg-secondary rounded transition-colors"
                    onClick={() => setQuery(search)}
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Trending
            </h4>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search, i) => (
                <button
                  key={i}
                  className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors flex items-center gap-1"
                  onClick={() => setQuery(search)}
                >
                  {search}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
