// Single source of truth mapping pathname → active mobile tab.
// Used by BottomNav (active chip) and MobileHeader (title + back chevron).

export type TabId = "home" | "learn" | "shop" | "profile" | null;

export interface TabDef {
  id: Exclude<TabId, null>;
  label: string;
  path: string;
  // Path prefixes that should also light this tab.
  matches: string[];
}

export const TABS: TabDef[] = [
  { id: "home", label: "Home", path: "/", matches: ["/community", "/pod"] },
  { id: "learn", label: "Learn", path: "/learn", matches: ["/learn", "/track", "/lesson"] },
  { id: "shop", label: "Shop", path: "/shop", matches: ["/shop", "/product", "/cart", "/checkout", "/orders", "/wishlist"] },
  { id: "profile", label: "Profile", path: "/profile", matches: ["/profile", "/settings", "/about"] },
];

export function getActiveTab(pathname: string): TabId {
  if (pathname === "/") return "home";
  // Order matters — most specific prefixes first.
  for (const tab of TABS) {
    if (tab.id === "home") continue; // home handled above
    if (tab.matches.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname === p)) {
      return tab.id;
    }
  }
  // Community / pod under Home
  if (pathname.startsWith("/community") || pathname.startsWith("/pod")) return "home";
  return null;
}

// Routes that should show a back chevron instead of a tab title.
export function isInnerRoute(pathname: string): boolean {
  if (pathname === "/") return false;
  const tabRoots = ["/learn", "/shop", "/profile", "/community"];
  if (tabRoots.includes(pathname)) return false;
  return true;
}

export function getRouteTitle(pathname: string): string {
  if (pathname === "/") return "Asikon";
  if (pathname.startsWith("/learn")) return "Learn";
  if (pathname.startsWith("/track")) return "Track";
  if (pathname.startsWith("/lesson")) return "Lesson";
  if (pathname.startsWith("/product")) return "Product";
  if (pathname === "/shop") return "Shop";
  if (pathname === "/cart") return "Cart";
  if (pathname.startsWith("/checkout")) return "Checkout";
  if (pathname.startsWith("/orders")) return "Orders";
  if (pathname === "/wishlist") return "Wishlist";
  if (pathname === "/profile") return "Profile";
  if (pathname === "/settings") return "Settings";
  if (pathname === "/about") return "About";
  if (pathname === "/community") return "Community";
  if (pathname.startsWith("/pod")) return "Print on Demand";
  if (pathname === "/create") return "Create";
  return "Asikon";
}
