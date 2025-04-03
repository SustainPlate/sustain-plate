
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';
import StatsCards from './ngo/StatsCards';
import DonationTable from './ngo/DonationTable';
import ReservationDialog from './ngo/ReservationDialog';
import MyReservations from './ngo/MyReservations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAvailableDonations } from './ngo/hooks/useAvailableDonations';
import type { Donation } from './ngo/types/DonationTypes';

const NgoDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  
  const {
    donations,
    isLoading,
    reservingDonation,
    reservationLoading,
    handleReserveDonation,
    refetchDonations
  } = useAvailableDonations();

  const openReservationConfirm = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowConfirmDialog(true);
  };

  const confirmReservation = async (donationId: string) => {
    await handleReserveDonation(donationId);
    setShowConfirmDialog(false);
  };

  // Calculate stats based on current donations data
  const stats = {
    available: donations?.length || 0,
    reserved: 0,  // This would need to be fetched separately
    completed: 0  // This would need to be fetched separately
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
          <Button variant="outline" className="gap-2" onClick={refetchDonations}>
            <Search className="h-4 w-4" />
            Browse Donations
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={isLoading} />

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
                donations={donations || []} 
                loading={isLoading} 
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
        onConfirm={confirmReservation}
      />
    </div>
  );
};

export default NgoDashboard;
