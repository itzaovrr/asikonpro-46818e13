import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Shirt,
  Palette,
  DollarSign,
  Eye,
  Loader2,
  X,
  Info,
  Coins
} from "lucide-react";
import { useUploadDesign } from "@/hooks/usePodDesigns";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Upload Design", icon: Upload },
  { id: 2, title: "Choose Product", icon: Shirt },
  { id: 3, title: "Live Mockup", icon: Eye },
  { id: 4, title: "Details & Publish", icon: DollarSign },
];

const productTypes = [
  { id: "t-shirt", name: "T-Shirt", price: 499, icon: "👕" },
  { id: "hoodie", name: "Hoodie", price: 899, icon: "🧥" },
  { id: "sweatshirt", name: "Sweatshirt", price: 749, icon: "👔" },
];

const colors = [
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "navy", name: "Navy", hex: "#1e3a5f" },
  { id: "gray", name: "Gray", hex: "#6b7280" },
  { id: "red", name: "Red", hex: "#dc2626" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const categories = [
  { id: "general", label: "General" },
  { id: "quotes", label: "Quotes" },
  { id: "anime", label: "Anime" },
  { id: "minimal", label: "Minimal" },
  { id: "street", label: "Street" },
  { id: "nature", label: "Nature" },
  { id: "abstract", label: "Abstract" },
  { id: "gaming", label: "Gaming" },
];

const PodUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uploadDesign = useUploadDesign();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("t-shirt");
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L", "XL"]);
  const [placement, setPlacement] = useState<"front" | "back">("front");
  
  // Step 4 details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [buyForSelf, setBuyForSelf] = useState(true);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PNG or JPG file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    toast.success("Design uploaded successfully!");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.createElement("input");
      input.type = "file";
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileUpload({ target: input } as any);
    }
  }, [handleFileUpload]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to upload designs");
      navigate("/auth");
      return;
    }

    if (!uploadedFile || !title) {
      toast.error("Please complete all required fields");
      return;
    }

    await uploadDesign.mutateAsync({
      file: uploadedFile,
      title,
      description,
      category,
      tags,
      isPublic,
    });

    navigate("/pod");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!uploadedFile;
      case 2: return !!selectedProduct && selectedSizes.length > 0;
      case 3: return true;
      case 4: return !!title;
      default: return false;
    }
  };

  const productPrice = productTypes.find(p => p.id === selectedProduct)?.price || 499;
  const creatorCommission = isPublic ? 50 : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-8">
        {/* Header */}
        <div className="px-4 lg:px-0 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate("/pod")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Create Your Design</h1>
              <p className="text-muted-foreground text-sm">Step {currentStep} of {steps.length}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-4">
            {steps.map((step, i) => (
              <div key={step.id} className="flex-1 flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  currentStep >= step.id 
                    ? "gradient-primary" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-colors ${
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-1" />
        </div>

        {/* Step Content */}
        <div className="px-4 lg:px-0">
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                  previewUrl ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden bg-secondary">
                      <img src={previewUrl} alt="Design preview" className="w-full h-full object-contain" />
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                    <Badge variant="outline" className="text-success border-success">
                      <Check className="h-3 w-3 mr-1" /> Ready to use
                    </Badge>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Drop your design here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, or SVG • Max 10MB • Transparent background recommended
                      </p>
                    </div>
                  </label>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary">Design Tips</p>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>• Use high resolution (300 DPI) for best print quality</li>
                    <li>• Transparent backgrounds work best on colored products</li>
                    <li>• Keep important elements away from edges</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Choose Product */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">Product Type</Label>
                <div className="grid grid-cols-3 gap-4">
                  {productTypes.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedProduct === product.id 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-3xl block mb-2">{product.icon}</span>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">₹{product.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Color</Label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.id 
                          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" 
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Available Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedSizes.includes(size) 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Live Mockup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="aspect-square rounded-2xl bg-secondary/50 border border-border relative overflow-hidden">
                    {/* T-shirt mockup with design overlay */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }}
                    >
                      {previewUrl && (
                        <div className="relative w-1/2 h-1/2">
                          <img 
                            src={previewUrl} 
                            alt="Design on product"
                            className="w-full h-full object-contain drop-shadow-2xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-48 space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Placement</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={placement === "front" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPlacement("front")}
                        className={placement === "front" ? "gradient-primary border-0" : ""}
                      >
                        Front
                      </Button>
                      <Button
                        variant={placement === "back" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPlacement("back")}
                        className={placement === "back" ? "gradient-primary border-0" : ""}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block">Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.slice(0, 3).map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color.id ? "border-primary" : "border-border"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Details & Publish */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Design Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title for your design"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your design..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        category === cat.id 
                          ? "gradient-primary" 
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shirt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Buy for yourself</p>
                      <p className="text-sm text-muted-foreground">Order this product with your design</p>
                    </div>
                  </div>
                  <Switch checked={buyForSelf} onCheckedChange={setBuyForSelf} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Sell publicly</p>
                      <p className="text-sm text-muted-foreground">List in gallery & earn ₹{creatorCommission}/sale</p>
                    </div>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base price</span>
                  <span>₹{productPrice}</span>
                </div>
                {isPublic && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Your earnings per sale</span>
                    <span>+₹{creatorCommission}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{productPrice}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between px-4 lg:px-0 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="gradient-primary border-0"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || uploadDesign.isPending}
              className="gradient-primary border-0"
            >
              {uploadDesign.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : buyForSelf ? (
                "Add to Cart"
              ) : (
                "Publish Design"
              )}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PodUpload;
