import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { TrustStrip } from "./TrustStrip";
import { NavigationMenu } from "./NavigationMenu";
import logo from "@/assets/logo.png";

interface DesktopHeaderProps {
  showTrustStrip?: boolean;
  cartCount?: number;
  isSidebarCollapsed?: boolean;
}

export function DesktopHeader({ 
  showTrustStrip = true, 
  cartCount = 0,
  isSidebarCollapsed = false 
}: DesktopHeaderProps) {
  const { isScrolled } = useScrollDirection();
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header 
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 z-40 transition-all duration-300",
        isSidebarCollapsed ? "left-16 right-0" : "left-60 right-0",
        "lg:left-0 lg:right-0" // Full width on mobile/tablet
      )}
    >
      {/* Trust Strip */}
      <TrustStrip show={showTrustStrip && !isScrolled} />

      {/* Row 1 - Main Header */}
      <div
        className={cn(
          "relative bg-background/70 backdrop-blur-xl border-b transition-all duration-300",
          isScrolled
            ? "border-border/60 shadow-[0_10px_30px_-18px_hsl(var(--primary)/0.45)] py-2"
            : "border-transparent py-3"
        )}
      >
        {/* Brand glow underline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-70"
          style={{ background: "var(--gradient-primary)" }}
        />

        <div
          className={cn(
            "mx-auto px-4 flex items-center gap-6 transition-all duration-300",
            isSidebarCollapsed ? "max-w-7xl" : "container"
          )}
        >
          {/* Left - Logo */}
          <Link to="/" className="group flex-shrink-0 flex items-center gap-2.5">
            <span className="relative flex items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-primary)" }}
              />
              <img
                src={logo}
                alt="Asikon logo"
                className={cn(
                  "relative rounded-full transition-all duration-300",
                  isScrolled ? "w-7 h-7" : "w-9 h-9"
                )}
              />
            </span>
            <h1
              className={cn(
                "font-bold tracking-tight text-gradient transition-all duration-300",
                isScrolled ? "text-xl" : "text-2xl"
              )}
            >
              Asikon
            </h1>
          </Link>

          {/* Center - Search */}
          <SmartSearch className="flex-1 max-w-2xl mx-auto" />

          {/* Right - Icons */}
          <div className="flex items-center gap-1.5">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl" title="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 text-[11px] font-bold rounded-full flex items-center justify-center text-primary-foreground shadow-[var(--shadow-glow)]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <NotificationsMenu />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Row 2 - Navigation Menu */}
      <div
        className={cn(
          "bg-background/90 backdrop-blur-sm border-b border-border/50 transition-all duration-300",
          isScrolled ? "h-0 overflow-hidden opacity-0" : "py-2"
        )}
      >
        <div 
          className={cn(
            "mx-auto px-4 flex justify-center transition-all duration-300",
            isSidebarCollapsed ? "max-w-7xl" : "container"
          )}
        >
          <NavigationMenu />
        </div>
      </div>
    </header>
  );
}
