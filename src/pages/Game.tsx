import { Trophy, History, BookOpen, UserPlus, ChevronRight, Coins, Flame, CheckCircle2, PlayCircle, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
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
  {
    id: "1",
    title: "$10 Off Next Course",
    type: "Voucher",
    coins: 1000,
    image: courseAiMl,
  },
  {
    id: "2",
    title: "1-on-1 AI Tutor Session",
    type: "Access",
    coins: 5000,
    image: coursePython,
  },
];

const enrolledCourses = [
  {
    id: "c1",
    title: "AI & Machine Learning Masterclass",
    instructor: "Dr. Aisha Khan",
    cover: courseAiMl,
    completed: 18,
    total: 32,
    nextLesson: "Lesson 19 · Neural Networks Intro",
  },
  {
    id: "c2",
    title: "Complete Python for Data Science",
    instructor: "Marcus Lee",
    cover: coursePython,
    completed: 9,
    total: 24,
    nextLesson: "Lesson 10 · Pandas DataFrames",
  },
];

// Last 7 days study activity (true = studied)
const weekActivity = [
  { day: "M", active: true },
  { day: "T", active: true },
  { day: "W", active: true },
  { day: "T", active: true },
  { day: "F", active: false },
  { day: "S", active: true },
  { day: "S", active: true },
];

const Game = () => {
  const levelProgress = 65;
  const currentStreak = 12;
  const longestStreak = 28;
  const lessonsToday = 3;
  const totalLessonsCompleted = enrolledCourses.reduce((sum, c) => sum + c.completed, 0);

  return (
    <AppLayout>
      <div className="space-y-6 pb-4">
        {/* Page Title */}
        <div className="px-4 pt-4">
          <h1 className="text-xl font-bold">Learning Hub</h1>
          <p className="text-sm text-muted-foreground">Track your progress, streak, and rewards</p>
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
                  <span className="font-semibold">{mockUser.level} Learner</span>
                  <span className="text-muted-foreground">450 XP to Platinum</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Level 14</p>
          </div>
        </div>

        {/* Streak + Stats */}
        <section className="px-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Streak Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Streak</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-3xl font-bold">{currentStreak}</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {weekActivity.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-full h-7 rounded-md flex items-center justify-center ${
                        d.active
                          ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {d.active && <Flame className="h-3 w-3" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Longest: {longestStreak} days</p>
            </div>

            {/* Lessons Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-3xl font-bold">{totalLessonsCompleted}</span>
                <span className="text-sm text-muted-foreground">lessons</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Today</span>
                  <span className="ml-auto font-semibold text-primary">+{lessonsToday}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Active courses</span>
                  <span className="ml-auto font-semibold">{enrolledCourses.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Progress */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">My Courses</h2>
            <button className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {enrolledCourses.map((course) => {
              const pct = Math.round((course.completed / course.total) * 100);
              return (
                <div
                  key={course.id}
                  className="p-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex gap-3">
                    <img
                      src={course.cover}
                      alt={course.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight truncate">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{course.instructor}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold text-primary">{pct}%</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {course.completed} of {course.total} lessons completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground truncate flex-1 mr-2">
                      Up next: <span className="text-foreground">{course.nextLesson}</span>
                    </p>
                    <Button size="sm" className="gradient-primary border-0 h-8">
                      <PlayCircle className="h-3.5 w-3.5 mr-1" />
                      Resume
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress Trend Charts */}
        <ProgressCharts />

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
