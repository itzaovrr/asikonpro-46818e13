import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { CategoryCarousel } from "@/components/carousels";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const brands = [
  { id: "featured", name: "Featured", icon: "✨" },
  { id: "nike", name: "Nike", icon: "👟" },
  { id: "adidas", name: "Adidas", icon: "🔥" },
  { id: "gucci", name: "Gucci", icon: "💎" },
  { id: "zara", name: "Zara", icon: "👗" },
  { id: "puma", name: "Puma", icon: "🐆" },
  { id: "reebok", name: "Reebok", icon: "⚡" },
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("featured");

  const { data: products, isLoading: productsLoading } = useProducts({ limit: 30 });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Transform categories for carousel
  const categoryItems = [
    { id: "all", name: "All", slug: "all", icon: "🛍️" },
    ...(categories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "📦",
    })) || []),
  ];

  // Filter products by category
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products?.filter((p) => {
        const category = categories?.find((c) => c.name === activeCategory);
        return category ? p.category_id === category.id : true;
      });

  return (
    <AppLayout>
      <div className="space-y-4 lg:space-y-6 pb-4">
        {/* Points Progress */}
        <div className="mx-4 lg:mx-0 mt-4 p-3 lg:p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">2x Points Active</span>
            </div>
            <span className="text-xs text-muted-foreground">Level 5</span>
          </div>
          <Progress value={65} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">On Streetwear Fridays</p>
        </div>

        {/* Brands Carousel */}
        <div className="px-4 lg:px-0">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.id)}
                className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${
                  activeBrand === brand.id ? "opacity-100" : "opacity-60"
                }`}
              >
                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-2xl ${
                  activeBrand === brand.id
                    ? "gradient-primary"
                    : "bg-secondary border border-border"
                }`}>
                  {brand.icon}
                </div>
                <span className="text-xs">{brand.name}</span>
              </button>
            ))}
          </div>
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

        {/* Products Grid - Responsive */}
        <div className="px-4 lg:px-0">
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    >
                      <Heart className="h-4 w-4 text-foreground" />
                    </button>
                    {product.is_featured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full gradient-primary text-foreground">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      StyleHub
                    </p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">${product.price}</span>
                        {product.original_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="text-amber-400">★</span>
                        <span>{product.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No products found</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Shop;
