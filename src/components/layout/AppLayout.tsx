import { useState, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";
import { DesktopSidebar } from "./DesktopSidebar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileSearchOverlay } from "@/components/search/MobileSearchOverlay";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  showTrustStrip?: boolean;
  showBottomNav?: boolean;
  showSidebar?: boolean;
  className?: string;
}

export function AppLayout({ 
  children, 
  showTrustStrip = true,
  showBottomNav = true,
  showSidebar = true,
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

      {/* Mobile Sidebar (Sheet) */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Desktop Sidebar */}
      {!isMobile && showSidebar && <DesktopSidebar />}

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Main Content */}
      <main 
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile ? "pt-14" : "pt-[120px]",
          isMobile && showBottomNav && "pb-20",
          !isMobile && showSidebar && "lg:pl-60",
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
