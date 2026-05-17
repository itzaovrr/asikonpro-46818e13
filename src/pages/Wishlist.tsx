import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { MobileCard } from "@/components/ui/mobile-card";
import { Button } from "@/components/ui/button";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Price } from "@/lib/currency";

const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemove = (id: string) => {
    removeFromWishlist.mutate(id, {
      onSuccess: () =>
        toast({ title: "Removed from wishlist", description: "Item has been removed." }),
    });
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () =>
          toast({ title: "Added to cart", description: `${productName} added.` }),
      }
    );
  };

  if (authLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="6xl">
          <p className="text-center text-muted-foreground py-10">Loading...</p>
        </MobilePage>
      </AppLayout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <AppLayout>
      <MobilePage maxWidth="6xl">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-14 w-14 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-1">Your wishlist is empty</h2>
            <p className="text-sm text-muted-foreground mb-4">Save items you love.</p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {wishlistItems.map((item) => (
              <MobileCard key={item.id} variant="glass" noPadding className="group relative overflow-hidden">
                <Link to={`/product/${item.products?.slug}`} className="block">
                  <div className="aspect-square bg-secondary">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove from wishlist"
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="p-3">
                  <Link to={`/product/${item.products?.slug}`}>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary transition-colors min-h-[2.5rem]">
                      {item.products?.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <Price amount={item.products?.price ?? 0} className="font-bold" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(item.products?.id || "", item.products?.name || "")}
                      disabled={addToCart.isPending}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default Wishlist;
