import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Scale, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = () => {
    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'subscribe_clicked', {
        event_category: 'engagement',
        event_label: 'navbar_subscribe_button',
      });
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Achut Abraham Panchol
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Newsletter CTA and Admin */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
            <Link to="/subscribe">
              <Button variant="legal" size="sm" onClick={handleSubscribe}>
                Subscribe
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Link to="/admin/login" className="block">
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
                <Link to="/subscribe" className="block">
                  <Button variant="legal" size="sm" className="w-full" onClick={handleSubscribe}>
                    Subscribe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;