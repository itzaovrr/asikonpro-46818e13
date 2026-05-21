import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import aiTutor from "@/assets/ai-tutor.jpg";

const ALL_CHIPS = [
  "Explain SSC Physics",
  "Make a study plan",
  "Quiz me on HSC Math",
  "Summarise a chapter",
  "Help me with English grammar",
  "Explain the water cycle",
  "What is photosynthesis?",
  "Help me memorise vocabulary",
];

export function AiAssistantBox() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const CHIPS = useMemo(() => {
    const shuffled = [...ALL_CHIPS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);
  const go = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return nav("/learn");
    nav(`/learn?q=${encodeURIComponent(trimmed)}`);
  };
  return (
    <section className="section-x">
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/25 p-3 shadow-[0_10px_30px_-18px_hsl(var(--primary)/0.6),inset_0_1px_0_hsl(var(--glass-highlight)/0.15)]"
        style={{ background: "var(--gradient-primary-soft)" }}
      >
        {/* ambient glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.45), transparent 70%)" }}
        />

        <div className="relative flex items-center gap-3">
          {/* Teacher avatar */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-primary/40 blur-md" aria-hidden />
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.7)]">
              <SmartImage
                src={aiTutor}
                alt="AI tutor"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" aria-hidden />
          </div>

          {/* Title + input */}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-tight">Ask your AI tutor</p>
            <p className="text-[11px] text-muted-foreground leading-tight mb-1.5">Online · Bangla & English</p>
            <form
              onSubmit={(e) => { e.preventDefault(); go(q); }}
              className="flex items-center gap-1.5"
            >
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ask anything…"
                className="h-9 bg-background/60 border-border/60 text-[13px]"
              />
              <Button type="submit" variant="premium" size="icon" aria-label="Ask" className="h-9 w-9 shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Suggestion chips - single row scroll */}
        <div className="relative -mx-3 px-3 mt-2.5 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => go(c)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full border border-border/60 bg-background/40 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
