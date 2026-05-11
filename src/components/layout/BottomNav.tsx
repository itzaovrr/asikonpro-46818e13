import { Home, Library, Gamepad2, Users, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Library, label: "Library", path: "/shop" },
  { icon: Gamepad2, label: "Game", path: "/game" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = forwardRef<HTMLElement, object>((_, ref) => {
  const location = useLocation();

  const nav = (
    <nav
      ref={ref}
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-card/95 backdrop-blur-lg border-t border-border"
      style={{
        position: "fixed",
        bottom: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 gap-0.5 transition-all duration-200 relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive && "bg-primary/10"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );

  // PageTransition uses `translate-y-*` (CSS transform), which can make `position: fixed`
  // behave like it is anchored to the page content. Portaling keeps it pinned to viewport.
  return typeof document !== "undefined" ? createPortal(nav, document.body) : nav;
});

BottomNav.displayName = "BottomNav";
