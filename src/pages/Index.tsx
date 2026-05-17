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
    <section className="section-x">
      <HeroCarousel slides={heroSlides} />
    </section>
  ),
  mentorship: () => <MentorshipHomeSection />,
  quick_actions: () => (
    <Reveal as="section" className="section-x grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Link to="/learn" className="group relative overflow-hidden rounded-2xl border border-primary/20 p-4 pressable focus-ring" style={{ background: "var(--gradient-primary-soft)" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              Ask the AI Tutor
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </p>
            <p className="text-xs text-muted-foreground truncate">Bangla · English · 24/7 doubt-solver</p>
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
  ),
  quick_categories: () => (
    <section className="section-x">
      <div className="grid grid-cols-4 gap-2 lg:gap-3">
        {quickCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Reveal key={cat.label} delay={i * 60} variant="scale">
              <Link to={cat.href} className={`pressable focus-ring flex flex-col items-center justify-center gap-2 aspect-square rounded-2xl bg-gradient-to-br ${cat.color} border border-border/60 hover:border-primary/40`}>
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] sm:text-xs font-medium">{cat.label}</span>
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
        <CarouselSkeleton title={sec.title_override ?? "Trending Now"} />
      ) : (
        <ProductCarousel products={trendingItems} title={sec.title_override ?? "Trending Now"} viewAllHref="/shop?filter=trending" />
      )}
    </Reveal>
  ),
  community: ({ sec }) => (
    <Reveal as="section">
      <div className="section-x">
        <SectionHeader
          title={sec.title_override ?? "From the Community"}
          subtitle={sec.subtitle_override ?? "Real wins from learners this week"}
          viewAllHref="/community"
          viewAllLabel="View all"
        />
      </div>
      <div className="section-x">
        <PostCard post={mockPosts[0]} />
      </div>
    </Reveal>
  ),
  how_it_works: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader
        title={sec.title_override ?? "How Asikon helps you grow"}
        subtitle={sec.subtitle_override ?? "A simple 3-step path from curious to confident"}
      />
      <MobileScroller itemWidthMobile="78%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {[
          { icon: Compass, title: "1. Discover", text: "Browse curated courses, books and prompts hand-picked for your level." },
          { icon: Target, title: "2. Practice", text: "Learn by doing with the 24/7 AI tutor in Bangla and English." },
          { icon: Trophy, title: "3. Achieve", text: "Earn XP, unlock badges and ship real projects to your portfolio." },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="h-full rounded-2xl glass p-4 lg:p-5 border border-border/60 hover-lift">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)] mb-3">
                <Icon className="h-5 w-5 text-primary-foreground" />
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
      <SectionHeader
        title={sec.title_override ?? "Why learners trust Asikon"}
        subtitle={sec.subtitle_override ?? "Real value, real support, real outcomes"}
      />
      <MobileScroller itemWidthMobile="44%" gridCols="md:grid md:grid-cols-2 lg:grid-cols-4" gap="gap-3">
        {[
          { icon: ShieldCheck, title: "Verified content", text: "Every course reviewed by experts." },
          { icon: Users, title: "10K+ learners", text: "Active community across BD." },
          { icon: Headphones, title: "24/7 AI tutor", text: "Doubt-solving in your language." },
          { icon: Rocket, title: "Job-ready", text: "Projects employers actually want." },
        ].map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card p-3 lg:p-4 h-full hover-lift">
              <Icon className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold text-xs lg:text-sm">{p.title}</p>
              <p className="text-[11px] lg:text-xs text-muted-foreground mt-0.5">{p.text}</p>
            </div>
          );
        })}
      </MobileScroller>
    </Reveal>
  ),
  curated: ({ sec, productsLoading, curated }) => (
    <section className="section-x">
      <SectionHeader
        title={sec.title_override ?? "Curated for You"}
        subtitle={sec.subtitle_override ?? "Picked based on what learners like you love"}
        viewAllHref="/shop"
      />
      {productsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (<ProductCardSkeleton key={i} />))}
        </div>
      ) : (
        <MobileScroller itemWidthMobile="46%" gridCols="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" gap="gap-3 lg:gap-4">
          {curated.map((product: any) => (
            <Link key={product.id} to={`/product/${product.slug}`} className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 hover-lift focus-ring flex flex-col h-full">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <SmartImage src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                {product.is_featured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full gradient-primary text-primary-foreground shadow-sm">HOT</span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-1">ASIKON Academy</p>
                <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <Price amount={product.price} className="font-bold text-foreground" />
                    {product.original_price && (<Price amount={product.original_price} strike className="text-[11px] text-muted-foreground" />)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-amber-400">★</span>
                    <span>{product.rating || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </MobileScroller>
      )}
    </section>
  ),
  new_arrivals: ({ sec, productsLoading, newArrivalItems }) => (
    <Reveal as="section">
      {productsLoading ? (
        <CarouselSkeleton title={sec.title_override ?? "New Arrivals"} />
      ) : (
        <ProductCarousel products={newArrivalItems} title={sec.title_override ?? "New Arrivals"} viewAllHref="/shop?filter=new" />
      )}
    </Reveal>
  ),
  testimonials: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader
        title={sec.title_override ?? "Loved by learners"}
        subtitle={sec.subtitle_override ?? "Stories from the Asikon community"}
      />
      <MobileScroller itemWidthMobile="80%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {[
          { name: "Tanvir H.", role: "Python student", quote: "The AI tutor explained recursion in Bangla — finally clicked after 2 weeks of struggle." },
          { name: "Ayesha R.", role: "ML beginner", quote: "Bought one course, got a full roadmap. Landed my first freelance gig in 6 weeks." },
          { name: "Rakib M.", role: "Prompt engineer", quote: "The prompt library alone is worth 10x the price. Saves me hours every day." },
        ].map((t) => (
          <div key={t.name} className="h-full rounded-2xl glass p-4 border border-border/60 flex flex-col">
            <div className="flex gap-0.5 mb-2 text-amber-400">
              {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 flex-1">"{t.quote}"</p>
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
      <SectionHeader
        title={sec.title_override ?? "Common questions"}
        subtitle={sec.subtitle_override ?? "Quick answers before you start"}
      />
      <MobileScroller itemWidthMobile="82%" gridCols="md:grid md:grid-cols-2" gap="gap-3">
        {[
          { q: "Do I need prior coding experience?", a: "No. Most courses start from zero and ramp up gradually." },
          { q: "Is the AI tutor free?", a: "Every signed-up learner gets daily free messages plus bonus coins." },
          { q: "Can I pay with bKash / Nagad?", a: "Yes — and Cash on Delivery is available for physical books." },
          { q: "Do I get a certificate?", a: "Yes, completion certificates are issued for every paid course." },
        ].map((f) => (
          <div key={f.q} className="rounded-2xl border border-border/60 bg-card p-4 hover-lift h-full">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">{f.q}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </MobileScroller>
    </Reveal>
  ),
  final_cta: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 p-6 lg:p-8 text-center" style={{ background: "var(--gradient-primary-soft)" }}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-primary shadow-[var(--shadow-glow)] mb-3">
          <PlayCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold mb-2">{sec.title_override ?? "Start your first lesson — free"}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          {sec.subtitle_override ?? "Pick a course, ask the AI anything, and earn 100 welcome coins on signup."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="premium" size="lg"><Link to="/shop?type=courses">Browse courses</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/learn">Try the AI tutor</Link></Button>
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
