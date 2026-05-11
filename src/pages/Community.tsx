import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { CreateContentFAB } from "@/components/community/CreateContentFAB";
import { MyFeedTab } from "@/components/community/tabs/MyFeedTab";
import { PostsTab } from "@/components/community/tabs/PostsTab";
import { VideosTab } from "@/components/community/tabs/VideosTab";
import { ShortsTab } from "@/components/community/tabs/ShortsTab";
import { ReviewsTab } from "@/components/community/tabs/ReviewsTab";
import { LiveTab } from "@/components/community/tabs/LiveTab";
import { OffersTab } from "@/components/community/tabs/OffersTab";
import { GalleryTab } from "@/components/community/tabs/GalleryTab";
import { CommunityTab } from "@/types/community";
import { useScrollDirection } from "@/hooks/use-scroll-direction";


const Community = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>("my-feed");
  const { scrollDirection, isScrolled } = useScrollDirection();
  const headerHidden = scrollDirection === "down" && isScrolled;

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-feed":
        return <MyFeedTab />;
      case "posts":
        return <PostsTab />;
      case "videos":
        return <VideosTab />;
      case "shorts":
        return <ShortsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "live":
        return <LiveTab />;
      case "offers":
        return <OffersTab />;
      case "gallery":
        return <GalleryTab />;
      default:
        return <MyFeedTab />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Sticky tab bar — uses --app-header-h so the offset always matches the
            real header height (incl. iOS safe-area). Animates `top` smoothly and
            slides flush to the top when the mobile header hides on scroll-down.
            Sticky keeps its slot in document flow → no layout shift. */}
        <div
          className="sticky z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-[top] duration-300 ease-out will-change-[top]"
          style={{ top: headerHidden ? 0 : "var(--app-header-h)" }}
        >
          <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <main>{renderTabContent()}</main>

        {/* Create Content FAB */}
        <CreateContentFAB />
      </div>
    </AppLayout>
  );
};

export default Community;

