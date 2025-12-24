import { Clock, Percent, Copy } from "lucide-react";
import { Offer } from "@/types/community";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const handleCopyCode = () => {
    if (offer.code) {
      navigator.clipboard.writeText(offer.code);
      toast.success("Code copied!", { description: offer.code });
    }
  };

  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border">
      {/* Image */}
      <div className="relative aspect-[2/1]">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="w-full h-full object-cover"
        />
        
        {/* Discount badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 gradient-primary rounded-full">
          <Percent className="h-3 w-3" />
          <span className="text-xs font-bold text-primary-foreground">
            {offer.discountPercent}% OFF
          </span>
        </div>

        {/* Countdown */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md">
          <Clock className="h-3 w-3 text-destructive" />
          <span className="text-xs font-medium">{offer.expiresAt}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm">{offer.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{offer.description}</p>
        </div>

        {offer.code ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-secondary rounded-lg border border-dashed border-primary/50">
              <span className="text-sm font-mono font-semibold text-primary">{offer.code}</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-lg gap-1.5"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        ) : (
          <Button className="w-full gradient-primary rounded-lg">
            Claim Offer
          </Button>
        )}
      </div>
    </article>
  );
}
