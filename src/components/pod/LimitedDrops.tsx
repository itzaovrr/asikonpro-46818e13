import { Link } from "react-router-dom";
import { ChevronRight, Clock, Flame, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface LimitedDrop {
  id: string;
  title: string;
  image_url: string;
  price: number;
  original_price?: number;
  ends_at: Date;
  stock_total: number;
  stock_remaining: number;
}

// Mock data - will be replaced with real data
const mockDrops: LimitedDrop[] = [
  {
    id: "1",
    title: "Retro Wave Collection",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    price: 24.99,
    original_price: 34.99,
    ends_at: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    stock_total: 50,
    stock_remaining: 12,
  },
  {
    id: "2",
    title: "Minimalist Series",
    image_url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=300&fit=crop",
    price: 19.99,
    ends_at: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
    stock_total: 30,
    stock_remaining: 8,
  },
];

function formatTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return "Ended";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function LimitedDrops() {
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      mockDrops.forEach(drop => {
        times[drop.id] = formatTimeRemaining(drop.ends_at);
      });
      setTimeRemaining(times);
    };
    
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  if (mockDrops.length === 0) return null;

  return (
    <section className="px-4 lg:px-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <Flame className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-lg">Limited POD Drops</h2>
        </div>
        <Link to="/pod/drops" className="text-sm text-primary flex items-center gap-1">
          See All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {mockDrops.map((drop) => (
          <DropCard 
            key={drop.id} 
            drop={drop} 
            timeRemaining={timeRemaining[drop.id] || ""} 
          />
        ))}
      </div>
    </section>
  );
}

function DropCard({ drop, timeRemaining }: { drop: LimitedDrop; timeRemaining: string }) {
  const stockPercentage = (drop.stock_remaining / drop.stock_total) * 100;
  const isLowStock = stockPercentage <= 30;
  
  return (
    <Link
      to={`/pod/drops/${drop.id}`}
      className="flex-shrink-0 w-56 rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 transition-all group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={drop.image_url}
          alt={drop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Timer badge */}
        <Badge className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm border-0 text-foreground">
          <Clock className="h-3 w-3 mr-1 text-amber-500" />
          {timeRemaining}
        </Badge>
        {/* Discount badge */}
        {drop.original_price && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground border-0">
            -{Math.round((1 - drop.price / drop.original_price) * 100)}%
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-2 line-clamp-1">{drop.title}</h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-lg">${drop.price}</span>
          {drop.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ${drop.original_price}
            </span>
          )}
        </div>
        
        {/* Stock indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className={isLowStock ? "text-amber-500 font-medium" : "text-muted-foreground"}>
              {isLowStock && <Zap className="h-3 w-3 inline mr-0.5" />}
              {drop.stock_remaining} left
            </span>
            <span className="text-muted-foreground">{drop.stock_total} total</span>
          </div>
          <Progress 
            value={stockPercentage} 
            className="h-1.5"
          />
        </div>
      </div>
    </Link>
  );
}
