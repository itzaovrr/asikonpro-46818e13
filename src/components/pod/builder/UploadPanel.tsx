import { Upload, ImagePlus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export function UploadPanel() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log("File dropped:", e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload
      console.log("File selected:", e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
          ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Drop your design here</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Or Button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button className="w-full gap-2" variant="outline" onClick={() => fileInputRef.current?.click()}>
        <ImagePlus className="h-4 w-4" />
        Choose from device
      </Button>

      {/* Guidelines */}
      <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Info className="h-4 w-4 text-primary" />
          Design Guidelines
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Minimum 2000x2000px for best quality</li>
          <li>Transparent background recommended</li>
          <li>No copyrighted content</li>
        </ul>
      </div>
    </div>
  );
}
