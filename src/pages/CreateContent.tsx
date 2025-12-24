import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Image, Video, Film, Star, Radio, Send, 
  Camera, Upload, ArrowLeft, Sparkles, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

type ContentType = "post" | "video" | "short" | "review" | "live";

const contentTypes = [
  { id: "post" as ContentType, icon: Image, label: "Post", description: "Share photos & updates" },
  { id: "video" as ContentType, icon: Video, label: "Video", description: "Upload long-form content" },
  { id: "short" as ContentType, icon: Film, label: "Short", description: "Quick vertical videos" },
  { id: "review" as ContentType, icon: Star, label: "Review", description: "Rate products you love" },
  { id: "live" as ContentType, icon: Radio, label: "Go Live", description: "Stream in real-time" },
];

export default function CreateContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = () => {
    const newImage = `https://picsum.photos/400/400?random=${Date.now()}`;
    setImages([...images, newImage]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Content created!",
      description: `Your ${selectedType} has been published successfully.`,
    });
    
    setIsSubmitting(false);
    navigate("/community");
  };

  const canSubmit = () => {
    if (!selectedType) return false;
    if (selectedType === "review" && rating === 0) return false;
    if (selectedType === "live") return true;
    return content.trim().length > 0 || images.length > 0;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              onClick={() => selectedType ? setSelectedType(null) : navigate(-1)}
              className="p-2 -ml-2 hover:bg-secondary/50 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold">
              {selectedType ? `Create ${contentTypes.find(t => t.id === selectedType)?.label}` : "Create Content"}
            </h1>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit() || isSubmitting}
              className={cn(
                "gradient-primary text-primary-foreground font-semibold",
                !canSubmit() && "opacity-50"
              )}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : selectedType === "live" ? (
                <>
                  <Radio className="h-4 w-4 mr-1" />
                  Go Live
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Content Type Selection */}
          {!selectedType ? (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  What would you like to create?
                </div>
                <p className="text-muted-foreground">Choose a content type to get started</p>
              </div>
              
              <div className="grid gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <type.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Title Input (for video, short, review) */}
              {["video", "short", "review"].includes(selectedType) && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder={`Give your ${selectedType} a title...`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/30 border-border/50 h-12"
                  />
                </div>
              )}

              {/* Rating (for review) */}
              {selectedType === "review" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "h-8 w-8 transition-colors",
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground hover:text-amber-400/50"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Stream Preview */}
              {selectedType === "live" && (
                <div className="aspect-video bg-secondary/30 rounded-2xl border border-border/50 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                    <Camera className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <p className="text-muted-foreground text-center">
                    Camera preview will appear here<br />
                    <span className="text-sm">Tap "Go Live" to start streaming</span>
                  </p>
                </div>
              )}

              {/* Content Input (for post, review) */}
              {["post", "review"].includes(selectedType) && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {selectedType === "review" ? "Your Review" : "What's on your mind?"}
                  </label>
                  <Textarea
                    placeholder={
                      selectedType === "review" 
                        ? "Share your experience with this product..." 
                        : "Share something amazing..."
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] bg-secondary/30 border-border/50 resize-none"
                  />
                </div>
              )}

              {/* Image/Video Upload */}
              {["post", "video", "short", "review"].includes(selectedType) && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {["video", "short"].includes(selectedType) ? "Upload Video" : "Add Photos"}
                  </label>
                  
                  {/* Uploaded Images Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={handleImageUpload}
                    className="w-full p-8 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {["video", "short"].includes(selectedType) ? "Upload video" : "Add photos"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {["video", "short"].includes(selectedType) 
                          ? "MP4, MOV up to 500MB" 
                          : "JPG, PNG up to 10MB each"
                        }
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Stream Settings (for live) */}
              {selectedType === "live" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Stream Title</label>
                  <Input
                    placeholder="What are you streaming today?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/30 border-border/50 h-12"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
