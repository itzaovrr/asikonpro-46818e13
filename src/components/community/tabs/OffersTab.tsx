import { OfferCard } from "@/components/community/OfferCard";
import { mockOffers } from "@/lib/community-mock-data";
import { Zap } from "lucide-react";

export function OffersTab() {
  return (
    <div className="space-y-6 px-4 pb-4">
      {/* Flash Deals Banner */}
      <div className="p-4 gradient-primary rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 fill-primary-foreground" />
          <h3 className="font-bold text-primary-foreground">Flash Deals</h3>
        </div>
        <p className="text-sm text-primary-foreground/80">
          Limited time offers - grab them before they're gone!
        </p>
      </div>

      {/* Offers grid */}
      <div className="space-y-4">
        {mockOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {/* Duplicate for demo */}
      <div className="space-y-4">
        {mockOffers.map((offer) => (
          <OfferCard key={`${offer.id}-dup`} offer={{ ...offer, id: `${offer.id}-dup` }} />
        ))}
      </div>
    </div>
  );
}
