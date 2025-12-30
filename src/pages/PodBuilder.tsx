import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Coins, 
  HelpCircle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ProductSelector,
  DesignCanvas,
  GalleryPanel,
  UploadPanel,
  TextPanel,
  StickersPanel,
  MyDesignsPanel,
  PricingPanel
} from "@/components/pod/builder";

type ViewAngle = "front" | "back" | "left" | "right";
type ToolTab = "gallery" | "upload" | "text" | "stickers" | "my-designs";

interface ProductConfig {
  type: "tshirt";
  fit: "regular" | "oversized";
  gender: "unisex" | "men" | "women";
  color: string;
  size: string;
}

const PodBuilder = () => {
  const [productConfig, setProductConfig] = useState<ProductConfig>({
    type: "tshirt",
    fit: "regular",
    gender: "unisex",
    color: "#FFFFFF",
    size: "M",
  });
  
  const [viewAngle, setViewAngle] = useState<ViewAngle>("front");
  const [activeTab, setActiveTab] = useState<ToolTab>("gallery");
  const [zoom, setZoom] = useState(1);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const viewAngles: ViewAngle[] = ["front", "back", "left", "right"];

  const handlePreviousView = () => {
    const currentIndex = viewAngles.indexOf(viewAngle);
    const previousIndex = (currentIndex - 1 + viewAngles.length) % viewAngles.length;
    setViewAngle(viewAngles[previousIndex]);
  };

  const handleNextView = () => {
    const currentIndex = viewAngles.indexOf(viewAngle);
    const nextIndex = (currentIndex + 1) % viewAngles.length;
    setViewAngle(viewAngles[nextIndex]);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <AppLayout showBottomNav={false} showSidebar={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/pod">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="font-semibold text-lg">Create Your Own</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Coins className="h-3.5 w-3.5 text-amber-500" />
                1,250
              </Badge>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Panel - Product Selection (Desktop) */}
          <aside className="hidden lg:block w-72 border-r border-border p-4 overflow-y-auto">
            <ProductSelector 
              config={productConfig}
              onChange={setProductConfig}
            />
          </aside>

          {/* Center - Preview Canvas */}
          <main className="flex-1 flex flex-col">
            {/* Mobile Product Selection */}
            <div className="lg:hidden p-4 border-b border-border">
              <ProductSelector 
                config={productConfig}
                onChange={setProductConfig}
                compact
              />
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative bg-secondary/20 flex items-center justify-center p-4 lg:p-8">
              {/* View Controls */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 border border-border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePreviousView}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium capitalize px-2 min-w-[60px] text-center">
                  {viewAngle}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextView}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 border border-border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Design Canvas */}
              <DesignCanvas
                productConfig={productConfig}
                viewAngle={viewAngle}
                zoom={zoom}
                selectedDesign={selectedDesign}
              />
            </div>

            {/* Design Tools Tabs (Mobile) */}
            <div className="lg:hidden border-t border-border">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ToolTab)}>
                <TabsList className="w-full justify-start overflow-x-auto hide-scrollbar px-2 py-1 h-auto bg-transparent">
                  <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
                  <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
                  <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
                  <TabsTrigger value="stickers" className="text-xs">Stickers</TabsTrigger>
                  <TabsTrigger value="my-designs" className="text-xs">My Designs</TabsTrigger>
                </TabsList>
                <div className="h-48 overflow-y-auto">
                  <TabsContent value="gallery" className="m-0 p-3">
                    <GalleryPanel onSelectDesign={setSelectedDesign} />
                  </TabsContent>
                  <TabsContent value="upload" className="m-0 p-3">
                    <UploadPanel />
                  </TabsContent>
                  <TabsContent value="text" className="m-0 p-3">
                    <TextPanel />
                  </TabsContent>
                  <TabsContent value="stickers" className="m-0 p-3">
                    <StickersPanel />
                  </TabsContent>
                  <TabsContent value="my-designs" className="m-0 p-3">
                    <MyDesignsPanel onSelectDesign={setSelectedDesign} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>

          {/* Right Panel - Design Tools (Desktop) */}
          <aside className="hidden lg:flex flex-col w-80 border-l border-border">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ToolTab)} className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start px-4 py-2 h-auto bg-transparent border-b border-border rounded-none">
                <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
                <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
                <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
                <TabsTrigger value="stickers" className="text-xs">Stickers</TabsTrigger>
                <TabsTrigger value="my-designs" className="text-xs">My Designs</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="gallery" className="m-0 p-4 h-full">
                  <GalleryPanel onSelectDesign={setSelectedDesign} />
                </TabsContent>
                <TabsContent value="upload" className="m-0 p-4 h-full">
                  <UploadPanel />
                </TabsContent>
                <TabsContent value="text" className="m-0 p-4 h-full">
                  <TextPanel />
                </TabsContent>
                <TabsContent value="stickers" className="m-0 p-4 h-full">
                  <StickersPanel />
                </TabsContent>
                <TabsContent value="my-designs" className="m-0 p-4 h-full">
                  <MyDesignsPanel onSelectDesign={setSelectedDesign} />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        </div>

        {/* Bottom Pricing Panel */}
        <PricingPanel productConfig={productConfig} />
      </div>
    </AppLayout>
  );
};

export default PodBuilder;
