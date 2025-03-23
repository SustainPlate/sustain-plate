
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Package, UserCog, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import DonationsList from './donor/DonationsList';

const DonorDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDonationStats();
    }
  }, [user]);

  const fetchDonationStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('status')
        .eq('donor_id', user?.id);

      if (error) throw error;

      if (data) {
        const active = data.filter(d => d.status === 'available').length;
        const completed = data.filter(d => d.status === 'completed').length;
        setStats({
          active,
          completed,
          total: data.length
        });
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    } finally {
      setLoading(false);
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
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/profile">
              <UserCog className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link to="/create-donation">
              <PlusCircle className="h-4 w-4" />
              Create Donation
            </Link>
          </Button>
        </div>
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Your Donations</CardTitle>
            <CardDescription>Manage your food donation listings</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link to="/create-donation">
              <PlusCircle className="h-4 w-4" />
              New Donation
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DonationsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard;
