import { useState, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileSearchOverlay } from "@/components/search/MobileSearchOverlay";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  showTrustStrip?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export function AppLayout({ 
  children, 
  showTrustStrip = true,
  showBottomNav = true,
  className 
}: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Mock cart count - TODO: Replace with real cart state
  const cartCount = 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {isMobile ? (
        <MobileHeader
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          cartCount={cartCount}
        />
      ) : (
        <DesktopHeader showTrustStrip={showTrustStrip} cartCount={cartCount} />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Main Content */}
      <main 
        className={cn(
          "min-h-screen",
          isMobile ? "pt-14" : "pt-[72px]",
          isMobile && showBottomNav && "pb-20",
          className
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && showBottomNav && <BottomNav />}
    </div>
  );
}
