import { Helmet } from "react-helmet-async";
import { Gift, Flame, Sparkles, GraduationCap, BookOpen, ArrowUpRight, Compass, Target, Trophy, Users, ShieldCheck, Headphones, Star, HelpCircle, Rocket, PlayCircle } from "lucide-react";
import { HowItWorks } from "@/components/home/sections/HowItWorks";
import { WhyTrust } from "@/components/home/sections/WhyTrust";
import { Testimonials } from "@/components/home/sections/Testimonials";
import { Faq } from "@/components/home/sections/Faq";
import { FinalCta } from "@/components/home/sections/FinalCta";
import { Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";

import { PostCard } from "@/components/community/PostCard";
import { HeroCarousel, ProductCarousel } from "@/components/carousels";
import { mockPosts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { MobileScroller } from "@/components/ui/mobile-scroller";
import { MentorshipHomeSection } from "@/components/mentorship/MentorshipHomeSection";
import { GreetingStrip } from "@/components/home/workspace/GreetingStrip";
import { QuickAccessGrid } from "@/components/home/workspace/QuickAccessGrid";
import { ProgressSnapshot } from "@/components/home/workspace/ProgressSnapshot";
import { ContinueLearningRow } from "@/components/home/workspace/ContinueLearningRow";
import { AiAssistantBox } from "@/components/home/workspace/AiAssistantBox";
import { ActivityFeed } from "@/components/home/workspace/ActivityFeed";
import { UpcomingCard } from "@/components/home/workspace/UpcomingCard";
import { InsightCard } from "@/components/home/workspace/InsightCard";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useHomeSections, HomeSection } from "@/hooks/useHomeSections";
import { useAuth } from "@/hooks/useAuth";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { TodayMissionCard } from "@/features/mission/TodayMissionCard";
import { TrackProgress } from "@/features/tracks/TrackProgress";
import { StreakBadge } from "@/features/progress/StreakBadge";
import { XPBar } from "@/features/progress/XPBar";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const heroSlides = [
  { id: "1", image: courseAiMl, eyebrow: "New course", title: "Learn AI with Asikon", subtitle: "Master ML, Python, and modern AI tools — taught by experts", cta: { label: "Browse Courses", href: "/shop?type=courses" }, secondaryCta: { label: "See syllabus", href: "/shop?type=courses" } },
  { id: "2", image: promptLibrary, eyebrow: "Prompt library", title: "1000+ AI Prompts", subtitle: "Boost your productivity with our curated prompt library", cta: { label: "Get the Library", href: "/prompts" } },
  { id: "3", image: coursePython, eyebrow: "Limited deal", title: "Skill-Up Friday — 50% Off", subtitle: "Limited time deals on top-rated courses and books", cta: { label: "View Deals", href: "/shop?filter=deals" } },
];

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
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", color: "from-primary/25 to-primary/5" },
  { icon: BookOpen, label: "Books", href: "/shop?type=books", color: "from-primary/20 to-primary/5" },
  { icon: Sparkles, label: "Prompts", href: "/prompts", color: "from-primary/25 to-primary/10" },
  { icon: Flame, label: "Trending", href: "/shop?filter=trending", color: "from-primary/30 to-primary/10" },
];

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
        <div key={i} className="flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_22%] xl:flex-[0_0_18%]">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

type RenderCtx = {
  sec: HomeSection;
  products: any[] | undefined;
  featuredProducts: any[] | undefined;
  productsLoading: boolean;
  featuredLoading: boolean;
  trendingItems: any[];
  newArrivalItems: any[];
  curated: any[];
};

