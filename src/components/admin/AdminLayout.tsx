import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  Bell, 
  FileText, 
  FileEdit, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Shield,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { storage } from "@/lib/storage";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      path: '/admin',
      badge: undefined
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      path: '/admin/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      id: 'articles',
      label: 'Articles',
      icon: FileText,
      path: '/admin/articles'
    },
    {
      id: 'drafts',
      label: 'Drafts',
      icon: FileEdit,
      path: '/admin/drafts'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      path: '/admin/articles?status=ARCHIVED'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  // Update unread notifications count
  useEffect(() => {
    const updateUnreadCount = () => {
      const notifications = storage.getNotifications();
      const unread = notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    };

    updateUnreadCount();
    
    // Update count every 30 seconds
    const interval = setInterval(updateUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };


  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle navigation"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Brand */}
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* User Info - Always visible */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user ? getInitials(user.displayName || user.username) : 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm">
                    {user?.displayName || user?.username || 'Admin'}
                  </span>
                </div>
                {/* Logout button - Desktop only */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden lg:flex text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-lg">
            {/* Mobile Navigation */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Admin</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Logout Button - Mobile only */}
              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile, show as top bar menu items) */}
      <div className="hidden lg:block">
        <nav className="bg-card border-b px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActivePath(item.path)
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
                {item.badge && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
