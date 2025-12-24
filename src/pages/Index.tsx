import { ChevronRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { StoryCircle } from "@/components/home/StoryCircle";
import { ProductCard } from "@/components/shop/ProductCard";
import { PostCard } from "@/components/community/PostCard";
import { mockProducts, mockStories, mockPosts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6 pb-4">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Daily Check-in */}
        <div className="mx-4">
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
        </div>

        {/* Shorts & Stories */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Shorts & Stories</h2>
            <button className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {mockStories.map((story, index) => (
              <StoryCircle key={story.id} story={story} isFirst={index === 0} />
            ))}
          </div>
        </section>

        {/* Trending in Community */}
        <section>
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-semibold">Trending in Community</h2>
            <Link to="/community" className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <PostCard post={mockPosts[0]} />
        </section>

        {/* Curated For You */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Curated for You</h2>
            <Link to="/shop" className="text-sm text-primary flex items-center gap-1">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
