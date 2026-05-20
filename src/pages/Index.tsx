import { Gift, Flame, Sparkles, GraduationCap, BookOpen, ArrowUpRight, Compass, Target, Trophy, Users, ShieldCheck, Headphones, Star, HelpCircle, Rocket, PlayCircle } from "lucide-react";
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
import { Price } from "@/lib/currency";
import { Reveal } from "@/components/transitions/Reveal";
import { SmartImage } from "@/components/ui/smart-image";
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
  { id: "1", image: courseAiMl, title: "Learn AI with Asikon", subtitle: "Master ML, Python, and modern AI tools — taught by experts", cta: { label: "Browse Courses", href: "/shop?type=courses" } },
  { id: "2", image: promptLibrary, title: "1000+ AI Prompts", subtitle: "Boost your productivity with our curated prompt library", cta: { label: "Get the Library", href: "/prompts" } },
  { id: "3", image: coursePython, title: "Skill-Up Friday — 50% Off", subtitle: "Limited time deals on top-rated courses and books", cta: { label: "View Deals", href: "/shop?filter=deals" } },
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
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", color: "from-primary/20 to-primary/5" },
  { icon: BookOpen, label: "Books", href: "/shop?type=books", color: "from-accent/20 to-accent/5" },
  { icon: Sparkles, label: "Prompts", href: "/prompts", color: "from-primary/20 to-accent/10" },
  { icon: Flame, label: "Trending", href: "/shop?filter=trending", color: "from-accent/20 to-primary/10" },
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
      {/* Trust ribbon — sits flush under hero on mobile, scannable in one glance */}
      <div className="section-x mt-3">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-3 py-2.5">
          {[
            { icon: ShieldCheck, label: "Verified content" },
            { icon: Users, label: "10K+ learners" },
            { icon: Headphones, label: "24/7 tutor" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 min-w-0">
              <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-[11px] sm:text-xs font-medium text-foreground/85 truncate">
                {label}
              </span>
            </div>
          ))}
        </div>
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
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-500/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
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
  how_it_works: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader title={sec.title_override ?? "How it works"} />
      <MobileScroller itemWidthMobile="72%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {[
          { icon: Compass, title: "Discover", text: "Courses, books & prompts for your level." },
          { icon: Target, title: "Practice", text: "Learn with the 24/7 AI tutor." },
          { icon: Trophy, title: "Achieve", text: "Earn XP, badges, ship projects." },
        ].map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="h-full rounded-2xl glass p-4 border border-border/60 hover-lift">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="eyebrow text-primary/80">Step {i + 1}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          );
        })}
      </MobileScroller>
    </Reveal>
  ),
  why_trust: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader title={sec.title_override ?? "Why learners trust us"} />
      {/* 2x2 on mobile — more scannable than scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { icon: ShieldCheck, title: "Verified content", text: "Reviewed by experts." },
          { icon: Users, title: "10K+ learners", text: "Active across BD." },
          { icon: Headphones, title: "24/7 AI tutor", text: "Your language." },
          { icon: Rocket, title: "Job-ready", text: "Real-world projects." },
        ].map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card p-3 hover-lift">
              <Icon className="h-4 w-4 text-primary mb-1.5" />
              <p className="font-semibold text-[13px] leading-tight">{p.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{p.text}</p>
            </div>
          );
        })}
      </div>
    </Reveal>
  ),
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
  testimonials: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader title={sec.title_override ?? "Loved by learners"} />
      <MobileScroller itemWidthMobile="78%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {[
          { name: "Tanvir H.", role: "Python student", quote: "AI tutor explained recursion in Bangla — finally clicked." },
          { name: "Ayesha R.", role: "ML beginner", quote: "Landed my first freelance gig in 6 weeks." },
          { name: "Rakib M.", role: "Prompt engineer", quote: "Prompt library saves me hours every day." },
        ].map((t) => (
          <div key={t.name} className="h-full rounded-2xl glass p-4 border border-border/60 flex flex-col">
            <div className="flex gap-0.5 mb-2 text-amber-400">
              {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-3 w-3 fill-current" />)}
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/90 flex-1">"{t.quote}"</p>
            <div className="mt-3 pt-3 border-t border-border/40">
              <p className="font-semibold text-xs">{t.name}</p>
              <p className="text-[11px] text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </MobileScroller>
    </Reveal>
  ),
  faq: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader title={sec.title_override ?? "Common questions"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {[
          { q: "Need prior experience?", a: "No — most courses start from zero." },
          { q: "Is the AI tutor free?", a: "Daily free messages + welcome coins." },
          { q: "bKash / Nagad?", a: "Yes — plus COD on physical books." },
          { q: "Certificates?", a: "Yes, for every paid course." },
        ].map((f) => (
          <div key={f.q} className="rounded-2xl border border-border/60 bg-card p-3.5">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-[13px] leading-tight">{f.q}</p>
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  ),
  final_cta: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <div
        className="relative overflow-hidden rounded-3xl border border-primary/30 p-5 sm:p-7 text-center"
        style={{ background: "var(--gradient-primary-soft)" }}
      >
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl gradient-primary shadow-[var(--shadow-glow)] mb-3">
          <PlayCircle className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="font-display text-lg sm:text-2xl font-bold mb-1.5 tracking-tight">
          {sec.title_override ?? "Start your first lesson — free"}
        </h3>
        <p className="text-[13px] sm:text-sm text-muted-foreground max-w-md mx-auto mb-4">
          {sec.subtitle_override ?? "Pick a course, ask the AI, earn 100 welcome coins."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="premium" size="lg"><Link to="/shop?type=courses">Browse courses</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/learn">Try AI tutor</Link></Button>
        </div>
      </div>
    </Reveal>
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
      <MobilePage spacing="space-y-5 lg:space-y-10">
        {heroSection && renderSection(heroSection)}

        {user ? (
          <>
            <GreetingStrip />
            <section className="section-x">
              <TodayMissionCard />
            </section>
            <QuickAccessGrid />
            <ProgressSnapshot />
            <ContinueLearningRow />
            <AiAssistantBox />
            <ActivityFeed />
            <UpcomingCard />
            <InsightCard />
          </>
        ) : null}

        {restSections.map(renderSection)}
      </MobilePage>
    </AppLayout>
  );
};

export default Index;
