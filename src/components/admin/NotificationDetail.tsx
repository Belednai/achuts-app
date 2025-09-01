import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  X, 
  Trash2, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import type { Notification } from "@/lib/types";

interface NotificationDetailProps {
  notificationId?: string;
  isModal?: boolean;
  onClose?: () => void;
  onUpdate?: () => void;
}

const NotificationDetail = ({ notificationId, isModal = false, onClose, onUpdate }: NotificationDetailProps) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const id = notificationId || params.id;
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadNotification();
    }
  }, [id]);

  const loadNotification = () => {
    if (!id) return;
    
    const found = storage.getNotificationById(id);
    if (found) {
      setNotification(found);
      
      // Mark as read when opened (configurable behavior)
      if (!found.isRead) {
        markAsRead(id);
      }
    }
  };

  const markAsRead = (notificationId: string) => {
    storage.markNotificationAsRead(notificationId);
    setNotification(prev => prev ? { ...prev, isRead: true } : null);
    onUpdate?.();
  };

  const markAsUnread = (notificationId: string) => {
    storage.markNotificationAsUnread(notificationId);
    setNotification(prev => prev ? { ...prev, isRead: false } : null);
    onUpdate?.();
  };

  const deleteNotification = async (notificationId: string) => {
    setIsLoading(true);
    try {
      storage.deleteNotification(notificationId);
      
      toast({
        title: "Notification deleted",
        description: "The notification has been permanently removed.",
      });

      if (isModal) {
        onClose?.();
      } else {
        navigate('/admin/notifications');
      }
      
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ERROR':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'WARN':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'INFO':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ERROR':
        return <Badge variant="destructive">{type}</Badge>;
      case 'WARN':
        return <Badge variant="secondary">{type}</Badge>;
      case 'INFO':
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (!notification) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Notification Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested notification could not be found.
          </p>
        </div>
      </div>
    );
  }

  const content = (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(notification.type)}
            <div>
              <CardTitle className="text-xl">{notification.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                {getTypeBadge(notification.type)}
                <span className="text-sm text-muted-foreground">
                  {formatDate(notification.createdAt)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({new Date(notification.createdAt).toLocaleString()})
                </span>
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {notification.isRead ? (
                <DropdownMenuItem onClick={() => markAsUnread(notification.id)}>
                  <X className="h-4 w-4 mr-2" />
                  Mark as unread
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as read
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => deleteNotification(notification.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {notification.body}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Status: {notification.isRead ? 'Read' : 'Unread'}
            </span>
            <span>
              ID: {notification.id}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notification Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/notifications')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notifications
        </Button>
      </div>
      
      {content}
    </div>
  );
};

export default NotificationDetail;
