import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Image as ImageIcon, X, Send, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const CreateReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const { user, isLoggedIn } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageAdd = () => {
    const mockImage = `https://picsum.photos/400/300?random=${Date.now()}`;
    if (images.length < 3) {
      setImages([...images, mockImage]);
    } else {
      toast.error("Maximum 3 images allowed");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isLoggedIn || !user) {
      toast.error("Please login to write a review");
      navigate("/auth");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write your review");
      return;
    }

    setIsSubmitting(true);
    try {
      // For demo, create a general review post if no product selected
      if (productId) {
        const { error } = await supabase.from("reviews").insert({
          user_id: user.id,
          product_id: productId,
          rating,
          title: title.trim() || null,
          content: content.trim(),
          images: images.length > 0 ? images : null,
        });
        if (error) throw error;
      } else {
        // Create as a review-type post
        const { error } = await supabase.from("posts").insert({
          user_id: user.id,
          content: `⭐ ${rating}/5 - ${title || 'Product Review'}\n\n${content.trim()}`,
          images: images.length > 0 ? images : null,
          type: "review",
        });
        if (error) throw error;
      }

      toast.success("Review submitted successfully!");
      navigate("/community");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
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
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Write a Review
          </h1>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Your Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverRating || rating) >= star
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 ? `${rating} out of 5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Review Title (optional)
              </Label>
              <Input
                id="title"
                placeholder="Summarize your experience..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-yellow-500"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Your Review
              </Label>
              <Textarea
                id="content"
                placeholder="Share your experience with this product. What did you like or dislike?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-yellow-500"
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Add Photos (optional)</Label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <button
                    onClick={handleImageAdd}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-yellow-500/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-yellow-500 transition-colors"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-[10px]">Add</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || !content.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              size="lg"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateReview;
