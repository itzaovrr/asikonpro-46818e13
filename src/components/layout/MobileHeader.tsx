import { useRef } from "react";
import { Menu, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  cartCount?: number;
}

export function MobileHeader({ onMenuClick, onSearchClick, cartCount = 0 }: MobileHeaderProps) {
  const { isScrolled } = useScrollDirection();
  // Header is the "first tab": visible only at the very top. Once the user
  // scrolls, it slides away so the page tabs (second bar) become the sticky top.
  const isHidden = isScrolled;
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border transition-transform duration-300 will-change-transform",
        isHidden && "-translate-y-full"
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left - Menu */}
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </Button>

        {/* Center - Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <img src={logo} alt="Asikon logo" className="w-7 h-7" />
          <h1 className="text-xl font-bold text-gradient">Asikon</h1>
        </Link>

        {/* Right - Search & Cart */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onSearchClick}>
            <Search className="w-5 h-5" />
          </Button>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
