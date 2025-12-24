import { Search, MoreVertical, Settings, MessageCircle, Share2, Shield, Coins, Award, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { mockUser, mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = ["Closet (24)", "Posts", "Reviews (12)", "Collections"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Closet (24)");

  return (
    <AppLayout showBottomNav={true}>
      <div>
        {/* Cover & Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-br from-primary/30 via-accent/20 to-background overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800')] bg-cover bg-center opacity-30" />
          </div>

          {/* Quick Actions on Cover */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-4">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 px-4 space-y-4">
          {/* Name & Badge */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{mockUser.name}</h1>
                {mockUser.isVerified && (
                  <span className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-xs">✓</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{mockUser.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-bold text-lg">{(mockUser.followers / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{mockUser.following}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{mockUser.sales}</p>
              <p className="text-xs text-muted-foreground">Sales</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button className="flex-1 gradient-primary border-0">
              Follow
            </Button>
            <Button variant="secondary" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="secondary" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Trust & Rewards */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Trust & Rewards</h3>
              <button className="text-xs text-primary flex items-center gap-1">
                More Details <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-medium">Trust Score</span>
                <span className="text-lg font-bold text-emerald-400">{mockUser.trustScore}%</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50">
                <Coins className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-medium">Fashion Coins</span>
                <span className="text-lg font-bold text-amber-400">{mockUser.coins.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">Level</span>
                <span className="text-lg font-bold text-primary">{mockUser.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-t border-border">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 min-w-fit px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-8">
          <div className="grid grid-cols-2 gap-3">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
