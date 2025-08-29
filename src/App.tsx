import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Subscribe from "./pages/Subscribe";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import RSS from "./pages/RSS";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/AdminOverview";
import AdminNotifications from "./pages/AdminNotifications";
import AdminArticles from "./pages/AdminArticles";
import NotFound from "./pages/NotFound";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/rss" element={<RSS />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <RequireAuth fallback={<Navigate to="/admin/login" replace />}>
                  <AdminOverview />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/notifications" 
              element={
                <RequireAuth fallback={<Navigate to="/admin/login" replace />}>
                  <AdminNotifications />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/articles" 
              element={
                <RequireAuth fallback={<Navigate to="/admin/login" replace />}>
                  <AdminArticles />
                </RequireAuth>
              } 
            />
            
            {/* Legacy admin route redirect */}
            <Route path="/admin/legacy" element={<Admin />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
