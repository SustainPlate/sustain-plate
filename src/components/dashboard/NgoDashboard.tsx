
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Search, Loader2, Calendar, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Available Donations</CardTitle>
            <CardDescription>Donations ready to be claimed</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats.available}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reserved Items</CardTitle>
            <CardDescription>Donations you've reserved</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats.reserved}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Donations</CardTitle>
            <CardDescription>Successfully received items</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats.completed}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Donations</CardTitle>
          <CardDescription>Browse and reserve available food donations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : donations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Pickup Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.food_name}</TableCell>
                      <TableCell>
                        {donation.quantity} {donation.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          {formatDate(donation.expiry_date)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={donation.pickup_address}>
                        {donation.pickup_address}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openReservationConfirm(donation)}
                          disabled={reservingDonation === donation.id}
                        >
                          {reservingDonation === donation.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Reserving...
                            </>
                          ) : (
                            'Reserve'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No donations available</h3>
              <p className="text-sm text-gray-500 mt-1">
                There are currently no food donations available. Please check back later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDonation && (
                <>
                  <p>
                    Are you sure you want to reserve {selectedDonation.quantity} {selectedDonation.unit} of {selectedDonation.food_name}?
                  </p>
                  <p className="mt-2">
                    By reserving this donation, you commit to arranging pickup from the specified address.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reservationLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedDonation && handleReserveDonation(selectedDonation.id)}
              disabled={reservationLoading}
            >
              {reservationLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reserving...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NgoDashboard;
