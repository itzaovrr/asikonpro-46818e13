import { useState } from "react";
import { Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const fonts = [
  { name: "Inter", value: "Inter" },
  { name: "Playfair", value: "Playfair Display" },
  { name: "Bebas", value: "Bebas Neue" },
  { name: "Roboto", value: "Roboto" },
  { name: "Oswald", value: "Oswald" },
];

const textColors = [
  "#000000", "#FFFFFF", "#EF4444", "#F59E0B", "#22C55E", 
  "#3B82F6", "#8B5CF6", "#EC4899"
];

export function TextPanel() {
  const [text, setText] = useState("");
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState([32]);
  const [textColor, setTextColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");

  const handleAddText = () => {
    if (text.trim()) {
      console.log("Adding text:", { text, font, fontSize: fontSize[0], textColor, isBold, isItalic, align });
      // TODO: Add text to canvas
    }
  };

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Your Text</Label>
        <Input
          placeholder="Enter your text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Font Selection */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Font</Label>
        <div className="flex flex-wrap gap-1.5">
          {fonts.map((f) => (
            <button
              key={f.value}
              onClick={() => setFont(f.value)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                font === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              )}
              style={{ fontFamily: f.value }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Size: {fontSize[0]}px
        </Label>
        <Slider
          value={fontSize}
          onValueChange={setFontSize}
          min={12}
          max={72}
          step={1}
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Color</Label>
        <div className="flex gap-1.5">
          {textColors.map((color) => (
            <button
              key={color}
              onClick={() => setTextColor(color)}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                textColor === color ? "border-primary scale-110" : "border-border"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Style & Alignment */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border">
          <Button
            variant={isBold ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsBold(!isBold)}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isItalic ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsItalic(!isItalic)}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border">
          <Button
            variant={align === "left" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setAlign("left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={align === "center" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setAlign("center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={align === "right" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setAlign("right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Button */}
      <Button 
        className="w-full gap-2" 
        onClick={handleAddText}
        disabled={!text.trim()}
      >
        <Type className="h-4 w-4" />
        Add Text to Design
      </Button>
    </div>
  );
}
