import { Trophy, History, BookOpen, UserPlus, ChevronRight, Coins } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { mockChallenges, mockUser } from "@/lib/mock-data";
import productSneakers from "@/assets/product-sneakers.jpg";
import productBag from "@/assets/product-bag.jpg";

const quickActions = [
  { icon: Trophy, label: "Rank", color: "text-amber-400" },
  { icon: History, label: "History", color: "text-primary" },
  { icon: BookOpen, label: "Rules", color: "text-blue-400" },
  { icon: UserPlus, label: "Invite", color: "text-emerald-400" },
];

const rewards = [
  {
    id: "1",
    title: "$10 Off Next Order",
    type: "Voucher",
    coins: 1000,
    image: productBag,
  },
  {
    id: "2",
    title: "Exclusive Drop Access",
    type: "Access",
    coins: 5000,
    image: productSneakers,
  },
];

const Game = () => {
  const levelProgress = 65;

  return (
    <AppLayout>
      <div className="space-y-6 pb-4">
        {/* Page Title */}
        <div className="px-4 pt-4">
          <h1 className="text-xl font-bold">Game & Rewards Hub</h1>
        </div>

        {/* Balance Card */}
        <div className="mx-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground mb-1">TOTAL BALANCE</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold">{mockUser.coins.toLocaleString()}</span>
              <span className="text-primary font-semibold">Coins</span>
            </div>

            {/* Level */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Coins className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold">{mockUser.level} Member</span>
                  <span className="text-muted-foreground">450 XP to Platinum</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Level 14</p>
          </div>
        </div>

        {/* Quick Actions - Responsive */}
        <div className="px-4 lg:px-0">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Challenges */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Daily Challenges</h2>
            <span className="text-xs text-primary">Resets in 4h</span>
          </div>
          <div className="space-y-3">
            {mockChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                    {challenge.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{challenge.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {challenge.progress}/{challenge.total} {challenge.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={challenge.progress >= challenge.total ? "default" : "secondary"}
                  className={challenge.progress >= challenge.total ? "gradient-primary border-0" : ""}
                >
                  +{challenge.reward} Go
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Rewards */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Hot Rewards</h2>
            <button className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="relative rounded-xl overflow-hidden bg-card border border-border"
              >
                <div className="relative h-32">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm">
                    {reward.type}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1">{reward.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">
                      {reward.coins.toLocaleString()} Coins
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Game;
