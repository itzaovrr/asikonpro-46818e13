import { Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { MobileScroller } from "@/components/ui/mobile-scroller";

const ITEMS = [
  { name: "Tanvir H.", role: "Python student", quote: "AI tutor explained recursion in Bangla — finally clicked." },
  { name: "Ayesha R.", role: "ML beginner", quote: "Landed my first freelance gig in 6 weeks." },
  { name: "Rakib M.", role: "Prompt engineer", quote: "Prompt library saves me hours every day." },
];

export function Testimonials({ title = "Loved by learners" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <SectionHeader title={title} />
      <MobileScroller itemWidthMobile="78%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {ITEMS.map((t) => (
          <div key={t.name} className="h-full rounded-2xl glass p-4 border border-border/60 flex flex-col">
            <div className="flex gap-0.5 mb-2 text-amber-400">
              {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-3 w-3 fill-current" />)}
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/90 flex-1">"{t.quote}"</p>
            <div className="mt-3 pt-3 border-t border-border/40">
              <p className="font-semibold text-xs">{t.name}</p>
              <p className="text-[11px] text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </MobileScroller>
    </Reveal>
  );
}
