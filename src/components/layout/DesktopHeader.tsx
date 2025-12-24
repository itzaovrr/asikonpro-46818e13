import { ShoppingCart, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { TrustStrip } from "./TrustStrip";

interface DesktopHeaderProps {
  showTrustStrip?: boolean;
  cartCount?: number;
}

export function DesktopHeader({ showTrustStrip = true, cartCount = 0 }: DesktopHeaderProps) {
  const { isScrolled } = useScrollDirection();

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Trust Strip */}
      <TrustStrip show={showTrustStrip && !isScrolled} />

      {/* Main Header */}
      <div
        className={cn(
          "bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300",
          isScrolled ? "py-2" : "py-3"
        )}
      >
        <div className="container mx-auto px-4 flex items-center gap-6">
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
          <SmartSearch className="flex-1 max-w-xl mx-auto" />

          {/* Right - Icons */}
          <div className="flex items-center gap-2">
            <Link to="/community">
              <Button variant="ghost" size="icon" title="Community">
                <Users className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="ghost" size="icon" title="Shop">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" title="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
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
    </header>
  );
}
