
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import StatsCards from './StatsCards';
import DonationTable from './DonationTable';
import ReservationDialog from './ReservationDialog';
import MyReservations from './MyReservations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAvailableDonations } from './hooks/useAvailableDonations';
import { Donation } from './DonationTable';

const NgoDashboardContent: React.FC = () => {
  const { profile } = useAuth();
  const { 
    donations, 
    loading, 
    stats, 
    reservingDonation, 
    setReservingDonation,
    reservationLoading,
    setReservationLoading,
    fetchAvailableDonations,
    handleReserveDonation
  } = useAvailableDonations();
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const openReservationConfirm = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowConfirmDialog(true);
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
      </div>

      <StatsCards stats={stats} loading={loading} />

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
                donations={donations} 
                loading={loading} 
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

      <ReservationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedDonation={selectedDonation}
        reservationLoading={reservationLoading}
        onConfirm={(donationId) => {
          handleReserveDonation(donationId);
          setReservingDonation(donationId);
          setReservationLoading(true);
        }}
      />
    </div>
  );
};

export default NgoDashboardContent;
