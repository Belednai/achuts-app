import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Settings, 
  User, 
  Lock, 
  Save,
  Eye,
  EyeOff,
  RotateCcw,
  Shield,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";
import { storage } from "@/lib/storage";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const profileUpdateSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters")
});

type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

const AdminSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const { toast } = useToast();
  const { user, refreshAuth } = useAuth();

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const profileForm = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      email: user?.email || "",
      username: user?.username || ""
    }
  });

  useEffect(() => {
    document.title = "Settings - Admin Dashboard";
    
    // Update form with current user data
    if (user) {
      profileForm.reset({
        email: user.email,
        username: user.username
      });
    }
  }, [user, profileForm]);

  const onPasswordChange = async (values: PasswordChangeValues) => {
    if (isUpdatingPassword) return;

    setIsUpdatingPassword(true);
    try {
      const success = await authService.rotateCredentials(
        values.currentPassword,
        user?.email || "",
        user?.username || "",
        values.newPassword
      );

      if (success) {
        toast({
          title: "Password updated successfully",
          description: "Your password has been changed.",
        });
        
        passwordForm.reset();
        refreshAuth();
      } else {
        toast({
          title: "Password update failed",
          description: "Current password is incorrect.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const onProfileUpdate = async (values: ProfileUpdateValues) => {
    if (isUpdatingProfile) return;

    setIsUpdatingProfile(true);
    try {
      // For profile updates, we need the current password
      // In a real app, this might be handled differently
      const currentPassword = prompt("Please enter your current password to confirm changes:");
      
      if (!currentPassword) {
        setIsUpdatingProfile(false);
        return;
      }

      const success = await authService.rotateCredentials(
        currentPassword,
        values.email,
        values.username,
        user?.passwordHash || "" // Keep same password
      );

      if (success) {
        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been updated.",
        });
        
        refreshAuth();
      } else {
        toast({
          title: "Profile update failed",
          description: "Current password is incorrect.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const clearAllData = () => {
    storage.clearAllData();
    toast({
      title: "Data cleared",
      description: "All admin data has been reset. You will need to log in again.",
      variant: "destructive"
    });
    
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 1000);
  };

  const getStorageStats = () => {
    const articles = storage.getArticles();
    const notifications = storage.getNotifications();
    const pageViews = storage.getPageViews();
    const activity = storage.getActivity();

    return {
      articles: articles.length,
      notifications: notifications.length,
      pageViews: pageViews.length,
      activity: activity.length
    };
  };

  const stats = getStorageStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account, security, and site configuration
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your account details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileUpdate)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      className={profileForm.formState.errors.email ? "border-destructive" : ""}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      {...profileForm.register("username")}
                      className={profileForm.formState.errors.username ? "border-destructive" : ""}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Role: OWNER</span>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="w-full sm:w-auto"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        {...passwordForm.register("currentPassword")}
                        className={passwordForm.formState.errors.currentPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...passwordForm.register("newPassword")}
                        className={passwordForm.formState.errors.newPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                        className={passwordForm.formState.errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            {/* Storage Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Storage Information
                </CardTitle>
                <CardDescription>
                  Current data storage usage and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Articles</p>
                    <p className="text-2xl font-bold">{stats.articles}</p>
                    <p className="text-xs text-muted-foreground">Total articles</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Notifications</p>
                    <p className="text-2xl font-bold">{stats.notifications}</p>
                    <p className="text-xs text-muted-foreground">System notifications</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Page Views</p>
                    <p className="text-2xl font-bold">{stats.pageViews}</p>
                    <p className="text-xs text-muted-foreground">Tracked views</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Activity Events</p>
                    <p className="text-2xl font-bold">{stats.activity}</p>
                    <p className="text-xs text-muted-foreground">Logged events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-destructive mb-2">Reset All Data</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will permanently delete all articles, notifications, analytics data, and settings. 
                      You will need to log in again after this action.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset All Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete:
                            <br />• All articles and drafts
                            <br />• All notifications
                            <br />• All analytics data
                            <br />• All activity logs
                            <br />• All settings
                            <br /><br />
                            You will be logged out and will need to sign in again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={clearAllData}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Reset Everything
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
