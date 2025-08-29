import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail, Shield, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const subscribeFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  honeypot: z.string().max(0, "Bot detected"), // Honeypot field for spam protection
});

type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

const Subscribe = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      honeypot: "",
    },
  });

  const onSubmit = async (values: SubscribeFormValues) => {
    if (rateLimitExceeded) {
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'subscribe_clicked', {
        event_category: 'engagement',
        event_label: 'newsletter_signup',
      });
    }

    try {
      // Simulate API call to newsletter service
      // In a real implementation, this would call your newsletter provider's API
      
      // Basic rate limiting check
      const rateLimitKey = 'newsletter_subscribe_attempts';
      const now = Date.now();
      const oneMinute = 60 * 1000;
      const rateLimit = 3;

      let attempts = [];
      try {
        const stored = localStorage.getItem(rateLimitKey);
        if (stored) {
          attempts = JSON.parse(stored).filter((time: number) => now - time < oneMinute);
        }
      } catch (e) {
        attempts = [];
      }

      if (attempts.length >= rateLimit) {
        setRateLimitExceeded(true);
        setError("Too many requests. Please try again in a few minutes.");
        return;
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update rate limiting
      attempts.push(now);
      try {
        localStorage.setItem(rateLimitKey, JSON.stringify(attempts));
      } catch (e) {
        // localStorage not available
      }

      // Simulate random failure for testing
      if (Math.random() < 0.1) { // 10% chance of failure
        throw new Error('Network error. Please try again.');
      }

      console.log('Newsletter subscription:', { 
        email: values.email, 
        firstName: values.firstName,
        timestamp: new Date().toISOString()
      });

      setIsSuccess(true);
      form.reset();
      
      toast({
        title: "Successfully subscribed!",
        description: "Check your email for a confirmation message.",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      
      toast({
        title: "Subscription failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRateLimitExceeded(false);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Subscribe</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Subscribe to Our Newsletter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest legal insights, case analyses, and commentary on constitutional law and legal developments in Kenya.
              </p>
            </div>

            {/* Success State */}
            {isSuccess && (
              <Card className="mb-8 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Successfully Subscribed!</h3>
                      <p className="text-green-700">
                        Thank you for subscribing. Please check your email for a confirmation message and follow the instructions to complete your subscription.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Alert className="mb-8" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Subscription Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Newsletter Subscription
                </CardTitle>
                <CardDescription>
                  Join our community of legal professionals and stay informed about the latest developments in Kenyan law.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Honeypot field - hidden from users but visible to bots */}
                    <div className="hidden">
                      <input
                        ref={honeypotRef}
                        type="text"
                        name="honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        {...form.register("honeypot")}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                              disabled={isSubmitting}
                              aria-describedby="firstName-description"
                            />
                          </FormControl>
                          <FormDescription id="firstName-description">
                            Help us personalize your newsletter experience.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              {...field}
                              disabled={isSubmitting}
                              aria-describedby="email-description"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormDescription id="email-description">
                            We'll never share your email address with third parties.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      variant="legal"
                      size="lg"
                      disabled={isSubmitting || rateLimitExceeded}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Subscribe to Newsletter
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">Weekly Updates</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive a curated digest of the week's most important legal developments every Friday.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">Expert Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    In-depth commentary on constitutional law, case studies, and legal precedents.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">Exclusive Content</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Access to subscriber-only articles and early notification of new publications.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Notice */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Privacy & Data Protection</h4>
              <p className="text-sm text-muted-foreground">
                Your email address is used solely for sending our newsletter. We comply with all applicable data protection laws including the Kenya Data Protection Act, 2019. You can unsubscribe at any time by clicking the link in any newsletter. Read our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for more details.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscribe;
