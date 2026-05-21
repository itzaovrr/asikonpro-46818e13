import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarUser } from "./sidebar/SidebarUser";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarSecondary } from "./sidebar/SidebarSecondary";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[300px] p-0 border-r border-border/40 h-[100dvh] overflow-hidden overscroll-contain bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-2xl shadow-[24px_0_60px_-24px_hsl(0_0%_0%/0.45)]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Decorative accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(600px 240px at 0% 0%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(400px 200px at 100% 100%, hsl(var(--accent) / 0.10), transparent 65%)",
          }}
        />
        {/* Right edge hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent"
        />

        <div className="relative flex flex-col h-full">
          {/* User Section */}
          <SidebarUser onClose={handleClose} />

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 overscroll-contain [&>[data-radix-scroll-area-viewport]]:overscroll-contain [&>[data-radix-scroll-area-viewport]]:touch-pan-y">
            {/* Primary Navigation */}
            <SidebarNav onClose={handleClose} />

            {/* Secondary Navigation */}
            <SidebarSecondary onClose={handleClose} />
          </ScrollArea>

          {/* Footer */}
          <SidebarFooter onClose={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

