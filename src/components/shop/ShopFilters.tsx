import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  GraduationCap,
  BookOpen,
  Backpack,
  Wand2,
  LayoutGrid,
  Tag,
  Flame,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

export type ProductType = "all" | "courses" | "books" | "kits" | "prompts";

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
  // New filter attributes
  productType?: ProductType;
  onProductTypeChange?: (value: ProductType) => void;
  minRating?: number; // 0 = any
  onMinRatingChange?: (value: number) => void;
  onSaleOnly?: boolean;
  onOnSaleChange?: (value: boolean) => void;
  featuredOnly?: boolean;
  onFeaturedChange?: (value: boolean) => void;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
];

const TYPE_OPTIONS: { id: ProductType; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "courses", label: "Courses", icon: GraduationCap },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "kits", label: "Kits", icon: Backpack },
  { id: "prompts", label: "Prompts", icon: Wand2 },
];

const RATING_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 4.5, label: "4.5+" },
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
  productType = "all",
  onProductTypeChange,
  minRating = 0,
  onMinRatingChange,
  onSaleOnly = false,
  onOnSaleChange,
  featuredOnly = false,
  onFeaturedChange,
}: ShopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Local draft state — only commit on Apply
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [localType, setLocalType] = useState<ProductType>(productType);
  const [localRating, setLocalRating] = useState(minRating);
  const [localSale, setLocalSale] = useState(onSaleOnly);
  const [localFeatured, setLocalFeatured] = useState(featuredOnly);

  // Re-sync drafts whenever the sheet is opened
  useEffect(() => {
    if (isOpen) {
      setLocalPriceRange(priceRange);
      setLocalType(productType);
      setLocalRating(minRating);
      setLocalSale(onSaleOnly);
      setLocalFeatured(featuredOnly);
    }
  }, [isOpen, priceRange, productType, minRating, onSaleOnly, featuredOnly]);

  const handleApply = () => {
    onPriceChange(localPriceRange);
    onProductTypeChange?.(localType);
    onMinRatingChange?.(localRating);
    onOnSaleChange?.(localSale);
    onFeaturedChange?.(localFeatured);
    setIsOpen(false);
  };

  const pricePresets: [number, number][] = [
    [0, 25],
    [25, 50],
    [50, 100],
    [100, maxPriceLimit],
  ];

  return (
    <div className="space-y-3">
      {/* Search + Sort + Filter Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[110px] sm:w-[160px] h-9 bg-secondary/50 border-border/50 flex-shrink-0">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Filters"
              className="h-9 w-9 sm:w-auto sm:px-3 sm:gap-2 bg-secondary/50 border-border/50 flex-shrink-0 relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1.5 -right-1.5 sm:static h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs gradient-primary text-foreground"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[420px] overflow-y-auto">
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

            <div className="mt-6 space-y-6 pb-8">
              {/* Product Type */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Product Type</h3>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((t) => {
                    const Icon = t.icon;
                    const active = localType === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setLocalType(t.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          active
                            ? "gradient-primary text-primary-foreground border-transparent shadow-md"
                            : "bg-card text-foreground border-border hover:border-primary/40"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Price Range</h3>
                <div className="flex flex-wrap gap-2">
                  {pricePresets.map(([lo, hi]) => {
                    const active = localPriceRange[0] === lo && localPriceRange[1] === hi;
                    return (
                      <button
                        key={`${lo}-${hi}`}
                        onClick={() => setLocalPriceRange([lo, hi])}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          active
                            ? "gradient-primary text-primary-foreground border-transparent shadow-md"
                            : "bg-card text-foreground border-border hover:border-primary/40"
                        )}
                      >
                        {hi >= maxPriceLimit ? `$${lo}+` : `$${lo} – $${hi}`}
                      </button>
                    );
                  })}
                </div>
                <div className="px-2 pt-2">
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

              {/* Minimum Rating */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Minimum Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {RATING_OPTIONS.map((r) => {
                    const active = localRating === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => setLocalRating(r.value)}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          active
                            ? "gradient-primary text-primary-foreground border-transparent shadow-md"
                            : "bg-card text-foreground border-border hover:border-primary/40"
                        )}
                      >
                        {r.value > 0 && <Star className="h-3 w-3 fill-current" />}
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">More options</h3>
                <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-3">
                  <ToggleRow
                    icon={<Tag className="h-4 w-4 text-primary" />}
                    label="On sale only"
                    description="Items with a discount"
                    checked={localSale}
                    onCheckedChange={setLocalSale}
                    id="filter-sale"
                  />
                  <ToggleRow
                    icon={<Flame className="h-4 w-4 text-primary" />}
                    label="Featured / Hot"
                    description="Highlighted picks"
                    checked={localFeatured}
                    onCheckedChange={setLocalFeatured}
                    id="filter-featured"
                  />
                </div>
              </div>

              {/* Apply Button */}
              <div className="sticky bottom-0 -mx-6 px-6 pt-2 pb-2 bg-background/95 backdrop-blur-sm border-t border-border/60">
                <Button onClick={handleApply} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {(priceRange[0] > 0 || priceRange[1] < maxPriceLimit) && (
            <FilterChip
              label={`$${priceRange[0]} – $${priceRange[1]}`}
              onClear={() => onPriceChange([0, maxPriceLimit])}
            />
          )}
          {productType !== "all" && onProductTypeChange && (
            <FilterChip
              label={TYPE_OPTIONS.find((t) => t.id === productType)?.label ?? productType}
              onClear={() => onProductTypeChange("all")}
            />
          )}
          {minRating > 0 && onMinRatingChange && (
            <FilterChip label={`${minRating}+ ★`} onClear={() => onMinRatingChange(0)} />
          )}
          {onSaleOnly && onOnSaleChange && (
            <FilterChip label="On sale" onClear={() => onOnSaleChange(false)} />
          )}
          {featuredOnly && onFeaturedChange && (
            <FilterChip label="Featured" onClear={() => onFeaturedChange(false)} />
          )}
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer flex-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium">{label}</span>
          {description && (
            <span className="text-[11px] text-muted-foreground">{description}</span>
          )}
        </span>
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 px-3 py-1">
      {label}
      <button onClick={onClear} className="ml-1 hover:text-destructive">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
