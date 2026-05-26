import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Sparkles, BookOpen, Users, ShoppingBag, Quote } from "lucide-react";

import { AppleHeroSlider } from "@/components/home/AppleHeroSlider";
import { AppleHeader } from "@/components/layout/AppleHeader";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Images
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";
import aiTutorImg from "@/assets/ai-tutor.jpg";
import bookHardcover from "@/assets/book-hardcover.jpg";
import studentKit from "@/assets/student-kit.jpg";

// Hero Slides
const heroSlides = [
  {
    id: "1",
    eyebrow: "AI-Powered Learning",
    title: "Learn smarter. Build faster.",
    subtitle: "Expert courses and a 24/7 AI tutor to accelerate your growth.",
    primaryCta: { label: "Start Learning", href: "/learn" },
    secondaryCta: { label: "Browse Catalog", href: "/shop" },
    image: courseAiMl,
    darkOverlay: true,
  },
  {
    id: "2",
    eyebrow: "Prompt Library",
    title: "1000+ AI Prompts for Productivity",
    subtitle: "Curated prompts for coding, writing, and creative work.",
    primaryCta: { label: "Get Access", href: "/prompts" },
    image: promptLibrary,
    darkOverlay: true,
  },
  {
    id: "3",
    eyebrow: "Limited Time",
    title: "Skill-Up Sale - Up to 50% Off",
    subtitle: "Top-rated courses at unbeatable prices.",
    primaryCta: { label: "View Deals", href: "/shop?filter=deals" },
    secondaryCta: { label: "See Courses", href: "/shop?type=courses" },
    image: coursePython,
    darkOverlay: true,
  },
];

// Quick Access Categories
const quickAccess = [
  { icon: Sparkles, label: "AI Tutor", desc: "24/7 help", href: "/learn", color: "bg-primary" },
  { icon: BookOpen, label: "Courses", desc: "50+ programs", href: "/shop?type=courses", color: "bg-blue-500" },
  { icon: ShoppingBag, label: "Shop", desc: "Books & tools", href: "/shop", color: "bg-green-500" },
  { icon: Users, label: "Community", desc: "Learn together", href: "/community", color: "bg-orange-500" },
];

// Testimonials
const testimonials = [
  {
    quote: "The AI tutor explained complex concepts in simple terms. I learned Python in 3 weeks!",
    author: "Rafiq Ahmed",
    role: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Best investment for my career. The courses are practical and up-to-date.",
    author: "Sarah Khan",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "The community support made learning feel less isolating. Highly recommend!",
    author: "Mohammad Ali",
    role: "ML Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

// Stats
const stats = [
  { value: "50K+", label: "Students" },
  { value: "100+", label: "Courses" },
  { value: "24/7", label: "AI Support" },
  { value: "4.9", label: "Rating" },
];

const transformProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  originalPrice: p.original_price,
  image: p.image_url || "/placeholder.svg",
  slug: p.slug,
});

// Product Card Component
function ProductCard({ product, index }: { product: any; index: number }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block min-w-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/20 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full">
            SALE
          </span>
        )}
      </div>
      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <p className="text-sm font-semibold mt-1">
        {product.price}
        {product.originalPrice > product.price && (
          <span className="ml-2 text-xs text-muted-foreground line-through">
            {product.originalPrice}
          </span>
        )}
      </p>
    </Link>
  );
}

// Horizontal Scroll Container
function HorizontalScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto scrollbar-none -mx-6 px-6 md:mx-0 md:px-0", className)}>
      <div className="flex gap-4 md:grid md:grid-cols-4 lg:grid-cols-5">
        {children}
      </div>
    </div>
  );
}

