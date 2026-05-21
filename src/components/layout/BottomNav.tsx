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
        "bg-background/95 backdrop-blur-xl",
        "border-t border-border/60"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-5 h-[58px]">
        {tabs.map((item) => (
          <NavItem key={item.path} item={item} active={activeTab === item.id} />
        ))}
      </div>
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
      className="relative flex flex-col items-center justify-center gap-0.5 select-none touch-manipulation outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full transition-all",
          active ? "bg-primary opacity-100" : "opacity-0"
        )}
      />
      <Icon
        className={cn(
          "h-[22px] w-[22px] transition-colors",
          active ? "text-primary" : "text-muted-foreground"
        )}
        strokeWidth={active ? 2.4 : 2}
      />
      <span
        className={cn(
          "text-[10px] leading-none tracking-tight transition-colors",
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}
