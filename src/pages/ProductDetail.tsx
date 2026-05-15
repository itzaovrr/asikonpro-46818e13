import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, ShoppingCart, Star, ChevronLeft, ChevronRight, Truck, Clock, ShieldCheck, BookOpen, Play, CheckCircle2, GraduationCap, Award, Users, Globe, Infinity as InfinityIcon } from "lucide-react";
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
import { Price } from "@/lib/currency";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { value: "black", name: "Black", hex: "#1a1a1a" },
  { value: "white", name: "White", hex: "#ffffff" },
  { value: "navy", name: "Navy", hex: "#1e3a5f" },
  { value: "gray", name: "Gray", hex: "#6b7280" },
];

const mockReviews = [
  { id: "1", userName: "Sarah M.", rating: 5, title: "AI tutor is a game changer", content: "Cleared every doubt I had. Felt like a personal mentor was beside me.", isVerifiedPurchase: true, helpfulCount: 124, createdAt: "2 days ago" },
  { id: "2", userName: "Alex T.", rating: 5, title: "Worth every taka", content: "Projects are practical, instructor explains clearly, and lifetime access is amazing.", isVerifiedPurchase: true, helpfulCount: 88, createdAt: "1 week ago" },
];

const courseFaqs = [
  { question: "Do I get lifetime access?", answer: "Yes — once enrolled, you keep lifetime access to all lessons, projects, and future updates." },
  { question: "Is there a certificate?", answer: "Yes, you receive a verified ASIKON certificate of completion you can share on LinkedIn or your CV." },
  { question: "Can I ask questions during the course?", answer: "Absolutely. The ASIKON AI Tutor is available 24/7, and our human mentors reply in the community within hours." },
  { question: "Is this beginner friendly?", answer: "Yes. Every course starts from the fundamentals and builds up to real, project-based learning." },
];

const productFaqs = [
  { question: "Is this product authentic?", answer: "Yes, every product on ASIKON is verified and shipped from trusted sellers." },
  { question: "How long does delivery take?", answer: "Standard delivery takes 3-5 business days inside Bangladesh. Cash on delivery available." },
  { question: "What is your return policy?", answer: "7-day easy returns. Items must be unused and in original packaging." },
  { question: "Do you ship outside Bangladesh?", answer: "International shipping is rolling out soon — stay tuned!" },
];

const courseCurriculum = [
  { module: "Module 1 — Foundations", lessons: 8, duration: "1h 45m" },
  { module: "Module 2 — Core Concepts", lessons: 12, duration: "3h 20m" },
  { module: "Module 3 — Hands-on Projects", lessons: 10, duration: "4h 10m" },
  { module: "Module 4 — Real-World Case Studies", lessons: 6, duration: "2h 30m" },
  { module: "Module 5 — Final Project & Certification", lessons: 4, duration: "2h 00m" },
];

