import { ChevronRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { PostCard } from "@/components/community/PostCard";
import { HeroCarousel, ProductCarousel, StoryCarousel } from "@/components/carousels";
import { mockProducts, mockStories, mockPosts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import heroFashion from "@/assets/hero-fashion-1.jpg";

const heroSlides = [
  {
    id: "1",
    image: heroFashion,
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in streetwear and urban fashion",
    cta: { label: "Shop Now", href: "/shop" },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
    title: "Flash Sale - Up to 50% Off",
    subtitle: "Limited time offers on premium brands",
    cta: { label: "View Deals", href: "/shop?filter=deals" },
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop",
    title: "New Arrivals Weekly",
    subtitle: "Fresh drops every Friday",
    cta: { label: "Explore", href: "/shop?filter=new" },
  },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6 lg:space-y-8 pb-4">
        {/* Hero Carousel */}
        <section className="px-4 lg:px-0">
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* Daily Check-in */}
        <section className="px-4 lg:px-0">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Gift className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Daily Check-in</p>
                <p className="text-xs text-muted-foreground">Claim +30 Coins today!</p>
              </div>
            </div>
            <Button size="sm" className="gradient-primary border-0">
              Claim
            </Button>
          </div>
        </section>

        {/* Shorts & Stories Carousel */}
        <section>
          <div className="flex items-center justify-between mb-3 px-4 lg:px-0">
            <h2 className="font-semibold text-lg">Shorts & Stories</h2>
            <button className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <StoryCarousel stories={mockStories} />
        </section>

        {/* Trending Products Carousel */}
        <section>
          <ProductCarousel 
            products={[...mockProducts, ...mockProducts]} 
            title="Trending Now" 
            viewAllHref="/shop?filter=trending"
          />
        </section>

        {/* Trending in Community */}
        <section>
          <div className="flex items-center justify-between px-4 lg:px-0 mb-3">
            <h2 className="font-semibold text-lg">Trending in Community</h2>
            <Link to="/community" className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="px-4 lg:px-0">
            <PostCard post={mockPosts[0]} />
          </div>
        </section>

        {/* Curated For You - Responsive Grid */}
        <section className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Curated for You</h2>
            <Link to="/shop" className="text-sm text-primary flex items-center gap-1">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {[...mockProducts, ...mockProducts].slice(0, 10).map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals Carousel */}
        <section>
          <ProductCarousel 
            products={[...mockProducts].reverse()} 
            title="New Arrivals" 
            viewAllHref="/shop?filter=new"
          />
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
