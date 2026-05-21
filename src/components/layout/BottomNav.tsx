import { Store, Sparkles, UsersRound, UserRound, type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getActiveTab, TabId } from "@/lib/nav-map";
import { useCart } from "@/hooks/useCart";

type IconComponent = LucideIcon | React.FC<React.SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const HomeIcon: IconComponent = ({ strokeWidth = 1.5, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    />
    <path d="M15 18H9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

interface Tab {
  id: Exclude<TabId, null>;
  icon: IconComponent;
  label: string;
  path: string;
}

export function BottomNav() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);
  const { data: cart } = useCart();
  const cartCount = cart?.length ?? 0;

  const tabs: (Tab & { badge?: number; dot?: boolean })[] = [
    { id: "home", icon: HomeIcon, label: "Home", path: "/" },
    { id: "explore", icon: Store, label: "Shop", path: "/shop", badge: cartCount },
    { id: "ai", icon: Sparkles, label: "AI", path: "/learn" },
    { id: "community", icon: UsersRound, label: "Community", path: "/community", dot: false },
    { id: "profile", icon: UserRound, label: "Profile", path: "/profile" },
  ];

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 h-[var(--bottom-nav-h)] overflow-hidden supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]",
        "liquid-nav border-t border-border/40"
      )}
    >
      <ul className="flex h-[72px] items-stretch px-1.5">
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
  item: { icon: IconComponent; label: string; path: string; badge?: number; dot?: boolean };
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

  const showBadge = typeof item.badge === "number" && item.badge > 0;
  const showDot = !!item.dot && !showBadge;

  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className="relative flex h-full w-full flex-col items-center justify-center gap-1 select-none touch-manipulation outline-none group"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Top active dot indicator */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary transition-all duration-300 ease-out",
          active ? "opacity-100 scale-100 shadow-[0_0_8px_hsl(var(--primary)/0.7)]" : "opacity-0 scale-0"
        )}
      />

      {/* Icon + badge wrapper */}
      <span className="relative inline-flex">
        <Icon
          aria-hidden
          className={cn(
            "pointer-events-none h-[24px] w-[24px] transition-all duration-300 ease-out",
            active ? "text-primary -translate-y-px" : "text-muted-foreground"
          )}
          strokeWidth={active ? 2.25 : 2}
        />

        {showBadge && (
          <span
            aria-label={`${item.badge} items`}
            className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-[0_2px_6px_hsl(var(--primary)/0.45)] ring-2 ring-background"
          >
            {item.badge! > 9 ? "9+" : item.badge}
          </span>
        )}

        {showDot && (
          <span
            aria-label="Unread"
            className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background shadow-[0_0_6px_hsl(var(--primary)/0.7)]"
          />
        )}
      </span>

      <span
        className={cn(
          "pointer-events-none text-[10px] leading-none transition-colors duration-200",
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}