const Index = () => {
  const { data: products } = useProducts({ limit: 10 });
  const { data: featuredProducts } = useFeaturedProducts(8);
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredItems = useMemo(() => featuredProducts?.map(transformProduct) || [], [featuredProducts]);
  const newArrivals = useMemo(() => products?.slice(0, 5).map(transformProduct) || [], [products]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Asikon - AI-Powered Learning Platform</title>
        <meta
          name="description"
          content="Master AI, Python, and modern skills with expert-led courses and a 24/7 AI tutor."
        />
      </Helmet>

      {/* Header */}
      <AppleHeader cartCount={cartCount} />

      {/* Hero Slider */}
      <AppleHeroSlider slides={heroSlides} />

      {/* Quick Access - App-like Grid */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {quickAccess.map((item, i) => (
              <Link
                key={item.label}
                to={item.href}
                className="group flex flex-col items-center text-center p-3 md:p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2", item.color, "text-white")}>
                  <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden md:block">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-4 border-y border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl md:text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Horizontal Scroll on Mobile */}
      {featuredItems.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Featured</p>
                <h2 className="text-xl md:text-2xl font-display font-semibold">Top Picks for You</h2>
              </div>
              <Link to="/shop" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                See all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <HorizontalScroll>
              {featuredItems.map((product: any, i: number) => (
                <div key={product.id} className="min-w-[160px] md:min-w-0 flex-[0_0_160px] md:flex-none">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* Feature Banner - AI Tutor */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Link to="/learn" className="group block relative rounded-3xl overflow-hidden aspect-[16/7] md:aspect-[21/9]">
            <img
              src={aiTutorImg}
              alt="AI Tutor"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 max-w-lg">
              <p className="text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider mb-2">New</p>
              <h2 className="text-2xl md:text-4xl font-display font-semibold text-white mb-2">
                AI Tutor. Always On.
              </h2>
              <p className="text-sm md:text-base text-white/80 mb-4 hidden md:block">
                Get instant answers and personalized explanations, 24/7.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
                Try it free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Just In</p>
                <h2 className="text-xl md:text-2xl font-display font-semibold">New Arrivals</h2>
              </div>
              <Link to="/shop?filter=new" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <HorizontalScroll>
              {newArrivals.map((product: any, i: number) => (
                <div key={product.id} className="min-w-[160px] md:min-w-0 flex-[0_0_160px] md:flex-none">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* Feature Cards - Two Column */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link
              to="/shop?type=courses"
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9]"
            >
              <img
                src={courseAiMl}
                alt="AI & ML Courses"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-display font-semibold text-white">AI & Machine Learning</h3>
                <p className="text-sm text-white/70 hidden md:block mt-1">From fundamentals to advanced</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-white mt-3">
                  Explore courses
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              to="/prompts"
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9]"
            >
              <img
                src={promptLibrary}
                alt="Prompt Library"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-display font-semibold text-white">Prompt Library</h3>
                <p className="text-sm text-white/70 hidden md:block mt-1">1000+ AI prompts</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-white mt-3">
                  Get access
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 md:py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-xl md:text-2xl font-display font-semibold">Loved by Learners</h2>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="overflow-x-auto scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-4 md:grid md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="min-w-[280px] md:min-w-0 flex-[0_0_280px] md:flex-none bg-card rounded-2xl p-5 md:p-6 border border-border/40"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-3" />
                  <p className="text-sm md:text-base text-foreground leading-relaxed mb-4">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-display font-semibold mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of learners mastering new skills with AI-powered guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/learn">
                <Button size="lg" className="rounded-full px-8">
                  Get Started Free
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-3">
                <img src="/favicon.ico" alt="Asikon" className="w-7 h-7 rounded-lg" />
                <span className="font-display font-semibold text-lg">Asikon</span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                AI-powered learning. Master new skills with expert guidance.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Learn</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/learn" className="hover:text-foreground">AI Tutor</Link></li>
                <li><Link to="/shop?type=courses" className="hover:text-foreground">Courses</Link></li>
                <li><Link to="/prompts" className="hover:text-foreground">Prompts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Shop</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/shop" className="hover:text-foreground">All Products</Link></li>
                <li><Link to="/shop?type=books" className="hover:text-foreground">Books</Link></li>
                <li><Link to="/shop?filter=deals" className="hover:text-foreground">Deals</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                <li><Link to="/community" className="hover:text-foreground">Community</Link></li>
                <li><Link to="/mentors" className="hover:text-foreground">Mentors</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Asikon. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/settings" className="hover:text-foreground">Privacy</Link>
              <Link to="/settings" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
