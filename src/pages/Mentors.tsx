import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMentors, type Mentor } from "@/hooks/useMentors";
import { MentorWaitlistSheet } from "@/components/mentorship/MentorWaitlistSheet";
import { MobileScroller } from "@/components/ui/mobile-scroller";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Star, GraduationCap, Languages, Sparkles, ShieldCheck, MessageSquare } from "lucide-react";

const Mentors = () => {
  const { data: mentors, isLoading } = useMentors();
  const [openSheet, setOpenSheet] = useState(false);
  const [selected, setSelected] = useState<Mentor | null>(null);

  const open = (m?: Mentor) => {
    setSelected(m ?? null);
    setOpenSheet(true);
  };

  return (
    <AppLayout>
      <div className="container-editorial space-y-8 pb-32 pt-2 lg:pt-4">
        {/* Hero */}
        <section className="section-x">
          <div
            className="relative overflow-hidden rounded-3xl border border-primary/25 p-6 lg:p-10 text-center"
            style={{ background: "var(--gradient-primary-soft)" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 mb-3">
              New · Coming soon
            </span>
            <h1 className="font-display font-bold text-2xl lg:text-4xl leading-tight max-w-2xl mx-auto">
              A personal teacher, just for your child
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground mt-3 max-w-xl mx-auto">
              Book 1-on-1 mentorship with hand-picked tutors in Bangla & English. Reserve your child's slot before public launch.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button variant="premium" size="lg" onClick={() => open()}>
                Join the waitlist
              </Button>
            </div>
          </div>
        </section>

        {/* Mentors */}
        <section>
          <div className="section-x">
            <SectionHeader
              title="Meet your mentors"
              subtitle="Verified tutors covering academics, coding, Quran & creative subjects"
            />
          </div>
          {isLoading ? (
            <div className="section-x grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : (
            <MobileScroller itemWidthMobile="72%" gridCols="md:grid md:grid-cols-3 lg:grid-cols-4" gap="gap-3">
              {(mentors ?? []).map((m) => (
                <article
                  key={m.id}
                  className="h-full rounded-2xl border border-border/60 bg-card p-4 flex flex-col hover-lift"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {m.rating.toFixed(1)} · {m.experience_years}+ yrs
                      </p>
                    </div>
                  </div>
                  {m.bio && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{m.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {m.subjects.slice(0, 3).map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px] font-normal">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                    <Languages className="h-3 w-3" />
                    {m.languages.join(" · ")}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                    <GraduationCap className="h-3 w-3" />
                    Ages {m.for_age_min}–{m.for_age_max}
                  </div>
                  <Button size="sm" variant="premium" className="mt-4" onClick={() => open(m)}>
                    Reserve a slot
                  </Button>
                </article>
              ))}
            </MobileScroller>
          )}
        </section>

        {/* How it works */}
        <section className="section-x">
          <SectionHeader title="How it works" subtitle="Simple, transparent, parent-first" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Sparkles, title: "1. Tell us about your child", text: "Share age, subject and goal — takes a minute." },
              { icon: ShieldCheck, title: "2. We match a vetted mentor", text: "Background-checked, parent-reviewed tutors." },
              { icon: MessageSquare, title: "3. Weekly 1-on-1 sessions", text: "Online classes + monthly progress updates to parents." },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-2xl glass border border-border/60 p-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3 shadow-[var(--shadow-glow)]">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="font-semibold text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sticky CTA on mobile */}
      <div className="md:hidden fixed inset-x-0 bottom-[84px] z-30 px-4 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl glass border border-primary/30 p-3 flex items-center gap-2 shadow-[var(--shadow-glow)]">
          <p className="text-sm font-semibold flex-1">Reserve before public launch</p>
          <Button size="sm" variant="premium" onClick={() => open()}>Join waitlist</Button>
        </div>
      </div>

      <MentorWaitlistSheet open={openSheet} onOpenChange={setOpenSheet} mentor={selected} />
    </AppLayout>
  );
};

export default Mentors;
