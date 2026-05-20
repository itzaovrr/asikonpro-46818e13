import { Link } from "react-router-dom";
import { PlayCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/transitions/Reveal";

type Props = {
  title?: string;
  subtitle?: string;
  variant?: "full" | "slim";
};

export function FinalCta({
  title = "Start your first lesson — free",
  subtitle = "Pick a course, ask the AI, earn 100 welcome coins.",
  variant = "full",
}: Props) {
  if (variant === "slim") {
    return (
      <Reveal as="section" className="section-x">
        <Link
          to="/about"
          className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 pressable focus-ring"
        >
          <span className="text-[13px] font-medium">Learn more about ASIKON</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" className="section-x">
      <div
        className="relative overflow-hidden rounded-3xl border border-primary/30 p-5 sm:p-7 text-center"
        style={{ background: "var(--gradient-primary-soft)" }}
      >
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl gradient-primary shadow-[var(--shadow-glow)] mb-3">
          <PlayCircle className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="font-display text-lg sm:text-2xl font-bold mb-1.5 tracking-tight">{title}</h3>
        <p className="text-[13px] sm:text-sm text-muted-foreground max-w-md mx-auto mb-4">{subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="premium" size="lg"><Link to="/shop?type=courses">Browse courses</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/learn">Try AI tutor</Link></Button>
        </div>
      </div>
    </Reveal>
  );
}
