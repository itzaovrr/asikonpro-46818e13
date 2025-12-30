import { cn } from "@/lib/utils";

const stickerCategories = [
  { id: "emojis", name: "Emojis", stickers: ["😀", "😎", "🔥", "💯", "✨", "❤️", "👑", "🎨"] },
  { id: "shapes", name: "Shapes", stickers: ["⭐", "◆", "●", "■", "▲", "♦", "♠", "♣"] },
  { id: "icons", name: "Icons", stickers: ["☮️", "☯️", "♻️", "⚡", "💀", "🎵", "🌟", "🌈"] },
  { id: "seasonal", name: "Seasonal", stickers: ["🎄", "🎃", "🐰", "💝", "🎆", "🌸", "🍂", "❄️"] },
];

export function StickersPanel() {
  const handleStickerClick = (sticker: string) => {
    console.log("Sticker selected:", sticker);
    // TODO: Add sticker to canvas
  };

  return (
    <div className="space-y-4">
      {stickerCategories.map((category) => (
        <div key={category.id}>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            {category.name}
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {category.stickers.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => handleStickerClick(sticker)}
                className={cn(
                  "aspect-square rounded-lg border border-border text-2xl",
                  "hover:border-primary hover:bg-primary/5 transition-colors",
                  "flex items-center justify-center"
                )}
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
