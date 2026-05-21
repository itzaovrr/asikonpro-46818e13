import { useState } from "react";
import { Trophy, History, BookOpen, UserPlus, Coins, Flame, CheckCircle2, PlayCircle, Calendar, Loader2, Gift, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { MobileSection } from "@/components/ui/mobile-section";
import { MobileCard } from "@/components/ui/mobile-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/transitions/Reveal";
import { ProgressCharts } from "@/components/learning/ProgressCharts";
import { useAuth } from "@/hooks/useAuth";
import { useGameStats, useEnrolledCourses, useRedeemReward, useRewards } from "@/hooks/useGameData";
import { LeaderboardSheet } from "@/components/game/LeaderboardSheet";
import { HistorySheet } from "@/components/game/HistorySheet";
import { RulesDialog } from "@/components/game/RulesDialog";
import { toast } from "sonner";


const Game = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGameStats();
  const { data: courses = [], isLoading: coursesLoading } = useEnrolledCourses();
  const { data: rewards = [], isLoading: rewardsLoading } = useRewards();
  const redeem = useRedeemReward();
  const [showRank, setShowRank] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleInvite = async () => {
    const url = window.location.origin;
    const shareData = { title: "Asikon", text: "Learn with AI on Asikon — join me!", url };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(url); toast.success("Invite link copied!"); }
    } catch { /* user cancelled */ }
  };

  const quickActions = [
    { icon: Trophy, label: "Rank", color: "text-amber-400", onClick: () => setShowRank(true) },
    { icon: History, label: "History", color: "text-primary", onClick: () => setShowHistory(true) },
    { icon: BookOpen, label: "Rules", color: "text-blue-400", onClick: () => setShowRules(true) },
    { icon: UserPlus, label: "Invite", color: "text-emerald-400", onClick: handleInvite },
  ];


  if (loading) {
    return (
      <AppLayout>
        <MobilePage>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </MobilePage>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <MobilePage>
          <Helmet>
            <title>Game · Earn Coins & Track Streaks — Asikon</title>
          </Helmet>
          <div className="text-center py-16 space-y-4">
            <h1 className="text-2xl font-bold text-gradient">Sign in to play</h1>
            <p className="text-muted-foreground text-sm">Earn coins, build streaks, unlock rewards.</p>
            <Button onClick={() => navigate("/auth?redirect=/game")} className="gradient-primary">Sign in</Button>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  const handleRedeem = (rewardKey: string, coins: number) => {
    if ((stats?.coins ?? 0) < coins) {
      return;
    }
    redeem.mutate({ rewardKey, coins });
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Game · Earn Coins & Track Streaks — Asikon</title>
        <meta name="description" content="Track your learning streak, earn coins, and redeem rewards on Asikon." />
      </Helmet>
      <MobilePage maxWidth="wide" spacing="space-y-4 lg:space-y-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 space-y-4 lg:space-y-0">
          {/* MAIN COLUMN */}
          <div className="space-y-4 lg:space-y-8 min-w-0">
            {/* Balance Hero */}
            <div
              className="relative overflow-hidden rounded-3xl border border-primary/25 p-5 lg:p-8"
              style={{ background: "var(--gradient-primary-soft)" }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)" }}
              />
              <div className="relative">
                <p className="eyebrow-bar mb-2">Total balance</p>
                <div className="flex items-baseline gap-2 mb-5">
                  {statsLoading ? (
                    <Skeleton className="h-12 w-32" />
                  ) : (
                    <>
                      <span className="font-display text-4xl lg:text-6xl font-bold leading-none tracking-tight text-gradient">
                        {(stats?.coins ?? 0).toLocaleString()}
                      </span>
                      <span className="text-primary font-semibold text-sm lg:text-base">Coins</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-[var(--shadow-glow)]">
                    <Coins className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[13px] mb-1.5">
                      <span className="font-semibold truncate">Level {stats?.level ?? 1}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">{stats?.xp ?? 0} XP</span>
                    </div>
                    <Progress value={stats?.levelProgress ?? 0} className="h-2" />
                    <p className="text-[11px] text-muted-foreground mt-1">{stats?.xpToNextLevel ?? 0} XP to next level</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <Reveal as="section">
              <MobileSection title="My Courses" actionLabel="View all" actionHref="/learn">
                {coursesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                  </div>
                ) : courses.length === 0 ? (
                  <MobileCard variant="glass" className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">No courses started yet.</p>
                    <Button size="sm" onClick={() => navigate("/learn")} className="gradient-primary border-0">
                      Start learning
                    </Button>
                  </MobileCard>
                ) : (
                  <div className="space-y-3">
                    {courses.map((course, i) => {
                      const pct = Math.round((course.completed / course.total) * 100);
                      return (
                        <Reveal key={course.id} staggerIndex={Math.min(i, 6)}>
                          <MobileCard variant="glass" className="p-3 lg:p-4 hover-lift">
                            <div className="flex gap-3 lg:gap-4">
                              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl lg:text-3xl flex-shrink-0">
                                {course.cover ?? "📚"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm lg:text-base leading-tight truncate">{course.title}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                  <Progress value={pct} className="h-1.5 flex-1" />
                                  <span className="text-xs lg:text-sm font-semibold text-primary">{pct}%</span>
                                </div>
                                <p className="text-[11px] lg:text-xs text-muted-foreground mt-1">{course.completed} of {course.total} lessons</p>
                              </div>
                            </div>
                            {course.nextLessonTitle && (
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                                <p className="text-xs text-muted-foreground truncate flex-1 mr-2">
                                  Up next: <span className="text-foreground">{course.nextLessonTitle}</span>
                                </p>
                                <Button
                                  size="sm"
                                  className="gradient-primary border-0 h-8"
                                  onClick={() => course.nextLessonId && navigate(`/lesson/${course.nextLessonId}`)}
                                >
                                  <PlayCircle className="h-3.5 w-3.5 mr-1" />
                                  Resume
                                </Button>
                              </div>
                            )}
                          </MobileCard>
                        </Reveal>
                      );
                    })}
                  </div>
                )}
              </MobileSection>
            </Reveal>

            {/* Progress Trend Charts */}
            <Reveal as="section">
              <ProgressCharts />
            </Reveal>

            {/* Hot Rewards */}
            <Reveal as="section">
              <MobileSection title="Hot Rewards">
                {rewardsLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <Skeleton className="h-44 rounded-2xl" />
                    <Skeleton className="h-44 rounded-2xl" />
                  </div>
                ) : rewards.length === 0 ? (
                  <MobileCard variant="glass" className="p-6 text-center text-sm text-muted-foreground">No rewards available yet.</MobileCard>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                    {rewards.map((reward, i) => {
                      const canAfford = (stats?.coins ?? 0) >= reward.coins_required;
                      const isRedeeming = redeem.isPending && redeem.variables?.rewardKey === reward.id;
                      return (
                        <Reveal key={reward.id} staggerIndex={Math.min(i, 6)} variant="scale">
                          <MobileCard variant="glass" noPadding className="overflow-hidden hover-lift">
                            <div className="relative h-28 lg:h-32 bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center">
                              {reward.image_url ? (
                                <img src={reward.image_url} alt={reward.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                              ) : (
                                <Gift className="h-10 w-10 text-primary-foreground/70" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-background/80 backdrop-blur-sm capitalize">
                                {reward.type}
                              </span>
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-sm mb-1 line-clamp-1">{reward.title}</h3>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-primary font-semibold">{reward.coins_required.toLocaleString()} Coins</span>
                                <Button
                                  size="sm"
                                  variant={canAfford ? "default" : "secondary"}
                                  disabled={!canAfford || isRedeeming}
                                  onClick={() => redeem.mutate({ rewardKey: reward.id, coins: reward.coins_required })}
                                  className={canAfford ? "gradient-primary border-0 h-7 text-[11px] px-2" : "h-7 text-[11px] px-2"}
                                >
                                  {isRedeeming ? <Loader2 className="h-3 w-3 animate-spin" /> : canAfford ? "Redeem" : "Locked"}
                                </Button>
                              </div>
                            </div>
                          </MobileCard>
                        </Reveal>
                      );
                    })}
                  </div>
                )}
              </MobileSection>
            </Reveal>
          </div>

          {/* RIGHT RAIL — sticky on desktop */}
          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--app-header-h)+1.5rem)] lg:self-start">
            {/* This Week */}
            <MobileCard variant="glass" className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">This week</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-3xl font-bold">{stats?.streakDays ?? 0}</span>
                <span className="text-xs text-muted-foreground">day streak</span>
              </div>
              <div className="flex items-center justify-between gap-1 mb-4">
                {(stats?.weekActivity ?? Array.from({ length: 7 }, () => ({ day: "·", active: false }))).map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-full h-7 rounded-md flex items-center justify-center ${d.active ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                      {d.active && <Flame className="h-3 w-3" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">Lessons completed</span>
                  <span className="ml-auto font-semibold">{stats?.lessonsCompletedTotal ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Today</span>
                  <span className="ml-auto font-semibold text-primary">+{stats?.lessonsToday ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Courses</span>
                  <span className="ml-auto font-semibold">{courses.length}</span>
                </div>
              </div>
            </MobileCard>

            {/* Quick Actions */}
            <MobileCard variant="glass" className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">Quick actions</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className="rounded-xl bg-secondary/40 hover:bg-primary/10 border border-border/60 hover:border-primary/30 p-3 flex flex-col items-center gap-1.5 transition-colors focus-ring"
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-[11px] font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </MobileCard>
          </aside>
        </div>
      </MobilePage>

      {/* Floating AI Tutor button — right side */}
      <button
        type="button"
        onClick={() => navigate("/learn")}
        aria-label="Open AI Tutor"
        className="fixed right-4 bottom-24 z-40 h-14 w-14 rounded-full gradient-primary shadow-glow flex items-center justify-center active:scale-95 transition-transform"
      >
        <Wand2 className="h-6 w-6 text-primary-foreground" />
        <span className="sr-only">Ask the AI Tutor</span>
      </button>

      <LeaderboardSheet open={showRank} onOpenChange={setShowRank} />
      <HistorySheet open={showHistory} onOpenChange={setShowHistory} />
      <RulesDialog open={showRules} onOpenChange={setShowRules} />
    </AppLayout>
  );
};

export default Game;
