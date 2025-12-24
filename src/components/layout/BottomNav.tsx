import { Home, ShoppingBag, Gamepad2, Users, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ShoppingBag, label: "Shop", path: "/shop" },
  { icon: Gamepad2, label: "Game", path: "/game" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = forwardRef<HTMLElement, object>((_, ref) => {
  const location = useLocation();

  return (
    <nav ref={ref} className="fixed bottom-0 left-0 right-0 z-[100] bg-card/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = "BottomNav";
