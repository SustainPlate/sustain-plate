
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MapView from '@/components/map/MapView';
import DonationMapStats from '@/components/map/DonationMapStats';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface DonationLocation {
  id: string;
  locationType: 'pickup' | 'delivery';
  address: string;
  foodName?: string;
  status: string;
  timestamp: string;
}

const DonationMap: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [donationLocations, setDonationLocations] = useState<DonationLocation[]>([]);

  useEffect(() => {
    async function fetchDonationLocations() {
      try {
        setLoading(true);
        
        // Fetch all donations
        const { data: donations, error: donationsError } = await supabase
          .from('donations')
          .select('id, food_name, pickup_address, status, created_at');
        
        if (donationsError) throw donationsError;
        
        // Fetch deliveries to get delivery addresses
        const { data: deliveries, error: deliveriesError } = await supabase
          .from('deliveries')
          .select('id, donation_id, status, delivery_time');
          
        if (deliveriesError) throw deliveriesError;
        
        // Convert donations to location points
        const pickupLocations: DonationLocation[] = donations.map(donation => ({
          id: `pickup-${donation.id}`,
          locationType: 'pickup',
          address: donation.pickup_address,
          foodName: donation.food_name,
          status: donation.status,
          timestamp: donation.created_at
        }));
        
        // We would need to join with some requests data to get delivery addresses
        // For now, we'll just use a placeholder
        const deliveryLocations: DonationLocation[] = deliveries.map(delivery => ({
          id: `delivery-${delivery.id}`,
          locationType: 'delivery',
          address: "Delivery location", // In a real implementation, we'd look up the delivery address
          status: delivery.status,
          timestamp: delivery.delivery_time || new Date().toISOString()
        }));
        
        setDonationLocations([...pickupLocations, ...deliveryLocations]);
      } catch (error) {
        console.error('Error fetching donation locations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDonationLocations();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-center mb-8">Donation Tracking Map</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Live Donation Map</CardTitle>
              <CardDescription>
                Track donations and deliveries across our network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-md overflow-hidden border">
                <MapView locations={donationLocations} />
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <DonationMapStats donationLocations={donationLocations} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonationMap;
