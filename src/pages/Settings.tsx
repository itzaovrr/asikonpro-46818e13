import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Lock, Moon, LogOut, ChevronRight, Camera } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: true,
    community: true,
  });

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
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        setEditMode(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      },
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Profile Section */}
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
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
            {!editMode && (
              <Button variant="outline" onClick={handleEditProfile}>
                Edit
              </Button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username</span>
                <span>{profile?.username || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Name</span>
                <span>{profile?.full_name || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bio</span>
                <span>{profile?.bio || "Not set"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-muted-foreground">Get notified about your orders</p>
              </div>
              <Switch
                checked={notifications.orders}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, orders: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-sm text-muted-foreground">Receive deals and offers</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, promotions: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Community</p>
                <p className="text-sm text-muted-foreground">Likes, comments, and follows</p>
              </div>
              <Switch
                checked={notifications.community}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, community: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span>Change Password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <Separator />
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <span>Appearance</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Sign Out */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
};

export default Settings;
