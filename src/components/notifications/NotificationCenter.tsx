
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

  // For demo purposes, let's create a mock function to simulate notifications
  const createMockNotifications = () => {
    if (!user) return [];
    
    // Just for demo, we'll create mock data
    return [
      {
        id: '1',
        user_id: user.id,
        title: 'Donation Match Found',
        message: 'Your donation "Canned Goods" has been matched with a nearby NGO.',
        read: false,
        created_at: new Date().toISOString(),
        related_to: 'donation',
        related_id: '123',
      },
      {
        id: '2',
        user_id: user.id,
        title: 'Volunteer Assigned',
        message: 'A volunteer has been assigned to pick up your food donation.',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        related_to: 'donation',
        related_id: '456',
      },
    ];
  };

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
      // In a real implementation, you would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });
      
      // For now, just use mock data
      const mockData = createMockNotifications();
      setNotifications(mockData);
      setUnreadCount(mockData.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    // In a real implementation, you would update the database
    // const { error } = await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', id);
    
    // Update locally for now
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    // In a real implementation, you would update the database
    // const { error } = await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('user_id', user.id)
    //   .eq('read', false);
    
    // Update locally for now
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
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
                  className={`border-b p-3 ${!notification.read ? 'bg-gray-50' : ''}`}
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
                        onClick={() => markAsRead(notification.id)}
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
