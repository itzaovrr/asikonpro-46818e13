import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  ProfileHeader,
  ProfileStats,
  ProfileActions,
  ProfileTabs,
  ProfileFeedTab,
  ProfileMediaTab,
  ProfileReviewsTab,
  ProfileLearningTab,
  ProfileLibraryTab,
  ProfileOrdersTab,
  ProfileWishlistTab,
  ProfileTrustCard,
  ProfileBadges,
  ProfileSkeleton,
  ProfileActivityFeed,
  ProfileCompletionBar,
  ProfileEditModal,
  AvatarViewer,
  FollowersSheet,
  MediaLightbox,
  type ProfileTabType,
} from "@/components/profile";
import { MessagingDrawer } from "@/components/messaging";
import {
  useProfile,
  useUpdateProfile,
  useFollowers,
  useFollowing,
  useFollowUser,
  useUnfollowUser,
} from "@/hooks/useProfile";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrGetChat } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import {
  useUserOrders,
  useUserWishlist,
  useUserLibrary,
  useLearnerStats,
  useProfileCounts,
} from "@/hooks/useProfileData";

type StatSheet = "followers" | "following" | null;

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useParams<{ userId?: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  const { data: profile, isLoading: profileLoading } = useProfile(targetUserId);
  const { data: counts } = useProfileCounts(targetUserId);
  const { data: followers } = useFollowers(targetUserId || "");
  const { data: following } = useFollowing(targetUserId || "");
  const { data: userPosts } = usePosts({ userId: targetUserId, limit: 50 });
  const { data: reviewPosts } = usePosts({ userId: targetUserId, type: "review", limit: 50 });
  const { data: learnerStats } = useLearnerStats(targetUserId);
  const { data: library } = useUserLibrary(targetUserId);
  const { data: orders } = useUserOrders(isOwnProfile ? targetUserId : undefined);
  const { data: wishlist } = useUserWishlist(isOwnProfile ? targetUserId : undefined);

  const updateProfile = useUpdateProfile();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const createOrGetChat = useCreateOrGetChat();

  const [activeTab, setActiveTab] = useState<ProfileTabType>("posts");
  const [showAvatarViewer, setShowAvatarViewer] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [statSheet, setStatSheet] = useState<StatSheet>(null);
  const [showEdit, setShowEdit] = useState(false);

  const isFollowing = followers?.some((f) => f.follower_id === user?.id) || false;

  const handleFollow = async () => {
    if (!targetUserId || !user) {
      toast({ title: "Please login", description: "Sign in to follow users.", variant: "destructive" });
      return;
    }
    try {
      if (isFollowing) await unfollowUser.mutateAsync(targetUserId);
      else await followUser.mutateAsync(targetUserId);
    } catch (e) {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const handleMessage = async () => {
    if (!targetUserId || !user) {
      toast({ title: "Please login", description: "Sign in to send messages.", variant: "destructive" });
      return;
    }
    try {
      const chat = await createOrGetChat.mutateAsync(targetUserId);
      setActiveChatId(chat.id);
      setShowMessages(true);
    } catch {
      toast({ title: "Error", description: "Failed to start conversation.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!targetUserId) return;
    const channel = supabase
      .channel(`followers-${targetUserId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_followers", filter: `following_id=eq.${targetUserId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["followers", targetUserId] });
          queryClient.invalidateQueries({ queryKey: ["profile-counts", targetUserId] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetUserId, queryClient]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: profile?.full_name || "Profile", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      toast({ title: "Link copied" });
    }
  };

  const mediaItems = useMemo(() => {
    const items: { id: string; postId: string; type: "image" | "video"; thumbnail: string }[] = [];
    (userPosts || []).forEach((p: any) => {
      (p.images || []).forEach((img: string, idx: number) =>
        items.push({ id: `${p.id}-${idx}`, postId: p.id, type: "image", thumbnail: img }),
      );
      if (p.video_url && (!p.images || p.images.length === 0)) {
        items.push({ id: `${p.id}-v`, postId: p.id, type: "video", thumbnail: p.video_url });
      }
    });
    return items;
  }, [userPosts]);

  if (profileLoading) return <ProfileSkeleton />;

  const lastSeenAt = (profile as any)?.last_seen_at as string | undefined;
  const isOnlineNow =
    isOwnProfile ||
    (!!lastSeenAt && Date.now() - new Date(lastSeenAt).getTime() < 5 * 60 * 1000);

  const displayProfile = {
    id: profile?.id || targetUserId || "",
    name: profile?.full_name || profile?.username || "Anonymous User",
    username: profile?.username || "user",
    avatar:
      profile?.avatar_url ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    coverImage: profile?.cover_url || undefined,
    coverGradient: (profile as any)?.cover_gradient ?? null,
    bio: profile?.bio || "",
    isVerified: profile?.is_verified || false,
    trustScore: profile?.trust_score ?? 0,
    isOnline: isOnlineNow,
    location: (profile as any)?.location ?? null,
    website: (profile as any)?.website ?? null,
    joinedAt: (profile as any)?.joined_at ?? profile?.created_at ?? null,
  };

  const feedPosts = (userPosts || []).map((p: any) => ({
    id: p.id,
    content: p.content || "",
    images: p.images,
    videoUrl: p.video_url,
    createdAt: p.created_at,
    likeCount: p.like_count || 0,
    commentCount: p.comment_count || 0,
    isLiked: false,
    productSlug: p.products?.slug ?? null,
    productName: p.products?.name ?? null,
  }));

  const reviews = (reviewPosts || []).map((p: any) => ({
    id: p.id,
    rating: (p.rating as number | null) ?? null,
    content: p.content || "",
    createdAt: p.created_at,
    productSlug: p.products?.slug ?? null,
    productName: p.products?.name ?? null,
    productImage: p.products?.image_url ?? null,
  }));

  const followerUsers =
    followers?.map((f: any) => ({
      id: f.follower?.id,
      username: f.follower?.username ?? null,
      full_name: f.follower?.full_name ?? null,
      avatar_url: f.follower?.avatar_url ?? null,
    })).filter((u) => u.id) || [];

  const followingUsers =
    following?.map((f: any) => ({
      id: f.following?.id,
      username: f.following?.username ?? null,
      full_name: f.following?.full_name ?? null,
      avatar_url: f.following?.avatar_url ?? null,
    })).filter((u) => u.id) || [];

  const xp = learnerStats?.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ProfileFeedTab
            posts={feedPosts}
            user={{
              name: displayProfile.name,
              username: displayProfile.username,
              avatar: displayProfile.avatar,
              isVerified: displayProfile.isVerified,
            }}
          />
        );
      case "media":
        return (
          <ProfileMediaTab
            media={mediaItems}
            onOpen={(item) => {
              const idx = mediaItems.findIndex((m) => m.id === item.id);
              if (idx >= 0) setLightboxIndex(idx);
            }}
          />
        );
      case "reviews":
        return <ProfileReviewsTab reviews={reviews} />;
      case "learning":
        return (
          <ProfileLearningTab
            stats={{
              xp,
              streak: learnerStats?.streak ?? 0,
              longestStreak: learnerStats?.longestStreak ?? 0,
              lessonsCompleted: learnerStats?.lessonsCompleted ?? 0,
              milestones: learnerStats?.milestones ?? [],
              weeklyActivity: learnerStats?.weeklyActivity ?? Array(7).fill(false),
            }}
            isOwnProfile={isOwnProfile}
          />
        );
      case "library":
        return <ProfileLibraryTab items={library ?? []} />;
      case "orders":
        return <ProfileOrdersTab orders={orders ?? []} />;
      case "wishlist":
        return <ProfileWishlistTab items={wishlist ?? []} />;
      default:
        return null;
    }
  };

  return (
    <AppLayout showBottomNav>
      <SEO
        title={displayProfile?.name || displayProfile?.username || "Profile"}
        description={`${displayProfile?.name || displayProfile?.username || "Asikon learner"} on Asikon — courses, posts, and learning progress.`}
      />
      <MobilePage
        bleed={
          <ProfileHeader
            user={displayProfile}
            isOwnProfile={isOwnProfile}
            onAvatarClick={() => displayProfile.avatar && setShowAvatarViewer(true)}
            onUpdate={async (updates) => {
              await updateProfile.mutateAsync(updates);
            }}
          />
        }
        sticky={
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showPrivate={isOwnProfile}
            counts={{
              posts: counts?.posts ?? userPosts?.length ?? 0,
              reviews: counts?.reviews ?? reviews.length,
              orders: orders?.length ?? 0,
              wishlist: wishlist?.length ?? 0,
              library: library?.length ?? 0,
            }}
          />
        }
        spacing="space-y-4"
      >
        <ProfileStats
          posts={counts?.posts ?? userPosts?.length ?? 0}
          followers={counts?.followers ?? followers?.length ?? 0}
          following={counts?.following ?? following?.length ?? 0}
          xp={xp}
          level={level}
          onPostsClick={() => setActiveTab("posts")}
          onFollowersClick={() => setStatSheet("followers")}
          onFollowingClick={() => setStatSheet("following")}
          onXpClick={() => setActiveTab("learning")}
          onLevelClick={() => setActiveTab("learning")}
        />

        <ProfileActions
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onMessage={handleMessage}
          onShare={handleShare}
          onEditProfile={() => setShowEdit(true)}
          onReport={() => toast({ title: "Report submitted" })}
          onBlock={() => toast({ title: "User blocked" })}
        />

        {isOwnProfile && (
          <ProfileCompletionBar
            profile={profile}
            learnerStats={learnerStats}
            postCount={counts?.posts ?? 0}
            onEdit={() => setShowEdit(true)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-12 pt-1">
          {/* Desktop side rail */}
          <aside className="hidden lg:block space-y-4 lg:sticky lg:top-[calc(var(--app-header-h)+4rem)] lg:self-start">
            <ProfileTrustCard
              trustScore={displayProfile.trustScore}
              coins={profile?.coins ?? 0}
              level={
                displayProfile.trustScore >= 90
                  ? "Gold"
                  : displayProfile.trustScore >= 70
                  ? "Silver"
                  : "Bronze"
              }
            />
            <ProfileBadges
              badges={displayProfile.isVerified ? ["trusted"] : []}
              learnerSessions={0}
              learnerQuizzes={0}
            />
            {isOwnProfile && <ProfileActivityFeed userId={targetUserId} />}
          </aside>

          {/* Tab content */}
          <div className="min-w-0 space-y-4">
            {isOwnProfile && (
              <div className="lg:hidden">
                <ProfileActivityFeed userId={targetUserId} />
              </div>
            )}
            <div className="lg:hidden">
              <ProfileBadges
                badges={displayProfile.isVerified ? ["trusted"] : []}
                learnerSessions={0}
                learnerQuizzes={0}
              />
            </div>
            <div key={activeTab} className="animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </div>

        <AvatarViewer
          isOpen={showAvatarViewer}
          onClose={() => setShowAvatarViewer(false)}
          imageUrl={displayProfile.avatar}
          userName={displayProfile.name}
        />

        <MessagingDrawer
          open={showMessages}
          onOpenChange={(v) => {
            setShowMessages(v);
            if (!v) setActiveChatId(undefined);
          }}
          initialChatId={activeChatId}
        />

        <MediaLightbox
          items={mediaItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />

        <FollowersSheet
          open={statSheet === "followers"}
          onOpenChange={(v) => setStatSheet(v ? "followers" : null)}
          title="Followers"
          users={followerUsers}
        />
        <FollowersSheet
          open={statSheet === "following"}
          onOpenChange={(v) => setStatSheet(v ? "following" : null)}
          title="Following"
          users={followingUsers}
        />

        {isOwnProfile && profile && (
          <ProfileEditModal
            isOpen={showEdit}
            onClose={() => setShowEdit(false)}
            profile={{
              id: profile.id,
              username: profile.username,
              full_name: profile.full_name,
              bio: profile.bio,
              avatar_url: profile.avatar_url,
              cover_url: profile.cover_url,
              website: (profile as any).website ?? null,
              location: (profile as any).location ?? null,
              cover_gradient: (profile as any).cover_gradient ?? null,
            }}
            onSave={async (updates) => {
              await updateProfile.mutateAsync(updates);
              setShowEdit(false);
            }}
          />
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default Profile;
