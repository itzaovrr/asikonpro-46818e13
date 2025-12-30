import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, ShieldCheck, Truck, Star, Palette, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PodHeroBannerProps {
  variant?: "full" | "compact";
}

export function PodHeroBanner({ variant = "compact" }: PodHeroBannerProps) {
  if (variant === "full") {
    return (
      <section className="px-4 lg:px-0">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-primary/20">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-accent blur-2xl" />
          </div>
          
          <div className="relative z-10 p-6 lg:p-8">
            <Badge className="mb-4 gradient-primary border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Create Your Own
            </Badge>
            
            <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-gradient">
              Design Your Own T-Shirt in Minutes
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg">
              Upload artwork or choose from our community designs. Premium quality printing, 
              delivered to your door.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                <span>5-7 Days Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-amber-400" />
                <span>4.8/5 Reviews</span>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gradient-primary border-0">
                <Link to="/pod/designs">
                  <Palette className="h-4 w-4 mr-2" />
                  Browse Designs
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/pod/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your Own
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-0">
      <Link 
        to="/pod"
        className="block relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/20 p-4 hover:border-primary/40 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <span className="text-2xl">👕</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">Design Your Own T-Shirt</p>
            <p className="text-sm text-muted-foreground truncate">
              Upload artwork or browse designs • Print-on-Demand
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </section>
  );
}
