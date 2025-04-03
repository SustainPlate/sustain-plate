
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
  const [reservationError, setReservationError] = useState<string | null>(null);
  
  const {
    data: donations,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['availableDonations'],
    queryFn: fetchAvailableDonations,
    refetchOnWindowFocus: false,
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
      const errorMsg = "Authentication required to reserve donations.";
      setReservationError(errorMsg);
      toast({
        title: "Authentication Required",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }

    try {
      setReservingDonation(donationId);
      setReservationLoading(true);
      setReservationError(null);
      
      console.log(`Attempting to reserve donation ${donationId} for NGO ${user.id}`);

      // First check if donation is still available
      const { data: donationCheck, error: checkError } = await supabase
        .from('donations')
        .select('status, food_name')
        .eq('id', donationId)
        .single();

      if (checkError) {
        console.error('Error checking donation status:', checkError);
        throw new Error('Failed to verify donation availability');
      }

      if (!donationCheck || donationCheck.status !== 'available') {
        throw new Error(`This donation (${donationCheck?.food_name || 'Unknown'}) is no longer available for reservation`);
      }

      // Call our edge function with retry logic
      let attempts = 0;
      const maxAttempts = 2;
      let success = false;
      let lastError = null;
      
      while (attempts < maxAttempts && !success) {
        attempts++;
        console.log(`Reservation attempt ${attempts} of ${maxAttempts}`);
        
        try {
          const { data, error } = await supabase.functions.invoke('fix-reserve-donation', {
            body: { 
              donation_id: donationId,
              ngo_id: user.id 
            }
          });

          if (error) {
            console.error(`Function error (attempt ${attempts}):`, error);
            lastError = error;
            // Wait briefly before retrying
            if (attempts < maxAttempts) await new Promise(r => setTimeout(r, 1000));
            continue;
          }

          console.log('Edge function response:', data);
          
          if (!data?.success) {
            lastError = new Error(data?.message || "Reservation failed with unknown error");
            if (attempts < maxAttempts) await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          
          success = true;
        } catch (error) {
          console.error(`Unexpected error during attempt ${attempts}:`, error);
          lastError = error;
          if (attempts < maxAttempts) await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!success) {
        throw lastError || new Error("Failed to reserve donation after multiple attempts");
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
      const errorMessage = error.message || 'An unexpected error occurred';
      setReservationError(errorMessage);
      
      toast({
        title: 'Reservation Failed',
        description: 'Failed to reserve donation. ' + errorMessage,
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
    isRefetching,
    reservingDonation,
    reservationLoading,
    reservationError,
    handleReserveDonation,
    refetchDonations: refetch,
  };
};
