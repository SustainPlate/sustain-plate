
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ReservedDonation } from '../types/ReservationTypes';

export const useReservations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cancellingDonation, setCancellingDonation] = useState<string | null>(null);
  
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

  const handleCancelReservation = async (donationId: string) => {
    if (!user) return;
    
    try {
      setCancellingDonation(donationId);
      
      // Update the donation to available again
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
    }
  };
  
  return {
    reservedDonations,
    isLoading,
    cancellingDonation,
    setCancellingDonation,
    handleCancelReservation,
  };
};
