import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const chips = [
  { k: "10k+", v: "Learners" },
  { k: "500+", v: "Lessons" },
  { k: "24", v: "Tracks" },
  { k: "AI", v: "Tutor 24/7" },
];

export function AboutHero() {
  return (
    <section className="aurora-bg relative overflow-hidden">
      <div className="container-editorial py-16 sm:py-20 lg:py-32">
        <div className="max-w-4xl">
          <p className="eyebrow-bar mb-5">About ASIKON</p>
          <h1 className="display-1 text-foreground">
            Learning, reimagined for every{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              Bangladeshi student.
            </span>
          </h1>
          <p className="body-lg mt-6 text-muted-foreground max-w-2xl">
            ASIKON is an AI-powered learning platform built to make education simple,
            smart, and accessible — one small daily lesson at a time.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/learn">
                Start learning <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link to="/learn">
                <Sparkles className="mr-1.5 h-4 w-4" /> Explore tracks
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {chips.map((c) => (
              <div
                key={c.v}
                className="glass rounded-2xl px-4 py-3 hover-lift"
              >
                <div className="font-display text-2xl font-semibold tracking-tight">{c.k}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{c.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
