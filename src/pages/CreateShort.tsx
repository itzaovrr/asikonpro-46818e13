import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Film, Upload, X, Send, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CreateShort = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isLoggedIn || !user) {
      toast.error("Please login to create a short");
      navigate("/auth");
      return;
    }

    if (!videoUrl) {
      toast.error("Please add a video");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: caption.trim() || null,
        video_url: videoUrl,
        type: "short",
      });

      if (error) throw error;

      toast.success("Short created successfully!");
      navigate("/community");
    } catch (error) {
      console.error("Error creating short:", error);
      toast.error("Failed to create short");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="container max-w-md mx-auto px-4 py-6">
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
            <Film className="h-5 w-5 text-pink-500" />
            Create Short
          </h1>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {/* Short Video Upload - Portrait */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Short Video (9:16)
              </Label>
              {videoUrl ? (
                <div className="relative aspect-[9/16] max-h-[400px] mx-auto rounded-xl overflow-hidden bg-secondary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="h-12 w-12 text-pink-500" />
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
                  onClick={() => setVideoUrl(`https://example.com/short-${Date.now()}.mp4`)}
                  className="w-full aspect-[9/16] max-h-[400px] mx-auto rounded-xl border-2 border-dashed border-border hover:border-pink-500/50 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-pink-500 transition-colors"
                >
                  <Upload className="h-10 w-10" />
                  <span className="text-sm font-medium">Upload Short</span>
                  <span className="text-xs">15-60 seconds, vertical</span>
                </button>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-sm font-medium">
                Caption (optional)
              </Label>
              <Textarea
                id="caption"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[80px] resize-none bg-background/50 border-border/50 focus:border-pink-500"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">
                {caption.length}/150
              </p>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !videoUrl}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              size="lg"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Short
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateShort;