const SECTION_RENDERERS: Record<string, (ctx: RenderCtx) => JSX.Element | null> = {
  hero: () => (
    <section>
      <div className="section-x">
        <HeroCarousel slides={heroSlides} />
      </div>
    </section>
  ),
  mentorship: () => <MentorshipHomeSection />,
  quick_actions: () => (
    <Reveal as="section" className="section-x">
      {/* Mobile: 2 compact tiles. Desktop: 2 wide cards. */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <Link
          to="/learn"
          className="group relative overflow-hidden rounded-2xl border border-primary/20 p-3 sm:p-4 pressable focus-ring"
          style={{ background: "var(--gradient-primary-soft)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)] shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[13px] sm:text-sm flex items-center gap-1 truncate">
                AI Tutor
                <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">24/7 · Bangla & English</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl glass">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[13px] sm:text-sm truncate">Daily streak</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">+30 XP today</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  ),
  quick_categories: () => (
    <section className="section-x">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {quickCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Reveal key={cat.label} delay={i * 60} variant="scale">
              <Link
                to={cat.href}
                className={`pressable focus-ring flex flex-col items-center justify-center gap-1.5 aspect-[1.1] rounded-2xl bg-gradient-to-br ${cat.color} border border-border/60 hover:border-primary/40`}
              >
                <Icon className="h-[18px] w-[18px] text-primary" />
                <span className="text-[11px] font-medium">{cat.label}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  ),
  trending: ({ sec, featuredLoading, trendingItems }) => (
    <Reveal as="section">
      {featuredLoading ? (
        <CarouselSkeleton title={sec.title_override ?? "Trending now"} />
      ) : (
        <ProductCarousel products={trendingItems} title={sec.title_override ?? "Trending now"} viewAllHref="/shop?filter=trending" />
      )}
    </Reveal>
  ),
  community: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader
        title={sec.title_override ?? "From the community"}
        viewAllHref="/community"
        viewAllLabel="View all"
      />
      <PostCard post={mockPosts[0]} />
    </Reveal>
  ),
  how_it_works: ({ sec }) => <HowItWorks title={sec.title_override ?? undefined} />,
  why_trust: ({ sec }) => <WhyTrust title={sec.title_override ?? undefined} />,
  curated: ({ sec, productsLoading, curated }) => (
    <section className="section-x">
      <SectionHeader title={sec.title_override ?? "Curated for you"} viewAllHref="/shop" />
      {productsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (<ProductCardSkeleton key={i} />))}
        </div>
      ) : (
        <MobileScroller itemWidthMobile="46%" gridCols="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" gap="gap-3 lg:gap-4">
          {curated.map((p: any) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="h-full block focus-ring rounded-2xl">
              <ProductCard product={transformProduct(p)} variant="compact" />
            </Link>
          ))}
        </MobileScroller>
      )}
    </section>
  ),
  new_arrivals: ({ sec, productsLoading, newArrivalItems }) => (
    <Reveal as="section">
      {productsLoading ? (
        <CarouselSkeleton title={sec.title_override ?? "New arrivals"} />
      ) : (
        <ProductCarousel products={newArrivalItems} title={sec.title_override ?? "New arrivals"} viewAllHref="/shop?filter=new" />
      )}
    </Reveal>
  ),
  testimonials: ({ sec }) => <Testimonials title={sec.title_override ?? undefined} />,
  faq: ({ sec }) => <Faq title={sec.title_override ?? undefined} />,
  // Home renders the slim CTA pointing to /about; admin can override title/subtitle.
  final_cta: ({ sec }) => (
    <FinalCta
      variant="slim"
      title={sec.title_override ?? undefined}
      subtitle={sec.subtitle_override ?? undefined}
    />
  ),
};

const Index = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useLearnerProfile();
  const { data: products, isLoading: productsLoading } = useProducts({ limit: 20 });
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(10);
  const { data: sections } = useHomeSections();

  const trendingItems = useMemo(() => featuredProducts?.map(transformProduct) || [], [featuredProducts]);
  const newArrivalItems = useMemo(() => products?.slice().reverse().map(transformProduct) || [], [products]);
  const curated = useMemo(() => products?.slice(0, 10) || [], [products]);

  const enabledSections = useMemo(() => (sections ?? []).filter((s) => s.enabled), [sections]);

  const heroSection = enabledSections.find((s) => s.key === "hero");
  const restSections = enabledSections.filter((s) => s.key !== "hero");

  const renderSection = (sec: HomeSection) => {
    const render = SECTION_RENDERERS[sec.key];
    if (!render) return null;
    return (
      <div key={sec.id}>
        {render({ sec, products, featuredProducts, productsLoading, featuredLoading, trendingItems, newArrivalItems, curated })}
      </div>
    );
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Asikon — AI-Powered Learning Platform</title>
        <meta name="description" content="Master AI, Python, and modern skills with expert-led courses, a 24/7 AI tutor, and a community of learners." />
      </Helmet>
      <MobilePage spacing="space-y-5 lg:space-y-10">
        {user ? (
          <>
            {/* Personal, fast — top of fold */}
            <GreetingStrip />
            {heroSection && (
              <section className="section-x">
                <HeroCarousel slides={heroSlides} />
              </section>
            )}
            <section className="section-x">
              <TodayMissionCard />
            </section>
            <QuickAccessGrid />
            <ContinueLearningRow />
            <ProgressSnapshot />
            <AiAssistantBox />
            {/* Commerce + discovery */}
            {restSections.map(renderSection)}
            {/* Lower-priority personal */}
            <ActivityFeed />
            <UpcomingCard />
            <InsightCard />
          </>
        ) : (
          <>
            {heroSection && renderSection(heroSection)}
            <QuickAccessGrid />
            {restSections.map(renderSection)}
          </>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default Index;
