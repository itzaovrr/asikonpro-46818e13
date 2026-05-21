import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { MobilePage } from "@/components/layout/MobilePage";

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
      <Helmet>
        <title>Community — Asikon Learners</title>
        <meta name="description" content="Follow learners, share posts, watch videos and read trusted reviews on the Asikon community." />
      </Helmet>
      <MobilePage
        sticky={<CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />}
        spacing="space-y-4"
      >
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
      </MobilePage>
      <CreateContentFAB />
    </AppLayout>
  );
};

export default Community;
