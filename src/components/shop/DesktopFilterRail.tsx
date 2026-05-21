import { useState } from "react";
import { Star, Tag, Flame, X, GraduationCap, BookOpen, Backpack, Wand2, LayoutGrid } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductType } from "./ShopFilters";

interface DesktopFilterRailProps {
  priceRange: [number, number];
  onPriceChange: (v: [number, number]) => void;
  maxPriceLimit: number;
  productType: ProductType;
  onProductTypeChange: (v: ProductType) => void;
  minRating: number;
  onMinRatingChange: (v: number) => void;
  onSaleOnly: boolean;
  onOnSaleChange: (v: boolean) => void;
  featuredOnly: boolean;
  onFeaturedChange: (v: boolean) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

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

/**
 * Persistent left filter rail for desktop. Hidden on `<lg`.
 * Shares state with the mobile <ShopFilters /> sheet.
 */
export function DesktopFilterRail(props: DesktopFilterRailProps) {
  const {
    priceRange,
    onPriceChange,
    maxPriceLimit,
    productType,
    onProductTypeChange,
    minRating,
    onMinRatingChange,
    onSaleOnly,
    onOnSaleChange,
    featuredOnly,
    onFeaturedChange,
    activeFiltersCount,
    onClearFilters,
  } = props;

  const [localPrice, setLocalPrice] = useState(priceRange);

  return (
    <aside className="hidden lg:block">
      <div className="glass rounded-2xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow-bar mb-1">Refine</p>
            <h3 className="font-display text-lg font-semibold">Filters</h3>
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear
            </Button>
          )}
        </div>

        {/* Type */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Type
          </h4>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((t) => {
              const Icon = t.icon;
              const active = productType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onProductTypeChange(t.id)}
                  className={cn(
                    "pressable flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    active
                      ? "gradient-primary text-primary-foreground border-transparent shadow-md"
                      : "bg-card/60 text-foreground border-border hover:border-primary/40",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Price
          </h4>
          <div className="px-1">
            <Slider
              value={localPrice}
              onValueChange={(v) => setLocalPrice(v as [number, number])}
              onValueCommit={(v) => onPriceChange(v as [number, number])}
              min={0}
              max={maxPriceLimit}
              step={5}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
              <span>${localPrice[0]}</span>
              <span>${localPrice[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Rating
          </h4>
          <div className="flex flex-wrap gap-2">
            {RATING_OPTIONS.map((r) => {
              const active = minRating === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => onMinRatingChange(r.value)}
                  className={cn(
                    "pressable flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    active
                      ? "gradient-primary text-primary-foreground border-transparent shadow-md"
                      : "bg-card/60 text-foreground border-border hover:border-primary/40",
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
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            More
          </h4>
          <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-3">
            <Row id="d-sale" icon={<Tag className="h-4 w-4 text-primary" />} label="On sale" checked={onSaleOnly} onChange={onOnSaleChange} />
            <Row id="d-featured" icon={<Flame className="h-4 w-4 text-primary" />} label="Featured" checked={featuredOnly} onChange={onFeaturedChange} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function Row({ id, icon, label, checked, onChange }: { id: string; icon: React.ReactNode; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer flex-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
