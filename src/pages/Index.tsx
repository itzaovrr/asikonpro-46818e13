import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Sparkles, BookOpen, Users, ShoppingBag } from "lucide-react";

import {
  AppleHeroSection,
  AppleProductCard,
  AppleFeatureCard,
  AppleTextShowcase,
  AppleSectionDivider,
} from "@/components/home/AppleHeroSection";
import { AppleHeader } from "@/components/layout/AppleHeader";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Reveal } from "@/components/transitions/Reveal";
import { HowItWorks } from "@/components/home/sections/HowItWorks";
import { WhyTrust } from "@/components/home/sections/WhyTrust";
import { Testimonials } from "@/components/home/sections/Testimonials";
import { FinalCta } from "@/components/home/sections/FinalCta";

// Hero images
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";
import aiTutorImg from "@/assets/ai-tutor.jpg";

const transformProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  originalPrice: p.original_price,
  image: p.image_url || "/placeholder.svg",
  slug: p.slug,
});

const Index = () => {
  const { user } = useAuth();
  const { data: products } = useProducts({ limit: 12 });
  const { data: featuredProducts } = useFeaturedProducts(6);
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredItems = useMemo(() => featuredProducts?.map(transformProduct) || [], [featuredProducts]);
  const newArrivals = useMemo(() => products?.slice(0, 6).map(transformProduct) || [], [products]);

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

      {/* Apple-style Header */}
      <AppleHeader cartCount={cartCount} />

      {/* Hero Section */}
      <AppleHeroSection
        eyebrow="AI-Powered Learning"
        title="Learn smarter. Build faster."
        subtitle="Expert-led courses, a 24/7 AI tutor, and a community of learners. All in one platform."
        primaryCta={{ label: "Start Learning", href: "/learn" }}
        secondaryCta={{ label: "Browse Catalog", href: "/shop" }}
        size="large"
        gradient="bg-gradient-to-br from-background via-background to-primary/5"
      />

      {/* Quick Access */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Sparkles, label: "AI Tutor", desc: "24/7 assistance", href: "/learn" },
              { icon: BookOpen, label: "Courses", desc: "50+ programs", href: "/shop?type=courses" },
              { icon: ShoppingBag, label: "Shop", desc: "Books & tools", href: "/shop" },
              { icon: Users, label: "Community", desc: "Learn together", href: "/community" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 100}>
                <Link
                  to={item.href}
                  className="group block p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                >
                  <item.icon className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold text-base">{item.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AppleSectionDivider />

      {/* Featured Products */}
      {featuredItems.length > 0 && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Reveal>
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div>
                  <p className="eyebrow mb-2">Featured</p>
                  <h2 className="display-2">Top picks for you</h2>
                </div>
                <Link to="/shop" className="link-chevron text-sm font-medium hidden sm:flex">
                  See all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredItems.slice(0, 6).map((product: any, i) => (
                <Reveal key={product.id} delay={i * 100 + 200}>
                  <AppleProductCard
                    title={product.name}
                    subtitle={product.description}
                    price={`${product.price}`}
                    image={product.image}
                    href={`/product/${product.slug}`}
                  />
                </Reveal>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link to="/shop" className="link-chevron text-sm font-medium">
                See all products
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Feature Showcase - AI Tutor */}
      <AppleTextShowcase
        eyebrow="AI Tutor"
        title="Your personal learning assistant"
        description="Get instant answers, personalized explanations, and guidance 24/7. Our AI tutor adapts to your learning style and pace."
        image={aiTutorImg}
        imagePosition="right"
        features={[
          { title: "Multilingual Support", description: "Learn in English or Bangla with seamless language switching." },
          { title: "Context-Aware", description: "The AI understands your progress and tailors explanations to your level." },
          { title: "Instant Feedback", description: "Get real-time help with exercises and projects." },
        ]}
      />

      {/* Full-width Feature Cards */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <Reveal>
              <AppleFeatureCard
                title="Master AI & Machine Learning"
                description="From fundamentals to advanced neural networks. Learn at your own pace."
                image={courseAiMl}
                href="/shop?type=courses"
              />
            </Reveal>
            <Reveal delay={150}>
              <AppleFeatureCard
                title="Python for Everyone"
                description="Start from zero or level up your skills with project-based learning."
                image={coursePython}
                href="/shop?type=courses"
                layout="wide"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <AppleSectionDivider />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* Why Trust Us */}
      <WhyTrust />

      {/* Final CTA */}
      <FinalCta />

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <img src="/favicon.ico" alt="Asikon" className="w-8 h-8 rounded-lg" />
                <span className="font-display font-semibold text-lg">Asikon</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered learning platform. Master new skills with expert guidance.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Learn</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/learn" className="hover:text-foreground transition-colors">AI Tutor</Link></li>
                <li><Link to="/shop?type=courses" className="hover:text-foreground transition-colors">Courses</Link></li>
                <li><Link to="/prompts" className="hover:text-foreground transition-colors">Prompt Library</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
                <li><Link to="/shop?type=courses" className="hover:text-foreground transition-colors">Courses</Link></li>
                <li><Link to="/shop?type=books" className="hover:text-foreground transition-colors">Books</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/community" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link to="/mentors" className="hover:text-foreground transition-colors">Mentors</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Asikon. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link to="/settings" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/settings" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
