import { Trophy, History, BookOpen, UserPlus, ChevronRight, Coins, Flame, CheckCircle2, PlayCircle, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { MobileSection } from "@/components/ui/mobile-section";
import { MobileCard } from "@/components/ui/mobile-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { mockChallenges, mockUser } from "@/lib/mock-data";
import coursePython from "@/assets/course-python.jpg";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import { ProgressCharts } from "@/components/learning/ProgressCharts";

const quickActions = [
  { icon: Trophy, label: "Rank", color: "text-amber-400" },
  { icon: History, label: "History", color: "text-primary" },
  { icon: BookOpen, label: "Rules", color: "text-blue-400" },
  { icon: UserPlus, label: "Invite", color: "text-emerald-400" },
];

const rewards = [
  { id: "1", title: "$10 Off Next Course", type: "Voucher", coins: 1000, image: courseAiMl },
  { id: "2", title: "1-on-1 AI Tutor Session", type: "Access", coins: 5000, image: coursePython },
];

const enrolledCourses = [
  { id: "c1", title: "AI & Machine Learning Masterclass", instructor: "Dr. Aisha Khan", cover: courseAiMl, completed: 18, total: 32, nextLesson: "Lesson 19 · Neural Networks Intro" },
  { id: "c2", title: "Complete Python for Data Science", instructor: "Marcus Lee", cover: coursePython, completed: 9, total: 24, nextLesson: "Lesson 10 · Pandas DataFrames" },
];

const weekActivity = [
  { day: "M", active: true }, { day: "T", active: true }, { day: "W", active: true },
  { day: "T", active: true }, { day: "F", active: false }, { day: "S", active: true }, { day: "S", active: true },
];

const Game = () => {
  const levelProgress = 65;
  const currentStreak = 12;
  const longestStreak = 28;
  const lessonsToday = 3;
  const totalLessonsCompleted = enrolledCourses.reduce((sum, c) => sum + c.completed, 0);

  return (
    <AppLayout>
      <MobilePage>
        {/* Balance Card */}
        <MobileCard variant="glass" className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[34px] font-bold leading-none tracking-tight">{mockUser.coins.toLocaleString()}</span>
            <span className="text-primary font-semibold text-sm">Coins</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <Coins className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="font-semibold truncate">{mockUser.level} Learner · Level 14</span>
                <span className="text-muted-foreground shrink-0 ml-2">450 XP</span>
              </div>
              <Progress value={levelProgress} className="h-1.5" />
            </div>
          </div>
        </MobileCard>

        {/* Streak + Stats */}
        <MobileSection title="This Week">
          <div className="grid grid-cols-2 gap-3">
            <MobileCard variant="glass">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Streak</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-2xl font-bold">{currentStreak}</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {weekActivity.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-full h-6 rounded-md flex items-center justify-center ${d.active ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                      {d.active && <Flame className="h-3 w-3" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Longest: {longestStreak} days</p>
            </MobileCard>

            <MobileCard variant="glass">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-2xl font-bold">{totalLessonsCompleted}</span>
                <span className="text-xs text-muted-foreground">lessons</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Today</span>
                  <span className="ml-auto font-semibold text-primary">+{lessonsToday}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Courses</span>
                  <span className="ml-auto font-semibold">{enrolledCourses.length}</span>
                </div>
              </div>
            </MobileCard>
          </div>
        </MobileSection>

        {/* Course Progress */}
        <MobileSection title="My Courses" actionLabel="View all" actionHref="/learn">
          <div className="space-y-3">
            {enrolledCourses.map((course, i) => {
              const pct = Math.round((course.completed / course.total) * 100);
              return (
                <MobileCard key={course.id} variant="glass" animateIn index={i} className="p-3">
                  <div className="flex gap-3">
                    <img src={course.cover} alt={course.title} loading="lazy" decoding="async" width={64} height={64} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight truncate">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{course.instructor}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold text-primary">{pct}%</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{course.completed} of {course.total} lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                    <p className="text-xs text-muted-foreground truncate flex-1 mr-2">
                      Up next: <span className="text-foreground">{course.nextLesson}</span>
                    </p>
                    <Button size="sm" className="gradient-primary border-0 h-8">
                      <PlayCircle className="h-3.5 w-3.5 mr-1" />
                      Resume
                    </Button>
                  </div>
                </MobileCard>
              );
            })}
          </div>
        </MobileSection>

        {/* Progress Trend Charts */}
        <ProgressCharts />

        {/* Quick Actions */}
        <MobileSection title="Quick Actions">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <MobileCard key={action.label} variant="soft" className="p-3 flex flex-col items-center gap-2 cursor-pointer">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-[11px] font-medium">{action.label}</span>
              </MobileCard>
            ))}
          </div>
        </MobileSection>

        {/* Daily Challenges */}
        <MobileSection title="Daily Challenges" subtitle="Resets in 4h">
          <div className="space-y-3">
            {mockChallenges.map((challenge, i) => (
              <MobileCard key={challenge.id} variant="glass" animateIn index={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl shrink-0">
                    {challenge.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{challenge.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {challenge.progress}/{challenge.total} {challenge.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={challenge.progress >= challenge.total ? "default" : "secondary"}
                  className={challenge.progress >= challenge.total ? "gradient-primary border-0 shrink-0" : "shrink-0"}
                >
                  +{challenge.reward}
                </Button>
              </MobileCard>
            ))}
          </div>
        </MobileSection>

        {/* Hot Rewards */}
        <MobileSection title="Hot Rewards" actionLabel="View all">
          <div className="grid grid-cols-2 gap-3">
            {rewards.map((reward, i) => (
              <MobileCard key={reward.id} variant="glass" animateIn index={i} noPadding className="overflow-hidden">
                <div className="relative h-28">
                  <img src={reward.image} alt={reward.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-background/80 backdrop-blur-sm">
                    {reward.type}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{reward.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">{reward.coins.toLocaleString()} Coins</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileSection>
      </MobilePage>
    </AppLayout>
  );
};

export default Game;
