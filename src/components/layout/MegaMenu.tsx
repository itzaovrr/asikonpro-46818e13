import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Flame,
  Bot,
  Users,
  MessageSquare,
  Video,
  Heart,
  Trophy,
  Compass,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import {
  NavigationMenu as NM,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type Item = { icon: any; label: string; href: string; desc: string };
type Panel = {
  label: string;
  items: Item[];
  feature: { eyebrow: string; title: string; desc: string; href: string; cta: string };
};

const PANELS: Panel[] = [
  {
    label: "Learn",
    items: [
      { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", desc: "Expert-led AI & coding tracks" },
      { icon: Compass, label: "Tracks", href: "/learn", desc: "Guided learning journeys" },
      { icon: BookOpen, label: "Lessons", href: "/learn", desc: "Bite-sized modules" },
      { icon: Bot, label: "AI Tutor", href: "/learn", desc: "24/7 chat in Bangla & English" },
    ],
    feature: {
      eyebrow: "New course",
      title: "Learn AI with Asikon",
      desc: "Master ML, Python, and modern AI tools.",
      href: "/shop?type=courses",
      cta: "Browse courses",
    },
  },
  {
    label: "Shop",
    items: [
      { icon: BookOpen, label: "Books", href: "/shop?type=books", desc: "Curated reading list" },
      { icon: Sparkles, label: "Prompts", href: "/prompts", desc: "1000+ AI prompt library" },
      { icon: Flame, label: "Trending", href: "/shop?filter=trending", desc: "What learners love" },
      { icon: Heart, label: "Deals", href: "/shop?filter=deals", desc: "Limited time offers" },
    ],
    feature: {
      eyebrow: "Limited deal",
      title: "Skill-Up Friday — 50% off",
      desc: "Top-rated courses on sale.",
      href: "/shop?filter=deals",
      cta: "View deals",
    },
  },
  {
    label: "Community",
    items: [
      { icon: MessageSquare, label: "Feed", href: "/community", desc: "Latest from learners" },
      { icon: Video, label: "Live & shorts", href: "/community", desc: "Watch and learn" },
      { icon: Users, label: "Reviews", href: "/community", desc: "Verified buyer reviews" },
      { icon: Trophy, label: "Game & rewards", href: "/game", desc: "Earn coins, climb ranks" },
    ],
    feature: {
      eyebrow: "Join free",
      title: "Trusted by learners",
      desc: "Real reviews from verified buyers.",
      href: "/community",
      cta: "Explore community",
    },
  },
  {
    label: "Mentorship",
    items: [
      { icon: Users, label: "Browse mentors", href: "/mentors", desc: "Personal tutors for children" },
      { icon: HelpCircle, label: "Join waitlist", href: "/mentors", desc: "Be first in line" },
      { icon: Compass, label: "About program", href: "/about", desc: "How 1-on-1 works" },
    ],
    feature: {
      eyebrow: "1-on-1",
      title: "Find your child's tutor",
      desc: "Hand-picked educators, waitlist-only.",
      href: "/mentors",
      cta: "Request a mentor",
    },
  },
];

function PanelGrid({ panel }: { panel: Panel }) {
  return (
    <div className="grid w-[640px] grid-cols-[1fr_240px] gap-6 p-5">
      <ul className="grid grid-cols-2 gap-1.5">
        {panel.items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <NavigationMenuLink asChild>
                <Link
                  to={it.href}
                  className="group flex gap-3 rounded-xl p-2.5 hover:bg-secondary/60 focus-ring transition-colors"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">
                      {it.label}
                    </span>
                    <span className="block text-[11px] text-muted-foreground truncate">
                      {it.desc}
                    </span>
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>
          );
        })}
      </ul>
      <Link
        to={panel.feature.href}
        className="group relative overflow-hidden rounded-xl border border-primary/20 p-4 flex flex-col justify-between focus-ring"
        style={{ background: "var(--gradient-primary-soft)" }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
            {panel.feature.eyebrow}
          </p>
          <p className="mt-1 text-sm font-display font-semibold leading-snug">
            {panel.feature.title}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {panel.feature.desc}
          </p>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
          {panel.feature.cta}
          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </Link>
    </div>
  );
}

export function MegaMenu({ className }: { className?: string }) {
  const { pathname } = useLocation();
  return (
    <NM className={cn("hidden lg:flex", className)}>
      <NavigationMenuList>
        {PANELS.map((p) => (
          <NavigationMenuItem key={p.label}>
            <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
              {p.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <PanelGrid panel={p} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/about"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-secondary/60",
                pathname === "/about" && "text-primary"
              )}
            >
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NM>
  );
}
