import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const weeklyData = [
  { week: "W1", lessons: 4 },
  { week: "W2", lessons: 7 },
  { week: "W3", lessons: 5 },
  { week: "W4", lessons: 9 },
  { week: "W5", lessons: 12 },
  { week: "W6", lessons: 10 },
  { week: "W7", lessons: 14 },
  { week: "W8", lessons: 17 },
];

const courseCompletion = [
  { name: "AI & ML", pct: 56 },
  { name: "Python DS", pct: 38 },
  { name: "Web Dev", pct: 82 },
  { name: "Statistics", pct: 24 },
];

const barColors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export function ProgressCharts() {
  const total = weeklyData.reduce((s, d) => s + d.lessons, 0);
  const last = weeklyData[weeklyData.length - 1].lessons;
  const prev = weeklyData[weeklyData.length - 2].lessons;
  const delta = prev ? Math.round(((last - prev) / prev) * 100) : 0;

  return (
    <section className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Progress Trends</h2>
        <span className="text-xs text-muted-foreground">Last 8 weeks</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Weekly lessons completed */}
        <div className="p-4 rounded-2xl bg-card border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Weekly Lessons</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{total}</span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              {delta >= 0 ? "+" : ""}{delta}%
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="weeklyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="lessons"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#weeklyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course completion % */}
        <div className="p-4 rounded-2xl bg-card border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Course Completion</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">
                  {Math.round(courseCompletion.reduce((s, c) => s + c.pct, 0) / courseCompletion.length)}%
                </span>
                <span className="text-xs text-muted-foreground">avg</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{courseCompletion.length} courses</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompletion} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}%`, "Completed"]}
                />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                  {courseCompletion.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
