import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Radio, Video, Mic, MicOff, VideoOff, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const GoLive = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const handleGoLive = () => {
    if (!isLoggedIn || !user) {
      toast.error("Please login to go live");
      navigate("/auth");
      return;
    }

    if (!title.trim()) {
      toast.error("Please add a title for your stream");
      return;
    }

    setIsLive(true);
    toast.success("You're now live! 🎉");
  };

  const handleEndStream = () => {
    setIsLive(false);
    toast.info("Stream ended");
    navigate("/community");
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="container max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Radio className={cn("h-5 w-5", isLive ? "text-red-500 animate-pulse" : "text-red-500")} />
            {isLive ? "You're Live!" : "Go Live"}
          </h1>
          {isLive && (
            <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>0 watching</span>
            </span>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Preview */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="relative aspect-video bg-secondary flex items-center justify-center">
              {isVideoOn ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Video className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Camera preview</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Camera is off</p>
                </div>
              )}

              {/* Live indicator */}
              {isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 flex items-center justify-center gap-4">
              <Button
                variant={isAudioOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-12 w-12"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Settings */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Stream Title</Label>
                <Input
                  id="title"
                  placeholder="What's your stream about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLive}
                  className="bg-background/50 border-border/50 focus:border-red-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Tips</Label>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Good lighting makes a difference
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Engage with your viewers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Stable internet connection
                  </li>
                </ul>
              </div>

              {isLive ? (
                <Button
                  onClick={handleEndStream}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  End Stream
                </Button>
              ) : (
                <Button
                  onClick={handleGoLive}
                  disabled={!title.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  size="lg"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Go Live
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default GoLive;
