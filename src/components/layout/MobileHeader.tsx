import { useRef } from "react";
import { ShoppingCart, Search, Bell, Menu } from "lucide-react";
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
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);
  const { isScrolled } = useScrollDirection();

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        "bg-background/70 backdrop-blur-xl",
        "border-b",
        isScrolled
          ? "border-border/60 shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.35)]"
          : "border-transparent"
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Subtle brand glow line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-70"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="flex items-center gap-2 h-14 px-3">
        {/* Menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-foreground/90 hover:bg-secondary/60 active:scale-95 transition focus-ring"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo / Wordmark */}
        <Link
          to="/"
          aria-label="Asikon home"
          className="flex items-center gap-2 px-1 py-1 rounded-lg active:scale-95 transition"
        >
          <span className="relative flex items-center justify-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full blur-md opacity-60"
              style={{ background: "var(--gradient-primary)" }}
            />
            <img src={logo} alt="" className="relative w-7 h-7 rounded-full" />
          </span>
          <span className="text-lg font-bold tracking-tight text-gradient leading-none">
            Asikon
          </span>
        </Link>

        {/* Inline search pill — bigger tap target than an icon */}
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          className="ml-1 flex-1 min-w-0 h-9 inline-flex items-center gap-2 px-3 rounded-full border border-border/60 bg-secondary/40 hover:bg-secondary/60 text-muted-foreground text-xs transition focus-ring"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate">Search courses, prompts…</span>
        </button>

        {/* Right cluster */}
        <div className="flex items-center gap-0.5">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-foreground/90 hover:bg-secondary/60 active:scale-95 transition focus-ring"
          >
            <Bell className="w-5 h-5" />
            <span
              aria-hidden
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]"
            />
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-foreground/90 hover:bg-secondary/60 active:scale-95 transition focus-ring"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-primary)" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
