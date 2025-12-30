import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Palette, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Creator {
  id: string;
  username: string;
  avatar_url: string | null;
  is_verified: boolean;
  designs_count: number;
  sales_count: number;
  followers: number;
}

// Mock data for now - will be replaced with real data from DB
const mockCreators: Creator[] = [
  {
    id: "1",
    username: "DesignMaster",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    is_verified: true,
    designs_count: 45,
    sales_count: 234,
    followers: 1250,
  },
  {
    id: "2",
    username: "ArtisticSoul",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    is_verified: true,
    designs_count: 32,
    sales_count: 189,
    followers: 890,
  },
  {
    id: "3",
    username: "CreativeVibes",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    is_verified: false,
    designs_count: 28,
    sales_count: 156,
    followers: 654,
  },
];

export function CreatorSpotlight() {
  return (
    <section className="px-4 lg:px-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Palette className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-lg">Creator Spotlight</h2>
        </div>
        <Link to="/pod/designers" className="text-sm text-primary flex items-center gap-1">
          See All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {mockCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </section>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="flex-shrink-0 w-44 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={creator.avatar_url || undefined} />
            <AvatarFallback>{creator.username[0]}</AvatarFallback>
          </Avatar>
          {creator.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-sm mb-1">{creator.username}</h3>
        
        {creator.sales_count > 100 && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mb-2">
            <TrendingUp className="h-2.5 w-2.5 mr-1" />
            Top Seller
          </Badge>
        )}
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span>{creator.designs_count} designs</span>
          <span>•</span>
          <span>{creator.sales_count} sold</span>
        </div>
        
        <Button size="sm" variant="outline" className="w-full text-xs">
          View Profile
        </Button>
      </div>
    </div>
  );
}
