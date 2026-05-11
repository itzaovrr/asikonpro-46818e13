import { Sparkles, Heart, GraduationCap, BookOpen, Package, Wand2, LayoutGrid } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { CategoryCarousel } from "@/components/carousels";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { useProducts, SortOption } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MAX_PRICE = 500;

type ProductType = "all" | "courses" | "books" | "kits" | "prompts";

const TYPE_FILTERS: { id: ProductType; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "courses", label: "Courses", icon: GraduationCap },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "kits", label: "Kits", icon: Package },
  { id: "prompts", label: "Prompt Library", icon: Wand2 },
];

function detectProductType(name: string): ProductType {
  const n = name.toLowerCase();
  if (/\bprompt|prompts\b/.test(n)) return "prompts";
  if (/\bbook|hardcover|paperback|ebook|novel\b/.test(n)) return "books";
  if (/\bkit|bundle|stationery|notebook|essentials\b/.test(n)) return "kits";
  if (/\bcourse|masterclass|bootcamp|training|class|tutorial\b/.test(n)) return "courses";
  return "courses";
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [productType, setProductType] = useState<ProductType>("all");
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [podOnly, setPodOnly] = useState(false);

  // Sync URL params (?type=courses, ?filter=trending|new|deals) → state
  useEffect(() => {
    const type = searchParams.get("type") as ProductType | null;
    if (type && ["all", "courses", "books", "kits", "prompts"].includes(type)) {
      setProductType(type);
    }
    const filter = searchParams.get("filter");
    if (filter === "trending" || filter === "popular") setSortBy("popular");
    else if (filter === "new") setSortBy("newest");
    else if (filter === "deals") {
      setSortBy("price-asc");
      setOnSaleOnly(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTypeChange = (t: ProductType) => {
    setProductType(t);
    const next = new URLSearchParams(searchParams);
    if (t === "all") next.delete("type");
    else next.set("type", t);
    setSearchParams(next, { replace: true });
  };

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Get active category ID
  const activeCategoryId = useMemo(() => {
    if (activeCategory === "All") return undefined;
    const category = categories?.find((c) => c.name === activeCategory);
    return category?.id;
  }, [activeCategory, categories]);

  // Fetch products with all filters
  const { data: products, isLoading: productsLoading } = useProducts({
    limit: 50,
    categoryId: activeCategoryId,
    search: searchQuery || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
    sortBy,
  });

  // Apply remaining filters client-side
  const filteredProducts = useMemo(() => {
    if (!products) return products;
    return products.filter((p) => {
      if (productType !== "all" && detectProductType(p.name) !== productType) return false;
      if (minRating > 0 && (p.rating ?? 0) < minRating) return false;
      if (onSaleOnly && !(p.original_price && p.original_price > p.price)) return false;
      if (featuredOnly && !p.is_featured) return false;
      if (podOnly && !p.is_pod) return false;
      return true;
    });
  }, [products, productType, minRating, onSaleOnly, featuredOnly, podOnly]);

  // Transform categories for carousel
  const categoryItems = [
    { id: "all", name: "All", slug: "all", icon: "📚" },
    ...(categories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "📦",
    })) || []),
  ];

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) count++;
    if (productType !== "all") count++;
    if (minRating > 0) count++;
    if (onSaleOnly) count++;
    if (featuredOnly) count++;
    if (podOnly) count++;
    return count;
  }, [priceRange, productType, minRating, onSaleOnly, featuredOnly, podOnly]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, MAX_PRICE]);
    setSortBy("newest");
    setActiveCategory("All");
    setProductType("all");
    setMinRating(0);
    setOnSaleOnly(false);
    setFeaturedOnly(false);
    setPodOnly(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4 lg:space-y-6 pb-4">
        {/* Points Progress */}
        <div className="mx-4 lg:mx-0 p-3 lg:p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">2x Learning XP Active</span>
            </div>
            <span className="text-xs text-muted-foreground">Level 5</span>
          </div>
          <Progress value={65} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">On Skill-Up Fridays</p>
        </div>

        {/* Search & Filters */}
        <div className="px-4 lg:px-0">
          <ShopFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            maxPriceLimit={MAX_PRICE}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={handleClearFilters}
            productType={productType}
            onProductTypeChange={handleTypeChange}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            onSaleOnly={onSaleOnly}
            onOnSaleChange={setOnSaleOnly}
            featuredOnly={featuredOnly}
            onFeaturedChange={setFeaturedOnly}
            podOnly={podOnly}
            onPodChange={setPodOnly}
          />
        </div>

        {/* Categories Carousel */}
        {categoriesLoading ? (
          <div className="px-4 lg:px-0 flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        ) : (
          <CategoryCarousel
            categories={categoryItems}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {/* Results Count */}
        <div className="px-4 lg:px-0">
          <p className="text-sm text-muted-foreground">
            {productsLoading ? (
              <Skeleton className="h-4 w-24 inline-block" />
            ) : (
              `${filteredProducts?.length || 0} learning resources found`
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="px-4 lg:px-0">
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 card-hover"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary/30">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all"
                    >
                      <Heart className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
                    </button>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.is_pod && (
                        <Badge className="text-[10px] px-2 py-0.5 bg-accent/90 backdrop-blur-sm border-0">
                          Custom
                        </Badge>
                      )}
                      {product.is_featured && (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full gradient-primary text-primary-foreground shadow-lg">
                          🔥 Hot
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1.5">
                      StyleHub
                    </p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg">${product.price}</span>
                        {product.original_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-xs font-medium">{product.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No products found</p>
              {(searchQuery || activeFiltersCount > 0) && (
                <button
                  onClick={handleClearFilters}
                  className="text-primary hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Shop;
