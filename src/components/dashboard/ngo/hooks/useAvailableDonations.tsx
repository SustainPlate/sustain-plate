
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
      return false;
    }

    try {
      setReservingDonation(donationId);
      setReservationLoading(true);
      
      console.log(`Attempting to reserve donation ${donationId} for NGO ${user.id}`);

      // First check if donation is still available
      const { data: donationCheck, error: checkError } = await supabase
        .from('donations')
        .select('status')
        .eq('id', donationId)
        .single();

      if (checkError) {
        console.error('Error checking donation status:', checkError);
        throw new Error('Failed to verify donation availability');
      }

      if (!donationCheck || donationCheck.status !== 'available') {
        throw new Error('This donation is no longer available for reservation');
      }

      // Call our edge function to handle the reservation
      console.log('Calling edge function for reservation');
      const { data, error } = await supabase.functions.invoke('fix-reserve-donation', {
        body: { 
          donation_id: donationId,
          ngo_id: user.id 
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message || "Reservation failed");
      }

      console.log('Edge function response:', data);
      
      if (!data?.success) {
        throw new Error(data?.message || "This donation may no longer be available.");
      }
      
      // Refresh the donations list
      await refetch();
      
      toast({
        title: "Donation Reserved",
        description: "You have successfully reserved this donation. Please arrange for pickup.",
      });
      
      return true;
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
