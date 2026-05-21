import { useRef } from "react";
import { ShoppingCart, Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { isInnerRoute, getRouteTitle, getActiveTab } from "@/lib/nav-map";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  cartCount?: number;
}

const tabTitles: Record<string, string> = {
  home: "Asikon",
  explore: "Explore",
  ai: "AI Tutor",
  community: "Community",
  profile: "My Profile",
};

export function MobileHeader({ onMenuClick, onSearchClick, cartCount = 0 }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const inner = isInnerRoute(pathname);
  const activeTab = getActiveTab(pathname);
  const tabTitle = activeTab ? tabTitles[activeTab] : "Asikon";
  const innerTitle = getRouteTitle(pathname);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 liquid-nav border-b border-border/40"
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between h-13 px-3" style={{ height: 52 }}>
        {/* Left — back chevron on inner routes, otherwise logo + tab title */}
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex items-center gap-1.5 -ml-1 px-2 py-1 rounded-xl bg-background/10 hover:bg-background/15 active:scale-95 transition min-w-0"
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span className="text-[15px] font-semibold tracking-tight truncate max-w-[220px]">{innerTitle}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex items-center gap-2 -ml-1 px-1.5 py-1 rounded-xl bg-background/10 hover:bg-background/15 active:scale-95 transition min-w-0"
          >
            <img src={logo} alt="Asikon logo" className="w-7 h-7 shrink-0" />
            <h1 className="text-[16px] font-bold text-gradient leading-none tracking-tight truncate">{tabTitle}</h1>
          </button>
        )}

        {/* Right — Search + Cart only (minimal) */}
        <div className="flex items-center gap-1 rounded-2xl border border-border/30 bg-background/10 px-1 py-0.5 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.08)]">
          <Button variant="ghost" size="icon" onClick={onSearchClick} aria-label="Search">
            <Search className="w-5 h-5" />
          </Button>
          <Link to="/cart" aria-label="Cart">
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

