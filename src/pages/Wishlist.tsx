import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemove = (id: string) => {
    removeFromWishlist.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        });
      },
    });
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${productName} has been added to your cart.`,
          });
        },
      }
    );
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-4">Save items you love to your wishlist.</p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-card rounded-xl border border-border overflow-hidden"
              >
                <Link to={`/product/${item.products?.slug}`}>
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
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="p-3">
                  <Link to={`/product/${item.products?.slug}`}>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
                      {item.products?.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${item.products?.price}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleAddToCart(item.products?.id || "", item.products?.name || "")
                      }
                      disabled={addToCart.isPending}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Wishlist;
