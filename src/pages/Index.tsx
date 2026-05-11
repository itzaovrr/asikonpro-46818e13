import { ChevronRight, Gift, Flame, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/community/PostCard";
import { HeroCarousel, ProductCarousel } from "@/components/carousels";
import { mockPosts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const heroSlides = [
  {
    id: "1",
    image: courseAiMl,
    title: "Learn AI with Asikon",
    subtitle: "Master ML, Python, and modern AI tools — taught by experts",
    cta: { label: "Browse Courses", href: "/shop?type=courses" },
  },
  {
    id: "2",
    image: promptLibrary,
    title: "1000+ AI Prompts",
    subtitle: "Boost your productivity with our curated prompt library",
    cta: { label: "Get the Library", href: "/shop?type=prompts" },
  },
  {
    id: "3",
    image: coursePython,
    title: "Skill-Up Friday — 50% Off",
    subtitle: "Limited time deals on top-rated courses and books",
    cta: { label: "View Deals", href: "/shop?filter=deals" },
  },
];

// Transform DB product → carousel format
const transformProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  brand: "Asikon Academy",
  price: p.price,
  originalPrice: p.original_price || undefined,
  image: p.image_url || "/placeholder.svg",
  rating: p.rating || 0,
  reviews: p.review_count || 0,
  isNew: false,
  isTrending: p.is_featured || false,
  slug: p.slug,
});

const quickCategories = [
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", color: "from-primary/20 to-primary/5" },
  { icon: BookOpen, label: "Books", href: "/shop?type=books", color: "from-accent/20 to-accent/5" },
  { icon: Sparkles, label: "Prompts", href: "/shop?type=prompts", color: "from-primary/20 to-accent/10" },
  { icon: Flame, label: "Trending", href: "/shop?filter=trending", color: "from-accent/20 to-primary/10" },
];

// Skeleton matching the real product card so card heights don't jump on load
const ProductCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border/50 flex flex-col h-full">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-3 flex flex-col flex-1 gap-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <div className="flex items-center justify-between mt-auto">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  </div>
);

const CarouselSkeleton = ({ title }: { title: string }) => (
  <div>
    <div className="flex items-center justify-between mb-3 px-4 lg:px-0">
      <h2 className="font-semibold text-lg">{title}</h2>
    </div>
    <div className="flex gap-3 overflow-hidden pl-4 lg:pl-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_22%] xl:flex-[0_0_18%]"
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

const Index = () => {
  const { data: products, isLoading: productsLoading } = useProducts({ limit: 20 });
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(10);

  const trendingItems = useMemo(
    () => featuredProducts?.map(transformProduct) || [],
    [featuredProducts]
  );
  const newArrivalItems = useMemo(
    () => products?.slice().reverse().map(transformProduct) || [],
    [products]
  );
  const curated = useMemo(() => products?.slice(0, 10) || [], [products]);

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
                <p className="font-semibold text-sm">Daily Streak Bonus</p>
                <p className="text-xs text-muted-foreground">Claim +30 XP today!</p>
              </div>
            </div>
            <Button size="sm" className="gradient-primary border-0">
              Claim
            </Button>
          </div>
        </section>

        {/* Quick Categories — uniform cards */}
        <section className="px-4 lg:px-0">
          <div className="grid grid-cols-4 gap-2 lg:gap-3">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className={`flex flex-col items-center justify-center gap-2 aspect-square rounded-xl bg-gradient-to-br ${cat.color} border border-border/50 hover:border-primary/40 transition-all`}
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trending Courses Carousel */}
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
              products={trendingItems}
              title="Trending Now"
              viewAllHref="/shop?filter=trending"
            />
          )}
        </section>

        {/* Trending in Community */}
        <section>
          <div className="flex items-center justify-between px-4 lg:px-0 mb-3">
            <h2 className="font-semibold text-lg">From the Community</h2>
            <Link to="/community" className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="px-4 lg:px-0">
            <PostCard post={mockPosts[0]} />
          </div>
        </section>

        {/* Curated For You — uniform cards */}
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
              {curated.map((product: any) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.is_featured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full gradient-primary text-foreground">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                      Asikon Academy
                    </p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
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
              products={newArrivalItems}
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
