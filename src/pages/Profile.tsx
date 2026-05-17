import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import {
  ProfileHeader,
  ProfileStats,
  ProfileBadges,
  ProfileActions,
  ProfileTrustCard,
  ProfileTabs,
  ProfileFeedTab,
  ProfileShopTab,
  ProfileReviewsTab,
  ProfileMediaTab,
  ProfileActivityTab,
  ProfileEditModal,
  AvatarViewer,
  type ProfileTabType,
} from "@/components/profile";
import { MessagingDrawer } from "@/components/messaging";
import { useProfile, useUpdateProfile, useFollowers, useFollowing, useFollowUser, useUnfollowUser } from "@/hooks/useProfile";
import { useLearnerProgress } from "@/hooks/useLearnerProgress";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrGetChat } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/lib/mock-data";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const { user } = useAuth();
  
  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;
  
  const { data: profile, isLoading: profileLoading } = useProfile(targetUserId);
  const { progress: learnerProgress } = useLearnerProgress(targetUserId);
  const { data: followers } = useFollowers(targetUserId || "");
  const { data: following } = useFollowing(targetUserId || "");
  const { data: userPosts } = usePosts({ userId: targetUserId, limit: 20 });
  const updateProfile = useUpdateProfile();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const [activeTab, setActiveTab] = useState<ProfileTabType>("feed");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarViewer, setShowAvatarViewer] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  const createOrGetChat = useCreateOrGetChat();
  const { toast } = useToast();

  const handleMessage = async () => {
    if (!targetUserId || !user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to send messages.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createOrGetChat.mutateAsync(targetUserId);
      setShowMessages(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation.",
        variant: "destructive",
      });
    }
  };

  // Check if current user is following this profile
  const isFollowing = followers?.some(f => f.follower_id === user?.id) || false;

  const handleFollow = async () => {
    if (!targetUserId || !user) return;
    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(targetUserId);
      } else {
        await followUser.mutateAsync(targetUserId);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  const handleSaveProfile = async (updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    cover_url?: string;
  }) => {
    await updateProfile.mutateAsync(updates);
  };

  if (profileLoading) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Fallback data for display
  const displayProfile = {
    id: profile?.id || targetUserId || "",
    name: profile?.full_name || profile?.username || "Anonymous User",
    username: profile?.username || "user",
    avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    coverImage: profile?.cover_url,
    bio: profile?.bio || "",
    location: undefined,
    isVerified: profile?.is_verified || false,
    trustScore: profile?.trust_score || 0,
    isOnline: isOwnProfile,
  };

  // Transform posts for feed tab
  const feedPosts = (userPosts || []).map((post) => ({
    id: post.id,
    content: post.content || "",
    image: post.images?.[0],
    video: post.video_url || undefined,
    likes: post.like_count || 0,
    comments: post.comment_count || 0,
    shares: post.share_count || 0,
    timestamp: new Date(post.created_at || "").toLocaleDateString(),
    product: undefined,
  }));

  // Mock data for other tabs (would be replaced with real data)
  const shopProducts = mockProducts.map((p, idx) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    price: p.price,
    rating: p.rating || 4.5,
    reviewCount: p.reviews || 0,
    isPurchased: idx % 2 === 0,
    isReviewed: idx % 3 === 0,
    isSold: idx === 0,
  }));

  const mockReviews = [
    {
      id: "1",
      productId: mockProducts[0].id,
      productName: mockProducts[0].name,
      productImage: mockProducts[0].image,
      rating: 5,
      title: "This course changed how I learn AI",
      content: "The AI tutor explains tough concepts in seconds. Projects feel real and the community is super supportive.",
      images: [mockProducts[0].image],
      helpfulCount: 87,
      isVerifiedPurchase: true,
      createdAt: "2 days ago",
    },
    {
      id: "2",
      productId: mockProducts[2].id,
      productName: mockProducts[2].name,
      productImage: mockProducts[2].image,
      rating: 5,
      title: "Must-read for every student",
      content: "Atomic Habits paired with the Asikon planner totally rebuilt my study routine.",
      images: [],
      helpfulCount: 52,
      isVerifiedPurchase: true,
      createdAt: "1 week ago",
    },
  ];

  const mockMedia = [
    { id: "1", type: "image" as const, thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400", url: "" },
    { id: "2", type: "video" as const, thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400", url: "", duration: 45, viewCount: 1200 },
  ];


  const mockActivities = [
    { id: "1", type: "coins" as const, title: "Earned coins", description: "Lesson completion bonus", timestamp: "2 hours ago", metadata: { amount: 50 } },
  ];

  const handleStatClick = (stat: string) => {
    console.log("Stat clicked:", stat);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "feed":
        return <ProfileFeedTab posts={feedPosts} user={{ ...displayProfile, isVerified: displayProfile.isVerified }} />;
      case "shop":
        return <ProfileShopTab products={shopProducts} isPodCreator={true} />;
      case "reviews":
        return <ProfileReviewsTab reviews={mockReviews} />;
      case "media":
        return <ProfileMediaTab media={mockMedia} />;
      case "activity":
        return <ProfileActivityTab activities={mockActivities} />;
      default:
        return null;
    }
  };

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        {/* Header (full-width) */}
        <ProfileHeader 
          user={displayProfile}
          isOwnProfile={isOwnProfile}
          onAvatarClick={() => displayProfile.avatar && setShowAvatarViewer(true)}
          onEditProfile={() => setShowEditModal(true)}
          onUpdate={async (updates) => {
            await updateProfile.mutateAsync(updates);
          }}
        />

        <div className="container-editorial pt-4 lg:pt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-12">
            {/* Left rail — sticky on desktop */}
            <aside className="space-y-4 lg:space-y-5 lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start">
              <ProfileStats
                followers={followers?.length || 0}
                following={following?.length || 0}
                posts={userPosts?.length || 0}
                purchases={0}
                reviews={mockReviews.length}
                coins={0}
                onStatClick={handleStatClick}
              />
              <ProfileActions
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                onFollow={handleFollow}
                onEditProfile={() => setShowEditModal(true)}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({ title: displayProfile.name, url: window.location.href });
                  }
                }}
                onMessage={handleMessage}
                onReport={() => console.log("Report user")}
                onBlock={() => console.log("Block user")}
              />
              <ProfileTrustCard
                trustScore={displayProfile.trustScore}
                coins={0}
                level="Bronze"
                onViewDetails={() => console.log("View trust details")}
              />
              <ProfileBadges
                badges={displayProfile.isVerified ? ["trusted"] : []}
                learnerSessions={learnerProgress.sessions}
                learnerQuizzes={learnerProgress.quizzes}
              />
            </aside>

            {/* Right column — tabs + content */}
            <div className="min-w-0">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={{
                  feed: userPosts?.length || 0,
                  reviews: mockReviews.length,
                }}
              />

              <div key={activeTab} className="pb-6 animate-fade-in">
                {renderTabContent()}
              </div>

              {/* About Asikon */}
              <section className="pt-4">
                <h2 className="font-display font-semibold text-lg mb-3">About ASIKON</h2>
                <MissionVision />
              </section>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isOwnProfile && profile && (
          <ProfileEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            profile={profile}
            onSave={handleSaveProfile}
          />
        )}

        {/* Avatar Viewer */}
        <AvatarViewer
          isOpen={showAvatarViewer}
          onClose={() => setShowAvatarViewer(false)}
          imageUrl={displayProfile.avatar}
          userName={displayProfile.name}
        />

        {/* Messaging Drawer */}
        <MessagingDrawer
          open={showMessages}
          onOpenChange={setShowMessages}
        />
      </div>
    </AppLayout>
  );
};

export default Profile;
