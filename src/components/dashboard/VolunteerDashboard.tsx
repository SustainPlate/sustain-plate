
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Calendar, Clock, Loader2, MapPin, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const VolunteerDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [volunteerInfo, setVolunteerInfo] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [stats, setStats] = useState({
    scheduled: 0,
    completed: 0,
    hoursContributed: 0
  });
  const [availableDeliveries, setAvailableDeliveries] = useState<any[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      checkVolunteerStatus();
      if (profile?.user_type.includes('volunteer')) {
        fetchDeliveries();
        fetchStats();
      }
    }
  }, [user, profile]);

  const checkVolunteerStatus = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setIsRegistered(!!data);
      setVolunteerInfo(data);
      
    } catch (error) {
      console.error('Error checking volunteer status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    if (!user) return;
    
    try {
      // Fetch deliveries that are pending assignment
      const { data: availableData, error: availableError } = await supabase
        .from('deliveries')
        .select(`
          *,
          donations (
            id,
            food_name,
            quantity,
            unit,
            expiry_date,
            pickup_address,
            donor_id
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (availableError) throw availableError;
      setAvailableDeliveries(availableData || []);
      
      // Fetch volunteer id
      if (user && volunteerInfo) {
        // Fetch deliveries assigned to this volunteer
        const { data: myData, error: myError } = await supabase
          .from('deliveries')
          .select(`
            *,
            donations (
              id,
              food_name,
              quantity,
              unit,
              expiry_date,
              pickup_address,
              donor_id
            )
          `)
          .eq('volunteer_id', volunteerInfo.id)
          .in('status', ['assigned', 'in_progress'])
          .order('created_at', { ascending: false });
          
        if (myError) throw myError;
        setMyDeliveries(myData || []);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error",
        description: "Failed to load deliveries.",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    if (!user || !volunteerInfo) return;
    
    try {
      // Get scheduled count
      const { count: scheduledCount, error: scheduledError } = await supabase
        .from('deliveries')
        .select('id', { count: 'exact', head: true })
        .eq('volunteer_id', volunteerInfo.id)
        .in('status', ['assigned', 'in_progress']);
        
      if (scheduledError) throw scheduledError;
      
      // Get completed count
      const { count: completedCount, error: completedError } = await supabase
        .from('deliveries')
        .select('id', { count: 'exact', head: true })
        .eq('volunteer_id', volunteerInfo.id)
        .eq('status', 'completed');
        
      if (completedError) throw completedError;
      
      // Get completed deliveries to calculate hours
      const { data: completedDeliveries, error: hoursError } = await supabase
        .from('deliveries')
        .select('pickup_time, delivery_time')
        .eq('volunteer_id', volunteerInfo.id)
        .eq('status', 'completed')
        .not('pickup_time', 'is', null)
        .not('delivery_time', 'is', null);
        
      if (hoursError) throw hoursError;
      
      // Calculate total hours contributed (rough estimate)
      let totalHours = 0;
      if (completedDeliveries) {
        completedDeliveries.forEach(delivery => {
          if (delivery.pickup_time && delivery.delivery_time) {
            const pickupTime = new Date(delivery.pickup_time);
            const deliveryTime = new Date(delivery.delivery_time);
            const hoursDiff = (deliveryTime.getTime() - pickupTime.getTime()) / (1000 * 60 * 60);
            totalHours += Math.min(hoursDiff, 3); // Cap at 3 hours per delivery
          }
        });
      }
      
      setStats({
        scheduled: scheduledCount || 0,
        completed: completedCount || 0,
        hoursContributed: Math.round(totalHours)
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {profile?.full_name || 'Volunteer'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <CardTitle>Become a Volunteer</CardTitle>
            <CardDescription>
              Help deliver food donations to those in need
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="mb-6 text-gray-600">
              As a volunteer, you'll be able to pick up and deliver food donations to NGOs and people in need. 
              Join our network of volunteers and make a difference in your community.
            </p>
            <Button onClick={() => navigate('/volunteer')}>
              Register as Volunteer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Volunteer'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/profile">
              <MapPin className="h-4 w-4" />
              Update Location
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" onClick={fetchDeliveries}>
            <Search className="h-4 w-4" />
            Refresh Opportunities
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Scheduled Pickups</CardTitle>
            <CardDescription>Upcoming food transport tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Deliveries</CardTitle>
            <CardDescription>Your contribution so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Volunteer Hours</CardTitle>
            <CardDescription>Total time contributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.hoursContributed}</div>
          </CardContent>
        </Card>
      </div>

      {myDeliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Deliveries</CardTitle>
            <CardDescription>Deliveries you've accepted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {myDeliveries.map((delivery) => (
                <div key={delivery.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{delivery.donations.food_name}</h3>
                      <p className="text-sm text-gray-500">
                        {delivery.donations.quantity} {delivery.donations.unit}
                      </p>
                    </div>
                    <Badge className={
                      delivery.status === 'assigned' ? 'bg-blue-500' : 
                      delivery.status === 'in_progress' ? 'bg-indigo-500' : 'bg-gray-500'
                    }>
                      {delivery.status === 'assigned' ? 'Assigned' : 
                       delivery.status === 'in_progress' ? 'In Progress' : delivery.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{delivery.donations.pickup_address}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Expires: {formatDate(delivery.donations.expiry_date)}</span>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/delivery/${delivery.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Deliveries</CardTitle>
          <CardDescription>Food donations that need delivery volunteers</CardDescription>
        </CardHeader>
        <CardContent>
          {availableDeliveries.length > 0 ? (
            <div className="divide-y">
              {availableDeliveries.map((delivery) => (
                <div key={delivery.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{delivery.donations.food_name}</h3>
                    <Badge className="bg-yellow-500">Available</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {delivery.donations.quantity} {delivery.donations.unit}
                  </p>
                  
                  <div className="flex items-start text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{delivery.donations.pickup_address}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Expires: {formatDate(delivery.donations.expiry_date)}</span>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/delivery/${delivery.id}`}>
                        Accept Delivery
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No available deliveries</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                There are no food donations that need delivery at the moment.
              </p>
              <Button variant="outline" onClick={fetchDeliveries}>
                <Search className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
