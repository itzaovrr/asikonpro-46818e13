import { Radio, Users, Bell, Calendar } from "lucide-react";
import { LiveSession } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

interface LiveCardProps {
  session: LiveSession;
}

export function LiveCard({ session }: LiveCardProps) {
  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={session.thumbnailUrl}
          alt={session.title}
          className="w-full h-full object-cover"
        />

        {/* Live indicator or Schedule */}
        {session.isLive ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-red-500 rounded-md">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="text-xs font-semibold text-white">LIVE</span>
          </div>
        ) : (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md">
            <Calendar className="h-3 w-3" />
            <span className="text-xs font-medium">{session.scheduledAt}</span>
          </div>
        )}

        {/* Viewer count for live */}
        {session.isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md">
            <Users className="h-3 w-3" />
            <span className="text-xs font-medium">{session.viewerCount.toLocaleString()}</span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-medium text-primary-foreground">{session.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <h3 className="font-medium text-sm line-clamp-1">{session.title}</h3>

        {/* Host */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.host.avatar} alt={session.host.name} />
              <AvatarFallback>{session.host.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{session.host.username}</span>
              {session.host.isVerified && (
                <BadgeCheck className="h-3.5 w-3.5 text-primary fill-primary-foreground" />
              )}
            </div>
          </div>

          {session.isLive ? (
            <Button size="sm" className="gradient-primary rounded-full">
              Watch
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="rounded-full gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              Remind
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
