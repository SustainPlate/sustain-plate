
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Donation } from '../types/DonationTypes';

export const useAvailableDonations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reservingDonation, setReservingDonation] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  
  const {
    data: donations,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['availableDonations'],
    queryFn: fetchAvailableDonations,
  });

  async function fetchAvailableDonations(): Promise<Donation[]> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Donation[];
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donations. ' + error.message,
        variant: 'destructive',
      });
      return [];
    }
  }

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

      // Call our edge function to handle the reservation
      const response = await supabase.functions.invoke('fix-reserve-donation', {
        body: { 
          donation_id: donationId,
          ngo_id: user.id 
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Reservation failed");
      }

      const data = response.data;

      if (data?.success) {
        // Refresh the donations list
        await refetch();
        
        toast({
          title: "Donation Reserved",
          description: "You have successfully reserved this donation. Please arrange for pickup.",
        });
        return true;
      } else {
        throw new Error(data?.message || "This donation may no longer be available.");
      }
    } catch (error: any) {
      console.error('Error reserving donation:', error);
      toast({
        title: 'Error',
        description: 'Failed to reserve donation. ' + error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setReservingDonation(null);
      setReservationLoading(false);
    }
  };

  return {
    donations,
    isLoading,
    reservingDonation,
    reservationLoading,
    handleReserveDonation,
    refetchDonations: refetch,
  };
};
