import { Search, Bell } from "lucide-react";

export function CommunityHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h1 className="text-xl font-bold text-gradient">Community</h1>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </div>
  );
}
