import { Play, Image as ImageIcon } from "lucide-react";
import { EmptyState } from "./ProfileFeedTab";

interface MediaItem {
  id: string;
  postId: string;
  type: "image" | "video";
  thumbnail: string;
  url?: string;
}

interface ProfileMediaTabProps {
  media: MediaItem[];
  onOpen?: (item: MediaItem) => void;
}

/** Instagram-style 3-column grid pulled from a user's posts. */
export function ProfileMediaTab({ media, onOpen }: ProfileMediaTabProps) {
  if (media.length === 0) {
    return (
      <EmptyState
        icon={<ImageIcon className="h-8 w-8" />}
        title="No media yet"
        hint="Photos and videos from this profile's posts will appear here."
      />
    );
  }
  return (
    <div className="grid grid-cols-3 gap-0.5 pt-1">
      {media.map((item) => (
        <button
          key={item.id}
          onClick={() => onOpen?.(item)}
          className="relative aspect-square overflow-hidden group bg-muted"
        >
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.type === "video" && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/55 flex items-center justify-center">
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
