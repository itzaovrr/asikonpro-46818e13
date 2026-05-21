import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { TrustStrip } from "./TrustStrip";
import { MegaMenu } from "./MegaMenu";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import logo from "@/assets/logo.png";

interface HomeTopHeaderProps {
  showTrustStrip?: boolean;
  cartCount?: number;
}

/**
 * Full-width top header used only on the home page.
 * Features a mega menu. No sidebar is rendered on home.
 */
export function HomeTopHeader({ showTrustStrip = true, cartCount = 0 }: HomeTopHeaderProps) {
  const { isScrolled } = useScrollDirection();
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
    >
      <TrustStrip show={showTrustStrip && !isScrolled} />

      {/* Section 1 — Core: logo, search (center), actions */}
      <div
        className={cn(
          "hairline-bottom transition-all duration-300",
          "bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55",
          isScrolled ? "py-2" : "py-3"
        )}
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--glass-highlight) / 0.04), transparent 60%)",
        }}
      >
        <div className="container-editorial grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo (left) */}
          <Link to="/" className="group flex-shrink-0 flex items-center gap-2.5">
            <span
              className={cn(
                "relative grid place-items-center rounded-xl transition-all duration-300",
                "ring-1 ring-border/60 bg-card/70 backdrop-blur-xl",
                isScrolled ? "h-9 w-9" : "h-10 w-10"
              )}
            >
              <img
                src={logo}
                alt="Asikon logo"
                className={cn("transition-all duration-300", isScrolled ? "w-5 h-5" : "w-6 h-6")}
              />
            </span>
            <div className="leading-none hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                ​
              </p>
              <h1
                className={cn(
                  "font-display font-bold text-gradient transition-all duration-300",
                  isScrolled ? "text-lg text-gray-50" : "text-xl"
                )}
              >
                Asikon
              </h1>
            </div>
          </Link>

          {/* Search (center) */}
          <SmartSearch className="w-full max-w-2xl mx-auto" />

          {/* Actions (right) */}
          <div className="flex items-center gap-1.5 justify-self-end">
            <CurrencyToggle />
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-secondary/60"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-[var(--shadow-glow)]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <NotificationsMenu />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Section 2 — Premium Mega Menu */}
      <div
        className={cn(
          "hairline-bottom transition-all duration-300 overflow-hidden",
          "bg-background/40 backdrop-blur-xl",
          "[background-image:linear-gradient(180deg,hsl(var(--primary)/0.04),transparent_70%)]",
          isScrolled ? "h-0 opacity-0 py-0" : "py-1.5 opacity-100"
        )}
      >
        <div className="container-editorial flex items-center justify-center">
          <MegaMenu />
        </div>
      </div>
    </header>
  );
}
