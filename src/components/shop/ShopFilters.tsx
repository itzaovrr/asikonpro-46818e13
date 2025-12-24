import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { SortOption } from "@/hooks/useProducts";

interface ShopFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  maxPriceLimit: number;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

export function ShopFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceChange,
  maxPriceLimit,
  activeFiltersCount,
  onClearFilters,
}: ShopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceApply = () => {
    onPriceChange(localPriceRange);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Sort & Filter Row */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[160px] h-9 bg-secondary/50 border-border/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters Sheet (Mobile-friendly) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 bg-secondary/50 border-border/50">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs gradient-primary text-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={onClearFilters}>
                    Clear all
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="font-medium">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={localPriceRange}
                    onValueChange={(v) => setLocalPriceRange(v as [number, number])}
                    min={0}
                    max={maxPriceLimit}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span>${localPriceRange[0]}</span>
                    <span>${localPriceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <Button onClick={handlePriceApply} className="w-full">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {(priceRange[0] > 0 || priceRange[1] < maxPriceLimit) && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1 px-3 py-1">
            ${priceRange[0]} - ${priceRange[1]}
            <button
              onClick={() => onPriceChange([0, maxPriceLimit])}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}
