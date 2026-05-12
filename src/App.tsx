import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { PageTransition } from "@/components/transitions/PageTransition";
import { BottomNav } from "@/components/layout/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { installFetchTimer, logRoute } from "@/lib/perf";
import Index from "./pages/Index";

installFetchTimer();

// Lazy-load non-initial routes to reduce initial JS bundle.
// Module references are kept so we can warm them on idle for instant nav.
const ShopMod = () => import("./pages/Shop");
const CommunityMod = () => import("./pages/Community");
const GameMod = () => import("./pages/Game");
const ProfileMod = () => import("./pages/Profile");
const CartMod = () => import("./pages/Cart");
const AuthMod = () => import("./pages/Auth");
const ProductDetailMod = () => import("./pages/ProductDetail");
const CheckoutMod = () => import("./pages/Checkout");
const OrdersMod = () => import("./pages/Orders");
const OrderDetailMod = () => import("./pages/OrderDetail");
const WishlistMod = () => import("./pages/Wishlist");
const SettingsMod = () => import("./pages/Settings");
const CreateContentMod = () => import("./pages/CreateContent");
const PodMod = () => import("./pages/Pod");
const PodDesignsMod = () => import("./pages/PodDesigns");
const PodUploadMod = () => import("./pages/PodUpload");
const LearnMod = () => import("./pages/Learn");
const NotFoundMod = () => import("./pages/NotFound");
const ResetPasswordMod = () => import("./pages/ResetPassword");
const AboutMod = () => import("./pages/About");

const Shop = lazy(ShopMod);
const Community = lazy(CommunityMod);
const Game = lazy(GameMod);
const Profile = lazy(ProfileMod);
const Cart = lazy(CartMod);
const Auth = lazy(AuthMod);
const ResetPassword = lazy(ResetPasswordMod);
const ProductDetail = lazy(ProductDetailMod);
const Checkout = lazy(CheckoutMod);
const Orders = lazy(OrdersMod);
const OrderDetail = lazy(OrderDetailMod);
const Wishlist = lazy(WishlistMod);
const Settings = lazy(SettingsMod);
const CreateContent = lazy(CreateContentMod);
const Pod = lazy(PodMod);
const PodDesigns = lazy(PodDesignsMod);
const PodUpload = lazy(PodUploadMod);
const Learn = lazy(LearnMod);
const NotFound = lazy(NotFoundMod);
const About = lazy(AboutMod);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — dedupe redundant refetches across mounts
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Prefetch the most likely next routes once the browser is idle.
 * Keeps initial bundle tiny while making subsequent nav feel instant.
 */
function useIdlePrefetch() {
  useEffect(() => {
    const idle = (cb: () => void) => {
      const w = window as any;
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(cb, { timeout: 2500 });
      } else {
        setTimeout(cb, 1500);
      }
    };
    idle(() => {
      ShopMod();
      LearnMod();
      ProductDetailMod();
      AuthMod();
    });
  }, []);
}

function PersistentMobileShell() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  // Hide nav on auth/onboarding-style routes; otherwise keep mounted permanently.
  const hideOn = ["/auth"];
  if (!isMobile || hideOn.some((p) => pathname.startsWith(p))) return null;
  return <BottomNav />;
}

function AnimatedRoutes() {
  const location = useLocation();
  useIdlePrefetch();
  useEffect(() => { logRoute(location.pathname); }, [location.pathname]);

  return (
    <PageTransition key={location.pathname}>
      <Suspense fallback={null}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<CreateContent />} />
          <Route path="/pod" element={<Pod />} />
          <Route path="/pod/designs" element={<PodDesigns />} />
          <Route path="/pod/upload" element={<PodUpload />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:threadId" element={<Learn />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          {/* Persistent app-shell: never remounts on route changes */}
          <PersistentMobileShell />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
