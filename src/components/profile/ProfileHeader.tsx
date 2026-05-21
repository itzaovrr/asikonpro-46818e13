import { useRef, useState } from "react";
import { Camera, BadgeCheck, Loader2 } from "lucide-react";
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
    isVerified: boolean;
    trustScore: number;
    isOnline?: boolean;
  };
  isOwnProfile?: boolean;
  onAvatarClick?: () => void;
  onUpdate?: (updates: { avatar_url?: string; cover_url?: string }) => Promise<void> | void;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ProfileHeader({ user, isOwnProfile, onAvatarClick, onUpdate }: ProfileHeaderProps) {
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const trustColor =
    user.trustScore >= 90 ? "stroke-emerald-400" : user.trustScore >= 70 ? "stroke-amber-400" : "stroke-primary";

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
    <header className="relative">
      {/* Cover */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        {user.coverImage ? (
          <div
            key={user.coverImage}
            className="absolute inset-0 bg-cover bg-center animate-fade-in"
            style={{ backgroundImage: `url(${user.coverImage})` }}
          />
        ) : (
          <div
            key="default-cover"
            className="absolute inset-0 animate-fade-in"
            style={{
              background:
                "linear-gradient(135deg, hsl(233 80% 30%) 0%, hsl(280 80% 25%) 50%, hsl(220 90% 20%) 100%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />

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

      {/* Centered IG-style avatar + identity */}
      <div className="flex flex-col items-center px-4 -mt-14 sm:-mt-16 text-center">
        <div className="relative group" onClick={onAvatarClick}>
          <svg className="absolute -inset-1.5 w-[8.5rem] h-[8.5rem] sm:w-[9.5rem] sm:h-[9.5rem] -rotate-90" aria-hidden="true">
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
            <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
            <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
          </Avatar>

          {user.isOnline && (
            <span className="absolute bottom-2 right-2 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-background" />
            </span>
          )}

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
                className="absolute -bottom-1 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground border-2 border-background shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
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

        <div className="mt-3 flex items-center gap-2 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{user.name}</h1>
          {user.isVerified && (
            <BadgeCheck className="h-5 w-5 text-primary fill-primary/20 shrink-0" aria-label="Verified" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">@{user.username}</p>

        {user.bio && (
          <p className="mt-2 text-sm text-foreground/90 leading-relaxed max-w-md whitespace-pre-line">
            {user.bio}
          </p>
        )}
      </div>
    </header>
  );
}
