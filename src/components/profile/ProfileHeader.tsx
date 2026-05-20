import { useRef, useState } from "react";
import { Camera, BadgeCheck, MapPin, Loader2, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
    coverImage?: string;
    bio: string;
    location?: string;
    isVerified: boolean;
    trustScore: number;
    isOnline?: boolean;
  };
  isOwnProfile?: boolean;
  onAvatarClick?: () => void;
  onUpdate?: (updates: { avatar_url?: string; cover_url?: string }) => Promise<void> | void;
  onEditProfile?: () => void;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ProfileHeader({ user, isOwnProfile, onAvatarClick, onUpdate, onEditProfile }: ProfileHeaderProps) {
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const trustColor =
    user.trustScore >= 90 ? "stroke-emerald-400" : user.trustScore >= 70 ? "stroke-amber-400" : "stroke-orange-400";
  const trustText =
    user.trustScore >= 90 ? "text-emerald-400" : user.trustScore >= 70 ? "text-amber-400" : "text-orange-400";

  const uploadImage = async (file: File, type: "avatar" | "cover"): Promise<string | null> => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Unsupported file type", description: "JPG, PNG, GIF or WEBP only.", variant: "destructive" });
      return null;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return null;
    }
    const fileName = `${user.id}/${type}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true, contentType: file.type });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    return supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl;
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;
    setUploadingAvatar(true);
    const url = await uploadImage(file, "avatar");
    if (url) {
      await onUpdate?.({ avatar_url: url });
      toast({ title: "Profile photo updated" });
    }
    setUploadingAvatar(false);
    e.target.value = "";
  };

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;
    setUploadingCover(true);
    const url = await uploadImage(file, "cover");
    if (url) {
      await onUpdate?.({ cover_url: url });
      toast({ title: "Cover photo updated" });
    }
    setUploadingCover(false);
    e.target.value = "";
  };

  return (
    <div className="relative">
      {/* Cover */}
      <div className="relative h-44 sm:h-56 overflow-hidden">
        <div
          key={user.coverImage || "default-cover"}
          className="absolute inset-0 bg-cover bg-center animate-fade-in transition-all duration-500"
          style={{
            backgroundImage: user.coverImage
              ? `url(${user.coverImage})`
              : "linear-gradient(135deg, hsl(var(--primary)/0.45), hsl(var(--accent)/0.25), hsl(var(--background)))",
          }}
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />

        {isOwnProfile && (
          <>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              aria-label="Change cover photo"
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-strong text-xs font-medium hover:scale-[1.03] active:scale-95 transition-transform shadow-md"
            >
              {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              <span>{uploadingCover ? "Uploading…" : "Edit cover"}</span>
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleCover}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Avatar with trust ring */}
      <div className="absolute -bottom-16 left-4 sm:left-6">
        <div className="relative group" onClick={onAvatarClick}>
          <svg className="absolute -inset-2 w-32 h-32 sm:w-36 sm:h-36 -rotate-90" aria-hidden="true">
            <circle cx="50%" cy="50%" r="48%" fill="none" className="stroke-muted/30" strokeWidth="3" />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              className={cn(trustColor, "transition-all duration-700")}
              strokeWidth="3"
              strokeDasharray={`${user.trustScore * 3.02} 302`}
              strokeLinecap="round"
            />
          </svg>

          <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background cursor-pointer shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
            <AvatarImage src={user.avatar} alt={user.name} className="object-cover animate-fade-in" />
            <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
          </Avatar>

          {/* Online indicator */}
          {user.isOnline && (
            <span className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-background" />
            </span>
          )}

          {/* Trust score badge */}
          <div
            className={cn(
              "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full glass-strong text-[10px] font-bold shadow",
              trustText,
            )}
          >
            {user.trustScore}%
          </div>

          {/* Edit avatar button */}
          {isOwnProfile && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  avatarInputRef.current?.click();
                }}
                disabled={uploadingAvatar}
                aria-label="Change profile photo"
                className="absolute -top-1 -right-1 h-9 w-9 rounded-full bg-primary text-primary-foreground border-2 border-background shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatar}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="pt-24 sm:pt-20 px-4 sm:px-6 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{user.name}</h1>
            {user.isVerified && (
              <BadgeCheck className="h-5 w-5 text-primary fill-primary/20 shrink-0" aria-label="Verified" />
            )}
          </div>
          {isOwnProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-secondary/50 transition-colors"
              aria-label="Edit profile details"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">@{user.username}</p>

        {user.bio && (
          <p className="text-sm text-foreground/90 leading-relaxed max-w-xl pt-1 whitespace-pre-line">{user.bio}</p>
        )}

        {user.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{user.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
