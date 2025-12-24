import { useState, ReactNode, createContext, useContext } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";
import { DesktopSidebar } from "./DesktopSidebar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileSearchOverlay } from "@/components/search/MobileSearchOverlay";
import { cn } from "@/lib/utils";

// Context to share sidebar state
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebarState = () => useContext(SidebarContext);

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock cart count - TODO: Replace with real cart state
  const cartCount = 2;

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        {isMobile ? (
          <MobileHeader
            onMenuClick={() => setSidebarOpen(true)}
            onSearchClick={() => setSearchOpen(true)}
            cartCount={cartCount}
          />
        ) : (
          <DesktopHeader 
            showTrustStrip={showTrustStrip} 
            cartCount={cartCount} 
            isSidebarCollapsed={isCollapsed}
          />
        )}

        {/* Mobile Sidebar (Sheet) */}
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        {/* Desktop Sidebar */}
        {!isMobile && showSidebar && (
          <DesktopSidebar 
            isCollapsed={isCollapsed} 
            onCollapsedChange={setIsCollapsed} 
          />
        )}

        {/* Mobile Search Overlay */}
        <MobileSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Main Content */}
        <main 
          className={cn(
            "min-h-screen transition-all duration-300",
            isMobile ? "pt-14" : "pt-[120px]",
            isMobile && showBottomNav && "pb-20",
            !isMobile && showSidebar && (isCollapsed ? "lg:pl-16" : "lg:pl-60"),
            className
          )}
        >
          {children}
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        {isMobile && showBottomNav && <BottomNav />}
      </div>
    </SidebarContext.Provider>
  );
}
