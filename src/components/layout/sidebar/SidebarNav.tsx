import { 
  Home, 
  Users, 
  FileText, 
  Video, 
  Film, 
  Radio, 
  Star, 
  Library, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Wand2,
  ChevronDown,
  Package,
  Bot,
  Laptop,
  Brain,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, href, isActive, onClick }: NavItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-foreground hover:bg-secondary"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

interface SidebarNavProps {
  onClose?: () => void;
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const location = useLocation();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const communityItems = [
    { icon: <Home className="w-5 h-5" />, label: "My Feed", href: "/community" },
    { icon: <FileText className="w-5 h-5" />, label: "Posts", href: "/community?tab=posts" },
    { icon: <Video className="w-5 h-5" />, label: "Videos", href: "/community?tab=videos" },
    { icon: <Film className="w-5 h-5" />, label: "Shorts", href: "/community?tab=shorts" },
    { icon: <Radio className="w-5 h-5" />, label: "Live", href: "/community?tab=live" },
    { icon: <Star className="w-5 h-5" />, label: "Reviews", href: "/community?tab=reviews" },
  ];

  const shopItems = [
    { icon: <Library className="w-5 h-5" />, label: "Library Home", href: "/shop" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Courses", href: "/shop?type=courses" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Books", href: "/shop?type=books" },
    { icon: <Package className="w-5 h-5" />, label: "Student Kits", href: "/shop?type=kits" },
    { icon: <Wand2 className="w-5 h-5" />, label: "Prompt Library", href: "/shop?type=prompts" },
    { icon: <Sparkles className="w-5 h-5" />, label: "New Arrivals", href: "/shop?category=new" },
  ];

  const categories = [
    { icon: <Brain className="w-5 h-5" />, label: "AI & Machine Learning", href: "/shop?category=ai-ml" },
    { icon: <Laptop className="w-5 h-5" />, label: "Programming", href: "/shop?category=programming" },
    { icon: <Bot className="w-5 h-5" />, label: "AI Tutor", href: "/shop?category=ai-tutor" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Self-Improvement", href: "/shop?category=self-improvement" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Exam Prep", href: "/shop?category=exam-prep" },
    { icon: <Wand2 className="w-5 h-5" />, label: "Prompt Engineering", href: "/shop?category=prompts" },
  ];

  return (
    <nav className="flex-1 overflow-y-auto py-2 px-2">
      {/* AI Tutor */}
      <div className="mb-4">
        <NavItem
          icon={<Sparkles className="w-5 h-5 text-primary" />}
          label="AI Tutor"
          href="/learn"
          isActive={location.pathname.startsWith("/learn")}
          onClick={onClose}
        />
        <NavItem
          icon={<Sparkles className="w-5 h-5" />}
          label="About ASIKON"
          href="/about"
          isActive={location.pathname === "/about"}
          onClick={onClose}
        />
      </div>

      {/* Community Section */}
      <div className="mb-4">
        <div className="px-3 py-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </h4>
        </div>
        <div className="space-y-0.5">
          {communityItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname + location.search === item.href}
              onClick={onClose}
            />
          ))}
        </div>
      </div>

      {/* Library Section */}
      <div className="mb-4">
        <div className="px-3 py-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Library className="w-4 h-4" />
            Library
          </h4>
        </div>
        <div className="space-y-0.5">
          {shopItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname + location.search === item.href}
              onClick={onClose}
            />
          ))}
        </div>
      </div>

      {/* Categories (Expandable) */}
      <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Categories
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform",
              categoriesOpen && "rotate-180"
            )} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-0.5 mt-1">
            {categories.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={location.pathname + location.search === item.href}
                onClick={onClose}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}
