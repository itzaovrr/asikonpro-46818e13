import { Home, GraduationCap, ShoppingBag, User, Plus, MoreHorizontal, Users, Heart, Package, Shirt, Info } from "lucide-react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getActiveTab, TabId } from "@/lib/nav-map";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const tabs: { id: Exclude<TabId, null>; icon: typeof Home; label: string; path: string }[] = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "learn", icon: GraduationCap, label: "Learn", path: "/learn" },
  { id: "shop", icon: ShoppingBag, label: "Shop", path: "/shop" },
  { id: "profile", icon: User, label: "Profile", path: "/profile" },
];

const moreItems = [
  { icon: Users, label: "Community", path: "/community" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: Package, label: "Orders", path: "/orders" },
  { icon: Shirt, label: "Print on Demand", path: "/pod" },
  { icon: Info, label: "About", path: "/about" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);
  const [moreOpen, setMoreOpen] = useState(false);

  const left = tabs.slice(0, 2);
  const right = tabs.slice(2);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[9999] pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto max-w-lg px-4 pb-3">
        <div
          className={cn(
            "pointer-events-auto relative flex items-center justify-between",
            "h-[68px] px-4 rounded-[28px]",
            "bg-background/85 backdrop-blur-2xl",
            "border border-border/60",
            "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]"
          )}
        >
          <div className="flex flex-1 items-center justify-around">
            {left.map((item) => (
              <NavItem key={item.path} item={item} active={activeTab === item.id} />
            ))}
          </div>

          {/* Center FAB → Create */}
          <Link
            to="/create"
            aria-label="Create"
            className={cn(
              "shrink-0 mx-2 grid place-items-center",
              "h-14 w-14 rounded-full",
              "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
              "shadow-[0_10px_24px_-6px_hsl(var(--primary)/0.55)]",
              "active:scale-95 transition-transform duration-150"
            )}
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </Link>

          <div className="flex flex-1 items-center justify-around">
            {right.map((item) => (
              <NavItem key={item.path} item={item} active={activeTab === item.id} />
            ))}
          </div>
        </div>

        {/* More sheet trigger (long-press / tap on active home tab opens it) */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="More navigation"
              className="pointer-events-auto absolute right-6 -top-3 h-8 w-8 grid place-items-center rounded-full bg-background/90 backdrop-blur border border-border/60 shadow-md"
              style={{ top: "-12px" }}
              onClick={(e) => { e.preventDefault(); setMoreOpen(true); }}
            >
              <MoreHorizontal className="h-4 w-4 text-foreground/70" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>More</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 pt-4 pb-2">
              {moreItems.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.path}
                    to={m.path}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/40 border border-border/40 active:scale-95 transition"
                  >
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-medium text-center">{m.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { icon: typeof Home; label: string; path: string };
  active: boolean;
}) {
  const Icon = item.icon;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    // iOS-style: tap active tab → scroll to top
    if (active && pathname === item.path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className="group flex flex-col items-center justify-center gap-1 select-none touch-manipulation outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span
        className={cn(
          "grid place-items-center h-9 w-9 rounded-xl transition-all duration-200",
          active
            ? "bg-primary text-primary-foreground shadow-[0_6px_14px_-4px_hsl(var(--primary)/0.55)]"
            : "text-foreground/70 group-active:scale-95"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
      </span>
      <span
        className={cn(
          "text-[10.5px] leading-none tracking-tight transition-colors",
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}
