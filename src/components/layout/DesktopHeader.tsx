import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { TrustStrip } from "./TrustStrip";
import { NavigationMenu } from "./NavigationMenu";

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

  return (
    <header 
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
          "bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300",
          isScrolled ? "py-2" : "py-3"
        )}
      >
        <div 
          className={cn(
            "mx-auto px-4 flex items-center gap-6 transition-all duration-300",
            isSidebarCollapsed ? "max-w-7xl" : "container"
          )}
        >
          {/* Left - Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className={cn(
              "font-bold text-gradient transition-all duration-300",
              isScrolled ? "text-xl" : "text-2xl"
            )}>
              KEYZET
            </h1>
          </Link>

          {/* Center - Search */}
          <SmartSearch className="flex-1 max-w-2xl mx-auto" />

          {/* Right - Icons */}
          <div className="flex items-center gap-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-10 w-10" title="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
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
