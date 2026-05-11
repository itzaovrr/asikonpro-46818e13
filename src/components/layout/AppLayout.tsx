import { useState, ReactNode, createContext, useContext, useEffect } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("sidebar:collapsed");
    if (stored === "1") return true;
    if (stored === "0") return false;
    // First visit: auto-collapse on smaller desktops
    return window.innerWidth < 1280;
  });

  // Persist collapse choice
  useEffect(() => {
    window.localStorage.setItem("sidebar:collapsed", isCollapsed ? "1" : "0");
  }, [isCollapsed]);

  // Auto-collapse when crossing the 1280px breakpoint (only if user hasn't pinned otherwise recently)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e: MediaQueryListEvent) => {
      // Only react if user hasn't explicitly chosen via the toggle this session
      const userPinned = window.sessionStorage.getItem("sidebar:user-pinned");
      if (userPinned) return;
      setIsCollapsed(!e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Cmd/Ctrl + B keyboard toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        window.sessionStorage.setItem("sidebar:user-pinned", "1");
        setIsCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCollapsedChange = (next: boolean) => {
    window.sessionStorage.setItem("sidebar:user-pinned", "1");
    setIsCollapsed(next);
  };

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
            onCollapsedChange={handleCollapsedChange} 
          />
        )}

        {/* Mobile Search Overlay */}
        <MobileSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Main Content */}
        <main 
          className={cn(
            "min-h-screen transition-all duration-300",
            isMobile && showBottomNav && "pb-20",
            !isMobile && showSidebar && (isCollapsed ? "lg:pl-16" : "lg:pl-60"),
            className
          )}
          style={{ paddingTop: "var(--app-header-h)" }}
        >
          {children}
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        {isMobile && showBottomNav && <BottomNav />}
      </div>
    </SidebarContext.Provider>
  );
}
