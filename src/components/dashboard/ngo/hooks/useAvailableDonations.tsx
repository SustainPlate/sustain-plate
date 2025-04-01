
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Donation } from '../DonationTable';

export const useAvailableDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservingDonation, setReservingDonation] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);
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
      
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
        return;
      }

      // Direct update of status to avoid constraint violation
      const { error } = await supabase.rpc('update_donation_status', {
        donation_id: donationId,
        new_status: 'pending',
        user_id: user.id
      });

      if (error) {
        console.error('Reservation error:', error);
        throw new Error(`Failed to reserve donation: ${error.message}`);
      }

      const { data: donationInfo } = await supabase
        .from('donations')
        .select('donor_id, food_name')
        .eq('id', donationId)
        .single();
        
      if (donationInfo) {
        await supabase.from('notifications').insert({
          user_id: donationInfo.donor_id,
          title: 'Donation Reserved',
          message: `Your donation "${donationInfo.food_name}" has been reserved by an NGO.`,
          related_to: 'donation',
          related_id: donationId
        });
      }
      
      await fetchAvailableDonations();
      
      toast({
        title: "Donation Reserved",
        description: "You have successfully reserved this donation. Please arrange for pickup.",
      });
    } catch (error: any) {
      console.error('Error reserving donation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reserve donation',
        variant: 'destructive',
      });
    } finally {
      setReservingDonation(null);
      setReservationLoading(false);
    }
  };

  return {
    donations,
    loading,
    stats,
    reservingDonation,
    setReservingDonation,
    reservationLoading,
    setReservationLoading,
    fetchAvailableDonations,
    handleReserveDonation
  };
};
