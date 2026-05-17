import { useRef, useState } from "react";
import { ShoppingCart, Search, ChevronLeft, MoreHorizontal, Heart, Package, GraduationCap, Info, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { isInnerRoute, getRouteTitle, getActiveTab } from "@/lib/nav-map";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

const overflowItems = [
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: Package, label: "Orders", path: "/orders" },
  { icon: GraduationCap, label: "1-on-1 Mentorship", path: "/mentors" },
  { icon: Sparkles, label: "Prompts", path: "/prompts" },
  { icon: Info, label: "About", path: "/about" },
  { icon: SettingsIcon, label: "Settings", path: "/settings" },
];

export function MobileHeader({ onMenuClick, onSearchClick, cartCount = 0 }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const inner = isInnerRoute(pathname);
  const activeTab = getActiveTab(pathname);
  const tabTitle = activeTab ? tabTitles[activeTab] : "Asikon";
  const innerTitle = getRouteTitle(pathname);
  const [moreOpen, setMoreOpen] = useState(false);

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
        {/* Left — back chevron on inner routes, otherwise logo + tab title */}
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex items-center gap-2 -ml-1 px-2 py-1 rounded-lg hover:bg-secondary/60 active:scale-95 transition min-w-0"
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span className="text-base font-semibold truncate max-w-[200px]">{innerTitle}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex items-center gap-2 -ml-1 px-1 py-1 rounded-lg hover:bg-secondary/60 active:scale-95 transition min-w-0"
          >
            <img src={logo} alt="Asikon logo" className="w-8 h-8 shrink-0" />
            <h1 className="text-lg font-bold text-gradient leading-none truncate">{tabTitle}</h1>
          </button>
        )}

        {/* Right — Currency, Search, Cart, More */}
        <div className="flex items-center gap-0.5">
          <CurrencyToggle />
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

          {/* Overflow sheet — for items not in the 5-tab bar */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl pb-8">
              <SheetHeader>
                <SheetTitle>More</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {overflowItems.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Link
                      key={m.path}
                      to={m.path}
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/40 border border-border/40 active:scale-95 transition"
                    >
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-medium text-center leading-tight">{m.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
