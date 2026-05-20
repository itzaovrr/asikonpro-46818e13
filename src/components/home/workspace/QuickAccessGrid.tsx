import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import {
  Sparkles, BookOpenText, CalendarCheck2, LineChart, GraduationCap, Wand2,
  Heart, ShoppingBag, PackageCheck, Compass, PlayCircle, Gamepad2, MessagesSquare,
  BellRing, Settings2, Info, PlusCircle, Store, Users, UserCircle2, LifeBuoy,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { cn } from "@/lib/utils";

type Tile = {
  icon: any;
  label: string;
  href: string;
  /** Tailwind gradient classes for the icon chip. */
  tone: string;
};

// iOS / Material-inspired colored chips. Soft gradients with matching icon color.
const TILES: Tile[] = [
  { icon: BookOpenText,   label: "Continue", href: "/learn",              tone: "from-rose-500 to-pink-500" },
  { icon: Sparkles,       label: "AI Tutor", href: "/learn",              tone: "from-violet-500 to-fuchsia-500" },
  { icon: CalendarCheck2, label: "Planner",  href: "/learn",              tone: "from-sky-500 to-cyan-500" },
  { icon: LineChart,      label: "Progress", href: "/profile",            tone: "from-emerald-500 to-teal-500" },
  { icon: GraduationCap,  label: "Mentors",  href: "/mentors",            tone: "from-amber-500 to-orange-500" },
  { icon: Wand2,          label: "Prompts",  href: "/prompts",            tone: "from-indigo-500 to-purple-500" },
  { icon: Store,          label: "Shop",     href: "/shop",               tone: "from-emerald-500 to-green-600" },
  { icon: Users,          label: "Community",href: "/community",          tone: "from-sky-500 to-indigo-500" },
  { icon: Heart,          label: "Saved",    href: "/wishlist",           tone: "from-pink-500 to-rose-500" },
  { icon: ShoppingBag,    label: "Cart",     href: "/cart",               tone: "from-orange-500 to-red-500" },
  { icon: PackageCheck,   label: "Orders",   href: "/orders",             tone: "from-lime-500 to-emerald-500" },
  { icon: Compass,        label: "Tracks",   href: "/shop?type=courses",  tone: "from-blue-500 to-indigo-500" },
  { icon: PlayCircle,     label: "Lessons",  href: "/learn",              tone: "from-fuchsia-500 to-pink-500" },
  { icon: Gamepad2,       label: "Games",    href: "/game",               tone: "from-purple-500 to-violet-500" },
  { icon: MessagesSquare, label: "Messages", href: "/community",          tone: "from-cyan-500 to-blue-500" },
  { icon: BellRing,       label: "Alerts",   href: "/profile",            tone: "from-yellow-500 to-amber-500" },
  { icon: PlusCircle,     label: "Create",   href: "/create",             tone: "from-red-500 to-rose-500" },
  { icon: UserCircle2,    label: "Profile",  href: "/profile",            tone: "from-purple-500 to-fuchsia-500" },
  { icon: LifeBuoy,       label: "Help",     href: "/about",              tone: "from-teal-500 to-emerald-500" },
  { icon: Info,           label: "About",    href: "/about",              tone: "from-teal-500 to-cyan-500" },
  { icon: Settings2,      label: "Settings", href: "/settings",           tone: "from-slate-500 to-zinc-500" },
];

export function QuickAccessGrid() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  // chunk into pairs (2 rows on mobile)
  const pairs: Tile[][] = [];
  for (let i = 0; i < TILES.length; i += 2) pairs.push(TILES.slice(i, i + 2));

  return (
    <Reveal as="section" className="section-x">
      <div className="flex items-end justify-between mb-2.5">
        <p className="eyebrow text-muted-foreground">Quick access</p>
        <span className="text-[10.5px] text-muted-foreground/70">Swipe →</span>
      </div>

      {/* Mobile: 2-row embla carousel */}
      <div className="md:hidden -mx-3 px-3 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2.5">
          {pairs.map((pair, i) => (
            <div key={i} className="shrink-0 flex flex-col gap-2.5 w-[74px]">
              {pair.map((t) => <Tile key={t.label} {...t} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: responsive grid */}
      <div className="hidden md:grid grid-cols-6 lg:grid-cols-9 gap-3">
        {TILES.map((t) => <Tile key={t.label} {...t} />)}
      </div>
    </Reveal>
  );
}

function Tile({ icon: Icon, label, href, tone }: Tile) {
  return (
    <Link
      to={href}
      className="group focus-ring flex flex-col items-center gap-1.5 rounded-2xl py-2.5 px-1.5 active:scale-[0.94] transition-transform"
    >
      <div
        className={cn(
          "w-[52px] h-[52px] rounded-[18px] bg-gradient-to-br shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)]",
          "flex items-center justify-center ring-1 ring-white/15",
          "group-hover:shadow-[0_10px_20px_-8px_rgba(0,0,0,0.45)] transition-shadow",
          tone,
        )}
      >
        <Icon className="h-[22px] w-[22px] text-white" strokeWidth={2.25} />
      </div>
      <span className="text-[10.5px] font-medium leading-tight text-center truncate w-full text-foreground/85">
        {label}
      </span>
    </Link>
  );
}
