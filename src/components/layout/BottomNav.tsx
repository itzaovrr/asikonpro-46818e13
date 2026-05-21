import { House, Compass, Wand2, Users, CircleUser } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getActiveTab, TabId } from "@/lib/nav-map";

const tabs: { id: Exclude<TabId, null>; icon: typeof House; label: string; path: string }[] = [
  { id: "home", icon: House, label: "Home", path: "/" },
  { id: "explore", icon: Compass, label: "Explore", path: "/shop" },
  { id: "ai", icon: Wand2, label: "AI", path: "/learn" },
  { id: "community", icon: Users, label: "Community", path: "/community" },
  { id: "profile", icon: CircleUser, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "liquid-nav border-t border-border/40"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex h-[60px] items-stretch">
        {tabs.map((item) => (
          <li key={item.path} className="flex-1 min-w-0">
            <NavItem item={item} active={activeTab === item.id} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { icon: typeof House; label: string; path: string };
  active: boolean;
}) {
  const Icon = item.icon;
  const { pathname } = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    // Only intercept when we're already on the exact same path (scroll-to-top affordance)
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
      className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 select-none touch-manipulation outline-none group"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Decorative active pill — never intercept taps */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-2.5 top-1.5 bottom-1.5 rounded-2xl transition-all duration-300 ease-out",
          active
            ? "bg-primary/12 opacity-100 scale-100 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.2)]"
            : "opacity-0 scale-90 group-active:opacity-60 group-active:scale-95 group-active:bg-foreground/5"
        )}
      />
      <Icon
        aria-hidden
        className={cn(
          "pointer-events-none relative h-[22px] w-[22px] transition-all duration-300 ease-out",
          active ? "text-primary -translate-y-px scale-110" : "text-muted-foreground"
        )}
        strokeWidth={active ? 2.4 : 1.9}
      />
      <span
        className={cn(
          "pointer-events-none relative text-[10px] leading-none tracking-tight transition-colors duration-200",
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}
