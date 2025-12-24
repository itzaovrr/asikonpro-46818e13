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
import { CommunityTab } from "@/types/community";

const Community = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>("my-feed");

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
      default:
        return <MyFeedTab />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Tabs - Sticky below header */}
        <div className="sticky top-14 md:top-[72px] z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <main>
          {renderTabContent()}
        </main>

        {/* Create Content FAB */}
        <CreateContentFAB />
      </div>
    </AppLayout>
  );
};

export default Community;
