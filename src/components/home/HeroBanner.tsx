import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative h-[220px] sm:h-64 overflow-hidden rounded-none sm:rounded-2xl sm:mx-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_20%,white,transparent_50%)]" />
      <GraduationCap className="absolute right-6 top-6 h-24 w-24 text-white/20" />
      <Sparkles className="absolute right-20 bottom-8 h-10 w-10 text-white/40" />
      <div className="relative z-10 h-full flex flex-col justify-center p-5 sm:p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white w-fit mb-3">
          New drop
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-bold mb-1.5 tracking-tight text-white">
          Skill up this week
        </h2>
        <p className="text-[13px] sm:text-sm text-white/80 mb-4 max-w-[220px]">
          Top-rated courses, hand-picked for you.
        </p>
        <Button variant="secondary" size="sm" className="w-fit">Shop now</Button>
      </div>
    </div>
  );
}
