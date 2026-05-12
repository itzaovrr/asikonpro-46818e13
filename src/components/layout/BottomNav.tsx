import { Home, Library, Gamepad2, Users, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Library, label: "Library", path: "/shop" },
  { icon: Gamepad2, label: "Game", path: "/game" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

/**
 * Persistent app-shell bottom navigation.
 * Mounted ONCE at the App root → never remounts on route changes,
 * so it never blinks. Active state is derived from `useLocation`.
 */
export function BottomNav() {
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/" && location.pathname.startsWith(item.path))
    );
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  const itemWidthPct = 100 / navItems.length;

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[9999]",
        "border-t border-border/60",
        "bg-background/80 backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-background/60",
        "shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]"
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        // Promote to its own GPU layer to avoid jank during scroll/route changes
        transform: "translateZ(0)",
        willChange: "transform",
        contain: "layout paint",
      }}
    >
      <div className="relative mx-auto flex h-16 max-w-lg items-stretch">
        {/* Sliding active indicator pill */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1.5 h-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15"
          style={{
            width: `calc(${itemWidthPct}% - 12px)`,
            left: `calc(${activeIndex * itemWidthPct}% + 6px)`,
            transition:
              "left 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "left, width",
          }}
        />

        {navItems.map((item, i) => {
          const isActive = i === activeIndex;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative z-10 flex flex-1 flex-col items-center justify-center gap-0.5",
                "select-none touch-manipulation outline-none",
                "transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <Icon
                className={cn(
                  "h-[22px] w-[22px] transition-transform duration-300",
                  isActive ? "scale-110" : "scale-100 group-active:scale-95"
                )}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span
                className={cn(
                  "text-[10.5px] leading-none tracking-tight transition-all duration-200",
                  isActive ? "font-semibold opacity-100" : "font-medium opacity-80"
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
