import { useState } from "react";
import { LiveCard } from "@/components/community/LiveCard";
import { mockLiveSessions } from "@/lib/community-mock-data";
import { cn } from "@/lib/utils";

const categories = ["For You", "Fashion", "Sneakers", "Luxury Bags", "Tutorial"];

export function LiveTab() {
  const [activeCategory, setActiveCategory] = useState("For You");

  const liveSessions = mockLiveSessions.filter(s => s.isLive);
  const upcomingSessions = mockLiveSessions.filter(s => !s.isLive);

  return (
    <div className="space-y-6 pb-4">
      {/* Category filters */}
      <div className="flex gap-2 px-4 overflow-x-auto hide-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeCategory === category
                ? "gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Live Now */}
      {liveSessions.length > 0 && (
        <section className="px-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold">Live Now</h3>
          </div>
          <div className="grid gap-3">
            {liveSessions.map((session) => (
              <LiveCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingSessions.length > 0 && (
        <section className="px-4 space-y-3">
          <h3 className="text-sm font-semibold">Upcoming</h3>
          <div className="grid gap-3">
            {upcomingSessions.map((session) => (
              <LiveCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
