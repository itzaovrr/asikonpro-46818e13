import { Home, BarChart3, UtensilsCrossed, CalendarDays, Plus } from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BarChart3, label: "Analyze", path: "/shop" },
  { icon: UtensilsCrossed, label: "Food", path: "/community" },
  { icon: CalendarDays, label: "Plans", path: "/profile" },
];

/**
 * Bottom nav inspired by Iconly reference: 4 tabs split around a center
 * circular FAB (+). Active tab uses a filled primary "chip" behind the icon.
 */
export function BottomNav() {
  const { pathname } = useLocation();
  const isActive = (p: string) =>
    pathname === p || (p !== "/" && pathname.startsWith(p));

  const left = navItems.slice(0, 2);
  const right = navItems.slice(2);

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
              <NavItem key={item.path} item={item} active={isActive(item.path)} />
            ))}
          </div>

          {/* Center FAB */}
          <Link
            to="/create"
            aria-label="Create"
            className={cn(
              "shrink-0 mx-2 grid place-items-center",
              "h-14 w-14 rounded-full",
              "bg-foreground text-background",
              "shadow-[0_10px_24px_-6px_rgba(0,0,0,0.45)]",
              "active:scale-95 transition-transform duration-150"
            )}
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </Link>

          <div className="flex flex-1 items-center justify-around">
            {right.map((item) => (
              <NavItem key={item.path} item={item} active={isActive(item.path)} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; path: string };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
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
