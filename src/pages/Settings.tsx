import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Lock, Moon, LogOut, ChevronRight, Camera, Shield, Eye, Palette, Coins } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useUserSettings, useUpdateUserSettings, type UserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: settings, isLoading: settingsLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", full_name: "", bio: "" });

  const handleEditProfile = () => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
      });
    }
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast({ title: "Profile updated" });
        setEditMode(false);
      },
      onError: () => toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" }),
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const setSetting = (patch: Partial<UserSettings>) => {
    updateSettings.mutate(patch, {
      onError: () => toast({ title: "Couldn't save", variant: "destructive" }),
    });
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]"><p>Loading...</p></div>
      </AppLayout>
    );
  }
  if (!user) { navigate("/auth"); return null; }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-3 pb-24 max-w-2xl space-y-4">
        {/* Profile */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Profile</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-2xl">
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1">
              <p className="font-medium">{profile?.full_name || profile?.username || "User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {!editMode && <Button variant="outline" onClick={handleEditProfile}>Edit</Button>}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={formData.username}
                  onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <Row label="Username" value={profile?.username} />
              <Row label="Full Name" value={profile?.full_name} />
              <Row label="Bio" value={profile?.bio} />
            </div>
          )}
        </div>

        {/* Privacy */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile visibility</Label>
              <Select
                value={settings?.profile_visibility ?? "public"}
                onValueChange={(v) => setSetting({ profile_visibility: v as UserSettings["profile_visibility"] })}
                disabled={settingsLoading}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — anyone can view</SelectItem>
                  <SelectItem value="followers">Followers only</SelectItem>
                  <SelectItem value="private">Private — only you</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Who can message me</Label>
              <Select
                value={settings?.allow_messages_from ?? "everyone"}
                onValueChange={(v) => setSetting({ allow_messages_from: v as UserSettings["allow_messages_from"] })}
                disabled={settingsLoading}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="followers">Followers only</SelectItem>
                  <SelectItem value="none">No one</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <ToggleRow
              icon={<Eye className="h-4 w-4 text-muted-foreground" />}
              title="Show online status"
              desc="Let others see when you're active"
              checked={settings?.show_online_status ?? true}
              disabled={settingsLoading}
              onChange={(c) => setSetting({ show_online_status: c })}
            />
            <Separator />
            <ToggleRow
              title="Show my orders to followers"
              desc="Recent purchases visible on your profile"
              checked={settings?.show_orders_to_followers ?? false}
              disabled={settingsLoading}
              onChange={(c) => setSetting({ show_orders_to_followers: c })}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <ToggleRow title="Order updates" desc="Get notified about your orders"
              checked={settings?.notify_orders ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_orders: c })} />
            <Separator />
            <ToggleRow title="Promotions" desc="Receive deals and offers"
              checked={settings?.notify_promotions ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_promotions: c })} />
            <Separator />
            <ToggleRow title="Community" desc="Likes and comments on your posts"
              checked={settings?.notify_community ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_community: c })} />
            <Separator />
            <ToggleRow title="Messages" desc="New direct messages"
              checked={settings?.notify_messages ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_messages: c })} />
            <Separator />
            <ToggleRow title="New followers" desc="When someone follows you"
              checked={settings?.notify_follows ?? true} disabled={settingsLoading}
              onChange={(c) => setSetting({ notify_follows: c })} />
          </div>
        </div>

        {/* Appearance & Preferences */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Appearance & Preferences</h2>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              <Moon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-sm">Theme</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              <Coins className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-sm">Currency</p>
                <p className="text-xs text-muted-foreground">Display prices in your preferred currency</p>
              </div>
            </div>
            <CurrencyToggle />
          </div>
        </div>

        {/* Other Settings */}
        <div className="glass rounded-2xl overflow-hidden">
          <button onClick={() => navigate("/auth?mode=reset")} className="w-full flex items-center justify-between p-4 hover:bg-secondary/50">
            <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-muted-foreground" /><span>Change Password</span></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>

        <section className="pt-4">
          <h2 className="font-semibold text-lg mb-3">About ASIKON</h2>
          <MissionVision />
        </section>
      </div>
    </AppLayout>
  );
};

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value || "Not set"}</span>
    </div>
  );
}

function ToggleRow({
  icon, title, desc, checked, onChange, disabled,
}: {
  icon?: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-2 min-w-0">
        {icon}
        <div className="min-w-0">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

export default Settings;
