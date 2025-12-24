import { VideoCard } from "@/components/community/VideoCard";
import { mockVideos } from "@/lib/community-mock-data";

export function VideosTab() {
  // Duplicate for demo
  const videos = [...mockVideos, ...mockVideos.map(v => ({ ...v, id: `${v.id}-dup` }))];

  return (
    <div className="px-4 space-y-4 pb-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
