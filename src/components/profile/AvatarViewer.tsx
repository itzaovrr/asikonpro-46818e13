import { X, Download, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  userName: string;
}

export function AvatarViewer({ isOpen, onClose, imageUrl, userName }: AvatarViewerProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${userName}-avatar.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName}'s Profile Photo`,
          url: imageUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Image Container */}
        <div className="relative flex items-center justify-center min-h-[60vh] p-8">
          <img
            src={imageUrl}
            alt={`${userName}'s profile photo`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>

        {/* Actions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="bg-white/10 hover:bg-white/20 text-white border-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {navigator.share && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white border-none"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>

        {/* User Name */}
        <div className="absolute bottom-4 left-4 text-white/70 text-sm">
          {userName}
        </div>
      </DialogContent>
    </Dialog>
  );
}
