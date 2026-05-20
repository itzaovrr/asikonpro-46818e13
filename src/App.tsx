import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "@/lib/currency";
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
const MentorsMod = () => import("./pages/Mentors");
const LearnMod = () => import("./pages/Learn");
const NotFoundMod = () => import("./pages/NotFound");
const ResetPasswordMod = () => import("./pages/ResetPassword");
const AboutMod = () => import("./pages/About");
const PromptsMod = () => import("./pages/Prompts");
const AdminLayoutMod = () => import("./pages/admin/AdminLayout");
const AdminOverviewMod = () => import("./pages/admin/AdminOverview");
const AdminUsersMod = () => import("./pages/admin/AdminUsers");
const AdminProductsMod = () => import("./pages/admin/AdminProducts");
const AdminCategoriesMod = () => import("./pages/admin/AdminCategories");
const AdminOrdersMod = () => import("./pages/admin/AdminOrders");
const AdminCommunityMod = () => import("./pages/admin/AdminCommunity");
const AdminMentorsMod = () => import("./pages/admin/AdminMentors");
const AdminSettingsMod = () => import("./pages/admin/AdminSettings");
const AdminHomeSectionsMod = () => import("./pages/admin/AdminHomeSections");
const AdminTracksMod = () => import("./pages/admin/AdminTracks");
const AdminLessonsMod = () => import("./pages/admin/AdminLessons");

const TrackDetailMod = () => import("./pages/TrackDetail");
const LessonDetailMod = () => import("./pages/LessonDetail");

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
const Mentors = lazy(MentorsMod);
const Learn = lazy(LearnMod);
const NotFound = lazy(NotFoundMod);
const About = lazy(AboutMod);
const Prompts = lazy(PromptsMod);
const AdminLayout = lazy(AdminLayoutMod);
const AdminOverview = lazy(AdminOverviewMod);
const AdminUsers = lazy(AdminUsersMod);
const AdminProducts = lazy(AdminProductsMod);
const AdminCategories = lazy(AdminCategoriesMod);
const AdminOrders = lazy(AdminOrdersMod);
const AdminCommunity = lazy(AdminCommunityMod);
const AdminMentors = lazy(AdminMentorsMod);
const AdminSettings = lazy(AdminSettingsMod);
const AdminHomeSections = lazy(AdminHomeSectionsMod);
const AdminTracks = lazy(AdminTracksMod);
const AdminLessons = lazy(AdminLessonsMod);
const TrackDetail = lazy(TrackDetailMod);
const LessonDetail = lazy(LessonDetailMod);

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
  const hideOn = ["/auth", "/asikonasik", "/checkout", "/lesson", "/create", "/reset-password"];
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
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
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
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:threadId" element={<Learn />} />
          <Route path="/about" element={<About />} />
          <Route path="/prompts" element={<Prompts />} />
          
          <Route path="/track/:slug" element={<TrackDetail />} />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/asikonasik" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="community" element={<AdminCommunity />} />
            <Route path="mentors" element={<AdminMentors />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="home-sections" element={<AdminHomeSections />} />
            <Route path="tracks" element={<AdminTracks />} />
            <Route path="lessons" element={<AdminLessons />} />
          </Route>
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
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            {/* Persistent app-shell: never remounts on route changes */}
            <PersistentMobileShell />
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
