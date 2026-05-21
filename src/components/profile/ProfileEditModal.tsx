import { useState, useRef } from "react";
import { Camera, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { COVER_GRADIENTS, type CoverGradientKey } from "@/lib/cover-gradients";
import { cn } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const RESERVED_USERNAMES = ["admin", "moderator", "system", "support", "root", "administrator"];

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{3,20}$/, "Username must be 3–20 chars (letters, numbers, _ or -)")
    .refine((v) => !RESERVED_USERNAMES.includes(v.toLowerCase()), "This username is reserved")
    .optional()
    .or(z.literal("")),
  full_name: z.string().trim().max(100, "Full name too long").optional().or(z.literal("")),
  bio: z.string().trim().max(500, "Bio must be ≤ 500 characters").optional().or(z.literal("")),
  location: z.string().trim().max(80, "Location too long").optional().or(z.literal("")),
  website: z
    .string()
    .trim()
    .regex(/^https?:\/\/.+/i, "Website must start with http:// or https://")
    .max(200, "Website URL too long")
    .optional()
    .or(z.literal("")),
});

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    cover_url?: string | null;
    website?: string | null;
    location?: string | null;
    cover_gradient?: string | null;
  };
  onSave: (updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    cover_url?: string;
    website?: string | null;
    location?: string | null;
    cover_gradient?: string | null;
  }) => Promise<void>;
}

export function ProfileEditModal({ isOpen, onClose, profile, onSave }: ProfileEditModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [formData, setFormData] = useState({
    username: profile.username || "",
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    avatar_url: profile.avatar_url || "",
    cover_url: profile.cover_url || "",
    website: profile.website || "",
    location: profile.location || "",
    cover_gradient: (profile.cover_gradient as CoverGradientKey) || "gradient-1",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, type: "avatar" | "cover"): Promise<string | null> => {
    try {
      // Server-side-ish validation (Storage will still receive whatever bytes, but we reject obvious abuse here)
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTS.includes(ext)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload a JPG, PNG, GIF, or WEBP image. SVG is not allowed.",
          variant: "destructive",
        });
        return null;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast({
          title: "File too large",
          description: "Images must be 5 MB or less.",
          variant: "destructive",
        });
        return null;
      }

      const fileName = `${profile.id}/${type}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true, contentType: file.type });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const url = await uploadImage(file, "avatar");
    if (url) {
      setFormData(prev => ({ ...prev, avatar_url: url }));
    }
    setUploadingAvatar(false);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const url = await uploadImage(file, "cover");
    if (url) {
      setFormData(prev => ({ ...prev, cover_url: url }));
    }
    setUploadingCover(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = profileSchema.safeParse({
      username: formData.username,
      full_name: formData.full_name,
      bio: formData.bio,
      location: formData.location,
      website: formData.website,
    });
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      toast({
        title: "Invalid input",
        description: first?.message ?? "Please check the form values.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...formData,
        website: formData.website?.trim() ? formData.website.trim() : null,
        location: formData.location?.trim() ? formData.location.trim() : null,
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-strong max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div 
              className="relative h-24 rounded-xl bg-secondary overflow-hidden cursor-pointer group"
              onClick={() => coverInputRef.current?.click()}
            >
              {formData.cover_url ? (
                <img 
                  src={formData.cover_url} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadingCover ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          {/* Cover gradient picker (used when no cover image is set) */}
          <div className="space-y-2">
            <Label>Cover Gradient</Label>
            <p className="text-xs text-muted-foreground">Used when you don't upload a cover photo.</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(COVER_GRADIENTS) as [CoverGradientKey, { label: string; css: string }][]).map(
                ([key, g]) => {
                  const selected = formData.cover_gradient === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, cover_gradient: key }))}
                      className={cn(
                        "relative h-12 rounded-lg overflow-hidden border-2 transition-all",
                        selected ? "border-primary scale-[1.02]" : "border-transparent hover:border-border",
                      )}
                      style={{ background: g.css }}
                      aria-label={`Cover gradient ${g.label}`}
                    >
                      {selected && (
                        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              <div 
                className="relative cursor-pointer group"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="text-xl">
                    {formData.full_name?.[0] || formData.username?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploadingAvatar ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Click to change your profile photo
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="username"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-primary border-0"
              disabled={loading || uploadingAvatar || uploadingCover}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
              maxLength={80}
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              placeholder="https://your-site.com"
            />
          </div>
      </DialogContent>
    </Dialog>
  );
}
