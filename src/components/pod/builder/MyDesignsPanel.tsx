import { Palette } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDesigns } from "@/hooks/usePodDesigns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MyDesignsPanelProps {
  onSelectDesign: (url: string) => void;
}

export function MyDesignsPanel({ onSelectDesign }: MyDesignsPanelProps) {
  const { data: designs, isLoading } = useMyDesigns();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!designs || designs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Palette className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium mb-1">No saved designs</p>
        <p className="text-xs text-muted-foreground mb-4">
          Upload your first design to see it here
        </p>
        <Button asChild size="sm" variant="outline">
          <Link to="/pod/upload">Upload Design</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {designs.map((design) => (
        <button
          key={design.id}
          onClick={() => onSelectDesign(design.image_url)}
          className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors group"
        >
          <img
            src={design.image_url}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </button>
      ))}
    </div>
  );
}
