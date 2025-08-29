import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginRequest } from "@/lib/types";
import { forceInitializeAdminSystem } from "@/lib/seed";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required").max(100),
  password: z.string().min(1, "Password is required").max(200),
  rememberMe: z.boolean().default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      rememberMe: false
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Set page title
  useEffect(() => {
    document.title = "Admin Login - Achut's Legal Notebook";
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const request: LoginRequest = {
        usernameOrEmail: values.usernameOrEmail.trim(),
        password: values.password,
        rememberMe: values.rememberMe
      };

      const result = await login(request);

      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });

        // Navigate to intended page or dashboard
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });

        // Clear password field on error
        form.setValue('password', '');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Default credentials info */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Default credentials:</strong><br />
            Username: <code className="bg-muted px-1 rounded">admin</code><br />
            Password: <code className="bg-muted px-1 rounded">admin123!</code><br />
            <em>Please change these after first login.</em>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    await forceInitializeAdminSystem();
                    toast({
                      title: "System reinitialized",
                      description: "Admin system has been reset and reinitialized. Try logging in again.",
                    });
                  } catch (error) {
                    toast({
                      title: "Initialization failed", 
                      description: "Check console for details.",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Reset & Reinitialize System
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username/Email */}
              <div className="space-y-2">
                <Label htmlFor="usernameOrEmail">Username or Email</Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  placeholder="Enter username or email"
                  autoComplete="username"
                  {...form.register("usernameOrEmail")}
                  className={form.formState.errors.usernameOrEmail ? "border-destructive" : ""}
                />
                {form.formState.errors.usernameOrEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.usernameOrEmail.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    {...form.register("password")}
                    className={form.formState.errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={form.watch("rememberMe")}
                  onCheckedChange={(checked) => form.setValue("rememberMe", !!checked)}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Achut's Legal Notebook. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
