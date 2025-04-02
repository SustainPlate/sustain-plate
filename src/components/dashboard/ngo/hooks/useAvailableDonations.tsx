
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Donation } from '../types/DonationTypes';

export const useAvailableDonations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [reservingDonation, setReservingDonation] = useState<string | null>(null);
  const [stats, setStats] = useState({
    available: 0,
    reserved: 0,
    completed: 0
  });

  // Fetch donations with React Query
  const { data: donations = [], refetch } = useQuery({
    queryKey: ['availableDonations'],
    queryFn: fetchAvailableDonations,
  });

  // Function to fetch available donations
  async function fetchAvailableDonations() {
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
      
      // Process stats with individual counts
      setStats({
        available: availableCountQuery.count || 0,
        reserved: pendingCountQuery.count || 0,
        completed: completedCountQuery.count || 0
      });

      return data as Donation[];
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donations. ' + error.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to reserve a donation
  const reserveDonation = async (donationId: string) => {
    if (!donationId) return false;

    try {
      setReservingDonation(donationId);

      // First check the donation status to make sure it's still available
      const { data: donationData, error: donationError } = await supabase
        .from('donations')
        .select('status')
        .eq('id', donationId)
        .single();

      if (donationError) throw donationError;
      
      if (donationData.status !== 'available') {
        toast({
          title: "Donation Unavailable",
          description: "This donation is no longer available for reservation.",
          variant: "destructive",
        });
        return false;
      }

      // Call the Supabase function to reserve the donation
      const { data, error } = await supabase.rpc('reserve_donation', {
        donation_id: donationId,
        ngo_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      if (data) {
        // Refresh the donations list
        await refetch();
        
        toast({
          title: "Donation Reserved",
          description: "You have successfully reserved this donation. Please arrange for pickup.",
        });
        return true;
      } else {
        toast({
          title: "Reservation Failed",
          description: "This donation may no longer be available.",
          variant: "destructive",
        });
        return false;
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
    }
  };

  return {
    donations,
    loading,
    stats,
    reservingDonation,
    reserveDonation,
    refetchDonations: refetch
  };
};

export default useAvailableDonations;
