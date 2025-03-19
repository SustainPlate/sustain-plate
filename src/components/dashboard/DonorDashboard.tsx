
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Package, Calendar, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

type Donation = {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  status: string;
  created_at: string;
  pickup_address: string;
  description: string | null;
};

const DonorDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setDonations(data as Donation[]);
        
        // Calculate stats
        const active = data.filter(d => d.status === 'available').length;
        const completed = data.filter(d => d.status === 'completed').length;
        setStats({
          active,
          completed,
          total: data.length
        });
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Helper function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Pickup</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Donor'}
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link to="/create-donation">
            <PlusCircle className="h-4 w-4" />
            Create Food Donation
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Donations</CardTitle>
            <CardDescription>Your current food donation listings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats.active}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Donations</CardTitle>
            <CardDescription>Successfully delivered donations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats.completed}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Impact</CardTitle>
            <CardDescription>Meals provided through your donations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Manage your recent food donation listings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{donation.food_name}</h3>
                      <p className="text-sm text-gray-500">
                        {donation.quantity} {donation.unit}
                      </p>
                    </div>
                    <div>{getStatusBadge(donation.status)}</div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Expires: {formatDate(donation.expiry_date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Created: {formatDate(donation.created_at)}
                    </div>
                  </div>
                  
                  {donation.description && (
                    <p className="mt-2 text-sm line-clamp-2">{donation.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No donations yet</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                You haven't created any food donation listings yet.
              </p>
              <Button variant="outline" asChild>
                <Link to="/create-donation">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first donation
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
        {donations.length > 0 && (
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline" asChild>
              <Link to="/create-donation">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Another Donation
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DonorDashboard;
