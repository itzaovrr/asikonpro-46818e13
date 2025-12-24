import { PostCard } from "@/components/community/PostCard";
import { mockPosts } from "@/lib/mock-data";

export function PostsTab() {
  // Duplicate posts for demo scrolling
  const posts = [...mockPosts, ...mockPosts.map(p => ({ ...p, id: `${p.id}-dup` }))];

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
