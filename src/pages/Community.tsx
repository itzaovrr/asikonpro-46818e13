import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { CreateContentFAB } from "@/components/community/CreateContentFAB";
import { CommunityRightRail } from "@/components/community/CommunityRightRail";
import { MyFeedTab } from "@/components/community/tabs/MyFeedTab";
import { PostsTab } from "@/components/community/tabs/PostsTab";
import { VideosTab } from "@/components/community/tabs/VideosTab";
import { ShortsTab } from "@/components/community/tabs/ShortsTab";
import { ReviewsTab } from "@/components/community/tabs/ReviewsTab";
import { LiveTab } from "@/components/community/tabs/LiveTab";
import { OffersTab } from "@/components/community/tabs/OffersTab";
import { CommunityTab } from "@/types/community";

const Community = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>("my-feed");

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-feed": return <MyFeedTab />;
      case "posts": return <PostsTab />;
      case "videos": return <VideosTab />;
      case "shorts": return <ShortsTab />;
      case "reviews": return <ReviewsTab />;
      case "live": return <LiveTab />;
      case "offers": return <OffersTab />;
      default: return <MyFeedTab />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Sticky tab bar — true glass with hairline */}
        <div
          data-sticky-tabs
          className="sticky z-30 bg-background/65 backdrop-blur-2xl hairline-bottom"
          style={{ top: "var(--app-header-h)" }}
        >
          <div className="container-editorial">
            <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {/* Two-column desktop layout */}
        <div className="container-editorial pt-4 lg:pt-6">
          <div className="flex gap-6">
            <main
              data-feed-root
              key={activeTab}
              className="animate-fade-in flex-1 min-w-0 space-y-4"
            >
              {renderTabContent()}
            </main>
            <CommunityRightRail />
          </div>
        </div>

        <CreateContentFAB />
      </div>
    </AppLayout>
  );
};

export default Community;
