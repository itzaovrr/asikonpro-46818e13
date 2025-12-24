import { Plus } from "lucide-react";
import { StoryCircle } from "@/components/home/StoryCircle";
import { PostCard } from "@/components/community/PostCard";
import { VideoCard } from "@/components/community/VideoCard";
import { ShortCard } from "@/components/community/ShortCard";
import { ReviewCard } from "@/components/community/ReviewCard";
import { mockStories, mockPosts } from "@/lib/mock-data";
import { mockVideos, mockShorts, mockReviews } from "@/lib/community-mock-data";

export function MyFeedTab() {
  return (
    <div className="space-y-4">
      {/* Stories */}
      <div className="px-4">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {/* Add Story */}
          <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Add Story</span>
          </button>
          {mockStories.slice(1).map((story, index) => (
            <StoryCircle key={story.id} story={story} isFirst={index === 0} />
          ))}
        </div>
      </div>

      {/* Mixed Feed */}
      <div className="space-y-4">
        {/* First post */}
        <PostCard post={mockPosts[0]} />

        {/* Featured short preview */}
        <div className="px-4">
          <h3 className="text-sm font-semibold mb-3">Trending Shorts</h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            {mockShorts.slice(0, 3).map((short) => (
              <div key={short.id} className="w-32 flex-shrink-0">
                <ShortCard short={short} />
              </div>
            ))}
          </div>
        </div>

        {/* Second post */}
        <PostCard post={mockPosts[1]} />

        {/* Featured video */}
        <div className="px-4">
          <h3 className="text-sm font-semibold mb-3">Popular Videos</h3>
          <VideoCard video={mockVideos[0]} />
        </div>

        {/* Featured review */}
        <div>
          <div className="px-4 mb-2">
            <h3 className="text-sm font-semibold">Top Reviews</h3>
          </div>
          <ReviewCard review={mockReviews[0]} />
        </div>

        {/* More posts */}
        {mockPosts.map((post) => (
          <PostCard key={`feed-${post.id}`} post={post} />
        ))}
      </div>
    </div>
  );
}