const courseLearnings = [
  "Build real projects from day one",
  "Master fundamentals with simple, visual explanations",
  "Get unstuck instantly with the ASIKON AI Tutor",
  "Earn a verified certificate of completion",
  "Join a community of motivated learners",
  "Lifetime access with future updates included",
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

  const name = product.name || "";
  const isCourse = /course|masterclass|bootcamp|specialization|class|prep/i.test(name);
  const isBook = /book|hardcover|edition/i.test(name);
  const isDigital = isCourse || /prompt|library|subscription|tutor/i.test(name);

  return (
    <AppLayout>
      <div className="container-editorial py-6 lg:py-10 space-y-10 lg:space-y-16 pb-sticky-cta">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 lg:gap-12">
          {/* Image Gallery — sticky on desktop */}
          <div className="space-y-4 lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 border border-border/50">
              <img src={images[selectedImage] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-background"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-background"><ChevronRight className="h-5 w-5" /></button>
                </>
              )}
              {discountPercentage > 0 && <Badge variant="destructive" className="absolute top-3 left-3 font-bold">-{discountPercentage}%</Badge>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-primary" : "border-transparent hover:border-primary/50"}`}>
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="eyebrow-bar mb-3">ASIKON Marketplace</p>
              <h1 className="display-2 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating || 0}</span>
                  <span className="text-muted-foreground">({product.review_count || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <Price amount={product.price} className="text-3xl font-bold" />
              {product.original_price && <Price amount={product.original_price} strike className="text-xl text-muted-foreground" />}
              {discountPercentage > 0 && <Badge variant="secondary" className="text-success">Save {discountPercentage}%</Badge>}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-success"><Truck className="h-4 w-4" /><span>Free Shipping</span></div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" /><span>Est. 3-5 days</span></div>
            </div>

            <TrustIndicators />
            <Separator />
            {isCourse ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50"><InfinityIcon className="h-4 w-4 text-primary" /><span>Lifetime access</span></div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50"><Award className="h-4 w-4 text-primary" /><span>Verified certificate</span></div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50"><Globe className="h-4 w-4 text-primary" /><span>Bangla + English</span></div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50"><Users className="h-4 w-4 text-primary" /><span>24/7 AI Tutor</span></div>
              </div>
            ) : isBook ? (
              <QuantitySelector quantity={quantity} onIncrease={() => setQuantity((q) => q + 1)} onDecrease={() => setQuantity((q) => Math.max(1, q - 1))} />
            ) : (
              <>
                <ColorSelector colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                <SizeSelector sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
                <QuantitySelector quantity={quantity} onIncrease={() => setQuantity((q) => q + 1)} onDecrease={() => setQuantity((q) => Math.max(1, q - 1))} />
              </>
            )}
            <Separator />

            <div className="flex gap-3">
              <Button className="flex-1 gradient-primary border-0" size="lg" onClick={handleAddToCart} disabled={addToCart.isPending}>
                <ShoppingCart className="h-5 w-5 mr-2" />{addToCart.isPending ? "Adding..." : isCourse ? "Enroll Now" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg"><Heart className="h-5 w-5" /></Button>
              <Button variant="outline" size="lg"><Share2 className="h-5 w-5" /></Button>
            </div>

            {product.description && (
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-semibold mb-2">{isCourse ? "About This Course" : isBook ? "About This Book" : "About This Product"}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  {isDigital ? "Instant access after purchase. Lifetime updates included." : "Authentic, verified by ASIKON. Cash on delivery available."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Course-specific sections */}
        {isCourse && (
          <>
            <section className="rounded-2xl border border-border/50 bg-secondary/20 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">What you will learn</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {courseLearnings.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border/50 bg-secondary/20 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Curriculum</h2>
                <span className="ml-auto text-xs text-muted-foreground">
                  {courseCurriculum.reduce((s, m) => s + m.lessons, 0)} lessons · ~14h
                </span>
              </div>
              <div className="space-y-2">
                {courseCurriculum.map((m, i) => (
                  <div key={m.module} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                    <div className="w-8 h-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.module}</p>
                      <p className="text-xs text-muted-foreground">{m.lessons} lessons · {m.duration}</p>
                    </div>
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border/50 bg-secondary/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Your Instructor</h2>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
                  alt="Instructor"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                />
                <div className="flex-1">
                  <p className="font-semibold">ASIKON Mentor Team</p>
                  <p className="text-xs text-muted-foreground">Engineers, educators, and AI researchers helping students learn smarter, faster, and stay motivated every day.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Reviews */}
        <ProductReviews reviews={mockReviews} averageRating={product.rating || 4.5} totalReviews={product.review_count || 36} ratingDistribution={[{ stars: 5, count: 24 }, { stars: 4, count: 8 }, { stars: 3, count: 3 }, { stars: 2, count: 1 }, { stars: 1, count: 0 }]} />

        {/* FAQ */}
        <ProductFAQ faqs={isCourse ? courseFaqs : productFaqs} />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <ProductCarousel title={isCourse ? "Continue Learning" : "You May Also Like"} products={relatedProducts.filter((p) => p.id !== product.id).slice(0, 8).map((p) => ({ id: p.id, name: p.name, brand: "ASIKON", price: p.price, originalPrice: p.original_price || undefined, image: p.image_url || "/placeholder.svg", rating: p.rating || 0, reviews: p.review_count || 0, isTrending: p.is_featured || false }))} />
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <div
        className="fixed bottom-16 left-0 right-0 z-40 glass-strong border-t border-border/40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="container-editorial py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <Price amount={product.price} className="text-xl font-bold" />
            {product.original_price && <Price amount={product.original_price} strike className="text-sm text-muted-foreground ml-2" />}
          </div>
          <Button className="gradient-primary border-0 px-6" size="lg" onClick={handleAddToCart} disabled={addToCart.isPending}>
            <ShoppingCart className="h-5 w-5 mr-2" />{isCourse ? "Enroll" : "Buy Now"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
