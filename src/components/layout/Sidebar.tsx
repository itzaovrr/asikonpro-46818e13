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
        className="w-[280px] p-0 bg-background/95 backdrop-blur-xl border-r border-border h-[100dvh] overflow-hidden overscroll-contain"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* User Section */}
          <SidebarUser onClose={handleClose} />
          
          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
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
