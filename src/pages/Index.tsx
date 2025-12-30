import { ChevronRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/community/PostCard";
import { HeroCarousel, ProductCarousel, StoryCarousel } from "@/components/carousels";
import { mockStories, mockPosts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { 
  PodHeroBanner, 
  TrendingDesignsCarousel, 
  CreatorSpotlight, 
  LimitedDrops 
} from "@/components/pod";
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

// Transform database product to carousel product format
const transformProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  brand: "StyleHub",
  price: p.price,
  originalPrice: p.original_price || undefined,
  image: p.image_url || "/placeholder.svg",
  rating: p.rating || 0,
  reviews: p.review_count || 0,
  isNew: false,
  isTrending: p.is_featured || false,
  slug: p.slug,
});

const Index = () => {
  const { data: products, isLoading: productsLoading } = useProducts({ limit: 20 });
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(10);

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

        {/* POD Hero Banner */}
        <PodHeroBanner variant="full" />

        {/* Trending Custom Designs */}
        <TrendingDesignsCarousel />

        {/* Limited POD Drops */}
        <LimitedDrops />

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
          {featuredLoading ? (
            <div className="px-4 lg:px-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-40">
                    <Skeleton className="aspect-square rounded-xl mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ProductCarousel
              products={featuredProducts?.map(transformProduct) || []}
              title="Trending Now"
              viewAllHref="/shop?filter=trending"
            />
          )}
        </section>

        {/* Creator Spotlight */}
        <CreatorSpotlight />

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
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-square rounded-xl mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {products?.slice(0, 10).map((product) => (
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
          )}
        </section>

        {/* New Arrivals Carousel */}
        <section>
          {productsLoading ? (
            <div className="px-4 lg:px-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-40">
                    <Skeleton className="aspect-square rounded-xl mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ProductCarousel
              products={products?.slice().reverse().map(transformProduct) || []}
              title="New Arrivals"
              viewAllHref="/shop?filter=new"
            />
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
