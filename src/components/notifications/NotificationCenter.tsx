
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  related_to: string | null;
  related_id: string | null;
};

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, user]);

  useEffect(() => {
    // Update unread count
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data ? data.filter(n => !n.read).length : 0);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to update notification: " + error.message,
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read.",
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to update notifications: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark the notification as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on related_to and related_id if they exist
    if (notification.related_to && notification.related_id) {
      switch (notification.related_to) {
        case 'donation':
          // Navigate to donation details
          // navigate(`/donation/${notification.related_id}`);
          toast({
            title: "Coming soon",
            description: "Donation detail view will be available soon.",
          });
          break;
        case 'delivery':
          navigate(`/delivery/${notification.related_id}`);
          break;
        default:
          // Do nothing or show a generic toast
          break;
      }
    }
    
    // Close the popover
    setOpen(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1 min-w-4 h-4 flex items-center justify-center text-[10px] bg-red-500"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-b p-3 ${!notification.read ? 'bg-gray-50' : ''} cursor-pointer hover:bg-gray-100`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h5 className="font-medium text-sm">{notification.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(notification.created_at)}</p>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
