import { Gift, Flame, Sparkles, GraduationCap, BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import { PostCard } from "@/components/community/PostCard";
import { HeroCarousel, ProductCarousel } from "@/components/carousels";
import { mockPosts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { SmartImage } from "@/components/ui/smart-image";
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
    <div className="flex items-center justify-between mb-3 section-x">
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
      <div className="space-y-7 lg:space-y-10 pb-6">
        {/* Hero Carousel */}
        <section className="section-x">
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* AI Tutor + Daily streak — twin cards */}
        <Reveal as="section" className="section-x grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/learn"
            className="group relative overflow-hidden rounded-2xl border border-primary/20 p-4 pressable focus-ring"
            style={{ background: "var(--gradient-primary-soft)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  Ask the AI Tutor
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Bangla · English · 24/7 doubt-solver
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between p-4 rounded-2xl glass">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                <Gift className="h-5 w-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">Daily streak</p>
                <p className="text-xs text-muted-foreground">Claim +30 XP today</p>
              </div>
            </div>
            <Button size="sm" variant="premium" className="shrink-0">Claim</Button>
          </div>
        </Reveal>

        {/* Quick Categories — uniform cards */}
        <section className="section-x">
          <div className="grid grid-cols-4 gap-2 lg:gap-3">
            {quickCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal key={cat.label} delay={i * 60} variant="scale">
                  <Link
                    to={cat.href}
                    className={`pressable focus-ring flex flex-col items-center justify-center gap-2 aspect-square rounded-2xl bg-gradient-to-br ${cat.color} border border-border/60 hover:border-primary/40`}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-[11px] sm:text-xs font-medium">{cat.label}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Trending Courses Carousel */}
        <Reveal as="section">
          {featuredLoading ? (
            <CarouselSkeleton title="Trending Now" />
          ) : (
            <ProductCarousel
              products={trendingItems}
              title="Trending Now"
              viewAllHref="/shop?filter=trending"
            />
          )}
        </Reveal>

        {/* From the Community */}
        <Reveal as="section">
          <div className="section-x">
            <SectionHeader
              title="From the Community"
              subtitle="Real wins from learners this week"
              viewAllHref="/community"
              viewAllLabel="View all"
            />
          </div>
          <div className="section-x">
            <PostCard post={mockPosts[0]} />
          </div>
        </Reveal>

        {/* Curated For You — uniform cards */}
        <section className="section-x">
          <SectionHeader
            title="Curated for You"
            subtitle="Picked based on what learners like you love"
            viewAllHref="/shop"
          />
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {curated.map((product: any, i: number) => (
                <Reveal key={product.id} delay={Math.min(i, 6) * 50}>
                  <Link
                    to={`/product/${product.slug}`}
                    className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 hover-lift focus-ring flex flex-col h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <SmartImage
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                      {product.is_featured && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full gradient-primary text-primary-foreground shadow-sm">
                          HOT
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-1">
                        ASIKON Academy
                      </p>
                      <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-foreground">${product.price}</span>
                          {product.original_price && (
                            <span className="text-[11px] text-muted-foreground line-through">
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
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* New Arrivals Carousel */}
        <Reveal as="section">
          {productsLoading ? (
            <CarouselSkeleton title="New Arrivals" />
          ) : (
            <ProductCarousel
              products={newArrivalItems}
              title="New Arrivals"
              viewAllHref="/shop?filter=new"
            />
          )}
        </Reveal>

        {/* Mission & Vision */}
        <Reveal as="section" className="section-x">
          <SectionHeader
            eyebrow="Why ASIKON"
            title="Built for every Bangladeshi learner"
            subtitle="Simple, smart, and accessible — by design."
          />
          <MissionVision />
        </Reveal>
      </div>
    </AppLayout>
  );
};

export default Index;
