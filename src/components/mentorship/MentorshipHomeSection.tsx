import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck, Languages, UserCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MentorshipHomeSection() {
  return (
    <section className="section-x">
      <div
        className="relative overflow-hidden rounded-3xl border border-primary/25 p-5 lg:p-7"
        style={{ background: "var(--gradient-primary-soft)" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1">
          New · Coming soon
        </span>

        <div className="mt-3 flex items-start gap-4">
          <div className="hidden sm:flex w-14 h-14 rounded-2xl gradient-primary items-center justify-center shadow-[var(--shadow-glow)] shrink-0">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg lg:text-2xl leading-tight">
              Book a personal teacher for your child
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              1-on-1 mentorship with verified tutors — built for parents who want focused, accountable progress.
            </p>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Trust icon={ShieldCheck} text="Background-checked tutors" />
          <Trust icon={Languages} text="Bangla & English support" />
          <Trust icon={UserCheck} text="One-on-one, parent updates" />
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button asChild variant="premium" size="lg">
            <Link to="/mentors" className="inline-flex items-center gap-1.5">
              Join the waitlist
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/mentors">Meet the mentors</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Trust({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center gap-2 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 px-3 py-2">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <span className="text-xs font-medium">{text}</span>
    </li>
  );
}
