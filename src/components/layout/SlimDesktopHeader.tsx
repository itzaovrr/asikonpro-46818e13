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
import { Breadcrumbs } from "./Breadcrumbs";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface SlimDesktopHeaderProps {
  cartCount?: number;
  isSidebarCollapsed?: boolean;
}

/**
 * Compact one-row header for non-home pages. Sits to the right of the sidebar.
 * No mega menu, no logo (logo lives in the sidebar).
 */
export function SlimDesktopHeader({
  cartCount = 0,
  isSidebarCollapsed = false,
}: SlimDesktopHeaderProps) {
  const { isScrolled } = useScrollDirection();
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 right-0 z-40 transition-all duration-300",
        isSidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      <div
        className={cn(
          "hairline-bottom transition-all duration-300",
          "bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55",
          isScrolled ? "py-1.5" : "py-2.5"
        )}
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--glass-highlight) / 0.04), transparent 60%)",
        }}
      >
        <div className="flex items-center gap-4 px-4 lg:px-6">
          <Breadcrumbs />
          <SmartSearch className="flex-1 max-w-lg ml-auto" />
          <div className="flex items-center gap-1.5">
            <CurrencyToggle />
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl hover:bg-secondary/60"
                title="Cart"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-[var(--shadow-glow)] min-w-[18px] h-[18px]">
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
    </header>
  );
}
