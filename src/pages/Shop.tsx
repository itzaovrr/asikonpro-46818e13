import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryCarousel } from "@/components/carousels";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";

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

  // Extended products for demo
  const allProducts = [...mockProducts, ...mockProducts, ...mockProducts];

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
        <CategoryCarousel
          categories={mockCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Products Grid - Responsive */}
        <div className="px-4 lg:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {allProducts.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Shop;
