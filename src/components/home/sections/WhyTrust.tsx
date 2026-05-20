import { ShieldCheck, Users, Headphones, Rocket } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";

const POINTS = [
  { icon: ShieldCheck, title: "Verified content", text: "Reviewed by experts." },
  { icon: Users, title: "10K+ learners", text: "Active across BD." },
  { icon: Headphones, title: "24/7 AI tutor", text: "Your language." },
  { icon: Rocket, title: "Job-ready", text: "Real-world projects." },
];

export function WhyTrust({ title = "Why learners trust us" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card p-3 hover-lift">
              <Icon className="h-4 w-4 text-primary mb-1.5" />
              <p className="font-semibold text-[13px] leading-tight">{p.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{p.text}</p>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
