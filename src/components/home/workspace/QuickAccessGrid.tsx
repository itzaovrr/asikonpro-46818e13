import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import {
  Sparkles, BookOpen, CalendarCheck, TrendingUp, GraduationCap, NotebookPen,
  Bookmark, ShoppingBag, Package, Route, PlayCircle, Gamepad2, MessageCircle,
  Bell, Settings, Info, Plus,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";

type Tile = { icon: any; label: string; href: string };

const TILES: Tile[] = [
  { icon: BookOpen, label: "Continue", href: "/learn" },
  { icon: Sparkles, label: "AI Tutor", href: "/learn" },
  { icon: CalendarCheck, label: "Planner", href: "/learn" },
  { icon: TrendingUp, label: "Progress", href: "/profile" },
  { icon: GraduationCap, label: "Mentors", href: "/mentors" },
  { icon: NotebookPen, label: "Prompts", href: "/prompts" },
  { icon: Bookmark, label: "Saved", href: "/wishlist" },
  { icon: ShoppingBag, label: "Cart", href: "/cart" },
  { icon: Package, label: "Orders", href: "/orders" },
  { icon: Route, label: "Tracks", href: "/shop?type=courses" },
  { icon: PlayCircle, label: "Lessons", href: "/learn" },
  { icon: Gamepad2, label: "Games", href: "/game" },
  { icon: MessageCircle, label: "Messages", href: "/community" },
  { icon: Bell, label: "Alerts", href: "/profile" },
  { icon: Plus, label: "Create", href: "/create" },
  { icon: Info, label: "About", href: "/about" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function QuickAccessGrid() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  // chunk into pairs (2 rows)
  const pairs: Tile[][] = [];
  for (let i = 0; i < TILES.length; i += 2) pairs.push(TILES.slice(i, i + 2));

  return (
    <Reveal as="section" className="section-x">
      <p className="eyebrow text-muted-foreground mb-2">Quick access</p>

      {/* Mobile: 2-row embla carousel */}
      <div className="md:hidden -mx-3 px-3 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          {pairs.map((pair, i) => (
            <div key={i} className="shrink-0 flex flex-col gap-2 w-[76px]">
              {pair.map((t) => <Tile key={t.label} {...t} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: responsive grid */}
      <div className="hidden md:grid grid-cols-6 lg:grid-cols-9 gap-2.5">
        {TILES.map((t) => <Tile key={t.label} {...t} />)}
      </div>
    </Reveal>
  );
}

function Tile({ icon: Icon, label, href }: Tile) {
  return (
    <Link
      to={href}
      className="pressable focus-ring flex flex-col items-center justify-center gap-1.5 aspect-square rounded-2xl glass border border-border/60 hover:border-primary/40 transition-colors p-2 active:scale-[0.97]"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="h-[18px] w-[18px] text-primary" />
      </div>
      <span className="text-[10.5px] font-medium leading-tight text-center truncate w-full">{label}</span>
    </Link>
  );
}
