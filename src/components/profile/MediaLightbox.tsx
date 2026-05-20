import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MediaItem {
  id: string;
  postId: string;
  type: "image" | "video";
  thumbnail: string;
}

interface Props {
  items: MediaItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function MediaLightbox({ items, index, onClose, onIndexChange }: Props) {
  const navigate = useNavigate();
  const open = index !== null && index >= 0 && index < items.length;
  const item = open ? items[index!] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index! > 0) onIndexChange(index! - 1);
      if (e.key === "ArrowRight" && index! < items.length - 1) onIndexChange(index! + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onClose, onIndexChange]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[96vw] p-0 bg-black/95 border-border/40 overflow-hidden">
        <div className="relative aspect-square sm:aspect-video flex items-center justify-center">
          {item.type === "image" ? (
            <img src={item.thumbnail} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <video src={item.thumbnail} controls autoPlay className="max-h-full max-w-full" />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>

          {index! > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onIndexChange(index! - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {index! < items.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onIndexChange(index! + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 text-xs text-white/80 border-t border-white/10">
          <span>{index! + 1} / {items.length}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { onClose(); navigate("/community"); }}
            className="text-white hover:bg-white/10"
          >
            Open post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
