import { useRef } from "react";
import { ShoppingCart, Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { isInnerRoute, getRouteTitle } from "@/lib/nav-map";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  cartCount?: number;
}

export function MobileHeader({ onMenuClick, onSearchClick, cartCount = 0 }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const inner = isInnerRoute(pathname);
  const title = getRouteTitle(pathname);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border"
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between h-14 px-3">
        {/* Left — back chevron on inner routes, otherwise logo+menu */}
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex items-center gap-2 -ml-1 px-2 py-1 rounded-lg hover:bg-secondary/60 active:scale-95 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-base font-semibold truncate max-w-[180px]">{title}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex items-center gap-2 -ml-1 px-1 py-1 rounded-lg hover:bg-secondary/60 active:scale-95 transition"
          >
            <img src={logo} alt="Asikon logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gradient leading-none">
              {pathname === "/" ? "Asikon" : title}
            </h1>
          </button>
        )}

        {/* Right - Currency toggle, Search & Cart */}
        <div className="flex items-center gap-1">
          <CurrencyToggle />
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
