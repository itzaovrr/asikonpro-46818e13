import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  MoreHorizontal,
  Tags,
  MessagesSquare,
  GraduationCap,
  Settings as SettingsIcon,
  Home,
  LayoutGrid,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const primary = [
  { title: "Overview", url: "/asikonasik", icon: LayoutDashboard, end: true },
  { title: "Products", url: "/asikonasik/products", icon: Package },
  { title: "Community", url: "/asikonasik/community", icon: MessagesSquare },
];

const more = [
  { title: "Users", url: "/asikonasik/users", icon: Users },
  { title: "Orders", url: "/asikonasik/orders", icon: ShoppingBag },
  { title: "Categories", url: "/asikonasik/categories", icon: Tags },
  { title: "Mentors", url: "/asikonasik/mentors", icon: GraduationCap },
  { title: "Home Sections", url: "/asikonasik/home-sections", icon: LayoutGrid },
  { title: "Banners", url: "/asikonasik/banners", icon: ImageIcon },
  { title: "Tracks", url: "/asikonasik/tracks", icon: GraduationCap },
  { title: "Lessons", url: "/asikonasik/lessons", icon: BookOpen },
  { title: "Settings", url: "/asikonasik/settings", icon: SettingsIcon },
  { title: "Back to app", url: "/", icon: Home },
];

export function AdminBottomNav() {
  const { pathname } = useLocation();
  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const activeIndex = useMemo(() => {
    const idx = primary.findIndex((i) => isActive(i.url, i.end));
    return idx === -1 ? -1 : idx;
  }, [pathname]);

  const total = primary.length + 1; // +1 for "More"
  const widthPct = 100 / total;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border/60 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Admin navigation"
    >
      <div className="relative flex h-16 w-full items-stretch">
        {activeIndex >= 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1.5 h-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15"
            style={{
              width: `calc(${widthPct}% - 12px)`,
              left: `calc(${activeIndex * widthPct}% + 6px)`,
              transition: "left 320ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        )}

        {primary.map((item) => {
          const active = isActive(item.url, item.end);
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.end}
              className={cn(
                "relative z-10 flex flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn("h-[22px] w-[22px] transition-transform", active && "scale-110")}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className={active ? "font-semibold" : ""}>{item.title}</span>
            </NavLink>
          );
        })}

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="relative z-10 flex flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium text-muted-foreground"
            >
              <MoreHorizontal className="h-[22px] w-[22px]" />
              <span>More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl glass-strong border-border/60">
            <SheetHeader className="text-left">
              <SheetTitle>
                <span className="text-gradient">Admin menu</span>
              </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 mt-4 pb-6">
              {more.map((item) => {
                const active = isActive(item.url);
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "pressable flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 bg-card hover:bg-muted/50",
                    )}
                  >
                    <span
                      className={cn(
                        "grid place-items-center h-9 w-9 rounded-xl",
                        active ? "gradient-primary text-primary-foreground" : "bg-muted/60",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
