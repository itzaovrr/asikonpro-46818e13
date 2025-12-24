import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Video, Upload, X, Send, Play } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CreateVideo = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isLoggedIn || !user) {
      toast.error("Please login to upload a video");
      navigate("/auth");
      return;
    }

    if (!title.trim() || !videoUrl.trim()) {
      toast.error("Please add a title and video");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("videos").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
      });

      if (error) throw error;

      toast.success("Video uploaded successfully!");
      navigate("/community");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="container max-w-2xl mx-auto px-4 py-6">
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
            <Video className="h-5 w-5 text-purple-500" />
            Upload Video
          </h1>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {/* Video Upload Area */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Video</Label>
              {videoUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <button
                    onClick={() => setVideoUrl("")}
                    className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setVideoUrl(`https://example.com/video-${Date.now()}.mp4`)}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Upload className="h-10 w-10" />
                  <span className="text-sm font-medium">Click to upload video</span>
                  <span className="text-xs">MP4, WebM up to 500MB</span>
                </button>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                placeholder="Give your video a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Tell viewers about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !videoUrl}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              size="lg"
            >
              {isSubmitting ? (
                "Uploading..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateVideo;
