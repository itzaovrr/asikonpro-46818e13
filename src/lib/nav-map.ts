// Single source of truth mapping pathname → active mobile tab.
// Used by BottomNav (active chip) and MobileHeader (title + back chevron).

export type TabId = "home" | "explore" | "ai" | "community" | "profile" | null;

export interface TabDef {
  id: Exclude<TabId, null>;
  label: string;
  path: string;
  matches: string[];
}

export const TABS: TabDef[] = [
  { id: "home", label: "Home", path: "/", matches: [] },
  { id: "explore", label: "Explore", path: "/shop", matches: ["/shop", "/product", "/cart", "/checkout", "/orders", "/wishlist", "/mentors"] },
  { id: "ai", label: "AI", path: "/learn", matches: ["/learn", "/track", "/lesson", "/prompts"] },
  { id: "community", label: "Community", path: "/community", matches: ["/community", "/create"] },
  { id: "profile", label: "Profile", path: "/profile", matches: ["/profile", "/settings", "/about"] },
];

export function getActiveTab(pathname: string): TabId {
  if (pathname === "/") return "home";
  for (const tab of TABS) {
    if (tab.id === "home") continue;
    if (tab.matches.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return tab.id;
    }
  }
  return null;
}

export function isInnerRoute(pathname: string): boolean {
  if (pathname === "/") return false;
  const tabRoots = ["/learn", "/shop", "/profile", "/community"];
  if (tabRoots.includes(pathname)) return false;
  return true;
}

export function getRouteTitle(pathname: string): string {
  if (pathname === "/") return "Asikon";
  if (pathname.startsWith("/learn")) return "AI Tutor";
  if (pathname.startsWith("/track")) return "Track";
  if (pathname.startsWith("/lesson")) return "Lesson";
  if (pathname.startsWith("/product")) return "Product";
  if (pathname === "/shop") return "Explore";
  if (pathname === "/cart") return "Cart";
  if (pathname.startsWith("/checkout")) return "Checkout";
  if (pathname.startsWith("/orders")) return "Orders";
  if (pathname === "/wishlist") return "Wishlist";
  if (pathname === "/profile") return "My Profile";
  if (pathname === "/settings") return "Settings";
  if (pathname === "/about") return "About";
  if (pathname === "/community") return "Community";
  if (pathname.startsWith("/mentors")) return "Mentorship";
  if (pathname === "/create") return "Create";
  if (pathname === "/prompts") return "Prompts";
  return "Asikon";
}
