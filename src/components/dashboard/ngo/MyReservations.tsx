
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ReservedDonation = {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  status: string;
  pickup_address: string;
  reserved_at: string;
};

const MyReservations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cancellingDonation, setCancellingDonation] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<ReservedDonation | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Fetch reserved donations
  const { data: reservedDonations, isLoading, refetch } = useQuery({
    queryKey: ['reservedDonations'],
    queryFn: async () => {
      if (!user) return [];
      
      // Get all donations reserved by this NGO
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('reserved_by', user.id)
        .in('status', ['pending', 'in_transit'])
        .order('reserved_at', { ascending: false });
        
      if (error) throw error;
      return data as ReservedDonation[];
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleCancelReservation = async (donationId: string) => {
    if (!user) return;
    
    try {
      setCancellingDonation(donationId);
      
      // Update the donation to available again - using direct SQL approach to avoid constraints
      const { error } = await supabase
        .from('donations')
        .update({
          status: 'available',
          reserved_by: null,
          reserved_at: null,
        })
        .eq('id', donationId);

      if (error) {
        console.error('Error cancelling reservation with regular update:', error);
        throw error;
      }
      
      toast({
        title: "Reservation Cancelled",
        description: "The donation has been returned to the available pool.",
      });
      
      // Refetch the data
      refetch();
    } catch (error: any) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel reservation: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setCancellingDonation(null);
      setShowConfirmDialog(false);
    }
  };

  const openCancelConfirm = (donation: ReservedDonation) => {
    setSelectedDonation(donation);
    setShowConfirmDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Pickup</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-500">In Transit</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reservedDonations || reservedDonations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't reserved any donations yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reserved On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservedDonations.map((donation) => (
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
                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                <TableCell>{donation.reserved_at ? formatDate(donation.reserved_at) : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog open={showConfirmDialog && selectedDonation?.id === donation.id} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openCancelConfirm(donation)}
                      >
                        <X className="h-4 w-4 text-red-500 mr-2" />
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel your reservation for "{donation.food_name}"? 
                          This will make the donation available to other NGOs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelReservation(donation.id)}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={cancellingDonation === donation.id}
                        >
                          {cancellingDonation === donation.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Cancel Reservation"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyReservations;
