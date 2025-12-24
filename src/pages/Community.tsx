import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { CommunityHeader } from "@/components/community/CommunityHeader";
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
    <MobileLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <CommunityHeader />
          <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </header>

        {/* Tab Content */}
        <main className="pb-20">
          {renderTabContent()}
        </main>

        {/* Create Content FAB */}
        <CreateContentFAB />
      </div>
    </MobileLayout>
  );
};

export default Community;
