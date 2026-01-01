import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, ShoppingCart, Star, ChevronLeft, ChevronRight, Truck, Clock, ShieldCheck } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCarousel } from "@/components/carousels";
import { TrustIndicators, SizeSelector, ColorSelector, QuantitySelector, ProductReviews, ProductFAQ } from "@/components/product";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { value: "black", name: "Black", hex: "#1a1a1a" },
  { value: "white", name: "White", hex: "#ffffff" },
  { value: "navy", name: "Navy", hex: "#1e3a5f" },
  { value: "gray", name: "Gray", hex: "#6b7280" },
];

const mockReviews = [
  { id: "1", userName: "Sarah M.", rating: 5, title: "Perfect fit!", content: "Amazing quality and fits exactly as described.", isVerifiedPurchase: true, helpfulCount: 24, createdAt: "2 days ago" },
  { id: "2", userName: "Alex T.", rating: 4, title: "Great product", content: "Love the material, shipping was fast.", isVerifiedPurchase: true, helpfulCount: 12, createdAt: "1 week ago" },
];

const faqs = [
  { question: "What sizes are available?", answer: "We offer sizes XS through XXL. Check our size guide for measurements." },
  { question: "How long does delivery take?", answer: "Standard delivery takes 3-5 business days. Express shipping available." },
  { question: "What is your return policy?", answer: "30-day easy returns for size exchanges. Items must be unworn with tags." },
  { question: "Is this product print-on-demand?", answer: "Yes, each item is printed after order to ensure freshness and quality." },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: relatedProducts } = useProducts({ limit: 8 });
  const addToCart = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>("black");
  const [quantity, setQuantity] = useState(1);

  const images = product?.images?.length ? product.images : [product?.image_url];

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to add items to cart.", variant: "destructive" });
      return;
    }
    if (!selectedSize) {
      toast({ title: "Select size", description: "Please select a size before adding to cart.", variant: "destructive" });
      return;
    }
    if (!product) return;

    addToCart.mutate({ productId: product.id, quantity }, {
      onSuccess: () => toast({ title: "Added to cart!", description: `${product.name} has been added.` }),
      onError: () => toast({ title: "Error", description: "Failed to add item.", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <h1 className="text-xl font-bold mb-2">Product Not Found</h1>
          <Link to="/shop"><Button>Back to Shop</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 border border-border/50">
              <img src={images[selectedImage] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"><ChevronRight className="h-5 w-5" /></button>
                </>
              )}
              {discountPercentage > 0 && <Badge variant="destructive" className="absolute top-3 left-3 font-bold">-{discountPercentage}%</Badge>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-primary" : "border-transparent hover:border-primary/50"}`}>
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating || 0}</span>
                  <span className="text-muted-foreground">({product.review_count || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.original_price && <span className="text-xl text-muted-foreground line-through">${product.original_price}</span>}
              {discountPercentage > 0 && <Badge variant="secondary" className="text-success">Save ${(product.original_price! - product.price).toFixed(2)}</Badge>}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-success"><Truck className="h-4 w-4" /><span>Free Shipping</span></div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" /><span>Est. 3-5 days</span></div>
            </div>

            <TrustIndicators />
            <Separator />
            <ColorSelector colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />
            <SizeSelector sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
            <QuantitySelector quantity={quantity} onIncrease={() => setQuantity((q) => q + 1)} onDecrease={() => setQuantity((q) => Math.max(1, q - 1))} />
            <Separator />

            <div className="flex gap-3">
              <Button className="flex-1 gradient-primary border-0" size="lg" onClick={handleAddToCart} disabled={addToCart.isPending}>
                <ShoppingCart className="h-5 w-5 mr-2" />{addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg"><Heart className="h-5 w-5" /></Button>
              <Button variant="outline" size="lg"><Share2 className="h-5 w-5" /></Button>
            </div>

            {product.description && (
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-semibold mb-2">About This Product</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Printed on demand to ensure freshness and quality
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews reviews={mockReviews} averageRating={product.rating || 4.5} totalReviews={product.review_count || 36} ratingDistribution={[{ stars: 5, count: 24 }, { stars: 4, count: 8 }, { stars: 3, count: 3 }, { stars: 2, count: 1 }, { stars: 1, count: 0 }]} />

        {/* FAQ */}
        <ProductFAQ faqs={faqs} />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <ProductCarousel title="You May Also Like" products={relatedProducts.filter((p) => p.id !== product.id).slice(0, 8).map((p) => ({ id: p.id, name: p.name, brand: "StyleHub", price: p.price, originalPrice: p.original_price || undefined, image: p.image_url || "/placeholder.svg", rating: p.rating || 0, reviews: p.review_count || 0, isTrending: p.is_featured || false }))} />
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="text-xl font-bold">${product.price}</span>
            {product.original_price && <span className="text-sm text-muted-foreground line-through ml-2">${product.original_price}</span>}
          </div>
          <Button className="gradient-primary border-0 px-8" size="lg" onClick={handleAddToCart} disabled={addToCart.isPending}>
            <ShoppingCart className="h-5 w-5 mr-2" />Buy Now
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
