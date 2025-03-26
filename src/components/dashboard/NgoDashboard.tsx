
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import StatsCards from './ngo/StatsCards';
import DonationTable, { Donation } from './ngo/DonationTable';
import ReservationDialog from './ngo/ReservationDialog';
import MyReservations from './ngo/MyReservations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NgoDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservingDonation, setReservingDonation] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [stats, setStats] = useState({
    available: 0,
    reserved: 0,
    completed: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableDonations();
  }, []);

  const fetchAvailableDonations = async () => {
    try {
      setLoading(true);
      
      // Get all available donations
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count donations by status
      // Using separate queries instead of group by since TypeScript doesn't recognize the group method
      const availableCountQuery = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');
        
      const pendingCountQuery = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      const completedCountQuery = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      setDonations(data as Donation[]);
      
      // Process stats with individual counts
      setStats({
        available: availableCountQuery.count || 0,
        reserved: pendingCountQuery.count || 0,
        completed: completedCountQuery.count || 0
      });
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donations. ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openReservationConfirm = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowConfirmDialog(true);
  };

  const handleReserveDonation = async (donationId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to reserve donations.",
        variant: "destructive",
      });
      return;
    }

    try {
      setReservingDonation(donationId);
      setReservationLoading(true);

      // Call the Supabase function to reserve the donation
      const { data, error } = await supabase.rpc('reserve_donation', {
        donation_id: donationId,
        ngo_id: user.id
      });

      if (error) throw error;

      if (data) {
        // Refresh the donations list
        await fetchAvailableDonations();
        
        toast({
          title: "Donation Reserved",
          description: "You have successfully reserved this donation. Please arrange for pickup.",
        });
      } else {
        toast({
          title: "Reservation Failed",
          description: "This donation may no longer be available.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error reserving donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to reserve donation. ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setReservingDonation(null);
      setReservationLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NGO Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.organization_name || profile?.full_name || 'Partner'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={fetchAvailableDonations}>
            <Search className="h-4 w-4" />
            Browse Donations
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Tabs for Available Donations and My Reservations */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available Donations</TabsTrigger>
          <TabsTrigger value="reservations">My Reservations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Donations</CardTitle>
              <CardDescription>Browse and reserve available food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <DonationTable 
                donations={donations} 
                loading={loading} 
                reservingDonation={reservingDonation}
                onReserve={openReservationConfirm}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>My Reservations</CardTitle>
              <CardDescription>Manage your reserved food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <MyReservations />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reservation Confirmation Dialog */}
      <ReservationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedDonation={selectedDonation}
        reservationLoading={reservationLoading}
        onConfirm={handleReserveDonation}
      />
    </div>
  );
};

export default NgoDashboard;
