import { Compass, Target, Trophy } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { MobileScroller } from "@/components/ui/mobile-scroller";

const STEPS = [
  { icon: Compass, title: "Discover", text: "Courses, books & prompts for your level." },
  { icon: Target, title: "Practice", text: "Learn with the 24/7 AI tutor." },
  { icon: Trophy, title: "Achieve", text: "Earn XP, badges, ship projects." },
];

export function HowItWorks({ title = "How it works" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <SectionHeader title={title} />
      <MobileScroller itemWidthMobile="72%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="h-full rounded-2xl glass p-4 border border-border/60 hover-lift">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="eyebrow text-primary/80">Step {i + 1}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          );
        })}
      </MobileScroller>
    </Reveal>
  );
}
